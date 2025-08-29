// IPDR Investigation Dashboard JavaScript

// Application data
const appData = {
  summary: {
    total_records: 1000,
    unique_users: 50,
    relationships_found: 296,
    suspicious_patterns: 64,
    active_investigations: 12,
    date_range: {
      start: "2025-07-28",
      end: "2025-08-27"
    }
  },
  app_usage: {
    "WhatsApp": 148,
    "HTTP": 130,
    "SMTP": 125,
    "FTP": 125,
    "Facebook": 123,
    "SSH": 121,
    "HTTPS/Skype": 119,
    "IMAPS": 109
  },
  sample_relationships: [
    {
      id: "REL_001",
      a_party: "918730941466",
      b_party: "917478483262",
      communication_type: "Facebook",
      timestamp: "2025-08-17T20:03:00Z",
      duration: 433,
      location: "CELL_0030",
      method: "DIRECT"
    },
    {
      id: "REL_002",
      a_party: "918563524436",
      b_party: "917280305443",
      communication_type: "FTP",
      timestamp: "2025-08-16T23:29:00Z",
      duration: 1205,
      location: "CELL_0015",
      method: "DIRECT"
    },
    {
      id: "REL_003",
      a_party: "917404149892",
      b_party: "917161136344",
      communication_type: "SSH",
      timestamp: "2025-08-08T09:44:00Z",
      duration: 2085,
      location: "CELL_0025",
      method: "DIRECT"
    }
  ],
  suspicious_patterns: [
    {
      id: "SUSP_001",
      pattern_type: "HIGH_NIGHT_ACTIVITY",
      msisdn: "917280305443",
      count: 11,
      severity: "MEDIUM",
      description: "High frequency late-night communications (10 PM - 6 AM)",
      status: "UNDER_INVESTIGATION"
    },
    {
      id: "SUSP_002",
      pattern_type: "SHORT_DURATION_CALLS",
      msisdn: "918389720476",
      count: 25,
      severity: "HIGH",
      description: "Multiple very short duration calls (< 30 seconds)",
      status: "FLAGGED"
    },
    {
      id: "SUSP_003",
      pattern_type: "MULTIPLE_DEVICES",
      msisdn: "919645196062",
      device_count: 4,
      severity: "HIGH",
      description: "Same number used across multiple devices",
      status: "NEW"
    }
  ],
  recent_activity: [
    {
      timestamp: "2025-08-27T14:30:00Z",
      event: "New suspicious pattern detected",
      msisdn: "917280305443",
      type: "HIGH_NIGHT_ACTIVITY"
    },
    {
      timestamp: "2025-08-27T14:15:00Z",
      event: "Relationship mapping completed",
      count: 296,
      type: "ANALYSIS"
    },
    {
      timestamp: "2025-08-27T14:00:00Z",
      event: "IPDR data batch processed",
      records: 1000,
      type: "DATA_PROCESSING"
    }
  ],
  cases: [
    {
      id: "CASE_001",
      title: "Operation Digital Trail",
      status: "ACTIVE",
      priority: "HIGH",
      investigator: "Agent Smith",
      created: "2025-08-20",
      suspects: ["917280305443", "918389720476"],
      evidence_count: 24
    },
    {
      id: "CASE_002",
      title: "Network Analysis - Group Alpha",
      status: "PENDING",
      priority: "MEDIUM",
      investigator: "Agent Johnson",
      created: "2025-08-25",
      suspects: ["919645196062"],
      evidence_count: 8
    }
  ]
};

// Chart instance
let appUsageChart = null;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize Application
function initializeApp() {
  initializeTabSwitching();
  initializeCharts();
  initializeModals();
  initializeSearchFunctionality();
  initializeNetworkVisualization();
  initializeCaseManagement();
  initializeFilters();
  updateDashboardStats();
}

// Tab Switching Functionality
function initializeTabSwitching() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  navTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.dataset.tab;

      // Remove active class from all tabs and content
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');

      // Initialize chart when dashboard tab is shown
      if (targetTab === 'dashboard' && !appUsageChart) {
        setTimeout(() => initializeCharts(), 100);
      }
    });
  });
}

// Initialize Charts
function initializeCharts() {
  const ctx = document.getElementById('app-usage-chart');
  if (!ctx) return;

  const labels = Object.keys(appData.app_usage);
  const data = Object.values(appData.app_usage);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];

  if (appUsageChart) {
    appUsageChart.destroy();
  }

  appUsageChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Modal Functionality
function initializeModals() {
  // View details buttons
  document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', function() {
      const recordId = this.dataset.record;
      showRecordDetails(recordId);
    });
  });

  // New case button
  const newCaseBtn = document.getElementById('new-case-btn');
  if (newCaseBtn) {
    newCaseBtn.addEventListener('click', () => showModal('new-case-modal'));
  }

  // Modal close functionality
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      hideModal(modal.id);
    });
  });

  // Modal overlay close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
      const modal = this.closest('.modal');
      hideModal(modal.id);
    });
  });

  // Prevent modal content clicks from closing modal
  document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // New case form submission
  const newCaseForm = document.querySelector('.new-case-form');
  if (newCaseForm) {
    newCaseForm.addEventListener('submit', handleNewCaseSubmission);
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showRecordDetails(recordId) {
  const record = appData.sample_relationships.find(r => r.id === recordId);
  if (!record) return;

  const modalBody = document.getElementById('modal-body');
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  modalBody.innerHTML = `
    <div class="record-details">
      <div class="detail-row">
        <strong>Record ID:</strong> ${record.id}
      </div>
      <div class="detail-row">
        <strong>A-Party:</strong> ${record.a_party}
      </div>
      <div class="detail-row">
        <strong>B-Party:</strong> ${record.b_party}
      </div>
      <div class="detail-row">
        <strong>Communication Type:</strong> 
        <span class="status status--info">${record.communication_type}</span>
      </div>
      <div class="detail-row">
        <strong>Timestamp:</strong> ${formatDateTime(record.timestamp)}
      </div>
      <div class="detail-row">
        <strong>Duration:</strong> ${formatDuration(record.duration)}
      </div>
      <div class="detail-row">
        <strong>Location:</strong> ${record.location}
      </div>
      <div class="detail-row">
        <strong>Method:</strong> ${record.method}
      </div>
      <div class="record-actions" style="margin-top: 20px;">
        <button class="btn btn--primary btn--sm" onclick="addToCase('${record.id}')">Add to Case</button>
        <button class="btn btn--secondary btn--sm" onclick="flagAsSuspicious('${record.id}')">Flag as Suspicious</button>
      </div>
    </div>
  `;

  showModal('record-modal');
}

// Search Functionality
function initializeSearchFunctionality() {
  const searchBtn = document.getElementById('search-btn');
  const quickSearchInput = document.getElementById('quick-search');
  const exportBtn = document.getElementById('export-btn');

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performQuickSearch(this.value);
      }
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportResults);
  }
}

function performSearch() {
  // Simulate search functionality
  const resultsCount = Math.floor(Math.random() * 500) + 100;
  const resultsHeader = document.querySelector('.results-header h3');
  if (resultsHeader) {
    resultsHeader.textContent = `Search Results (${resultsCount} records found)`;
  }
  
  showNotification('Search completed successfully', 'success');
}

function performQuickSearch(query) {
  if (!query.trim()) return;
  
  // Switch to search tab and perform search
  const searchTab = document.querySelector('[data-tab="search"]');
  const searchInput = document.querySelector('.search-form input[type="text"]');
  
  if (searchTab && searchInput) {
    searchTab.click();
    searchInput.value = query;
    setTimeout(performSearch, 100);
  }
}

function exportResults() {
  // Simulate export functionality
  showNotification('Results exported successfully', 'success');
  
  // Create a simple CSV export
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Record ID,A-Party,B-Party,App Type,Timestamp,Duration,Location\n" +
    appData.sample_relationships.map(record => 
      `${record.id},${record.a_party},${record.b_party},${record.communication_type},${record.timestamp},${record.duration},${record.location}`
    ).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ipdr_search_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Network Visualization
function initializeNetworkVisualization() {
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const resetViewBtn = document.getElementById('reset-view');
  const timelineRange = document.getElementById('timeline-range');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      showNotification('Zoomed in', 'info');
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      showNotification('Zoomed out', 'info');
    });
  }

  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      showNotification('View reset to default', 'info');
      if (timelineRange) {
        timelineRange.value = 30;
      }
    });
  }

  if (timelineRange) {
    timelineRange.addEventListener('input', function() {
      const days = this.value;
      showNotification(`Filtering to last ${days} days`, 'info');
    });
  }

  // Simulate network node selection
  const networkViz = document.getElementById('network-viz');
  if (networkViz) {
    networkViz.addEventListener('click', simulateNodeSelection);
  }
}

function simulateNodeSelection(event) {
  const nodeDetails = document.getElementById('node-details');
  if (!nodeDetails) return;

  const mockNodeData = {
    msisdn: '917280305443',
    connections: 15,
    totalDuration: '2h 45m',
    suspiciousActivity: 'High night activity detected',
    lastActivity: '2025-08-27 14:30'
  };

  nodeDetails.innerHTML = `
    <div class="node-info">
      <h4>Node Information</h4>
      <div class="detail-row">
        <strong>MSISDN:</strong> ${mockNodeData.msisdn}
      </div>
      <div class="detail-row">
        <strong>Connections:</strong> ${mockNodeData.connections}
      </div>
      <div class="detail-row">
        <strong>Total Duration:</strong> ${mockNodeData.totalDuration}
      </div>
      <div class="detail-row">
        <strong>Last Activity:</strong> ${mockNodeData.lastActivity}
      </div>
      <div class="detail-row">
        <strong>Status:</strong> 
        <span class="status status--warning">Suspicious</span>
      </div>
      <div class="detail-row">
        <strong>Alert:</strong> ${mockNodeData.suspiciousActivity}
      </div>
    </div>
  `;
}

// Case Management
function initializeCaseManagement() {
  // Case action buttons
  document.querySelectorAll('.case-actions .btn').forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.trim();
      const caseCard = this.closest('.case-card');
      const caseTitle = caseCard.querySelector('h4').textContent;
      
      if (action === 'View Case') {
        showNotification(`Opening case: ${caseTitle}`, 'info');
      } else if (action === 'Generate Report') {
        showNotification(`Generating report for: ${caseTitle}`, 'success');
      }
    });
  });

  // Alert action buttons
  document.querySelectorAll('.alert-actions .btn').forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.trim();
      const alertCard = this.closest('.alert-card');
      const alertType = alertCard.querySelector('h4').textContent;
      
      if (action === 'Investigate') {
        showNotification(`Starting investigation for: ${alertType}`, 'warning');
      } else if (action === 'Details') {
        showNotification(`Showing details for: ${alertType}`, 'info');
      }
    });
  });
}

function handleNewCaseSubmission(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const caseData = Object.fromEntries(formData);
  
  // Simulate case creation
  showNotification('New case created successfully', 'success');
  hideModal('new-case-modal');
  
  // Reset form
  event.target.reset();
}

// Filters
function initializeFilters() {
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const filterType = this.dataset.filter;
      this.classList.toggle('active');
      applyFilter(filterType, this.classList.contains('active'));
    });
  });
}

function applyFilter(filterType, isActive) {
  const message = isActive ? `Applied ${filterType} filter` : `Removed ${filterType} filter`;
  showNotification(message, 'info');
}

// Utility Functions
function updateDashboardStats() {
  const stats = {
    'total-records': appData.summary.total_records.toLocaleString(),
    'unique-users': appData.summary.unique_users.toString(),
    'active-cases': appData.summary.active_investigations.toString(),
    'suspicious-patterns': appData.summary.suspicious_patterns.toString()
  };

  Object.entries(stats).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: var(--space-12) var(--space-16);
    box-shadow: var(--shadow-lg);
    z-index: 1100;
    min-width: 300px;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    animation: slideInRight 0.3s ease-out;
  `;

  // Add type-specific styling
  const typeColors = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)'
  };

  notification.style.borderLeftColor = typeColors[type] || typeColors.info;
  notification.style.borderLeftWidth = '4px';

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: var(--space-8);">
      <span>${getNotificationIcon(type)}</span>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: var(--font-size-lg);
      ">&times;</button>
    </div>
  `;

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  return icons[type] || icons.info;
}

// Global functions for inline event handlers
window.addToCase = function(recordId) {
  showNotification(`Record ${recordId} added to active case`, 'success');
  hideModal('record-modal');
};

window.flagAsSuspicious = function(recordId) {
  showNotification(`Record ${recordId} flagged as suspicious`, 'warning');
  hideModal('record-modal');
};