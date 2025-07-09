// main.js

// Ejemplo de funcionalidad JS (ej. para un scroll suave o animaciones futuras)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Documento cargado y listo.');

    // Smooth scroll para anclas
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);
            if (targetElement) {
                let navbarHeight = document.querySelector('.navbar').offsetHeight;
                let targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Actualizar clase activa en el nav
                document.querySelectorAll('a.nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Cerrar el menú hamburguesa en móviles después de hacer clic
                const navToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navToggler && navbarCollapse.classList.contains('show')) {
                    navToggler.click();
                }
            }
        });
    });

    // Navbar shrink/change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) { // Asegurarse de que la navbar exista
        const navbarHeightInitial = navbar.offsetHeight; // Altura inicial para referencia si es necesario
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Activar efecto después de scrollear 50px
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }

            // Activar link de navegación según la sección visible (opcional pero bueno para UX)
            let sections = document.querySelectorAll('main section');
            let scrollPosition = window.scrollY + navbar.offsetHeight + 50; // +50px de offset

            sections.forEach(section => {
                if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                    document.querySelectorAll('a.nav-link').forEach(link => link.classList.remove('active'));
                    let correspondingLink = document.querySelector('a.nav-link[href="#' + section.id + '"]');
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
             // Si está en la parte superior, el link "Inicio" debe estar activo
            if (window.scrollY < sections[0].offsetTop - navbar.offsetHeight - 50) {
                 document.querySelectorAll('a.nav-link').forEach(link => link.classList.remove('active'));
                 let homeLink = document.querySelector('a.nav-link[href="#inicio"]');
                 if(homeLink) homeLink.classList.add('active');
            }

        });
    }

    // Activar el enlace correcto al cargar la página si hay un hash en la URL
    if (window.location.hash) {
        let hashLink = document.querySelector('a.nav-link[href="' + window.location.hash + '"]');
        if (hashLink) {
            document.querySelectorAll('a.nav-link').forEach(link => link.classList.remove('active'));
            hashLink.classList.add('active');
             // Scroll to the section if hash exists
            let targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                let navbarHeight = document.querySelector('.navbar').offsetHeight;
                let targetPosition = targetElement.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    /**
     * Inicializa GLightbox para la galería del portafolio
     */
    const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox'
    });

    // Podríamos añadir Isotope para filtrar la galería si fuera necesario en el futuro.
    // Por ahora, solo la funcionalidad de lightbox.

    /**
     * Animaciones ligeras al hacer scroll
     * Agrega la clase 'is-visible' a los elementos con 'animate-on-scroll'
     * cuando entran en el viewport.
     */
    const scrollElements = document.querySelectorAll(".animate-on-scroll");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const elementOutofView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("is-visible");
    };

    const hideScrollElement = (element) => {
        // Opcional: remover la clase si el elemento sale de la vista hacia arriba
        // element.classList.remove("is-visible");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) { // El 1.25 hace que se active un poco antes
                displayScrollElement(el);
            } else if (elementOutofView(el)) {
                // hideScrollElement(el); // Opcional
            }
        });
    };

    if (scrollElements.length > 0) {
        window.addEventListener("scroll", () => {
            handleScrollAnimation();
        });
        // Para elementos ya visibles al cargar
        handleScrollAnimation();
    }


    /**
     * Manejo del formulario de contacto con Formspree
     * (Adaptado de un ejemplo genérico, Formspree maneja la mayoría del trabajo)
     */
    const contactForm = document.querySelector('.php-email-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const form = e.target;
            const data = new FormData(form);
            const action = form.action;
            const loading = form.querySelector('.loading');
            const errorMessage = form.querySelector('.error-message');
            const sentMessage = form.querySelector('.sent-message');

            if (loading) loading.style.display = 'block';
            if (errorMessage) errorMessage.style.display = 'none';
            if (sentMessage) sentMessage.style.display = 'none';

            fetch(action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (loading) loading.style.display = 'none';
                if (response.ok) {
                    if (sentMessage) sentMessage.style.display = 'block';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (errorMessage) {
                            errorMessage.innerHTML = data.errors ? data.errors.map(error => error.message).join(', ') : "Hubo un error al enviar el mensaje. Inténtalo de nuevo.";
                            errorMessage.style.display = 'block';
                        }
                    });
                }
            }).catch(error => {
                if (loading) loading.style.display = 'none';
                if (errorMessage) {
                    errorMessage.innerHTML = "Hubo un error al enviar el mensaje. Verifica tu conexión.";
                    errorMessage.style.display = 'block';
                }
                console.error('Error submitting form:', error);
            });
        });
    }

});

// Aquí se pueden añadir más funciones para:
// - Validación de formularios
// - Interacciones de la galería
// - Efectos dinámicos
// - Manejo de eventos para la sección de servicios (expandir/colapsar)
