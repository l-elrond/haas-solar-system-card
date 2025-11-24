import * as Astronomy from 'astronomy-engine';
import { PlanetPosition } from './types';

export class AstronomyCalculator {
  /**
   * Get the heliocentric position of a planet (relative to the Sun)
   * @param bodyName - Name of the celestial body
   * @param date - Date for which to calculate position
   * @returns Position in AU (Astronomical Units)
   */
  getPlanetPosition(bodyName: string, date: Date): PlanetPosition {
    try {
      // Map planet names to Astronomy.Body enum
      const bodyMap: { [key: string]: Astronomy.Body } = {
        mercury: Astronomy.Body.Mercury,
        venus: Astronomy.Body.Venus,
        earth: Astronomy.Body.Earth,
        mars: Astronomy.Body.Mars,
        jupiter: Astronomy.Body.Jupiter,
        saturn: Astronomy.Body.Saturn,
        uranus: Astronomy.Body.Uranus,
        neptune: Astronomy.Body.Neptune,
      };

      const body = bodyMap[bodyName.toLowerCase()];
      if (!body) {
        console.warn(`Unknown planet: ${bodyName}`);
        return { x: 0, y: 0, z: 0 };
      }

      const vector = Astronomy.HelioVector(body, date);

      return {
        x: vector.x,
        y: vector.y,
        z: vector.z,
      };
    } catch (error) {
      console.error(`Error calculating position for ${bodyName}:`, error);
      return { x: 0, y: 0, z: 0 };
    }
  }

  /**
   * Get positions for all planets at a given date
   * @param date - Date for which to calculate positions
   * @param planetNames - Array of planet names to calculate
   * @returns Object mapping planet names to their positions
   */
  getAllPlanetPositions(
    date: Date,
    planetNames: string[]
  ): { [key: string]: PlanetPosition } {
    const positions: { [key: string]: PlanetPosition } = {};

    for (const planet of planetNames) {
      positions[planet] = this.getPlanetPosition(planet, date);
    }

    return positions;
  }

  /**
   * Calculate the orbital period of a planet in Earth days
   * This is an approximation based on Kepler's third law
   * @param bodyName - Name of the celestial body
   * @returns Orbital period in days
   */
  getOrbitalPeriod(bodyName: string): number {
    const periods: { [key: string]: number } = {
      mercury: 87.97,
      venus: 224.7,
      earth: 365.26,
      mars: 686.98,
      jupiter: 4332.59,
      saturn: 10759.22,
      uranus: 30688.5,
      neptune: 60182,
    };

    return periods[bodyName.toLowerCase()] || 365.26;
  }

  /**
   * Get the current distance from the Sun in AU
   * @param bodyName - Name of the celestial body
   * @param date - Date for which to calculate distance
   * @returns Distance in AU
   */
  getDistanceFromSun(bodyName: string, date: Date): number {
    const position = this.getPlanetPosition(bodyName, date);
    return Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2);
  }

  /**
   * Get the semi-major axis (average orbital radius) in AU
   * @param bodyName - Name of the celestial body
   * @returns Semi-major axis in AU
   */
  getSemiMajorAxis(bodyName: string): number {
    const semiMajorAxes: { [key: string]: number } = {
      mercury: 0.387,
      venus: 0.723,
      earth: 1.0,
      mars: 1.524,
      jupiter: 5.203,
      saturn: 9.537,
      uranus: 19.191,
      neptune: 30.069,
    };

    return semiMajorAxes[bodyName.toLowerCase()] || 1.0;
  }
}
