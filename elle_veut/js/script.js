/* ============================================
   GROUPE LA PASSERELLE - INTERACTIONS JAVASCRIPT
   4+ Fonctionnalités dynamiques exigées
   ============================================ */

// ----- 1. MENU BURGER ET NAVIGATION MOBILE -----
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burgerBtn');
    const navbar = document.getElementById('navbar');

    if (burger && navbar) {
        // Toggle menu burger
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            navbar.classList.toggle('active');
            burger.classList.toggle('active');
            document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Fermer menu si clic en dehors
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && !burger.contains(e.target) && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                burger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Gérer dropdowns sur mobile
        const dropdowns = document.querySelectorAll('.dropdown > a');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });
    }

    // ----- 2. CARROUSEL D'IMAGES AUTOMATIQUE -----
    function initCarousel() {
        const carouselContainer = document.getElementById('carousel');
        if (!carouselContainer) return;

        const images = [
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop'

        ];

        let currentIndex = 0;

        const imgElement = document.createElement('img');
        imgElement.src = images[currentIndex];
        imgElement.alt = 'Expertises Groupe La Passerelle';
        imgElement.classList.add('carousel-slide');
        carouselContainer.appendChild(imgElement);

        // Création des indicateurs
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            indicators.appendChild(dot);
        });
        carouselContainer.appendChild(indicators);

        // Animation automatique
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            imgElement.src = images[currentIndex];
            imgElement.style.animation = 'fadeIn 0.5s';

            // Mise à jour indicateurs
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }, 4000);

        // Gestion clic sur indicateurs
        indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                currentIndex = parseInt(e.target.dataset.index);
                imgElement.src = images[currentIndex];
            }
        });
    }

    initCarousel();

    // ----- 3. MODE SOMBRE AVEC PERSISTANCE -----
    function initDarkMode() {
        const darkModeBtn = document.getElementById('darkModeBtn');
        if (!darkModeBtn) return;

        // Vérifier préférence sauvegardée
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeBtn.textContent = '☀️';
        }

        darkModeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                this.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                this.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }

            // Animation de transition
            document.body.style.transition = 'background-color 0.3s, color 0.3s';
        });
    }

    initDarkMode();

    // ----- 4. VALIDATION FORMULAIRE AVANCÉE -----
    function initFormValidation() {
        const contactForm = document.querySelector('.contact-form form');
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, textarea, select');

        // Validation en temps réel
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        function validateField(field) {
            const errorElement = field.nextElementSibling ? .classList.contains('error-message') ?
                field.nextElementSibling :
                document.createElement('span');

            if (!errorElement.classList.contains('error-message')) {
                errorElement.className = 'error-message';
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }

            let isValid = true;
            let errorMessage = '';

            switch (field.id) {
                case 'nom':
                case 'prenom':
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'Ce champ est requis';
                    } else if (field.value.trim().length < 2) {
                        isValid = false;
                        errorMessage = 'Minimum 2 caractères';
                    }
                    break;

                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'L\'email est requis';
                    } else if (!emailRegex.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Format d\'email invalide';
                    }
                    break;

                case 'telephone':
                    if (field.value.trim()) {
                        const phoneRegex = /^[0-9+\-\s]{10,}$/;
                        if (!phoneRegex.test(field.value)) {
                            isValid = false;
                            errorMessage = 'Numéro de téléphone invalide';
                        }
                    }
                    break;

                case 'message':
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'Le message est requis';
                    } else if (field.value.trim().length < 10) {
                        isValid = false;
                        errorMessage = 'Minimum 10 caractères';
                    }
                    break;
            }

            if (!isValid) {
                field.classList.add('error');
                field.style.borderColor = '#dc3545';
                errorElement.textContent = errorMessage;
            } else {
                field.classList.remove('error');
                field.style.borderColor = 'var(--gray-300)';
                errorElement.textContent = '';
            }

            return isValid;
        }

        // Validation soumission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Animation de succès
                const submitBtn = this.querySelector('.btn-submit');
                submitBtn.textContent = '✓ Envoi réussi !';
                submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

                // Simuler envoi
                setTimeout(() => {
                    alert('✅ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
                    this.reset();
                    submitBtn.textContent = 'Envoyer le message';
                    submitBtn.style.background = 'linear-gradient(135deg, var(--secondary), var(--secondary-dark))';
                }, 1000);
            } else {
                alert('❌ Veuillez corriger les erreurs dans le formulaire');

                // Scroll vers première erreur
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    initFormValidation();

    // ----- 5. ANIMATIONS AU SCROLL -----
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observer les cartes et sections
        document.querySelectorAll('.card, .membre-card, .article-card, .expertise-header').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s, transform 0.6s';
            observer.observe(el);
        });
    }

    initScrollAnimations();

    // ----- 6. COMPTEUR DYNAMIQUE (STATISTIQUES) -----
    function initCounters() {
        const counters = document.querySelectorAll('.counter');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Observer pour démarrer le compteur
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    initCounters();
});

// ----- 7. FILTRAGE DYNAMIQUE (ACTUALITÉS) -----
function filterArticles(category) {
    const articles = document.querySelectorAll('.article-card');

    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = 'block';
            article.style.animation = 'fadeIn 0.5s';
        } else {
            article.style.display = 'none';
        }
    });

    // Mise à jour bouton actif
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
}

// ----- 8. CHARGEMENT DYNAMIQUE DES OFFRES -----
function loadJobs() {
    const jobsContainer = document.querySelector('.jobs-list');
    if (!jobsContainer) return;

    const jobs = [{
            title: 'Développeur Full Stack',
            type: 'CDI',
            location: 'Paris',
            description: 'React, Node.js, MongoDB'
        },
        {
            title: 'Data Scientist',
            type: 'CDI',
            location: 'Lyon',
            description: 'Python, TensorFlow, Big Data'
        },
        {
            title: 'Architecte Sécurité',
            type: 'CDI',
            location: 'Paris',
            description: 'Cybersécurité, Audit, ISO 27001'
        },
        {
            title: 'Administrateur Réseaux',
            type: 'CDI',
            location: 'Toulouse',
            description: 'Cisco, Juniper, SD-WAN'
        }
    ];

    jobsContainer.innerHTML = jobs.map(job => `
        <div class="job-card">
            <h3>${job.title}</h3>
            <span class="job-badge ${job.type.toLowerCase()}">${job.type}</span>
            <span class="job-location">📍 ${job.location}</span>
            <p>${job.description}</p>
            <button class="btn-submit" style="margin-top: 1rem;">Postuler</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', loadJobs);