const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterSuccess = document.querySelector("[data-newsletter-success]");
const newsletterError = document.querySelector("[data-newsletter-error]");
const skinQuiz = document.querySelector("[data-skin-quiz]");

function updateHeaderShadow() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderShadow();
window.addEventListener("scroll", updateHeaderShadow, { passive: true });

function closeMenu() {
  if (!header || !menuToggle) return;
  header.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

if (header && menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

if (newsletterForm && newsletterSuccess && newsletterError) {
  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    newsletterSuccess.hidden = true;
    newsletterError.hidden = true;

    const endpoint = newsletterForm.dataset.endpoint.trim();
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const formData = new FormData(newsletterForm);

    formData.append("submittedAt", new Date().toISOString());

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

if (skinQuiz) {
  const quizQuestions = Array.from({ length: 10 }, (_, index) => ({
    question: `Question ${index + 1} placeholder`,
    answers: [
      { label: "Answer A placeholder", type: "A" },
      { label: "Answer B placeholder", type: "B" },
      { label: "Answer C placeholder", type: "C" },
    ],
  }));

  const quizResults = {
    A: {
      title: "Your skin type is A",
      copy: "Placeholder description for skin type A. Karla will add the final guidance and treatment recommendation.",
    },
    B: {
      title: "Your skin type is B",
      copy: "Placeholder description for skin type B. Karla will add the final guidance and treatment recommendation.",
    },
    C: {
      title: "Your skin type is C",
      copy: "Placeholder description for skin type C. Karla will add the final guidance and treatment recommendation.",
    },
  };

  const quizIntro = skinQuiz.querySelector("[data-quiz-intro]");
  const quizQuestionsPanel = skinQuiz.querySelector("[data-quiz-questions]");
  const quizResult = skinQuiz.querySelector("[data-quiz-result]");
  const quizStart = skinQuiz.querySelector("[data-quiz-start]");
  const quizRestart = skinQuiz.querySelector("[data-quiz-restart]");
  const quizProgress = skinQuiz.querySelector("[data-quiz-progress]");
  const quizProgressBar = skinQuiz.querySelector("[data-quiz-progress-bar]");
  const quizQuestion = skinQuiz.querySelector("[data-quiz-question]");
  const quizChoices = skinQuiz.querySelector("[data-quiz-choices]");
  const quizResultTitle = skinQuiz.querySelector("[data-quiz-result-title]");
  const quizResultCopy = skinQuiz.querySelector("[data-quiz-result-copy]");
  let currentQuestion = 0;
  let answers = [];

  function getQuizResultType() {
    const totals = answers.reduce(
      (count, answer) => ({ ...count, [answer]: count[answer] + 1 }),
      { A: 0, B: 0, C: 0 },
    );
    const highestTotal = Math.max(...Object.values(totals));
    const leaders = Object.keys(totals).filter(
      (type) => totals[type] === highestTotal,
    );

    return [...answers].reverse().find((answer) => leaders.includes(answer)) || "A";
  }

  function showQuizResult() {
    const result = quizResults[getQuizResultType()];
    quizQuestionsPanel.hidden = true;
    quizResultTitle.textContent = result.title;
    quizResultCopy.textContent = result.copy;
    quizResult.hidden = false;
  }

  function renderQuestion() {
    const current = quizQuestions[currentQuestion];
    quizProgress.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    quizProgressBar.value = currentQuestion + 1;
    quizQuestion.textContent = current.question;
    quizChoices.replaceChildren(
      ...current.answers.map((answer) => {
        const choice = document.createElement("button");
        choice.className = "quiz-choice";
        choice.type = "button";
        choice.textContent = answer.label;
        choice.addEventListener("click", () => {
          answers.push(answer.type);
          currentQuestion += 1;

          if (currentQuestion === quizQuestions.length) {
            showQuizResult();
            return;
          }

          renderQuestion();
        });
        return choice;
      }),
    );
  }

  function startQuiz() {
    currentQuestion = 0;
    answers = [];
    quizIntro.hidden = true;
    quizResult.hidden = true;
    quizQuestionsPanel.hidden = false;
    renderQuestion();
  }

  quizStart.addEventListener("click", startQuiz);
  quizRestart.addEventListener("click", startQuiz);
}
