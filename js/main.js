const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll(".reveal");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sections = document.querySelectorAll("main section[id]");

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

function closeMobileMenu() {
  menuToggle.classList.remove("active");
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-45% 0px -45% 0px",
  threshold: 0
});

sections.forEach((section) => sectionObserver.observe(section));

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  document.body.classList.remove("menu-open");
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const error = wrapper.querySelector(".error-message");
  wrapper.classList.toggle("error", Boolean(message));
  error.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  let isValid = true;

  setFieldError(name, "");
  setFieldError(email, "");
  setFieldError(message, "");
  formStatus.textContent = "";

  if (!name.value.trim()) {
    setFieldError(name, "Please enter your name.");
    isValid = false;
  }

  if (!email.value.trim()) {
    setFieldError(email, "Please enter your email address.");
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!message.value.trim()) {
    setFieldError(message, "Please enter your message.");
    isValid = false;
  }

  if (isValid) {
    formStatus.textContent = "Message ready to send. Thank you for contacting NorthBorneo.";
    contactForm.reset();
  }
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();
