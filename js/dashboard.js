window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.dashboard = {
  render: (container) => {
    const { formatCurrency, getExpensesByCategory, budgets, transactions } = SEBT.data;
    const expenses = getExpensesByCategory();
    const actuals = [expenses.food, expenses.transport, expenses.shopping, expenses.entertainment, expenses.others];
    const recent = transactions.slice(0, 5);
    
    const totalExp = SEBT.data.getTotalExpense();
    const getPct = (val) => totalExp === 0 ? 0 : Math.round((val / totalExp) * 100);
    const budgetPct = budgets.totalBudget === 0 ? 0 : Math.round((totalExp / budgets.totalBudget) * 100);

    const html = `
      <div class="page-header animate-fade" style="display: flex; justify-content: space-between; align-items: center; text-align: left; margin-bottom: 32px">
        <div>
          <h1 class="page-title">Welcome back, <span class="highlight">${SEBT.data.user.name || 'Student'}</span>!</h1>
          <div class="page-subtitle">Here's your financial overview for ${budgets.month}</div>
        </div>
        <button class="btn btn-primary" onclick="SEBT.views.dashboard.openAddTxModal()"><i class="bi bi-plus-lg"></i> Add Transaction</button>
      </div>
      
      <div class="dashboard-main" style="margin-top: 0">
                ${SEBT.data.calculateStreak() > 0 ? `<div class="card animate-fade" style="margin-bottom: 24px; display: flex; align-items: center; gap: 16px; padding: 16px 24px; background: linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,69,0,0.05)); border: 1px solid rgba(255,165,0,0.2);">
          <div style="font-size: 2rem;">🔥</div>
          <div>
            <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-primary);">You're on a ${SEBT.data.calculateStreak()} Day Saving Streak!</div>
            <div style="font-size: 0.9rem; color: var(--text-muted);">Keep your daily spending under ${formatCurrency(budgets.totalBudget > 0 ? budgets.totalBudget/30 : 500)} to keep the streak alive!</div>
          </div>
        </div>` : ''}
        <div class="summary-cards animate-fade" style="animation-delay: 0.1s">
          <div class="card summary-card"><div class="card-icon-wrap icon-purple"><i class="bi bi-wallet2"></i></div><div class="card-content"><div class="card-label">Total Balance</div><div class="card-value">${formatCurrency(SEBT.data.getBalance())}</div><div class="card-trend text-muted">No data for last month</div></div></div>
          <div class="card summary-card"><div class="card-icon-wrap icon-green"><i class="bi bi-arrow-down-short"></i></div><div class="card-content"><div class="card-label">Total Income</div><div class="card-value">${formatCurrency(SEBT.data.getTotalIncome())}</div><div class="card-trend text-muted">No data for last month</div></div></div>
          <div class="card summary-card"><div class="card-icon-wrap icon-red"><i class="bi bi-arrow-up-short"></i></div><div class="card-content"><div class="card-label">Total Expense</div><div class="card-value">${formatCurrency(SEBT.data.getTotalExpense())}</div><div class="card-trend text-muted">No data for last month</div></div></div>
          <div class="card summary-card"><div class="card-icon-wrap icon-yellow"><i class="bi bi-calendar3"></i></div><div class="card-content"><div class="card-label">This Month Left</div><div class="card-value">${formatCurrency(budgets.totalBudget - SEBT.data.getTotalExpense())}</div><div class="card-trend text-muted" style="margin-top:2px;">of ${formatCurrency(budgets.totalBudget)} budget</div><div class="progress-bar-container"><div class="progress-bar-fill icon-yellow" style="width: ${budgetPct}%"></div></div></div></div>
        </div>
        
        <div class="charts-row animate-fade" style="animation-delay: 0.2s; grid-template-columns: 1fr 1fr; margin-top: 24px;">
          <div class="card" style="height: 100%">
            <div class="card-header"><div class="card-title">Expenses by Category</div></div>
            <div class="donut-chart-wrapper">
              <div class="donut-canvas-wrap"><canvas id="dashDonutChart"></canvas></div>
              <div class="chart-legend">
                <div class="legend-item"><div class="legend-dot" style="background:#ff6b6b"></div><div class="legend-label">Food</div><div class="legend-value">${getPct(expenses.food)}%</div></div>
                <div class="legend-item"><div class="legend-dot" style="background:#feca57"></div><div class="legend-label">Transport</div><div class="legend-value">${getPct(expenses.transport)}%</div></div>
                <div class="legend-item"><div class="legend-dot" style="background:#ff9ff3"></div><div class="legend-label">Shopping</div><div class="legend-value">${getPct(expenses.shopping)}%</div></div>
                <div class="legend-item"><div class="legend-dot" style="background:#a29bfe"></div><div class="legend-label">Entertainment</div><div class="legend-value">${getPct(expenses.entertainment)}%</div></div>
                <div class="legend-item"><div class="legend-dot" style="background:#4ecdc4"></div><div class="legend-label">Others</div><div class="legend-value">${getPct(expenses.others)}%</div></div>
                <div class="text-secondary text-xs" style="margin-top:8px">Total &nbsp;&nbsp;&nbsp; <b style="color:var(--text-primary)">${formatCurrency(SEBT.data.getTotalExpense())}</b></div>
              </div>
            </div>
          </div>
          
          <div class="card" style="height: 100%; display: flex; flex-direction: column;">
            <div class="card-header"><div class="card-title">Recent Transactions</div><a href="#transactions" class="card-action" onclick="SEBT.app.navigate('transactions'); return false;">View all</a></div>
            <div class="recent-list" style="flex: 1">
              ${recent.length > 0 ? recent.map(t => {
                const cat = SEBT.data.getCategoryById(t.category);
                const isInc = t.type === 'income';
                return `<div class="recent-item"><div class="transaction-icon badge-${t.category}">${cat.icon}</div><div class="recent-info"><div class="recent-desc">${t.description}</div><div class="recent-category">${cat.name}</div></div><div class="recent-meta"><div class="recent-amount ${isInc ? 'text-success' : 'text-danger'}">${isInc ? '+' : '-'}${formatCurrency(t.amount)}</div><div class="recent-date">${SEBT.data.formatDateShort(t.date)}</div></div></div>`;
              }).join('') : '<div class="empty-state" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--text-muted);"><i class="bi bi-receipt" style="font-size:2rem; margin-bottom:8px"></i><p>No transactions yet</p></div>'}
            </div>
          </div>
        </div>
        
        <div class="animate-fade" style="animation-delay: 0.3s; margin-top: 24px;">
          <div class="quote-card"><div class="quote-icon">💡</div><div class="quote-text">A budget is telling your money where to go instead of wondering where it went.</div><div style="text-align:right; margin-top:8px; font-size:1.5rem">❤️</div></div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    setTimeout(() => {
      SEBT.charts.createDonut('dashDonutChart', { labels: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Others'], data: actuals, colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#a29bfe', '#4ecdc4'] });
    }, 100);
  },
  
  openAddTxModal: () => {
    const html = `
      <div class="modal-header"><h3 class="modal-title">Add Transaction</h3><button class="modal-close" onclick="SEBT.app.closeModal()">&times;</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Type</label><select id="txType" class="form-select"><option value="expense">Expense</option><option value="income">Income</option></select></div>
          <div class="form-group"><label class="form-label">Date</label><input type="date" id="txDate" class="form-input" value="${new Date().toISOString().split('T')[0]}"></div>
        </div>
        <div class="form-group"><label class="form-label">Description</label><input type="text" id="txDesc" class="form-input" placeholder="e.g. Coffee"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Category</label><select id="txCat" class="form-select">${SEBT.data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Amount (${SEBT.data.user.currency})</label><input type="number" id="txAmount" class="form-input" placeholder="0"></div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button><button class="btn btn-primary" onclick="SEBT.views.dashboard.saveTx()">Save Transaction</button></div>
    `;
    SEBT.app.openModal(html);
  },
  
  saveTx: () => {
    const type = document.getElementById('txType').value;
    const date = document.getElementById('txDate').value;
    const desc = document.getElementById('txDesc').value;
    const cat = document.getElementById('txCat').value;
    const amount = parseFloat(document.getElementById('txAmount').value);
    if(!desc || !amount) { alert('Please enter description and amount'); return; }
    
    // Alert System
    if(type === 'expense' && SEBT.data.user.alertsEnabled !== false) {
      
      // 0. Check Balance Overdraft
      const currentBalance = SEBT.data.getBalance();
      if(amount > currentBalance) {
        if(!confirm(`⚠️ BALANCE ALERT ⚠️\n\nThis expense of ₹${amount} exceeds your current available balance of ₹${currentBalance}!\n\nAre you absolutely sure you want to proceed into negative balance?`)) return;
      }
      
      const totalExp = SEBT.data.getTotalExpense();
      const budgetLimit = SEBT.data.budgets.totalBudget;
      const newTotal = totalExp + amount;
      
      // 1. Check Total Budget
      if(budgetLimit > 0) {
        if(newTotal > budgetLimit) {
          if(!confirm(`⚠️ BUDGET ALERT ⚠️\n\nThis expense will push you OVER your total monthly budget of ₹${budgetLimit}!\n\nAre you absolutely sure you want to log it?`)) return;
        } else if (newTotal >= budgetLimit * 0.9) {
          if(!confirm(`⚠️ BUDGET WARNING ⚠️\n\nThis expense puts you at ${Math.round((newTotal/budgetLimit)*100)}% of your total monthly budget. You are getting very close to your limit.\n\nProceed?`)) return;
        }
      }
      
      // 2. Check Category Budget
      const alloc = SEBT.data.budgets.allocations[cat];
      if(alloc && alloc > 0) {
        const catExpenses = SEBT.data.transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0);
        if(catExpenses + amount > alloc) {
          const catName = SEBT.data.getCategoryById(cat).name;
          if(!confirm(`⚠️ CATEGORY ALERT ⚠️\n\nThis expense pushes your [${catName}] spending over its specific monthly limit of ₹${alloc}.\n\nProceed anyway?`)) return;
        }
      }
    }
    
    SEBT.data.addTransaction({ date, description: desc, category: cat, type, amount });
    SEBT.app.closeModal();
    SEBT.views.dashboard.render(document.getElementById('main-content'));
  },
  
  destroy: () => {}
};
