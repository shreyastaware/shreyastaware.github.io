// ===== THREE.JS BACKGROUND =====
let scene, camera, renderer, particles;

function initThree() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    // Create renderer
    const canvas = document.getElementById('bg-canvas');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Random position
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;

        // Random velocity
        velocities[i] = (Math.random() - 0.5) * 0.02;
        velocities[i + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.velocities = velocities;

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate particle system
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0003;

    // Update particle positions
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.geometry.velocities;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Boundary check
        if (Math.abs(positions[i]) > 100) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 100) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 100) velocities[i + 2] *= -1;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// ===== GSAP ANIMATIONS =====
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    const heroTimeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1 }
    });

    heroTimeline
        .from('.hero-eyebrow', {
            y: 30,
            opacity: 0,
            delay: 0.2
        })
        .from('.hero-title', {
            y: 50,
            opacity: 0,
            duration: 1.2
        }, '-=0.8')
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0
        }, '-=0.8')
        .from('.hero-cta', {
            y: 20,
            opacity: 0
        }, '-=0.6')
        .from('.hero-image', {
            scale: 0.8,
            opacity: 0,
            duration: 1.2
        }, '-=1')
        .from('.scroll-indicator', {
            opacity: 0,
            y: -20
        }, '-=0.5');

    // Parallax effect for hero image
    gsap.to('.hero-image', {
        y: 100,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Section animations
    gsap.utils.toArray('section:not(.hero)').forEach((section, index) => {
        const header = section.querySelector('.section-header');
        if (header) {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            });
        }
    });

    // Service items stagger animation
    const serviceCategories = gsap.utils.toArray('.services-category');
    serviceCategories.forEach(category => {
        const items = category.querySelectorAll('.service-item');
        gsap.from(items, {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            scrollTrigger: {
                trigger: category,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // About section animations
    gsap.from('.about-text', {
        x: -50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%'
        }
    });

    gsap.from('.about-links', {
        x: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%'
        }
    });

    // Contact email hover effect with GSAP
    const contactEmail = document.querySelector('.contact-email');
    if (contactEmail) {
        contactEmail.addEventListener('mouseenter', () => {
            gsap.to(contactEmail, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        contactEmail.addEventListener('mouseleave', () => {
            gsap.to(contactEmail, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }

    // Navigation animation on scroll
    gsap.to('.nav', {
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        scrollTrigger: {
            trigger: 'body',
            start: '100px top',
            end: '100px top',
            toggleActions: 'play none none reverse'
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: {
                        y: target,
                        offsetY: 100
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // Mouse parallax effect for hero
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updateParallax() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        if (camera) {
            camera.position.x = targetX * 5;
            camera.position.y = -targetY * 5;
            camera.lookAt(scene.position);
        }

        requestAnimationFrame(updateParallax);
    }

    updateParallax();
}

// ===== INITIALIZE =====
window.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE !== 'undefined') {
        initThree();
    } else {
        console.warn('Three.js not loaded');
    }

    // Check if GSAP is loaded
    if (typeof gsap !== 'undefined') {
        initGSAP();
    } else {
        console.warn('GSAP not loaded');
    }
});

// Add cursor effect
const createCursor = () => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.display = 'block';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Scale cursor on hover
    const hoverElements = document.querySelectorAll('a, button, .service-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
};

// Only show custom cursor on desktop
if (window.innerWidth > 768) {
    createCursor();
}

// Performance optimization: reduce particles on mobile
if (window.innerWidth < 768) {
    // Reduce particle count or disable Three.js on mobile
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        canvas.style.opacity = '0.2';
    }
}
