window.SEBT = window.SEBT || {};
SEBT.data = {
  isAuthenticated: false,
  user: { name: 'Alex', role: 'Student', email: '', currency: 'INR (\u20B9)', theme: 'light', alertsEnabled: true },
  categories: [
    { id: 'food', name: 'Food', icon: '🍔', color: '#ff6b6b' },
    { id: 'transport', name: 'Transport', icon: '🚕', color: '#feca57' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ff9ff3' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#a29bfe' },
    { id: 'others', name: 'Others', icon: '📦', color: '#4ecdc4' },
    { id: 'income', name: 'Income', icon: '💰', color: '#00d68f' }
  ],
  transactions: [],
  budgets: {
    month: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
    currentMonthYear: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
    totalBudget: 0,
    allocations: { food: 0, transport: 0, shopping: 0, entertainment: 0, others: 0 }
  },
  goals: [],
  debts: [],
  dailyExpenses: Array(31).fill(0),
  
  formatCurrency: (amount) => '₹' + Math.abs(amount).toLocaleString('en-IN'),
  formatDate: (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  formatDateShort: (dateStr) => new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
  getCategoryById: (id) => SEBT.data.categories.find(c => c.id === id) || SEBT.data.categories[4],
  getExpensesByCategory: () => {
    const expenses = { food: 0, transport: 0, shopping: 0, entertainment: 0, others: 0 };
    SEBT.data.transactions.filter(t => t.type === 'expense').forEach(t => {
      if (expenses[t.category] !== undefined) expenses[t.category] += t.amount;
      else expenses.others += t.amount;
    });
    return expenses;
  },
  getTotalIncome: () => SEBT.data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
  getTotalExpense: () => SEBT.data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
  getBalance: () => SEBT.data.getTotalIncome() - SEBT.data.getTotalExpense(),
  deleteGoal: (id) => {
    const g = SEBT.data.goals.find(x => x.id === id);
    if(g) {
      SEBT.data.transactions = SEBT.data.transactions.filter(t => !t.description.includes(`Purchased ${g.name}`));
    }
    SEBT.data.goals = SEBT.data.goals.filter(x => x.id !== id);
    SEBT.data.saveData();
  },
  updateGoal: (id, updates) => {
    const g = SEBT.data.goals.find(g => g.id === id);
    if(g) {
      Object.assign(g, updates);
      if(g.saved >= g.target && g.status !== 'purchased') g.status = 'completed';
      SEBT.data.saveData();
    }
  },
  updateBudget: (allocations) => {
    SEBT.data.budgets.allocations = allocations;
    SEBT.data.budgets.totalBudget = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    SEBT.data.saveData();
  },
  deleteTransaction: (id) => {
    SEBT.data.transactions = SEBT.data.transactions.filter(t => t.id !== id);
    SEBT.data.saveData();
  },
  addTransaction: (txn) => {
    txn.id = SEBT.data.transactions.length ? Math.max(...SEBT.data.transactions.map(t => t.id)) + 1 : 1;
    SEBT.data.transactions.unshift(txn);
    SEBT.data.saveData();
  },
  addGoal: (goal) => {
    goal.id = SEBT.data.goals.length ? Math.max(...SEBT.data.goals.map(g => g.id)) + 1 : 1;
    SEBT.data.goals.push(goal);
    SEBT.data.saveData();
  },
  updateUser: (updates) => {
    Object.assign(SEBT.data.user, updates);
    SEBT.data.saveData();
  },
  exchangeRates: {
    'USD': 83.5,
    'EUR': 89.2,
    'GBP': 105.1,
    'CAD': 61.2,
    'AUD': 55.4,
    'INR': 1.0
  },
  calculateStreak: () => {
    let streak = 0;
    const activeDates = {};
    SEBT.data.transactions.forEach(t => {
      const d = t.date.split('T')[0];
      activeDates[d] = true;
    });
    SEBT.data.debts.forEach(d => {
      if(d.date) activeDates[d.date.split('T')[0]] = true;
    });

    let checkDate = new Date();
    const todayStr = checkDate.toISOString().split('T')[0];
    
    if (!activeDates[todayStr]) {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if(activeDates[yesterday.toISOString().split('T')[0]]) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (activeDates[dStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },
  addDebt: (debt) => {
    debt.id = SEBT.data.debts.length ? Math.max(...SEBT.data.debts.map(d => d.id)) + 1 : 1;
    debt.settled = false;
    SEBT.data.debts.unshift(debt);
    SEBT.data.saveData();
  },
  settleDebt: (id) => {
    const d = SEBT.data.debts.find(x => x.id === id);
    if(d && !d.settled) {
      d.settled = true;
      SEBT.data.addTransaction({
        date: new Date().toISOString(),
        description: `Settled Debt: ${d.person} - ${d.reason}`,
        category: 'others',
        type: d.type === 'owed_to_me' ? 'income' : 'expense',
        amount: d.amount
      });
      SEBT.data.saveData();
    }
  },
  deleteDebt: (id) => {
    const d = SEBT.data.debts.find(x => x.id === id);
    if(d) {
      SEBT.data.transactions = SEBT.data.transactions.filter(t => t.description !== `Settled Debt: ${d.person} - ${d.reason}`);
    }
    SEBT.data.debts = SEBT.data.debts.filter(x => x.id !== id);
    SEBT.data.saveData();
  },
  addCategory: (cat) => {
    SEBT.data.categories.push(cat);
    SEBT.data.saveData();
  },
  deleteCategory: (id) => {
    SEBT.data.categories = SEBT.data.categories.filter(c => c.id !== id);
    SEBT.data.saveData();
  },
  saveData: () => {
    localStorage.setItem('sebt_data', JSON.stringify({
      transactions: SEBT.data.transactions,
      budgets: SEBT.data.budgets,
      goals: SEBT.data.goals,
      debts: SEBT.data.debts,
      categories: SEBT.data.categories,
      user: SEBT.data.user,
      isAuthenticated: SEBT.data.isAuthenticated
    }));
  },
  loadData: () => {
    const saved = localStorage.getItem('sebt_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        SEBT.data.transactions = parsed.transactions || [];
        SEBT.data.budgets = parsed.budgets || SEBT.data.budgets;
        SEBT.data.goals = parsed.goals || [];
        SEBT.data.debts = parsed.debts || [];
        if (parsed.categories) SEBT.data.categories = parsed.categories;
        if (parsed.user) {
          if (!localStorage.getItem('theme_default_updated')) {
            parsed.user.theme = 'light';
            localStorage.setItem('theme_default_updated', '1');
          }
          SEBT.data.user = parsed.user;
          if(SEBT.data.user.email === 'alex@university.edu') SEBT.data.user.email = '';
          if(SEBT.data.user.currency && SEBT.data.user.currency.includes('â')) {
              SEBT.data.user.currency = 'INR (\u20B9)';
          }
        }
        if (parsed.isAuthenticated) SEBT.data.isAuthenticated = parsed.isAuthenticated;
      } catch(e) {
        console.error('Failed to load data', e);
      }
    }
  }
};
SEBT.data.loadData();


