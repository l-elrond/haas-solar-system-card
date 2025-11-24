import { PlanetPosition } from './types';
export declare class AstronomyCalculator {
    /**
     * Get the heliocentric position of a planet (relative to the Sun)
     * @param bodyName - Name of the celestial body
     * @param date - Date for which to calculate position
     * @returns Position in AU (Astronomical Units)
     */
    getPlanetPosition(bodyName: string, date: Date): PlanetPosition;
    /**
     * Get positions for all planets at a given date
     * @param date - Date for which to calculate positions
     * @param planetNames - Array of planet names to calculate
     * @returns Object mapping planet names to their positions
     */
    getAllPlanetPositions(date: Date, planetNames: string[]): {
        [key: string]: PlanetPosition;
    };
    /**
     * Calculate the orbital period of a planet in Earth days
     * This is an approximation based on Kepler's third law
     * @param bodyName - Name of the celestial body
     * @returns Orbital period in days
     */
    getOrbitalPeriod(bodyName: string): number;
    /**
     * Get the current distance from the Sun in AU
     * @param bodyName - Name of the celestial body
     * @param date - Date for which to calculate distance
     * @returns Distance in AU
     */
    getDistanceFromSun(bodyName: string, date: Date): number;
    /**
     * Get the semi-major axis (average orbital radius) in AU
     * @param bodyName - Name of the celestial body
     * @returns Semi-major axis in AU
     */
    getSemiMajorAxis(bodyName: string): number;
}
//# sourceMappingURL=astronomy-calculator.d.ts.map