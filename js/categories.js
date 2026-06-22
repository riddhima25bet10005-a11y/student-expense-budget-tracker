window.SEBT = window.SEBT || {};
SEBT.views = SEBT.views || {};

SEBT.views.categories = {
  render: (container) => {
    const html = `
      <div class="page-header animate-fade">
        <h1 class="page-title">Categories</h1>
        <div class="page-subtitle">Manage your spending categories</div>
      </div>
      <div class="flex justify-between items-center animate-fade" style="margin-bottom: 24px; animation-delay: 0.1s">
        <h3 style="color:var(--text-primary)">All Categories</h3>
        <button class="btn btn-primary" onclick="SEBT.views.categories.openAddCategoryModal()"><i class="bi bi-plus-lg"></i> Add Category</button>
      </div>
      <div class="summary-cards animate-fade" id="categoriesList" style="grid-template-columns: repeat(3, 1fr); animation-delay: 0.2s">
      </div>
    `;
    container.innerHTML = html;
    SEBT.views.categories.renderList();
  },

  renderList: () => {
    const container = document.getElementById('categoriesList');
    if(!container) return;
    
    container.innerHTML = SEBT.data.categories.map(c => {
      // Calculate real transaction count
      const count = SEBT.data.transactions.filter(t => t.category === c.id).length;
      const isBuiltIn = ['food', 'transport', 'shopping', 'entertainment', 'others', 'income'].includes(c.id);
      
      return `
        <div class="card flex items-center justify-between" style="padding:20px; gap:16px;">
          <div class="flex items-center gap-md">
            <div style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; background: ${c.color}20; color: ${c.color}">${c.icon}</div>
            <div>
              <div style="font-weight:600; font-size:1.1rem; color:var(--text-primary)">${c.name}</div>
              <div style="color:var(--text-secondary); font-size:0.85rem; margin-top:4px">${count} transaction${count !== 1 ? 's' : ''}</div>
            </div>
          </div>
          ${!isBuiltIn ? `
            <button class="btn btn-sm btn-icon" style="color:var(--color-danger); border:none" onclick="SEBT.views.categories.deleteCategory('${c.id}')" title="Delete Category">
              <i class="bi bi-trash3"></i>
            </button>
          ` : '<div style="width:32px"></div>'}
        </div>
      `;
    }).join('');
  },

  openAddCategoryModal: () => {
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">New Category</h2>
        <button class="btn-icon modal-close" onclick="SEBT.app.closeModal()"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Category Name</label>
          <input type="text" id="catName" class="form-input" placeholder="e.g. Healthcare">
        </div>
        <div class="form-group">
          <label class="form-label">Icon (Emoji)</label>
          <input type="text" id="catIcon" class="form-input" placeholder="e.g. 🏥" value="📌">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="SEBT.app.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="SEBT.views.categories.saveCategory()">Add Category</button>
      </div>
    `;
    SEBT.app.openModal(html);
  },

  saveCategory: () => {
    const name = document.getElementById('catName').value;
    const icon = document.getElementById('catIcon').value || '📌';
    
    // Auto-assign a vibrant color
    const colors = ['#ff6b6b', '#feca57', '#ff9ff3', '#a29bfe', '#4ecdc4', '#00d68f', '#ff4757', '#eccc68'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    if(!name) return alert('Please enter a category name');
    
    const id = name.toLowerCase().replace(/\s+/g, '_');
    if(SEBT.data.categories.find(c => c.id === id)) return alert('Category already exists');
    
    SEBT.data.addCategory({ id, name, icon, color });
    
    SEBT.app.closeModal();
    SEBT.views.categories.renderList();
  },

  deleteCategory: (id) => {
    const count = SEBT.data.transactions.filter(t => t.category === id).length;
    if(count > 0) {
      if(!confirm(`This category is used in ${count} transactions. If you delete it, those transactions will become uncategorized or default to 'Others'. Delete anyway?`)) return;
      // Re-assign transactions to 'others'
      SEBT.data.transactions.forEach(t => {
        if(t.category === id) t.category = 'others';
      });
      SEBT.data.saveData();
    } else {
      if(!confirm('Are you sure you want to delete this custom category?')) return;
    }
    
    SEBT.data.deleteCategory(id);
    SEBT.views.categories.renderList();
  },

  destroy: () => {}
};
