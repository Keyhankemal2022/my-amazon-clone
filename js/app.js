document.addEventListener('DOMContentLoaded', () => {
  // LOGIN FORM
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const msg = document.getElementById('message') || document.getElementById('loginMessage');
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (data.success) {
          msg.innerHTML = '<div style="color:#00A651;padding:15px;border-radius:4px;background:#D4F4E2;">Success! Redirecting...</div>';
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 1000);
        } else {
          msg.innerHTML = `<div style="color:#C70039;padding:15px;border-radius:4px;background:#FFE6E6;">${data.error}</div>`;
        }
      } catch (err) {
        msg.innerHTML = '<div style="color:#C70039;padding:15px;border-radius:4px;background:#FFE6E6;">Network error. Try again.</div>';
      }
    });
  }
  
  // REGISTER FORM
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const msg = document.getElementById('registerMessage');
      
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        
        if (data.success) {
          msg.innerHTML = '<div style="color:#00A651;padding:15px;border-radius:4px;background:#D4F4E2;">Account created! Please log in.</div>';
          setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
          msg.innerHTML = `<div style="color:#C70039;padding:15px;border-radius:4px;background:#FFE6E6;">${data.error}</div>`;
        }
      } catch (err) {
        msg.innerHTML = '<div style="color:#C70039;padding:15px;border-radius:4px;background:#FFE6E6;">Network error. Try again.</div>';
      }
    });
  }
  
  // DASHBOARD STATS
  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const stats = await response.json();
      document.getElementById('totalUsers')?.textContent = stats.totalUsers;
      document.getElementById('activeUsers')?.textContent = stats.activeUsers;
    } catch (err) {
      console.error('Stats load failed');
    }
  };
  
  // Load stats on dashboard pages
  if (window.location.pathname.includes('dashboard')) {
    loadStats();
    setInterval(loadStats, 30000); // Refresh every 30s
  }
  
  // LOGOUT
  window.logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  };
});