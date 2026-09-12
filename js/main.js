// 1. GSAP Plugins
gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: true }); // GPU-accelerate all GSAP tweens globally




// NAVBAR: Hybrid Behavior (Hidden -> Peek -> Directional) or Standard Show/Hide
const navbar = document.querySelector('.navbar');
const aboutSection = document.getElementById('about');

if (navbar) {
    if (aboutSection) {
        // Homepage / Main Page Scroll Logic
        gsap.set(navbar, { yPercent: -100, opacity: 0 });
        navbar.classList.add('navbar-hidden');

        let peekVisible = false;

        ScrollTrigger.create({
            trigger: "#about",
            start: "top 45%", // Slightly earlier peek
            end: "+=50%",     // Stay visible for 50vh (half a screen)
            onEnter: () => {
                peekVisible = true;
                navbar.classList.remove('navbar-hidden');
                gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
            },
            onLeave: () => {
                peekVisible = false;
                gsap.to(navbar, { yPercent: -100, opacity: 0, duration: 0.5, ease: "power2.in" });
            },
            onEnterBack: () => {
                peekVisible = true;
                navbar.classList.remove('navbar-hidden');
                gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
            },
            onLeaveBack: () => {
                peekVisible = false;
                gsap.to(navbar, { yPercent: -100, opacity: 0, duration: 0.5, ease: "power2.in" });
            }
        });

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (peekVisible) return; // Don't interfere during the forced peek

            const currentScrollY = window.scrollY;
            const activeThreshold = window.innerHeight * 1.05;

            if (currentScrollY > activeThreshold) {
                if (currentScrollY < lastScrollY) {
                    // Scrolling UP
                    navbar.classList.remove('navbar-hidden');
                    gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
                } else {
                    // Scrolling DOWN
                    gsap.to(navbar, { yPercent: -100, opacity: 0, duration: 0.4, ease: "power2.in" });
                }
            } else if (!peekVisible) {
                // Below threshold and not in peek zone: ensure hidden
                gsap.set(navbar, { yPercent: -100, opacity: 0 });
            }

            lastScrollY = currentScrollY;
        });
    } else {
        // Sub-page Scroll Logic: Visible by default, hide on scroll down, show on scroll up
        gsap.set(navbar, { yPercent: 0, opacity: 1 });
        navbar.classList.remove('navbar-hidden');

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {
                if (currentScrollY < lastScrollY) {
                    // Scroll UP
                    navbar.classList.remove('navbar-hidden');
                    gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
                } else {
                    // Scroll DOWN
                    gsap.to(navbar, { yPercent: -100, opacity: 0, duration: 0.4, ease: "power2.in" });
                }
            } else {
                navbar.classList.remove('navbar-hidden');
                gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
            }

            lastScrollY = currentScrollY;
        });
    }
}



// Fade in sections
const sections = document.querySelectorAll('.section');
sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 1
    });
});


// 3. Scroll-Driven Rodeo Animation
const rodeoCowboy = document.getElementById('rodeoCowboy');
if (rodeoCowboy) {
    // A. Simplified Background (Just ensuring it stays beige)
    gsap.set("body", { backgroundColor: "#f7f7ef" });

    // B. Rodeo Bucking Logic (Constant Energy "Phase 4" refinement)
    // Decoupled from velocity - triggers intense jerks on ANY scroll update.
    ScrollTrigger.create({
        trigger: "#hero-scroll-trigger",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
            // High fixed intensity for constant dynamism
            const intensity = 90;

            // Any update triggers a violent "tick"
            const buckY = (Math.random() - 0.75) * intensity * 1.3;
            const buckX = (Math.random() - 0.5) * intensity * 1.1;
            const buckRotation = (Math.random() - 0.5) * (intensity / 1.1);
            const buckScale = 1 + (Math.random() - 0.5) * 0.18;

            gsap.to(rodeoCowboy, {
                y: buckY,
                x: buckX,
                rotation: buckRotation,
                scale: buckScale,
                duration: 0.15, // Further slowed from 0.08 for a rhythmic rodeo feel
                ease: "power1.inOut", // Smoother transition
                overwrite: true
            });

            // Auto-settle timer: if no updates for 100ms, return to rest.
            // This ensures it keeps bucking as long as user is moving the wheel.
            clearTimeout(rodeoCowboy.settleTimer);
            rodeoCowboy.settleTimer = setTimeout(() => {
                gsap.to(rodeoCowboy, {
                    y: 0,
                    x: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
                });
            }, 100);
        }
    });
    // C. Floating About Me Bubble
    const aboutBubbleWrapper = document.getElementById('about-bubble-wrapper');
    if (aboutBubbleWrapper) {
        gsap.to(aboutBubbleWrapper, {
            y: -154, // Diminished floating motion by 30%
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: "#about",
                start: "top bottom",
                end: "bottom top",
                scrub: 1 // Reduced catch-up lag to track the scroll tighter (less floaty jiggle)
            }
        });
    }

    // D. Blur-to-Reveal CV Button Text
    const cvSpans = document.querySelectorAll('#cv-button .wave-text');
    if (cvSpans.length > 0) {
        gsap.to(cvSpans, {
            filter: "blur(0px)",
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: 0.1, // Staggered entry
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#about",
                start: "top 80%", // Start revealing as it enters
                end: "top 40%",   // Full focus reached early
                scrub: 1.5
            }
        });
    }
}



// 4. CUSTOM CURSOR
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    // Mouse-based cursor movement
    document.addEventListener('mousemove', (e) => {
        // Cursor
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    });
}


// 5. Experience Cards Stacking Animation
const experienceCards = gsap.utils.toArray('.experience-card');
experienceCards.forEach((card, i) => {
    // Only animate if it's not the last card (the last one doesn't get covered)
    if (i < experienceCards.length - 1) {
        gsap.to(card, {
            scale: 0.92,
            opacity: 0.4,
            filter: "blur(4px)",
            scrollTrigger: {
                trigger: card,
                start: "top 12vh",
                end: "bottom 12vh",
                scrub: true,
                // markers: true, // Useful for debugging
            }
        });
    }
});

// Video Mute Toggle
function toggleMute(videoId, iconId) {
    const video = document.getElementById(videoId);
    const icon = document.getElementById(iconId);
    if (video) {
        if (video.muted) {
            video.muted = false;
            icon.className = "fas fa-volume-up";
            video.play().catch(e => console.log("Autoplay unmuted prevented:", e));
        } else {
            video.muted = true;
            icon.className = "fas fa-volume-mute";
        }
    }
}

// 6. PHOTO GRID LIGHTBOX
const photoItems = document.querySelectorAll('.photo-item img');
const lightbox = document.getElementById('photo-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

if (photoItems.length > 0 && lightbox) {
    photoItems.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
            document.body.style.overflow = "hidden"; // Prevent scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });
}
// 7. SUB-PROJECT VIEW TRANSITIONS (Service Civique Page)
const subProjectCards = document.querySelectorAll('.sub-project-card');
const introView = document.getElementById('experience-intro-view');
const detailsView = document.getElementById('project-details-view');
const detailTitle = document.getElementById('project-detail-title');
const backBtn = document.getElementById('back-to-experience');

if (subProjectCards.length > 0 && introView && detailsView) {
    subProjectCards.forEach(card => {
        card.addEventListener('click', () => {
            const titleElement = card.querySelector('.card-placeholder');
            const title = titleElement ? titleElement.textContent : "Projet";
            detailTitle.textContent = title;

            // Transition
            const tl = gsap.timeline();
            tl.to(introView, {
                opacity: 0, scale: 0.98, duration: 0.5, onComplete: () => {
                    introView.style.display = 'none';
                    detailsView.style.display = 'block';
                    window.scrollTo(0, 0);

                    // Initialize Project-Specific GSAP Animations
                    initProjectAnimations();
                }
            });
            tl.to(detailsView, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
        });
    });

    if (backBtn) {
        const goBack = () => {
            const tl = gsap.timeline();
            tl.to(detailsView, {
                opacity: 0, scale: 1.02, duration: 0.5, onComplete: () => {
                    detailsView.style.display = 'none';
                    introView.style.display = 'block';
                    window.scrollTo(0, 0);

                    // Kill active ScrollTriggers for details
                    ScrollTrigger.getAll().forEach(st => {
                        if (st.vars.id && st.vars.id.startsWith('project-')) st.kill();
                    });
                }
            });
            tl.to(introView, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
        };

        backBtn.addEventListener('click', goBack);

        const allProjectsBtnBottom = document.getElementById('all-projects-btn-bottom');
        if (allProjectsBtnBottom) {
            allProjectsBtnBottom.addEventListener('click', goBack);
        }
    }
}

function initProjectAnimations() {
    // 1. Hybrid Scroll/Pin for "Portes Ouvertes" Section
    const stickyBlock = document.querySelector('.project-detail-sticky');
    const layout = document.querySelector('.project-detail-layout');

    if (stickyBlock && layout) {
        // We want the text to scroll naturally with the page first.
        // Once its bottom hits the viewport (with a margin), it locks (pins).
        // It stays locked until the user has scrolled past the entire layout (video).
        ScrollTrigger.create({
            trigger: stickyBlock,
            start: "bottom bottom-=80px", // Trigger slightly earlier for safer transition
            endTrigger: layout,
            end: "bottom bottom", // Unpin exactly when layout ends
            pin: true,
            pinSpacing: false,
            pinType: "transform", // Smoother for nested elements, avoids "disappearing" bug
            anticipatePin: 1,
            id: "project-portes-ouvertes-pin",
            invalidateOnRefresh: true
        });
    }
}

// 8. Active navigation link highlighting based on section scroll
const navLinks = document.querySelectorAll('.nav-links > a');
const navSections = ['#hero-scroll-trigger', '#about', '#parcours', '#skills', '#projects', '#photos', '#contact'];

navSections.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
        ScrollTrigger.create({
            trigger: el,
            start: "top 40%",
            end: "bottom 40%",
            onEnter: () => updateActiveLink(selector),
            onEnterBack: () => updateActiveLink(selector)
        });
    }
});

function updateActiveLink(selector) {
    if (!document.getElementById('about')) return; // Only apply on homepage
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === selector) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

