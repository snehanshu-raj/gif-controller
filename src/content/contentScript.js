(function() {
  'use strict';

  // Skip execution on certain domains
  const skipDomains = [
    'mail.google.com', 'gmail.com', 'accounts.google.com',
    'drive.google.com', 'docs.google.com', 'sheets.google.com', 
    'slides.google.com', 'youtube.com', 'twitter.com', 'x.com',
    'facebook.com', 'instagram.com', 'linkedin.com', 'leetcode.com'
  ];

  const shouldSkipDomain = skipDomains.some(domain => 
    window.location.hostname.includes(domain)
  );

  if (shouldSkipDomain) return;

  // Wait for dependencies to load
  function waitForDependencies() {
    return new Promise((resolve) => {
      const checkDeps = () => {
        if (window.React && window.ReactDOM && window.SuperGif) {
          resolve();
        } else {
          setTimeout(checkDeps, 50);
        }
      };
      checkDeps();
    });
  }

  waitForDependencies().then(() => {
    const { useState, useEffect, useRef } = window.React;

    // Advanced GIF Player Component
    function GifPlayer({ src, originalElement }) {
      const containerRef = useRef(null);
      const [player, setPlayer] = useState(null);
      const [frameCount, setFrameCount] = useState(0);
      const [currentFrame, setCurrentFrame] = useState(0);
      const [isPlaying, setIsPlaying] = useState(false);
      const [isHovered, setIsHovered] = useState(false);
      const [isLoaded, setIsLoaded] = useState(false);
      const [originalGIFwidth, setOriginalGIFwidth] = useState(0);

      useEffect(() => {
        if (!src || !containerRef.current) return;

        let superGif = null;
        let hiddenImg = null;

        setIsLoaded(false);
        setIsPlaying(false);

        if (player) {
          player.pause();
          setPlayer(null);
        }

        // Clear existing canvas
        const existingCanvas = containerRef.current.querySelector('canvas');
        if (existingCanvas) existingCanvas.remove();

        hiddenImg = new Image();
        hiddenImg.crossOrigin = "anonymous";
        hiddenImg.src = src;
        hiddenImg.style.display = 'none';
        
        hiddenImg.onload = () => {
          if (!window.SuperGif || !containerRef.current) return;
          
          // Get dimensions from original element if available
          const rect = originalElement?.getBoundingClientRect();
          const displayWidth = rect?.width || hiddenImg.naturalWidth;
          const displayHeight = rect?.height || hiddenImg.naturalHeight;
          
          setOriginalGIFwidth(displayWidth);

          superGif = new window.SuperGif({
            gif: hiddenImg,
            auto_play: false,
            loop_mode: true,
            progressbar_height: 0
          });

          superGif.load(() => {
            const canvas = superGif.get_canvas();
            
            // Preserve original display dimensions
            canvas.width = hiddenImg.naturalWidth;
            canvas.height = hiddenImg.naturalHeight;
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            canvas.style.display = 'block';
            canvas.style.border = '2px solid #667eea';
            canvas.style.borderRadius = '8px';
            canvas.style.cursor = 'pointer';
            
            // Copy styles from original element
            if (originalElement) {
              const computedStyle = window.getComputedStyle(originalElement);
              canvas.style.verticalAlign = computedStyle.verticalAlign || 'baseline';
            }
            
            containerRef.current.appendChild(canvas);
            
            // Click handler: play/pause toggle
            canvas.onclick = (e) => {
              e.stopPropagation();
              if (!superGif) return;
              if (superGif.get_playing()) {
                superGif.pause();
              } else {
                superGif.play();
              }
              setIsPlaying(superGif.get_playing());
            };

            setPlayer(superGif);
            setFrameCount(superGif.get_length());
            setCurrentFrame(0);
            setIsLoaded(true);

            // Auto-play when loaded
            setTimeout(() => {
              superGif.play();
              setIsPlaying(true);
            }, 100);
          });
        };

        hiddenImg.onerror = () => {
          setIsLoaded(false);
        };

        return () => {
          if (superGif) superGif.pause();
          if (hiddenImg && hiddenImg.parentNode) {
            hiddenImg.parentNode.removeChild(hiddenImg);
          }
        };
      }, [src]);

      useEffect(() => {
        if (!player || !isPlaying) return;
        const interval = setInterval(() => {
          setCurrentFrame(player.get_current_frame());
        }, 60);
        return () => clearInterval(interval);
      }, [player, isPlaying]);

      const gotoFrame = (f) => {
        if (!player || !isLoaded) return;
        const length = player.get_length();
        const wrapped = ((f % length) + length) % length;
        player.move_to(wrapped);
        setCurrentFrame(wrapped);
      };

      const togglePlayPause = () => {
        if (!player || !isLoaded) return;
        if (isPlaying) {
          player.pause();
          setIsPlaying(false);
        } else {
          player.play();
          setIsPlaying(true);
        }
      };

      const next = () => gotoFrame(currentFrame + 1);
      const prev = () => gotoFrame(currentFrame - 1);
      const first = () => gotoFrame(0);
      const last = () => gotoFrame(frameCount - 1);

      const buttonStyle = {
        cursor: 'pointer',
        padding: '6px 10px',
        fontSize: '1.2rem',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji",system-ui,sans-serif',
        transition: 'all 0.2s ease',
      };

      const sliderStyle = {
            width: `${originalGIFwidth - 25}px`,
            height: '6px',
            margin: '0 0 6px',
            cursor: 'pointer',
            accentColor: '#667eea',
            accentColor: '#ff0000'
        };

      return React.createElement('div', {
        ref: containerRef,
        style: {
          position: 'relative',
          display: 'inline-block',
          userSelect: 'none',
          minWidth: !isLoaded ? '200px' : 'auto',
          minHeight: !isLoaded ? '150px' : 'auto',
          backgroundColor: isLoaded ? 'transparent' : '#f0f0f0',
          borderRadius: '8px',
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      },

      // Loading indicator
      !isLoaded && React.createElement('div', {
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.1rem',
          color: '#333',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 11,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontFamily: 'system-ui, sans-serif',
        }
      }, 'Loading GIF...'),

      // Hover controls with slider
      isHovered && isLoaded && React.createElement(
        'div', {
          style: {
            position: 'absolute',
            top: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            // backdropFilter: 'blur(4px)',
            borderRadius: '12px',
            padding: '4px 12px 8px',
            zIndex: 10,
            pointerEvents: 'auto',
            // boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }
        },

        // Slider
        React.createElement('input', {
          type: 'range',
          min: 0,
          max: frameCount - 1,
          value: currentFrame,
          onChange: e => {
            const frame = Number(e.target.value);
            gotoFrame(frame);
          },
          onInput: e => setCurrentFrame(Number(e.target.value)),
          style: sliderStyle
        }),

        // Control buttons
        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement('button', { 
            onClick: e => { e.stopPropagation(); first(); }, 
            style: { ...buttonStyle, ':hover': { backgroundColor: 'rgba(0,0,0,0.9)' } },
            title: 'First Frame'
          }, '⏮️'),
          React.createElement('button', { 
            onClick: e => { e.stopPropagation(); prev(); }, 
            style: buttonStyle,
            title: 'Previous Frame'
          }, '⏪'),
          React.createElement('button', { 
            onClick: e => { e.stopPropagation(); togglePlayPause(); }, 
            style: { ...buttonStyle, backgroundColor: isPlaying ? 'rgba(255,0,0,0.7)' : 'rgba(0,128,0,0.7)' },
            title: isPlaying ? 'Pause' : 'Play'
          }, isPlaying ? '⏸️' : '▶️'),
          React.createElement('button', { 
            onClick: e => { e.stopPropagation(); next(); }, 
            style: buttonStyle,
            title: 'Next Frame'
          }, '⏩'),
          React.createElement('button', { 
            onClick: e => { e.stopPropagation(); last(); }, 
            style: buttonStyle,
            title: 'Last Frame'
          }, '⏭️')
        )
      ),

      // Frame counter
      isLoaded && React.createElement('div', {
        style: {
          position: 'absolute',
          bottom: '8px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          pointerEvents: 'none',
          zIndex: 10,
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }
      }, `${currentFrame + 1}/${frameCount}`)
      );
    }

    // Handle direct GIF URLs
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
      document.body.innerHTML = '';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100vh';
      document.body.style.backgroundColor = '#1a1a1a';

      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.height = '100vh';
      wrapper.style.width = '100vw';
      wrapper.style.margin = '0';

      const container = document.createElement('div');
      const root = window.ReactDOM.createRoot(container);
      root.render(React.createElement(GifPlayer, { src: window.location.href }));

      wrapper.appendChild(container);
      document.body.appendChild(wrapper);
      return;
    }

    // Replace GIFs on normal pages
    function replaceGIFs() {
      document.querySelectorAll('img:not([data-gif-replaced])').forEach(img => {
        if (!img.src.toLowerCase().includes('.gif')) return;
        
        img.setAttribute('data-gif-replaced', 'true');

        const container = document.createElement('div');
        container.style.display = img.style.display || 'inline-block';
        container.style.verticalAlign = getComputedStyle(img).verticalAlign || 'baseline';

        if (img.parentNode) {
          img.parentNode.insertBefore(container, img);
          img.style.display = 'none';
        }

        const root = window.ReactDOM.createRoot(container);
        root.render(React.createElement(GifPlayer, { 
          src: img.src,
          originalElement: img 
        }));
      });
    }

    // Initial replacement and observer setup
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', replaceGIFs);
    } else {
      replaceGIFs();
    }

    const observer = new MutationObserver(() => {
      setTimeout(replaceGIFs, 100); // Small delay to ensure DOM changes are complete
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle dynamically loaded content
    window.addEventListener('load', replaceGIFs);
    
    // Handle history navigation (SPAs)
    window.addEventListener('popstate', () => {
      setTimeout(replaceGIFs, 500);
    });
  }).catch(error => {
    console.error('GIF Controller extension error:', error);
  });
})();
