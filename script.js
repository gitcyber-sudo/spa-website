// ===== SPA WEBSITE - INTERACTIVE EXPERIENCE =====

class SpaExperience {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all components
        this.setupEventListeners();
        this.setupParallax();
        this.setupParticles();
        this.setupCounters();
        this.setupTextAnimations();
        this.setupSoundToggle();
        this.setupNavigation();
        this.setupTreatmentSelector();
        this.setupAromaSelector();
        this.setupTimeSelector();
        this.setupMouseFollow();
        this.hideLoadingScreen();
    }

    // ===== LOADING SCREEN =====
    hideLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.querySelector('.loading-screen').classList.add('loaded');
                setTimeout(() => {
                    document.querySelector('.loading-screen').style.display = 'none';
                }, 800);
            }, 1500);
        });
    }

    // ===== PARALLAX SCROLLING =====
    setupParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            layers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // ===== PARTICLE SYSTEM =====
    setupParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(212, 175, 143, ${Math.random() * 0.5 + 0.1})`;
                this.originalSize = this.size;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
                if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
                
                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.size = this.originalSize * 2;
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                } else {
                    this.size = this.originalSize;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particles
        function initParticles() {
            particles = [];
            const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Animation loop
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(250, 248, 245, 0.05)');
            gradient.addColorStop(1, 'rgba(212, 175, 143, 0.02)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        // Mouse move listener
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
        
        // Initialize
        resizeCanvas();
        initParticles();
        animateParticles();
    }

    // ===== ANIMATED COUNTERS =====
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Lower is faster
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const increment = target / speed;
                    
                    const updateCount = () => {
                        const current = +counter.innerText;
                        
                        if (current < target) {
                            counter.innerText = Math.ceil(current + increment);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    // ===== TEXT REVEAL ANIMATIONS =====
    setupTextAnimations() {
        const splitTexts = document.querySelectorAll('.split-text');
        const revealTexts = document.querySelectorAll('.reveal-text');
        
        // Split text animation
        splitTexts.forEach((text, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animated');
                        }, index * 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(text);
        });
        
        // Reveal text animation
        revealTexts.forEach((text, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, index * 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(text);
        });
    }

    // ===== SOUND TOGGLE =====
    setupSoundToggle() {
        const soundToggle = document.querySelector('.sound-toggle');
        const windSound = document.getElementById('windSound');
        const waterSound = document.getElementById('waterSound');
        let isSoundOn = false;
        
        soundToggle.addEventListener('click', () => {
            isSoundOn = !isSoundOn;
            soundToggle.classList.toggle('active', isSoundOn);
            
            if (isSoundOn) {
                windSound.volume = 0.3;
                waterSound.volume = 0.2;
                windSound.play().catch(e => console.log('Audio play failed:', e));
                waterSound.play().catch(e => console.log('Audio play failed:', e));
            } else {
                windSound.pause();
                waterSound.pause();
            }
        });
    }

    // ===== FLOATING NAVIGATION =====
    setupNavigation() {
        const navDots = document.querySelectorAll('.nav-dot');
        const sections = document.querySelectorAll('.fullscreen-section');
        
        // Smooth scroll to section
        navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('data-section');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Update active dot on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navDots.forEach(dot => {
                        dot.classList.toggle('active', dot.getAttribute('data-section') === sectionId);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }

    // ===== TREATMENT SELECTOR =====
    setupTreatmentSelector() {
        const selectorBtns = document.querySelectorAll('.selector-btn');
        const flipCards = document.querySelectorAll('.flip-card');
        
        selectorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                selectorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show/hide relevant cards
                const treatmentType = btn.getAttribute('data-treatment');
                
                flipCards.forEach(card => {
                    if (card.getAttribute('data-treatment') === treatmentType) {
                        card.classList.add('active');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.style.filter = 'blur(0)';
                        }, 300);
                    } else {
                        card.classList.remove('active');
                        card.style.opacity = '0.3';
                        card.style.transform = 'scale(0.9)';
                        card.style.filter = 'blur(2px)';
                    }
                });
            });
        });
    }

    // ===== AROMA SELECTOR =====
    setupAromaSelector() {
        const aromaCircles = document.querySelectorAll('.aroma-circle');
        const aromaInfos = document.querySelectorAll('.aroma-info');
        
        aromaCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                // Update active circle
                aromaCircles.forEach(c => c.classList.remove('active'));
                circle.classList.add('active');
                
                // Show relevant info
                const aromaType = circle.getAttribute('data-aroma');
                
                aromaInfos.forEach(info => {
                    info.classList.toggle('active', info.getAttribute('data-aroma') === aromaType);
                });
                
                // Add visual feedback
                circle.style.animation = 'none';
                setTimeout(() => {
                    circle.style.animation = 'circle-rotate 20s linear infinite';
                }, 10);
            });
        });
    }

    // ===== TIME SELECTOR =====
    setupTimeSelector() {
        const timeOptions = document.querySelectorAll('.time-option');
        const backgroundLayers = document.querySelectorAll('.bg-time');
        
        timeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update active option
                timeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Update background
                const time = option.getAttribute('data-time');
                
                backgroundLayers.forEach(layer => {
                    layer.classList.toggle('active', layer.classList.contains(`bg-${time}`));
                });
            });
        });
    }

    // ===== MOUSE FOLLOW EFFECT =====
    setupMouseFollow() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        
        hero.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = hero.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            // Move background slightly
            const backLayer = hero.querySelector('.layer-back');
            if (backLayer) {
                const moveX = (x - 0.5) * 20;
                const moveY = (y - 0.5) * 20;
                backLayer.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            }
            
            // Move crystals
            const crystals = hero.querySelectorAll('.floating-crystal');
            crystals.forEach((crystal, index) => {
                const speed = index === 0 ? 0.1 : 0.05;
                const crystalX = (x - 0.5) * 40 * speed;
                const crystalY = (y - 0.5) * 40 * speed;
                crystal.style.transform = `translate(${crystalX}px, ${crystalY}px)`;
            });
        });
        
        // Reset on mouse leave
        hero.addEventListener('mouseleave', () => {
            const backLayer = hero.querySelector('.layer-back');
            if (backLayer) {
                backLayer.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    }

    // ===== EVENT LISTENERS SETUP =====
    setupEventListeners() {
        // CTA buttons
        document.querySelectorAll('[data-scroll-to]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-scroll-to');
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Info card buttons
        document.querySelectorAll('.map-btn, .book-btn, .private-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                `;
                
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
                
                // Show booking modal (simulated)
                if (btn.classList.contains('book-btn')) {
                    alert('Booking system would open here. For now, call (555) 123-4567 to book your experience!');
                }
            });
        });
        
        // Add ripple animation to CSS
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== INITIALIZE WHEN DOM IS LOADED =====
document.addEventListener('DOMContentLoaded', () => {
    new SpaExperience();
});

// ===== ENHANCE SCROLLING WITH MOMENTUM =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    document.body.classList.add('scrolling');
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 100);
});

// ===== LAZY LOAD IMAGES =====
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});