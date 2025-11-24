import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, SolarSystemCardConfig } from './types';
import { AstronomyCalculator } from './astronomy-calculator';
import { SolarSystemRenderer } from './solar-system-renderer';
import { DEFAULT_PLANETS, PLANET_CONFIGS } from './planet-config';
import './solar-system-card-editor';

@customElement('solar-system-card')
export class SolarSystemCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: SolarSystemCardConfig;
  @state() private currentDate: Date = new Date();

  private calculator: AstronomyCalculator;
  private renderer?: SolarSystemRenderer;
  private updateInterval?: number;
  private animationSpeed: number = 1;
  private isPlaying: boolean = true;
  private AU_SCALE: number = 10; // 1 AU = 10 units in scene

  constructor() {
    super();
    this.calculator = new AstronomyCalculator();
  }

  static getStubConfig(): SolarSystemCardConfig {
    return {
      type: 'custom:solar-system-card',
      title: 'Solar System',
      update_interval: 1000,
      animation_speed: 1,
      show_orbits: true,
      show_labels: true,
      camera_distance: 80,
      planets: DEFAULT_PLANETS,
    };
  }

  public setConfig(config: SolarSystemCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this._config = {
      title: 'Solar System',
      update_interval: 1000,
      animation_speed: 1,
      show_orbits: true,
      show_labels: true,
      camera_distance: 80,
      planets: DEFAULT_PLANETS,
      ...config,
    };

    this.animationSpeed = this._config.animation_speed || 1;
  }

  public getCardSize(): number {
    return 6;
  }

  public static async getConfigElement() {
    return document.createElement('solar-system-card-editor');
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.initializeSolarSystem();
  }

  private initializeSolarSystem(): void {
    const container = this.shadowRoot?.getElementById('solar-system-container');
    if (!container) return;

    // Create renderer
    this.renderer = new SolarSystemRenderer(
      container,
      this._config?.camera_distance || 80
    );

    // Configure renderer
    this.renderer.setShowOrbits(this._config?.show_orbits ?? true);
    this.renderer.setShowLabels(this._config?.show_labels ?? true);

    // Create planets
    const planets = this._config?.planets || DEFAULT_PLANETS;
    planets.forEach((planet) => {
      this.renderer?.createPlanet(planet);
      this.createOrbitPath(planet);
    });

    // Start rendering
    this.renderer.startAnimation();

    // Start position updates
    this.startUpdates();
  }

  private createOrbitPath(planetName: string): void {
    if (!this._config?.show_orbits) return;

    // Calculate orbital path by sampling positions over one complete orbit
    const numSamples = 100;
    const positions = [];
    const period = this.calculator.getOrbitalPeriod(planetName);

    const baseDate = new Date();
    for (let i = 0; i <= numSamples; i++) {
      const t = (i / numSamples) * period;
      const sampleDate = new Date(baseDate.getTime() + t * 24 * 60 * 60 * 1000);
      const position = this.calculator.getPlanetPosition(planetName, sampleDate);
      positions.push({
        x: position.x * this.AU_SCALE,
        y: position.y * this.AU_SCALE,
        z: position.z * this.AU_SCALE,
      });
    }

    this.renderer?.createOrbit(planetName, positions);
  }

  private startUpdates(): void {
    const update = () => {
      if (this.isPlaying) {
        // Advance time based on animation speed
        // 1 = real-time, 10 = 10x speed, etc.
        const timeIncrement = (this._config?.update_interval || 1000) * this.animationSpeed;
        this.currentDate = new Date(this.currentDate.getTime() + timeIncrement);

        this.updatePlanetPositions();
      }

      this.updateInterval = window.setTimeout(update, this._config?.update_interval || 1000);
    };

    update();
  }

  private updatePlanetPositions(): void {
    if (!this.renderer) return;

    const planets = this._config?.planets || DEFAULT_PLANETS;
    const date = this._config?.date_source === 'current' || !this._config?.date_source
      ? new Date()
      : this.currentDate;

    planets.forEach((planet) => {
      const position = this.calculator.getPlanetPosition(planet, date);
      this.renderer?.updatePlanetPosition(planet, position, this.AU_SCALE);
    });

    this.requestUpdate();
  }

  private togglePlayPause(): void {
    this.isPlaying = !this.isPlaying;
    this.requestUpdate();
  }

  private resetDate(): void {
    this.currentDate = new Date();
    this.updatePlanetPositions();
  }

  private changeSpeed(delta: number): void {
    this.animationSpeed = Math.max(0.1, Math.min(1000, this.animationSpeed * delta));
    this.requestUpdate();
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatSpeed(speed: number): string {
    if (speed < 1) {
      return `${speed.toFixed(2)}x`;
    } else if (speed < 100) {
      return `${speed.toFixed(1)}x`;
    } else {
      return `${Math.round(speed)}x`;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.updateInterval) {
      clearTimeout(this.updateInterval);
    }
    this.renderer?.dispose();
  }

  protected render() {
    if (!this._config) {
      return html``;
    }

    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          <div id="solar-system-container"></div>
          <div class="controls">
            <div class="control-group">
              <button @click=${this.togglePlayPause} class="control-button">
                ${this.isPlaying ? '⏸️' : '▶️'}
              </button>
              <button @click=${this.resetDate} class="control-button" title="Reset to current date">
                🔄
              </button>
              <button @click=${() => this.changeSpeed(0.5)} class="control-button" title="Slow down">
                ⏪
              </button>
              <button @click=${() => this.changeSpeed(2)} class="control-button" title="Speed up">
                ⏩
              </button>
            </div>
            <div class="info">
              <span class="date">${this.formatDate(this.currentDate)}</span>
              <span class="speed">Speed: ${this.formatSpeed(this.animationSpeed)}</span>
            </div>
          </div>
          <div class="help-text">
            💡 Drag to rotate • Scroll to zoom
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card-content {
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
      }

      #solar-system-container {
        width: 100%;
        height: 500px;
        background: #000000;
        position: relative;
        flex: 1;
      }

      .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--card-background-color, #fff);
        border-top: 1px solid var(--divider-color, #e0e0e0);
        gap: 16px;
      }

      .control-group {
        display: flex;
        gap: 8px;
      }

      .control-button {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        border: none;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.2s;
        min-width: 40px;
      }

      .control-button:hover {
        background: var(--primary-color-dark, #0288d1);
      }

      .control-button:active {
        transform: scale(0.95);
      }

      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        font-size: 12px;
        color: var(--primary-text-color, #333);
      }

      .date {
        font-weight: 500;
      }

      .speed {
        color: var(--secondary-text-color, #666);
      }

      .help-text {
        position: absolute;
        bottom: 60px;
        right: 16px;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        pointer-events: none;
      }

      @media (max-width: 600px) {
        #solar-system-container {
          height: 400px;
        }

        .controls {
          flex-direction: column;
          align-items: stretch;
        }

        .info {
          align-items: flex-start;
        }
      }
    `;
  }
}

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'solar-system-card',
  name: 'Solar System Card',
  description: 'An animated 3D solar system with accurate planetary positions',
  preview: true,
  documentationURL: 'https://github.com/yourusername/solar-system-card',
});

console.info(
  `%c SOLAR-SYSTEM-CARD %c v1.0.0 `,
  'color: white; background: #03a9f4; font-weight: bold;',
  'color: #03a9f4; background: white; font-weight: bold;'
);
