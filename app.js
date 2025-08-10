/**
 * Professional Landing Page - JavaScript
 * Author: Yaswanth Reddy Arumulla
 * Clean, modern interactions and animations
 */

// Application State
const App = {
    isLoaded: false,
    animations: {
        enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        duration: 300
    },
    performance: {
        startTime: performance.now(),
        loadTime: null
    }
};

// DOM Elements Cache
const Elements = {
    heroSection: null,
    profileImage: null,
    linkCards: null,
    socialIcons: null,
    footer: null
};

// Utility Functions
const Utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Generate random number between min and max
    random: (min, max) => Math.random() * (max - min) + min
};

// Animation Controller
const AnimationController = {
    // Initialize all animations
    init: () => {
        if (!App.animations.enabled) {
            AnimationController.disableAnimations();
            return;
        }

        AnimationController.setupPageLoadAnimations();
        AnimationController.setupHoverEffects();
        AnimationController.setupScrollAnimations();
    },

    // Disable animations for accessibility
    disableAnimations: () => {
        const elements = document.querySelectorAll('.link-card, .social-icon, .hero-section, .social-section, .footer');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.animation = 'none';
        });
        console.log('🎭 Animations disabled for accessibility');
    },

    // Page load animations with staggered timing
    setupPageLoadAnimations: () => {
        const linkCards = Elements.linkCards;
        const socialIcons = Elements.socialIcons;

        // Animate link cards with staggered timing
        if (linkCards && linkCards.length > 0) {
            linkCards.forEach((card, index) => {
                // Set initial state
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';

                // Animate with staggered timing
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 800 + (index * 150));
            });
            console.log(`🎬 ${linkCards.length} link cards animated with staggered timing`);
        }

        // Animate social icons
        if (socialIcons && socialIcons.length > 0) {
            socialIcons.forEach((icon, index) => {
                // Set initial state
                icon.style.opacity = '0';
                icon.style.transform = 'translateY(20px) scale(0.8)';

                // Animate with delay after cards
                setTimeout(() => {
                    icon.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    icon.style.opacity = '1';
                    icon.style.transform = 'translateY(0) scale(1)';
                }, 1400 + (index * 100));
            });
            console.log(`🎬 ${socialIcons.length} social icons animated`);
        }
    },

    // Setup enhanced hover effects
    setupHoverEffects: () => {
        const linkCards = Elements.linkCards;

        if (linkCards) {
            linkCards.forEach(card => {
                card.addEventListener('mouseenter', (e) => {
                    AnimationController.handleCardHover(e.currentTarget, true);
                });

                card.addEventListener('mouseleave', (e) => {
                    AnimationController.handleCardHover(e.currentTarget, false);
                });

                // Add focus support for accessibility
                card.addEventListener('focus', (e) => {
                    AnimationController.handleCardHover(e.currentTarget, true);
                });

                card.addEventListener('blur', (e) => {
                    AnimationController.handleCardHover(e.currentTarget, false);
                });
            });
            console.log('🎯 Enhanced hover effects setup complete');
        }

        // Setup social icon hover effects
        const socialIcons = Elements.socialIcons;
        if (socialIcons) {
            socialIcons.forEach(icon => {
                icon.addEventListener('mouseenter', (e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)';
                });

                icon.addEventListener('mouseleave', (e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    },

    // Handle link card hover effects
    handleCardHover: (card, isEntering) => {
        const arrow = card.querySelector('.link-arrow');
        const logo = card.querySelector('.logo-container');

        if (isEntering) {
            if (arrow) {
                arrow.style.transform = 'translateX(6px)';
            }
            if (logo) {
                logo.style.transform = 'scale(1.15)';
            }

            // Add subtle pulse effect
            card.style.animationDuration = '2s';
            card.style.animationName = 'none';
            card.requestAnimationFrame = requestAnimationFrame(() => {
                card.style.animationName = 'subtle-pulse';
            });
        } else {
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
            if (logo) {
                logo.style.transform = 'scale(1)';
            }

            card.style.animationName = 'none';
        }
    },

    // Setup scroll-triggered animations
    setupScrollAnimations: () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('fade-in', 'animated');
                }
            });
        }, observerOptions);

        // Observe footer
        const footer = Elements.footer;
        if (footer) {
            observer.observe(footer);
        }
    }
};

// Performance Monitor
const PerformanceMonitor = {
    // Track page load performance
    trackLoadTime: () => {
        window.addEventListener('load', () => {
            App.performance.loadTime = performance.now() - App.performance.startTime;
            console.log(`🚀 Page loaded in ${App.performance.loadTime.toFixed(2)}ms`);
        });
    },

    // Monitor image loading
    trackImageLoading: () => {
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        let totalImages = images.length;

        if (totalImages === 0) {
            console.log('📷 No images to track');
            return;
        }

        images.forEach((img, index) => {
            if (img.complete && img.naturalHeight !== 0) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    console.log(`📸 Image ${index + 1}/${totalImages} loaded successfully`);

                    if (loadedImages === totalImages) {
                        console.log('✅ All images loaded successfully');
                    }
                });

                img.addEventListener('error', (e) => {
                    console.warn(`❌ Failed to load image: ${img.src.substring(0, 50)}...`);
                    ErrorHandler.handleImageError(img);
                    loadedImages++;

                    if (loadedImages === totalImages) {
                        console.log('⚠️ All images processed (some may have failed)');
                    }
                });
            }
        });

        if (loadedImages === totalImages) {
            console.log('✅ All images already loaded');
        }
    }
};

// Error Handler
const ErrorHandler = {
    // Handle image loading errors
    handleImageError: (img) => {
        if (img.classList.contains('profile-image')) {
            // Fallback to generated avatar
            img.src = "https://ui-avatars.com/api/?name=Yaswanth+Reddy+Arumulla&size=400&background=4F46E5&color=ffffff&font-size=0.33&bold=true&format=svg";
            img.alt = "Yaswanth Reddy Arumulla - DevOps Engineer (Generated Avatar)";
            console.log('🔄 Profile image fallback applied');
        }
    },

    // Global error handler
    setupGlobalErrorHandling: () => {
        window.addEventListener('error', (e) => {
            console.error('❌ Global error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('❌ Unhandled promise rejection:', e.reason);
            e.preventDefault();
        });
    }
};

// Analytics and Tracking
const Analytics = {
    // Track link clicks
    trackLinkClick: (platform, url) => {
        console.log(`🔗 Link clicked: ${platform} - ${url}`);

        // Special handling for contact methods
        if (platform === 'Email') {
            console.log('📧 Email client opened for yaswanth.arumulla@gmail.com');
        } else if (platform === 'Phone') {
            console.log('📱 Phone dialer opened for +91 9959148343');
        }

        // Future: Send to analytics service
        // Example: gtag('event', 'click', { event_category: 'social_link', event_label: platform });
    },

    // Track user engagement
    trackEngagement: () => {
        let scrollDepth = 0;
        let maxScroll = 0;
        let timeOnPage = Date.now();

        const trackScroll = Utils.throttle(() => {
            const docHeight = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1
            );
            scrollDepth = Math.min((window.pageYOffset / docHeight) * 100, 100);
            maxScroll = Math.max(maxScroll, scrollDepth);
        }, 100);

        window.addEventListener('scroll', trackScroll);

        window.addEventListener('beforeunload', () => {
            const sessionTime = (Date.now() - timeOnPage) / 1000;
            console.log(`📊 Session: ${sessionTime.toFixed(1)}s, Max scroll: ${maxScroll.toFixed(1)}%`);
        });
    },

    // Setup click tracking for all links
    setupClickTracking: () => {
        const links = document.querySelectorAll('a[target="_blank"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const card = e.target.closest('.link-card');
                const social = e.target.closest('.social-icon');

                let platform = 'Unknown';

                if (card) {
                    const title = card.querySelector('.link-title');
                    platform = title ? title.textContent : 'Card Link';
                } else if (social) {
                    platform = social.getAttribute('aria-label') || 'Social Icon';
                }

                Analytics.trackLinkClick(platform, link.href);
            });
        });

        console.log(`🔍 Click tracking setup for ${links.length} external links`);
    }
};

// Accessibility Enhancements
const AccessibilityEnhancer = {
    // Setup keyboard navigation
    setupKeyboardNavigation: () => {
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || (e.key === ' ' && element.tagName === 'A')) {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        console.log(`⌨️ Keyboard navigation setup for ${focusableElements.length} elements`);
    },

    // Setup focus management
    setupFocusManagement: () => {
        document.addEventListener('keydown', (e) => {
            // Skip to main content on pressing 'S'
            if (e.key.toLowerCase() === 's' && e.ctrlKey) {
                e.preventDefault();
                const mainContent = document.querySelector('.links-section');
                if (mainContent) {
                    const firstLink = mainContent.querySelector('a');
                    if (firstLink) {
                        firstLink.focus();
                        console.log('🎯 Skipped to main content');
                    }
                }
            }
        });
    },

    // Enhance ARIA labels
    enhanceAriaLabels: () => {
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            profileImage.setAttribute('role', 'img');
        }

        const linkCards = document.querySelectorAll('.link-card');
        linkCards.forEach((card, index) => {
            const title = card.querySelector('.link-title');
            const platform = title ? title.textContent : `Link ${index + 1}`;
            card.setAttribute('aria-label', `Visit ${platform} profile`);
        });

        console.log('🔤 Enhanced ARIA labels and descriptions');
    }
};

// Theme Detection
const ThemeManager = {
    detectPreference: () => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        console.log(`🌙 User prefers ${darkModeQuery.matches ? 'dark' : 'light'} mode`);

        darkModeQuery.addEventListener('change', (e) => {
            console.log(`🔄 Color scheme changed to ${e.matches ? 'dark' : 'light'} mode`);
        });
    }
};

// Cache DOM elements
const cacheDOMElements = () => {
    Elements.heroSection = document.querySelector('.hero-section');
    Elements.profileImage = document.querySelector('.profile-image');
    Elements.linkCards = document.querySelectorAll('.link-card');
    Elements.socialIcons = document.querySelectorAll('.social-icon');
    Elements.footer = document.querySelector('.footer');

    console.log('💾 DOM elements cached:', {
        heroSection: !!Elements.heroSection,
        profileImage: !!Elements.profileImage,
        linkCards: Elements.linkCards.length,
        socialIcons: Elements.socialIcons.length,
        footer: !!Elements.footer
    });
};

// Application Initialization
const initializeApp = () => {
    console.log('🚀 Initializing Professional Landing Page...');

    // Cache DOM elements
    cacheDOMElements();

    // Setup error handling
    ErrorHandler.setupGlobalErrorHandling();

    // Initialize performance monitoring
    PerformanceMonitor.trackLoadTime();
    PerformanceMonitor.trackImageLoading();

    // Initialize animations
    AnimationController.init();

    // Setup analytics
    Analytics.setupClickTracking();
    Analytics.trackEngagement();

    // Enhance accessibility
    AccessibilityEnhancer.setupKeyboardNavigation();
    AccessibilityEnhancer.setupFocusManagement();
    AccessibilityEnhancer.enhanceAriaLabels();

    // Detect theme preference
    ThemeManager.detectPreference();

    // Mark app as loaded
    App.isLoaded = true;

    console.log('✅ Landing Page initialized successfully!');
    console.log('🎨 Clean, modern design with smooth animations');
    console.log('📱 Responsive design optimized for all devices');
    console.log('♿ Accessibility enhancements enabled');
    console.log('📧 Contact methods: Email and Phone integrated');
};

// Add subtle pulse animation for cards
const style = document.createElement('style');
style.textContent = `
    @keyframes subtle-pulse {
        0%, 100% { 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        50% { 
            box-shadow: 0 8px 16px -1px rgba(0, 0, 0, 0.15), 0 4px 8px -1px rgba(0, 0, 0, 0.1);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already ready
    initializeApp();
}

// Expose API for debugging
window.LandingPageApp = {
    ...App,
    elements: Elements,
    utils: Utils,
    animations: AnimationController,
    performance: PerformanceMonitor,
    analytics: Analytics,
    accessibility: AccessibilityEnhancer,
    errors: ErrorHandler
};

console.log('🎯 Professional Landing Page loaded and ready!');
console.log('👨‍💻 Yaswanth Reddy Arumulla - DevOps Engineer');
console.log('🔧 Built with modern web technologies and best practices');
console.log('📞 Contact: Email & Phone integration complete');