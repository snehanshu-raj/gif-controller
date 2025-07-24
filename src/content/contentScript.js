(function() {
  // Skip execution on certain domains/sites
  const skipDomains = [
    'mail.google.com',
    'gmail.com', 
    'accounts.google.com',
    'drive.google.com',
    'docs.google.com',
    'sheets.google.com',
    'slides.google.com',
    'youtube.com',
    'twitter.com',
    'x.com',
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'leetcode.com'
  ];
 
  // Check if current domain should be skipped
  const shouldSkipDomain = skipDomains.some(domain => 
    window.location.hostname.includes(domain)
  );

  if (shouldSkipDomain) {
    return;
  }

  function createControls(player) {
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexDirection = 'column';
    controls.style.alignItems = 'center';
    controls.style.gap = '8px';
    controls.style.margin = '16px 0 0 0';
    controls.style.pointerEvents = 'auto';
    controls.style.position = 'relative';
    controls.style.zIndex = '1000';
    
    // Prevent controls container from bubbling events
    controls.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '6px';
    buttonContainer.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Frame info container
    const frameInfo = document.createElement('div');
    frameInfo.style.fontSize = '12px';
    frameInfo.style.color = '#666';
    frameInfo.style.marginBottom = '4px';

    // Slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    sliderContainer.style.gap = '8px';
    sliderContainer.style.width = '300px';
    sliderContainer.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const makeBtn = (label, title, handler) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.title = title;
      btn.style.padding = '6px 10px';
      btn.style.fontSize = '16px';
      btn.style.cursor = 'pointer';
      btn.style.borderRadius = '4px';
      btn.style.border = '1px solid #ccc';
      btn.style.background = '#fff';
      btn.style.position = 'relative';
      btn.style.zIndex = '1001';
      
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        handler(event);
      });
      
      btn.addEventListener('mousedown', (event) => {
        event.stopPropagation();
      });
      
      btn.addEventListener('mouseup', (event) => {
        event.stopPropagation();
      });
      
      return btn;
    };

    // Create slider/scrubber
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = player.get_length() - 1;
    slider.value = '0';
    slider.style.flex = '1';
    slider.style.cursor = 'pointer';
    slider.style.position = 'relative';
    slider.style.zIndex = '1001';

    // Frame number labels
    const currentFrameLabel = document.createElement('span');
    currentFrameLabel.style.fontSize = '11px';
    currentFrameLabel.style.minWidth = '20px';
    currentFrameLabel.style.textAlign = 'center';
    
    const totalFramesLabel = document.createElement('span');
    totalFramesLabel.style.fontSize = '11px';
    totalFramesLabel.style.minWidth = '20px';
    totalFramesLabel.style.textAlign = 'center';

    // Update function for frame info
    const updateFrameInfo = () => {
      const currentFrame = player.get_current_frame();
      const totalFrames = player.get_length();
      currentFrameLabel.textContent = currentFrame + 1;
      totalFramesLabel.textContent = totalFrames;
      frameInfo.textContent = `Frame ${currentFrame + 1} of ${totalFrames}`;
      slider.value = currentFrame;
    };

    // Slider event handlers with proper event handling
    let isSliding = false;

    slider.addEventListener('mousedown', (event) => {
      event.stopPropagation();
      isSliding = true;
      player.pause();
    });

    slider.addEventListener('mouseup', (event) => {
      event.stopPropagation();
      isSliding = false;
    });

    slider.addEventListener('input', (event) => {
      event.stopPropagation();
      const frameIndex = parseInt(slider.value);
      player.move_to(frameIndex);
      updateFrameInfo();
    });

    slider.addEventListener('dblclick', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const frameNumber = prompt(`Enter frame number (1-${player.get_length()}):`);
      if (frameNumber && !isNaN(frameNumber)) {
        const frameIndex = Math.max(0, Math.min(parseInt(frameNumber) - 1, player.get_length() - 1));
        player.move_to(frameIndex);
        updateFrameInfo();
      }
    });

    // Create buttons with updated handlers
    const playBtn = makeBtn('▶️', 'Play', () => {
      player.play();
    });

    const pauseBtn = makeBtn('⏸️', 'Pause', () => {
      player.pause();
    });

    const stopBtn = makeBtn('⏹️', 'Stop', () => {
      player.pause();
      player.move_to(0);
      updateFrameInfo();
    });

    const prevBtn = makeBtn('⏮️', 'Previous Frame', () => {
      player.pause();
      player.move_relative(-1);
      updateFrameInfo();
    });

    const nextBtn = makeBtn('⏭️', 'Next Frame', () => {
      player.pause();
      player.move_relative(1);
      updateFrameInfo();
    });

    // First frame button
    const firstBtn = makeBtn('⏪', 'First Frame', () => {
      player.pause();
      player.move_to(0);
      updateFrameInfo();
    });

    // Last frame button
    const lastBtn = makeBtn('⏩', 'Last Frame', () => {
      player.pause();
      player.move_to(player.get_length() - 1);
      updateFrameInfo();
    });

    // Assemble slider container
    sliderContainer.appendChild(currentFrameLabel);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(totalFramesLabel);

    // Assemble button container
    buttonContainer.append(
      firstBtn,
      prevBtn,
      playBtn,
      pauseBtn,
      stopBtn,
      nextBtn,
      lastBtn
    );

    // Assemble main controls
    controls.appendChild(frameInfo);
    controls.appendChild(sliderContainer);
    controls.appendChild(buttonContainer);

    // Override SuperGif's frame change callback to update our UI
    const originalMoveToCallback = player.move_to;
    player.move_to = function(frameIndex) {
      originalMoveToCallback.call(this, frameIndex);
      updateFrameInfo();
    };

    const originalMoveRelativeCallback = player.move_relative;
    player.move_relative = function(delta) {
      originalMoveRelativeCallback.call(this, delta);
      updateFrameInfo();
    };

    // Monitor playback to update slider during play
    let playbackMonitor = null;
    const originalPlay = player.play;
    player.play = function() {
      originalPlay.call(this);
      if (playbackMonitor) clearInterval(playbackMonitor);
      playbackMonitor = setInterval(() => {
        if (!isSliding && player.get_playing()) {
          updateFrameInfo();
        }
      }, 50);
    };

    const originalPause = player.pause;
    player.pause = function() {
      originalPause.call(this);
      if (playbackMonitor) {
        clearInterval(playbackMonitor);
        playbackMonitor = null;
      }
    };

    updateFrameInfo();
    return controls;
  }

  // Detect if page is a direct GIF image URL
  const isDirectGif = (() => {
    try {
      if (!window.location.href.toLowerCase().includes('.gif')) return false;
      if (document.contentType && document.contentType.toLowerCase().startsWith('image/gif')) return true;
      if (
        document.body &&
        document.body.childNodes.length === 1 &&
        document.body.firstChild.nodeName === 'IMG' &&
        document.body.firstChild.src.toLowerCase().includes('.gif')
      ) return true;
      return false;
    } catch {
      return false;
    }
  })();

  if (isDirectGif) {
    // Remove all default spacing
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100vh';

    // Center everything
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.height = '100vh';
    wrapper.style.width = '100vw';
    wrapper.style.margin = '0';

    // Container for canvas + controls
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    // Hidden img for SuperGif to decode
    const img = document.createElement('img');
    img.src = window.location.href;
    img.style.display = 'none';

    document.body.appendChild(img);

    img.onload = () => {
      const player = new SuperGif({
        gif: img,
        auto_play: false,
        loop_mode: false,
        progressbar_height: 0
      });

      player.load(() => {
        const canvas = player.get_canvas();
        
        canvas.style.width = img.naturalWidth + 'px';
        canvas.style.height = img.naturalHeight + 'px';
        container.appendChild(canvas);
        
        const controls = createControls(player);
        controls.style.marginTop = '16px';
        container.appendChild(controls);
      });
    };

    wrapper.appendChild(container);
    document.body.appendChild(wrapper);

    return;
  }

  // If the URL contains .gif, set all <img> tags to use this GIF
  if (window.location.href.toLowerCase().includes('.gif')) {
    document.querySelectorAll('img').forEach(img => {
      img.src = window.location.href;
    });
  }

  // Normal page GIF replacements
  function replaceGIFs() {
    document.querySelectorAll('img:not([data-gif-canvas-player])').forEach(img => {
      if (!img.src.toLowerCase().includes('.gif')) return;
      img.setAttribute('data-gif-canvas-player', 'true');

      const rect = img.getBoundingClientRect();
      const displayWidth = Math.round(rect.width);
      const displayHeight = Math.round(rect.height);

      const container = document.createElement('div');
      container.style.display = 'inline-block';
      container.style.position = 'relative';
      container.style.verticalAlign = getComputedStyle(img).verticalAlign || 'baseline';
      container.style.textAlign = 'center';

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || displayWidth;
      canvas.height = img.naturalHeight || displayHeight;
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';

      container.appendChild(canvas);

      if (img.parentNode) {
        img.parentNode.insertBefore(container, img);
      }

      const player = new SuperGif({
        gif: img,
        auto_play: false,
        loop_mode: false,
        canvas: canvas,
        progressbar_height: 0
      });

      player.load(() => {
        const controls = createControls(player);
        container.appendChild(controls);
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
      });
    });
  }

  // Initial run on page load
  replaceGIFs();

  const observer = new MutationObserver(() => replaceGIFs());
  observer.observe(document.body, { childList: true, subtree: true });

})();
