# img-gif Web Component

A **custom HTML element** `<img-gif>` for easily displaying and controlling GIF animations frame-by-frame.

## Overview

`img-gif` is a lightweight, self-contained Web Component built with vanilla JavaScript that leverages the [libgif.js](https://github.com/buzzfeed/libgif-js) library to decode GIFs and render frames on a canvas inside a shadow DOM. It provides intuitive controls to **play**, **pause**, **step frames**, and **jump between frames** with a slider and buttons.

## Features

- Render GIF animations on a `<canvas>` for smooth frame control.
- Buttons to navigate frames easily: first, previous, play, pause, stop, next, last.
- A slider allows scrubbing through GIF frames interactively.
- Displays current frame info.
- Built with modern Web Component standards — encapsulated styles and markup.
- Dynamically loads the required `libgif.js` library if not already present.
- Easy to use anywhere by simply adding an `<img-gif>` tag in HTML.


## Why Use `img-gif`?

- **Simplicity:** Use a single custom HTML tag, no third-party frameworks needed.
- **Flexibility:** Easily control GIF playback beyond simple looping.
- **Encapsulation:** Styles and scripts are self-contained — no CSS leaks or global conflicts.
- **Modern Web:** Leverages native browser Web Components APIs for best performance and compatibility.
- **Dynamic Loading:** Automatically handles loading of the GIF decoder library, so setup is minimal.


## Usage

Include the script in your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/snehanshu-raj/gif-controller@6a5a730/img-gif.js"></script>
```

Then use the custom tag anywhere in your page:

```html
<img-gif src="cool.gif"></img-gif>
```

Replace `"cool.gif"` with your own GIF URL or path.

## Example HTML page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>img-gif Component Test</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/gh/snehanshu-raj/gif-controller@6a5a730/img-gif.js"></script>
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
2. **Copy the commit hash** (for example, `6a5a730` : this is the current version).
3. **Use the commit hash instead of `main` in your script tag:**

```html
<script src="https://cdn.jsdelivr.net/gh/snehanshu-raj/gif-controller@6a5a730/img-gif.js"></script>
```

This ensures you always get the exact, current version of the file, bypassing CDN cache delays.

**Tip:** Always use the commit-based link for instant updates or development and `@main` for more stable, production use where immediate updates are not critical.

## Notes

- The component automatically loads and uses the `libgif.js` GIF decoding library.
- The control buttons and slider allow you to interact with frames conveniently.
- The component registers a new custom tag `<img-gif>`, making it easy to embed anywhere HTML is allowed.
- Works in all modern browsers supporting Web Components.

## Installation

- No build tools or package managers required. Just include the script.
- For private or development use, you can download `img-gif.js` and include it locally.

