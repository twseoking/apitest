import { Chart } from 'chart.js/auto';

class MortgageCalculator {
  constructor() {
    this.initializeElements();
    this.attachEventListeners();
    this.chart = null;
  }

  initializeElements() {
    this.loanAmountInput = document.getElementById('loanAmount');
    this.interestRateInput = document.getElementById('interestRate');
    this.loanTermInput = document.getElementById('loanTerm');
    this.calculateBtn = document.getElementById('calculateBtn');
    this.resultsDiv = document.getElementById('results');
    this.monthlyPaymentSpan = document.getElementById('monthlyPayment');
    this.totalPaymentSpan = document.getElementById('totalPayment');
    this.totalInterestSpan = document.getElementById('totalInterest');
    this.chartContainer = document.getElementById('chartContainer');
  }

  attachEventListeners() {
    this.calculateBtn.addEventListener('click', () => this.calculate());
    
    const inputs = [this.loanAmountInput, this.interestRateInput, this.loanTermInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateInput(input));
    });
  }

  validateInput(input) {
    const value = parseFloat(input.value);
    let isValid = true;

    switch(input.id) {
      case 'loanAmount':
        isValid = value > 0;
        break;
      case 'interestRate':
        isValid = value >= 0 && value <= 100;
        break;
      case 'loanTerm':
        isValid = value >= 1 && value <= 50;
        break;
    }

    input.style.borderColor = isValid ? '' : 'var(--error-color)';
    return isValid;
  }

  calculateMonthlyPayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  updateChart(principal, monthlyPayment, years) {
    if (this.chart) {
      this.chart.destroy();
    }

    const totalPayment = monthlyPayment * years * 12;
    const totalInterest = totalPayment - principal;

    this.chart = new Chart(document.getElementById('paymentChart'), {
      type: 'pie',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
          data: [principal, totalInterest],
          backgroundColor: ['#2563eb', '#dc2626']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  calculate() {
    const inputs = [this.loanAmountInput, this.interestRateInput, this.loanTermInput];
    if (!inputs.every(input => this.validateInput(input))) {
      return;
    }

    const principal = parseFloat(this.loanAmountInput.value);
    const annualRate = parseFloat(this.interestRateInput.value);
    const years = parseFloat(this.loanTermInput.value);

    const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, years);
    const totalPayment = monthlyPayment * years * 12;
    const totalInterest = totalPayment - principal;

    this.monthlyPaymentSpan.textContent = this.formatCurrency(monthlyPayment);
    this.totalPaymentSpan.textContent = this.formatCurrency(totalPayment);
    this.totalInterestSpan.textContent = this.formatCurrency(totalInterest);

    this.resultsDiv.classList.remove('hidden');
    this.chartContainer.classList.remove('hidden');
    
    this.updateChart(principal, monthlyPayment, years);
  }
}

new MortgageCalculator();
