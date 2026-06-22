window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.debts = {
  render: (container) => {
    const { debts, formatCurrency, formatDateShort } = SEBT.data;
    
    // Calculate totals
    const owedToMe = debts.filter(d => !d.settled && d.type === 'owed_to_me').reduce((sum, d) => sum + d.amount, 0);
    const iOwe = debts.filter(d => !d.settled && d.type === 'i_owe').reduce((sum, d) => sum + d.amount, 0);

    const activeDebts = debts.filter(d => !d.settled);
    const settledDebts = debts.filter(d => d.settled);

    const html = `
      <div class="page-header animate-fade" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px">
        <div>
          <h1 class="page-title">Roommate Split & Debts</h1>
          <div class="page-subtitle">Track who owes you and who you owe</div>
        </div>
        <button class="btn btn-primary" onclick="SEBT.views.debts.openAddDebtModal()"><i class="bi bi-plus-lg"></i> Add Debt</button>
      </div>

      <div class="summary-cards animate-fade" style="animation-delay: 0.1s; grid-template-columns: 1fr 1fr; margin-bottom: 32px">
        <div class="card summary-card">
          <div class="card-icon-wrap icon-green"><i class="bi bi-box-arrow-in-down-left"></i></div>
          <div class="card-content">
            <div class="card-label">Owed to Me</div>
            <div class="card-value text-success">${formatCurrency(owedToMe)}</div>
          </div>
        </div>
        <div class="card summary-card">
          <div class="card-icon-wrap icon-red"><i class="bi bi-box-arrow-up-right"></i></div>
          <div class="card-content">
            <div class="card-label">I Owe</div>
            <div class="card-value text-danger">${formatCurrency(iOwe)}</div>
          </div>
        </div>
      </div>

      <div class="card animate-fade" style="animation-delay: 0.2s">
        <div class="card-header">
          <div class="card-title">Active Debts</div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Person</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${activeDebts.length ? activeDebts.map(d => `
                <tr>
                  <td>${formatDateShort(d.date)}</td>
                  <td style="font-weight:600">${d.person}</td>
                  <td>${d.reason}</td>
                  <td style="font-weight:600" class="${d.type === 'owed_to_me' ? 'text-success' : 'text-danger'}">${formatCurrency(d.amount)}</td>
                  <td><span class="badge ${d.type === 'owed_to_me' ? 'badge-income' : 'badge-expense'}">${d.type === 'owed_to_me' ? 'Owed to Me' : 'I Owe'}</span></td>
                  <td>
                    <button class="btn btn-icon text-success" onclick="SEBT.views.debts.settle(${d.id})" title="Mark as Settled"><i class="bi bi-check-circle"></i></button>
                    <button class="btn btn-icon text-danger" onclick="SEBT.views.debts.delete(${d.id})" title="Delete"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted)">No active debts right now! 🎉</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      ${settledDebts.length ? `
      <div class="card animate-fade" style="margin-top: 24px; animation-delay: 0.3s">
        <div class="card-header">
          <div class="card-title">Settled History</div>
        </div>
        <div class="table-responsive">
          <table class="data-table" style="opacity: 0.7">
            <thead>
              <tr>
                <th>Date</th>
                <th>Person</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${settledDebts.map(d => `
                <tr>
                  <td>${formatDateShort(d.date)}</td>
                  <td>${d.person}</td>
                  <td>${d.reason}</td>
                  <td>${formatCurrency(d.amount)}</td>
                  <td><span class="badge badge-others">${d.type === 'owed_to_me' ? 'Owed to Me' : 'I Owe'}</span></td>
                  <td>
                    <button class="btn btn-icon text-danger" onclick="SEBT.views.debts.delete(${d.id})" title="Delete"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}
    `;
    container.innerHTML = html;
  },

  openAddDebtModal: () => {
    const html = `
      <div class="modal-header"><h3 class="modal-title">Log a Split / Debt</h3><button class="modal-close" onclick="SEBT.app.closeModal()">&times;</button></div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Type</label>
            <select id="debtType" class="form-select">
              <option value="owed_to_me">Someone owes me</option>
              <option value="i_owe">I owe someone</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" id="debtDate" class="form-input" value="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Person</label>
          <input type="text" id="debtPerson" class="form-input" placeholder="e.g. Roommate John">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Reason</label>
            <input type="text" id="debtReason" class="form-input" placeholder="e.g. Groceries">
          </div>
          <div class="form-group">
            <label class="form-label">Amount</label>
            <input type="number" id="debtAmount" class="form-input" placeholder="0">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.debts.save()">Save Debt</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },

  save: () => {
    const type = document.getElementById('debtType').value;
    const date = document.getElementById('debtDate').value;
    const person = document.getElementById('debtPerson').value;
    const reason = document.getElementById('debtReason').value;
    const amount = parseFloat(document.getElementById('debtAmount').value);

    if(!person || !reason || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    SEBT.data.addDebt({
      type, date, person, reason, amount
    });

    SEBT.app.closeModal();
    SEBT.views.debts.render(document.getElementById('main-content'));
  },

  settle: (id) => {
    if(confirm("Are you sure you want to mark this as settled?")) {
      SEBT.data.settleDebt(id);
      SEBT.views.debts.render(document.getElementById('main-content'));
    }
  },

  delete: (id) => {
    if(confirm("Delete this record permanently?")) {
      SEBT.data.deleteDebt(id);
      SEBT.views.debts.render(document.getElementById('main-content'));
    }
  },

  destroy: () => {}
};

