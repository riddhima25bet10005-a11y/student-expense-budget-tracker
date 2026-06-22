window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.goals = {
  filterMode: 'all',
  
  render: (container) => {
    SEBT.views.goals.container = container;
    const html = `
      <div class="page-header animate-fade">
        <h1 class="page-title">Goals</h1>
        <div class="page-subtitle">Track your savings goals</div>
      </div>
      <div class="flex justify-between items-center animate-fade" style="margin-bottom: 24px; animation-delay: 0.1s">
        <div class="filter-tabs" id="goalFilterTabs" style="margin:0">
          <div class="filter-tab active" data-filter="all">All</div>
          <div class="filter-tab" data-filter="in-progress">In Progress</div>
          <div class="filter-tab" data-filter="completed">Completed</div>
        </div>
        <button class="btn btn-primary" onclick="SEBT.views.goals.openAddGoalModal()"><i class="bi bi-plus-lg"></i> New Goal</button>
      </div>
      <div class="dashboard-grid animate-fade" id="goalsList" style="grid-template-columns: repeat(2, 1fr); animation-delay: 0.2s">
      </div>
    `;
    container.innerHTML = html;
    
    SEBT.views.goals.filterMode = 'all';
    
    const tabs = document.querySelectorAll('#goalFilterTabs .filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        SEBT.views.goals.filterMode = e.target.dataset.filter;
        SEBT.views.goals.renderList();
      });
    });

    SEBT.views.goals.renderList();
  },
  
  renderList: () => {
    const container = document.getElementById('goalsList');
    if(!container) return;
    
    const { formatCurrency, formatDateShort, goals } = SEBT.data;
    
    let filtered = goals.filter(g => {
      if(SEBT.views.goals.filterMode !== 'all' && g.status !== SEBT.views.goals.filterMode) return false;
      return true;
    });

    if(filtered.length === 0) {
      container.innerHTML = '<div style="grid-column: span 2; text-align:center; padding: 40px; color:var(--text-muted)">No goals found.</div>';
      return;
    }

    container.innerHTML = filtered.map(g => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      let color = '#6c5ce7'; 
      if(g.status === 'completed') color = '#00d68f';
      return `
      <div class="card goal-card" style="padding: 24px; display:flex; flex-direction:column;">
        <div class="goal-header" style="margin-bottom: 16px; display:flex; justify-content:space-between; align-items:flex-start; gap: 16px;">
          <div class="goal-name" style="font-size: 1.1rem; display:flex; align-items:center; gap: 12px; font-weight:600; color:var(--text-primary)"><span style="font-size: 2rem">${g.icon}</span> ${g.name}</div>
          <div style="text-align:right; border-radius: 4px; padding: 4px; background: rgba(255, 255, 255, 0.03); flex-shrink: 0;">
            <div style="font-size:0.7rem; color:var(--text-secondary); margin-bottom:2px; text-transform:uppercase; letter-spacing:0.5px;">Target</div>
            <div style="font-size:1.1rem; font-weight:700; color:var(--color-primary-light)">${formatCurrency(g.target)}</div>
          </div>
        </div>
        <div class="flex justify-between items-end" style="margin-bottom: 8px;">
          <div style="font-size: 1.5rem; font-weight:700; color:var(--text-primary)">${formatCurrency(g.saved)}</div>
          <div class="goal-pct" style="font-size: 1.2rem; font-weight:700; color:${color}">${pct}%</div>
        </div>
        <div class="goal-progress" style="height: 10px; margin-bottom: 16px; background:var(--bg-surface-hover); border-radius:5px; overflow:hidden;"><div class="goal-progress-fill" style="width: ${pct}%; background: ${color}; height:100%"></div></div>
        <div class="goal-meta" style="font-size: 0.8rem; display:flex; justify-content:space-between; color:var(--text-secondary); align-items:center; margin-bottom:auto;">
          <span>Deadline: ${formatDateShort(g.deadline)}</span>
          <span class="badge" style="background:rgba(255,255,255,0.05); padding:2px 8px; border-radius:12px;">${g.status === 'in-progress' ? 'In Progress' : 'Completed'}</span>
        </div>
        <div style="margin-top: 16px; display:flex; gap: 8px; justify-content:flex-end;">
          ${g.status === 'in-progress' ? `<button class="btn btn-sm btn-outline" onclick="SEBT.views.goals.openAddFundsModal(${g.id})">Add Funds</button>` : ''}
          ${g.status === 'completed' && !g.purchased ? `<button class="btn btn-sm btn-primary" onclick="SEBT.views.goals.purchaseGoal(${g.id})"><i class="bi bi-check2-circle"></i> Complete & Buy</button>` : ''}
          ${g.status === 'completed' && g.purchased ? `<span class="badge badge-income" style="margin-right:auto"><i class="bi bi-bag-check"></i> Purchased</span>` : ''}
          <button class="btn btn-sm btn-icon" style="color:var(--text-secondary); border:1px solid transparent;" onclick="SEBT.views.goals.openEditGoalModal(${g.id})" title="Edit Goal"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-icon" style="color:var(--color-danger); border:1px solid transparent;" onclick="SEBT.views.goals.deleteGoal(${g.id})" title="Delete Goal"><i class="bi bi-trash3"></i></button>
        </div>
      </div>`;
    }).join('');
  },

  openAddGoalModal: () => {
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">New Goal</h2>
        <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Goal Name</label>
          <input type="text" id="goalName" class="form-input" placeholder="e.g. New Laptop">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Target Amount (Rs)</label>
            <input type="number" id="goalTarget" class="form-input" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Deadline</label>
            <input type="date" id="goalDeadline" class="form-input">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Icon (Emoji)</label>
          <input type="text" id="goalIcon" class="form-input" placeholder="e.g. 💻" value="🎯">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.goals.saveGoal()">Create Goal</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },

  saveGoal: () => {
    const name = document.getElementById('goalName').value;
    const target = Number(document.getElementById('goalTarget').value);
    const deadline = document.getElementById('goalDeadline').value;
    const icon = document.getElementById('goalIcon').value;
    
    if(!name || target <= 0 || !deadline) return alert('Please fill all fields');
    
    SEBT.data.addGoal({
      name, target, deadline, icon: icon || '🎯', saved: 0, status: 'in-progress'
    });
    
    SEBT.app.closeModal();
    SEBT.views.goals.renderList();
  },

  openAddFundsModal: (id) => {
    const g = SEBT.data.goals.find(g => g.id === id);
    if(!g) return;
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">Add Funds to ${g.name}</h2>
        <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Amount to Add (Rs)</label>
          <input type="number" id="fundAmount" class="form-input" placeholder="0">
        </div>
        <p class="text-secondary" style="font-size:0.85rem">Target: ${SEBT.data.formatCurrency(g.target)} | Remaining: ${SEBT.data.formatCurrency(g.target - g.saved)}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.goals.saveFunds(${id})">Add Funds</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },

  saveFunds: (id) => {
    const amount = Number(document.getElementById('fundAmount').value);
    if(amount <= 0) return alert('Please enter a valid amount');
    
    const g = SEBT.data.goals.find(g => g.id === id);
    if(g) {
      SEBT.data.updateGoal(id, { saved: g.saved + amount });
    }
    
    SEBT.app.closeModal();
    SEBT.views.goals.renderList();
  },

  deleteGoal: (id) => {
    if(confirm('Are you sure you want to delete this goal?')) {
      SEBT.data.deleteGoal(id);
      SEBT.views.goals.renderList();
    }
  },

    openEditGoalModal: (id) => {
    const g = SEBT.data.goals.find(g => g.id === id);
    if(!g) return;
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">Edit Goal</h2>
        <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Goal Name</label>
          <input type="text" id="editGoalName" class="form-input" value="${g.name}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Saved Funds (Rs)</label>
            <input type="number" id="editGoalSaved" class="form-input" value="${g.saved}">
          </div>
          <div class="form-group">
            <label class="form-label">Target Amount (Rs)</label>
            <input type="number" id="editGoalTarget" class="form-input" value="${g.target}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Deadline</label>
            <input type="date" id="editGoalDeadline" class="form-input" value="${g.deadline}">
          </div>
          <div class="form-group">
            <label class="form-label">Icon (Emoji)</label>
            <input type="text" id="editGoalIcon" class="form-input" value="${g.icon}">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.goals.updateGoalData(${id})">Save Changes</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },

  updateGoalData: (id) => {
    const name = document.getElementById('editGoalName').value;
    const saved = Number(document.getElementById('editGoalSaved').value);
    const target = Number(document.getElementById('editGoalTarget').value);
    const deadline = document.getElementById('editGoalDeadline').value;
    const icon = document.getElementById('editGoalIcon').value;
    
    if(!name || target <= 0 || saved < 0 || !deadline) return alert('Please fill all fields correctly');
    
    SEBT.data.updateGoal(id, { name, saved, target, deadline, icon: icon || '🎯' });
    
    SEBT.app.closeModal();
    SEBT.views.goals.renderList();
  },

  purchaseGoal: (id) => {
    const g = SEBT.data.goals.find(x => x.id === id);
    if(g) {
      const confirmHtml = `
        <div class="modal-header">
          <h2 class="modal-title">Confirm Purchase</h2>
          <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body" style="text-align: center; padding: 32px 24px;">
          <div style="font-size: 4rem; margin-bottom: 16px;">🛍️</div>
          <h3 style="margin-bottom: 12px;">Ready to buy ${g.name}?</h3>
          <p style="color: var(--text-secondary); margin-bottom: 8px;">This will deduct <strong>${SEBT.data.formatCurrency(g.saved)}</strong> from your main balance.</p>
        </div>
        <div class="modal-footer" style="justify-content: center; gap: 16px;">
          <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Not Yet</button>
          <button class="btn btn-primary" onclick="SEBT.views.goals.executePurchase(${g.id})">Yes, Buy It!</button>
        </div>
      `;
      SEBT.app.openModal(confirmHtml);
    }
  },

  executePurchase: (id) => {
    const g = SEBT.data.goals.find(x => x.id === id);
    if(g) {
      SEBT.data.addTransaction({
        date: new Date().toISOString(),
        description: `Goal Reached: Purchased ${g.name}`,
        category: 'shopping',
        amount: g.saved,
        type: 'expense'
      });
      SEBT.data.updateGoal(id, { purchased: true });
      SEBT.views.goals.renderList();
      
      const congratsHtml = `
        <div class="modal-body" style="text-align:center; padding: 40px 24px;">
          <div style="font-size: 5rem; margin-bottom: 16px; animation: bounce 1s ease infinite;">🎉</div>
          <h2 style="margin-bottom: 12px; font-size: 1.8rem; background: linear-gradient(135deg, var(--color-primary-light), var(--color-success)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Congratulations!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 32px; font-size: 1.1rem; line-height: 1.5;">
            You successfully saved up for and purchased your <strong style="color: var(--text-primary)">${g.name}</strong>!<br>
            Enjoy the reward of your financial discipline!
          </p>
          <button class="btn btn-primary" onclick="SEBT.app.closeModal()" style="width: 100%; padding: 14px; font-size: 1.1rem;">Awesome!</button>
        </div>
      `;
      document.getElementById('modal-content').innerHTML = congratsHtml;
    }
  },
  destroy: () => {}
};
