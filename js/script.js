// ========================================
// Smooth Scroll Navigation
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Active Navigation Link Highlight
// ========================================

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

const highlightNavLink = () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// ========================================
// Intersection Observer for Animations
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe resume items, project cards, and timeline items
document.querySelectorAll('.resume-item, .project-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========================================
// Mobile Menu Toggle (if needed)
// ========================================

const createMobileMenu = () => {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    // Check if mobile menu already exists
    if (document.querySelector('.mobile-menu-btn')) return;
    
    if (window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.classList.add('mobile-menu-btn');
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: var(--light);
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 101;
        `;
        
        header.appendChild(menuBtn);
    }
};

// ========================================
// Scroll to Top Button
// ========================================

const createScrollToTopBtn = () => {
    const btn = document.createElement('button');
    btn.id = 'scrollToTop';
    btn.innerHTML = '↑';
    btn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 0.8rem 1rem;
        background: var(--highlight);
        color: white;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        font-size: 1.5rem;
        z-index: 99;
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

createScrollToTopBtn();

// ========================================
// Initialize on Page Load
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'slideUp 0.8s ease';
    }
    
    // Add stagger animation to resume items
    const resumeItems = document.querySelectorAll('.resume-item');
    resumeItems.forEach((item, index) => {
        item.style.setProperty('--delay', `${index * 0.1}s`);
        item.style.animation = `fadeInUp 0.6s ease forwards`;
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Log portfolio loaded
    console.log('Portfolio loaded successfully! ✨');
});

// ========================================
// Utility Functions
// ========================================

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    nav a.active {
        color: var(--highlight);
        font-weight: 600;
    }

    nav a.active::after {
        width: 100%;
    }

    #scrollToTop:hover {
        background: #ff6b9d;
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
    }
`;
document.head.appendChild(style);

// ========================================
// Print CSS for Resume
// ========================================

window.printResume = () => {
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            header, footer, #projects { display: none; }
            body { background: white; color: black; }
            .resume-item, .timeline-content { 
                background: white !important;
                color: black !important;
                border: 1px solid #ddd;
            }
        }
    `;
    document.head.appendChild(printStyle);
    window.print();
};

document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.project-nav-btn');
    
    // Get all project categories
    const categories = document.querySelectorAll('.category');

    if (!navButtons.length || !categories.length) {
        return;
    }

    const showCategory = (categoryId, buttonToActivate) => {
        navButtons.forEach(btn => btn.classList.remove('active'));
        categories.forEach(cat => {
            cat.classList.remove('active');
            cat.classList.add('hidden');
        });

        if (buttonToActivate) {
            buttonToActivate.classList.add('active');
        }

        const targetElement = document.getElementById(categoryId);
        if (targetElement) {
            targetElement.classList.remove('hidden');
            targetElement.classList.add('active');

            // Hidden tabs can keep cards at opacity 0 from initial observer setup.
            // Force cards visible when a category becomes active.
            targetElement.querySelectorAll('.project-card').forEach(card => {
                card.style.opacity = '1';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            });
        }
    };

    // Add click event listener to each button
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCategory = button.getAttribute('data-category');
            showCategory(targetCategory, button);

            // Optional: Smooth scroll to category (uncomment if needed)
            const targetElement = document.getElementById(targetCategory);
            // if (targetElement) {
            //     setTimeout(() => {
            //         targetElement.scrollIntoView({ 
            //             behavior: 'smooth', 
            //             block: 'nearest' 
            //         });
            //     }, 100);
            // }
        });
    });

    // Set first category as active on page load
    const firstBtn = navButtons[0];
    showCategory(firstBtn.getAttribute('data-category'), firstBtn);
});

document.addEventListener('DOMContentLoaded', () => {
    const resumeBtn = document.getElementById('resume-download-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'assets/resume.pdf';
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});