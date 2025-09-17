// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Initialize testimonial carousel
  initTestimonialCarousel();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize smooth scrolling
  initSmoothScrolling();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking on a nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll to section function for CTA button
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// WhatsApp Integration
// function contactWhatsApp(serviceName) {
//   // Replace with actual phone number (without + and spaces)
//   const phoneNumber = "+6285237599044"; // Placeholder number - replace with actual business number
//   const message = encodeURIComponent(
//     ` Halo, saya ingin memesan layanan cuci sepatu ${serviceName}. Mohon informasinya. `
//   );
//   const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
//   window.open(whatsappURL, "_blank");
// }

let layananDipilih = [];

function toggleLayanan(button, layanan, harga, inputId) {
  const qtyInput = document.getElementById(inputId);
  const qty = parseInt(qtyInput.value);

  // cek apakah layanan sudah ada di daftar
  const index = layananDipilih.findIndex((item) => item.nama === layanan);

  if (index !== -1) {
    // hapus dari daftar
    layananDipilih.splice(index, 1);
    button.classList.remove("btn-selected");
    button.textContent = "Pilih Layanan";
  } else {
    // tambah ke daftar dengan qty & harga
    layananDipilih.push({ nama: layanan, harga: harga, qty: qty });
    button.classList.add("btn-selected");
    button.textContent = "Dipilih ✔";
  }
}

function pesanWhatsApp() {
  if (layananDipilih.length === 0) {
    alert("Silakan pilih minimal 1 layanan");
    return;
  }

  let pesan = "Halo, saya ingin memesan layanan berikut:\n";
  let total = 0;

  layananDipilih.forEach((item) => {
    let subtotal = item.harga * item.qty;
    total += subtotal;
    pesan += `- ${item.nama} (${
      item.qty
    } pasang) = Rp ${subtotal.toLocaleString("id-ID")}\n`;
  });

  pesan += `\nTotal: Rp ${total.toLocaleString("id-ID")}\nMohon informasinya..`;

  let url = "https://wa.me/+6285237599044?text=" + encodeURIComponent(pesan);
  window.open(url, "_blank");
}

// Testimonial Carousel
let currentTestimonial = 0;
let testimonialInterval;
let isCarouselPaused = false;

function initTestimonialCarousel() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  const carousel = document.querySelector(".testimonials-container");

  showSlide(0);

  // Auto advance carousel every 5 seconds
  startCarouselAutoplay();

  // Pause on hover
  carousel.addEventListener("mouseenter", function () {
    pauseCarousel();
  });

  // Resume on mouse leave
  carousel.addEventListener("mouseleave", function () {
    resumeCarousel();
  });

  // Touch events for mobile
  let startX = 0;
  let isDragging = false;

  carousel.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    pauseCarousel();
  });

  carousel.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener("touchend", function (e) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        changeSlide(1); // Swipe left - next slide
      } else {
        changeSlide(-1); // Swipe right - previous slide
      }
    }

    resumeCarousel();
  });
}

function startCarouselAutoplay() {
  testimonialInterval = setInterval(function () {
    if (!isCarouselPaused) {
      nextSlide();
    }
  }, 5000);
}

function pauseCarousel() {
  isCarouselPaused = true;
}

function resumeCarousel() {
  isCarouselPaused = false;
}

function showSlide(index) {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");

  // Remove active class from all slides and dots
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to current slide and dot
  slides[index].classList.add("active");
  dots[index].classList.add("active");

  currentTestimonial = index;
}

function nextSlide() {
  const slides = document.querySelectorAll(".testimonial-slide");
  currentTestimonial = (currentTestimonial + 1) % slides.length;
  showSlide(currentTestimonial);
}

function previousSlide() {
  const slides = document.querySelectorAll(".testimonial-slide");
  currentTestimonial =
    currentTestimonial === 0 ? slides.length - 1 : currentTestimonial - 1;
  showSlide(currentTestimonial);
}

function changeSlide(direction) {
  if (direction === 1) {
    nextSlide();
  } else {
    previousSlide();
  }
}

function currentSlide(index) {
  showSlide(index - 1); // Convert to 0-based index
}

// Navigation scroll effect
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(10px)";
  } else {
    header.style.backgroundColor = "#ffffff";
    header.style.backdropFilter = "none";
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
window.addEventListener("load", function () {
  const animateElements = document.querySelectorAll(
    ".service-card, .feature-card, .info-card, .testimonials-container, .social-link, .map-container"
  );
  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to scroll event
const debouncedScrollHandler = debounce(function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(10px)";
  } else {
    header.style.backgroundColor = "#ffffff";
    header.style.backdropFilter = "none";
  }
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// Accessibility improvements
document.addEventListener("keydown", function (e) {
  // Enable keyboard navigation for carousel
  if (e.key === "ArrowLeft") {
    if (document.activeElement.closest(".testimonials-container")) {
      e.preventDefault();
      previousSlide();
    }
  } else if (e.key === "ArrowRight") {
    if (document.activeElement.closest(".testimonials-container")) {
      e.preventDefault();
      nextSlide();
    }
  }

  // Close mobile menu with Escape key
  if (e.key === "Escape") {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    if (navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  }
});

// Add focus indicators for better accessibility
document.addEventListener("DOMContentLoaded", function () {
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #eae17eff";
      this.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "";
      this.style.outlineOffset = "";
    });
  });
});
