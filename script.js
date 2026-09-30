(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const progressBar = document.getElementById("progressBar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    themeIcon.textContent = root.dataset.theme === "dark" ? "☼" : "◐";
  }

  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navLinks.classList.toggle("open", !open);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }, { passive: true });

  // Reveal on scroll
  const revealEls = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Active navigation
  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...navLinks.querySelectorAll("a")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navAnchors.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${visible.target.id}`);
      });
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0, .2, .5]
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Journey slider
  const journeyTrack = document.getElementById("journeyTrack");
  const journeyCards = [...journeyTrack.querySelectorAll(".journey-card")];
  const journeyPrev = document.getElementById("journeyPrev");
  const journeyNext = document.getElementById("journeyNext");
  const journeyPagination = document.getElementById("journeyPagination");
  let journeyIndex = 0;

  journeyCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Buka tahap perjalanan ${index + 1}`);
    dot.addEventListener("click", () => goJourney(index));
    journeyPagination.appendChild(dot);
  });

  const journeyDots = [...journeyPagination.children];

  function updateJourneyState(index) {
    journeyIndex = Math.max(0, Math.min(index, journeyCards.length - 1));
    journeyCards.forEach((card, i) => card.classList.toggle("active", i === journeyIndex));
    journeyDots.forEach((dot, i) => dot.classList.toggle("active", i === journeyIndex));
  }

  function goJourney(index) {
    updateJourneyState(index);
    journeyCards[journeyIndex].scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest"
    });
  }

  journeyPrev.addEventListener("click", () => goJourney(journeyIndex - 1));
  journeyNext.addEventListener("click", () => goJourney(journeyIndex + 1));

  let journeyScrollTimer;
  journeyTrack.addEventListener("scroll", () => {
    clearTimeout(journeyScrollTimer);
    journeyScrollTimer = setTimeout(() => {
      const trackRect = journeyTrack.getBoundingClientRect();
      let closest = 0;
      let closestDist = Infinity;
      journeyCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left - trackRect.left);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      updateJourneyState(closest);
    }, 80);
  }, { passive: true });

  journeyTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goJourney(journeyIndex + 1);
    if (event.key === "ArrowLeft") goJourney(journeyIndex - 1);
  });

  updateJourneyState(0);

  // Project carousel
  const projects = [
    {
      title: "PRISMA — Internal Workforce Monitoring System",
      text: "Sistem internal yang mengintegrasikan kebutuhan monitoring performa, training, OJT, evaluasi, reporting, dan alur kerja lintas peran.",
      tags: ["Workflow Design", "Cloudflare Worker", "Database", "Reporting"],
      intro: "Project ini lahir dari kebutuhan kerja nyata, bukan dari brief latihan pemrograman.",
      problem: "Data dan proses evaluasi, training, monitoring, serta reporting tersebar dan membutuhkan banyak pekerjaan administratif berulang.",
      approach: "Memetakan proses, membagi role dan hak akses, menyusun alur data, lalu mengembangkan workflow digital secara bertahap.",
      contribution: "Inisiasi kebutuhan, process mapping, system design, UI flow, implementasi, testing, dan continuous improvement.",
      outcome: "Satu workspace internal yang membantu proses monitoring, evaluasi, OJT, reporting, dan pengembangan SDM menjadi lebih terstruktur."
    },
    {
      title: "Digital Assessment & Training Workflow",
      text: "Penyederhanaan proses penilaian, matrix kompetensi, screening, OJT, dan dokumentasi training agar lebih mudah ditelusuri.",
      tags: ["Google Sheets", "Apps Script", "Assessment", "Automation"],
      intro: "Sebelum berkembang menjadi sistem yang lebih besar, improvement dimulai dari tools yang paling dekat dengan pekerjaan sehari-hari.",
      problem: "Penilaian dan perkembangan peserta perlu dipantau secara konsisten, sementara data manual mudah tersebar dan sulit direkap.",
      approach: "Menyusun form, matrix, rekap terstruktur, dan automation sederhana untuk mengurangi pekerjaan ulang.",
      contribution: "Perancangan struktur penilaian, kebutuhan trainer, formula, automation, dan alur pelaporan.",
      outcome: "Proses evaluasi dan dokumentasi training menjadi lebih konsisten serta lebih mudah direkap."
    },
    {
      title: "Reporting & Operational Process Improvement",
      text: "Perbaikan alur reporting dengan fokus pada data yang mudah dibaca, periodisasi yang jelas, dan pengurangan pekerjaan manual.",
      tags: ["Reporting", "XLSX/PDF", "Data Structure", "Process Design"],
      intro: "Tidak semua improvement harus berupa aplikasi baru. Kadang struktur laporan yang benar sudah memangkas banyak friksi.",
      problem: "Laporan periodik membutuhkan waktu, format tidak selalu konsisten, dan informasi penting dapat tersebar di beberapa sumber.",
      approach: "Menentukan kebutuhan informasi, standardisasi struktur, periodisasi, dan mekanisme export yang lebih konsisten.",
      contribution: "Merancang format, struktur data, logika rekap, dan kebutuhan output untuk pengguna berbeda.",
      outcome: "Pelaporan lebih mudah dibaca, lebih konsisten, dan lebih dekat dengan kebutuhan pengambilan keputusan."
    }
  ];

  let projectIndex = 0;
  const projectNumber = document.getElementById("projectNumber");
  const projectTitle = document.getElementById("projectTitle");
  const projectText = document.getElementById("projectText");
  const projectTags = document.getElementById("projectTags");
  const projectPrev = document.getElementById("projectPrev");
  const projectNext = document.getElementById("projectNext");
  const projectCopy = document.querySelector(".project-copy");
  const projectVisual = document.getElementById("projectVisual");

  const projectModal = document.getElementById("projectModal");
  const projectDetailBtn = document.getElementById("projectDetailBtn");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalIntro = document.getElementById("modalIntro");
  const modalProblem = document.getElementById("modalProblem");
  const modalApproach = document.getElementById("modalApproach");
  const modalContribution = document.getElementById("modalContribution");
  const modalOutcome = document.getElementById("modalOutcome");

  function renderProject(index, direction = 1) {
    projectIndex = (index + projects.length) % projects.length;
    projectCopy.classList.add("switching");
    projectVisual.classList.add("switching");

    setTimeout(() => {
      const p = projects[projectIndex];
      projectNumber.textContent = `${String(projectIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
      projectTitle.textContent = p.title;
      projectText.textContent = p.text;
      projectTags.innerHTML = p.tags.map((tag) => `<span>${tag}</span>`).join("");
      projectCopy.classList.remove("switching");
      projectVisual.classList.remove("switching");
    }, 180);
  }

  projectPrev.addEventListener("click", () => renderProject(projectIndex - 1, -1));
  projectNext.addEventListener("click", () => renderProject(projectIndex + 1, 1));

  projectDetailBtn.addEventListener("click", () => {
    const p = projects[projectIndex];
    modalTitle.textContent = p.title;
    modalIntro.textContent = p.intro;
    modalProblem.textContent = p.problem;
    modalApproach.textContent = p.approach;
    modalContribution.textContent = p.contribution;
    modalOutcome.textContent = p.outcome;

    if (typeof projectModal.showModal === "function") {
      projectModal.showModal();
    } else {
      projectModal.setAttribute("open", "");
    }
  });

  modalClose.addEventListener("click", () => projectModal.close());
  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) projectModal.close();
  });

  // Subtle portrait movement on fine pointers only
  const portrait = document.querySelector(".portrait-wrap");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (portrait && canHover && !reduceMotion) {
    portrait.addEventListener("pointermove", (event) => {
      const rect = portrait.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      portrait.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${y * -3}deg)`;
    });
    portrait.addEventListener("pointerleave", () => {
      portrait.style.transform = "";
    });
  }
})();
