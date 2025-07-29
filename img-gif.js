class ImgGif extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Style
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; max-width: 100%; font-family: system-ui,sans-serif; user-select: none; }
      canvas { border: 2px solid #667eea; border-radius: 8px; width: 100%; height: auto; display: block; }
      .controls { margin-top: 10px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
      .button-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
      button { cursor: pointer; padding: 6px 12px; font-size: 1.2rem; border-radius: 5px; border: 1px solid #667eea;
        background: white; color: #667eea; transition: background-color 0.2s; user-select: none;}
      button:hover { background: #667eea; color: white; }
      input[type="range"] { width: 280px; cursor: pointer; }
      .frame-info { font-size: 0.875rem; color: #666; }
    `;

    this.canvas = document.createElement('canvas');
    this.controls = document.createElement('div');
    this.controls.classList.add('controls');

    // Frame info display
    this.frameInfo = document.createElement('div');
    this.frameInfo.classList.add('frame-info');

    // Slider for frame navigation
    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = 0;
    this.slider.value = 0;
    this.slider.disabled = true;

    // Button helper
    const createButton = (label, title, handler) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.title = title;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handler();
      });
      return btn;
    };

    // Control buttons
    this.btnFirst = createButton('⏪', 'First Frame', () => this._gotoFrame(0));
    this.btnPrev  = createButton('◀️', 'Previous Frame', () => this._stepFrame(-1));
    this.btnPlay  = createButton('▶️', 'Play', () => this._play());
    this.btnPause = createButton('⏸️', 'Pause', () => this._pause());
    this.btnStop  = createButton('⏹️', 'Stop', () => this._stop());
    this.btnNext  = createButton('▶️', 'Next Frame', () => this._stepFrame(1));
    this.btnLast  = createButton('⏩', 'Last Frame', () => this._gotoLastFrame());

    // Button row
    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');
    [this.btnFirst, this.btnPrev, this.btnPlay, this.btnPause, this.btnStop, this.btnNext, this.btnLast]
      .forEach(btn => buttonRow.appendChild(btn));

    // Controls composition
    this.controls.append(this.frameInfo, this.slider, buttonRow);
    this.shadowRoot.append(style, this.canvas, this.controls);

    // State
    this.player = null;
    this._playbackInterval = null;
    this._isSliding = false;

    // Slider events
    this.slider.addEventListener('input', (e) => {
      if (this.player) {
        this._isSliding = true;
        this.player.pause();
        this.player.move_to(Number(e.target.value));
        this._updateUI();
      }
    });
    this.slider.addEventListener('change', () => {
      this._isSliding = false;
      this._updateUI();
    });

    this.slider.addEventListener('dblclick', () => {
      if (!this.player) return;
      const total = this.player.get_length();
      const input = prompt(`Enter frame number (1-${total}):`);
      if (!input) return;
      const val = Number(input);
      if (isNaN(val)) return;
      this.player.move_to(Math.min(Math.max(val - 1, 0), total - 1));
      this._updateUI();
    });
  }

  static get observedAttributes() { return ['src']; }

  connectedCallback() {
    if (this.hasAttribute('src')) this._loadGif(this.getAttribute('src'));
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'src' && newVal !== oldVal) {
      this._loadGif(newVal);
    }
  }

  _loadGif(src) {
    this._stopPlaybackTimer();

    if (this.player) {
        this.player.pause();
        this.player = null;
    }

    // Remove any previously appended hidden <img> elements to avoid duplicates
    Array.from(this.shadowRoot.querySelectorAll('img[data-gif-img]')).forEach(img => img.remove());

    // Create the hidden image for libgif to decode GIF frames
    const img = new Image();
    img.crossOrigin = 'anonymous';  // Allow CORS requests if needed
    img.src = src;

    // Use display:none to completely hide it (no layout space reserved)
    img.style.display = 'none';

    // Add a data attribute to easily find/remove this img later
    img.setAttribute('data-gif-img', 'true');

    // Append to shadow root so it's attached to DOM before SuperGif.load
    this.shadowRoot.appendChild(img);

    img.onload = () => {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }

        this.player = new window.SuperGif({
            gif: img,
            canvas: this.canvas,
            auto_play: false,
            loop_mode: false,
            progressbar_height: 0,
        });

        this.player.load(() => {
            this.player.move_to(0); // draw first frame explicitly

            // // Remove the hidden img now from DOM — no longer needed and prevents blank block
            // if (img.parentNode) {
            //     img.parentNode.removeChild(img);
            // }

            this.slider.min = 0;
            this.slider.max = this.player.get_length() - 1;
            this.slider.value = 0;
            this.slider.disabled = false;

            this._updateUI();
        });
    };

    img.onerror = () => {
        this.frameInfo.textContent = 'Failed to load GIF.';
        this.slider.disabled = true;
        console.error('Failed to load GIF at:', src);
    };
  } 


  _updateUI() {
    if (!this.player) return;
    if (!this._isSliding) {
      this.slider.value = this.player.get_current_frame();
    }
    this.frameInfo.textContent = `Frame ${this.player.get_current_frame() + 1} of ${this.player.get_length()}`;
    // Both play and pause buttons are always visible (modulo display logic if desired)
  }

  _play() {
    if (!this.player) return;
    this.player.play();
    this._startPlaybackTimer();
  }
  _pause() {
    if (!this.player) return;
    this.player.pause();
    this._stopPlaybackTimer();
    this._updateUI();
  }
  _stop() {
    if (!this.player) return;
    this.player.pause();
    this.player.move_to(0);
    this._stopPlaybackTimer();
    this._updateUI();
  }
  _stepFrame(delta) {
    if (!this.player) return;
    this.player.pause();
    this.player.move_relative(delta);
    this._stopPlaybackTimer();
    this._updateUI();
  }
  _gotoFrame(frame) {
    if (!this.player) return;
    this.player.pause();
    this.player.move_to(frame);
    this._stopPlaybackTimer();
    this._updateUI();
  }
  _gotoLastFrame() {
    if (!this.player) return;
    this.player.pause();
    this.player.move_to(this.player.get_length() - 1);
    this._stopPlaybackTimer();
    this._updateUI();
  }

  _startPlaybackTimer() {
    if (this._playbackInterval) return;
    this._playbackInterval = setInterval(() => {
      if (this.player && this.player.get_playing() && !this._isSliding) {
        this._updateUI();
      }
    }, 60);
  }

  _stopPlaybackTimer() {
    if (this._playbackInterval) {
      clearInterval(this._playbackInterval);
      this._playbackInterval = null;
    }
  }
}

customElements.define('img-gif', ImgGif);
