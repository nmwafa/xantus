document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const dropdownTrigger = document.getElementById("dropdownTrigger");
  const navItemDropdown = document.getElementById("navItemDropdown");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      if (!open && navItemDropdown) {
        navItemDropdown.classList.remove("open");
        if (dropdownTrigger)
          dropdownTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (dropdownTrigger && navItemDropdown) {
    dropdownTrigger.addEventListener("click", (event) => {
      if (window.innerWidth <= 720) {
        event.preventDefault();
        const open = navItemDropdown.classList.toggle("open");
        dropdownTrigger.setAttribute("aria-expanded", String(open));
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const header = document.getElementById("nav");
      const offset = header ? header.offsetHeight : 76;
      const top =
        target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top, behavior: "smooth" });
      if (navLinks) navLinks.classList.remove("open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      const active = item.classList.contains("active");
      document.querySelectorAll(".faq-item.active").forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove("active");
      });
      item.classList.toggle("active", !active);
    });
  });

  document.querySelectorAll("[data-prefill]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-prefill");
      const select = document.getElementById("contact-service");
      if (!select || !value) return;
      const option = Array.from(select.options).find(
        (o) =>
          o.value.toLowerCase().includes(value.toLowerCase()) ||
          o.textContent.toLowerCase().includes(value.toLowerCase()),
      );
      if (option) select.value = option.value;
    });
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const status = document.getElementById("formStatus");
    const submit = document.getElementById("submitBtn");
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      submit.disabled = true;
      submit.textContent = "Sending...";
      if (status) {
        status.textContent = "";
        status.className = "status-msg";
      }
      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contactForm),
        });
        if (!response.ok) throw new Error("Form submission failed");
        if (status) {
          status.textContent =
            "[OK] Message received. An engineer will follow up within one business day.";
          status.className = "status-msg ok";
        }
        contactForm.reset();
      } catch (error) {
        if (status) {
          status.textContent =
            "[ERROR] Please email service@xantus.web.id directly.";
          status.className = "status-msg err";
        }
      } finally {
        submit.disabled = false;
        submit.textContent = "Send Message";
      }
    });
  }
});
