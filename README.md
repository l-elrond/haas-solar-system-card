# Solar System Card for Home Assistant

An animated 3D solar system custom card for Home Assistant that displays accurate planetary positions based on real astronomical data.

![Solar System Card](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Accurate Planetary Positions**: Uses the astronomy-engine library with VSOP87 models for ±1 arcminute accuracy
- **Real-time Animation**: Watch planets move in their orbits with adjustable speed
- **Interactive 3D View**:
  - Drag to rotate the camera
  - Scroll to zoom in/out
  - Smooth controls and animations
- **Customizable Display**:
  - Toggle orbital paths
  - Show/hide planet labels
  - Select which planets to display
  - Adjustable camera distance
- **Playback Controls**:
  - Play/pause animation
  - Speed up or slow down time
  - Reset to current date
  - View past or future planetary configurations

## Preview

The card displays:
- The Sun at the center with a glowing effect
- All 8 planets (Mercury through Neptune) with accurate colors
- Orbital paths showing each planet's elliptical orbit
- A starfield background
- Real-time date and speed indicator
- Interactive controls

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on "Frontend"
3. Click the "+" button
4. Search for "Solar System Card"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download the `solar-system-card.js` file from the [latest release](https://github.com/yourusername/solar-system-card/releases)
2. Copy it to your `config/www` folder
3. Add the resource to your dashboard:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/solar-system-card.js`
   - Resource type: JavaScript Module
4. Click "Create"
5. Refresh your browser

## Usage

### Adding the Card

1. Edit your dashboard
2. Click "Add Card"
3. Search for "Solar System Card"
4. Configure the card options
5. Click "Save"

### Manual YAML Configuration

```yaml
type: custom:solar-system-card
title: Solar System
update_interval: 1000
animation_speed: 1
show_orbits: true
show_labels: true
camera_distance: 80
planets:
  - mercury
  - venus
  - earth
  - mars
  - jupiter
  - saturn
  - uranus
  - neptune
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | Must be `custom:solar-system-card` |
| `title` | string | `Solar System` | Card title |
| `update_interval` | number | `1000` | Update interval in milliseconds |
| `animation_speed` | number | `1` | Time multiplier (1 = real-time, 10 = 10x speed) |
| `show_orbits` | boolean | `true` | Show orbital paths |
| `show_labels` | boolean | `true` | Show planet name labels |
| `camera_distance` | number | `80` | Initial camera distance (20-300) |
| `planets` | array | All planets | List of planets to display |

### Available Planets

- `mercury`
- `venus`
- `earth`
- `mars`
- `jupiter`
- `saturn`
- `uranus`
- `neptune`

### Example: Inner Planets Only

```yaml
type: custom:solar-system-card
title: Inner Solar System
camera_distance: 40
planets:
  - mercury
  - venus
  - earth
  - mars
```

### Example: Outer Planets Only

```yaml
type: custom:solar-system-card
title: Outer Solar System
camera_distance: 150
planets:
  - jupiter
  - saturn
  - uranus
  - neptune
```

## Controls

- **▶️/⏸️ Button**: Play/pause the animation
- **🔄 Button**: Reset to current date and time
- **⏪ Button**: Slow down animation (0.5x speed)
- **⏩ Button**: Speed up animation (2x speed)
- **Mouse Drag**: Rotate the camera around the solar system
- **Mouse Wheel**: Zoom in and out

## Technical Details

### Astronomy Calculations

This card uses the [astronomy-engine](https://github.com/cosinekitty/astronomy) library to calculate planetary positions:

- Based on VSOP87 (Variations Séculaires des Orbites Planétaires) models
- Accuracy: ±1 arcminute
- Verified against JPL Horizons and NOVAS
- No network requests needed - all calculations done in the browser

### 3D Rendering

Built with [Three.js](https://threejs.org/) for smooth WebGL rendering:

- Real-time 3D graphics
- Optimized for performance
- Responsive design
- Works on desktop and mobile

### Data Flow

1. astronomy-engine calculates heliocentric positions (x, y, z coordinates from the Sun)
2. Positions are converted to 3D scene coordinates
3. Three.js renders the planets at their calculated positions
4. Positions update continuously based on the animation speed

## Performance

- **Bundle Size**: ~400KB minified (includes Three.js and astronomy-engine)
- **Browser Compatibility**: All modern browsers with WebGL support
- **Mobile**: Optimized for touch controls and smaller screens

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any browser with WebGL support

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/solar-system-card.git
cd solar-system-card

# Install dependencies
npm install

# Build the card
npm run build

# Development mode (watch for changes)
npm run watch
```

The built file will be in `dist/solar-system-card.js`.

### Project Structure

```
solar-system-card/
├── src/
│   ├── solar-system-card.ts          # Main card component
│   ├── solar-system-card-editor.ts   # Configuration UI
│   ├── solar-system-renderer.ts      # Three.js 3D renderer
│   ├── astronomy-calculator.ts       # Planetary position calculations
│   ├── planet-config.ts              # Planet data and colors
│   └── types.ts                      # TypeScript type definitions
├── dist/
│   └── solar-system-card.js          # Built bundle
├── package.json
├── tsconfig.json
├── rollup.config.mjs
└── README.md
```

## Troubleshooting

### Card Not Showing

1. Make sure the resource is added to your dashboard resources
2. Clear your browser cache
3. Check the browser console for errors
4. Verify the card type is `custom:solar-system-card`

### Performance Issues

1. Reduce the number of planets displayed
2. Increase the `update_interval` (e.g., 2000 for 2 seconds)
3. Disable orbital paths with `show_orbits: false`
4. Reduce animation speed

### Labels Not Showing

- Make sure `show_labels: true` in your configuration
- Try zooming in with the mouse wheel
- Labels only show when planets are visible in the camera view

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits

- **astronomy-engine**: [Don Cross](https://github.com/cosinekitty/astronomy) for the excellent astronomical calculations library
- **Three.js**: [Three.js team](https://threejs.org/) for the 3D rendering library
- **Home Assistant**: The amazing [Home Assistant community](https://www.home-assistant.io/)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0 (2024)
- Initial release
- 8 planets with accurate positions
- Interactive 3D view with mouse controls
- Adjustable animation speed
- Configurable display options
- Visual configuration editor

## Support

If you find this card useful, please give it a star on GitHub! ⭐

For issues, feature requests, or questions, please open an issue on GitHub.

---

Made with ❤️ for the Home Assistant community
