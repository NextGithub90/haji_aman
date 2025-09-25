// JavaScript for Haji Aman Website

document.addEventListener("DOMContentLoaded", function () {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    offset: 100,
  });

  // Change fade-left and fade-right to fade-up on mobile
  function updateAOSForMobile() {
    const isMobile = window.innerWidth <= 768;
    const elementsWithFadeLeftRight = document.querySelectorAll('[data-aos="fade-left"], [data-aos="fade-right"]');
    
    elementsWithFadeLeftRight.forEach(element => {
      if (isMobile) {
        // Store original animation for desktop
        if (!element.dataset.originalAos) {
          element.dataset.originalAos = element.dataset.aos;
        }
        element.dataset.aos = 'fade-up';
      } else {
        // Restore original animation for desktop
        if (element.dataset.originalAos) {
          element.dataset.aos = element.dataset.originalAos;
        }
      }
    });
    
    // Refresh AOS to apply changes
    AOS.refresh();
  }

  // Run on load and resize
  updateAOSForMobile();
  window.addEventListener('resize', updateAOSForMobile);

  // Navbar scroll effect
  const navbar = document.getElementById("mainNav");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("navbar-scrolled");
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
    } else {
      navbar.classList.remove("navbar-scrolled");
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    }
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          const navbarToggler = document.querySelector(".navbar-toggler");
          navbarToggler.click();
        }
      }
    });
  });

  // Active navigation highlighting
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        navLinks.forEach((link) => link.classList.remove("active"));
        // Add active class to current nav link
        if (navLink) {
          navLink.classList.add("active");
        }
      }
    });
  });

  // Counter animation for statistics (if needed)
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      element.textContent = Math.floor(start);

      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }

  // Intersection Observer for counter animation
  const counterElements = document.querySelectorAll(".counter");

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute("data-target"));
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counterElements.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  // Loading animation for cards
  const cards = document.querySelectorAll(".feature-card, .service-card, .testimonial-card, .education-card, .media-card");

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("loading");
          cardObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  cards.forEach((card) => {
    cardObserver.observe(card);
  });

  // Form validation and submission (if contact form exists)
  const contactForm = document.querySelector("#contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic form validation
      const formData = new FormData(this);
      let isValid = true;

      // Check required fields
      const requiredFields = this.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
        }
      });

      if (isValid) {
        // Show success message
        showNotification("Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.", "success");
        this.reset();
      } else {
        showNotification("Mohon lengkapi semua field yang diperlukan.", "error");
      }
    });
  }

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type === "error" ? "danger" : type === "success" ? "success" : "info"} notification`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  // WhatsApp button functionality
  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');

  whatsappButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Track WhatsApp click (for analytics)
      if (typeof gtag !== "undefined") {
        gtag("event", "click", {
          event_category: "Contact",
          event_label: "WhatsApp",
        });
      }
    });
  });

  // Phone button functionality
  const phoneButtons = document.querySelectorAll('a[href^="tel:"]');

  phoneButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Track phone click (for analytics)
      if (typeof gtag !== "undefined") {
        gtag("event", "click", {
          event_category: "Contact",
          event_label: "Phone",
        });
      }
    });
  });

  // Video lazy loading for better performance
  const videoContainers = document.querySelectorAll(".video-container");

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target.querySelector("iframe");
          if (iframe && !iframe.src) {
            iframe.src = iframe.getAttribute("data-src");
          }
          videoObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  videoContainers.forEach((container) => {
    const iframe = container.querySelector("iframe");
    if (iframe && iframe.src) {
      iframe.setAttribute("data-src", iframe.src);
      iframe.src = "";
    }
    videoObserver.observe(container);
  });

  // Back to top button
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.className = "btn btn-primary back-to-top";
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(backToTopButton);

  // Show/hide back to top button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  // Back to top functionality
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Preloader (if exists)
  const preloader = document.querySelector(".preloader");

  if (preloader) {
    window.addEventListener("load", function () {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    });
  }

  // Mobile menu enhancement
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", function () {
      // Add animation class
      navbarCollapse.classList.toggle("show-animated");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navbar.contains(e.target) && navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  }

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

  // Apply debounce to scroll events
  const debouncedScrollHandler = debounce(function () {
    // Scroll-dependent functions here
  }, 10);

  window.addEventListener("scroll", debouncedScrollHandler);

  // Initialize tooltips (if Bootstrap tooltips are used)
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers (if Bootstrap popovers are used)
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Video loading function for thumbnails
  window.loadVideo = function (element, videoUrl) {
    const iframe = document.createElement("iframe");
    iframe.src = videoUrl;
    iframe.title = "Video Player";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "200px";
    iframe.style.borderRadius = "10px";

    element.parentNode.replaceChild(iframe, element);
  };

  console.log("Haji Aman website loaded successfully!");
});
