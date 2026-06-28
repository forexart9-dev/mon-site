const partnerStackUrl = "https://www.partnerstack.com/";

// Remplace automatiquement tous les CTA par le lien PartnerStack centralise.
document.querySelectorAll("[data-partner-link]").forEach((link) => {
  link.href = partnerStackUrl;
});

const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const navToggle = document.querySelector(".nav-toggle");
const navIcon = navToggle?.querySelector("i");

const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  menu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  navToggle?.setAttribute("aria-expanded", "false");

  if (navIcon) {
    navIcon.setAttribute("data-lucide", "menu");
    refreshIcons();
  }
};

navToggle?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));

  if (navIcon) {
    navIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    refreshIcons();
  }
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Anime les blocs seulement lorsqu'ils entrent dans le viewport.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("[data-form-status]");

// Validation legere et lisible pour eviter les formulaires incomplets.
const validators = {
  name(value) {
    return value.trim().length >= 2 ? "" : "Veuillez saisir au moins 2 caractères.";
  },
  email(value) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    return isValid ? "" : "Veuillez saisir une adresse email valide.";
  },
  message(value) {
    return value.trim().length >= 12 ? "" : "Votre message doit contenir au moins 12 caractères.";
  }
};

const showFieldError = (field, message) => {
  const error = document.querySelector(`[data-error-for="${field.name}"]`);
  field.classList.toggle("is-invalid", Boolean(message));
  if (error) {
    error.textContent = message;
  }
};

const validateField = (field) => {
  const validator = validators[field.name];
  if (!validator) {
    return true;
  }

  const message = validator(field.value);
  showFieldError(field, message);
  return !message;
};

form?.addEventListener("input", (event) => {
  if (event.target.matches("input, textarea")) {
    validateField(event.target);
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Array.from(form.querySelectorAll("input, textarea"));
  const isValid = fields.every(validateField);

  if (!isValid) {
    statusMessage.textContent = "Corrigez les champs indiqués avant l’envoi.";
    statusMessage.style.color = "#c2410c";
    return;
  }

  statusMessage.textContent = "Merci, votre message est prêt à être envoyé.";
  statusMessage.style.color = "#0f766e";
  form.reset();
});

refreshIcons();
