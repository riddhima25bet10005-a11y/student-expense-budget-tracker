import os
import re

filepath = "js/data.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add debts to initial state
content = content.replace("  goals: [],\n", "  goals: [],\n  debts: [],\n")

# Add calculateStreak, exchangeRates, and debt functions right before addCategory
new_funcs = """  exchangeRates: {
    'USD': 83.5,
    'EUR': 89.2,
    'GBP': 105.1,
    'CAD': 61.2,
    'AUD': 55.4,
    'INR': 1.0
  },
  calculateStreak: () => {
    let streak = 0;
    const dailyLimit = SEBT.data.budgets.totalBudget > 0 ? SEBT.data.budgets.totalBudget / 30 : 500;
    const expByDate = {};
    SEBT.data.transactions.filter(t => t.type === 'expense').forEach(t => {
      const d = t.date.split('T')[0];
      expByDate[d] = (expByDate[d] || 0) + t.amount;
    });

    let checkDate = new Date();
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      const spent = expByDate[dStr] || 0;
      if (spent <= dailyLimit) {
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
    if(d) {
      d.settled = true;
      SEBT.data.saveData();
    }
  },
  deleteDebt: (id) => {
    SEBT.data.debts = SEBT.data.debts.filter(x => x.id !== id);
    SEBT.data.saveData();
  },
  addCategory:"""

content = content.replace("  addCategory:", new_funcs)

# Update saveData to include debts
content = content.replace("goals: SEBT.data.goals,\n", "goals: SEBT.data.goals,\n      debts: SEBT.data.debts,\n")

# Update loadData to load debts
content = content.replace("SEBT.data.goals = parsed.goals || [];\n", "SEBT.data.goals = parsed.goals || [];\n        SEBT.data.debts = parsed.debts || [];\n")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
