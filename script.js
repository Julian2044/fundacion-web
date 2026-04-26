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
   CONFIGURACIÓN GENERAL
========================= */

// Cambia este número por el WhatsApp real de la fundación.
// Debe ir con indicativo de país, sin espacios ni signos.
// Ejemplo Colombia: 573001234567
const WHATSAPP_NUMBER = "573124268479";

// Cuando tengas el link real de donación, lo pegas aquí.
// Puede ser Wompi, Nequi, Bancolombia, PSE, PayPal, etc.
const DONATION_LINK = "#";

/* =========================
   BOTONES DE DONACIÓN
========================= */

const donationButtons = document.querySelectorAll(
  'a[href="#donar"], .btn-donar'
);

donationButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (DONATION_LINK === "#") {
      return;
    }

    event.preventDefault();
    window.open(DONATION_LINK, "_blank");
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