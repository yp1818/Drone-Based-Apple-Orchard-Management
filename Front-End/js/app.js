/* ========================================
   ORCHARD AI - APPLICATION LOGIC
   ======================================== */

// ========== INITIALIZE DEMO ACCOUNT ==========

// Initialize demo account on first load if not already set up
function initializeDemoAccount() {
  const usersData = localStorage.getItem('users');
  
  if (!usersData) {
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@orchard.ai',
        password: 'demo123456'
      }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }
}

// Run demo account initialization
initializeDemoAccount();

// ========== AUTHENTICATION SYSTEM ==========

class AuthSystem {
  constructor() {
    this.isLoggedIn = this.checkLoginStatus();
    this.currentUser = this.getCurrentUser();
  }

  // Check if user is logged in
  checkLoginStatus() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Get current logged-in user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  // Login user
  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
      return true;
    }
    return false;
  }

  // Signup user
  signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    return true;
  }

  // Logout user
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

// ========== INITIALIZATION ==========

const auth = new AuthSystem();

// Check authentication on protected pages
function checkAuth() {
  const protectedPages = ['upload.html', 'dashboard.html', 'result.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (protectedPages.includes(currentPage) && !auth.isLoggedIn) {
    window.location.href = 'login.html';
  }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initializePageComponents();
});

// ========== PAGE COMPONENT INITIALIZATION ==========

function initializePageComponents() {
  // Initialize profile dropdown
  setupProfileDropdown();
  
  // Page-specific initialization
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  switch (currentPage) {
    case 'login.html':
      setupLoginPage();
      break;
    case 'signup.html':
      setupSignupPage();
      break;
    case 'upload.html':
      setupUploadPage();
      break;
    case 'dashboard.html':
      setupDashboardPage();
      break;
    case 'result.html':
      setupResultPage();
      break;
    case 'index.html':
      setupHomePage();
      break;
  }
}

// ========== PROFILE DROPDOWN ==========

function setupProfileDropdown() {
  const profileIcon = document.querySelector('.profile-icon');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (!profileIcon || !dropdownMenu) return;

  profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', () => {
    dropdownMenu.classList.remove('active');
  });

  // Handle logout
  const logoutBtn = document.querySelector('[data-action="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      auth.logout();
    });
  }
}

// ========== HOME PAGE SETUP ==========

function setupHomePage() {
  const uploadBtn = document.querySelector('[data-action="upload-hero"]');
  const dashboardBtn = document.querySelector('[data-action="dashboard-hero"]');

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      if (auth.isLoggedIn) {
        window.location.href = 'upload.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
      if (auth.isLoggedIn) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'login.html';
      }
    });
  }
}

// ========== LOGIN PAGE SETUP ==========

function setupLoginPage() {
  const loginForm = document.querySelector('[data-form="login"]');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.querySelector('[name="email"]').value.trim();
      const password = document.querySelector('[name="password"]').value;

      if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      // Check if user exists
      if (auth.login(email, password)) {
        showAlert('Login successful!', 'success');
        setTimeout(() => {
          window.location.href = 'upload.html';
        }, 500);
      } else {
        showAlert('Invalid email or password', 'error');
      }
    });
  }
}

// ========== SIGNUP PAGE SETUP ==========

function setupSignupPage() {
  const signupForm = document.querySelector('[data-form="signup"]');

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.querySelector('[name="name"]').value.trim();
      const email = document.querySelector('[name="email"]').value.trim();
      const password = document.querySelector('[name="password"]').value;
      const confirmPassword = document.querySelector('[name="confirmPassword"]').value;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
      }

      if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
      }

      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (users.find(u => u.email === email)) {
        showAlert('Email already registered', 'error');
        return;
      }

      if (auth.signup(name, email, password)) {
        showAlert('Account created successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'upload.html';
        }, 500);
      }
    });
  }
}

// ========== UPLOAD PAGE SETUP ==========

function setupUploadPage() {
  const uploadBox = document.querySelector('.upload-box');
  const fileInput = document.querySelector('.file-input');
  const analyzeBtn = document.querySelector('[data-action="analyze"]');
  const imagePreview = document.querySelector('.image-preview');
  const loadingState = document.querySelector('.loading-state');

  if (!uploadBox || !fileInput) return;

  // Click upload box to open file input
  uploadBox.addEventListener('click', () => fileInput.click());

  // Handle file selection
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  });

  // Drag and drop
  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
  });

  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  });

  // Handle analyze button
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      if (!fileInput.files.length) {
        showAlert('Please select an image first', 'error');
        return;
      }

      // Show loading state
      if (loadingState) {
        loadingState.classList.add('active');
        analyzeBtn.disabled = true;
      }

      // Simulate AI processing
      setTimeout(() => {
        // Store the uploaded image data
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          localStorage.setItem('uploadedImage', e.target.result);
          window.location.href = 'result.html';
        };
        
        reader.readAsDataURL(file);
      }, 2000);
    });
  }

  function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
      showAlert('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (imagePreview) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('active');
      }
      showAlert('Image selected successfully', 'success');
    };

    reader.readAsDataURL(file);
  }
}

// ========== RESULT PAGE SETUP ==========

function setupResultPage() {
  const uploadedImage = document.querySelector('[data-element="result-image"]');
  const backBtn = document.querySelector('[data-action="back-dashboard"]');
  const downloadBtn = document.querySelector('[data-action="download-report"]');

  // Display uploaded image
  if (uploadedImage) {
    const imageData = localStorage.getItem('uploadedImage');
    if (imageData) {
      uploadedImage.src = imageData;
    }
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }

  // Download report
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadReport();
    });
  }
}

// ========== DASHBOARD PAGE SETUP ==========

function setupDashboardPage() {
  // Initialize sidebar navigation
  setupSidebarNavigation();

  // Generate charts
  generateLineChart();
  generatePieChart();

  // Initialize dummy data
  initializeDashboardData();
}

function setupSidebarNavigation() {
  const currentPage = window.location.pathname.split('/').pop();
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initializeDashboardData() {
  // Dummy statistics data
  const stats = {
    totalImages: 24,
    healthyTrees: 78,
    infectedTrees: 22,
    mostDisease: 'Apple Scab'
  };

  // Update stat cards
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length >= 4) {
    statCards[0].querySelector('.stat-value').textContent = stats.totalImages;
    statCards[1].querySelector('.stat-value').textContent = stats.healthyTrees + '%';
    statCards[2].querySelector('.stat-value').textContent = stats.infectedTrees + '%';
    statCards[3].querySelector('.stat-value').textContent = stats.mostDisease;
  }
}

// ========== CHARTS ==========

function generateLineChart() {
  const canvas = document.querySelector('[data-chart="line"]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  // Chart data
  const data = [60, 70, 65, 80, 75, 85, 78];
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];

  // Draw grid
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const y = (canvas.height / 10) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw line chart
  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  const pointDistance = chartWidth / (data.length - 1);

  // Draw line
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 3;
  ctx.beginPath();

  data.forEach((value, index) => {
    const x = padding + index * pointDistance;
    const y = canvas.height - padding - (value / 100) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  ctx.fillStyle = '#2E7D32';
  data.forEach((value, index) => {
    const x = padding + index * pointDistance;
    const y = canvas.height - padding - (value / 100) * chartHeight;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw labels
  ctx.fillStyle = '#666666';
  ctx.font = '12px Poppins';
  ctx.textAlign = 'center';
  labels.forEach((label, index) => {
    const x = padding + index * pointDistance;
    ctx.fillText(label, x, canvas.height - 10);
  });
}

function generatePieChart() {
  const canvas = document.querySelector('[data-chart="pie"]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 30;

  // Data: Apple Scab (40%), Powdery Mildew (35%), Cedar Rust (25%)
  const data = [
    { label: 'Apple Scab', value: 40, color: '#2E7D32' },
    { label: 'Powdery Mildew', value: 35, color: '#8BC34A' },
    { label: 'Cedar Rust', value: 25, color: '#FFA726' }
  ];

  let currentAngle = -Math.PI / 2;

  data.forEach(item => {
    const sliceAngle = (item.value / 100) * Math.PI * 2;

    // Draw slice
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.value + '%', labelX, labelY);

    currentAngle += sliceAngle;
  });

  // Draw legend
  const legendY = canvas.height - 40;
  let legendX = 20;

  data.forEach((item, index) => {
    // Color box
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 12, 12);

    // Label
    ctx.fillStyle = '#1B1B1B';
    ctx.font = '12px Poppins';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, legendX + 18, legendY + 6);

    legendX += 150;
  });
}

// ========== UTILITY FUNCTIONS ==========

function showAlert(message, type = 'info') {
  // Check if alert container exists
  let alertContainer = document.querySelector('.alert-container');
  
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    document.body.appendChild(alertContainer);
  }

  const alert = document.createElement('div');
  const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3';
  
  alert.style.cssText = `
    background-color: ${bgColor};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  `;

  alert.textContent = message;
  alertContainer.appendChild(alert);

  // Auto remove after 3 seconds
  setTimeout(() => {
    alert.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

function downloadReport() {
  const reportData = {
    timestamp: new Date().toLocaleString(),
    diseaseName: 'Apple Scab',
    confidenceScore: '92%',
    healthStatus: 'Moderate Risk',
    recommendations: [
      'Apply copper-based fungicide immediately',
      'Prune infected branches',
      'Improve air circulation',
      'Remove fallen leaves',
      'Monitor weather patterns'
    ]
  };

  let reportText = 'ORCHARD AI - DISEASE DETECTION REPORT\n';
  reportText += '='.repeat(50) + '\n\n';
  reportText += `Report Generated: ${reportData.timestamp}\n\n`;
  reportText += `Disease Detected: ${reportData.diseaseName}\n`;
  reportText += `Confidence Score: ${reportData.confidenceScore}\n`;
  reportText += `Health Status: ${reportData.healthStatus}\n\n`;
  reportText += 'TREATMENT RECOMMENDATIONS:\n';
  reportText += '-'.repeat(50) + '\n';
  reportData.recommendations.forEach((rec, index) => {
    reportText += `${index + 1}. ${rec}\n`;
  });
  reportText += '\n' + '='.repeat(50) + '\n';
  reportText += 'Generated by OrchardAI - Intelligent Orchard Management System';

  // Create download link
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText));
  element.setAttribute('download', `orchard-report-${Date.now()}.txt`);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  showAlert('Report downloaded successfully!', 'success');
}

// ========== ANIMATION STYLES ==========

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }

  .alert-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
  }
`;
document.head.appendChild(style);
