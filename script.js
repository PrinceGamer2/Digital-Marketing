/**
 * EXPLAINUR - MAIN JAVASCRIPT
 * Features: 8 Tools, Dark/Light Mode, Animations, Accessibility
 * Performance: Lazy loading, Intersection Observer, Debounced events
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Copy to clipboard utility
const copyToClipboard = async (text, button) => {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    }
};

// ============================================
// THEME MANAGEMENT - ENHANCED WITH ANIMATIONS
// ============================================

const initTheme = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use system preference
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return prefersDarkScheme.matches ? 'dark' : 'light';
    };
    
    // Apply theme with animation
    const applyTheme = (theme, animate = true) => {
        const body = document.body;
        
        if (animate) {
            // Add transition class
            body.classList.add('theme-transitioning');
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'theme-ripple';
            const rect = themeToggle.getBoundingClientRect();
            ripple.style.left = rect.left + rect.width / 2 + 'px';
            ripple.style.top = rect.top + rect.height / 2 + 'px';
            document.body.appendChild(ripple);
            
            // Trigger reflow
            ripple.offsetHeight;
            ripple.classList.add('active');
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (animate) {
            // Remove animation classes after transition
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
                const ripple = document.querySelector('.theme-ripple');
                if (ripple) ripple.remove();
            }, 600);
        }
        
        // Update toggle button animation
        updateToggleAnimation(theme);
    };
    
    // Animate toggle button
    const updateToggleAnimation = (theme) => {
        const sun = themeToggle.querySelector('.sun');
        const moon = themeToggle.querySelector('.moon');
        
        if (theme === 'dark') {
            sun.style.transform = 'rotate(180deg) scale(0)';
            sun.style.opacity = '0';
            moon.style.transform = 'rotate(0deg) scale(1)';
            moon.style.opacity = '1';
        } else {
            sun.style.transform = 'rotate(0deg) scale(1)';
            sun.style.opacity = '1';
            moon.style.transform = 'rotate(-180deg) scale(0)';
            moon.style.opacity = '0';
        }
    };
    
    // Initialize with animation
    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme, false);
    
    // Toggle handler with enhanced animation
    themeToggle.addEventListener('click', () => {
        // Add click animation
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme, true);
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light', true);
        }
    });
};

// ============================================
// NAVIGATION & MOBILE MENU
// ============================================

const initNavigation = () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.opacity = '0.98';
        } else {
            header.style.opacity = '';
        }
        
        lastScroll = currentScroll;
    }, 100));
};

// ============================================
// TYPING ANIMATION
// ============================================

const initTypingAnimation = () => {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const phrases = [
        'Master Digital Marketing',
        'Boost Your SEO Strategy',
        'Create Viral Content',
        'Grow Your Business'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const type = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before new phrase
        }
        
        setTimeout(type, typingSpeed);
    };
    
    // Start typing animation
    setTimeout(type, 1000);
};

// ============================================
// PARTICLE BACKGROUND
// ============================================

const initParticles = () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const particleCount = isTouchDevice ? 15 : 25;
    
    const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    const init = () => {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };
    
    const connectParticles = () => {
        const maxDistance = 100;
        const maxConnections = 3;
        
        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance && connections < maxConnections) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    connections++;
                }
            }
        }
    };
    
    let frameCount = 0;
    const animate = () => {
        if (!isActive) return;
        
        frameCount++;
        // Render every 2nd frame for performance
        if (frameCount % 2 === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
        }
        
        animationId = requestAnimationFrame(animate);
    };
    
    // Initialize
    init();
    animate();
    
    // Handle resize
    window.addEventListener('resize', debounce(init, 250));
    
    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isActive = entry.isIntersecting;
            if (isActive && !animationId) {
                animate();
            } else if (!isActive && animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });
    
    observer.observe(canvas);
};

// ============================================
// ANIMATED COUNTERS
// ============================================

const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
};

// ============================================
// SCROLL ANIMATIONS
// ============================================

const initScrollAnimations = () => {
    // Elements with different animation types
    const animatedElements = [
        { selector: '.tool-card', animation: 'fadeInUp', delay: 0.05 },
        { selector: '.article-card', animation: 'fadeInUp', delay: 0.1 },
        { selector: '.feature-card', animation: 'fadeInUp', delay: 0.08 },
        { selector: '.step-card', animation: 'fadeInUp', delay: 0.1 },
        { selector: '.faq-item', animation: 'fadeInRight', delay: 0.05 },
        { selector: '.section-header', animation: 'fadeInUp', delay: 0 },
        { selector: '.stat-item', animation: 'scaleIn', delay: 0.1 }
    ];
    
    // Animation keyframes
    const animations = {
        fadeInUp: { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0)'] },
        fadeInDown: { opacity: [0, 1], transform: ['translateY(-40px)', 'translateY(0)'] },
        fadeInLeft: { opacity: [0, 1], transform: ['translateX(-40px)', 'translateX(0)'] },
        fadeInRight: { opacity: [0, 1], transform: ['translateX(40px)', 'translateX(0)'] },
        scaleIn: { opacity: [0, 1], transform: ['scale(0.8)', 'scale(1)'] },
        rotateIn: { opacity: [0, 1], transform: ['rotate(-10deg) scale(0.9)', 'rotate(0deg) scale(1)'] }
    };
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    animatedElements.forEach(({ selector, animation, delay }) => {
        const elements = document.querySelectorAll(selector);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const anim = animations[animation];
                    
                    // Apply animation with staggered delay
                    setTimeout(() => {
                        el.animate([
                            { opacity: anim.opacity[0], transform: anim.transform[0] },
                            { opacity: anim.opacity[1], transform: anim.transform[1] }
                        ], {
                            duration: 600,
                            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            fill: 'forwards'
                        });
                        
                        el.style.opacity = '1';
                        el.style.transform = anim.transform[1];
                    }, index * delay * 1000);
                    
                    observer.unobserve(el);
                }
            });
        }, observerOptions);
        
        elements.forEach((el, index) => {
            const anim = animations[animation];
            el.style.opacity = '0';
            el.style.transform = anim.transform[0];
            el.style.transition = 'none';
            observer.observe(el);
        });
    });
    
    // Staggered list animations
    const listContainers = document.querySelectorAll('.tools-grid, .articles-grid, .features-grid, .steps-grid');
    listContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.05}s`;
        });
    });
};

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

const initScrollProgress = () => {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    };
    
    window.addEventListener('scroll', throttle(updateProgress, 16));
    updateProgress();
};

// ============================================
// PARALLAX EFFECTS
// ============================================

const initParallax = () => {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const floatingShapes = document.querySelectorAll('.floating-shape');
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        floatingShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
        });
    };
    
    window.addEventListener('scroll', throttle(handleScroll, 16));
};

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================

const initMagneticButtons = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const buttons = document.querySelectorAll('.magnetic-btn, .btn-primary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
};

// ============================================
// CURSOR GLOW EFFECT
// ============================================

const initCursorGlow = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const animate = () => {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(animate);
    };
    animate();
};

// ============================================
// TYPEWRITER EFFECT ENHANCEMENT
// ============================================

const initTypewriterEffect = () => {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const phrases = [
        'Master Digital Marketing',
        'Boost Your SEO Rankings',
        'Create Viral Content',
        'Track Marketing ROI',
        'Optimize Social Media'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let pauseTime = 2000;
    
    const type = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = pauseTime;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    };
    
    // Start with a small delay
    setTimeout(type, 1000);
};

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================

const initTestimonials = () => {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentSlide = 0;
    let autoplayInterval;
    
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.setAttribute('aria-selected', i === index);
        });
        
        currentSlide = index;
    };
    
    const nextSlide = () => {
        showSlide((currentSlide + 1) % slides.length);
    };
    
    const prevSlide = () => {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    };
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });
    
    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    };
    
    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };
    
    startAutoplay();
    
    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carousel.addEventListener('mouseleave', startAutoplay);
};

// ============================================
// FLOATING ACTION BUTTON
// ============================================

const initFab = () => {
    const fab = document.getElementById('fab');
    const toolsSection = document.getElementById('tools');
    
    const toggleFab = () => {
        const toolsRect = toolsSection.getBoundingClientRect();
        const isPastTools = toolsRect.bottom < 0;
        
        if (isPastTools) {
            fab.classList.add('hidden');
        } else {
            fab.classList.remove('hidden');
        }
    };
    
    fab.addEventListener('click', () => {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', throttle(toggleFab, 100));
};

// ============================================
// TOOLS MODAL SYSTEM
// ============================================

const tools = {
    'meta-tags': {
        title: 'Meta Tag Generator',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div>
                    <label class="form-label" for="meta-title">Page Title</label>
                    <input type="text" id="meta-title" class="form-input" placeholder="Enter page title (50-60 characters)" maxlength="60">
                </div>
                <div>
                    <label class="form-label" for="meta-desc">Meta Description</label>
                    <textarea id="meta-desc" class="form-textarea" placeholder="Enter meta description (150-160 characters)" maxlength="160"></textarea>
                </div>
                <div>
                    <label class="form-label" for="meta-url">Page URL</label>
                    <input type="url" id="meta-url" class="form-input" placeholder="https://example.com/page">
                </div>
                <div>
                    <label class="form-label" for="meta-image">Image URL</label>
                    <input type="url" id="meta-image" class="form-input" placeholder="https://example.com/image.jpg">
                </div>
                <button type="button" class="btn btn-primary" id="generate-meta">Generate Meta Tags</button>
                <div id="meta-output" class="tool-output" style="display: none;"></div>
                <button type="button" class="btn btn-secondary copy-btn" id="copy-meta" style="display: none;">Copy to Clipboard</button>
            </form>
        `,
        init: () => {
            const generateBtn = document.getElementById('generate-meta');
            const copyBtn = document.getElementById('copy-meta');
            const output = document.getElementById('meta-output');
            
            generateBtn.addEventListener('click', () => {
                const title = document.getElementById('meta-title').value || 'Page Title';
                const desc = document.getElementById('meta-desc').value || 'Page description';
                const url = document.getElementById('meta-url').value || 'https://example.com';
                const image = document.getElementById('meta-image').value || 'https://example.com/image.jpg';
                
                const metaTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image}">`;
                
                output.textContent = metaTags;
                output.style.display = 'block';
                copyBtn.style.display = 'block';
            });
            
            copyBtn.addEventListener('click', () => {
                copyToClipboard(output.textContent, copyBtn);
            });
        }
    },
    
    'word-counter': {
        title: 'Word Counter & Reading Time',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div>
                    <label class="form-label" for="word-input">Paste your text</label>
                    <textarea id="word-input" class="form-textarea" placeholder="Start typing or paste your text here..." rows="10"></textarea>
                </div>
                <div class="score-breakdown">
                    <div class="score-item">
                        <span>Words:</span>
                        <strong id="word-count">0</strong>
                    </div>
                    <div class="score-item">
                        <span>Characters:</span>
                        <strong id="char-count">0</strong>
                    </div>
                    <div class="score-item">
                        <span>Sentences:</span>
                        <strong id="sentence-count">0</strong>
                    </div>
                    <div class="score-item">
                        <span>Reading Time:</span>
                        <strong id="reading-time">0 min</strong>
                    </div>
                </div>
            </form>
        `,
        init: () => {
            const input = document.getElementById('word-input');
            const wordCount = document.getElementById('word-count');
            const charCount = document.getElementById('char-count');
            const sentenceCount = document.getElementById('sentence-count');
            const readingTime = document.getElementById('reading-time');
            
            const updateCounts = () => {
                const text = input.value;
                const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                const chars = text.length;
                const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
                const minutes = Math.ceil(words / 200);
                
                wordCount.textContent = words;
                charCount.textContent = chars;
                sentenceCount.textContent = sentences;
                readingTime.textContent = minutes + (minutes === 1 ? ' min' : ' mins');
            };
            
            input.addEventListener('input', debounce(updateCounts, 100));
        }
    },
    
    'utm-builder': {
        title: 'UTM Link Builder',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div>
                    <label class="form-label" for="utm-url">Website URL *</label>
                    <input type="url" id="utm-url" class="form-input" placeholder="https://example.com/page" required>
                </div>
                <div>
                    <label class="form-label" for="utm-source">Source *</label>
                    <input type="text" id="utm-source" class="form-input" placeholder="google, facebook, newsletter" required>
                </div>
                <div>
                    <label class="form-label" for="utm-medium">Medium *</label>
                    <input type="text" id="utm-medium" class="form-input" placeholder="cpc, email, social" required>
                </div>
                <div>
                    <label class="form-label" for="utm-campaign">Campaign Name</label>
                    <input type="text" id="utm-campaign" class="form-input" placeholder="summer_sale, product_launch">
                </div>
                <div>
                    <label class="form-label" for="utm-content">Content (optional)</label>
                    <input type="text" id="utm-content" class="form-input" placeholder="ad_variant_a, banner_1">
                </div>
                <button type="button" class="btn btn-primary" id="generate-utm">Generate UTM Link</button>
                <div id="utm-output" class="tool-output" style="display: none;"></div>
                <button type="button" class="btn btn-secondary copy-btn" id="copy-utm" style="display: none;">Copy to Clipboard</button>
            </form>
        `,
        init: () => {
            const generateBtn = document.getElementById('generate-utm');
            const copyBtn = document.getElementById('copy-utm');
            const output = document.getElementById('utm-output');
            
            generateBtn.addEventListener('click', () => {
                const url = document.getElementById('utm-url').value;
                const source = document.getElementById('utm-source').value;
                const medium = document.getElementById('utm-medium').value;
                const campaign = document.getElementById('utm-campaign').value;
                const content = document.getElementById('utm-content').value;
                
                if (!url || !source || !medium) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                let utmUrl = url;
                const separator = url.includes('?') ? '&' : '?';
                utmUrl += `${separator}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}`;
                
                if (campaign) utmUrl += `&utm_campaign=${encodeURIComponent(campaign)}`;
                if (content) utmUrl += `&utm_content=${encodeURIComponent(content)}`;
                
                output.textContent = utmUrl;
                output.style.display = 'block';
                copyBtn.style.display = 'block';
            });
            
            copyBtn.addEventListener('click', () => {
                copyToClipboard(output.textContent, copyBtn);
            });
        }
    },
    
    'char-counter': {
        title: 'Social Media Character Counter',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div class="platform-tabs">
                    <button type="button" class="platform-tab active" data-platform="twitter" data-limit="280">Twitter/X</button>
                    <button type="button" class="platform-tab" data-platform="instagram" data-limit="2200">Instagram</button>
                    <button type="button" class="platform-tab" data-platform="linkedin" data-limit="3000">LinkedIn</button>
                    <button type="button" class="platform-tab" data-platform="facebook" data-limit="63206">Facebook</button>
                </div>
                <div>
                    <label class="form-label" for="social-text">Your message</label>
                    <textarea id="social-text" class="form-textarea" placeholder="Type your post here..." rows="6"></textarea>
                </div>
                <div class="char-counter">
                    <span class="char-count"><strong id="current-chars">0</strong> characters</span>
                    <span class="char-limit" id="char-limit">280 limit</span>
                </div>
            </form>
        `,
        init: () => {
            const tabs = document.querySelectorAll('.platform-tab');
            const input = document.getElementById('social-text');
            const currentChars = document.getElementById('current-chars');
            const charLimit = document.getElementById('char-limit');
            
            let limit = 280;
            
            const updateCounter = () => {
                const length = input.value.length;
                currentChars.textContent = length;
                
                const remaining = limit - length;
                charLimit.textContent = `${remaining} remaining`;
                
                charLimit.classList.remove('warning', 'error');
                if (remaining < 0) {
                    charLimit.classList.add('error');
                } else if (remaining < 20) {
                    charLimit.classList.add('warning');
                }
            };
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    limit = parseInt(tab.dataset.limit);
                    charLimit.textContent = `${limit} limit`;
                    updateCounter();
                });
            });
            
            input.addEventListener('input', debounce(updateCounter, 50));
        }
    },
    
    'color-palette': {
        title: 'Color Palette Generator',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <button type="button" class="btn btn-primary" id="generate-palette">Generate Palette</button>
                <div id="palette-output" class="color-palette"></div>
                <div id="palette-info" style="text-align: center; color: var(--text-secondary); margin-top: var(--space-md);">
                    Click any color to copy its hex code
                </div>
            </form>
        `,
        init: () => {
            const generateBtn = document.getElementById('generate-palette');
            const output = document.getElementById('palette-output');
            
            const generateRandomColor = () => {
                return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            };
            
            const generateHarmoniousPalette = () => {
                const baseHue = Math.floor(Math.random() * 360);
                const colors = [];
                
                // Generate harmonious colors
                for (let i = 0; i < 5; i++) {
                    const hue = (baseHue + (i * 30)) % 360;
                    const saturation = 60 + Math.floor(Math.random() * 30);
                    const lightness = 40 + Math.floor(Math.random() * 40);
                    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
                }
                
                return colors;
            };
            
            const hslToHex = (hsl) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = hsl;
                return ctx.fillStyle;
            };
            
            const displayPalette = () => {
                const colors = generateHarmoniousPalette();
                output.innerHTML = '';
                
                colors.forEach(color => {
                    const hex = hslToHex(color);
                    const swatch = document.createElement('div');
                    swatch.className = 'color-swatch';
                    swatch.style.backgroundColor = color;
                    swatch.setAttribute('data-color', hex);
                    swatch.setAttribute('tabindex', '0');
                    swatch.setAttribute('role', 'button');
                    swatch.setAttribute('aria-label', `Copy color ${hex}`);
                    
                    swatch.addEventListener('click', () => {
                        copyToClipboard(hex, { textContent: 'Copy' });
                        swatch.style.transform = 'scale(1.2)';
                        setTimeout(() => swatch.style.transform = '', 200);
                    });
                    
                    swatch.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            swatch.click();
                        }
                    });
                    
                    output.appendChild(swatch);
                });
            };
            
            generateBtn.addEventListener('click', displayPalette);
            displayPalette(); // Generate initial palette
        }
    },
    
    'og-preview': {
        title: 'Open Graph Preview',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div>
                    <label class="form-label" for="og-title-input">Title</label>
                    <input type="text" id="og-title-input" class="form-input" placeholder="Page title" value="Your Page Title">
                </div>
                <div>
                    <label class="form-label" for="og-desc-input">Description</label>
                    <textarea id="og-desc-input" class="form-textarea" placeholder="Page description" rows="3">Your page description goes here. This is how it will appear when shared on social media.</textarea>
                </div>
                <div>
                    <label class="form-label" for="og-url-input">URL</label>
                    <input type="text" id="og-url-input" class="form-input" placeholder="example.com" value="example.com">
                </div>
                <div class="og-preview">
                    <div class="og-image">No Image</div>
                    <div class="og-content">
                        <div class="og-url" id="og-preview-url">EXAMPLE.COM</div>
                        <div class="og-title" id="og-preview-title">Your Page Title</div>
                        <div class="og-desc" id="og-preview-desc">Your page description goes here. This is how it will appear when shared on social media.</div>
                    </div>
                </div>
            </form>
        `,
        init: () => {
            const titleInput = document.getElementById('og-title-input');
            const descInput = document.getElementById('og-desc-input');
            const urlInput = document.getElementById('og-url-input');
            const previewTitle = document.getElementById('og-preview-title');
            const previewDesc = document.getElementById('og-preview-desc');
            const previewUrl = document.getElementById('og-preview-url');
            
            const updatePreview = () => {
                previewTitle.textContent = titleInput.value || 'Your Page Title';
                previewDesc.textContent = descInput.value || 'Your page description goes here.';
                previewUrl.textContent = (urlInput.value || 'example.com').toUpperCase();
            };
            
            titleInput.addEventListener('input', debounce(updatePreview, 100));
            descInput.addEventListener('input', debounce(updatePreview, 100));
            urlInput.addEventListener('input', debounce(updatePreview, 100));
        }
    },
    
    'headline-analyzer': {
        title: 'Headline Analyzer',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div>
                    <label class="form-label" for="headline-input">Enter your headline</label>
                    <input type="text" id="headline-input" class="form-input" placeholder="e.g., 10 Tips to Boost Your SEO Rankings">
                </div>
                <button type="button" class="btn btn-primary" id="analyze-headline">Analyze Headline</button>
                <div id="headline-score" style="display: none;">
                    <div class="score-display">
                        <div class="score-value" id="score-value">0</div>
                        <div class="score-label">Headline Score</div>
                    </div>
                    <div class="score-breakdown">
                        <div class="score-item">
                            <span>Word Count:</span>
                            <strong id="headline-words">0</strong>
                        </div>
                        <div class="score-item">
                            <span>Has Numbers:</span>
                            <strong id="has-numbers">No</strong>
                        </div>
                        <div class="score-item">
                            <span>Power Words:</span>
                            <strong id="power-words">0</strong>
                        </div>
                        <div class="score-item">
                            <span>Emotional:</span>
                            <strong id="emotional">No</strong>
                        </div>
                    </div>
                </div>
            </form>
        `,
        init: () => {
            const analyzeBtn = document.getElementById('analyze-headline');
            const headlineInput = document.getElementById('headline-input');
            const scoreDisplay = document.getElementById('headline-score');
            const scoreValue = document.getElementById('score-value');
            const wordCount = document.getElementById('headline-words');
            const hasNumbers = document.getElementById('has-numbers');
            const powerWords = document.getElementById('power-words');
            const emotional = document.getElementById('emotional');
            
            const powerWordsList = ['amazing', 'exclusive', 'secret', 'free', 'instant', 'new', 'proven', 'simple', 'easy', 'quick', 'ultimate', 'essential', 'guaranteed', 'breakthrough', 'revolutionary'];
            const emotionalWords = ['love', 'hate', 'fear', 'angry', 'happy', 'sad', 'excited', 'worried', 'shocked', 'amazing', 'terrible', 'awesome', 'incredible'];
            
            analyzeBtn.addEventListener('click', () => {
                const headline = headlineInput.value.trim();
                if (!headline) {
                    alert('Please enter a headline');
                    return;
                }
                
                const words = headline.split(/\s+/);
                const wordCountValue = words.length;
                const hasNumbersValue = /\d/.test(headline);
                const powerWordsCount = words.filter(w => powerWordsList.includes(w.toLowerCase())).length;
                const hasEmotional = words.some(w => emotionalWords.includes(w.toLowerCase()));
                
                // Calculate score (0-100)
                let score = 50;
                if (wordCountValue >= 6 && wordCountValue <= 12) score += 15;
                if (hasNumbersValue) score += 15;
                score += powerWordsCount * 5;
                if (hasEmotional) score += 10;
                score = Math.min(100, score);
                
                scoreValue.textContent = score;
                wordCount.textContent = wordCountValue;
                hasNumbers.textContent = hasNumbersValue ? 'Yes' : 'No';
                powerWords.textContent = powerWordsCount;
                emotional.textContent = hasEmotional ? 'Yes' : 'No';
                
                scoreDisplay.style.display = 'block';
            });
        }
    },
    
    'lorem-ipsum': {
        title: 'Lorem Ipsum Generator',
        render: () => `
            <form class="tool-form" onsubmit="return false;">
                <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label" for="lorem-type">Generate</label>
                        <select id="lorem-type" class="form-select">
                            <option value="paragraphs">Paragraphs</option>
                            <option value="words">Words</option>
                            <option value="sentences">Sentences</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label class="form-label" for="lorem-count">Count</label>
                        <input type="number" id="lorem-count" class="form-input" value="3" min="1" max="50">
                    </div>
                </div>
                <button type="button" class="btn btn-primary" id="generate-lorem">Generate</button>
                <div id="lorem-output" class="tool-output" style="display: none; margin-top: var(--space-md);"></div>
                <button type="button" class="btn btn-secondary copy-btn" id="copy-lorem" style="display: none;">Copy to Clipboard</button>
            </form>
        `,
        init: () => {
            const generateBtn = document.getElementById('generate-lorem');
            const copyBtn = document.getElementById('copy-lorem');
            const output = document.getElementById('lorem-output');
            
            const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
            
            const words = loremText.replace(/[.,]/g, '').split(' ');
            const sentences = loremText.split(/[.!?]+/).filter(s => s.trim());
            const paragraphs = [
                loremText,
                `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
                `Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
                `Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`
            ];
            
            generateBtn.addEventListener('click', () => {
                const type = document.getElementById('lorem-type').value;
                const count = parseInt(document.getElementById('lorem-count').value) || 3;
                
                let result = '';
                
                switch(type) {
                    case 'paragraphs':
                        for (let i = 0; i < count; i++) {
                            result += paragraphs[i % paragraphs.length] + '\n\n';
                        }
                        break;
                    case 'words':
                        for (let i = 0; i < count; i++) {
                            result += words[i % words.length] + ' ';
                        }
                        result = result.trim() + '.';
                        break;
                    case 'sentences':
                        for (let i = 0; i < count; i++) {
                            result += sentences[i % sentences.length].trim() + '. ';
                        }
                        break;
                }
                
                output.textContent = result.trim();
                output.style.display = 'block';
                copyBtn.style.display = 'block';
            });
            
            copyBtn.addEventListener('click', () => {
                copyToClipboard(output.textContent, copyBtn);
            });
        }
    }
};

// ============================================
// MODAL MANAGEMENT
// ============================================

const initModals = () => {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const toolButtons = document.querySelectorAll('.btn-tool');
    
    const openModal = (toolKey) => {
        const tool = tools[toolKey];
        if (!tool) return;
        
        modalTitle.textContent = tool.title;
        modalBody.innerHTML = tool.render();
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Initialize tool-specific functionality
        if (tool.init) {
            tool.init();
        }
        
        // Focus management
        setTimeout(() => {
            const firstInput = modalBody.querySelector('input, textarea, button');
            if (firstInput) firstInput.focus();
        }, 100);
    };
    
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Return focus to trigger button
        const activeButton = document.querySelector(`[data-tool="${modalTitle.textContent.toLowerCase().replace(/\s+/g, '-')}"]`);
        if (activeButton) activeButton.focus();
    };
    
    // Tool button clicks
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const toolKey = btn.getAttribute('data-tool');
            openModal(toolKey);
        });
    });
    
    // Close handlers
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
};

// ============================================
// FORM VALIDATION
// ============================================

const initFormValidation = () => {
    const form = document.querySelector('.newsletter-form');
    const emailInput = document.getElementById('email-input');
    const errorDiv = document.getElementById('email-error');
    
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    form.addEventListener('submit', (e) => {
        const email = emailInput.value.trim();
        
        if (!email) {
            e.preventDefault();
            errorDiv.textContent = 'Please enter your email address';
            emailInput.focus();
        } else if (!validateEmail(email)) {
            e.preventDefault();
            errorDiv.textContent = 'Please enter a valid email address';
            emailInput.focus();
        } else {
            errorDiv.textContent = '';
        }
    });
    
    emailInput.addEventListener('input', () => {
        errorDiv.textContent = '';
    });
};

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

const initPerformanceOptimizations = () => {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const preloadLinks = [
        { rel: 'preload', href: 'styles.css', as: 'style' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ];
    
    preloadLinks.forEach(link => {
        const linkEl = document.createElement('link');
        Object.entries(link).forEach(([key, value]) => {
            linkEl.setAttribute(key, value);
        });
        document.head.appendChild(linkEl);
    });
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initTypingAnimation();
    initParticles();
    initCounters();
    initScrollAnimations();
    initTestimonials();
    initFab();
    initModals();
    initFormValidation();
    initPerformanceOptimizations();
});

// ============================================
// FAQ SECTION - AEO OPTIMIZED
// ============================================

const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('.faq-question');
        
        summary.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
        });
    });
    
    // FAQ link handling - open tool modals
    const faqLinks = document.querySelectorAll('.faq-answer a[data-tool]');
    faqLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const toolKey = link.getAttribute('data-tool');
            const toolButton = document.querySelector(`[data-tool="${toolKey}"]`);
            if (toolButton) {
                toolButton.click();
            }
        });
    });
};

// ============================================
// IMAGE LOADING OPTIMIZATION
// ============================================

const initImageLoading = () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        lazyImages.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.classList.add('loaded');
                    img.style.opacity = '0.5';
                });
                imageObserver.observe(img);
            }
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.classList.add('loaded');
        });
    }
};

// ============================================
// ENHANCED PERFORMANCE OPTIMIZATIONS
// ============================================

const initEnhancedPerformance = () => {
    // Preload critical hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage && 'fetchPriority' in heroImage) {
        heroImage.fetchPriority = 'high';
    }
    
    // Add resource hints
    const preloadLinks = [
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        { rel: 'preconnect', href: 'https://cdn-icons-png.flaticon.com' }
    ];
    
    preloadLinks.forEach(link => {
        if (!document.querySelector(`link[href="${link.href}"]`)) {
            const linkEl = document.createElement('link');
            Object.entries(link).forEach(([key, value]) => {
                linkEl.setAttribute(key, value);
            });
            document.head.appendChild(linkEl);
        }
    });
};

// ============================================
// ENHANCED INITIALIZATION
// ============================================

const originalInit = document.readyState === 'loading' ? null : 'alreadyLoaded';

document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for transition disabling
    document.body.classList.add('loaded');
    
    // Core Features
    initTheme();
    initNavigation();
    initTypingAnimation();
    initParticles();
    initCounters();
    initScrollAnimations();
    initTestimonials();
    initFab();
    initModals();
    initFormValidation();
    initPerformanceOptimizations();
    
    // AEO & Image Features
    initFAQ();
    initImageLoading();
    initEnhancedPerformance();
    
    // Enhanced Animations
    initScrollProgress();
    initParallax();
    initMagneticButtons();
    initCursorGlow();
});

// Expose tools object for testing
window.explainurTools = tools;
