(function () {
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            if ([...document.scripts].some(s => s.src === url)) return resolve();
            const script = document.createElement('script');
            script.src = url;
            script.crossOrigin = 'anonymous';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    } 

    const reactCDN = 'https://unpkg.com/react@18/umd/react.development.js';
    const reactDomCDN = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
    const libGifCDN = 'https://cdn.jsdelivr.net/gh/buzzfeed/libgif-js@master/libgif.js';

    Promise.resolve()
        .then(() => loadScript(reactCDN))
        .then(() => loadScript(reactDomCDN))
        .then(() => loadScript(libGifCDN))
        .then(() => {
            const { useState, useEffect, useRef } = window.React;

            function GifPlayer({ src }) {
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
                    //   document.body.appendChild(hiddenImg);
                    
                    hiddenImg.onload = () => {
                        if (!window.SuperGif || !containerRef.current) return;
                        setOriginalGIFwidth(hiddenImg.naturalWidth);

                        superGif = new window.SuperGif({
                            gif: hiddenImg,
                            auto_play: false,
                            loop_mode: true,
                            progressbar_height: 0
                        });

                        superGif.load(() => {
                            const canvas = superGif.get_canvas();
                            canvas.style.display = 'none';

                            // Preserve original GIF dimensions
                            canvas.width = hiddenImg.naturalWidth;
                            canvas.height = hiddenImg.naturalHeight;
                            canvas.style.width = hiddenImg.naturalWidth + 'px';
                            canvas.style.height = hiddenImg.naturalHeight + 'px';
                            canvas.style.display = 'block';
                            canvas.style.border = '2px solid #667eea';
                            canvas.style.borderRadius = '8px';
                            canvas.style.cursor = 'pointer';
                            containerRef.current.appendChild(canvas);
                            
                            canvas.style.display = 'block';
                    
                            // Click handler: play/pause toggle based on actual SuperGif state
                            canvas.onclick = () => {
                                if (!superGif) return;
                                if (superGif.get_playing()) {
                                superGif.pause();
                                } else {
                                superGif.play();
                                }
                                // Update React state as well
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

                const stop = () => {
                    if (!player || !isLoaded) return;
                    if (isPlaying) {
                        player.pause();
                        // gotoFrame(0);
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
                    },
                    onMouseEnter: () => setIsHovered(true),
                    onMouseLeave: () => setIsHovered(false),
                },

                // Loading indicator (centered, only while loading)
                !isLoaded && React.createElement('div', {
                    style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.1rem',
                    // backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#333',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    zIndex: 11,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
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
                            // backgroundColor: 'rgba(255,255,255,0.15)',
                            backgroundColor: 'transparent',
                            // backdropFilter: 'blur(8px)',
                            borderRadius: '12px',
                            padding: '4px 12px 8px',
                            zIndex: 10,
                            pointerEvents: 'auto'
                        }
                    },

                    // Cute slider above buttons
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
                    // Buttons row
                    React.createElement('div', { style: { display: 'flex', gap: '8px' } },
                        React.createElement('button', { onClick: e => { e.stopPropagation(); first(); }, style: buttonStyle }, '⏮️'),
                        React.createElement('button', { onClick: e => { e.stopPropagation(); prev(); }, style: buttonStyle }, '⏪'),
                        React.createElement('button', { onClick: e => { e.stopPropagation(); stop(); }, style: buttonStyle }, '⏯️'),
                        React.createElement('button', { onClick: e => { e.stopPropagation(); next(); }, style: buttonStyle }, '⏩'),
                        React.createElement('button', { onClick: e => { e.stopPropagation(); last(); }, style: buttonStyle }, '⏭️')
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
                    }
                }, `${currentFrame + 1}/${frameCount}`)
                );
            }

            class ImgGifElement extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open' });
                }

                static get observedAttributes() {
                    return ['src'];
                }

                connectedCallback() {
                    this.render();
                }

                attributeChangedCallback() {
                    this.render();
                }

                render() {
                    const src = this.getAttribute('src');
                    if (!src) return;

                    this.shadowRoot.innerHTML = `
                        <style>
                        :host {
                            display: inline-block;
                            max-width: 100%;
                            font-family: system-ui, sans-serif;
                        }
                        </style>
                        <div id="react-root"></div>
                    `;
                    const root = this.shadowRoot.getElementById('react-root');
                    window.ReactDOM.createRoot(root).render(React.createElement(GifPlayer, { src }));
                }
            }
            customElements.define('img-gif', ImgGifElement);
        })
    .catch(e => console.error('img-gif failed to load dependencies:', e));
})();
