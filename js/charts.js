window.SEBT = window.SEBT || {};
SEBT.charts = {
  instances: {},
  initDefaults: () => {
    Chart.defaults.color = '#8888a8';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.plugins.tooltip = {
      backgroundColor: '#1a1f4e', titleColor: '#e8e8f0', bodyColor: '#e8e8f0',
      borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, cornerRadius: 8, padding: 10, boxPadding: 4
    };
    Chart.defaults.scale.grid.color = 'rgba(255,255,255,0.04)';
    Chart.defaults.scale.border.color = 'rgba(255,255,255,0.06)';
  },
  destroy: (canvasId) => {
    if (SEBT.charts.instances[canvasId]) {
      SEBT.charts.instances[canvasId].destroy();
      delete SEBT.charts.instances[canvasId];
    }
  },
  destroyAll: () => { Object.keys(SEBT.charts.instances).forEach(id => SEBT.charts.destroy(id)); },
  createDonut: (canvasId, { labels, data, colors, cutout, showLegend }) => {
    SEBT.charts.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    SEBT.charts.instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: cutout || '72%', animation: { animateRotate: true, duration: 800 }, plugins: { legend: { display: showLegend || false, position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } } } } }
    });
  },
  createBar: (canvasId, { labels, datasets, yPrefix }) => {
    SEBT.charts.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    SEBT.charts.instances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: datasets.map(ds => ({ ...ds, borderRadius: 4, borderSkipped: false, barPercentage: 0.6, categoryPercentage: 0.7 })) },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', align: 'end', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: val => (yPrefix || '₹') + (val >= 1000 ? (val/1000)+'k' : val), maxTicksLimit: 5 } } },
        animation: { duration: 800 }
      }
    });
  },
  createLine: (canvasId, { labels, data, color, fill }) => {
    SEBT.charts.destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    SEBT.charts.instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ data, borderColor: color || '#00d68f', backgroundColor: fill || 'rgba(0,214,143,0.1)', fill: true, tension: 0.4, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2 }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } }, y: { beginAtZero: true, ticks: { callback: val => '₹ ' + val, maxTicksLimit: 5 } } },
        animation: { duration: 800 }
      }
    });
  }
};
SEBT.charts.initDefaults();
