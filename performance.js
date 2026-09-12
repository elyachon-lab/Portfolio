/**
 * performance.js
 * Advanced Performance & UX Optimization: Lazy loading videos & Smart Prefetching
 * Loaded with 'defer' attribute
 */

(function () {
    "use strict";

    // 1. Connection check helper
    const isGoodConnection = () => {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            if (conn.saveData || /2g|slow-2g/.test(conn.effectiveType)) {
                return false;
            }
        }
        return true;
    };

    /**
     * 2. Advanced Media Lazy Loading
     */
    const setupLazyVideos = () => {
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) return;

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                
                if (entry.isIntersecting) {
                    video.isIntersecting = true;
                    let needsLoad = false;

                    // A. Check direct src attribute
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.removeAttribute('data-src');
                        needsLoad = true;
                    }

                    // B. Check nested source elements
                    const sources = video.querySelectorAll('source');
                    sources.forEach(source => {
                        if (source.dataset.src) {
                            source.src = source.dataset.src;
                            source.removeAttribute('data-src');
                            needsLoad = true;
                        }
                    });

                    if (needsLoad) {
                        video.load();
                    }

                    // C. Auto-play behavior if specified
                    if (video.dataset.autoplay === 'true') {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(e => {
                                // Silent warning if autoplay block is active
                                console.info("Autoplay in-view pending interaction...");
                            });
                        }
                    }
                } else {
                    video.isIntersecting = false;
                    
                    // D. Pause video when out of viewport to save CPU/GPU cycles
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, {
            rootMargin: "150px 0px", // Load slightly before entering viewport
            threshold: 0.01
        });

        videos.forEach(video => {
            // Set initial optimization attributes
            video.setAttribute('preload', 'none');
            
            // Check if it originally had autoplay
            if (video.hasAttribute('autoplay')) {
                video.dataset.autoplay = 'true';
                video.removeAttribute('autoplay');
                video.pause();
            }

            // Gestion du Hover-to-Play/Pause
            video.addEventListener('mouseenter', () => {
                if (!video.paused) return; // Already playing
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            });

            video.addEventListener('mouseleave', () => {
                // If it is in-view autoplaying loop, keep playing
                if (video.dataset.autoplay === 'true' && video.isIntersecting) {
                    return;
                }
                video.pause();
            });

            videoObserver.observe(video);
        });
    };

    /**
     * 3. Intelligent Prefetching (Hover & Viewport-based)
     */
    const setupPrefetching = () => {
        if (!isGoodConnection()) return;

        const prefetchedUrls = new Set();
        const hoveredLinks = new Map();

        const prefetchPage = (url) => {
            if (prefetchedUrls.has(url)) return;

            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.as = 'document';
            document.head.appendChild(link);

            prefetchedUrls.add(url);
            // console.info(`[Prefetch] Prefetched resource: ${url}`);
        };

        const getValidLocalHtmlUrl = (linkEl) => {
            const href = linkEl.getAttribute('href');
            if (!href) return null;

            // Skip anchor links, protocols (http, mailto, tel), and current page
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.includes('://')) {
                return null;
            }

            // Resolve relative path to check if it's identical to current path
            const resolvedUrl = new URL(linkEl.href);
            const currentUrl = new URL(window.location.href);
            if (resolvedUrl.origin !== currentUrl.origin) return null;
            if (resolvedUrl.pathname === currentUrl.pathname) return null;

            return href.split('#')[0]; // Prefetch the base HTML page, ignoring subpage hash anchors
        };

        // A. Hover / Touch Prefetch (Triggers prefetch when user shows intent)
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const pageUrl = getValidLocalHtmlUrl(link);
            if (!pageUrl) return;

            const handleMouseEnter = () => {
                const timeoutId = setTimeout(() => {
                    prefetchPage(pageUrl);
                }, 80); // 80ms debounce delay to avoid prefetching on rapid cursor passes
                hoveredLinks.set(link, timeoutId);
            };

            const handleMouseLeave = () => {
                const timeoutId = hoveredLinks.get(link);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    hoveredLinks.delete(link);
                }
            };

            const handleTouchStart = () => {
                prefetchPage(pageUrl); // Trigger immediately on touch device touch down
            };

            link.addEventListener('mouseenter', handleMouseEnter);
            link.addEventListener('mouseleave', handleMouseLeave);
            link.addEventListener('touchstart', handleTouchStart, { passive: true });
        });

        // B. Idle Viewport-based Link Prefetching (Prefetches links visible in viewport during idle times)
        const viewportPrefetchObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    const pageUrl = getValidLocalHtmlUrl(link);
                    if (pageUrl) {
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(() => prefetchPage(pageUrl), { timeout: 1500 });
                        } else {
                            setTimeout(() => prefetchPage(pageUrl), 500);
                        }
                    }
                    observer.unobserve(link); // Only prefetch once
                }
            });
        }, {
            threshold: 0.1
        });

        links.forEach(link => {
            const pageUrl = getValidLocalHtmlUrl(link);
            if (pageUrl) {
                viewportPrefetchObserver.observe(link);
            }
        });
    };

    // Initialisation
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', () => {
            setupLazyVideos();
            setupPrefetching();
        });
    } else {
        setupLazyVideos();
        setupPrefetching();
    }

})();
