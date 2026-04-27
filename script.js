const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("show");
    });
});

/* =========================
   HEADER AL HACER SCROLL
========================= */

window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* =========================
   MENÚ ACTIVO POR SECCIÓN
========================= */

const sectionLinks = document.querySelectorAll(".nav a[href^='#']");
const observedSections = Array.from(sectionLinks)
    .map((link) => {
        const sectionId = link.getAttribute("href");
        return document.querySelector(sectionId);
    })
    .filter(Boolean);

function updateActiveMenu() {
    const scrollPosition = window.scrollY + 140;

    observedSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = `#${section.id}`;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            sectionLinks.forEach((link) => {
                link.classList.remove("active");

                if (link.getAttribute("href") === sectionId) {
                    link.classList.add("active");
                }
            });
        }
    });
}

window.addEventListener("scroll", updateActiveMenu);
window.addEventListener("load", updateActiveMenu);

/* =========================
   CARRUSEL HERO
========================= */

const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");

let currentSlide = 0;
let carouselInterval;

function showSlide(index) {
    if (!slides.length) return;

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    slides[currentSlide].classList.add("active");

    if (dots[currentSlide]) {
        dots[currentSlide].classList.add("active");
    }
}

function nextHeroSlide() {
    showSlide(currentSlide + 1);
}

function prevHeroSlide() {
    showSlide(currentSlide - 1);
}

function startCarousel() {
    carouselInterval = setInterval(nextHeroSlide, 5000);
}

function resetCarousel() {
    clearInterval(carouselInterval);
    startCarousel();
}

if (slides.length) {
    startCarousel();

    if (nextSlide) {
        nextSlide.addEventListener("click", () => {
            nextHeroSlide();
            resetCarousel();
        });
    }

    if (prevSlide) {
        prevSlide.addEventListener("click", () => {
            prevHeroSlide();
            resetCarousel();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            resetCarousel();
        });
    });
}

/* =========================
   CARRUSELES DE GALERÍA
========================= */

const eventCarousels = document.querySelectorAll(".event-carousel");

eventCarousels.forEach((carousel, carouselIndex) => {
    const eventSlides = carousel.querySelectorAll(".event-slide");
    const prevButton = carousel.querySelector(".event-prev");
    const nextButton = carousel.querySelector(".event-next");
    const currentPhoto = carousel.querySelector(".current-photo");

    let currentEventSlide = 0;
    let eventInterval;

    function showEventSlide(index) {
        if (!eventSlides.length) return;

        if (index >= eventSlides.length) {
            currentEventSlide = 0;
        } else if (index < 0) {
            currentEventSlide = eventSlides.length - 1;
        } else {
            currentEventSlide = index;
        }

        eventSlides.forEach((slide) => {
            slide.classList.remove("active");
        });

        eventSlides[currentEventSlide].classList.add("active");

        if (currentPhoto) {
            currentPhoto.textContent = currentEventSlide + 1;
        }
    }

    function nextEventSlide() {
        showEventSlide(currentEventSlide + 1);
    }

    function startEventCarousel() {
        eventInterval = setInterval(nextEventSlide, 4200 + carouselIndex * 600);
    }

    function resetEventCarousel() {
        clearInterval(eventInterval);
        startEventCarousel();
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            nextEventSlide();
            resetEventCarousel();
        });
    }

    if (prevButton) {
        prevButton.addEventListener("click", () => {
            showEventSlide(currentEventSlide - 1);
            resetEventCarousel();
        });
    }

    carousel.addEventListener("mouseenter", () => {
        clearInterval(eventInterval);
    });

    carousel.addEventListener("mouseleave", () => {
        startEventCarousel();
    });

    startEventCarousel();
});

/* =========================
   IMÁGENES DE RESPALDO HERO
========================= */

const imageFallbacks = document.querySelectorAll("img");

imageFallbacks.forEach((img) => {
    img.addEventListener("error", () => {
        if (
            img.src.includes("hero-2.jpg") ||
            img.src.includes("hero-3.jpg")
        ) {
            img.src = "assets/hero.jpg";
        }
    });
});

/* =========================
   CONFIGURACIÓN GENERAL
========================= */

const WHATSAPP_NUMBER = "573124268479";
const DONATION_LINK = "https://secure.payco.co/checkoutopen/1daa4002-2450-4c38-9998-48d32def8e7c";

/* =========================
   BOTONES DE DONACIÓN
========================= */

const donationButtons = document.querySelectorAll(
    '.btn-donar, .donation-pay-button, .btn-secondary[href="#donar"]'
);

donationButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        window.open(DONATION_LINK, "_blank");
    });
});

/* =========================
   BOTONES DE PROYECTOS A WHATSAPP
========================= */

const projectButtons = document.querySelectorAll(".project-whatsapp-button");

projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const message = button.getAttribute("data-message");

        if (!message) return;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
    });
});

/* =========================
   FORMULARIO DE CONTACTO
========================= */

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const inputs = contactForm.querySelectorAll("input");
        const textarea = contactForm.querySelector("textarea");

        const nombre = inputs[0].value.trim();
        const correo = inputs[1].value.trim();
        const asunto = inputs[2].value.trim();
        const mensaje = textarea.value.trim();

        if (!nombre || !correo || !asunto || !mensaje) {
            alert("Por favor completa todos los campos antes de enviar.");
            return;
        }

        const textoWhatsApp = `
Hola, quiero contactar a la Fundación Transformando Vidas.

Nombre: ${nombre}
Correo: ${correo}
Asunto: ${asunto}
Mensaje: ${mensaje}
    `;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoWhatsApp)}`;

        window.open(url, "_blank");

        contactForm.reset();
    });
}