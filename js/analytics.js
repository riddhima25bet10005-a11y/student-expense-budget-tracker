window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.analytics = {
  render: (container) => {
    const { formatCurrency, formatDateShort, getExpensesByCategory, transactions, getTotalIncome, getTotalExpense } = SEBT.data;
    const expenses = getExpensesByCategory();
    const actuals = [expenses.food, expenses.transport, expenses.shopping, expenses.entertainment, expenses.others];
    
    // Calculate stats
    const expenseTxns = transactions.filter(t => t.type === 'expense');
    let highest = { amount: 0, date: new Date().toISOString() };
    expenseTxns.forEach(t => {
      if(t.amount > highest.amount) {
        highest.amount = t.amount;
        highest.date = t.date;
      }
    });
    
    const currentDay = new Date().getDate();
    const totalExp = getTotalExpense();
    const totalInc = getTotalIncome();
    const avgDaily = totalExp / (currentDay || 1);
    const savingsRate = totalInc > 0 ? Math.max(0, Math.round(((totalInc - totalExp) / totalInc) * 100)) : 0;
    
    // Generate last 7 days chart data
    const last7DaysLabels = [];
    const last7DaysData = [];
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7DaysLabels.push(formatDateShort(d.toISOString()));
      
      const sum = expenseTxns.filter(t => t.date.startsWith(dateStr)).reduce((s, t) => s + t.amount, 0);
      last7DaysData.push(sum);
    }
    
    const html = `
      <div class="page-header animate-fade">
        <h1 class="page-title">Analytics</h1>
        <div class="page-subtitle">Insights into your spending habits</div>
      </div>
      <div class="summary-cards animate-fade" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px; animation-delay: 0.1s">
        <div class="card stat-card" style="padding: 24px">
          <div class="stat-label text-secondary">Avg. Daily Expense</div>
          <div class="stat-value text-primary" style="font-size: 1.5rem; font-weight:700; margin-top:8px">${formatCurrency(avgDaily)}</div>
        </div>
        <div class="card stat-card" style="padding: 24px">
          <div class="stat-label text-secondary">Highest Expense</div>
          <div class="stat-value text-danger" style="font-size: 1.5rem; font-weight:700; margin-top:8px">${formatCurrency(highest.amount)}</div>
          <div class="stat-sub text-muted" style="font-size:0.8rem; margin-top:4px">on ${formatDateShort(highest.date)}</div>
        </div>
        <div class="card stat-card" style="padding: 24px">
          <div class="stat-label text-secondary">Total Transactions</div>
          <div class="stat-value text-info" style="font-size: 1.5rem; font-weight:700; margin-top:8px">${transactions.length}</div>
        </div>
        <div class="card stat-card" style="padding: 24px">
          <div class="stat-label text-secondary">Savings Rate</div>
          <div class="stat-value text-success" style="font-size: 1.5rem; font-weight:700; margin-top:8px">${savingsRate}%</div>
          <div class="stat-sub text-success" style="font-size:0.8rem; margin-top:4px">of total income</div>
        </div>
      </div>
      <div class="charts-row animate-fade" style="animation-delay: 0.2s; display:grid; grid-template-columns:1.5fr 1fr; gap:24px;">
        <div class="card">
          <div class="card-header"><div class="card-title">Expense Trend (Last 7 Days)</div></div>
          <div class="line-chart-container" style="height: 250px; margin-top:16px"><canvas id="analyticsLineChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Spending by Category</div></div>
          <div class="donut-chart-wrapper" style="height: 250px; display:flex; align-items:center; justify-content:center; margin-top:16px">
            <div class="donut-canvas-wrap" style="width:100%; max-width: 350px; height:200px"><canvas id="analyticsDonutChart"></canvas></div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;
    setTimeout(() => {
      SEBT.charts.createLine('analyticsLineChart', { labels: last7DaysLabels, data: last7DaysData, color: '#ff6b6b', fill: 'rgba(255,107,107,0.1)' });
      SEBT.charts.createDonut('analyticsDonutChart', { labels: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Others'], data: actuals, colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#a29bfe', '#4ecdc4'], showLegend: true });
    }, 100);
  },
  destroy: () => {}
};
