# Installation Guide

This guide will walk you through installing the Solar System Card in Home Assistant.

## Prerequisites

- Home Assistant installed and running
- Access to the Home Assistant configuration files
- A modern web browser with WebGL support

## Method 1: Manual Installation (Recommended for Development)

### Step 1: Build the Card

```bash
# Navigate to the project directory
cd HA-Space-Dashboard

# Install dependencies
npm install

# Build the card
npm run build
```

This will create `dist/solar-system-card.js`.

### Step 2: Copy to Home Assistant

1. Copy the built file to your Home Assistant `www` folder:
   ```bash
   # If running Home Assistant locally
   cp dist/solar-system-card.js /config/www/

   # Or create a custom folder
   mkdir -p /config/www/community/solar-system-card/
   cp dist/solar-system-card.js /config/www/community/solar-system-card/
   ```

2. If using Home Assistant OS or supervised, you can use the File Editor add-on or Samba share to upload the file.

### Step 3: Add Resource to Dashboard

1. Go to your Home Assistant web interface
2. Click on your profile (bottom left)
3. Enable "Advanced Mode" if not already enabled
4. Go to **Settings** → **Dashboards** → **Resources** tab
5. Click **"Add Resource"**
6. Fill in:
   - **URL**: `/local/solar-system-card.js` (or `/local/community/solar-system-card/solar-system-card.js`)
   - **Resource type**: JavaScript Module
7. Click **"Create"**

### Step 4: Add the Card to Your Dashboard

1. Go to your dashboard
2. Click **"Edit Dashboard"** (three dots menu → Edit Dashboard)
3. Click **"Add Card"**
4. Search for "Solar System Card" or scroll to find "Custom: Solar System Card"
5. Configure the card using the visual editor
6. Click **"Save"**

### Step 5: Refresh Browser

Press `Ctrl+F5` (or `Cmd+Shift+R` on Mac) to hard refresh and clear the cache.

## Method 2: HACS (Future)

Once this card is published to HACS:

1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click the "+" button
4. Search for "Solar System Card"
5. Click "Install"
6. Restart Home Assistant
7. Add the card to your dashboard

## Troubleshooting

### Card Not Appearing

**Problem**: The card doesn't show up in the card picker.

**Solutions**:
1. Make sure you added the resource correctly
2. Check the URL path matches where you placed the file
3. Hard refresh your browser (Ctrl+F5)
4. Check browser console for errors (F12 → Console tab)
5. Verify the file exists in `/config/www/`

### Resource Load Error

**Problem**: Error message about resource not loading.

**Solutions**:
1. Verify the file path in Resources matches the actual file location
2. Check file permissions (should be readable)
3. Try using `/local/` prefix instead of `/hacsfiles/` or vice versa
4. Restart Home Assistant

### Black Screen or No Planets

**Problem**: Card shows but is just black or planets don't appear.

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify your browser supports WebGL (visit https://get.webgl.org/)
3. Try a different browser
4. Check the configuration - make sure planets are listed

### Performance Issues

**Problem**: Card is slow or laggy.

**Solutions**:
1. Reduce number of planets displayed
2. Increase `update_interval` to 2000 or higher
3. Set `show_orbits: false`
4. Close other browser tabs
5. Try on a more powerful device

### Labels Not Visible

**Problem**: Planet labels don't show up.

**Solutions**:
1. Verify `show_labels: true` in configuration
2. Zoom in using mouse wheel
3. Rotate the camera by dragging
4. Some labels may be hidden if planets are behind the camera

## Configuration File Locations

- **Home Assistant OS/Supervised**: `/config/www/`
- **Home Assistant Container**: Mapped volume, typically `./config/www/`
- **Home Assistant Core**: `~/.homeassistant/www/`

## Manual YAML Configuration

If you prefer to edit YAML directly:

1. Edit your dashboard in YAML mode
2. Add this card configuration:

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

## Verification

To verify the installation is working:

1. Open your browser's developer console (F12)
2. Look for the message: `SOLAR-SYSTEM-CARD v1.0.0`
3. You should see a black canvas with a yellow sun in the center
4. Planets should be visible with their orbital paths
5. Controls should appear at the bottom

## Uninstallation

To remove the card:

1. Remove all instances of the card from your dashboards
2. Go to **Settings** → **Dashboards** → **Resources**
3. Find the solar-system-card resource and click **Delete**
4. Delete the file from `/config/www/`
5. Refresh your browser

## Development Mode

For active development:

```bash
# Watch mode - automatically rebuilds on file changes
npm run watch
```

Then in Home Assistant:
1. Keep the browser console open to see errors
2. After each rebuild, hard refresh the page (Ctrl+F5)
3. Or disable caching in browser DevTools (Network tab → "Disable cache")

## Getting Help

If you continue to have issues:

1. Check the browser console for error messages
2. Check Home Assistant logs: **Settings** → **System** → **Logs**
3. Open an issue on GitHub with:
   - Home Assistant version
   - Browser and version
   - Error messages from console
   - Your card configuration

## Next Steps

Once installed, check out the [README.md](README.md) for:
- Configuration options
- Usage examples
- Controls reference
- Advanced features
