export interface SolarSystemCardConfig {
    type: string;
    title?: string;
    update_interval?: number;
    animation_speed?: number;
    show_orbits?: boolean;
    show_labels?: boolean;
    camera_distance?: number;
    date_source?: string;
    planets?: string[];
}
export interface PlanetPosition {
    x: number;
    y: number;
    z: number;
}
export interface PlanetData {
    name: string;
    displayName: string;
    color: number;
    size: number;
    orbitColor: number;
    description?: string;
}
export interface HomeAssistant {
    callService: (domain: string, service: string, data?: any) => Promise<void>;
    callWS: (message: any) => Promise<any>;
    states: {
        [entity_id: string]: any;
    };
    language: string;
}
export interface LovelaceCardEditor extends HTMLElement {
    setConfig(config: SolarSystemCardConfig): void;
    hass?: HomeAssistant;
}
//# sourceMappingURL=types.d.ts.map