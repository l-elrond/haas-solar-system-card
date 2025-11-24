import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, SolarSystemCardConfig } from './types';
import { DEFAULT_PLANETS, PLANET_CONFIGS } from './planet-config';

@customElement('solar-system-card-editor')
export class SolarSystemCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: SolarSystemCardConfig;

  public setConfig(config: SolarSystemCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target as any;
    const configValue = target.configValue;
    const value = target.value;

    if (this._config[configValue] === value) {
      return;
    }

    const newConfig = {
      ...this._config,
    };

    if (configValue) {
      if (target.type === 'checkbox') {
        newConfig[configValue] = target.checked;
      } else if (target.type === 'number') {
        newConfig[configValue] = Number(value);
      } else {
        newConfig[configValue] = value;
      }
    }

    const messageEvent = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(messageEvent);
  }

  private _togglePlanet(planetName: string): void {
    if (!this._config) return;

    const currentPlanets = this._config.planets || DEFAULT_PLANETS;
    const newPlanets = currentPlanets.includes(planetName)
      ? currentPlanets.filter((p) => p !== planetName)
      : [...currentPlanets, planetName];

    const newConfig = {
      ...this._config,
      planets: newPlanets,
    };

    const messageEvent = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(messageEvent);
  }

  protected render() {
    if (!this._config) {
      return html``;
    }

    const selectedPlanets = this._config.planets || DEFAULT_PLANETS;

    return html`
      <div class="card-config">
        <div class="config-section">
          <h3>General Settings</h3>

          <div class="config-row">
            <label>Title</label>
            <input
              type="text"
              .value=${this._config.title || 'Solar System'}
              .configValue=${'title'}
              @input=${this._valueChanged}
            />
          </div>

          <div class="config-row">
            <label>Update Interval (ms)</label>
            <input
              type="number"
              .value=${this._config.update_interval || 1000}
              .configValue=${'update_interval'}
              @input=${this._valueChanged}
              min="100"
              step="100"
            />
            <span class="hint">How often to update positions (milliseconds)</span>
          </div>

          <div class="config-row">
            <label>Animation Speed</label>
            <input
              type="number"
              .value=${this._config.animation_speed || 1}
              .configValue=${'animation_speed'}
              @input=${this._valueChanged}
              min="0.1"
              step="0.1"
            />
            <span class="hint">Time multiplier (1 = real-time, 10 = 10x speed)</span>
          </div>

          <div class="config-row">
            <label>Camera Distance</label>
            <input
              type="number"
              .value=${this._config.camera_distance || 80}
              .configValue=${'camera_distance'}
              @input=${this._valueChanged}
              min="20"
              max="300"
              step="10"
            />
            <span class="hint">Initial zoom level (20-300)</span>
          </div>
        </div>

        <div class="config-section">
          <h3>Display Options</h3>

          <div class="config-row checkbox-row">
            <label>
              <input
                type="checkbox"
                .checked=${this._config.show_orbits ?? true}
                .configValue=${'show_orbits'}
                @change=${this._valueChanged}
              />
              Show Orbital Paths
            </label>
          </div>

          <div class="config-row checkbox-row">
            <label>
              <input
                type="checkbox"
                .checked=${this._config.show_labels ?? true}
                .configValue=${'show_labels'}
                @change=${this._valueChanged}
              />
              Show Planet Labels
            </label>
          </div>
        </div>

        <div class="config-section">
          <h3>Planets</h3>
          <p class="section-description">Select which planets to display</p>

          <div class="planet-grid">
            ${Object.entries(PLANET_CONFIGS).map(
              ([planetName, config]) => html`
                <div class="planet-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      .checked=${selectedPlanets.includes(planetName)}
                      @change=${() => this._togglePlanet(planetName)}
                    />
                    <span class="planet-name">${config.displayName}</span>
                  </label>
                </div>
              `
            )}
          </div>
        </div>

        <div class="config-section">
          <h3>About</h3>
          <p class="about-text">
            This card uses the <strong>astronomy-engine</strong> library to calculate
            accurate planetary positions with ±1 arcminute precision. Positions are
            based on VSOP87 models.
          </p>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        padding: 16px;
      }

      .config-section {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .config-section:last-child {
        border-bottom: none;
      }

      h3 {
        margin: 0 0 16px 0;
        color: var(--primary-text-color, #333);
        font-size: 16px;
        font-weight: 500;
      }

      .section-description {
        margin: 0 0 12px 0;
        color: var(--secondary-text-color, #666);
        font-size: 13px;
      }

      .config-row {
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .config-row label {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color, #333);
      }

      .config-row input[type='text'],
      .config-row input[type='number'] {
        padding: 8px 12px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        font-size: 14px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #333);
      }

      .config-row input[type='text']:focus,
      .config-row input[type='number']:focus {
        outline: none;
        border-color: var(--primary-color, #03a9f4);
      }

      .hint {
        font-size: 12px;
        color: var(--secondary-text-color, #666);
        font-style: italic;
      }

      .checkbox-row {
        flex-direction: row;
        align-items: center;
      }

      .checkbox-row label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .checkbox-row input[type='checkbox'] {
        cursor: pointer;
      }

      .planet-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
      }

      .planet-checkbox label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.2s;
      }

      .planet-checkbox label:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }

      .planet-checkbox input[type='checkbox'] {
        cursor: pointer;
      }

      .planet-name {
        font-size: 14px;
      }

      .about-text {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: var(--secondary-text-color, #666);
      }

      @media (max-width: 600px) {
        .planet-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'solar-system-card-editor': SolarSystemCardEditor;
  }
}
