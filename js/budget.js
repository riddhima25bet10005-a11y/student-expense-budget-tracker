window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.budget = {
  render: (container) => {
    const { formatCurrency, getExpensesByCategory, budgets } = SEBT.data;
    const expenses = getExpensesByCategory();
    const actuals = [expenses.food, expenses.transport, expenses.shopping, expenses.entertainment, expenses.others];
    const budgetVals = [budgets.allocations.food, budgets.allocations.transport, budgets.allocations.shopping, budgets.allocations.entertainment, budgets.allocations.others];
    
    
    const totalExp = SEBT.data.getTotalExpense();
    const budgetPct = budgets.totalBudget === 0 ? 0 : Math.round((totalExp / budgets.totalBudget) * 100);
    const ringOffset = 314 - (314 * (budgetPct / 100));
    const html = `
      <div class="page-header animate-fade">
        <h1 class="page-title">Budget</h1>
        <div class="page-subtitle">Plan and track your monthly budget</div>
      </div>
      <div class="flex justify-between items-center animate-fade" style="margin-bottom: 24px; animation-delay: 0.1s">
        <div class="month-nav" style="font-size: 1.1rem; font-weight:600;"><button class="btn-icon"><i class="bi bi-chevron-left"></i></button>${SEBT.data.budgets.month}<button class="btn-icon"><i class="bi bi-chevron-right"></i></button></div>
        <button class="btn btn-primary" onclick="SEBT.views.budget.openAddBudgetModal()"><i class="bi bi-pencil"></i> Edit Budget</button>
      </div>
      <div class="summary-cards animate-fade" style="grid-template-columns: repeat(3, 1fr); animation-delay: 0.2s; margin-bottom:24px;">
        <div class="card summary-card"><div class="card-icon-wrap icon-purple"><i class="bi bi-wallet2"></i></div><div class="card-content"><div class="card-label">Total Budget</div><div class="card-value">${formatCurrency(budgets.totalBudget)}</div></div></div>
        <div class="card summary-card"><div class="card-icon-wrap icon-red"><i class="bi bi-cart"></i></div><div class="card-content"><div class="card-label">Total Spent</div><div class="card-value">${formatCurrency(SEBT.data.getTotalExpense())}</div></div></div>
        <div class="card summary-card"><div class="card-icon-wrap icon-green"><i class="bi bi-piggy-bank"></i></div><div class="card-content"><div class="card-label">Remaining</div><div class="card-value text-success">${formatCurrency(budgets.totalBudget - SEBT.data.getTotalExpense())}</div></div></div>
      </div>
      <div class="charts-row animate-fade" style="animation-delay: 0.3s">
        <div class="card flex-col items-center justify-between">
          <div class="card-header" style="width:100%"><div class="card-title">Budget Utilization</div></div>
          <svg class="budget-ring" viewBox="0 0 120 120" style="width:200px; height:200px">
            <circle class="budget-ring-bg" cx="60" cy="60" r="50"></circle>
            <circle class="budget-ring-fill" cx="60" cy="60" r="50" style="stroke-dasharray: 314; stroke-dashoffset: ${ringOffset}; stroke:#00d68f"></circle>
            <text x="60" y="55" class="budget-ring-text" style="font-size:1.5rem; fill:var(--text-primary)">${budgetPct}%</text>
            <text x="60" y="75" class="budget-ring-subtext" style="font-size:0.6rem; fill:var(--text-secondary)">of budget used</text>
          </svg>
          <div class="text-secondary" style="margin-top:20px">Great job! You are on track this month.</div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Category Breakdown</div></div>
          <div class="budget-categories flex-col gap-lg" style="margin-top: 16px;">
            ${Object.keys(budgets.allocations).map(key => {
              const catName = key.charAt(0).toUpperCase() + key.slice(1);
              const alloc = budgets.allocations[key];
              const spent = expenses[key];
              const pct = alloc === 0 ? 0 : Math.min(100, Math.round((spent/alloc)*100));
              let colorClass = 'bg-primary';
              if(key==='food') colorClass='#ff6b6b'; if(key==='transport') colorClass='#feca57'; if(key==='shopping') colorClass='#ff9ff3'; if(key==='entertainment') colorClass='#a29bfe'; if(key==='others') colorClass='#4ecdc4';
              return `
                <div class="budget-cat-row" style="font-size:0.9rem; display:flex; align-items:center; justify-content:space-between">
                  <div class="budget-cat-name" style="width:100px; font-weight:600; color:var(--text-primary)">${catName}</div>
                  <div class="budget-cat-bar" style="height:8px; flex:1; background:var(--bg-surface-hover); border-radius:4px; margin:0 12px; overflow:hidden">
                    <div class="budget-cat-fill" style="width:${pct}%; background:${colorClass}; height:100%"></div>
                  </div>
                  <div class="budget-cat-amount" style="width:120px; text-align:right">${formatCurrency(spent)} <span class="text-secondary">/ ${formatCurrency(alloc)}</span></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="card animate-fade" style="margin-top:24px; animation-delay: 0.4s">
        <div class="card-header"><div class="card-title">Budget vs Actual</div></div>
        <div class="bar-chart-container" style="height:300px"><canvas id="budgetBarChart"></canvas></div>
      </div>
    `;
    container.innerHTML = html;
    setTimeout(() => {
      SEBT.charts.createBar('budgetBarChart', { labels: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Others'], datasets: [{ label: 'Budget', data: budgetVals, backgroundColor: 'rgba(108,92,231,0.7)' }, { label: 'Actual', data: actuals, backgroundColor: '#00d68f' }] });
    }, 100);
  },
    openAddBudgetModal: () => {
    const { budgets } = SEBT.data;
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">Edit Monthly Budget</h2>
        <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Food Budget (₹)</label>
          <input type="number" id="budgetFood" class="form-input" placeholder="0" value="${budgets.allocations.food}">
        </div>
        <div class="form-group">
          <label class="form-label">Transport Budget (₹)</label>
          <input type="number" id="budgetTransport" class="form-input" placeholder="0" value="${budgets.allocations.transport}">
        </div>
        <div class="form-group">
          <label class="form-label">Shopping Budget (₹)</label>
          <input type="number" id="budgetShopping" class="form-input" placeholder="0" value="${budgets.allocations.shopping}">
        </div>
        <div class="form-group">
          <label class="form-label">Entertainment Budget (₹)</label>
          <input type="number" id="budgetEntertainment" class="form-input" placeholder="0" value="${budgets.allocations.entertainment}">
        </div>
        <div class="form-group">
          <label class="form-label">Others Budget (₹)</label>
          <input type="number" id="budgetOthers" class="form-input" placeholder="0" value="${budgets.allocations.others}">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.budget.saveBudget()">Save Budget</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },
  saveBudget: () => {
    const f = Number(document.getElementById('budgetFood').value) || 0;
    const t = Number(document.getElementById('budgetTransport').value) || 0;
    const s = Number(document.getElementById('budgetShopping').value) || 0;
    const e = Number(document.getElementById('budgetEntertainment').value) || 0;
    const o = Number(document.getElementById('budgetOthers').value) || 0;
    
    SEBT.data.updateBudget({
      food: f, transport: t, shopping: s, entertainment: e, others: o
    });
    
    SEBT.app.closeModal();
    const container = document.getElementById('main-content');
    SEBT.views.budget.render(container);
  },
  destroy: () => {}
};

