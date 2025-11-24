import { PlanetData } from './types';

export const PLANET_CONFIGS: { [key: string]: PlanetData } = {
  mercury: {
    name: 'mercury',
    displayName: 'Mercury',
    color: 0x8c7853,
    size: 0.38,
    orbitColor: 0x666666,
    description: 'Closest planet to the Sun',
  },
  venus: {
    name: 'venus',
    displayName: 'Venus',
    color: 0xffc649,
    size: 0.95,
    orbitColor: 0x888888,
    description: 'Second planet from the Sun',
  },
  earth: {
    name: 'earth',
    displayName: 'Earth',
    color: 0x0077be,
    size: 1.0,
    orbitColor: 0x4488ff,
    description: 'Our home planet',
  },
  mars: {
    name: 'mars',
    displayName: 'Mars',
    color: 0xdc4e28,
    size: 0.53,
    orbitColor: 0xaa6666,
    description: 'The Red Planet',
  },
  jupiter: {
    name: 'jupiter',
    displayName: 'Jupiter',
    color: 0xc88b3a,
    size: 2.5,
    orbitColor: 0x996644,
    description: 'Largest planet in our solar system',
  },
  saturn: {
    name: 'saturn',
    displayName: 'Saturn',
    color: 0xfad5a5,
    size: 2.1,
    orbitColor: 0xddaa66,
    description: 'The ringed planet',
  },
  uranus: {
    name: 'uranus',
    displayName: 'Uranus',
    color: 0x4fd0e7,
    size: 1.6,
    orbitColor: 0x6699aa,
    description: 'Ice giant with extreme tilt',
  },
  neptune: {
    name: 'neptune',
    displayName: 'Neptune',
    color: 0x4166f5,
    size: 1.5,
    orbitColor: 0x4455aa,
    description: 'Farthest planet from the Sun',
  },
};

export const DEFAULT_PLANETS = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
];
