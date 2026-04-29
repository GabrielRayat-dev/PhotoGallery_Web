document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Theme Toggle
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const htmlElement = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIconSun.classList.add('hidden');
            themeIconMoon.classList.remove('hidden');
        } else {
            themeIconSun.classList.remove('hidden');
            themeIconMoon.classList.add('hidden');
        }
    }

    /* ==========================================================================
       Sticky Navbar & Mobile Menu
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================================================
       Lazy Loading Images
       ========================================================================== */
    const lazyImages = document.querySelectorAll('img.lazyload');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 50px 0px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }

    /* ==========================================================================
       Gallery Filters
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Slight delay for smooth reappearance if needed
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // Wait for fade out
                }
            });
        });
    });

    /* ==========================================================================
       Lightbox
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    // Only get images currently visible (respecting filters)
    let visibleGalleryImages = [];

    function updateVisibleImages() {
        const items = document.querySelectorAll('.gallery-item');
        visibleGalleryImages = [];
        items.forEach(item => {
            if (item.style.display !== 'none') {
                visibleGalleryImages.push(item.querySelector('img'));
            }
        });
    }

    // Open Lightbox
    document.querySelector('.masonry-grid').addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            updateVisibleImages();
            const img = item.querySelector('img');
            currentImageIndex = visibleGalleryImages.indexOf(img);
            
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            updateLightboxContent();
        }
    });

    // Close Lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    function updateLightboxContent() {
        if (visibleGalleryImages.length > 0) {
            const currentImg = visibleGalleryImages[currentImageIndex];
            // Use full resolution image if available, fallback to the displayed one
            lightboxImg.src = currentImg.dataset.src || currentImg.src;
            lightboxCaption.innerHTML = currentImg.alt;
        }
    }

    prevBtn.addEventListener('click', () => {
        updateVisibleImages();
        currentImageIndex = (currentImageIndex - 1 + visibleGalleryImages.length) % visibleGalleryImages.length;
        updateLightboxContent();
    });

    nextBtn.addEventListener('click', () => {
        updateVisibleImages();
        currentImageIndex = (currentImageIndex + 1) % visibleGalleryImages.length;
        updateLightboxContent();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
    
    /* ==========================================================================
       Contact Form Submission (Prevent default for demo)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! This is a demo so no email was actually sent.');
            contactForm.reset();
        });
    }
});
