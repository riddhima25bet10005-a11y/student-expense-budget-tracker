window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};
SEBT.app = {
  currentView: null,
  navigate: (viewName) => {
    // Auth Guard
    if (viewName !== 'login' && !SEBT.data.isAuthenticated) {
      window.location.hash = 'login';
      return;
    }
    // Update layout mode
    if (viewName === 'login') {
      document.body.classList.add('auth-mode');
    } else {
      document.body.classList.remove('auth-mode');
    }

    if (SEBT.app.currentView === viewName) return;
    if (SEBT.app.currentView && SEBT.views[SEBT.app.currentView] && SEBT.views[SEBT.app.currentView].destroy) {
      SEBT.views[SEBT.app.currentView].destroy();
    }
    SEBT.charts.destroyAll();
    SEBT.app.currentView = viewName;
    
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });
    
    const container = document.getElementById('main-content');
    container.style.opacity = '0';
    setTimeout(() => {
      if (SEBT.views[viewName]) {
        SEBT.views[viewName].render(container);
      } else {
        container.innerHTML = `<div class="page-header"><h1 class="page-title">${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1><div class="empty-state"><i class="bi bi-tools empty-icon"></i><h3>Coming soon!</h3></div></div>`;
      }
      container.style.transition = 'opacity 0.2s';
      container.style.opacity = '1';
      window.location.hash = viewName;
      window.scrollTo(0,0);
    }, 150);
  },
  openModal: (htmlContent) => {
    const content = document.getElementById('modal-content');
    content.innerHTML = htmlContent;
    document.getElementById('modal-overlay').classList.add('active');
  },
  closeModal: () => {
    document.getElementById('modal-overlay').classList.remove('active');
    setTimeout(() => { document.getElementById('modal-content').innerHTML = ''; }, 300);
  },
  logout: () => {
    SEBT.data.isAuthenticated = false;
    SEBT.data.saveData();
    window.location.hash = 'login';
  },
  init: () => {
    // Set user name
    const userEl = document.querySelector('.user-name');
    if(userEl && SEBT.data && SEBT.data.user && SEBT.data.user.name) {
      userEl.innerHTML = `Hey, ${SEBT.data.user.name}! &#128075;`;
    }

    // Apply theme
    if(SEBT.data && SEBT.data.user && SEBT.data.user.theme === 'light') {
      document.body.classList.add('light-mode');
    }
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    SEBT.app.navigate(hash);
    window.addEventListener('hashchange', () => SEBT.app.navigate(window.location.hash.replace('#', '')));
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') SEBT.app.closeModal();
    });
    const sidebar = document.getElementById('sidebar');
    document.getElementById('mobile-toggle').addEventListener('click', () => sidebar.classList.toggle('open'));
    document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => sidebar.classList.remove('open')));
  }
};
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', SEBT.app.init); }
else { SEBT.app.init(); }
