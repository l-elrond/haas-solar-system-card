import { LitElement, PropertyValues } from 'lit';
import { HomeAssistant, SolarSystemCardConfig } from './types';
import './solar-system-card-editor';
export declare class SolarSystemCard extends LitElement {
    hass?: HomeAssistant;
    private _config?;
    private currentDate;
    private calculator;
    private renderer?;
    private updateInterval?;
    private animationSpeed;
    private isPlaying;
    private AU_SCALE;
    constructor();
    static getStubConfig(): SolarSystemCardConfig;
    setConfig(config: SolarSystemCardConfig): void;
    getCardSize(): number;
    static getConfigElement(): Promise<import("./solar-system-card-editor").SolarSystemCardEditor>;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    private initializeSolarSystem;
    private createOrbitPath;
    private startUpdates;
    private updatePlanetPositions;
    private togglePlayPause;
    private resetDate;
    private changeSpeed;
    private formatDate;
    private formatSpeed;
    disconnectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
}
//# sourceMappingURL=solar-system-card.d.ts.map