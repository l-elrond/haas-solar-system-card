import { LitElement } from 'lit';
import { HomeAssistant, SolarSystemCardConfig } from './types';
export declare class SolarSystemCardEditor extends LitElement {
    hass?: HomeAssistant;
    private _config?;
    setConfig(config: SolarSystemCardConfig): void;
    private _valueChanged;
    private _togglePlanet;
    protected render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'solar-system-card-editor': SolarSystemCardEditor;
    }
}
//# sourceMappingURL=solar-system-card-editor.d.ts.map