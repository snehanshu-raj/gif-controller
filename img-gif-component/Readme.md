# `<img-gif>` Web Component

A modern, interactive GIF player web component built with React that provides frame-by-frame control, smooth playback, and an intuitive user interface. Perfect for showcasing animated GIFs with professional-grade controls.

## ✨ Features

### Core Functionality

- **🎬 Frame-by-frame navigation** - Step through GIF frames with precision control
- **🔄 Circular navigation** - Seamlessly loop from last frame to first and vice versa
- **▶️ Click-to-play/pause** - Click anywhere on the GIF to toggle playback
- **🚀 Auto-play on load** - GIFs start playing automatically when fully loaded
- **⏹️ Complete playback control** - Play, pause, stop, first, last, previous, next frame


### User Interface

- **🎚️ Dynamic slider** - Frame scrubber that matches the GIF's width for intuitive navigation
- **👆 Hover controls** - Control buttons only appear on mouse hover for clean viewing
- **📊 Frame counter** - Shows current frame position (e.g., "5/24")
- **📱 Responsive design** - Maintains original GIF dimensions while adapting to container
- **✨ Transparent overlay** - Controls float cleanly over the GIF without background interference


## 🚀 Quick Start

### 1. Include the Script

```html
<script src="https://cdn.jsdelivr.net/gh/snehanshu-raj/gif-controller@main/img-gif.js"></script>
```

### 2. Use the Component

```html
<img-gif src="https://example.com/your-animation.gif"></img-gif>
```

## Example HTML page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>img-gif Component Test</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/gh/snehanshu-raj/gif-controller@main/img-gif.js"></script>
  <div>
    <img-gif src="cool.gif"></img-gif>
  </div>
</body>
</html>
```

### **Updating to the Latest Version**

jsDelivr may cache files referenced with `@main` for several hours, so sometimes recent updates on GitHub main branch may not appear right away when you use:

```html
<script src="https://cdn.jsdelivr.net/gh/snehanshu-raj/gif-controller@main/img-gif.js"></script>
```

**If you need the very latest version:**

1. **Check the most recent commit hash** for my file on GitHub:
[https://github.com/snehanshu-raj/gif-controller/blob/main/img-gif.js](https://github.com/snehanshu-raj/gif-controller/blob/main/img-gif.js)
2. **Copy the commit hash** (for example, `17e4566` : this is the latest version).
3. **Use the commit hash instead of `main` in your script tag:**

## 🎮 User Controls

### Mouse Interactions

- **Click on GIF**: Toggle play/pause
- **Hover over GIF**: Reveal control overlay
- **Drag slider**: Scrub through frames in real-time
- **Click buttons**: Navigate to specific frames or control playback

### Control Buttons

- **⏮️ First Frame**: Jump to frame 1
- **⏪ Previous Frame**: Step backward one frame (with circular wrapping)
- **⏹️ Stop**: Pause and return to frame 1
- **⏩ Next Frame**: Step forward one frame (with circular wrapping)
- **⏭️ Last Frame**: Jump to the final frame

## Architecture

### Flow

```
1. HTML: <img-gif src="..."> 
    ↓
2. Web Component: Creates shadow DOM + React root
    ↓
3. React Component: Loads GIF via Image() + SuperGif
    ↓
4. SuperGif: Decodes GIF frames into canvas
    ↓
5. UI Controls: Overlay on hover with frame navigation
    ↓
6. User Interaction: Click/hover triggers state updates
    ↓
7. Canvas Update: SuperGif renders new frame
```


### State Management

```javascript
// Core state variables in GifPlayer
const [player, setPlayer] = useState(null);                     // SuperGif instance
const [frameCount, setFrameCount] = useState(0);                // Total frames
const [currentFrame, setCurrentFrame] = useState(0);            // Current position
const [isPlaying, setIsPlaying] = useState(false);              // Playback state
const [isHovered, setIsHovered] = useState(false);              // UI visibility
const [isLoaded, setIsLoaded] = useState(false);                // Loading state
const [originalGIFwidth, setOriginalGIFwidth] = useState(0);    // GIF width for slider
```


## ⚙️ Technical Implementation

### GIF Processing Pipeline

1. **Image Loading**: Hidden `<img>` element loads the GIF file
2. **GIF Decoding**: SuperGif processes the GIF into individual frames
3. **Canvas Setup**: Canvas element created and sized to match GIF dimensions
4. **Frame Management**: SuperGif controls frame rendering and timing
5. **UI Synchronization**: React state keeps UI controls in sync with playback


## 🔧 Dependencies

All dependencies are automatically loaded via CDN:

- **React 18**: `https://unpkg.com/react@18/umd/react.development.js`
- **ReactDOM 18**: `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- **libgif.js**: `https://cdn.jsdelivr.net/gh/buzzfeed/libgif-js@master/libgif.js`
