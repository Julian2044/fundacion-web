const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const pageSections = document.querySelectorAll("main > section[id]");
const decorativeWave = document.querySelector(".wave-section");

function getHeaderOffset() {
return header ? header.offsetHeight + 18 : 0;
}

function scrollToSection(target) {
if (!target) return;

const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

window.scrollTo({
top: Math.max(targetTop, 0),
behavior: "smooth",
});
}

function showSingleSection(sectionId, options = {}) {
const target = document.getElementById(sectionId);
if (!target) return;

const { pushState = false, scroll = true } = options;

document.body.classList.add("single-section-mode");

pageSections.forEach((section) => {
const isActive = section.id === sectionId;
section.hidden = !isActive;
section.classList.toggle("is-active-section", isActive);
section.classList.toggle("is-hidden-section", !isActive);
});

if (decorativeWave) {
const showWave = false;
decorativeWave.hidden = !showWave;
decorativeWave.classList.toggle("is-hidden-section", !showWave);
}

setActiveMenu(sectionId);

if (pushState && window.location.hash !== `#${sectionId}`) {
history.pushState({ sectionId }, "", `#${sectionId}`);
}

if (scroll) {
window.requestAnimationFrame(() => scrollToSection(target));
}
}

/* =========================
MENÚ MÓVIL
========================= */

function closeMobileMenu() {
if (!menuToggle || !nav) return;

nav.classList.remove("show");
menuToggle.setAttribute("aria-expanded", "false");

const icon = menuToggle.querySelector(".menu-icon");
if (icon) {
icon.textContent = "☰";
}
}

function openMobileMenu() {
if (!menuToggle || !nav) return;

nav.classList.add("show");
menuToggle.setAttribute("aria-expanded", "true");

const icon = menuToggle.querySelector(".menu-icon");
if (icon) {
icon.textContent = "×";
}
}

function toggleMobileMenu() {
if (!menuToggle || !nav) return;

const isOpen = nav.classList.contains("show");

if (isOpen) {
closeMobileMenu();
} else {
openMobileMenu();
}
}

if (menuToggle && nav) {
menuToggle.addEventListener("click", (event) => {
event.preventDefault();
event.stopPropagation();
toggleMobileMenu();
});

menuToggle.addEventListener("touchstart", (event) => {
event.stopPropagation();
});
}

navLinks.forEach((link) => {
link.addEventListener("click", (event) => {
const sectionId = link.getAttribute("href");
const target = sectionId ? document.querySelector(sectionId) : null;

if (target) {
event.preventDefault();
showSingleSection(target.id, { pushState: true });
}

closeMobileMenu();
});
});

const internalSectionLinks = document.querySelectorAll(
"a[href^='#']:not(.btn-donar):not(.donation-pay-button):not(.btn-secondary[href='#donar'])"
);

internalSectionLinks.forEach((link) => {
if (link.closest(".nav")) return;

link.addEventListener("click", (event) => {
const sectionId = link.getAttribute("href");
if (!sectionId || sectionId === "#") return;

const target = document.querySelector(sectionId);
if (!target) return;

event.preventDefault();
showSingleSection(target.id, { pushState: true });
});
});

document.addEventListener("click", (event) => {
if (!menuToggle || !nav) return;

const clickedInsideMenu = nav.contains(event.target);
const clickedMenuButton = menuToggle.contains(event.target);

if (!clickedInsideMenu && !clickedMenuButton) {
closeMobileMenu();
}
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
closeMobileMenu();
}
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
let currentSection = observedSections[0];
const scrollPosition = window.scrollY + getHeaderOffset() + 40;

observedSections.forEach((section) => {
if (scrollPosition >= section.offsetTop) {
currentSection = section;
}
});

if (currentSection) {
setActiveMenu(currentSection.id);
}
}

function setActiveMenu(sectionId) {
sectionLinks.forEach((link) => {
link.classList.remove("active");
link.removeAttribute("aria-current");

if (link.getAttribute("href") === `#${sectionId}`) {
link.classList.add("active");
link.setAttribute("aria-current", "page");
}
});
}

const activeMenuObserver = "IntersectionObserver" in window
? new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
setActiveMenu(entry.target.id);
}
});
}, {
rootMargin: `-${getHeaderOffset() + 20}px 0px -58% 0px`,
threshold: 0.01,
})
: null;

if (activeMenuObserver) {
observedSections.forEach((section) => activeMenuObserver.observe(section));
} else {
window.addEventListener("scroll", updateActiveMenu, { passive: true });
}

window.addEventListener("load", () => {
const initialSection = window.location.hash
? document.querySelector(window.location.hash)
: document.getElementById("inicio");

showSingleSection(initialSection ? initialSection.id : "inicio", { scroll: false });
window.scrollTo({ top: 0, behavior: "auto" });
});

window.addEventListener("resize", updateActiveMenu);

window.addEventListener("popstate", () => {
const target = window.location.hash
? document.querySelector(window.location.hash)
: document.getElementById("inicio");

showSingleSection(target ? target.id : "inicio", { scroll: true });
});

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
ANIMACIONES AL APARECER
========================= */

const revealElements = document.querySelectorAll(
"section:not(.hero), .section-title, .about-card, .policy-card, .project-card, .timeline-item, .featured-news, .donation-card, .contact-info, .contact-form"
);

if ("IntersectionObserver" in window) {
revealElements.forEach((element, index) => {
element.classList.add("reveal-on-scroll");
element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});
}, {
threshold: 0.12,
rootMargin: "0px 0px -80px 0px",
});

revealElements.forEach((element) => revealObserver.observe(element));
} else {
revealElements.forEach((element) => element.classList.add("is-visible"));
}

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
