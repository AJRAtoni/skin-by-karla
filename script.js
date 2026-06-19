const header = document.querySelector("[data-header]");
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterSuccess = document.querySelector("[data-newsletter-success]");
const newsletterError = document.querySelector("[data-newsletter-error]");

function updateHeaderShadow() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderShadow();
window.addEventListener("scroll", updateHeaderShadow, { passive: true });

if (newsletterForm && newsletterSuccess && newsletterError) {
  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    newsletterSuccess.hidden = true;
    newsletterError.hidden = true;

    const endpoint = newsletterForm.dataset.endpoint.trim();
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const formData = new FormData(newsletterForm);

    formData.append("source", window.location.href);
    formData.append("submittedAt", new Date().toISOString());
    formData.append("userAgent", navigator.userAgent);

    if (formData.get("website")) {
      newsletterForm.reset();
      newsletterSuccess.hidden = false;
      return;
    }

    if (!endpoint) {
      newsletterForm.reset();
      newsletterSuccess.hidden = false;
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Joining...";

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      newsletterForm.reset();
      newsletterSuccess.hidden = false;
    } catch (error) {
      newsletterError.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Join";
    }
  });
}
