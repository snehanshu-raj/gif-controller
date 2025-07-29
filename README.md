# GIF Controller

## Overview
Ever felt **irritated** with GIFs non-stop playing and not stopping? The Chrome GIF Controller is a Chrome extension that solves this exact problem by detecting GIF images on any webpage giving control over them.

Instead of endlessly looping animations that can be distracting or annoying, this player gives you **complete control** over GIF playback. You can pause that distracting animation, step through it frame by frame, or stop it entirely when you need to focus on reading content.

## Features
- Pause and resume GIF animation
- Stop playback (resetting to the first frame)
- Step forward and backward through frames one at a time
- Navigate to any specific frame using a slider
- Supports both static and dynamically-loaded GIFs
- User-friendly UI/UX with minimal impact on page layout

## Try it OUT!
- **[Try the demo here!](https://snehanshu-raj.github.io/gif-controller/)** 🎯

## Demo
![GIF Controller Demo](assets/demo/demo.gif)

## Project Structure
```
chrome-gif-controller
├── src
│   ├── content
│   │   ├── contentScript.js       # Main logic for detecting and replacing 
│   rendering
│   ├── ui
│   │   ├── controls.css           # Styles for playback controls
│   │   └── controls.html          # HTML structure for playback controls
│   └── lib
│       └── libgif.js              # GIF parser/decoder library
├── manifest.json                  # Chrome extension configuration
├── README.md                      # Project documentation
└── assets
    └── icons
        ├── icon16.png            
        ├── icon48.png             
        └── icon128.png            
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/snehanshu-raj/gif-controller.git
   ```
2. Navigate to the extension directory:
   ```
   cd chrome-gif-controller
   ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the `gif-controller` directory.

## Usage
Once the extension is installed, it will automatically detect GIF images on any webpage. The GIFs will be replaced with the canvas player, allowing you to control playback using the provided controls.

## Optional Enhancements (To be Done)
- Revert to the original GIF `<img>` element if desired.
- Support for themes or UI customization for controls.

## Acknowledgments
- Project idea from **[Dr. Saty Raghavachary](https://www.linkedin.com/in/satychary/)** sir, CSE Dept., USC
- Built with [libgif-js](https://github.com/buzzfeed/libgif-js) for GIF parsing