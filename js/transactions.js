window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.transactions = {
  filterMode: 'all',
  searchQuery: '',

  render: (container) => {
    const html = `
      <div class="page-header animate-fade">
        <h1 class="page-title">Transactions</h1>
        <div class="page-subtitle">Manage your income and expenses</div>
      </div>
      <div class="card animate-fade" style="animation-delay: 0.1s">
        <div class="card-header">
          <div class="flex items-center gap-md" style="flex:1">
            <div class="search-box" style="max-width: 300px;"><i class="bi bi-search"></i><input type="text" id="txSearch" class="search-input" placeholder="Search transactions..."></div>
            <div class="filter-tabs" id="txFilterTabs" style="margin-bottom: 0;">
              <div class="filter-tab active" data-filter="all">All</div>
              <div class="filter-tab" data-filter="income">Income</div>
              <div class="filter-tab" data-filter="expense">Expense</div>
            </div>
          </div>
          <div class="flex items-center gap-md">
            <div class="month-nav"><button class="btn-icon"><i class="bi bi-chevron-left"></i></button>${SEBT.data.budgets.month}<button class="btn-icon"><i class="bi bi-chevron-right"></i></button></div>
            <button class="btn btn-primary" onclick="SEBT.views.dashboard.openAddTxModal()"><i class="bi bi-plus-lg"></i> Add Transaction</button>
          </div>
        </div>
        <table class="data-table">
          <thead><tr><th>Date</th><th>Description</th><th>Category</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody id="txTableBody">
          </tbody>
        </table>
      </div>
    `;
    container.innerHTML = html;

    SEBT.views.transactions.filterMode = 'all';
    SEBT.views.transactions.searchQuery = '';
    
    // Attach search event
    document.getElementById('txSearch').addEventListener('input', (e) => {
      SEBT.views.transactions.searchQuery = e.target.value;
      SEBT.views.transactions.renderList();
    });

    // Attach filter events
    const tabs = document.querySelectorAll('#txFilterTabs .filter-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        SEBT.views.transactions.filterMode = e.target.dataset.filter;
        SEBT.views.transactions.renderList();
      });
    });

    SEBT.views.transactions.renderList();
  },

  renderList: () => {
    const tbody = document.getElementById('txTableBody');
    if (!tbody) return;
    
    const { formatCurrency, formatDateShort, transactions, getCategoryById } = SEBT.data;
    
    let filtered = transactions.filter(t => {
      if (SEBT.views.transactions.filterMode !== 'all' && t.type !== SEBT.views.transactions.filterMode) return false;
      if (SEBT.views.transactions.searchQuery) {
        const query = SEBT.views.transactions.searchQuery.toLowerCase();
        const catName = getCategoryById(t.category).name.toLowerCase();
        const desc = t.description.toLowerCase();
        if (!desc.includes(query) && !catName.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 32px; color:var(--text-muted)">No transactions found</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(t => {
      const cat = getCategoryById(t.category);
      const isInc = t.type === 'income';
      return `<tr>
        <td>${formatDateShort(t.date)}</td>
        <td><div class="transaction-desc"><div class="transaction-icon badge-${t.category}">${cat.icon}</div>${t.description}</div></td>
        <td><span class="badge badge-${t.category}">${cat.name}</span></td>
        <td style="text-align:right" class="${isInc ? 'amount-positive' : 'amount-negative'}">${isInc ? '+' : '-'}${formatCurrency(t.amount)} <button class="btn-icon" style="display:inline-flex; margin-left:16px; padding:4px; color:var(--color-danger); border:1px solid transparent;" onclick="SEBT.views.transactions.deleteTx(${t.id})"><i class="bi bi-trash3"></i></button></td>
      </tr>`;
    }).join('');
  },

  deleteTx: (id) => {
    if(confirm('Are you sure you want to delete this transaction?')) {
      SEBT.data.deleteTransaction(id);
      SEBT.views.transactions.renderList();
    }
  },
  destroy: () => {}
};
