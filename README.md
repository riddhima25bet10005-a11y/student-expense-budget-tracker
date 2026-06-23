<div align="center">
  <img src="assets/logo.png" alt="SEBT Logo" width="128" height="128" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 20px;"/>
  <h1>Student Expense & Budget Tracker</h1>
  <p>A modern, responsive, and highly gamified financial dashboard built specifically for students. Track expenses, split bills with roommates, analyze spending with AI, and build healthy financial habits.</p>
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-View_Now-0052FF?style=for-the-badge)](https://student-expense-budget-tracker-peach.vercel.app)
</div>

---

## ✨ Features

### 🌟 New Premium Features
* **💯 Dynamic FinScore**: A unique "credit score" for your personal finances. Your score dynamically adjusts between 300 and 850 based on your tracking consistency, budget health, and outstanding debts.
* **🔥 Daily Tracking Streak**: Build financial discipline! Log at least one transaction or debt every day to keep your tracking streak alive, prominently displayed on your dashboard.
* **🤝 Split & Debts**: Easily track who owes you and who you owe. Settle bills and have them automatically deduct or add to your total balance.
* **🧠 AI Spending Insights**: A smart widget that analyzes your monthly burn rate, identifies where you spend the most, and gives actionable, dynamic advice based on your current budget health.
* **💱 Multi-Currency Support**: Go to settings and set your base currency to ₹ INR, $ USD, € EUR, or £ GBP. The entire app automatically updates to reflect your choice.

### 💼 Core Functionality
* **📊 Dashboard Overview**: Instantly view your total balance, monthly income, monthly expenses, and remaining budget at a glance.
* **📝 Transaction Ledger**: Add, edit, and categorize your income and expenses (Food, Transport, Shopping, Entertainment, etc.).
* **🎯 Savings Goals**: Create goals for things you want to buy, add funds over time, and visually track your progress until you reach 100%.
* **📈 Data Analytics**: Visualize your spending habits through an interactive line chart and a category breakdown doughnut chart powered by Chart.js.
* **🌙 Customization**: Toggle between Light and Dark mode, update your profile details, and manage monthly budget limits.
* **🔒 Privacy First**: All data is securely stored locally in your browser (`localStorage`). No databases, no tracking. You own your data.

---

## 🛠️ Technology Stack
* **Frontend**: HTML5, Vanilla JavaScript, CSS3
* **Styling**: Modern CSS features (Custom Variables, Flexbox, CSS Grid) with a premium UI design.
* **Icons**: Bootstrap Icons
* **Charts**: Chart.js for data visualization
* **Deployment**: Vercel CI/CD

---

## 🚀 How to Run Locally

Because this app uses purely Vanilla JavaScript and Local Storage, running it locally is incredibly simple.

1. **Clone the repository**
   ```bash
   git clone https://github.com/riddhima25bet10005-a11y/student-expense-budget-tracker.git
   ```
2. **Navigate into the directory**
   ```bash
   cd student-expense-budget-tracker
   ```
3. **Open the app**
   Simply open the `index.html` file in any modern web browser. No build steps, Node.js, or package installations are required!

---

## 📂 Directory Structure
* `/css`: Modular CSS files for layout, components, utility classes, and global variables.
* `/js`: Modular JavaScript architecture.
  * `app.js`: Main initialization and routing.
  * `data.js`: Centralized state management and LocalStorage handlers.
  * `dashboard.js`, `transactions.js`, `debts.js`, etc.: View-specific logic.
* `index.html`: The main entry point of the application.

