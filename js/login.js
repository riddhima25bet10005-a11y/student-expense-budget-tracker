window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.login = {
  render: (container) => {
    const html = `
      <div class="login-wrapper animate-fade" style="display:flex; justify-content:center; align-items:center; min-height:80vh; width:100%">
        <div class="card" style="width: 100%; max-width: 420px; padding: 40px;">
          <div style="text-align:center; margin-bottom: 32px">
            <img src="assets/logo.png" alt="SEBT Logo" style="margin: 0 auto 24px auto; width: 96px; height: 96px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); display: block; object-fit: contain;">
            <h1 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px">Welcome Back</h1>
            <p style="color: var(--text-secondary); font-size: 0.9rem">Sign in to manage your budget and expenses.</p>
          </div>
          
          <form id="loginForm" onsubmit="event.preventDefault(); SEBT.views.login.doLogin()">
            <div class="form-group" style="margin-bottom: 20px">
              <label class="form-label">Username</label>
              <input type="text" class="form-input" id="username" placeholder="Enter any username" required>
            </div>
            <div class="form-group" style="margin-bottom: 24px">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="password" placeholder="Enter any password" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem; justify-content:center">Sign In</button>
          </form>
          
          <div style="text-align:center; margin-top: 24px; font-size: 0.85rem; color: var(--text-muted)">
            
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;
  },
  
  doLogin: () => {
    const user = document.getElementById('username').value;
    if (user) {
      SEBT.data.isAuthenticated = true;
      SEBT.data.user.name = user;
      SEBT.data.saveData();
      
      // Update sidebar UI with the logged in user
      const userEl = document.querySelector('.user-name');
      if(userEl) userEl.innerHTML = `Hey, ${user}! &#128075;`;
      
      window.location.hash = 'dashboard';
    }
  },
  
  destroy: () => {}
};

