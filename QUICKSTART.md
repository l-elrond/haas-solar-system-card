# Quick Start Guide

Get your Solar System Card up and running in 5 minutes!

## Step 1: Copy the Built File

The card has already been built! Copy the JavaScript file to Home Assistant:

```bash
# Find the built file
ls dist/solar-system-card.js

# Copy to Home Assistant www folder
# (Adjust the path to match your Home Assistant installation)
cp dist/solar-system-card.js /path/to/homeassistant/config/www/
```

Common paths:
- **Home Assistant OS/Supervised**: `/config/www/`
- **Docker**: `./config/www/` (in your docker-compose directory)
- **Core**: `~/.homeassistant/www/`

## Step 2: Add to Home Assistant Resources

1. Open Home Assistant in your browser
2. Go to **Settings** → **Dashboards**
3. Click the **Resources** tab at the top
4. Click **"+ Add Resource"** button
5. Enter:
   - **URL**: `/local/solar-system-card.js`
   - **Resource type**: JavaScript Module
6. Click **Create**

## Step 3: Add the Card

1. Go to any dashboard
2. Click **Edit Dashboard** (three dots → Edit Dashboard)
3. Click **+ Add Card**
4. Scroll down or search for **"Solar System Card"**
5. The visual editor will appear - configure as you like:
   - Set a title
   - Choose which planets to show
   - Toggle orbital paths and labels
   - Adjust camera distance and speed
6. Click **Save**

## Step 4: Enjoy!

You should now see:
- ☀️ A glowing yellow sun in the center
- 🪐 Planets orbiting with accurate positions
- ⭐ A starfield background
- 🎮 Controls at the bottom to play/pause and adjust speed

### Controls:
- **Drag** with mouse to rotate camera
- **Scroll** to zoom in/out
- **▶️/⏸️** to play/pause
- **🔄** to reset to current date
- **⏪/⏩** to slow down/speed up

## Example Configuration

### Full Solar System
```yaml
type: custom:solar-system-card
title: Solar System
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

### Inner Planets Only
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

### Fast Animation
```yaml
type: custom:solar-system-card
title: Solar System (Fast)
animation_speed: 100
update_interval: 500
```

## Troubleshooting

### Card doesn't appear in card list
- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Check that the file exists in `/config/www/`
- Verify the resource URL is `/local/solar-system-card.js`

### Black screen
- Open browser console (F12) and check for errors
- Verify your browser supports WebGL: https://get.webgl.org/
- Try reducing the number of planets

### Can't see planets
- Use mouse wheel to zoom out
- Drag to rotate the camera view
- Wait a few seconds for positions to update

## What's Next?

- Read the full [README.md](README.md) for all configuration options
- Check [INSTALLATION.md](INSTALLATION.md) for detailed setup instructions
- Customize the appearance and behavior to your liking!

## Development

Want to modify the card? Use watch mode:

```bash
npm run watch
```

This will automatically rebuild when you change any source files. Just refresh your browser after each build!

---

**Questions?** Check the README.md or open an issue on GitHub!
