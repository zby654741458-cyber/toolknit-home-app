      import { getCurrentWindow } from '@tauri-apps/api/window';
      import { createIcons, icons } from 'lucide';
      import { initDarkVeil } from './darkveil.js';
      import { initLightRays } from './lightrays.js';
      import { getLang, setLang, applyTranslations, onLangChange, t } from './i18n.js';
      import changelog from './data/changelog.json';
      import { HELP_CONTENT, getHelpContent } from './help-data.js';
      import { getLegalContent } from './legal-data.js';

      // Disable context menu globally, but allow on tool items for favorites
      document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.audio-list-item')) return;
        e.preventDefault();
      });
      document.addEventListener('copy', (e) => e.preventDefault());
      document.addEventListener('cut', (e) => e.preventDefault());

      createIcons({ icons });
      applyTranslations();
      renderChangelog();
      const darkveilBg = document.getElementById('darkveilBg');
      if (darkveilBg) {
        // Randomly choose between the original dark color and a blue variant on each entry
        const darkveilVariant = Math.random() < 0.5 ? 'original' : 'blue';
        initDarkVeil(darkveilBg, {
          hueShift: darkveilVariant === 'blue' ? 220 : 0,
          noiseIntensity: 0.03,
          scanlineIntensity: 0,
          speed: 1.6,
          scanlineFrequency: 5,
          warpAmount: 0,
          resolutionScale: 1
        });
      }

      const isTauri = typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__;
      const appWindow = isTauri ? getCurrentWindow() : null;

      async function getOutputDir(subFolder) {
        if (!isTauri) return '~/Downloads/ToolKnit/' + subFolder;
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const config = await invoke('get_install_config');
          if (config.install_path) {
            const sep = config.install_path.includes('\\') ? '\\' : '/';
            return config.install_path.replace(/[\/\\]+$/, '') + sep + subFolder;
          }
        } catch (e) { console.error('Failed to get install config:', e); }
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const docsDir = await invoke('get_documents_dir').catch(() => 'C:\\Users\\Downloads');
          return docsDir + '\\ToolKnit\\' + subFolder;
        } catch (e) {
          return 'C:\\Users\\Downloads\\ToolKnit\\' + subFolder;
        }
      }
      const transitionMask = document.getElementById('transitionMask');
      const navItems = document.querySelectorAll('.nav-item');
      const contentSections = document.querySelectorAll('.content-section');
      let isSwitching = false;

      // Tool card mouse spotlight effect and accessibility
      document.querySelectorAll('.tool-card').forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        const toolName = card.querySelector('.tool-name');
        if (toolName) {
          card.setAttribute('aria-label', toolName.textContent || t('common.tool'));
        }
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mouse-x', `${x}%`);
          card.style.setProperty('--mouse-y', `${y}%`);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });

      // Audio list items accessibility + mouse spotlight
      document.querySelectorAll('.audio-list-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          item.style.setProperty('--mouse-x', `${x}%`);
          item.style.setProperty('--mouse-y', `${y}%`);
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });
      });


      let navigatedFromHome = false;

      function switchCategory(category) {
        if (isSwitching) return;
        isSwitching = true;

        navItems.forEach(item => item.classList.remove('active'));
        const targetNav = document.querySelector(`.nav-item[data-category="${category}"]`);
        if (targetNav) targetNav.classList.add('active');

        if (transitionMask) transitionMask.classList.add('visible');

        setTimeout(() => {
          contentSections.forEach(section => section.classList.remove('active'));
          const targetSection = document.querySelector(`.content-section[data-category="${category}"]`);
          if (targetSection) targetSection.classList.add('active');

          if (transitionMask) transitionMask.classList.remove('visible');
          isSwitching = false;
        }, 1000);
      }

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          const category = item.dataset.category;
          if (category && !item.classList.contains('active')) {
            navigatedFromHome = false;
            switchCategory(category);
          }
        });
      });

      if (isTauri && appWindow) {
        document.querySelectorAll('.ctrl-btn[data-action]').forEach(btn => {
          btn.addEventListener('mousedown', (e) => e.stopPropagation());
          btn.addEventListener('click', async () => {
            const action = btn.dataset.action;
            try {
              if (action === 'minimize') {
                await appWindow.minimize();
              } else if (action === 'maximize') {
                const isFullscreen = await appWindow.isFullscreen();
                await appWindow.setFullscreen(!isFullscreen);
              } else if (action === 'close') {
                await appWindow.close();
              }
            } catch (e) {
              console.error('Window control failed:', e);
            }
          });
        });
      }

      const settingsOverlay = document.getElementById('settingsOverlay');
      const settingsBtn = document.getElementById('settingsBtn');
      const settingsBack = document.getElementById('settingsBack');

      // Language selection in settings
      const langOptionBtns = document.querySelectorAll('.settings-row.lang-options .lang-option');
      function syncLangButtons() {
        const current = getLang();
        langOptionBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.lang === current);
        });
      }
      langOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (transitionMask) transitionMask.classList.add('visible');
          setTimeout(() => {
            setLang(btn.dataset.lang);
            setTimeout(() => {
              if (transitionMask) transitionMask.classList.remove('visible');
            }, 300);
          }, 300);
        });
      });
      onLangChange(syncLangButtons);
      syncLangButtons();

      // Re-apply translations when language changes externally
      onLangChange(() => {
        applyTranslations();
      });

      // Refresh help content on language change
      onLangChange(() => {
        helpSearchCache = null;
        const activeItem = helpNav && helpNav.querySelector('.help-nav-item.active');
        if (activeItem && activeItem.dataset.helpSection) {
          showHelpSection(activeItem.dataset.helpSection);
        }
      });



      // Storage path display + open folder
      const storagePathDisplay = document.getElementById('storagePathDisplay');
      const openStorageFolder = document.getElementById('openStorageFolder');
      if (storagePathDisplay) {
        if (isTauri) {
          import('@tauri-apps/api/core').then(({ invoke }) => {
            invoke('get_install_config').then((config) => {
              storagePathDisplay.textContent = config.install_path || '--';
            }).catch(() => {
              storagePathDisplay.textContent = '--';
            });
          });
        }
      }
      if (openStorageFolder) {
        openStorageFolder.addEventListener('click', async () => {
          if (!isTauri) return;
          try {
            const { invoke } = await import('@tauri-apps/api/core');
            const config = await invoke('get_install_config');
            if (config.install_path) {
              await invoke('open_path', { path: config.install_path });
            }
          } catch (e) {
            console.error('Open folder failed:', e);
          }
        });
      }

      const helpBtn = document.getElementById('helpBtn');
      if (settingsBtn && settingsOverlay) {
        settingsBtn.addEventListener('click', () => settingsOverlay.classList.add('visible'));
      }
      if (helpBtn) {
        helpBtn.addEventListener('click', () => {
          const overlay = document.getElementById('helpOverlay');
          if (overlay) {
            overlay.classList.add('visible');
            showHelpSection('overview');
          }
        });
      }

      if (settingsBack && settingsOverlay) {
        settingsBack.addEventListener('click', () => {
          settingsOverlay.classList.remove('visible');
        });
      }

      const helpLink = document.getElementById('helpLink');
      const feedbackLink = document.getElementById('feedbackLink');
      const declarationLink = document.getElementById('declarationLink');
      const usagePolicyLink = document.getElementById('usagePolicyLink');

      if (helpLink) {
        helpLink.addEventListener('click', (e) => {
          e.preventDefault();
          openHelpOverlay();
        });
      }

      const helpOverlay = document.getElementById('helpOverlay');
      const helpBackBtn = document.getElementById('helpBackBtn');
      const helpNav = document.getElementById('helpNav');
      const helpContentBody = document.getElementById('helpContentBody');
      const helpContentTitle = document.getElementById('helpContentTitle');
      const helpSearchInput = document.getElementById('helpSearchInput');

      function openHelpOverlay() {
        if (!helpOverlay) return;
        helpOverlay.classList.add('visible');
        showHelpSection('overview');
      }

      function closeHelpOverlay() {
        if (!helpOverlay) return;
        helpOverlay.classList.remove('visible');
        if (helpSearchInput) helpSearchInput.value = '';
        if (helpNav) {
          helpNav.querySelectorAll('.help-nav-item').forEach(item => {
            item.style.display = '';
          });
          helpNav.querySelectorAll('.help-nav-group').forEach(g => g.style.display = '');
        }
      }

      if (helpBackBtn) {
        helpBackBtn.addEventListener('click', closeHelpOverlay);
      }

      let helpSearchCache = null;
      function buildHelpSearchCache() {
        const content = getHelpContent();
        if (helpSearchCache || !content) return;
        helpSearchCache = {};
        for (const key in content) {
          const entry = content[key];
          helpSearchCache[key] = (entry.title + ' ' + entry.html).toLowerCase();
        }
      }

      function showHelpSection(sectionId) {
        const content = getHelpContent();
        if (!content || !content[sectionId]) return;
        const data = content[sectionId];
        if (helpContentTitle) helpContentTitle.textContent = data.title;
        if (helpContentBody) {
          helpContentBody.innerHTML = data.html;
          helpContentBody.scrollTop = 0;
        }
        if (helpSearchInput) helpSearchInput.value = '';
        if (helpNav) {
          helpNav.querySelectorAll('.help-nav-item').forEach(item => {
            item.style.display = '';
            item.classList.toggle('active', item.dataset.helpSection === sectionId);
          });
          helpNav.querySelectorAll('.help-nav-group').forEach(g => g.style.display = '');
        }
      }

      if (helpNav) {
        helpNav.addEventListener('click', (e) => {
          const item = e.target.closest('.help-nav-item');
          if (!item) return;
          const section = item.dataset.helpSection;
          if (section) showHelpSection(section);
        });
      }

      if (helpSearchInput) {
        helpSearchInput.addEventListener('input', () => {
          const query = helpSearchInput.value.trim().toLowerCase();
          if (!helpNav) return;
          if (!query) {
            helpNav.querySelectorAll('.help-nav-item').forEach(item => item.style.display = '');
            helpNav.querySelectorAll('.help-nav-group').forEach(g => g.style.display = '');
            const activeItem = helpNav.querySelector('.help-nav-item.active');
            if (activeItem && activeItem.dataset.helpSection) {
              const section = activeItem.dataset.helpSection;
              const content = getHelpContent();
              if (content[section]) {
                helpContentTitle.textContent = content[section].title;
                helpContentBody.innerHTML = content[section].html;
              }
            }
            return;
          }
          buildHelpSearchCache();
          let anyVisible = false;
          helpNav.querySelectorAll('.help-nav-group').forEach(group => {
            let groupHasVisible = false;
            group.querySelectorAll('.help-nav-item').forEach(item => {
              const text = (item.textContent || '').toLowerCase();
              const section = item.dataset.helpSection || '';
              const cached = (helpSearchCache && helpSearchCache[section]) || '';
              const match = text.includes(query) || cached.includes(query);
              item.style.display = match ? '' : 'none';
              if (match) groupHasVisible = true;
            });
            group.style.display = groupHasVisible ? '' : 'none';
            if (groupHasVisible) anyVisible = true;
          });
          if (helpContentBody) {
            if (!anyVisible) {
              helpContentBody.innerHTML = `<div class="help-search-empty">${escapeHtml(t('help.searchEmpty'))}</div>`;
            }
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpOverlay && helpOverlay.classList.contains('visible')) {
          closeHelpOverlay();
        }
      });

      const feedbackOverlay = document.getElementById('feedbackOverlay');
      const feedbackBack = document.getElementById('feedbackBack');
      const feedbackBtn = document.getElementById('feedbackBtn');
      const lightraysBg = document.getElementById('lightraysBg');
      let lightraysInstance = null;

      function openFeedbackOverlay() {
        if (!feedbackOverlay) return;
        feedbackOverlay.classList.add('visible');
        if (lightraysBg && !lightraysInstance) {
          lightraysInstance = initLightRays(lightraysBg, {
            raysOrigin: 'top-center',
            raysColor: '#ffffff',
            raysSpeed: 0.6,
            lightSpread: 0.6,
            rayLength: 3,
            followMouse: true,
            mouseInfluence: 0.1,
            noiseAmount: 0,
            distortion: 0,
            pulsating: false,
            fadeDistance: 1,
            saturation: 1
          });
        }
      }

      function closeFeedbackOverlay() {
        if (!feedbackOverlay) return;
        feedbackOverlay.classList.remove('visible');
        closeFeedbackDrawer();
        if (lightraysInstance) {
          lightraysInstance.destroy();
          lightraysInstance = null;
        }
      }

      if (feedbackLink && feedbackOverlay) {
        feedbackLink.addEventListener('click', (e) => {
          e.preventDefault();
          openFeedbackOverlay();
        });
      }

      if (feedbackBtn && feedbackOverlay) {
        feedbackBtn.addEventListener('click', () => {
          openFeedbackOverlay();
        });
      }

      if (feedbackBack && feedbackOverlay) {
        feedbackBack.addEventListener('click', () => {
          closeFeedbackOverlay();
        });
      }

      // Feedback drawer
      const feedbackDrawer = document.getElementById('feedbackDrawer');
      const feedbackDrawerBackdrop = document.getElementById('feedbackDrawerBackdrop');
      const feedbackDrawerClose = document.getElementById('feedbackDrawerClose');
      const feedbackCta = document.getElementById('feedbackCta');
      const feedbackForm = document.getElementById('feedbackForm');
      const feedbackFormCancel = document.getElementById('feedbackFormCancel');
      const feedbackFormSubmit = document.getElementById('feedbackFormSubmit');
      const feedbackName = document.getElementById('feedbackName');
      const feedbackEmail = document.getElementById('feedbackEmail');
      const feedbackTitle = document.getElementById('feedbackTitle');
      const feedbackContent = document.getElementById('feedbackContent');

      function openFeedbackDrawer() {
        if (feedbackDrawer) feedbackDrawer.classList.add('open');
      }

      function closeFeedbackDrawer() {
        if (feedbackDrawer) feedbackDrawer.classList.remove('open');
      }

      function resetFeedbackForm() {
        if (feedbackForm) feedbackForm.reset();
      }

      if (feedbackCta) {
        feedbackCta.addEventListener('click', () => {
          openFeedbackDrawer();
        });
      }

      if (feedbackDrawerClose) {
        feedbackDrawerClose.addEventListener('click', () => {
          closeFeedbackDrawer();
        });
      }

      if (feedbackDrawerBackdrop) {
        feedbackDrawerBackdrop.addEventListener('click', () => {
          closeFeedbackDrawer();
        });
      }

      if (feedbackFormCancel) {
        feedbackFormCancel.addEventListener('click', () => {
          closeFeedbackDrawer();
          resetFeedbackForm();
        });
      }

      if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          if (!feedbackForm.checkValidity()) return;

          const payload = {
            title: feedbackTitle ? feedbackTitle.value.trim() : '',
            content: feedbackContent ? feedbackContent.value.trim() : ''
          };
          const nameVal = feedbackName ? feedbackName.value.trim() : '';
          const emailVal = feedbackEmail ? feedbackEmail.value.trim() : '';
          if (nameVal) payload.name = nameVal;
          if (emailVal) payload.email = emailVal;

          if (feedbackFormSubmit) feedbackFormSubmit.disabled = true;

          try {
            const msg = getLang() === 'zh' ? '此功能在开源版中已移除' : 'This feature has been removed in the open-source version.';
            window.showToast(msg);
          } finally {
            if (feedbackFormSubmit) feedbackFormSubmit.disabled = false;
          }
        });
      }

      // Random marquee reviews
      const marqueeTrack = document.getElementById('marqueeTrack');
      if (marqueeTrack) {
        function getReviewers() {
          return [
            { name: 'Sarah', text: t('home.feedbackPage.review1') },
            { name: 'Michael', text: t('home.feedbackPage.review2') },
            { name: 'Emily', text: t('home.feedbackPage.review3') },
            { name: 'David', text: t('home.feedbackPage.review4') },
            { name: 'Jessica', text: t('home.feedbackPage.review5') },
            { name: 'James', text: t('home.feedbackPage.review6') },
            { name: 'Olivia', text: t('home.feedbackPage.review7') },
            { name: 'Christopher', text: t('home.feedbackPage.review8') },
            { name: 'Amanda', text: t('home.feedbackPage.review9') },
            { name: 'Matthew', text: t('home.feedbackPage.review10') },
            { name: 'Elizabeth', text: t('home.feedbackPage.review11') },
            { name: 'Daniel', text: t('home.feedbackPage.review12') }
          ];
        }

        function renderReviews() {
          const stars = Array.from({ length: 5 }, () => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('');
          const reviewers = getReviewers();

          const cards = reviewers.map((r, i) => {
            const initial = r.name.charAt(0).toUpperCase();
            const palettes = [
              ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
              ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#30cfd0', '#330867'],
              ['#a8edea', '#fed6e3'], ['#ff9a9e', '#fecfef'], ['#ffecd2', '#fcb69f'],
              ['#a18cd1', '#fbc2eb'], ['#fbc2eb', '#a6c1ee'], ['#84fab0', '#8fd3f4']
            ];
            const [c1, c2] = palettes[i % palettes.length];
            const avatarSvg = `<div class="marquee-avatar" style="background:linear-gradient(135deg,${c1},${c2});display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0;">${escapeHtml(initial)}</div>`;
            return `
              <div class="marquee-card">
                <div class="marquee-card-header">
                  ${avatarSvg}
                  <div class="marquee-info">
                    <div class="marquee-name">${escapeHtml(r.name)}</div>
                    <div class="marquee-stars">${stars}</div>
                  </div>
                </div>
                <p class="marquee-text">${escapeHtml(r.text)}</p>
              </div>
            `;
          }).join('');

          // Duplicate for seamless loop
          marqueeTrack.innerHTML = cards + cards;
        }

        renderReviews();
        onLangChange(renderReviews);
      }

      // ===== Legal Overlay (Declaration & Usage Policy) =====
      const legalOverlay = document.getElementById('legalOverlay');
      const legalBackBtn = document.getElementById('legalBackBtn');
      const legalNav = document.getElementById('legalNav');
      const legalContentTitle = document.getElementById('legalContentTitle');
      const legalContentBody = document.getElementById('legalContentBody');

      function showLegalSection(sectionId) {
        const content = getLegalContent();
        if (!content || !content[sectionId]) return;
        const data = content[sectionId];
        if (legalContentTitle) legalContentTitle.textContent = data.title;
        if (legalContentBody) {
          legalContentBody.innerHTML = data.html;
          legalContentBody.scrollTop = 0;
        }
        if (legalNav) {
          legalNav.querySelectorAll('.help-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.legalSection === sectionId);
          });
        }
      }

      function openLegalOverlay(sectionId) {
        if (legalOverlay) legalOverlay.classList.add('visible');
        showLegalSection(sectionId || 'declaration');
      }

      function closeLegalOverlay() {
        if (legalOverlay) legalOverlay.classList.remove('visible');
      }

      if (legalBackBtn) {
        legalBackBtn.addEventListener('click', closeLegalOverlay);
      }

      if (legalNav) {
        legalNav.querySelectorAll('.help-nav-item').forEach(item => {
          item.addEventListener('click', () => {
            const section = item.dataset.legalSection;
            if (section) showLegalSection(section);
          });
        });
      }

      if (declarationLink) {
        declarationLink.addEventListener('click', (e) => {
          e.preventDefault();
          openLegalOverlay('declaration');
        });
      }

      if (usagePolicyLink) {
        usagePolicyLink.addEventListener('click', (e) => {
          e.preventDefault();
          openLegalOverlay('usage-policy');
        });
      }

      // Refresh legal content on language change
      onLangChange(() => {
        if (legalOverlay && legalOverlay.classList.contains('visible')) {
          const activeItem = legalNav && legalNav.querySelector('.help-nav-item.active');
          showLegalSection(activeItem ? activeItem.dataset.legalSection : 'declaration');
        }
      });

      // ===== Auth Overlay =====
      const authOverlay = document.getElementById('authOverlay');
      const authCircle = document.getElementById('authCircle');
      const authClose = document.getElementById('authClose');
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      const switchToRegister = document.getElementById('switchToRegister');
      const switchToLogin = document.getElementById('switchToLogin');
      const authHeroTitle = document.getElementById('authHeroTitle');
      const authHeroSubtitle = document.getElementById('authHeroSubtitle');
      const loginError = document.getElementById('loginError');
      const registerError = document.getElementById('registerError');
      const loginSubmit = document.getElementById('loginSubmit');
      const registerSubmit = document.getElementById('registerSubmit');
      const registerNext = document.getElementById('registerNext');
      const registerBack = document.getElementById('registerBack');
      const registerStep1 = document.getElementById('registerStep1');
      const registerStep2 = document.getElementById('registerStep2');
      const registerAvatarZone = document.getElementById('registerAvatarZone');
      const registerAvatarFile = document.getElementById('registerAvatarFile');
      const registerAvatarPreview = document.getElementById('registerAvatarPreview');
      const registerError2 = document.getElementById('registerError2');
      const registerSpider2 = document.getElementById('registerSpider2');
      let registerAvatarData = null;

      const authLoadingOverlay = document.getElementById('authLoadingOverlay');
      const authLoadingCircle = document.getElementById('authLoadingCircle');

      function showAuthLoading(originX, originY) {
        const dx = Math.max(originX, window.innerWidth - originX);
        const dy = Math.max(originY, window.innerHeight - originY);
        const radius = Math.sqrt(dx * dx + dy * dy);
        const diameter = radius * 2;
        authLoadingCircle.style.width = diameter + 'px';
        authLoadingCircle.style.height = diameter + 'px';
        authLoadingCircle.style.left = (originX - radius) + 'px';
        authLoadingCircle.style.top = (originY - radius) + 'px';
        authLoadingOverlay.classList.remove('closing');
        authLoadingOverlay.classList.remove('active');
        // Force reflow with inline scale(0), then clear it so CSS class can take over
        authLoadingCircle.style.transform = 'scale(0)';
        void authLoadingCircle.offsetWidth;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            authLoadingCircle.style.transform = '';
            authLoadingOverlay.classList.add('active');
          });
        });
      }

      function hideAuthLoading() {
        authLoadingOverlay.classList.remove('active');
        authLoadingOverlay.classList.add('closing');
        setTimeout(() => {
          authLoadingOverlay.classList.remove('closing');
        }, 600);
      }

      const SERVER_ERROR_MAP = {
        'Email already registered': 'auth.errEmailExists',
        'Invalid email or password': 'auth.errInvalidCredentials',
        'Account banned': 'auth.errAccountBanned',
        'Server error': 'auth.errServer',
        'Not found': 'auth.errNotFound',
        'Daily usage limit reached': 'auth.errDailyLimit',
        'Invalid email format': 'auth.errInvalidEmail',
        'Password must be 6-64 characters': 'auth.errPasswordMax',
        'Username must be 1-64 characters': 'auth.errUsernameRequired',
        'No fields to update': 'auth.errUnknown',
        'Old password incorrect': 'auth.errInvalidCredentials',
        'Password changed successfully': null,
      };

      function translateServerError(msg) {
        if (!msg) return t('auth.errUnknown');
        const key = SERVER_ERROR_MAP[msg];
        if (key === null) return msg;
        if (key) return t(key);
        return msg;
      }

      function authHeaders(extra = {}) {
        const token = localStorage.getItem('toolknit_token');
        const headers = { 'Content-Type': 'application/json', ...extra };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
      }

      function updatePersonalPanel(user) {
        if (!user) return;
        const panel = document.getElementById('personalPanel');
        if (!panel) return;
        panel.classList.add('logged-in');
        const nameEl = panel.querySelector('.logged-in-view .info-name');
        const metaEls = panel.querySelectorAll('.logged-in-view .info-meta');
        const avatarImg = panel.querySelector('.logged-in-view .avatar img');
        if (nameEl) nameEl.textContent = user.username || user.email || 'User';
        if (metaEls[0]) metaEls[0].textContent = user.email || '';
        if (metaEls[1]) metaEls[1].textContent = `ID: ${user.id || ''}`;
        if (avatarImg) {
          const avatarParent = avatarImg.parentElement;
          if (user.avatar) {
            avatarImg.onerror = function() {
              this.style.display = 'none';
              if (avatarParent) avatarParent.classList.add('avatar-fallback');
            };
            avatarImg.onload = function() {
              this.style.display = '';
              if (avatarParent) avatarParent.classList.remove('avatar-fallback');
            };
            avatarImg.src = user.avatar;
          } else {
            avatarImg.style.display = 'none';
            if (avatarParent) avatarParent.classList.add('avatar-fallback');
          }
        }
      }

      function hideAutoLoginMask() {
        const mask = document.getElementById('autoLoginMask');
        if (!mask) return;
        mask.classList.remove('active');
        mask.classList.add('fade-out');
        setTimeout(() => {
          mask.classList.remove('fade-out');
        }, 400);
      }

      async function restoreSession() {
        const token = localStorage.getItem('toolknit_token');
        if (!token) return;

        const mask = document.getElementById('autoLoginMask');
        if (mask) mask.classList.add('active');

        let maskHidden = false;
        function hideMaskOnce() {
          if (maskHidden) return;
          maskHidden = true;
          hideAutoLoginMask();
        }

        const timeoutId = setTimeout(hideMaskOnce, 8000);

        // Open-source version: silent disable, no session restore (no backend)
        clearTimeout(timeoutId);
        hideMaskOnce();
      }

      function logout() {
        localStorage.removeItem('toolknit_token');
        localStorage.removeItem('toolknit_user');
        const panel = document.getElementById('personalPanel');
        if (panel) panel.classList.remove('logged-in');
        if (typeof renderFavorites === 'function') renderFavorites();
      }

      function openAuthOverlay(originX, originY) {
        // Calculate max radius to cover the entire screen from the click point
        const dx = Math.max(originX, window.innerWidth - originX);
        const dy = Math.max(originY, window.innerHeight - originY);
        const radius = Math.sqrt(dx * dx + dy * dy);

        // Set circle size and position (but NOT transform — that's controlled by CSS class)
        const diameter = radius * 2;
        authCircle.style.width = diameter + 'px';
        authCircle.style.height = diameter + 'px';
        authCircle.style.left = (originX - radius) + 'px';
        authCircle.style.top = (originY - radius) + 'px';

        // Remove inline transform so CSS class can take over
        authCircle.style.transform = '';
        authOverlay.classList.remove('closing');
        authOverlay.classList.remove('active');
        authOverlay.classList.add('initial-open');

        // Force reflow then add active to trigger transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            authOverlay.classList.add('active');
          });
        });

        // Remove initial-open after animations complete
        setTimeout(() => {
          authOverlay.classList.remove('initial-open');
        }, 2500);

        // Show spider on login button after form elements finish entering
        showSpiderAfterDelay(loginSpider, 1500);
      }

      function closeAuthOverlay() {
        authOverlay.classList.remove('active');
        // Hide spiders
        hideSpider(loginSpider);
        hideSpider(registerSpider);
        authOverlay.classList.add('closing');
        setTimeout(() => {
          authOverlay.classList.remove('closing');
          // Reset forms
          // Reset to login form without animation
          registerForm.classList.remove('visible', 'exiting');
          loginForm.classList.remove('exiting');
          loginForm.classList.add('visible');
          loginSpider.classList.remove('show', 'exit');
          registerSpider.classList.remove('show', 'exit');
          if (registerSpider2) registerSpider2.classList.remove('show', 'exit');
          const heroEl = document.querySelector('.auth-hero');
          heroEl.classList.remove('hero-exit', 'hero-enter');
          loginError.classList.remove('show');
          registerError.classList.remove('show');
          if (registerError2) registerError2.classList.remove('show');
          loginError.textContent = '';
          registerError.textContent = '';
          if (registerError2) registerError2.textContent = '';
          authHeroTitle.textContent = t('auth.loginTitle');
          authHeroSubtitle.textContent = t('auth.loginSubtitle');
          // Reset register steps
          if (registerStep1) registerStep1.style.display = '';
          if (registerStep2) registerStep2.style.display = 'none';
          registerAvatarData = null;
          if (registerAvatarPreview) registerAvatarPreview.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:48px;height:48px;color:#bbb;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
          if (registerAvatarFile) registerAvatarFile.value = '';
        }, 800);
      }

      // Spider show/hide on submit buttons
      const loginSpider = document.getElementById('loginSpider');
      const registerSpider = document.getElementById('registerSpider');

      function showSpider(spiderEl) {
        spiderEl.classList.remove('exit');
        spiderEl.classList.add('show');
      }

      function hideSpider(spiderEl) {
        spiderEl.classList.remove('show');
        spiderEl.classList.add('exit');
      }

      // Show spider after form elements finish animating in
      // Initial open: after ~2.5s (hero 0.8s + form 1.5s + buffer)
      // Form switch: after ~1.2s (exit 0.7s + enter 0.55s + buffer)
      function showSpiderAfterDelay(spiderEl, delay) {
        setTimeout(() => {
          showSpider(spiderEl);
        }, delay);
      }

      let isAuthSwitching = false;

      function switchForm(fromEl, toEl, titleText, subtitleText, fromSpider, toSpider) {
        if (isAuthSwitching) return;
        isAuthSwitching = true;

        // Step 1: spider runs out (1.2s) + hero exits + form elements stagger out — all simultaneously
        hideSpider(fromSpider);

        const heroEl = document.querySelector('.auth-hero');
        heroEl.classList.add('hero-exit');

        fromEl.classList.remove('visible');
        fromEl.classList.add('exiting');

        // Step 2: after spider finishes running out (1.2s), swap to new form
        setTimeout(() => {
          fromEl.classList.remove('exiting');
          fromSpider.classList.remove('exit');

          // Update hero text
          authHeroTitle.textContent = titleText;
          authHeroSubtitle.textContent = subtitleText;

          // Hero enters from below
          heroEl.classList.remove('hero-exit');
          heroEl.classList.add('hero-enter');

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              heroEl.classList.remove('hero-enter');
            });
          });

          // New form elements stagger in
          toEl.classList.add('visible');

          // Show spider on new button after elements finish entering (~1.1s)
          showSpiderAfterDelay(toSpider, 1100);

          // Unlock after spider finishes running in (1.1s delay + 1.2s run = 2.3s)
          setTimeout(() => {
            isAuthSwitching = false;
          }, 2300);
        }, 1200);
      }

      function showLoginForm() {
        switchForm(
          registerForm,
          loginForm,
          t('auth.loginTitle'),
          t('auth.loginSubtitle'),
          registerSpider,
          loginSpider
        );
        loginError.classList.remove('show');
      }

      function showRegisterForm() {
        switchForm(
          loginForm,
          registerForm,
          t('auth.registerTitle'),
          t('auth.registerSubtitle'),
          loginSpider,
          registerSpider
        );
        registerError.classList.remove('show');
        if (registerError2) registerError2.classList.remove('show');
        // Reset to step 1
        if (registerStep1) registerStep1.style.display = '';
        if (registerStep2) registerStep2.style.display = 'none';
        registerAvatarData = null;
        if (registerSubmit) registerSubmit.classList.add('disabled-avatar');
        if (registerAvatarPreview) registerAvatarPreview.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:48px;height:48px;color:#bbb;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
      }

      function showAuthError(el, msg) {
        el.textContent = msg;
        el.classList.add('show');
      }

      // Login button in personal panel → disabled in open-source version
      const personalPanel = document.getElementById('personalPanel');
      const loginBtn = personalPanel ? personalPanel.querySelector('.login-btn') : null;
      if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const msg = getLang() === 'zh' ? '登录功能在开源版中已移除' : 'Login has been removed in the open-source version.';
          showToast(msg);
        });
      }
      // Logout button → show confirm dialog
      const btnLogout = document.getElementById('btnLogout');
      const logoutConfirmOverlay = document.getElementById('logoutConfirmOverlay');
      const logoutCancelBtn = document.getElementById('logoutCancelBtn');
      const logoutConfirmBtn = document.getElementById('logoutConfirmBtn');

      function showLogoutConfirm() {
        if (logoutConfirmOverlay) logoutConfirmOverlay.classList.add('visible');
      }
      function hideLogoutConfirm() {
        if (logoutConfirmOverlay) logoutConfirmOverlay.classList.remove('visible');
      }

      if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
          e.stopPropagation();
          const msg = getLang() === 'zh' ? '登录功能在开源版中已移除' : 'Login has been removed in the open-source version.';
          showToast(msg);
        });
      }
      if (logoutCancelBtn) {
        logoutCancelBtn.addEventListener('click', () => hideLogoutConfirm());
      }
      if (logoutConfirmBtn) {
        logoutConfirmBtn.addEventListener('click', () => {
          hideLogoutConfirm();
          logout();
        });
      }
      if (logoutConfirmOverlay) {
        logoutConfirmOverlay.addEventListener('click', (e) => {
          if (e.target === logoutConfirmOverlay) hideLogoutConfirm();
        });
      }

      // Restore session on startup
      restoreSession();

      // Close button
      authClose.addEventListener('click', closeAuthOverlay);

      // Switch between login and register
      switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
      });
      switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
      });

      // Enter key to submit
      document.getElementById('loginPassword').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loginSubmit.click();
      });
      document.getElementById('registerPassword').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') registerNext.click();
      });

      // Login submit
      loginSubmit.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        if (!email || !password) {
          showAuthError(loginError, t('auth.errFillEmailPassword'));
          return;
        }
        loginSubmit.disabled = true;
        const btnRect = loginSubmit.getBoundingClientRect();
        showAuthLoading(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);
        try {
          const msg = getLang() === 'zh' ? '此功能在开源版中已移除' : 'This feature has been removed in the open-source version.';
          showAuthError(loginError, msg);
        } finally {
          hideAuthLoading();
          loginSubmit.disabled = false;
          loginSubmit.textContent = t('auth.loginBtn');
        }
      });

      // Register step 1: Next button
      registerNext.addEventListener('click', () => {
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        if (!username || !email || !password) {
          showAuthError(registerError, t('auth.errFillAll'));
          return;
        }
        if (password.length < 6) {
          showAuthError(registerError, t('auth.errPasswordShort'));
          return;
        }
        registerError.classList.remove('show');
        registerStep1.style.display = 'none';
        registerStep2.style.display = '';
        registerSubmit.classList.add('disabled-avatar');
      });

      // Register back to step 1
      if (registerBack) {
        registerBack.addEventListener('click', (e) => {
          e.preventDefault();
          registerStep2.style.display = 'none';
          registerStep1.style.display = '';
          if (registerError2) registerError2.classList.remove('show');
        });
      }

      // Avatar file selection
      if (registerAvatarZone) {
        registerAvatarZone.addEventListener('click', () => {
          registerAvatarFile.click();
        });
      }
      if (registerAvatarFile) {
        registerAvatarFile.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          if (file.size > 2 * 1024 * 1024) {
            showAuthError(registerError2, t('auth.errAvatarTooLarge'));
            registerAvatarFile.value = '';
            return;
          }
          registerAvatarData = file;
          registerSubmit.classList.remove('disabled-avatar');
          const reader = new FileReader();
          reader.onload = (ev) => {
            registerAvatarPreview.innerHTML = `<img src="${ev.target.result}" alt="avatar-preview">`;
          };
          reader.readAsDataURL(file);
          if (registerError2) registerError2.classList.remove('show');
        });
      }

      // Register step 2: Submit
      registerSubmit.addEventListener('click', async () => {
        if (!registerAvatarData) {
          window.showToast(t('auth.errAvatarRequired'));
          return;
        }
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        if (!username || !email || !password) {
          if (registerError2) showAuthError(registerError2, t('auth.errFillAll'));
          return;
        }
        if (password.length < 6) {
          if (registerError2) showAuthError(registerError2, t('auth.errPasswordShort'));
          return;
        }
        registerSubmit.disabled = true;
        const btnRect = registerSubmit.getBoundingClientRect();
        showAuthLoading(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2);
        try {
          const msg = getLang() === 'zh' ? '此功能在开源版中已移除' : 'This feature has been removed in the open-source version.';
          showAuthError(registerError2, msg);
        } finally {
          hideAuthLoading();
          registerSubmit.disabled = false;
          registerSubmit.textContent = t('auth.registerBtn');
        }
      });

      // Changelog: render current version and timeline
      function renderChangelog() {
        const lang = getLang();
        const data = changelog[lang] || changelog.zh;
        const versions = data.versions;

        const sidebarVersion = document.getElementById('sidebarVersion');
        if (sidebarVersion) sidebarVersion.textContent = data.currentVersion;

        const currentVersion = document.getElementById('currentVersion');
        const currentDate = document.getElementById('currentDate');
        const currentTitle = document.getElementById('currentTitle');
        const currentList = document.getElementById('currentList');
        const timeline = document.getElementById('changelogTimeline');
        if (!currentVersion || !currentDate || !currentTitle || !currentList || !timeline) return;

        const selectedIndex = timeline.dataset.selectedIndex ? parseInt(timeline.dataset.selectedIndex) : 0;
        const selected = versions[selectedIndex] || versions[0];

        currentVersion.textContent = selected.version;
        currentDate.textContent = selected.date;
        currentTitle.textContent = selected.title;
        currentList.innerHTML = selected.content.map(item => `<li>${escapeHtml(item)}</li>`).join('');

        timeline.innerHTML = versions.map((v, index) => `
          <div class="timeline-item ${index === selectedIndex ? 'active' : ''}" data-index="${index}">
            <div class="timeline-dot"></div>
            <div class="timeline-info">
              <div class="timeline-version">${escapeHtml(v.version)}</div>
              <div class="timeline-date">${escapeHtml(v.date)}</div>
            </div>
          </div>
        `).join('');

        timeline.querySelectorAll('.timeline-item').forEach(item => {
          item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            if (idx === selectedIndex) return;
            timeline.dataset.selectedIndex = idx;

            const currentPanel = document.querySelector('.changelog-current');
            if (currentPanel) {
              currentPanel.classList.add('refreshing');
              setTimeout(() => {
                renderChangelog();
                setTimeout(() => {
                  currentPanel.classList.remove('refreshing');
                }, 50);
              }, 200);
            } else {
              renderChangelog();
            }
          });
        });
      }

      onLangChange(renderChangelog);

      // Statistics tracking
      (function initStats() {
        const totalKey = 'toolknit_total_usage';
        const myKey = 'toolknit_my_usage';

        function getStoredInt(key, fallback = 0) {
          try {
            const val = localStorage.getItem(key);
            const parsed = parseInt(val || String(fallback), 10);
            return isNaN(parsed) ? fallback : parsed;
          } catch (e) {
            return fallback;
          }
        }

        function setStoredInt(key, value) {
          try {
            localStorage.setItem(key, String(value));
          } catch (e) {
            console.warn('Failed to persist stats:', e);
          }
        }

        let exeTotalUsage = getStoredInt(totalKey);
        let exeMyUsage = getStoredInt(myKey);
        let webTotalUsage = 0;
        let exeApiTotalUsage = 0;

        const barTotalEl = document.getElementById('barTotalUsage');
        const barMyEl = document.getElementById('barMyUsage');
        const barTotalFill = document.getElementById('barTotal');
        const barMineFill = document.getElementById('barMine');

        function animateValue(el, start, end, duration) {
          const startTime = performance.now();
          function update(now) {
            const t = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(start + (end - start) * ease).toLocaleString();
            if (t < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }

        function getTotalUsage() {
          return webTotalUsage + exeApiTotalUsage + exeTotalUsage;
        }

        function renderStats() {
          const total = getTotalUsage();
          if (barTotalEl) animateValue(barTotalEl, 0, total, 800);
          if (barMyEl) animateValue(barMyEl, 0, exeMyUsage, 800);

          const max = Math.max(total, 1);
          const totalWidth = 100;
          const mineWidth = (exeMyUsage / max) * 100;

          if (barTotalFill) barTotalFill.style.width = `${totalWidth}%`;
          requestAnimationFrame(() => {
            if (barMineFill) barMineFill.style.width = `${mineWidth}%`;
          });
        }

        function updateBars() {
          const total = getTotalUsage();
          const max = Math.max(total, 1);
          const mineWidth = (exeMyUsage / max) * 100;
          if (barMineFill) barMineFill.style.width = `${mineWidth}%`;
        }

        function refreshTotalDisplay() {
          const total = getTotalUsage();
          if (barTotalEl) animateValue(barTotalEl, parseInt(barTotalEl.textContent.replace(/,/g, '') || '0', 10), total, 500);
          updateBars();
        }

        function refreshMyUsageDisplay() {
          if (barMyEl) animateValue(barMyEl, parseInt(barMyEl.textContent.replace(/,/g, '') || '0', 10), exeMyUsage, 500);
          updateBars();
        }

        // Fetch web-side total usage from PHP API
        async function fetchWebTotalUsage() {
          // Open-source version: silent disable, no remote usage fetch
        }

        // Fetch exe-side global total from API
        async function fetchExeApiTotalUsage() {
          // Open-source version: silent disable, no remote usage fetch
        }

        // Report tool usage: local +1 + public API increment
        window.incrementToolUsage = async function() {
          exeTotalUsage += 1;
          setStoredInt(totalKey, exeTotalUsage);
          exeMyUsage += 1;
          setStoredInt(myKey, exeMyUsage);

          // Open-source version: silent disable, no remote usage increment

          refreshTotalDisplay();
          refreshMyUsageDisplay();
        };

        // Toast notification function
        window.showToast = function(message, duration = 2000) {
          const container = document.getElementById('toastContainer');
          if (!container) return;

          const toast = document.createElement('div');
          toast.className = 'toast';
          toast.textContent = message;
          container.appendChild(toast);

          setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
              if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
              }
            });
          }, duration);
        };

        // Initial render with local data, then fetch remote
        renderStats();
        fetchWebTotalUsage();
        fetchExeApiTotalUsage();
      })();

      // About-us links
      const ABOUT_LINKS = {
        donate: 'https://toolknit.com/donate.html',
        github: 'https://github.com/2645149786-dotcom',
        website: 'https://toolknit.com'
      };

      async function openExternalUrl(url) {
        if (!url || !/^https?:\/\//i.test(url)) {
          console.warn('Invalid external URL:', url);
          return;
        }
        if (isTauri) {
          try {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('open_url', { url });
          } catch (err) {
            console.error('Failed to open URL:', err);
            window.open(url, '_blank');
          }
        } else {
          window.open(url, '_blank');
        }
      }

      document.querySelectorAll('.about-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = ABOUT_LINKS[link.dataset.link];
          if (url) openExternalUrl(url);
        });
      });

      // Donate tooltip hover
      const donateLink = document.querySelector('.about-link.donate-link');
      const donateTooltip = document.getElementById('donateTooltip');
      if (donateLink && donateTooltip) {
        function positionTooltip() {
          const rect = donateLink.getBoundingClientRect();
          const tooltipWidth = donateTooltip.offsetWidth;
          const tooltipHeight = donateTooltip.offsetHeight;
          let left = rect.left + rect.width / 2 - tooltipWidth / 2;
          let top = rect.top - tooltipHeight - 12;

          // Keep within viewport horizontally
          const padding = 12;
          if (left < padding) left = padding;
          if (left + tooltipWidth > window.innerWidth - padding) {
            left = window.innerWidth - tooltipWidth - padding;
          }

          // Keep within viewport vertically
          const flipped = top < padding;
          if (flipped) {
            top = rect.bottom + 12;
          }
          donateTooltip.classList.toggle('flipped', flipped);

          donateTooltip.style.left = `${left}px`;
          donateTooltip.style.top = `${top}px`;
        }

        donateLink.addEventListener('mouseenter', () => {
          positionTooltip();
          donateTooltip.classList.add('visible');
        });
        donateLink.addEventListener('mouseleave', () => {
          donateTooltip.classList.remove('visible');
        });

        window.addEventListener('resize', () => {
          if (donateTooltip.classList.contains('visible')) {
            positionTooltip();
          }
        });
      }

      // ===== Favorites System =====
      const FAV_KEY = 'toolknit_favorites';
      const toastEl = document.getElementById('favToast');
      const toastText = document.getElementById('favToastText');
      let toastTimer = null;

      function isLoggedIn() {
        return !!localStorage.getItem('toolknit_token');
      }

      function showToast(msg) {
        if (!toastEl || !toastText) return;
        toastText.textContent = msg;
        toastEl.classList.add('visible');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toastEl.classList.remove('visible');
        }, 2000);
      }

      function getFavorites() {
        try {
          return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
        } catch { return []; }
      }

      function saveFavorites(favs) {
        localStorage.setItem(FAV_KEY, JSON.stringify(favs));
      }

      function isFavorited(toolId) {
        return getFavorites().some(f => f.tool === toolId);
      }

      function addFavorite(toolId, name, iconHtml, category) {
        if (isFavorited(toolId)) return;
        const favs = getFavorites();
        favs.push({ tool: toolId, name, iconHtml, category, ts: Date.now() });
        saveFavorites(favs);
        renderFavorites();
      }

      function removeFavorite(toolId) {
        const favs = getFavorites().filter(f => f.tool !== toolId);
        saveFavorites(favs);
        renderFavorites();
      }

      function getToolInfo(item) {
        const toolId = item.dataset.tool || '';
        const titleEl = item.querySelector('.audio-list-title');
        const name = titleEl ? titleEl.textContent : (item.dataset.tool || 'Tool');
        const iconEl = item.querySelector('.audio-list-icon');
        let iconHtml = '';
        if (iconEl) {
          iconHtml = iconEl.innerHTML;
        }
        const section = item.closest('.content-section');
        const category = section ? section.dataset.category : '';
        return { toolId, name, iconHtml, category };
      }

      // Right-click on audio-list-item → direct toggle favorite
      // Also track recent usage on click
      const RECENT_KEY = 'toolknit_recent_tools';
      const MAX_RECENT = 3;

      // Global: when a tool overlay's back button is clicked, return to home if navigated from home
      document.addEventListener('click', (e) => {
        if (e.target.closest('.settings-back') && navigatedFromHome) {
          navigatedFromHome = false;
          setTimeout(() => switchCategory('home'), 100);
        }
      }, true);

      function getRecent() {
        try {
          return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        } catch { return []; }
      }

      function saveRecent(list) {
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
      }

      function addRecent(toolId, name, iconHtml, category) {
        let list = getRecent().filter(r => r.tool !== toolId);
        list.unshift({ tool: toolId, name, iconHtml, category, ts: Date.now() });
        list = list.slice(0, MAX_RECENT);
        saveRecent(list);
      }

      document.querySelectorAll('.audio-list-item').forEach(item => {
        item.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const info = getToolInfo(item);
          if (isFavorited(info.toolId)) {
            removeFavorite(info.toolId);
            showToast(t('home.favRemoved'));
          } else {
            addFavorite(info.toolId, info.name, info.iconHtml, info.category);
            showToast(t('home.favAdded'));
          }
        });
        item.addEventListener('click', () => {
          const info = getToolInfo(item);
          if (info.toolId) {
            addRecent(info.toolId, info.name, info.iconHtml, info.category);
            renderRecent();
          }
        });
      });

      // Render favorites card on home
      function renderFavorites() {
        const container = document.getElementById('favoritesContent');
        if (!container) return;

        const favs = getFavorites();
        if (favs.length === 0) {
          container.innerHTML = `
            <div class="fav-empty-guide">
              <div class="fav-empty-icon"><i data-lucide="mouse-pointer-click"></i></div>
              <div class="fav-empty-text">${escapeHtml(t('home.favEmptyGuide'))}</div>
            </div>
          `;
          if (typeof createIcons === 'function') createIcons({ icons });
          return;
        }

        container.innerHTML = favs.map(f => `
          <div class="fav-item" data-tool="${f.tool}" data-category="${f.category || ''}">
            <div class="fav-icon">${f.iconHtml || ''}</div>
            <div class="fav-name">${f.name}</div>
            <div class="fav-remove" data-tool="${f.tool}">
              <i data-lucide="x"></i>
            </div>
          </div>
        `).join('');

        if (typeof createIcons === 'function') createIcons({ icons });

        container.querySelectorAll('.fav-item').forEach(el => {
          el.addEventListener('click', (e) => {
            if (e.target.closest('.fav-remove')) return;
            const toolId = el.dataset.tool;
            const category = el.dataset.category;
            if (category) {
              navigatedFromHome = true;
              switchCategory(category);
              setTimeout(() => {
                const toolItem = document.querySelector(`.audio-list-item[data-tool="${toolId}"]`);
                if (toolItem) toolItem.click();
              }, 1100);
            }
          });
        });

        container.querySelectorAll('.fav-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(btn.dataset.tool);
          });
        });
      }

      // ===== Recommended Tools (random 3) =====
      function renderRecommended() {
        const container = document.getElementById('recommendedContent');
        if (!container) return;
        const allItems = Array.from(document.querySelectorAll('.content-section:not([data-category="home"]) .audio-list-item'));
        if (allItems.length === 0) return;

        // Pick 3 random items
        const shuffled = allItems.sort(() => Math.random() - 0.5);
        const picks = shuffled.slice(0, 3);

        container.innerHTML = picks.map(item => {
          const info = getToolInfo(item);
          return `
            <div class="rec-item" data-tool="${info.toolId}" data-category="${info.category || ''}">
              <div class="rec-icon">${info.iconHtml || ''}</div>
              <div class="rec-name">${info.name}</div>
            </div>
          `;
        }).join('');

        if (typeof createIcons === 'function') createIcons({ icons });

        container.querySelectorAll('.rec-item').forEach(el => {
          el.addEventListener('click', () => {
            const toolId = el.dataset.tool;
            const category = el.dataset.category;
            if (category) {
              navigatedFromHome = true;
              switchCategory(category);
              setTimeout(() => {
                const toolItem = document.querySelector(`.audio-list-item[data-tool="${toolId}"]`);
                if (toolItem) toolItem.click();
              }, 1100);
            }
          });
        });
      }

      // ===== Recently Used =====
      function renderRecent() {
        const container = document.getElementById('recentlyContent');
        if (!container) return;
        const recent = getRecent();
        if (recent.length === 0) {
          container.innerHTML = `<div class="placeholder-box" data-i18n="home.empty">${escapeHtml(t('home.empty'))}</div>`;
          return;
        }
        container.innerHTML = recent.map(r => `
          <div class="rec-item" data-tool="${escapeHtml(r.tool)}" data-category="${escapeHtml(r.category || '')}">
            <div class="rec-icon">${r.iconHtml || ''}</div>
            <div class="rec-name">${escapeHtml(r.name)}</div>
          </div>
        `).join('');
        if (typeof createIcons === 'function') createIcons({ icons });
        container.querySelectorAll('.rec-item').forEach(el => {
          el.addEventListener('click', () => {
            const toolId = el.dataset.tool;
            const category = el.dataset.category;
            if (category) {
              navigatedFromHome = true;
              switchCategory(category);
              setTimeout(() => {
                const toolItem = document.querySelector(`.audio-list-item[data-tool="${toolId}"]`);
                if (toolItem) toolItem.click();
              }, 1100);
            }
          });
        });
      }

      // Initial render
      renderFavorites();
      renderRecommended();
      renderRecent();

      // Re-render on language change
      onLangChange(() => {
        renderFavorites();
        renderRecent();
      });