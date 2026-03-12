// Configuration
const CONFIG = {
  roles: [
    { id: 'founder', label: '👑 Founder', color: '#FFD700' },
    { id: 'moderator', label: '🛡️ Moderator', color: '#4CAF50' },
    { id: 'contributor', label: '💎 Contributor', color: '#2196F3' },
    { id: 'early', label: '🚀 Early Adopter', color: '#9C27B0' },
    { id: 'validator', label: '✅ Validator', color: '#FF9800' },
    { id: 'ambassador', label: '🌟 Ambassador', color: '#E91E63' },
    { id: 'dev', label: '🔧 Developer', color: '#607D8B' },
    { id: 'community', label: '💬 Community', color: '#00BCD4' }
  ],
  cardPrefix: 'ORO'
};

// DOM Elements
const elements = {
  avatarInput: document.getElementById('avatarInput'),
  avatarPreview: document.getElementById('avatarPreview'),
  username: document.getElementById('username'),
  joinDate: document.getElementById('joinDate'),
  rolesContainer: document.getElementById('rolesContainer'),
  qrInput: document.getElementById('qrInput'),
  qrPreview: document.getElementById('qrPreview'),
  generateBtn: document.getElementById('generateBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  
  // Card elements
  cardAvatar: document.getElementById('cardAvatar'),
  cardUsername: document.getElementById('cardUsername'),
  cardJoinDate: document.getElementById('cardJoinDate'),
  cardRoles: document.getElementById('cardRoles'),
  cardQR: document.getElementById('cardQR'),
  cardId: document.getElementById('cardId')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderRoles();
  setupEventListeners();
  generateCardId();
});

// Render role checkboxes
function renderRoles() {
  elements.rolesContainer.innerHTML = CONFIG.roles.map(role => `
    <label class="role-checkbox">
      <input type="checkbox" value="${role.id}" data-label="${role.label}" data-color="${role.color}" />
      <span style="color: ${role.color}">${role.label}</span>
    </label>
  `).join('');
}

// Setup event listeners
function setupEventListeners() {
  // Avatar upload
  elements.avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        elements.avatarPreview.querySelector('img').src = event.target.result;
        elements.cardAvatar.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Username input
  elements.username.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    elements.cardUsername.textContent = value ? `@${value}` : '@username';
  });

  // Join date selection
  elements.joinDate.addEventListener('change', (e) => {
    const date = new Date(e.target.value);
    elements.cardJoinDate.textContent = !isNaN(date) 
      ? `Joined: ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
      : 'Joined: —';
  });

  // Role selection
  elements.rolesContainer.addEventListener('change', updateCardRoles);

  // QR upload
  elements.qrInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        elements.qrPreview.querySelector('img').src = event.target.result;
        elements.cardQR.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Generate card
  elements.generateBtn.addEventListener('click', generateCard);
  
  // Download (placeholder - requires html2canvas)
  elements.downloadBtn.addEventListener('click', downloadCard);
}

// Update roles display on card
function updateCardRoles() {
  const checked = elements.rolesContainer.querySelectorAll('input:checked');
  const rolesList = elements.cardRoles;
  
  if (checked.length === 0) {
    rolesList.innerHTML = '<span class="role-tag empty">Select roles</span>';
    return;
  }
  
  rolesList.innerHTML = Array.from(checked).map(input => {
    const label = input.dataset.label;
    const color = input.dataset.color;
    return `<span class="role-tag" style="border-color: ${color}33; color: ${color}">${label}</span>`;
  }).join('');
}

// Generate unique card ID
function generateCardId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  elements.cardId.textContent = `#${CONFIG.cardPrefix}-${num}`;
}

// Main card generation
function generateCard() {
  // Validation
  if (!elements.username.value.trim()) {
    alert('Please enter a Discord username');
    return;
  }
  
  // Update display
  elements.cardUsername.textContent = `@${elements.username.value.trim()}`;
  
  const date = new Date(elements.joinDate.value);
  elements.cardJoinDate.textContent = !isNaN(date)
    ? `Joined: ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : 'Joined: —';
  
  updateCardRoles();
  
  // Enable download button
  elements.downloadBtn.disabled = false;
  
  // "Refresh" animation
  const card = document.getElementById('discordCard');
  card.style.transform = 'scale(0.98)';
  setTimeout(() => {
    card.style.transform = 'scale(1)';
    card.style.boxShadow = '0 0 60px rgba(255, 165, 0, 0.4), 0 20px 60px rgba(0,0,0,0.6)';
    setTimeout(() => {
      card.style.boxShadow = '';
    }, 300);
  }, 100);
}

// Download card as PNG (requires html2canvas)
async function downloadCard() {
  if (typeof html2canvas === 'undefined') {
    alert('To enable downloads, include html2canvas: https://html2canvas.hertzen.com');
    return;
  }
  
  try {
    const card = document.getElementById('discordCard');
    const canvas = await html2canvas(card, {
      scale: 2,
      backgroundColor: null,
      useCORS: true
    });
    
    const link = document.createElement('a');
    link.download = `oro-card-${elements.username.value || 'member'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Generation error:', err);
    alert('Failed to create image. Check console for details.');
  }
}
