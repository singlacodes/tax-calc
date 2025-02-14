# Tax Calculator

A modern web application for calculating and comparing tax liability under both old and new tax regimes for the financial year 2025-26.

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [Future Enhancements](#future-enhancements)

## 🔍 Overview

This Tax Calculator helps users determine their tax liability under both old and new tax regimes in India for FY 2025-26. It provides an intuitive step-by-step process with detailed breakdowns and visualizations to help users make informed decisions about their tax planning.

<img width="1512" alt="Screenshot 2025-02-14 at 3 19 03 PM" src="https://github.com/user-attachments/assets/6c9b3e60-9fc1-456e-a66f-d1185efb91cc" />


## ✨ Features

- **Multi-step Calculation Process**:
  - Basic Details (Age, Financial Year)
  - Income Details (Salary, HRA, LTA, Professional Tax)
  - Deductions (Section 80C, 80D, 80G, and more)
  - Interactive Tax Summary with Visualizations

- **Intuitive User Interface**:
  - Responsive design for all devices
  - Interactive charts for tax comparison
  - Guided tooltips and help text
  - Smooth transitions and animations

- **Advanced Calculations**:
  - Comprehensive income assessment
  - Detailed deduction calculations
  - Side-by-side regime comparison
  - Real-time updates

## 🛠️ Technologies Used

### Frontend
- **React** - Core framework with functional components and hooks
- **React Router** - For navigation
- **Recharts** - For data visualization components
- **Lucide React** - For modern icons
- **Tailwind CSS** - For styling and responsive design

### Key Technical Features
- Modular component architecture
- Lazy loading for optimal performance
- Responsive layouts using Tailwind CSS
- Custom hooks for state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.x or higher)
- npm or Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tax-calculator.git
   cd tax-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 📁 Project Structure

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── commoon/
│   ├── pages/
│   │   ├── TaxCalculator/
│   │   └── Landing/
│   ├── hooks/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── package.json
└── tailwind.config.js
```

## ⚡ Performance

The application is optimized for performance with:
- Code splitting using React.lazy
- Memoization with useCallback and useMemo
- Debounced inputs for form handling
- Responsive design optimizations

**Key Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## 🔮 Future Enhancements

1. **Features**
   - PDF report generation
   - Historical calculations storage
   - Multiple financial year support
   - User accounts and data persistence

2. **Technical**
   - State management solution (Redux/Context)
   - Unit and E2E testing
   - Performance monitoring
   - API integration for tax rules

### Development Guidelines
- Follow existing code style and patterns
- Update documentation for any new features
- Write descriptive commit messages
- Test changes thoroughly before submitting PRs

---

Huge thanks to [Chahat Kesharwani](https://github.com/chahatkesh) for all the help—your insights helped me refine my approach and write better code!

---

**Note:** This Tax Calculator is designed for educational and planning purposes. For official tax filing, please consult a tax professional or refer to the official government tax portal.
