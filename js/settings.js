window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.settings = {
  render: (container) => {
    const u = SEBT.data.user;
    const html = `
      <div class="page-header animate-fade">
        <h1 class="page-title">Settings</h1>
        <div class="page-subtitle">Customize your experience</div>
      </div>
      <div class="dashboard-main animate-fade" style="max-width: 600px; margin: 0 auto; animation-delay: 0.1s">
        
        <div class="settings-section" style="margin-bottom:32px">
          <div class="flex justify-between items-center" style="margin-bottom:16px;">
            <div class="settings-title" style="font-weight:600; color:var(--text-primary); font-size:1.1rem">Profile & Preferences</div>
            <button class="btn btn-sm btn-outline" onclick="SEBT.views.settings.openEditModal()"><i class="bi bi-pencil"></i> Edit Profile</button>
          </div>
          <div class="card">
            <div class="flex justify-between items-center" style="padding:16px; border-bottom:1px solid var(--border-color)"><div class="text-secondary">Name</div><div class="text-primary" style="font-weight:500">${u.name}</div></div>
            <div class="flex justify-between items-center" style="padding:16px; border-bottom:1px solid var(--border-color)"><div class="text-secondary">Role</div><div class="text-primary" style="font-weight:500">${u.role}</div></div>
            <div class="flex justify-between items-center" style="padding:16px; border-bottom:1px solid var(--border-color)"><div class="text-secondary">Email</div><div class="text-primary" style="font-weight:500">${u.email}</div></div>
            <div class="flex justify-between items-center" style="padding:16px"><div class="text-secondary">Currency Display</div><div class="text-primary" style="font-weight:500">${u.currency}</div></div>
          </div>
        </div>

        <div class="settings-section" style="margin-bottom:32px">
          <div class="settings-title" style="font-weight:600; color:var(--text-primary); margin-bottom:16px; font-size:1.1rem">App Settings</div>
          <div class="card">
            <div class="flex justify-between items-center" style="padding:16px; border-bottom:1px solid var(--border-color)">
              <div class="text-secondary">Dark Mode</div>
              <div onclick="SEBT.views.settings.toggleTheme()" style="width:40px; height:20px; background:${u.theme === 'light' ? 'var(--bg-surface-light)' : 'var(--color-primary)'}; border-radius:10px; position:relative; cursor:pointer; transition: 0.3s;">
                <div style="width:16px; height:16px; background:white; border-radius:50%; position:absolute; top:2px; ${u.theme === 'light' ? 'left:2px' : 'right:2px'}; transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.3)"></div>
              </div>
            </div>
            <div class="flex justify-between items-center" style="padding:16px">
              <div class="text-secondary">Monthly Budget Alerts</div>
              <div onclick="SEBT.views.settings.toggleAlerts()" style="width:40px; height:20px; background:${u.alertsEnabled === false ? 'var(--bg-surface-light)' : 'var(--color-primary)'}; border-radius:10px; position:relative; cursor:pointer; transition: 0.3s;">
                <div style="width:16px; height:16px; background:white; border-radius:50%; position:absolute; top:2px; ${u.alertsEnabled === false ? 'left:2px' : 'right:2px'}; transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.3)"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <div class="settings-title" style="font-weight:600; color:var(--text-primary); margin-bottom:16px; font-size:1.1rem">Data & Privacy</div>
          <div class="card">
            <div class="flex justify-between items-center" style="padding:16px; border-bottom:1px solid var(--border-color)"><div class="text-secondary">Export Data</div><div><button class="btn btn-outline btn-sm" onclick="SEBT.views.settings.exportCSV()">Export CSV</button></div></div>
            <div class="flex justify-between items-center" style="padding:16px"><div class="text-danger" style="font-weight:500">Reset All Data</div><div><button class="btn btn-outline btn-sm" style="color:var(--color-danger); border-color:var(--color-danger)" onclick="SEBT.views.settings.resetData()">Reset</button></div></div>
          </div>
        </div>

      </div>
    `;
    container.innerHTML = html;
  },

  openEditModal: () => {
    const u = SEBT.data.user;
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">Edit Profile</h2>
        <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="editUserName" class="form-input" value="${u.name}">
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <input type="text" id="editUserRole" class="form-input" value="${u.role}">
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" id="editUserEmail" class="form-input" value="${u.email}" placeholder="Enter your email address">
        </div>
        <div class="form-group">
          <label class="form-label">Currency Symbol / Display</label>
          <select id="editUserCurrency" class="form-select">
            <option value="₹" ${u.currency === '₹' ? 'selected' : ''}>₹ INR (Indian Rupee)</option>
            <option value="$" ${u.currency === '$' ? 'selected' : ''}>$ USD/CAD/AUD</option>
            <option value="€" ${u.currency === '€' ? 'selected' : ''}>€ EUR (Euro)</option>
            <option value="£" ${u.currency === '£' ? 'selected' : ''}>£ GBP (British Pound)</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.settings.saveProfile()">Save Changes</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },

  saveProfile: () => {
    const name = document.getElementById('editUserName').value;
    const role = document.getElementById('editUserRole').value;
    const email = document.getElementById('editUserEmail').value;
    const currency = document.getElementById('editUserCurrency').value;

    if(!name || false) return alert('Name is required.');

    SEBT.data.updateUser({ name, role, email, currency });
    
    // Also update the sidebar header to reflect the new name/role immediately
    const sbName = document.querySelector('.user-name');
    const sbRole = document.querySelector('.user-role');
    if(sbName) sbName.innerText = name;
    if(sbRole) sbRole.innerText = role;

    SEBT.app.closeModal();
    
    // Re-render the settings page
    const container = document.querySelector('.main-content');
    if(container) SEBT.views.settings.render(container);
  },

  exportCSV: () => {
    const txns = SEBT.data.transactions;
    if (!txns || txns.length === 0) return alert('No transactions to export.');
    
    // Create CSV header
    let csvContent = "Date,Description,Category,Type,Amount\n";
    
    // Create CSV rows
    txns.forEach(t => {
      // Escape description to avoid issues with commas
      const safeDesc = `"${t.description.replace(/"/g, '""')}"`;
      const date = t.date.split('T')[0]; // Extract just the YYYY-MM-DD part
      csvContent += `${date},${safeDesc},${t.category},${t.type},${t.amount}\n`;
    });
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sebt_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  toggleTheme: () => {
    const isLight = SEBT.data.user.theme === 'light';
    SEBT.data.updateUser({ theme: isLight ? 'dark' : 'light' });
    
    if(isLight) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
    
    // Re-render settings to update toggle visually
    const container = document.querySelector('.main-content');
    if(container) SEBT.views.settings.render(container);
  },
  toggleAlerts: () => {
    const isEnabled = SEBT.data.user.alertsEnabled !== false;
    SEBT.data.updateUser({ alertsEnabled: !isEnabled });
    
    // Re-render settings to update toggle visually
    const container = document.querySelector('.main-content');
    if(container) SEBT.views.settings.render(container);
  },
  resetData: () => {
    if(confirm('Are you absolutely sure you want to reset all data? This will delete all your transactions, budgets, goals, and categories permanently!')) {
      localStorage.removeItem('sebt_data');
      location.reload();
    }
  },

  destroy: () => {}
};
