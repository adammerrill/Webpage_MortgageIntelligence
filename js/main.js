// Initialize hero animations and interactions
function initHeroAnimations() {
    const heroElements = {
        badge: document.querySelector('.hero-badge'),
        title: document.querySelector('.hero-title'),
        subtitle: document.querySelector('.hero-subtitle'),
        roleSelector: document.querySelector('.role-selector'),
        cta: document.querySelector('.hero-cta'),
        illustration: document.querySelector('.hero-illustration'),
        floatingHouses: document.querySelectorAll('.floating-house')
    };

    // Function to animate an element
    function animateElement(element, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    // Animate hero elements in sequence
    animateElement(heroElements.badge, 100);
    animateElement(heroElements.title, 300);
    animateElement(heroElements.subtitle, 500);
    animateElement(heroElements.roleSelector, 700);
    animateElement(heroElements.cta, 900);
    animateElement(heroElements.illustration, 1100);

    // Animate floating houses
    heroElements.floatingHouses.forEach((house, index) => {
        house.style.opacity = '0';
        house.style.transform = 'translateY(40px)';
        
        setTimeout(() => {
            house.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            house.style.opacity = '0.4';
            house.style.transform = 'translateY(0)';
        }, 1300 + (index * 200));
    });

    // Add parallax effect to floating houses
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;

        requestAnimationFrame(() => {
            heroElements.floatingHouses.forEach((house, index) => {
                const speed = [1.5, -1.2, 1][index % 3];
                
                // Get the base transform from the float animation
                const baseTransform = window.getComputedStyle(house).transform;
                const matrix = new DOMMatrix(baseTransform);
                const [baseX, baseY] = [matrix.m41, matrix.m42];
                const baseRotate = Math.atan2(matrix.m12, matrix.m11) * (180 / Math.PI);
                
                // Apply parallax movement while preserving the float animation
                house.style.transform = `
                    translate(
                        ${baseX + (moveX * speed)}px,
                        ${baseY + (moveY * speed)}px
                    )
                    rotate(${baseRotate}deg)
                `;
            });
        });
    });
}

// Navigation and initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero animations
    initHeroAnimations();
    
    // Initialize role selector
    initRoleSelector();
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced navbar scroll behavior with smooth transitions
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;
    let scrollTimer = null;
    let ticking = false;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Add/remove scrolled class for background opacity
                if (currentScroll > 20) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                // Enhanced hide/show behavior with smoother transitions
                if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down - hide with transform
                    nav.style.transform = 'translate(-50%, calc(-100% - 1rem))';
                    nav.style.opacity = '0';
                } else {
                    // Scrolling up - show with transform
                    nav.style.transform = 'translate(-50%, 0)';
                    nav.style.opacity = '1';
                }
                
                lastScroll = currentScroll;
                ticking = false;
                
                // Reset scroll timer for performance
                if (scrollTimer !== null) {
                    clearTimeout(scrollTimer);
                }
                scrollTimer = setTimeout(() => {
                    nav.style.transform = 'translate(-50%, 0)';
                    nav.style.opacity = '1';
                }, 150);
            });
            
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Enhanced dropdown menus with improved animations
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeout;

        function showDropdown() {
            clearTimeout(timeout);
            menu.style.display = 'block';
            menu.style.opacity = '0';
            menu.style.transform = 'translateX(-50%) translateY(8px)';
            
            requestAnimationFrame(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translateX(-50%) translateY(0)';
            });
        }

        function hideDropdown() {
            menu.style.opacity = '0';
            menu.style.transform = 'translateX(-50%) translateY(8px)';
            
            timeout = setTimeout(() => {
                menu.style.display = 'none';
            }, 200);
        }

        dropdown.addEventListener('mouseenter', showDropdown);
        dropdown.addEventListener('mouseleave', hideDropdown);
        
        // Handle focus events for accessibility
        trigger.addEventListener('focus', showDropdown);
        dropdown.addEventListener('focusout', (e) => {
            if (!dropdown.contains(e.relatedTarget)) {
                hideDropdown();
            }
        });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add stagger effect to customer logos
            if (entry.target.classList.contains('customer-logos-grid')) {
                entry.target.querySelectorAll('img').forEach((logo, index) => {
                    logo.style.transitionDelay = `${index * 100}ms`;
                    logo.style.opacity = '0.5';
                });
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.fade-in, .customer-logos-grid').forEach(el => {
    observer.observe(el);
});

// Parallax effect for floating elements
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (clientX - centerX) / 50;
    const moveY = (clientY - centerY) / 50;

    document.querySelectorAll('.floating-house').forEach((el, index) => {
        const speed = [1.5, -1.2, 1][index % 3];
        el.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
    });
});

console.log('JavaScript initializing...');

// Role selector functionality
// Role selector functionality
function initRoleSelector() {
    const roleButtons = document.querySelectorAll('.role-button');
    const roleNav = document.querySelector('.role-nav');
    
    // Function to handle scroll position when selecting a role
    function scrollRoleIntoView(button) {
        const navRect = roleNav.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        // Calculate the scroll position to center the button
        const scrollLeft = buttonRect.left - navRect.left - (navRect.width - buttonRect.width) / 2;
        
        roleNav.scrollTo({
            left: roleNav.scrollLeft + scrollLeft,
            behavior: 'smooth'
        });
    }

    // Add click handlers to role buttons
    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            roleButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Add active state to clicked button
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            
            // Scroll the button into view
            scrollRoleIntoView(button);
            
            // Optional: Add animation for content change
            const heroContent = document.querySelector('.hero-content');
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                // Here you would update content based on selected role
                // For now, we'll just animate back in
                heroContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    // Add hover effect to role navigation
    roleNav.addEventListener('mousemove', (e) => {
        const rect = roleNav.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        roleButtons.forEach(button => {
            const buttonRect = button.getBoundingClientRect();
            const buttonX = buttonRect.left + buttonRect.width / 2 - rect.left;
            const buttonY = buttonRect.top + buttonRect.height / 2 - rect.top;
            
            const distance = Math.sqrt(
                Math.pow(x - buttonX, 2) + 
                Math.pow(y - buttonY, 2)
            );
            
            const maxDistance = 100;
            const scale = Math.max(0, 1 - distance / maxDistance);
            
            if (!button.classList.contains('active')) {
                button.style.transform = `translateY(${-scale * 4}px)`;
                button.style.opacity = 0.7 + scale * 0.3;
            }
        });
    });

    roleNav.addEventListener('mouseleave', () => {
        roleButtons.forEach(button => {
            if (!button.classList.contains('active')) {
                button.style.transform = '';
                button.style.opacity = '';
            }
        });
    });
}
    
roleButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        roleButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
    });
});

// Interactive floating houses
document.querySelectorAll('.floating-house').forEach(house => {
    house.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1) translateY(-10px)';
        this.style.transition = 'transform 0.3s ease';
        this.querySelector('.house-icon').style.stroke = 'rgba(255, 255, 255, 0.4)';
    });
    
    house.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.querySelector('.house-icon').style.stroke = 'rgba(255, 255, 255, 0.2)';
    });
});

// Hero section entrance animation
const heroContent = document.querySelector('.hero-content');
const heroIllustration = document.querySelector('.hero-illustration');

if (heroContent && heroIllustration) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    heroIllustration.style.opacity = '0';
    heroIllustration.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
        
        heroIllustration.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        heroIllustration.style.opacity = '1';
        heroIllustration.style.transform = 'translateX(0)';
    }, 100);
});