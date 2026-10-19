/**
 * RAM PATHARE — PORTFOLIO INTERACTION ENGINE
 * Built with pure ES6+ JavaScript, zero runtime dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. STATE MANAGEMENT & DOM ELEMENTS
  // =========================================================================
  const state = {
    theme: localStorage.getItem('rp-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
    activeModal: null,
  };

  // DOM Elements Cache
  const htmlRoot = document.documentElement;
  const siteHeader = document.getElementById('site-header');
  const typingTextEl = document.getElementById('typing-text');
  const themeBtn = document.getElementById('theme-btn');
  const themeMoonIcon = document.getElementById('theme-moon-icon');
  const themeSunIcon = document.getElementById('theme-sun-icon');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobilePaletteBtn = document.getElementById('mobile-palette-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const fabTopBtn = document.getElementById('fab-top-btn');
  const fabCmdBtn = document.getElementById('fab-cmd-btn');
  const cmdPaletteBtn = document.getElementById('cmd-palette-btn');
  const commandPalette = document.getElementById('command-palette');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  const toastContainer = document.getElementById('toast-container');
  const mumbaiLiveTime = document.getElementById('mumbai-live-time');
  const currentYearEl = document.getElementById('current-year');

  // =========================================================================
  // 2. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(message, type = 'info', duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.setAttribute('role', 'status');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span aria-hidden="true">${icon}</span>
        <span>${message}</span>
      </div>
      <button class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    };

    const timer = setTimeout(removeToast, duration);

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      clearTimeout(timer);
      removeToast();
    });
  }

  // =========================================================================
  // 3. THEME SWITCHING (Dark / Light / High-Contrast)
  // =========================================================================
  function applyTheme(theme) {
    state.theme = theme;
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('rp-theme', theme);

    if (theme === 'dark' || theme === 'contrast') {
      if (themeMoonIcon) themeMoonIcon.style.display = 'block';
      if (themeSunIcon) themeSunIcon.style.display = 'none';
    } else {
      if (themeMoonIcon) themeMoonIcon.style.display = 'none';
      if (themeSunIcon) themeSunIcon.style.display = 'block';
    }
  }

  themeBtn?.addEventListener('click', () => {
    let nextTheme = 'dark';
    if (state.theme === 'dark') nextTheme = 'light';
    else if (state.theme === 'light') nextTheme = 'contrast';
    else nextTheme = 'dark';

    applyTheme(nextTheme);
    showToast(`Switched theme to ${nextTheme.toUpperCase()}`, 'info', 2000);
  });

  applyTheme(state.theme);

  // =========================================================================
  // 4. TYPING ANIMATION (Hero Title)
  // =========================================================================
  const phrases = [
    'Computer Engineering @ VJTI Mumbai',
    'Minor in Cyber Security',
    'Full-Stack Web Architect (MERN / FastAPI)',
    'Competitive Programmer (450+ DSA Solved)',
    'Smart India Hackathon 2026 Developer',
    'Open-Source Contributor & Builder'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function typeEffect() {
    if (!typingTextEl) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 350; // Pause before next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // =========================================================================
  // 5. SCROLL PROGRESS & SCROLLSPY
  // =========================================================================
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (siteHeader) {
      if (scrollTop > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Scrollspy section detection
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollTop >= top && scrollTop < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const targetNav = link.getAttribute('data-nav');
        const isActive = targetNav === currentSectionId;
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // =========================================================================
  // 6. MOBILE NAVIGATION DRAWER
  // =========================================================================
  function openMobileDrawer() {
    mobileNavDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    mobileNavDrawer?.setAttribute('aria-hidden', 'false');
    drawerBackdrop?.setAttribute('aria-hidden', 'false');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileNavDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    mobileNavDrawer?.setAttribute('aria-hidden', 'true');
    drawerBackdrop?.setAttribute('aria-hidden', 'true');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', openMobileDrawer);
  closeDrawerBtn?.addEventListener('click', closeMobileDrawer);
  drawerBackdrop?.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  mobilePaletteBtn?.addEventListener('click', () => {
    closeMobileDrawer();
    openCommandPalette();
  });

  // =========================================================================
  // 7. SKILLS FILTERING
  // =========================================================================
  const skillTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-skill-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 8. PROJECT FILTERING & FUZZY SEARCH
  // =========================================================================
  const projectSearchInput = document.getElementById('project-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const projectFilterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const projectCountIndicator = document.getElementById('project-count-indicator');

  let activeProjectFilter = 'all';
  let searchQuery = '';

  function filterProjects() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.project-description')?.textContent || '').toLowerCase();
      const fullText = `${tags} ${title} ${desc}`;

      const matchesCategory =
        activeProjectFilter === 'all' ||
        tags.includes(activeProjectFilter);

      const matchesSearch =
        searchQuery.trim() === '' ||
        fullText.includes(searchQuery.toLowerCase().trim());

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (projectCountIndicator) {
      if (visibleCount === projectCards.length) {
        projectCountIndicator.textContent = `Showing all ${visibleCount} featured engineering projects`;
      } else if (visibleCount === 0) {
        projectCountIndicator.textContent = `No projects matched "${searchQuery}". Click reset or try "React" or "MongoDB".`;
      } else {
        projectCountIndicator.textContent = `Showing ${visibleCount} of ${projectCards.length} projects matching your filter`;
      }
    }
  }

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeProjectFilter = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  projectSearchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    }
    filterProjects();
  });

  clearSearchBtn?.addEventListener('click', () => {
    if (projectSearchInput) {
      projectSearchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      filterProjects();
      projectSearchInput.focus();
    }
  });

  // =========================================================================
  // 9. ACCESSIBLE MODALS
  // =========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    state.activeModal = modal;

    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.activeModal = null;
  }

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => closeModal(backdrop));

    const actionCloseBtn = backdrop.querySelector('.modal-close-btn-action');
    actionCloseBtn?.addEventListener('click', () => closeModal(backdrop));
  });

  document.querySelectorAll('.view-project-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  // Certificate Modal Details
  document.querySelectorAll('.cert-card').forEach(card => {
    const viewBtn = card.querySelector('.cert-view-btn');
    const openCert = () => {
      const name = card.getAttribute('data-cert-name') || 'Course Certificate';
      const issuer = card.getAttribute('data-cert-issuer') || 'Coursera';
      const skills = card.getAttribute('data-cert-skills') || 'Technical Competency';

      const certTitleEl = document.getElementById('modal-cert-title');
      const certIssuerEl = document.getElementById('modal-cert-issuer');
      const certBodyEl = document.getElementById('modal-cert-body');

      if (certTitleEl) certTitleEl.textContent = name;
      if (certIssuerEl) certIssuerEl.textContent = issuer;
      if (certBodyEl) {
        certBodyEl.innerHTML = `
          <div style="text-align:center;padding:1.5rem 0;">
            <div style="font-size:3rem;margin-bottom:0.5rem;">🎓</div>
            <h3 style="font-size:1.3rem;margin-bottom:0.3rem;">${name}</h3>
            <p style="color:var(--accent-cyan);font-weight:600;">Authorized by ${issuer}</p>
          </div>
          <div class="modal-section">
            <h3>Credential Verification & Skills Acquired</h3>
            <p><strong>Covered Domains:</strong> ${skills}</p>
            <p>This verification confirms thorough assessment, hands-on lab completions, and theoretical mastery of industry standards.</p>
          </div>
        `;
      }
      openModal('modal-cert-viewer');
    };

    viewBtn?.addEventListener('click', openCert);
  });

  // =========================================================================
  // 10. SPOTLIGHT COMMAND PALETTE (Ctrl+K / Cmd+K)
  // =========================================================================
  const commands = [
    { label: 'Jump to About Section', category: 'Navigation', action: () => scrollToSection('about') },
    { label: 'Jump to Technical Skills', category: 'Navigation', action: () => scrollToSection('skills') },
    { label: 'Jump to Featured Projects', category: 'Navigation', action: () => scrollToSection('projects') },
    { label: 'Jump to Education & Coursework', category: 'Navigation', action: () => scrollToSection('education') },
    { label: 'Jump to Leadership & Experience', category: 'Navigation', action: () => scrollToSection('experience') },
    { label: 'Jump to Achievements & Awards', category: 'Navigation', action: () => scrollToSection('achievements') },
    { label: 'Jump to Contact Ram', category: 'Navigation', action: () => scrollToSection('contact') },
    { label: 'Jump to Developer Terminal', category: 'Navigation', action: () => scrollToSection('terminal-section') },
    { label: 'CleanSnap (Civic Tech Platform)', category: 'Project', action: () => openModal('modal-cleansnap') },
    { label: 'CareerCompass (AI EdTech Platform)', category: 'Project', action: () => openModal('modal-careercompass') },
    { label: 'FloatChat (Smart India Hackathon 2026)', category: 'Project', action: () => openModal('modal-floatchat') },
    { label: 'Switch Theme (Dark / Light / High-Contrast)', category: 'Action', action: () => themeBtn?.click() },
    { label: 'Copy Email to Clipboard', category: 'Action', action: () => copyToClipboard('rampathare718@gmail.com', 'Email copied!') },
    { label: 'Copy Phone Number to Clipboard', category: 'Action', action: () => copyToClipboard('9403963838', 'Phone copied!') },
    { label: 'Print / Save Clean Resume', category: 'Action', action: () => window.print() }
  ];

  let selectedCmdIndex = 0;

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function renderCommands(query = '') {
    if (!cmdResults) return;
    cmdResults.innerHTML = '';

    const filtered = commands.filter(cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      cmdResults.innerHTML = '<div style="padding:1rem;color:var(--text-muted);text-align:center;">No matching actions found</div>';
      return;
    }

    selectedCmdIndex = Math.min(selectedCmdIndex, filtered.length - 1);

    filtered.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = `cmd-item ${idx === selectedCmdIndex ? 'selected' : ''}`;
      item.innerHTML = `
        <span>${cmd.label}</span>
        <span class="cmd-badge">${cmd.category}</span>
      `;
      item.addEventListener('click', () => {
        closeCommandPalette();
        cmd.action();
      });
      cmdResults.appendChild(item);
    });
  }

  function openCommandPalette() {
    if (!commandPalette) return;
    commandPalette.classList.add('active');
    commandPalette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    selectedCmdIndex = 0;
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    renderCommands('');
  }

  function closeCommandPalette() {
    if (!commandPalette) return;
    commandPalette.classList.remove('active');
    commandPalette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cmdPaletteBtn?.addEventListener('click', openCommandPalette);
  fabCmdBtn?.addEventListener('click', openCommandPalette);

  cmdInput?.addEventListener('input', (e) => {
    selectedCmdIndex = 0;
    renderCommands(e.target.value);
  });

  cmdInput?.addEventListener('keydown', (e) => {
    const items = cmdResults.querySelectorAll('.cmd-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedCmdIndex = (selectedCmdIndex + 1) % items.length;
      renderCommands(cmdInput.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedCmdIndex = (selectedCmdIndex - 1 + items.length) % items.length;
      renderCommands(cmdInput.value);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentFiltered = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(cmdInput.value.toLowerCase()) ||
        cmd.category.toLowerCase().includes(cmdInput.value.toLowerCase())
      );
      if (currentFiltered[selectedCmdIndex]) {
        closeCommandPalette();
        currentFiltered[selectedCmdIndex].action();
      }
    } else if (e.key === 'Escape') {
      closeCommandPalette();
    }
  });

  commandPalette?.addEventListener('click', (e) => {
    if (e.target === commandPalette) {
      closeCommandPalette();
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (commandPalette?.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape') {
      if (commandPalette?.classList.contains('active')) {
        closeCommandPalette();
      } else if (state.activeModal) {
        closeModal(state.activeModal);
      } else if (mobileNavDrawer?.classList.contains('open')) {
        closeMobileDrawer();
      }
    }
  });

  // =========================================================================
  // 11. 1-CLICK CLIPBOARD COPY
  // =========================================================================
  function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, 'success', 2500);
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg, 'success', 2500);
    } catch (err) {
      showToast('Could not copy automatically', 'error', 2500);
    }
    textArea.remove();
  }

  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = el.getAttribute('data-copy');
      if (val) {
        copyToClipboard(val, `Copied "${val}" to clipboard!`);
      }
    });
  });

  // =========================================================================
  // 12. INTERACTIVE DEVELOPER TERMINAL (CLI)
  // =========================================================================
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const clearTermBtn = document.getElementById('clear-term-btn');

  function appendTerminalLine(text, isCommand = false) {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = 'term-line';
    if (isCommand) {
      line.innerHTML = `<span class="term-prompt">ram@vjti:~$</span> <span class="term-cmd-text">${text}</span>`;
    } else {
      line.innerHTML = text;
    }
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function executeTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    appendTerminalLine(cmdRaw, true);

    switch (cmd) {
      case 'help':
        appendTerminalLine(`
          <strong>Available Commands:</strong><br>
          • <span class="term-highlight">skills</span>       : List categorized technical skills & proficiencies<br>
          • <span class="term-highlight">projects</span>     : CleanSnap, CareerCompass, FloatChat (SIH 2026)<br>
          • <span class="term-highlight">education</span>    : VJTI Mumbai (B.Tech CPI 7.1) & Dattakala (95.96%ile)<br>
          • <span class="term-highlight">leadership</span>   : Mentee Team Leader (Inheritance) & Agastya Volunteer<br>
          • <span class="term-highlight">achievements</span> : 7+ Hackathons (4x lead), 450+ DSA, 3rd in CodeHunt<br>
          • <span class="term-highlight">contact</span>      : Direct phone, email, and social coordinates<br>
          • <span class="term-highlight">theme</span>        : Toggle Dark / Light / High-Contrast mode<br>
          • <span class="term-highlight">clear</span>        : Clear terminal output screen<br>
          • <span class="term-highlight">bio</span>          : Executive summary & career interests
        `);
        break;

      case 'skills':
        appendTerminalLine(`
          <strong>Languages:</strong> C++ (Proficient), JavaScript ES6+ (Intermediate), Python (Basic), HTML/CSS<br>
          <strong>Frameworks:</strong> React.js, Express.js, Tailwind CSS, Bootstrap, Redux Toolkit, JWT<br>
          <strong>Databases:</strong> MongoDB, MySQL, PostgreSQL, MongoDB Compass<br>
          <strong>Tools:</strong> VS Code, Git/GitHub, Postman API (Certified)
        `);
        break;

      case 'projects':
        appendTerminalLine(`
          1. <strong>CleanSnap</strong> [Jan 2026 - Mar 2026]<br>
             Full-stack civic issue reporting platform via image uploads with real-time status routing.<br>
             Stack: React, Node.js, Express.js, MongoDB, REST API.<br><br>
          2. <strong>CareerCompass</strong> [May 2026 - Present]<br>
             AI personalized student learning roadmap platform with OpenAI API query integration.<br>
             Stack: React, OpenAI API, Node.js, Express.js, MongoDB.<br><br>
          3. <strong>FloatChat</strong> [Smart India Hackathon 2026]<br>
             Oceanographic telemetry ARGO data platform with Leaflet map, Plotly.js charts, and FAISS RAG.<br>
             Stack: React, Vite, Tailwind CSS, FastAPI, PostgreSQL/PostGIS, FAISS, OpenAI API.
        `);
        break;

      case 'education':
        appendTerminalLine(`
          🏛️ <strong>Veermata Jijabai Technological Institute (VJTI), Mumbai</strong> [Aug 2024 - Present]<br>
             B.Tech in Computer Engineering | Minor in Cyber Security | CPI: 7.1<br><br>
          🎓 <strong>Dattakala Junior College Of Science</strong> [Jun 2022 - Jun 2024]<br>
             HSC Board: 80.33% | JEE Mains: 95.96%ile
        `);
        break;

      case 'leadership':
        appendTerminalLine(`
          🌱 <strong>Agastya International Foundation</strong> [Sep 2025 - Feb 2026]<br>
             Volunteer: Hands-on science and STEM workshops for underprivileged school students.<br><br>
          👥 <strong>Inheritance (VJTI)</strong> [Jan 2026 - Apr 2026]<br>
             Mentee - Team Leader: Led engineering team of 4 to build a complete MERN stack project and learned AI/ML basics.
        `);
        break;

      case 'achievements':
        appendTerminalLine(`
          🏆 <strong>7+ Hackathons</strong>: Led team 4 times (3x runner-up finishes).<br>
          ⚡ <strong>450+ DSA Problems</strong>: Solved across LeetCode, Codeforces, and CodeChef.<br>
          🥉 <strong>3rd Rank in CodeHunt</strong>: Out of 30 teams at VJTI's competitive coding speed event.<br>
          📜 <strong>Certificates</strong>: Postman API Testing, MongoDB, React Complete Course, Node.js (Coursera).
        `);
        break;

      case 'contact':
        appendTerminalLine(`
          ✉️ Email: <a href="mailto:rampathare718@gmail.com" style="color:var(--accent-cyan)">rampathare718@gmail.com</a><br>
          📞 Phone: <a href="tel:+919403963838" style="color:var(--accent-cyan)">+91 9403963838</a><br>
          🔗 LinkedIn: <a href="https://linkedin.com/in/ram-pathare" target="_blank" style="color:var(--accent-cyan)">linkedin.com/in/ram-pathare</a><br>
          💻 GitHub: <a href="https://github.com/rampathare0718" target="_blank" style="color:var(--accent-cyan)">github.com/rampathare0718</a>
        `);
        break;

      case 'theme':
        themeBtn?.click();
        appendTerminalLine(`Theme switched to: <strong>${state.theme}</strong>`);
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'bio':
        appendTerminalLine(`
          Ram Pathare is an engineering scholar at VJTI Mumbai combining deep systems rigor (C++, algorithms, cyber security) 
          with modern full-stack web architectures and generative AI integrations.
        `);
        break;

      case 'sudo':
        appendTerminalLine(`Permission denied: You are already logged in as superuser @ VJTI.`);
        break;

      case '':
        break;

      default:
        appendTerminalLine(`command not found: <code>${cmdRaw}</code>. Type <span class="term-highlight">help</span> for a list of available commands.`);
        break;
    }
  }

  terminalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!terminalInput) return;
    const cmd = terminalInput.value;
    if (cmd.trim()) {
      executeTerminalCommand(cmd);
      terminalInput.value = '';
    }
  });

  clearTermBtn?.addEventListener('click', () => {
    if (terminalOutput) terminalOutput.innerHTML = '';
  });

  document.querySelectorAll('.term-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        if (terminalInput) terminalInput.value = cmd;
        executeTerminalCommand(cmd);
        if (terminalInput) terminalInput.value = '';
      }
    });
  });

  // =========================================================================
  // 13. CONTACT FORM VALIDATION
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactSubject = document.getElementById('contact-subject');
  const contactMessage = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');
  const submitBtn = document.getElementById('submit-contact-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  contactMessage?.addEventListener('input', () => {
    const len = contactMessage.value.length;
    if (charCounter) charCounter.textContent = `${len} / 500`;
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearFormErrors() {
    [nameError, emailError, subjectError, messageError].forEach(el => {
      if (el) el.textContent = '';
    });
    [contactName, contactEmail, contactSubject, contactMessage].forEach(el => {
      el?.classList.remove('input-error');
    });
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    let hasError = false;

    if (!contactName.value.trim() || contactName.value.trim().length < 2) {
      nameError.textContent = 'Please enter your name (minimum 2 characters).';
      contactName.classList.add('input-error');
      hasError = true;
    }

    if (!contactEmail.value.trim() || !validateEmail(contactEmail.value.trim())) {
      emailError.textContent = 'Please provide a valid email address (e.g. name@domain.com).';
      contactEmail.classList.add('input-error');
      hasError = true;
    }

    if (!contactSubject.value.trim() || contactSubject.value.trim().length < 3) {
      subjectError.textContent = 'Please provide a concise subject topic.';
      contactSubject.classList.add('input-error');
      hasError = true;
    }

    if (!contactMessage.value.trim() || contactMessage.value.trim().length < 10) {
      messageError.textContent = 'Please enter your message (at least 10 characters).';
      contactMessage.classList.add('input-error');
      hasError = true;
    }

    if (hasError) {
      showToast('Please address the highlighted form fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtnText.textContent = 'Transmitting Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Transmit Message';
      showToast(`Thank you, ${contactName.value.trim()}! Your message has been sent.`, 'success', 4000);
      contactForm.reset();
      if (charCounter) charCounter.textContent = '0 / 500';
    }, 1200);
  });

  // =========================================================================
  // 14. LIVE MUMBAI TIME (IST) & MISC
  // =========================================================================
  function updateMumbaiTime() {
    if (!mumbaiLiveTime) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      mumbaiLiveTime.textContent = new Intl.DateTimeFormat('en-IN', options).format(now);
    } catch (e) {
      mumbaiLiveTime.textContent = new Date().toLocaleTimeString();
    }
  }

  updateMumbaiTime();
  setInterval(updateMumbaiTime, 1000);

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Print Resume Handler
  printResumeBtn?.addEventListener('click', () => {
    showToast('Formatting and opening print preview...', 'info', 2000);
    setTimeout(() => window.print(), 300);
  });

  // Back to Top FAB
  fabTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 15. DYNAMIC INTERACTIVE CYBER PARTICLE CANVAS
  // =========================================================================
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width = heroCanvas.width = 400;
    let height = heroCanvas.height = 400;

    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'];
    const particles = [];
    const particleCount = 48;

    const mouse = {
      x: null,
      y: null,
      radius: 95
    };

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          radius: Math.random() * 2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect lines between neighboring particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const lineAlpha = (1 - dist / 80) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and render each node
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive mouse connection & subtle magnetic pull
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const beamAlpha = (1 - mdist / mouse.radius) * 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${beamAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Subtle attraction force
            p.x += (mdx / mdist) * 0.45;
            p.y += (mdy / mdist) * 0.45;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animateParticles);
    }

    heroCanvas.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroCanvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    initParticles();
    animateParticles();
  }
});
