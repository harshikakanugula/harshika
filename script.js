
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LIGHT/DARK THEME SWITCH LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootEl = document.documentElement;

    // Load theme configuration
    const storedTheme = localStorage.getItem('theme') || 'dark';
    rootEl.setAttribute('data-theme', storedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = rootEl.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        rootEl.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    });


    // --- 2. RESPONSIVE NAVIGATION HAMBURGER DRAWER ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking any nav item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // --- 3. SHRINKING NAVIGATION BAR ON SCROLL ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- 4. HERO SECTION TYPEWRITER EFFECT ---
    const typewriterSpan = document.getElementById('typewriter');
    const words = ["modern web systems.", "responsive user interfaces.", "innovative IT solutions.", "clean full-stack applications."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // delete faster
        } else {
            typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80; // typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1500; // pause at completion
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // brief pause before next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start typewriter
    setTimeout(typeEffect, 500);


    // --- 5. INTERSECTION OBSERVER FOR ACTIVE LINK SCROLL SPYING ---
    const sections = document.querySelectorAll('section, header');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // high trigger density
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    // --- 6. INTERSECTION OBSERVER FOR LAZY FILLING SKILL BARS ---
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillsSection = document.getElementById('skills');

    const skillObserverOptions = {
        root: null,
        threshold: 0.15
    };

    const skillObserver = new IntersectionObserver((entries, self) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const percent = bar.getAttribute('data-percent');
                    bar.style.width = percent;
                });
                self.unobserve(entry.target); // trigger animation only once
            }
        });
    }, skillObserverOptions);

    if (skillsSection) skillObserver.observe(skillsSection);


    // --- 7. TACTILE VALIDATION & FORM MECHANICS ---
    const form = document.getElementById('contact-form');
    const formInputs = form.querySelectorAll('.form-input, .form-textarea');
    const successBanner = document.getElementById('success-banner');

    // Set up real-time dynamic validations on input
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateGroup(input);
        });

        input.addEventListener('blur', () => {
            validateGroup(input);
        });
    });

    function validateGroup(input) {
        const group = input.parentElement;
        let isValid = true;

        if (input.required && !input.value.trim()) {
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
        } else if (input.minLength && input.value.trim().length < input.minLength) {
            isValid = false;
        }

        if (isValid) {
            group.classList.add('valid');
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
            group.classList.remove('valid');
        }

        return isValid;
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    // Handle submission state simulator
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateGroup(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            form.classList.add('submitting');

            // Mock asynchronous form transmission delay (1.5 seconds)
            setTimeout(() => {
                form.classList.remove('submitting');
                form.reset();

                // Clear active validation tags
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('valid', 'invalid');
                });

                // Show tactile congratulations message banner
                successBanner.style.display = 'block';

                setTimeout(() => {
                    successBanner.style.display = 'none';
                }, 5000);

            }, 1500);
        }
    });


    // --- 8. MINIMAL FOOTER UTILITIES ---
    // Set dynamic current year in footer copyright
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Back to top scrolling utility
    const backToTopBtn = document.getElementById('back-to-top');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
