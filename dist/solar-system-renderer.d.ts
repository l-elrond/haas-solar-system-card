export declare class SolarSystemRenderer {
    private scene;
    private camera;
    private renderer;
    private planets;
    private orbits;
    private labels;
    private container;
    private animationId;
    private cameraDistance;
    private cameraAngle;
    private isDragging;
    private previousMouseX;
    private previousMouseY;
    private cameraVerticalAngle;
    private showOrbits;
    private showLabels;
    constructor(container: HTMLElement, cameraDistance?: number);
    private setupScene;
    private createStarField;
    createPlanet(planetName: string): void;
    private createLabel;
    createOrbit(planetName: string, positions: {
        x: number;
        y: number;
        z: number;
    }[]): void;
    updatePlanetPosition(planetName: string, position: {
        x: number;
        y: number;
        z: number;
    }, scale?: number): void;
    private updateLabelPosition;
    private setupControls;
    private updateCameraPosition;
    private handleResize;
    setShowOrbits(show: boolean): void;
    setShowLabels(show: boolean): void;
    setCameraDistance(distance: number): void;
    render(): void;
    startAnimation(): void;
    stopAnimation(): void;
    dispose(): void;
}
//# sourceMappingURL=solar-system-renderer.d.ts.map