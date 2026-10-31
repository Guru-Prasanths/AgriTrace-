/**
 * AgriTrace Role-Based Authentication & Reward Points Client
 *
 * Implements:
 * - Separate Farmer and Seller Portals.
 * - One Gmail / Email = One Account = One Role enforcement.
 * - Portal mismatch detection & helpful guidance.
 * - Authoritative Database-Backed Reward Points Dashboard & History.
 * - Completed Order Points & Controlled Reversals.
 * - Admin Configuration Modal with 24h Daily Scheduler Trigger.
 */

(function () {
  const AUTH_API = (typeof API_BASE !== "undefined" ? API_BASE : (window.API_BASE || "http://127.0.0.1:4001/api"));
  const TOKEN_KEY = "agritrace_jwt_token";

  let currentUser = null;
  let currentToken = localStorage.getItem(TOKEN_KEY) || null;

  // Helper: authenticated fetch
  async function apiRequest(endpoint, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    try {
      const res = await fetch(`${AUTH_API}${endpoint}`, {
        ...options,
        headers,
        body: options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      console.warn(`[api warning] ${endpoint} request failed:`, err.message);
      return { ok: false, status: 0, data: { error: "Network error", message: err.message } };
    }
  }

  // Toast / notification helper
  function notify(msg, type = "success") {
    if (typeof showToast === "function") {
      showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // Initialize Auth State on load
  async function initAuth() {
    if (currentToken) {
      const res = await apiRequest("/auth/profile");
      if (res.ok && res.data.user) {
        currentUser = res.data.user;
      } else {
        // Token expired or invalid
        currentToken = null;
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    updateNavAuthIndicator();
    renderFarmerPortal();
    renderSellerPortal();
  }

  // Update navbar indicator
  function updateNavAuthIndicator() {
    const badge = document.getElementById("userAuthBadge");
    const nameEl = document.getElementById("userAuthName");
    const ptsEl = document.getElementById("userAuthPointsBadge");
    const iconEl = document.getElementById("userAuthRoleIcon");

    if (!badge) return;

    if (currentUser) {
      badge.style.display = "inline-flex";
      if (nameEl) nameEl.textContent = currentUser.name.split(" ")[0] || currentUser.email;
      if (ptsEl) ptsEl.textContent = `${Number(currentUser.points_balance || 0)} PTS`;
      if (iconEl) iconEl.textContent = currentUser.role === "farmer" ? "👨‍🌾" : (currentUser.role === "seller" ? "🏪" : "🛡️");
      badge.onclick = () => {
        if (currentUser.role === "farmer") {
          if (typeof navigateToSection === "function") navigateToSection("#farmer");
        } else if (currentUser.role === "seller") {
          if (typeof navigateToSection === "function") navigateToSection("#seller");
        } else {
          openAdminModal();
        }
      };
    } else {
      badge.style.display = "none";
    }
  }

  // Logout handler
  window.agriLogout = async function () {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (_) {}
    currentUser = null;
    currentToken = null;
    localStorage.removeItem(TOKEN_KEY);
    notify("Logged out successfully.", "info");
    updateNavAuthIndicator();
    renderFarmerPortal();
    renderSellerPortal();
  };

  // Google OAuth Client Configuration & Handlers
  let googleClientId = null;
  let googleConfigChecked = false;

  async function fetchGoogleConfig() {
    if (googleConfigChecked) return googleClientId;
    try {
      const res = await apiRequest("/auth/google/config");
      if (res.ok && res.data && res.data.clientId) {
        googleClientId = res.data.clientId;
      }
    } catch (e) {
      console.warn("[google-auth] Config fetch notice:", e.message);
    }
    googleConfigChecked = true;
    return googleClientId;
  }

  function renderGoogleAuthButtonHtml(portalRole, isSignUp) {
    return `
      <div class="google-auth-container">
        <div class="auth-divider"><span>OR</span></div>
        <button type="button" class="google-auth-btn" onclick="triggerGoogleAuth('${portalRole}', ${isSignUp ? 'true' : 'false'})" aria-label="Continue with Google">
          <svg class="google-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
        <div id="${portalRole}${isSignUp ? 'Signup' : 'Login'}GoogleBtnHidden" style="display:none;"></div>
      </div>
    `;
  }

  // Handle Google Credential Response from GIS
  window.handleGoogleAuthResponse = async function (response, portalRole, isSignUp) {
    if (!response || !response.credential) {
      notify("Google sign-in was cancelled or did not return credentials.", "warning");
      return;
    }

    const errorElId = `${portalRole}${isSignUp ? 'Signup' : 'Login'}Error`;
    const errorEl = document.getElementById(errorElId);
    if (errorEl) errorEl.style.display = "none";

    notify("Verifying Google account with AgriTrace...", "info");

    const res = await apiRequest("/auth/google", {
      method: "POST",
      body: {
        credential: response.credential,
        portalRole: portalRole
      }
    });

    if (res.ok && res.data && res.data.token) {
      currentToken = res.data.token;
      localStorage.setItem(TOKEN_KEY, currentToken);
      currentUser = res.data.user;
      notify(res.data.isNewUser 
        ? `Welcome to AgriTrace, ${currentUser.name}! Registered as a verified ${currentUser.role.toUpperCase()}.`
        : `Welcome back, ${currentUser.name}! Signed in as ${currentUser.role.toUpperCase()}.`, 
        "success"
      );
      updateNavAuthIndicator();
      renderFarmerPortal();
      renderSellerPortal();
      if (portalRole === "farmer" && typeof navigateToSection === "function") {
        navigateToSection("#farmer");
      } else if (portalRole === "seller" && typeof navigateToSection === "function") {
        navigateToSection("#seller");
      }
    } else {
      const msg = (res.data && (res.data.message || res.data.error)) || "Google authentication failed";
      if (res.status === 403 && res.data && res.data.correctPortal) {
        const targetPortal = res.data.correctPortal;
        const targetSection = targetPortal === "farmer" ? "#farmer" : "#seller";
        const targetLabel = targetPortal === "farmer" ? "Farmer Portal" : "Seller Portal";

        const mismatchHtml = `
          <div style="font-weight:700;margin-bottom:6px;">⚠️ Portal Role Mismatch</div>
          <div>${msg}</div>
          <div style="margin-top:10px;">
            <button type="button" class="primary-button" style="padding:6px 14px;font-size:12px;" onclick="navigateToSection('${targetSection}')">
              Go to ${targetLabel} ➔
            </button>
          </div>
        `;
        if (errorEl) {
          errorEl.innerHTML = mismatchHtml;
          errorEl.style.display = "block";
        } else {
          notify(msg, "error");
        }
      } else {
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.style.display = "block";
        } else {
          notify(msg, "error");
        }
      }
    }
  };

  // Dev Mode Simulated Google Auth Helper (for local testing before Google Cloud OAuth is provisioned)
  window.promptDevGoogleAuth = function (portalRole, isSignUp) {
    const defaultEmail = portalRole === 'farmer' ? 'guru.farmer@gmail.com' : 'guru.seller@gmail.com';
    const email = window.prompt(`[Dev Simulation] Enter a Gmail address for Google Authentication (${portalRole.toUpperCase()} portal):`, defaultEmail);
    if (!email || !email.trim()) return;

    const devPayload = {
      sub: `dev-google-${Date.now()}`,
      email: email.trim(),
      name: `${portalRole.charAt(0).toUpperCase() + portalRole.slice(1)} Google User`,
      picture: "https://lh3.googleusercontent.com/a/default-user",
      email_verified: true
    };
    const devToken = "dev-mock-google-token:" + btoa(unescape(encodeURIComponent(JSON.stringify(devPayload))));
    window.handleGoogleAuthResponse({ credential: devToken }, portalRole, isSignUp);
  };

  // Trigger Google Sign-In Flow
  window.triggerGoogleAuth = async function (portalRole, isSignUp) {
    const clientId = await fetchGoogleConfig();

    if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
      const errorElId = `${portalRole}${isSignUp ? 'Signup' : 'Login'}Error`;
      const errorEl = document.getElementById(errorElId);
      if (errorEl) {
        errorEl.innerHTML = `
          <div style="text-align:left;line-height:1.5;">
            <div style="font-weight:700;color:#fbbf24;margin-bottom:6px;">⚠️ Google Sign-In Setup Notice</div>
            <p style="margin:0 0 6px 0;font-size:12px;color:#e2e8f0;">
              Live Google Sign-In requires your Google Cloud OAuth Client ID in <code>.env</code>:
            </p>
            <pre style="background:rgba(0,0,0,0.4);padding:5px 8px;border-radius:6px;font-family:monospace;font-size:11px;color:#38bdf8;margin:0 0 8px 0;user-select:all;">GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com</pre>
            <button type="button" class="small-button" style="background:#10b981;color:#000;font-weight:700;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;" onclick="promptDevGoogleAuth('${portalRole}', ${isSignUp ? 'true' : 'false'})">
              ⚡ Quick Test with Simulated Google Account (Dev Mode)
            </button>
          </div>
        `;
        errorEl.style.display = "block";
      }
      return;
    }

    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp) => window.handleGoogleAuthResponse(resp, portalRole, isSignUp),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Prompt One-Tap / native dialog
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const containerId = `${portalRole}${isSignUp ? 'Signup' : 'Login'}GoogleBtnHidden`;
          const hiddenContainer = document.getElementById(containerId);
          if (hiddenContainer) {
            hiddenContainer.innerHTML = "";
            window.google.accounts.id.renderButton(hiddenContainer, {
              theme: "outline",
              size: "large",
              type: "standard"
            });
            const btn = hiddenContainer.querySelector("div[role=button]") || hiddenContainer.querySelector("button");
            if (btn) btn.click();
          }
        }
      });
    } else {
      notify("Google Identity Services library is loading. Please verify internet connection or try again shortly.", "info");
    }
  };

  // Switch between Login and Signup tabs
  window.switchAuthTab = function (portal, tab) {
    const loginForm = document.getElementById(`${portal}LoginForm`);
    const signupForm = document.getElementById(`${portal}SignupForm`);
    const tabLoginBtn = document.getElementById(`${portal}TabLogin`);
    const tabSignupBtn = document.getElementById(`${portal}TabSignup`);

    if (tab === "login") {
      if (loginForm) loginForm.style.display = "block";
      if (signupForm) signupForm.style.display = "none";
      if (tabLoginBtn) tabLoginBtn.classList.add("active");
      if (tabSignupBtn) tabSignupBtn.classList.remove("active");
    } else {
      if (loginForm) loginForm.style.display = "none";
      if (signupForm) signupForm.style.display = "block";
      if (tabLoginBtn) tabLoginBtn.classList.remove("active");
      if (tabSignupBtn) tabSignupBtn.classList.add("active");
    }
  };

  // Handle Login submission
  window.handlePortalLogin = async function (e, portalRole) {
    e.preventDefault();
    const email = document.getElementById(`${portalRole}LoginEmail`).value.trim();
    const password = document.getElementById(`${portalRole}LoginPassword`).value;
    const errorEl = document.getElementById(`${portalRole}LoginError`);

    if (errorEl) errorEl.style.display = "none";

    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password, portalRole }
    });

    if (res.ok && res.data.token) {
      currentToken = res.data.token;
      localStorage.setItem(TOKEN_KEY, currentToken);
      currentUser = res.data.user;
      notify(`Welcome back, ${currentUser.name}!`, "success");
      updateNavAuthIndicator();
      renderFarmerPortal();
      renderSellerPortal();
    } else {
      const msg = res.data.message || res.data.error || "Login failed";
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = "block";
      } else {
        notify(msg, "error");
      }
    }
  };

  // Handle Signup submission
  window.handlePortalSignup = async function (e, portalRole) {
    e.preventDefault();
    const name = document.getElementById(`${portalRole}SignupName`).value.trim();
    const email = document.getElementById(`${portalRole}SignupEmail`).value.trim();
    const password = document.getElementById(`${portalRole}SignupPassword`).value;
    const location = document.getElementById(`${portalRole}SignupLocation`) ? document.getElementById(`${portalRole}SignupLocation`).value.trim() : null;
    const errorEl = document.getElementById(`${portalRole}SignupError`);

    if (errorEl) errorEl.style.display = "none";

    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password, role: portalRole, location }
    });

    if (res.ok && res.data.token) {
      currentToken = res.data.token;
      localStorage.setItem(TOKEN_KEY, currentToken);
      currentUser = res.data.user;
      notify(`Account created successfully! Welcome to AgriTrace, ${currentUser.name}.`, "success");
      updateNavAuthIndicator();
      renderFarmerPortal();
      renderSellerPortal();
    } else {
      const msg = res.data.message || res.data.error || "Registration failed";
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.style.display = "block";
      } else {
        notify(msg, "error");
      }
    }
  };

  // =========================================================
  // FARMER PORTAL RENDERING
  // =========================================================
  async function renderFarmerPortal() {
    const farmerSection = document.getElementById("farmer");
    if (!farmerSection) return;

    let authWrapper = document.getElementById("farmerAuthContainer");
    let dashWrapper = document.getElementById("farmerDashboardContainer");

    // Create wrappers if not yet in DOM
    if (!authWrapper) {
      authWrapper = document.createElement("div");
      authWrapper.id = "farmerAuthContainer";
      const header = farmerSection.querySelector(".section-header");
      if (header && header.nextSibling) {
        farmerSection.insertBefore(authWrapper, header.nextSibling);
      } else {
        farmerSection.prepend(authWrapper);
      }
    }

    if (!dashWrapper) {
      dashWrapper = document.createElement("div");
      dashWrapper.id = "farmerDashboardContainer";
      const twoCol = farmerSection.querySelector(".two-column-layout");
      if (twoCol) {
        twoCol.parentNode.insertBefore(dashWrapper, twoCol);
      }
    }

    // CASE 1: Logged in as a SELLER viewing Farmer portal
    if (currentUser && currentUser.role === "seller") {
      authWrapper.style.display = "block";
      authWrapper.innerHTML = `
        <div class="role-mismatch-banner">
          <h4>⚠️ Portal Mismatch: You are logged in as a Seller</h4>
          <p>Your current account (<strong>${currentUser.email}</strong>) is registered with the <strong>SELLER</strong> role. In AgriTrace, each account holds exactly one role.</p>
          <div class="role-mismatch-actions">
            <button class="primary-button" onclick="navigateToSection('#seller')">Go to Seller Marketplace →</button>
            <button class="small-button" onclick="agriLogout()">Log Out</button>
          </div>
        </div>
      `;
      hideFarmerDashElements(true);
      return;
    }

    // CASE 2: Not logged in
    if (!currentUser || currentUser.role !== "farmer") {
      authWrapper.style.display = "block";
      authWrapper.innerHTML = `
        <div class="role-auth-card">
          <div style="text-align:center;margin-bottom:16px;">
            <span style="font-size:36px;">👨‍🌾</span>
            <h3>Farmer Portal Authentication</h3>
            <p>Access your produce inventory, manage buyer offers, and earn 24-hour daily reward points.</p>
          </div>

          <div class="auth-tab-row">
            <button id="farmerTabLogin" class="auth-tab-btn active" type="button" onclick="switchAuthTab('farmer', 'login')">Farmer Login</button>
            <button id="farmerTabSignup" class="auth-tab-btn" type="button" onclick="switchAuthTab('farmer', 'signup')">Create Farmer Account</button>
          </div>

          <!-- Login Form -->
          <form id="farmerLoginForm" onsubmit="handlePortalLogin(event, 'farmer')">
            <div id="farmerLoginError" style="display:none; color:#f87171; background:rgba(239,68,68,0.15); padding:10px; border-radius:8px; margin-bottom:14px; font-size:13px;"></div>
            <div class="auth-form-group">
              <label>Farmer Gmail / Email</label>
              <input type="email" id="farmerLoginEmail" placeholder="e.g. farmer@agritrace.io" required />
            </div>
            <div class="auth-form-group">
              <label>Password</label>
              <input type="password" id="farmerLoginPassword" placeholder="••••••••" required />
            </div>
            <button type="submit" class="auth-submit-btn">LOGIN TO FARMER DASHBOARD ➔</button>
            ${renderGoogleAuthButtonHtml('farmer', false)}
          </form>

          <!-- Signup Form -->
          <form id="farmerSignupForm" style="display:none;" onsubmit="handlePortalSignup(event, 'farmer')">
            <div id="farmerSignupError" style="display:none; color:#f87171; background:rgba(239,68,68,0.15); padding:10px; border-radius:8px; margin-bottom:14px; font-size:13px;"></div>
            <div class="auth-form-group">
              <label>Full Farmer Name / Farm Title</label>
              <input type="text" id="farmerSignupName" placeholder="e.g. Rajan K." required />
            </div>
            <div class="auth-form-group">
              <label>Gmail / Email (1 Email = 1 Role)</label>
              <input type="email" id="farmerSignupEmail" placeholder="e.g. rajan.farm@gmail.com" required />
            </div>
            <div class="auth-form-group">
              <label>Farm Location / Region</label>
              <input type="text" id="farmerSignupLocation" placeholder="e.g. Salem, Tamil Nadu" required />
            </div>
            <div class="auth-form-group">
              <label>Password (Min. 6 characters)</label>
              <input type="password" id="farmerSignupPassword" placeholder="••••••••" minlength="6" required />
            </div>
            <button type="submit" class="auth-submit-btn">REGISTER AS FARMER ➔</button>
            ${renderGoogleAuthButtonHtml('farmer', true)}
          </form>

          <div class="portal-switch-prompt">
            Are you a wholesale buyer or trader?
            <span class="portal-switch-link" onclick="navigateToSection('#seller')">Switch to Seller Portal ➔</span>
          </div>
        </div>
      `;
      hideFarmerDashElements(true);
      return;
    }

    // CASE 3: Authenticated as Farmer
    authWrapper.style.display = "none";
    hideFarmerDashElements(false);

    // Fetch authoritative rewards summary directly from backend DB
    const rewRes = await apiRequest("/rewards/dashboard");
    const summary = rewRes.ok ? rewRes.data : {
      currentBalance: currentUser.points_balance || 0,
      totalEarned: currentUser.total_points_earned || 0,
      orderPoints: 0,
      dailyPoints: 0,
      recentTransactions: [],
      nextScheduledRewardTime: new Date(Date.now() + 86400000).toISOString()
    };

    // Render Farmer Bar & Rewards Section
    dashWrapper.innerHTML = `
      <div class="portal-profile-bar">
        <div class="portal-user-meta">
          <span style="font-size:28px;">${currentUser.picture_url ? `<img src="${currentUser.picture_url}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #4ade80;" alt="${currentUser.name}">` : '👨‍🌾'}</span>
          <div>
            <div style="font-size:16px;font-weight:700;color:#fff;">${currentUser.name} <span class="portal-role-pill farmer">FARMER ACCOUNT</span> ${currentUser.auth_provider === 'google' || currentUser.auth_provider === 'both' ? '<span style="background:rgba(66,133,244,0.25);color:#93c5fd;padding:2px 6px;border-radius:4px;font-size:10px;margin-left:6px;font-weight:700;">Google Verified</span>' : ''}</div>
            <div style="font-size:12px;color:#8ca395;">${currentUser.email} &nbsp;•&nbsp; 📍 ${currentUser.location || "Tamil Nadu, India"} &nbsp;•&nbsp; <span style="color:#4ade80;">● ACTIVE & VERIFIED</span></div>
          </div>
        </div>
        <button class="small-button" onclick="agriLogout()" style="background:rgba(239,68,68,0.2);color:#fca5a5;border-color:rgba(239,68,68,0.4);">Log Out</button>
      </div>

      <!-- Authoritative Reward Points Dashboard -->
      <div class="rewards-dashboard-card">
        <div class="rewards-header-row">
          <div>
            <span style="font-size:11px;color:#4ade80;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Authoritative Rewards Ledger</span>
            <div class="rewards-balance-hero">
              <span class="balance-number">${Number(summary.currentBalance).toLocaleString()}</span>
              <span class="balance-unit">POINTS BALANCE</span>
            </div>
          </div>
          <button class="small-button" onclick="renderFarmerPortal()">↻ Refresh Balance</button>
        </div>

        <div class="rewards-metric-grid">
          <div class="reward-stat-box">
            <div class="reward-stat-label">Total Points Earned</div>
            <div class="reward-stat-val" style="color:#38bdf8;">+${Number(summary.totalEarned).toLocaleString()}</div>
          </div>
          <div class="reward-stat-box">
            <div class="reward-stat-label">From Completed Orders</div>
            <div class="reward-stat-val" style="color:#4ade80;">+${Number(summary.orderPoints).toLocaleString()}</div>
          </div>
          <div class="reward-stat-box">
            <div class="reward-stat-label">From 24h Daily Rewards</div>
            <div class="reward-stat-val" style="color:#fbbf24;">+${Number(summary.dailyPoints).toLocaleString()}</div>
          </div>
        </div>

        <div class="reward-schedule-callout">
          <span>⏰ <strong>Automatic 24-Hour Daily Rewards:</strong> Active. Next scheduled grant: <strong>${new Date(summary.nextScheduledRewardTime).toUTCString()}</strong></span>
          <span style="background:rgba(16,185,129,0.25);padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;">✓ ELIGIBLE</span>
        </div>

        <h4 style="font-size:14px;color:#fff;margin-bottom:12px;">Recent Points Activity</h4>
        <div class="tx-table-container">
          <table class="tx-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Reason / Description</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              ${(summary.recentTransactions && summary.recentTransactions.length > 0)
                ? summary.recentTransactions.map(t => `
                  <tr>
                    <td>${new Date(t.created_at).toLocaleString()}</td>
                    <td><span style="text-transform:capitalize;color:#94a3b8;">${t.transaction_type.replace('_', ' ')}</span></td>
                    <td>${t.reason}</td>
                    <td>
                      <span class="tx-points-pill ${Number(t.points) >= 0 ? 'positive' : 'negative'}">
                        ${Number(t.points) >= 0 ? '+' : ''}${t.points} PTS
                      </span>
                    </td>
                  </tr>
                `).join('')
                : `<tr><td colspan="4" style="text-align:center;color:#64748b;padding:16px;">No points transactions yet. Complete orders or receive daily rewards to earn points.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Also update existing Farmer Info widget if present
    const farmerInfo = document.getElementById("farmerInfo");
    if (farmerInfo) {
      farmerInfo.innerHTML = `
        <div class="dash-profile">
          <div class="dash-avatar">👨‍🌾</div>
          <div class="dash-profile-info">
            <div class="dash-name">${currentUser.name}</div>
            <div class="dash-id">${currentUser.email}</div>
            <div class="dash-location">📍 ${currentUser.location || "Salem, Tamil Nadu"}</div>
            <div class="dash-meta"><span>⭐ 4.9/5.0</span><span>Verified Farmer Account</span></div>
          </div>
        </div>
      `;
    }
  }

  function hideFarmerDashElements(hide) {
    const farmerSection = document.getElementById("farmer");
    if (!farmerSection) return;
    const cards = farmerSection.querySelectorAll(".two-column-layout, .glass-card:not(.role-auth-card)");
    cards.forEach(c => {
      c.style.display = hide ? "none" : "";
    });
  }

  // =========================================================
  // SELLER PORTAL RENDERING
  // =========================================================
  async function renderSellerPortal() {
    const sellerSection = document.getElementById("seller");
    if (!sellerSection) return;

    let authWrapper = document.getElementById("sellerAuthContainer");
    let dashWrapper = document.getElementById("sellerDashboardContainer");

    if (!authWrapper) {
      authWrapper = document.createElement("div");
      authWrapper.id = "sellerAuthContainer";
      const header = sellerSection.querySelector(".section-header");
      if (header && header.nextSibling) {
        sellerSection.insertBefore(authWrapper, header.nextSibling);
      } else {
        sellerSection.prepend(authWrapper);
      }
    }

    if (!dashWrapper) {
      dashWrapper = document.createElement("div");
      dashWrapper.id = "sellerDashboardContainer";
      const controls = sellerSection.querySelector(".marketplace-controls");
      if (controls) {
        controls.parentNode.insertBefore(dashWrapper, controls);
      }
    }

    // CASE 1: Logged in as a FARMER viewing Seller portal
    if (currentUser && currentUser.role === "farmer") {
      authWrapper.style.display = "block";
      authWrapper.innerHTML = `
        <div class="role-mismatch-banner">
          <h4>⚠️ Portal Mismatch: You are logged in as a Farmer</h4>
          <p>Your current account (<strong>${currentUser.email}</strong>) is registered with the <strong>FARMER</strong> role. In AgriTrace, an account holds one role.</p>
          <div class="role-mismatch-actions">
            <button class="primary-button" onclick="navigateToSection('#farmer')">Go to Farmer Portal →</button>
            <button class="small-button" onclick="agriLogout()">Log Out</button>
          </div>
        </div>
      `;
      hideSellerMarketplace(true);
      return;
    }

    // CASE 2: Not logged in
    if (!currentUser || currentUser.role !== "seller") {
      authWrapper.style.display = "block";
      authWrapper.innerHTML = `
        <div class="role-auth-card">
          <div style="text-align:center;margin-bottom:16px;">
            <span style="font-size:36px;">🏪</span>
            <h3>Seller Portal Authentication</h3>
            <p>Access wholesale produce listings, place verified purchase orders, and earn reward points on order completion.</p>
          </div>

          <div class="auth-tab-row">
            <button id="sellerTabLogin" class="auth-tab-btn active" type="button" onclick="switchAuthTab('seller', 'login')">Seller Login</button>
            <button id="sellerTabSignup" class="auth-tab-btn" type="button" onclick="switchAuthTab('seller', 'signup')">Create Seller Account</button>
          </div>

          <!-- Login Form -->
          <form id="sellerLoginForm" onsubmit="handlePortalLogin(event, 'seller')">
            <div id="sellerLoginError" style="display:none; color:#f87171; background:rgba(239,68,68,0.15); padding:10px; border-radius:8px; margin-bottom:14px; font-size:13px;"></div>
            <div class="auth-form-group">
              <label>Seller Gmail / Email</label>
              <input type="email" id="sellerLoginEmail" placeholder="e.g. seller@agritrace.io" required />
            </div>
            <div class="auth-form-group">
              <label>Password</label>
              <input type="password" id="sellerLoginPassword" placeholder="••••••••" required />
            </div>
            <button type="submit" class="auth-submit-btn">LOGIN TO SELLER DASHBOARD ➔</button>
            ${renderGoogleAuthButtonHtml('seller', false)}
          </form>

          <!-- Signup Form -->
          <form id="sellerSignupForm" style="display:none;" onsubmit="handlePortalSignup(event, 'seller')">
            <div id="sellerSignupError" style="display:none; color:#f87171; background:rgba(239,68,68,0.15); padding:10px; border-radius:8px; margin-bottom:14px; font-size:13px;"></div>
            <div class="auth-form-group">
              <label>Business / Trader Name</label>
              <input type="text" id="sellerSignupName" placeholder="e.g. Ramesh Traders" required />
            </div>
            <div class="auth-form-group">
              <label>Gmail / Email (1 Email = 1 Role)</label>
              <input type="email" id="sellerSignupEmail" placeholder="e.g. ramesh.traders@gmail.com" required />
            </div>
            <div class="auth-form-group">
              <label>Business Location</label>
              <input type="text" id="sellerSignupLocation" placeholder="e.g. Coimbatore, Tamil Nadu" required />
            </div>
            <div class="auth-form-group">
              <label>Password (Min. 6 characters)</label>
              <input type="password" id="sellerSignupPassword" placeholder="••••••••" minlength="6" required />
            </div>
            <button type="submit" class="auth-submit-btn">REGISTER AS SELLER ➔</button>
            ${renderGoogleAuthButtonHtml('seller', true)}
          </form>

          <div class="portal-switch-prompt">
            Are you a grower or farmer?
            <span class="portal-switch-link" onclick="navigateToSection('#farmer')">Switch to Farmer Portal ➔</span>
          </div>
        </div>
      `;
      hideSellerMarketplace(true);
      return;
    }

    // CASE 3: Authenticated as Seller
    authWrapper.style.display = "none";
    hideSellerMarketplace(false);

    const rewRes = await apiRequest("/rewards/dashboard");
    const summary = rewRes.ok ? rewRes.data : {
      currentBalance: currentUser.points_balance || 0,
      totalEarned: currentUser.total_points_earned || 0,
      orderPoints: 0,
      dailyPoints: 0,
      recentTransactions: [],
      nextScheduledRewardTime: new Date(Date.now() + 86400000).toISOString()
    };

    dashWrapper.innerHTML = `
      <div class="portal-profile-bar">
        <div class="portal-user-meta">
          <span style="font-size:28px;">${currentUser.picture_url ? `<img src="${currentUser.picture_url}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #60a5fa;" alt="${currentUser.name}">` : '🏪'}</span>
          <div>
            <div style="font-size:16px;font-weight:700;color:#fff;">${currentUser.name} <span class="portal-role-pill seller">SELLER ACCOUNT</span> ${currentUser.auth_provider === 'google' || currentUser.auth_provider === 'both' ? '<span style="background:rgba(66,133,244,0.25);color:#93c5fd;padding:2px 6px;border-radius:4px;font-size:10px;margin-left:6px;font-weight:700;">Google Verified</span>' : ''}</div>
            <div style="font-size:12px;color:#8ca395;">${currentUser.email} &nbsp;•&nbsp; 📍 ${currentUser.location || "Coimbatore, Tamil Nadu"} &nbsp;•&nbsp; <span style="color:#60a5fa;">● VERIFIED TRADER</span></div>
          </div>
        </div>
        <button class="small-button" onclick="agriLogout()" style="background:rgba(239,68,68,0.2);color:#fca5a5;border-color:rgba(239,68,68,0.4);">Log Out</button>
      </div>

      <!-- Authoritative Seller Reward Points Dashboard -->
      <div class="rewards-dashboard-card">
        <div class="rewards-header-row">
          <div>
            <span style="font-size:11px;color:#60a5fa;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Authoritative Rewards Ledger</span>
            <div class="rewards-balance-hero">
              <span class="balance-number" style="color:#60a5fa;">${Number(summary.currentBalance).toLocaleString()}</span>
              <span class="balance-unit">POINTS BALANCE</span>
            </div>
          </div>
          <button class="small-button" onclick="renderSellerPortal()">↻ Refresh Balance</button>
        </div>

        <div class="rewards-metric-grid">
          <div class="reward-stat-box">
            <div class="reward-stat-label">Total Points Earned</div>
            <div class="reward-stat-val" style="color:#38bdf8;">+${Number(summary.totalEarned).toLocaleString()}</div>
          </div>
          <div class="reward-stat-box">
            <div class="reward-stat-label">From Completed Orders</div>
            <div class="reward-stat-val" style="color:#4ade80;">+${Number(summary.orderPoints).toLocaleString()}</div>
          </div>
          <div class="reward-stat-box">
            <div class="reward-stat-label">From 24h Daily Rewards</div>
            <div class="reward-stat-val" style="color:#fbbf24;">+${Number(summary.dailyPoints).toLocaleString()}</div>
          </div>
        </div>

        <div class="reward-schedule-callout" style="background:rgba(59,130,246,0.08);border-color:rgba(59,130,246,0.3);color:#bfdbfe;">
          <span>⏰ <strong>Automatic 24-Hour Daily Rewards:</strong> Active. Next scheduled grant: <strong>${new Date(summary.nextScheduledRewardTime).toUTCString()}</strong></span>
          <span style="background:rgba(59,130,246,0.25);padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;color:#93c5fd;">✓ ELIGIBLE</span>
        </div>

        <h4 style="font-size:14px;color:#fff;margin-bottom:12px;">Recent Points Activity</h4>
        <div class="tx-table-container">
          <table class="tx-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Reason / Description</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              ${(summary.recentTransactions && summary.recentTransactions.length > 0)
                ? summary.recentTransactions.map(t => `
                  <tr>
                    <td>${new Date(t.created_at).toLocaleString()}</td>
                    <td><span style="text-transform:capitalize;color:#94a3b8;">${t.transaction_type.replace('_', ' ')}</span></td>
                    <td>${t.reason}</td>
                    <td>
                      <span class="tx-points-pill ${Number(t.points) >= 0 ? 'positive' : 'negative'}">
                        ${Number(t.points) >= 0 ? '+' : ''}${t.points} PTS
                      </span>
                    </td>
                  </tr>
                `).join('')
                : `<tr><td colspan="4" style="text-align:center;color:#64748b;padding:16px;">No points transactions yet. Complete orders or receive daily rewards to earn points.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Ensure seller listings are active
    if (typeof renderSellerMarketplace === "function") {
      renderSellerMarketplace();
    }
  }

  function hideSellerMarketplace(hide) {
    const sellerSection = document.getElementById("seller");
    if (!sellerSection) return;
    const elements = sellerSection.querySelectorAll(".marketplace-controls, #sellerListingGrid");
    elements.forEach(el => {
      el.style.display = hide ? "none" : "";
    });
  }

  // =========================================================
  // ADMIN REWARDS CONFIGURATION MODAL
  // =========================================================
  window.openAdminRewardsModal = async function () {
    let modal = document.getElementById("adminRewardsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "adminRewardsModal";
      modal.className = "feat-modal";
      document.body.appendChild(modal);
    }

    modal.classList.add("open");

    // Check if user is admin
    if (!currentUser || currentUser.role !== "admin") {
      modal.innerHTML = `
        <div class="feat-modal-box feat-modal-sm">
          <div class="feat-modal-header">
            <div>
              <span class="card-number">⚙️</span>
              <h3>Admin Authentication Required</h3>
            </div>
            <button class="feat-modal-close" onclick="document.getElementById('adminRewardsModal').classList.remove('open')">✕</button>
          </div>
          <p style="color:#94a3b8;font-size:13px;margin-bottom:16px;">Please authenticate with administrator credentials to manage reward rates and policies.</p>
          <form onsubmit="handleAdminLogin(event)">
            <div id="adminLoginErr" style="display:none;color:#f87171;margin-bottom:10px;font-size:12px;"></div>
            <div class="auth-form-group">
              <label>Admin Email</label>
              <input type="email" id="adminEmailInput" value="admin@agritrace.io" required />
            </div>
            <div class="auth-form-group">
              <label>Admin Password</label>
              <input type="password" id="adminPasswordInput" value="Admin@12345" required />
            </div>
            <button type="submit" class="auth-submit-btn">ACCESS ADMIN SETTINGS ➔</button>
          </form>
        </div>
      `;
      return;
    }

    // Load admin configuration from API
    const configRes = await apiRequest("/admin/rewards/config");
    const settings = configRes.ok ? configRes.data.settings : {};

    modal.innerHTML = `
      <div class="feat-modal-box feat-modal-wide">
        <div class="feat-modal-header">
          <div>
            <span class="card-number" style="color:#fbbf24;">⚙️</span>
            <h3>Reward Points Administration & Policies</h3>
          </div>
          <button class="feat-modal-close" onclick="document.getElementById('adminRewardsModal').classList.remove('open')">✕</button>
        </div>

        <p style="color:#94a3b8;font-size:13px;margin-bottom:16px;">
          Logged in as <strong>${currentUser.email}</strong>. Configure daily points, order completion incentives, and execution schedule.
        </p>

        <form onsubmit="handleSaveRewardConfig(event)">
          <div class="admin-settings-grid">
            <div class="admin-config-field">
              <label>Farmer Daily Reward (pts / 24h)</label>
              <input type="number" id="cfg_farmer_daily_points" min="0" value="${settings.farmer_daily_points || 10}" required />
            </div>

            <div class="admin-config-field">
              <label>Seller Daily Reward (pts / 24h)</label>
              <input type="number" id="cfg_seller_daily_points" min="0" value="${settings.seller_daily_points || 15}" required />
            </div>

            <div class="admin-config-field">
              <label>Farmer Order Completion Points</label>
              <input type="number" id="cfg_farmer_order_completion_points" min="0" value="${settings.farmer_order_completion_points || 50}" required />
            </div>

            <div class="admin-config-field">
              <label>Seller Order Completion Points</label>
              <input type="number" id="cfg_seller_order_completion_points" min="0" value="${settings.seller_order_completion_points || 50}" required />
            </div>

            <div class="admin-config-field">
              <label>24h Daily Schedule (Cron)</label>
              <input type="text" id="cfg_daily_reward_schedule_cron" value="${settings.daily_reward_schedule_cron || '0 0 * * *'}" required />
              <small style="color:#64748b;font-size:11px;">Default '0 0 * * *' (midnight UTC)</small>
            </div>

            <div class="admin-config-field">
              <label>Timezone</label>
              <input type="text" id="cfg_daily_reward_timezone" value="${settings.daily_reward_timezone || 'UTC'}" required />
            </div>
          </div>

          <div style="margin-top:20px;display:flex;gap:20px;flex-wrap:wrap;">
            <label class="admin-config-toggle">
              <input type="checkbox" id="cfg_daily_rewards_farmer_enabled" ${settings.daily_rewards_farmer_enabled === 'false' ? '' : 'checked'} />
              <span style="margin-left:8px;font-size:13px;color:#fff;">Enable Farmer Daily Rewards</span>
            </label>

            <label class="admin-config-toggle">
              <input type="checkbox" id="cfg_daily_rewards_seller_enabled" ${settings.daily_rewards_seller_enabled === 'false' ? '' : 'checked'} />
              <span style="margin-left:8px;font-size:13px;color:#fff;">Enable Seller Daily Rewards</span>
            </label>

            <label class="admin-config-toggle">
              <input type="checkbox" id="cfg_order_completion_rewards_enabled" ${settings.order_completion_rewards_enabled === 'false' ? '' : 'checked'} />
              <span style="margin-left:8px;font-size:13px;color:#fff;">Enable Order Completion Rewards</span>
            </label>

            <label class="admin-config-toggle">
              <input type="checkbox" id="cfg_daily_reward_require_verified" ${settings.daily_reward_require_verified === 'true' ? 'checked' : ''} />
              <span style="margin-left:8px;font-size:13px;color:#fff;">Require Verified Email for Rewards</span>
            </label>
          </div>

          <div style="margin-top:20px;text-align:right;">
            <button type="submit" class="primary-button" style="padding:10px 24px;">Save Configuration</button>
          </div>
        </form>

        <!-- On-Demand Manual Scheduler Trigger -->
        <div class="admin-trigger-card">
          <h4>⚡ Immediate 24h Daily Reward Execution</h4>
          <p style="font-size:12px;color:#fde68a;margin-bottom:12px;">
            Run the automated daily reward engine immediately for testing or out-of-schedule execution. Enforces strict idempotency; accounts that already received points for the current date are safely skipped.
          </p>
          <div style="display:flex;gap:12px;align-items:center;">
            <button class="small-button" onclick="handleTriggerDailyRewards()" style="background:#f59e0b;color:#000;font-weight:700;">
              ▶ Execute Daily Rewards Job Now
            </button>
            <span id="adminTriggerStatus" style="font-size:12px;color:#94a3b8;"></span>
          </div>
        </div>
      </div>
    `;
  };

  window.handleAdminLogin = async function (e) {
    e.preventDefault();
    const email = document.getElementById("adminEmailInput").value.trim();
    const password = document.getElementById("adminPasswordInput").value;
    const errEl = document.getElementById("adminLoginErr");

    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password }
    });

    if (res.ok && res.data.user && res.data.user.role === "admin") {
      currentToken = res.data.token;
      localStorage.setItem(TOKEN_KEY, currentToken);
      currentUser = res.data.user;
      notify("Admin authentication verified.", "success");
      updateNavAuthIndicator();
      openAdminRewardsModal();
    } else {
      if (errEl) {
        errEl.textContent = res.data.message || "Invalid administrative credentials";
        errEl.style.display = "block";
      }
    }
  };

  window.handleSaveRewardConfig = async function (e) {
    e.preventDefault();
    const payload = {
      farmer_daily_points: document.getElementById("cfg_farmer_daily_points").value,
      seller_daily_points: document.getElementById("cfg_seller_daily_points").value,
      farmer_order_completion_points: document.getElementById("cfg_farmer_order_completion_points").value,
      seller_order_completion_points: document.getElementById("cfg_seller_order_completion_points").value,
      daily_reward_schedule_cron: document.getElementById("cfg_daily_reward_schedule_cron").value,
      daily_reward_timezone: document.getElementById("cfg_daily_reward_timezone").value,
      daily_rewards_farmer_enabled: String(document.getElementById("cfg_daily_rewards_farmer_enabled").checked),
      daily_rewards_seller_enabled: String(document.getElementById("cfg_daily_rewards_seller_enabled").checked),
      order_completion_rewards_enabled: String(document.getElementById("cfg_order_completion_rewards_enabled").checked),
      daily_reward_require_verified: String(document.getElementById("cfg_daily_reward_require_verified").checked)
    };

    const res = await apiRequest("/admin/rewards/config", {
      method: "PUT",
      body: payload
    });

    if (res.ok) {
      notify("Reward configuration saved and scheduler re-synced successfully!", "success");
      openAdminRewardsModal();
    } else {
      notify(res.data.error || "Failed to update configuration", "error");
    }
  };

  window.handleTriggerDailyRewards = async function () {
    const statusEl = document.getElementById("adminTriggerStatus");
    if (statusEl) statusEl.textContent = "Processing daily rewards...";

    const res = await apiRequest("/admin/rewards/trigger-daily", { method: "POST" });
    if (res.ok && res.data.result) {
      const r = res.data.result;
      const msg = `Done in ${r.durationMs}ms: ${r.awardedCount} accounts awarded (${r.totalPointsAwarded} pts), ${r.skippedCount} skipped.`;
      if (statusEl) statusEl.textContent = msg;
      notify(msg, "success");
      renderFarmerPortal();
      renderSellerPortal();
    } else {
      if (statusEl) statusEl.textContent = res.data.error || "Execution failed";
      notify(res.data.error || "Failed to trigger daily rewards", "error");
    }
  };

  // Attach navbar button listener once DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    initAuth();

    const adminBtn = document.getElementById("adminRewardsConfigBtn");
    if (adminBtn) {
      adminBtn.addEventListener("click", openAdminRewardsModal);
    }
  });

  // Re-check on hash changes
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#farmer") {
      renderFarmerPortal();
    } else if (window.location.hash === "#seller") {
      renderSellerPortal();
    }
  });

  // Export functions to window
  window.renderFarmerPortal = renderFarmerPortal;
  window.renderSellerPortal = renderSellerPortal;
})();

