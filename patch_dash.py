import os
import re

# 1. Update index.html
filepath = "index.html"
with open(filepath, "r", encoding="utf-8") as f:
    html = f.read()

sidebar_link = """        <a href="#debts" class="nav-item" data-view="debts"><i class="bi bi-people-fill"></i><span>Split/Debts</span></a>
        <a href="#analytics" class="nav-item" data-view="analytics"><i class="bi bi-graph-up"></i><span>Analytics</span></a>"""
html = html.replace('        <a href="#analytics" class="nav-item" data-view="analytics"><i class="bi bi-graph-up"></i><span>Analytics</span></a>', sidebar_link)

script_import = """  <script src="js/budget.js?v=11"></script>
  <script src="js/debts.js?v=1"></script>"""
html = html.replace('  <script src="js/budget.js?v=11"></script>', script_import)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(html)

# 2. Update dashboard.js
filepath = "js/dashboard.js"
with open(filepath, "r", encoding="utf-8") as f:
    dash = f.read()

# Gamification Badge
old_title = "          <h1 class=\\\"page-title\\\">Welcome back, <span class=\\\"highlight\\\">${SEBT.data.user.name || 'Student'}</span>!</h1>"
new_title = """          <h1 class="page-title">Welcome back, <span class="highlight">${SEBT.data.user.name || 'Student'}</span>!${SEBT.data.calculateStreak() > 0 ? `<div style="display:inline-block; margin-left:12px; background:var(--bg-secondary); padding:4px 10px; border-radius:12px; font-size:0.9rem; color:var(--text-primary); border:1px solid rgba(255,165,0,0.3)"><span style="color:orange">🔥</span> ${SEBT.data.calculateStreak()} Day Streak!</div>` : ''}</h1>"""
dash = dash.replace(old_title, new_title)

# AI Insights
old_insight = "<div class=\\\"quote-card\\\"><div class=\\\"quote-icon\\\">💡</div><div class=\\\"quote-text\\\">A budget is telling your money where to go instead of wondering where it went.</div><div style=\\\"text-align:right; margin-top:8px; font-size:1.5rem\\\">❤️</div></div>"
new_insight = """<div class="quote-card" id="ai-insight"></div>"""
dash = dash.replace(old_insight, new_insight)

# Inject Insight Logic at the end of render
insight_logic = """    setTimeout(() => {
      SEBT.charts.createDonut('dashDonutChart', { labels: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Others'], data: actuals, colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#a29bfe', '#4ecdc4'] });
      
      const streak = SEBT.data.calculateStreak();
      let insightText = "You're doing great! Keep tracking your expenses to see more insights here.";
      let insightIcon = "💡"; let insightEmoji = "👍";
      
      if (totalExp > budgets.totalBudget && budgets.totalBudget > 0) {
        insightText = `Warning: You have exceeded your monthly budget by ${formatCurrency(totalExp - budgets.totalBudget)}. Time to hit the brakes!`;
        insightIcon = "⚠️"; insightEmoji = "🛑";
      } else if (totalExp >= budgets.totalBudget * 0.8 && budgets.totalBudget > 0) {
        insightText = `You've spent ${budgetPct}% of your monthly budget. Try to hold off on non-essential purchases!`;
        insightIcon = "👀"; insightEmoji = "⏳";
      } else if (streak >= 3) {
        insightText = `Awesome job! You are on a ${streak}-day saving streak. Keep up the disciplined spending!`;
        insightIcon = "⭐"; insightEmoji = "🎯";
      } else if (actuals.some(a => a > budgets.totalBudget * 0.5) && budgets.totalBudget > 0) {
        const maxIdx = actuals.indexOf(Math.max(...actuals));
        const catNames = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Others'];
        insightText = `You've spent over half your budget on ${catNames[maxIdx]}. Maybe cut back there this week?`;
        insightIcon = "📊"; insightEmoji = "📉";
      }
      const insightEl = document.getElementById('ai-insight');
      if (insightEl) {
        insightEl.innerHTML = `<div class="quote-icon">${insightIcon}</div><div class="quote-text"><strong>Smart Insight:</strong> ${insightText}</div><div style="text-align:right; margin-top:8px; font-size:1.5rem">${insightEmoji}</div>`;
      }
    }, 100);"""
dash = re.sub(r"    setTimeout\(\(\) => \{\s*SEBT\.charts\.createDonut\([^\}]+\}\s*\}, 100\);", insight_logic, dash)

# Multi-Currency Support (openAddTxModal)
old_amt_input = """          <div class="form-group"><label class="form-label">Category</label><select id="txCat" class="form-select">${SEBT.data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Amount (₹)</label><input type="number" id="txAmount" class="form-input" placeholder="0"></div>"""
new_amt_input = """          <div class="form-group"><label class="form-label">Category</label><select id="txCat" class="form-select">${SEBT.data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
          <div class="form-group">
            <label class="form-label">Amount</label>
            <div style="display:flex; gap:8px;">
              <select id="txCurrency" class="form-select" style="width:80px; padding:8px"><option value="INR">₹ INR</option><option value="USD">$ USD</option><option value="EUR">€ EUR</option><option value="GBP">£ GBP</option><option value="CAD">$ CAD</option><option value="AUD">$ AUD</option></select>
              <input type="number" id="txAmount" class="form-input" placeholder="0" style="flex:1">
            </div>
          </div>"""
dash = dash.replace(old_amt_input, new_amt_input)

# Multi-Currency Support (saveTx)
old_save_amt = """    const amount = parseFloat(document.getElementById('txAmount').value);
    if(!desc || !amount) { alert('Please enter description and amount'); return; }"""
new_save_amt = """    const currency = document.getElementById('txCurrency').value || 'INR';
    let rawAmount = parseFloat(document.getElementById('txAmount').value);
    if(!desc || !rawAmount) { alert('Please enter description and amount'); return; }
    let amount = rawAmount;
    if(currency !== 'INR' && SEBT.data.exchangeRates[currency]) {
      amount = rawAmount * SEBT.data.exchangeRates[currency];
    }"""
dash = dash.replace(old_save_amt, new_save_amt)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(dash)

