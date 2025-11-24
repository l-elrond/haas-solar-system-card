import * as THREE from 'three';
import { PlanetData } from './types';
import { PLANET_CONFIGS } from './planet-config';

export class SolarSystemRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private planets: Map<string, THREE.Mesh>;
  private orbits: Map<string, THREE.Line>;
  private labels: Map<string, HTMLDivElement>;
  private container: HTMLElement;
  private animationId: number | null = null;
  private cameraDistance: number = 80;
  private cameraAngle: number = 0;
  private isDragging: boolean = false;
  private previousMouseX: number = 0;
  private previousMouseY: number = 0;
  private cameraVerticalAngle: number = Math.PI / 6;
  private showOrbits: boolean = true;
  private showLabels: boolean = true;

  constructor(container: HTMLElement, cameraDistance: number = 80) {
    this.container = container;
    this.cameraDistance = cameraDistance;
    this.planets = new Map();
    this.orbits = new Map();
    this.labels = new Map();

    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    this.updateCameraPosition();

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Setup scene
    this.setupScene();

    // Add mouse controls
    this.setupControls();

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupScene(): void {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    this.scene.add(ambientLight);

    // Add point light at sun position
    const sunLight = new THREE.PointLight(0xffffff, 2, 0);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xfdb813,
      emissive: 0xfdb813,
      emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.scene.add(sun);

    // Add sun glow effect
    const glowGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xfdb813,
      transparent: true,
      opacity: 0.3,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(glow);

    // Add stars background
    this.createStarField();
  }

  private createStarField(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      sizeAttenuation: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }

  createPlanet(planetName: string): void {
    const config = PLANET_CONFIGS[planetName];
    if (!config) {
      console.warn(`Unknown planet: ${planetName}`);
      return;
    }

    // Create planet mesh
    const geometry = new THREE.SphereGeometry(config.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: config.color,
      shininess: 5,
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.name = planetName;

    this.planets.set(planetName, planet);
    this.scene.add(planet);

    // Create label
    if (this.showLabels) {
      this.createLabel(planetName, config.displayName);
    }
  }

  private createLabel(planetName: string, displayName: string): void {
    const label = document.createElement('div');
    label.className = 'planet-label';
    label.textContent = displayName;
    label.style.position = 'absolute';
    label.style.color = '#ffffff';
    label.style.fontSize = '12px';
    label.style.fontFamily = 'Arial, sans-serif';
    label.style.pointerEvents = 'none';
    label.style.userSelect = 'none';
    label.style.textShadow = '0 0 3px #000000';
    label.style.display = 'none';

    this.container.appendChild(label);
    this.labels.set(planetName, label);
  }

  createOrbit(planetName: string, positions: { x: number; y: number; z: number }[]): void {
    if (!this.showOrbits) return;

    const config = PLANET_CONFIGS[planetName];
    if (!config) return;

    // Remove existing orbit if any
    const existingOrbit = this.orbits.get(planetName);
    if (existingOrbit) {
      this.scene.remove(existingOrbit);
    }

    // Create orbit line from positions
    const points = positions.map(
      (pos) => new THREE.Vector3(pos.x, pos.z, pos.y)
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: config.orbitColor,
      transparent: true,
      opacity: 0.3,
    });

    const orbit = new THREE.Line(geometry, material);
    this.orbits.set(planetName, orbit);
    this.scene.add(orbit);
  }

  updatePlanetPosition(
    planetName: string,
    position: { x: number; y: number; z: number },
    scale: number = 10
  ): void {
    const planet = this.planets.get(planetName);
    if (!planet) return;

    // Convert astronomical units to scene coordinates
    // Y and Z are swapped to orient the solar system correctly
    planet.position.set(
      position.x * scale,
      position.z * scale,
      position.y * scale
    );

    // Update label position
    this.updateLabelPosition(planetName);
  }

  private updateLabelPosition(planetName: string): void {
    if (!this.showLabels) return;

    const planet = this.planets.get(planetName);
    const label = this.labels.get(planetName);
    if (!planet || !label) return;

    // Project 3D position to 2D screen coordinates
    const vector = planet.position.clone();
    vector.project(this.camera);

    const x = (vector.x * 0.5 + 0.5) * this.container.clientWidth;
    const y = (vector.y * -0.5 + 0.5) * this.container.clientHeight;

    // Check if planet is in front of camera
    if (vector.z < 1) {
      label.style.display = 'block';
      label.style.left = `${x}px`;
      label.style.top = `${y - 20}px`;
    } else {
      label.style.display = 'none';
    }
  }

  private setupControls(): void {
    const canvas = this.renderer.domElement;

    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
      canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMouseX;
      const deltaY = e.clientY - this.previousMouseY;

      this.cameraAngle += deltaX * 0.005;
      this.cameraVerticalAngle = Math.max(
        -Math.PI / 2.5,
        Math.min(Math.PI / 2.5, this.cameraVerticalAngle - deltaY * 0.005)
      );

      this.updateCameraPosition();

      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(
        20,
        Math.min(300, this.cameraDistance + e.deltaY * 0.05)
      );
      this.updateCameraPosition();
    });

    canvas.style.cursor = 'grab';
  }

  private updateCameraPosition(): void {
    const x = Math.cos(this.cameraAngle) * Math.cos(this.cameraVerticalAngle) * this.cameraDistance;
    const y = Math.sin(this.cameraVerticalAngle) * this.cameraDistance;
    const z = Math.sin(this.cameraAngle) * Math.cos(this.cameraVerticalAngle) * this.cameraDistance;

    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }

  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  setShowOrbits(show: boolean): void {
    this.showOrbits = show;
    this.orbits.forEach((orbit) => {
      orbit.visible = show;
    });
  }

  setShowLabels(show: boolean): void {
    this.showLabels = show;
    this.labels.forEach((label) => {
      label.style.display = show ? 'block' : 'none';
    });
  }

  setCameraDistance(distance: number): void {
    this.cameraDistance = distance;
    this.updateCameraPosition();
  }

  render(): void {
    // Update all label positions
    this.labels.forEach((_, planetName) => {
      this.updateLabelPosition(planetName);
    });

    this.renderer.render(this.scene, this.camera);
  }

  startAnimation(): void {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.render();
    };
    animate();
  }

  stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  dispose(): void {
    this.stopAnimation();

    // Dispose geometries and materials
    this.planets.forEach((planet) => {
      planet.geometry.dispose();
      (planet.material as THREE.Material).dispose();
    });

    this.orbits.forEach((orbit) => {
      orbit.geometry.dispose();
      (orbit.material as THREE.Material).dispose();
    });

    // Remove labels
    this.labels.forEach((label) => {
      label.remove();
    });

    // Remove renderer
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}
