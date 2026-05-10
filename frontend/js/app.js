/*ORCHARD AI - APPLICATION LOGIC*/
// AUTHENTICATION SYSTEM 

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
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch(e) {
      console.warn('Cleared corrupted currentUser from localStorage');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      return null;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch("https://drone-apple-orchard-api.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.message === "Login successful") {
        localStorage.setItem('isLoggedIn', 'true');
       localStorage.setItem('currentUser', JSON.stringify({
          email: email,
          user_id: data.user_id
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  // Signup user
  async signup(name, email, password) {
  try {
    const response = await fetch("https://drone-apple-orchard-api.onrender.com/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: name,
    password: password,
    email: email
  })
});

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ name, email, user_id: data.user_id }));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  }
}

  // Logout user
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

// INITIALIZATION 

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
function onReady() {
  checkAuth();
  initializePageComponents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}

// PAGE COMPONENT INITIALIZATION 

function initializePageComponents() {
  // Initialize profile dropdown
  setupProfileDropdown();
  
  // Page-specific initialization based on DOM elements
  if (document.querySelector('[data-form="login"]')) {
    setupLoginPage();
  }
  if (document.querySelector('[data-form="signup"]')) {
    setupSignupPage();
  }
  if (document.querySelector('.upload-box')) {
    setupUploadPage();
  }
  if (document.querySelector('.sidebar-menu') && document.querySelector('[data-chart="line"]')) {
    setupDashboardPage();
  }
  if (document.querySelector('[data-element="result-image"]')) {
    setupResultPage();
  }
  if (document.querySelector('[data-action="upload-hero"]') || document.querySelector('.hero')) {
    setupHomePage();
  }
}

// PROFILE DROPDOWN 

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

// HOME PAGE SETUP 

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

// LOGIN PAGE SETUP 

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
      auth.login(email, password).then(success => {
        if (success) {
          showAlert('Login successful!', 'success');
          setTimeout(() => {
            window.location.href = 'upload.html';
          }, 500);
        } else {
          showAlert('Invalid email or password', 'error');
        }
      });
    });
  }
}

// SIGNUP PAGE SETUP 

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

     

      auth.signup(name, email, password).then(success => {
  if (success) {
    showAlert('Account created successfully!', 'success');
    setTimeout(() => {
      window.location.href = 'upload.html';
    }, 500);
  } else {
    showAlert('Signup failed', 'error');
  }
});
    });
  }
}

// UPLOAD PAGE SETUP 

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

      // Real API processing
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      
      let user = null;
      try {
        const stored = localStorage.getItem('currentUser');
        user = stored ? JSON.parse(stored) : null;
      } catch(e) {
        console.warn('Invalid user data');
      }
      
      if (user && user.user_id) {
        formData.append('user_id', user.user_id);
      }

      fetch('https://drone-apple-orchard-api.onrender.com/predict/', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          localStorage.setItem('uploadedImage', e.target.result);
          localStorage.setItem('predictionResult', JSON.stringify(data.result));
          window.location.href = 'result.html';
        };
        reader.readAsDataURL(file);
      })
      .catch(error => {
        console.error('Error:', error);
        showAlert('Error connecting to Server', 'error');
        if (loadingState) {
          loadingState.classList.remove('active');
          analyzeBtn.disabled = false;
        }
      });
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

// RESULT PAGE SETUP 

function setupResultPage() {
  const uploadedImage = document.querySelector('[data-element="result-image"]');
  const backBtn = document.querySelector('[data-action="back-dashboard"]');
  const downloadBtn = document.querySelector('[data-action="download-report"]');

  // Display uploaded image
  if (uploadedImage) {
    const imageData = localStorage.getItem('uploadedImage');
    const predictionData = localStorage.getItem('predictionResult');
    let useProcessed = false;
    
    if (predictionData) {
       try {
           const result = JSON.parse(predictionData);
           if (result.processed_image_url) {
               // Append a timestamp to avoid browser caching the old overlay if images are reused
               uploadedImage.src = result.processed_image_url + "?t=" + new Date().getTime();
               useProcessed = true;
           }
       } catch (e) {}
    }

    if (!useProcessed && imageData) {
       uploadedImage.src = imageData;
    }
  }

  // Handle result display
  const predictionData = localStorage.getItem('predictionResult');
  if (predictionData) {
    try {
      const result = JSON.parse(predictionData);
      const diseaseNameEl = document.querySelector('.disease-name');
      const confidenceValueEl = document.querySelector('.confidence-value');
      
      if (diseaseNameEl && confidenceValueEl) {
        let formattedName = result.disease.replace(/_/g, ' ');
        formattedName = formattedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        diseaseNameEl.textContent = formattedName;
        
        const confidencePercent = Math.round(result.confidence * 100);
        confidenceValueEl.textContent = confidencePercent + '%';
        
        // Update progress bar
        const confidenceBar = confidenceValueEl.nextElementSibling?.querySelector('div > div');
        if (confidenceBar) {
          confidenceBar.style.width = confidencePercent + '%';
        }
        
        // Update treatment recommendations dynamically
        if (result.advisory && typeof result.advisory === 'object') {
          const immediateEl = document.getElementById('immediate-actions-list');
          const shortTermEl = document.getElementById('short-term-plan-list');
          const longTermEl = document.getElementById('long-term-plan-list');
          const notesEl = document.getElementById('additional-notes-text');
          
          if (immediateEl && result.advisory.immediate) {
            immediateEl.innerHTML = result.advisory.immediate.map(item => `<li>${item}</li>`).join('');
          }
          if (shortTermEl && result.advisory.short_term) {
            shortTermEl.innerHTML = result.advisory.short_term.map(item => `<li>${item}</li>`).join('');
          }
          if (longTermEl && result.advisory.long_term) {
            longTermEl.innerHTML = result.advisory.long_term.map(item => `<li>${item}</li>`).join('');
          }
          if (notesEl && result.advisory.notes) {
            notesEl.textContent = result.advisory.notes;
          }
        }
        
        // Update Tree Health Status
        const treeHealthStatusContainer = document.getElementById('tree-health-status-container');
        const treeHealthStatusIndicator = document.getElementById('tree-health-status-indicator');
        const treeHealthStatusText = document.getElementById('tree-health-status-text');
        const treeHealthDescription = document.getElementById('tree-health-description');

        if (treeHealthStatusContainer && treeHealthStatusText && result.risk) {
            treeHealthStatusText.textContent = result.risk;
            
            let bgColor, textColor;
            let description = '';
            
            if (result.risk === 'Low Risk') {
                bgColor = '#e8f5e9'; // Light green
                textColor = '#2e7d32'; // Dark green
                description = 'Trees appear mostly healthy. Continue regular monitoring and preventive care.';
            } else if (result.risk === 'Moderate Risk') {
                bgColor = '#fff3e0'; // Light orange
                textColor = '#e65100'; // Dark orange
                description = 'Trees show signs of infection. Early-stage treatment recommended to prevent spread.';
            } else if (result.risk === 'High Risk') {
                bgColor = '#ffebee'; // Light red
                textColor = '#c62828'; // Dark red
                description = 'Severe infection detected. Immediate aggressive treatment is necessary to avoid significant crop loss.';
            }
            
            treeHealthStatusContainer.style.backgroundColor = bgColor;
            treeHealthStatusText.style.color = textColor;
            
            // Adjust indicator styling
            if (treeHealthStatusIndicator) {
                 treeHealthStatusIndicator.style.backgroundColor = textColor;
            }
            
            if (treeHealthDescription) {
                 treeHealthDescription.textContent = description;
            }
        }

        // Update Coverage and Urgency
        const infectionCoverageText = document.getElementById('infection-coverage-text');
        const infectionCoverageBar = document.getElementById('infection-coverage-bar');
        const urgencyLevelText = document.getElementById('urgency-level-text');
        const urgencyLevelBar = document.getElementById('urgency-level-bar');

        if (infectionCoverageText && infectionCoverageBar && result.coverage !== undefined) {
            infectionCoverageText.textContent = result.coverage + '%';
            infectionCoverageBar.style.width = result.coverage + '%';
            
            // Set coverage bar color
            const coverageColor = result.coverage > 70 ? '#f44336' : (result.coverage > 40 ? '#ff9800' : '#4caf50');
            infectionCoverageBar.style.backgroundColor = coverageColor;
            infectionCoverageText.style.color = coverageColor;
        }

        if (urgencyLevelText && urgencyLevelBar && result.urgency) {
            urgencyLevelText.textContent = result.urgency;
            
            let urgencyWidth = '0%';
            let color = 'var(--primary-green)'; // default
            
            if (result.urgency === 'Low') {
                urgencyWidth = '30%';
                color = '#4caf50'; // Green
            } else if (result.urgency === 'Medium') {
                urgencyWidth = '60%';
                color = '#ff9800'; // Orange
            } else if (result.urgency === 'High') {
                urgencyWidth = '90%';
                color = '#f44336'; // Red
            }
            
            urgencyLevelText.style.color = color;
            urgencyLevelBar.style.width = urgencyWidth;
            urgencyLevelBar.style.backgroundColor = color;
        }

        }

        // Update Similar Diseases Section
        if (result.similar_diseases && result.similar_diseases.length > 0) {
             const similarSection = document.getElementById('similar-diseases-section');
             const similarContainer = document.getElementById('similar-diseases-container');
             if (similarSection && similarContainer) {
                 similarSection.style.display = 'block';
                 similarContainer.innerHTML = result.similar_diseases.map(dis => {
                      let formattedSimilar = dis.disease.replace(/_/g, ' ');
                      formattedSimilar = formattedSimilar.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                      const percent = Math.round(dis.confidence * 100);
                      
                      let desc = "Secondary disease pattern detected";
                      if (formattedSimilar.includes("Powdery Mildew")) desc = "White fungal coating patterns detected";
                      if (formattedSimilar.includes("Cedar Rust")) desc = "Orange/rusty spots pattern detected";
                      if (formattedSimilar.includes("Black Rot")) desc = "Dark lesion formation detected";
                      if (formattedSimilar.includes("Apple Scab")) desc = "Olive-green lesion signatures detected";
                      
                      return `
                      <div class="card">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-2);">
                              <h3 style="color: var(--text-dark); font-size: 16px;">${formattedSimilar}</h3>
                              <span class="status-badge status-yellow">${percent}% confidence</span>
                          </div>
                          <p style="font-size: 14px; color: var(--text-gray);">${desc}</p>
                      </div>
                      `;
                 }).join('');
             }
        }

    } catch(e) {
      console.error('Error parsing prediction data', e);
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

// DASHBOARD PAGE SETUP 

function setupDashboardPage() {
  // Initialize sidebar navigation
  setupSidebarNavigation();

  // Initialize dynamic data
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
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user || !user.user_id) {
    console.error("User not found");
    return;
  }

  fetch(`https://drone-apple-orchard-api.onrender.com/dashboard/${user.user_id}`)
    .then(res => res.json())
    .then(data => {
      const statCards = document.querySelectorAll('.stat-card');

      if (statCards.length >= 4) {
         statCards[0].querySelector('.stat-value').textContent = data.total || 0;
         statCards[1].querySelector('.stat-value').textContent = (data.healthy_percent || 0) + '%';
         statCards[2].querySelector('.stat-value').textContent = (data.infected_percent || 0) + '%';
         statCards[3].querySelector('.stat-value').textContent = data.current_disease || 'None';
      }

      // Update Pie Chart dynamically based on returned distribution
      if (data.disease_counts) {
         generatePieChart(data.disease_counts, data.total);
      } else {
         generatePieChart({}, 0);
      }

      // Update Line Chart dynamically based on returned trend
      if (data.infection_trend) {
         generateLineChart(data.infection_trend);
      } else {
         generateLineChart([0,0,0,0,0,0,0]);
      }

      // Update Recent Activity
      const activityList = document.querySelector('.activity-list');
      if (activityList && data.recent_activity && data.recent_activity.length > 0) {
         activityList.innerHTML = data.recent_activity.map(act => `
             <li class="activity-item">
                 <div class="activity-time">Recent Upload</div>
                 <div class="activity-description">
                     <strong>${act.disease}</strong> (${act.status}) - ${act.confidence}% confidence
                 </div>
             </li>
         `).join('');
      } else if (activityList) {
         activityList.innerHTML = '<li class="activity-item">No recent activity</li>';
      }

      // Update Top Detected Diseases text block
      const diseaseInfoCard = document.querySelectorAll('.card')[1];
      if(diseaseInfoCard && data.disease_counts) {
         const listContainer = diseaseInfoCard.querySelector('div');
         if(listContainer) {
            const diseaseEntries = Object.entries(data.disease_counts);
            if(diseaseEntries.length > 0) {
               listContainer.innerHTML = diseaseEntries.map(([name, count]) => {
                   let percent = 0;
                   if (data.total > 0) {
                       const infectedCount = data.total - (data.healthy_percent * data.total / 100);
                       percent = Math.round((count / infectedCount) * 100);
                   }
                   return `
                     <div style="display: flex; justify-content: space-between; align-items: center;">
                         <div>
                             <p style="font-weight: 600; color: var(--text-dark);">${name}</p>
                             <p style="font-size: 13px; color: var(--text-gray);">${count} cases</p>
                         </div>
                         <span class="status-badge status-yellow">${percent}%</span>
                     </div>`;
               }).join('');
            } else {
               listContainer.innerHTML = '<p>No diseases detected yet.</p>';
            }
         }
      }

      // Update Orchard Health Overview
      const healthOverviewCard = document.querySelectorAll('.card')[2];
      if (healthOverviewCard && data.total > 0) {
          const healthyPercent = data.healthy_percent || 0;
          const infectedPercent = data.infected_percent || 0;
          
          healthOverviewCard.innerHTML = `
              <h3 style="color: var(--primary-green); margin-bottom: var(--spacing-2);"> Overall Health</h3>
              <div style="display: flex; flex-direction: column; gap: var(--spacing-2);">
                  <div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                          <span style="font-weight: 500; color: var(--text-dark);">Overall Health</span>
                          <span style="color: var(--primary-green); font-weight: 600;">${healthyPercent}%</span>
                      </div>
                      <div style="background-color: var(--border-gray); height: 8px; border-radius: 4px; overflow: hidden;">
                          <div style="background-color: var(--accent-green); width: ${healthyPercent}%; height: 100%;"></div>
                      </div>
                  </div>

                  <div style="display: flex; gap: var(--spacing-2); margin-top: var(--spacing-2);">
                      <div style="flex: 1; text-align: center;">
                          <div style="color: #4caf50; font-weight: 600; font-size: 18px;">${healthyPercent}%</div>
                          <p style="font-size: 12px; color: var(--text-gray);">Healthy</p>
                      </div>
                      <div style="flex: 1; text-align: center;">
                          <div style="color: #f44336; font-weight: 600; font-size: 18px;">${infectedPercent}%</div>
                          <p style="font-size: 12px; color: var(--text-gray);">Infected</p>
                      </div>
                  </div>
              </div>
          `;
      }

    })
    .catch(err => {
      console.error("Dashboard error:", err);
    });
}

// CHARTS 

function generateLineChart(trendData) {
  const canvas = document.querySelector('[data-chart="line"]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Clear canvas before drawing new data (essential for dynamic updates)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  // Chart data
  const data = trendData || [0, 0, 0, 0, 0, 0, 0];
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

function generatePieChart(diseaseCounts = {}, total = 0) {
  const canvas = document.querySelector('[data-chart="pie"]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = 300;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 20; // Move chart up slightly to accommodate legend
  const radius = Math.min(centerX, centerY) - 20;

  const entries = Object.entries(diseaseCounts);
  const data = [];
  const defaultColors = ['#2E7D32', '#8BC34A', '#FFA726', '#f44336'];
  
  let totalInfections = 0;
  entries.forEach(([name, count]) => { totalInfections += count; });

  if (totalInfections === 0) {
      // Empty chart
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#666';
      ctx.font = '14px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', centerX, centerY);
      return;
  }

  entries.forEach(([name, count], index) => {
      data.push({
          label: name,
          value: Math.round((count / totalInfections) * 100),
          color: defaultColors[index % defaultColors.length]
      });
  });

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
  let legendY = canvas.height - 40;
  let legendX = 20;
  
  // Set consistent text properties for the legend
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  data.forEach((item, index) => {
    // If we reach past the middle line, or if the text is too long, we can split into rows
    // To be safe, we just use 2 columns maximum.
    if (index > 0 && index % 2 === 0) {
       legendX = 20;
       legendY += 20;
    }

    // Color box
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 12, 12);

    // Label
    ctx.fillStyle = '#1B1B1B';
    ctx.fillText(item.label, legendX + 18, legendY + 6);

    legendX += canvas.width / 2;
  });
}

// UTILITY FUNCTIONS 

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

// for healthy status 

function downloadReport() {
  const predictionDataStr = localStorage.getItem('predictionResult');
  let result = null;
  if (predictionDataStr) {
    try {
      result = JSON.parse(predictionDataStr);
    } catch(e) {
      console.error('Error parsing prediction data', e);
    }
  }

  if (!result) {
    showAlert('No prediction data available for report', 'error');
    return;
  }

  let formattedName = result.disease.replace(/_/g, ' ');
  formattedName = formattedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const confidencePercent = Math.round(result.confidence * 100) + '%';
  const healthStatus = result.disease === 'healthy' ? 'Healthy' : 'Moderate Risk';

  const reportData = {
    timestamp: new Date().toLocaleString(),
    diseaseName: formattedName,
    confidenceScore: confidencePercent,
    healthStatus: healthStatus,
    immediate: result.advisory?.immediate || [],
    shortTerm: result.advisory?.short_term || [],
    longTerm: result.advisory?.long_term || [],
    notes: result.advisory?.notes || ''
  };

  let reportText = 'ORCHARD AI - DISEASE DETECTION REPORT\n';
  reportText += '='.repeat(50) + '\n\n';
  reportText += `Report Generated: ${reportData.timestamp}\n\n`;
  reportText += `Disease Detected: ${reportData.diseaseName}\n`;
  reportText += `Confidence Score: ${reportData.confidenceScore}\n`;
  reportText += `Health Status: ${reportData.healthStatus}\n\n`;
  
  if (reportData.immediate.length > 0) {
    reportText += 'IMMEDIATE ACTIONS:\n';
    reportText += '-'.repeat(50) + '\n';
    reportData.immediate.forEach((rec, index) => {
      reportText += `${index + 1}. ${rec}\n`;
    });
    reportText += '\n';
  }

  if (reportData.shortTerm.length > 0) {
    reportText += 'SHORT-TERM PLAN:\n';
    reportText += '-'.repeat(50) + '\n';
    reportData.shortTerm.forEach((rec, index) => {
      reportText += `${index + 1}. ${rec}\n`;
    });
    reportText += '\n';
  }

  if (reportData.longTerm.length > 0) {
    reportText += 'LONG-TERM MANAGEMENT:\n';
    reportText += '-'.repeat(50) + '\n';
    reportData.longTerm.forEach((rec, index) => {
      reportText += `${index + 1}. ${rec}\n`;
    });
    reportText += '\n';
  }

  if (reportData.notes) {
    reportText += 'ADDITIONAL NOTES:\n';
    reportText += '-'.repeat(50) + '\n';
    reportText += `${reportData.notes}\n\n`;
  }

  reportText += '='.repeat(50) + '\n';
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

// ANIMATION STYLES 

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
