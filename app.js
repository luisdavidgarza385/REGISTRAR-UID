// SpectralX Registrar Bypass UID Global System - Dedicated Views Logic
const STORAGE_UIDS  = 'registrar_bypass_uids';
const STORAGE_USERS = 'registrar_bypass_users';
const STORAGE_CFG   = 'registrar_bypass_config';
const STORAGE_SESS  = 'registrar_bypass_session';
const STORAGE_LOGS  = 'registrar_bypass_logs';
const STORAGE_BC    = 'registrar_bypass_broadcasts';
const STORAGE_THEME = 'registrar_bypass_theme';

// App State
let uids = [];
let users = [];
let systemLogs = [];
let broadcasts = [];
let currentUser = null;
let apiConfig = {
    url: 'https://gtccheats.xyz/Api/uidbypassapi/api_user.php',
    key: 'GTCAPI-0C466C95E5A6F9CD978E5245A74B4973'
};
let countdownInterval = null;
let loginFailedAttempts = 0;
let loginLockoutTime = 0;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const btnTogglePassShow = document.getElementById('btnTogglePassShow');
const chkRememberMe = document.getElementById('chkRememberMe');

const appLayout = document.getElementById('appLayout');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');
const btnOpenMobileMenu = document.getElementById('btnOpenMobileMenu');
const btnCloseMobileSidebar = document.getElementById('btnCloseMobileSidebar');

const userDisplayName = document.getElementById('userDisplayName');
const userRoleBadge = document.getElementById('userRoleBadge');
const userAvatarContainer = document.getElementById('userAvatarContainer');
const footerUserLabel = document.getElementById('footerUserLabel');
const footerRoleLabel = document.getElementById('footerRoleLabel');
const footerAvatarImg = document.getElementById('footerAvatarImg');
const brandLogoContainer = document.getElementById('brandLogoContainer');
const btnLogout = document.getElementById('btnLogout');
const topbarProfileBtn = document.getElementById('topbarProfileBtn');

const btnToggleTheme = document.getElementById('btnToggleTheme');
const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');
const btnNotifications = document.getElementById('btnNotifications');
const notifBadgeCnt = document.getElementById('notifBadgeCnt');

const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.content-view');

const navDashboardBtn = document.getElementById('navDashboardBtn');
const navUidsBtn = document.getElementById('navUidsBtn');
const navAiBtn = document.getElementById('navAiBtn');
const navResellersBtn = document.getElementById('navResellersBtn');
const navProfileBtn = document.getElementById('navProfileBtn');
const navConfigBtn = document.getElementById('navConfigBtn');
const navLogsBtn = document.getElementById('navLogsBtn');
const navSupportBtn = document.getElementById('navSupportBtn');

const uidsTableBody = document.getElementById('uidsTableBody');
const uidsEmptyState = document.getElementById('uidsEmptyState');
const uidCountLabel = document.getElementById('uidCountLabel');
const globalSearch = document.getElementById('globalSearch');

// Counter Elements
const cntTotal = document.getElementById('cntTotal');
const cntActive = document.getElementById('cntActive');
const cntWarning = document.getElementById('cntWarning');
const cntExpired = document.getElementById('cntExpired');
const dashActiveUids = document.getElementById('dashActiveUids');
const dashResellerCount = document.getElementById('dashResellerCount');

// Resellers Elements
const resellersTableBody = document.getElementById('resellersTableBody');
const resellerCountLabel = document.getElementById('resellerCountLabel');
const btnOpenAddResellerModal = document.getElementById('btnOpenAddResellerModal');
const addResellerModal = document.getElementById('addResellerModal');
const btnCloseResellerModal = document.getElementById('btnCloseResellerModal');
const btnCancelResellerModal = document.getElementById('btnCancelResellerModal');
const modalResellerForm = document.getElementById('modalResellerForm');
const resellerUsernameInput = document.getElementById('resellerUsernameInput');
const resellerPasswordInput = document.getElementById('resellerPasswordInput');
const resellerDaysInput = document.getElementById('resellerDaysInput');

// Profile Elements
const profileAvatarPreview = document.getElementById('profileAvatarPreview');
const avatarFileInput = document.getElementById('avatarFileInput');
const avatarUploadArea = document.getElementById('avatarUploadArea');
const avatarLockedMessage = document.getElementById('avatarLockedMessage');
const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');
const systemLogsBox = document.getElementById('systemLogsBox');

// AI Chat Elements
const aiChatConsole = document.getElementById('aiChatConsole');
const aiChatInput = document.getElementById('aiChatInput');
const btnSendAiMsg = document.getElementById('btnSendAiMsg');

// Notification Modal Elements
const notifModal = document.getElementById('notifModal');
const btnCloseNotifModal = document.getElementById('btnCloseNotifModal');
const adminBroadcastBox = document.getElementById('adminBroadcastBox');
const broadcastInput = document.getElementById('broadcastInput');
const btnSendBroadcast = document.getElementById('btnSendBroadcast');
const notifListContainer = document.getElementById('notifListContainer');

// UID Modal Elements
const addModal = document.getElementById('addModal');
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnCloseAddModal = document.getElementById('btnCloseAddModal');
const btnCancelAddModal = document.getElementById('btnCancelAddModal');
const modalAddForm = document.getElementById('modalAddForm');
const addUidInput = document.getElementById('addUidInput');
const addDaysInput = document.getElementById('addDaysInput');
const addNoteInput = document.getElementById('addNoteInput');

// Extend Modal Elements
const extendModal = document.getElementById('extendModal');
const btnCloseExtendModal = document.getElementById('btnCloseExtendModal');
const btnCancelExtendModal = document.getElementById('btnCancelExtendModal');
const modalExtendForm = document.getElementById('modalExtendForm');
const extendUidTarget = document.getElementById('extendUidTarget');
const extendUidDisplay = document.getElementById('extendUidDisplay');
const extendDaysInput = document.getElementById('extendDaysInput');

// Config Elements
const configApiUrl = document.getElementById('configApiUrl');
const configApiKey = document.getElementById('configApiKey');
const btnTestApiConnection = document.getElementById('btnTestApiConnection');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const apiTestStatus = document.getElementById('apiTestStatus');

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    initAntiDebuggingProtection();
    initSpeedLinesCanvas();
    loadTheme();
    loadUsers();
    loadConfig();
    loadUids();
    loadLogs();
    loadBroadcasts();
    setupEvents();

    const savedSess = localStorage.getItem(STORAGE_SESS) || sessionStorage.getItem(STORAGE_SESS);
    if (savedSess) {
        try {
            const parsed = JSON.parse(savedSess);
            const found = users.find(u => u.username.toLowerCase() === parsed.username.toLowerCase() && u.password === parsed.password);
            if (found) {
                currentUser = found;
                showApp();
            }
        } catch(e){}
    }

    startLiveTimerTicker();
});

function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME);
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (btnToggleTheme) btnToggleTheme.textContent = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        if (btnToggleTheme) btnToggleTheme.textContent = '🌙';
    }
}

function toggleTheme() {
    if (document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        localStorage.setItem(STORAGE_THEME, 'dark');
        if (btnToggleTheme) btnToggleTheme.textContent = '🌙';
    } else {
        document.body.classList.add('light-theme');
        localStorage.setItem(STORAGE_THEME, 'light');
        if (btnToggleTheme) btnToggleTheme.textContent = '☀️';
    }
}

function initAntiDebuggingProtection() {
    document.addEventListener('keydown', (e) => {
        if (
            e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
            (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83))
        ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (e.ctrlKey && e.keyCode === 75) {
            e.preventDefault();
            if (globalSearch) globalSearch.focus();
        }
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    (function antiDebugLoop() {
        try {
            (function() {
                return false;
            })['constructor']('debugger')['call']();
        } catch (e) {}
        setTimeout(antiDebugLoop, 1000);
    })();
}

function initSpeedLinesCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 4 + 2,
            opacity: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = `rgba(0, 200, 255, ${p.opacity})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#0070f3';

            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.length, p.y - p.length * 0.25);
            ctx.stroke();

            p.x += p.speed * 2;
            p.y -= p.speed * 0.5;

            if (p.x > width || p.y < 0) {
                p.x = -p.length;
                p.y = Math.random() * height;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function loadUsers() {
    const saved = localStorage.getItem(STORAGE_USERS);
    if (saved) {
        try { users = JSON.parse(saved); } catch(e){ users = []; }
    }
    
    const spectralExists = users && users.some(u => u.username.toLowerCase() === 'spectralx@gmail.com' || u.username.toLowerCase() === 'spectralx');
    const aiExists = users && users.some(u => u.username.toUpperCase() === 'UID IA');

    if (!users || users.length === 0 || !spectralExists || !aiExists) {
        users = [
            { username: 'spectralx@gmail.com', password: 'SpectralX', role: 'SUPER ADMIN', avatar: null, avatarLocked: false, days: 365, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
            { username: 'UID IA', password: 'UID IA', role: 'RESELLER', avatar: null, avatarLocked: false, days: 3650, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString() },
            { username: 'reseller1', password: '123', role: 'RESELLER', avatar: null, avatarLocked: false, days: 30, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
        ];
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function loadConfig() {
    const saved = localStorage.getItem(STORAGE_CFG);
    if (saved) {
        try { apiConfig = JSON.parse(saved); } catch(e){}
    }
    configApiUrl.value = apiConfig.url;
    configApiKey.value = apiConfig.key;
}

function loadUids() {
    const saved = localStorage.getItem(STORAGE_UIDS);
    if (saved) {
        try { uids = JSON.parse(saved); } catch(e){ uids = []; }
    } else {
        uids = [
            {
                uid: '57546546',
                days: 30,
                note: 'Cliente Ejemplo VIP',
                addedBy: 'spectralx@gmail.com',
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        saveUids();
    }
}

function saveUids() {
    localStorage.setItem(STORAGE_UIDS, JSON.stringify(uids));
}

function loadLogs() {
    const saved = localStorage.getItem(STORAGE_LOGS);
    if (saved) {
        try { systemLogs = JSON.parse(saved); } catch(e){ systemLogs = []; }
    }
}

function logSystemEvent(category, message, type = 'info') {
    const logItem = {
        time: new Date().toLocaleTimeString(),
        user: currentUser ? currentUser.username : 'Sistema',
        category: category,
        message: message,
        type: type
    };
    systemLogs.unshift(logItem);
    if (systemLogs.length > 100) systemLogs.pop();
    localStorage.setItem(STORAGE_LOGS, JSON.stringify(systemLogs));
    renderLogsUI();
}

function loadBroadcasts() {
    const saved = localStorage.getItem(STORAGE_BC);
    if (saved) {
        try { broadcasts = JSON.parse(saved); } catch(e){ broadcasts = []; }
    } else {
        broadcasts = [
            {
                id: 1,
                author: 'SpectralX',
                text: 'Bienvenido al panel Registrar Bypass UID Global System.',
                date: new Date().toLocaleString()
            }
        ];
        localStorage.setItem(STORAGE_BC, JSON.stringify(broadcasts));
    }
    updateNotifBadge();
}

function updateNotifBadge() {
    if (notifBadgeCnt) {
        notifBadgeCnt.textContent = broadcasts.length;
    }
}

function renderLogsUI() {
    if (!systemLogsBox || !currentUser) return;
    systemLogsBox.innerHTML = '';
    
    const isSuperAdmin = currentUser.role === 'SUPER ADMIN' || currentUser.role === 'ADMIN';
    const filteredLogs = systemLogs.filter(l => {
        if (isSuperAdmin) return true;
        return l.user === currentUser.username;
    });

    if (filteredLogs.length === 0) {
        systemLogsBox.innerHTML = '<div style="color:var(--text-muted);">No hay eventos de acceso registrados para tu usuario.</div>';
        return;
    }

    filteredLogs.forEach(l => {
        const div = document.createElement('div');
        div.className = 'log-line';
        div.innerHTML = `<span class="log-time">[${l.time}]</span> <span class="log-${l.type}">[${sanitizeHtml(l.category)}]</span> <span>${sanitizeHtml(l.message)}</span>`;
        systemLogsBox.appendChild(div);
    });
}

function renderBroadcastsUI() {
    if (!notifListContainer) return;
    notifListContainer.innerHTML = '';

    if (broadcasts.length === 0) {
        notifListContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">No hay anuncios recientes.</p>';
        return;
    }

    broadcasts.forEach(b => {
        const div = document.createElement('div');
        div.className = 'notif-card-item';
        div.innerHTML = `
            <div class="notif-header">
                <strong>📢 ${sanitizeHtml(b.author)}</strong>
                <span>${sanitizeHtml(b.date)}</span>
            </div>
            <div class="notif-body">${sanitizeHtml(b.text)}</div>
        `;
        notifListContainer.appendChild(div);
    });
}

function sanitizeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showApp() {
    if (currentUser.expiresAt && new Date(currentUser.expiresAt) < new Date() && currentUser.role !== 'SUPER ADMIN') {
        alert('⚠️ Tu cuenta ha expirado. Contacta al Administrador en WhatsApp para renovarla (+50232509982).');
        logout();
        return;
    }

    loginScreen.classList.add('hidden');
    appLayout.classList.remove('hidden');

    const name = currentUser.username;
    const role = currentUser.role;

    userDisplayName.textContent = name === 'spectralx@gmail.com' ? 'SpectralX' : name;
    userRoleBadge.textContent = role === 'SUPER ADMIN' || role === 'ADMIN' ? 'SUPER ADMIN' : 'RESELLER';
    
    footerUserLabel.textContent = name;
    footerRoleLabel.textContent = role === 'SUPER ADMIN' || role === 'ADMIN' ? 'SUPER ADMIN' : 'RESELLER';

    updateAvatarUI();

    const isSuperAdmin = role === 'ADMIN' || role === 'SUPER ADMIN';
    const isAiAccount = name.toUpperCase() === 'UID IA';
    
    if (isAiAccount) {
        // SI ES EL USUARIO DEDICADO "UID IA", OCULTAR TODAS LAS DEMÁS PESTAÑAS Y DEJAR SOLO EL CHAT IA
        navDashboardBtn.style.display = 'none';
        navUidsBtn.style.display = 'none';
        navResellersBtn.style.display = 'none';
        navProfileBtn.style.display = 'none';
        navConfigBtn.style.display = 'none';
        navLogsBtn.style.display = 'none';
        navSupportBtn.style.display = 'none';
        navAiBtn.style.display = 'flex';

        navItems.forEach(i => i.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        navAiBtn.classList.add('active');
        document.getElementById('viewAiAssistant').classList.add('active');
    } else {
        navDashboardBtn.style.display = 'flex';
        navUidsBtn.style.display = 'flex';
        navAiBtn.style.display = 'flex';
        navProfileBtn.style.display = 'flex';
        navLogsBtn.style.display = 'flex';
        navSupportBtn.style.display = 'flex';

        if (!isSuperAdmin) {
            navResellersBtn.style.display = 'none';
            navConfigBtn.style.display = 'none';
        } else {
            navResellersBtn.style.display = 'flex';
            navConfigBtn.style.display = 'flex';
        }

        navItems.forEach(i => i.classList.remove('active'));
        views.forEach(v => v.classList.remove('active'));
        navUidsBtn.classList.add('active');
        document.getElementById('viewUids').classList.add('active');
    }

    logSystemEvent('AUTENTICACIÓN', `Sesión iniciada por el usuario ${name} (${role}).`, 'info');
    render();
}

function updateAvatarUI() {
    if (!currentUser) return;
    const name = currentUser.username;
    const avatar = currentUser.avatar;
    const isLocked = currentUser.avatarLocked;

    if (avatar) {
        userAvatarContainer.innerHTML = `<img src="${avatar}" alt="Avatar">`;
        footerAvatarImg.innerHTML = `<img src="${avatar}" alt="Avatar">`;
        brandLogoContainer.innerHTML = `<img src="${avatar}" alt="Brand Logo">`;
        profileAvatarPreview.innerHTML = `<img src="${avatar}" alt="Avatar Large">`;
    } else {
        const char = name.charAt(0).toUpperCase();
        userAvatarContainer.innerHTML = char;
        footerAvatarImg.innerHTML = '👤';
        brandLogoContainer.innerHTML = `
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V12C3 17.5 7 21 12 22C17 21 21 17.5 21 12V7L12 2Z" fill="url(#brandShieldGrad)" stroke="#00c8ff" stroke-width="1.5"/>
            </svg>
        `;
        profileAvatarPreview.innerHTML = `<span>${char}</span>`;
    }

    if (isLocked) {
        if (avatarUploadArea) avatarUploadArea.classList.add('hidden');
        if (avatarLockedMessage) avatarLockedMessage.classList.remove('hidden');
        if (btnRemoveAvatar) btnRemoveAvatar.classList.add('hidden');
    } else {
        if (avatarUploadArea) avatarUploadArea.classList.remove('hidden');
        if (avatarLockedMessage) avatarLockedMessage.classList.add('hidden');
        if (btnRemoveAvatar) btnRemoveAvatar.classList.remove('hidden');
    }
}

function logout() {
    logSystemEvent('AUTENTICACIÓN', `Sesión cerrada por ${currentUser ? currentUser.username : 'Usuario'}.`, 'warn');
    localStorage.removeItem(STORAGE_SESS);
    sessionStorage.removeItem(STORAGE_SESS);
    currentUser = null;
    appLayout.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginErrorMsg.classList.add('hidden');
    closeMobileMenu();
}

function closeMobileMenu() {
    if (sidebar) sidebar.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.add('hidden');
}

function openMobileMenu() {
    if (sidebar) sidebar.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.remove('hidden');
}

function getDetailedTimeRemaining(expiresAt) {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const totalSeconds = Math.floor((expiry - now) / 1000);

    if (totalSeconds <= 0) {
        return { isExpired: true, text: '0d 0h 0m 0s (Expirado)', days: 0 };
    }

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        isExpired: false,
        days: days,
        text: `${days}d ${hours}h ${minutes}m ${seconds}s`
    };
}

function getBadgeHtml(daysLeft) {
    if (daysLeft <= 0) {
        return `<span class="badge red">Expirado</span>`;
    } else if (daysLeft <= 3) {
        return `<span class="badge yellow">Por Vencer</span>`;
    } else {
        return `<span class="badge green">Activo</span>`;
    }
}

function startLiveTimerTicker() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const tickers = document.querySelectorAll('.timer-ticker');
        tickers.forEach(el => {
            const expiresAt = el.dataset.expires;
            if (expiresAt) {
                const info = getDetailedTimeRemaining(expiresAt);
                el.textContent = info.text;
                if (info.isExpired) {
                    el.classList.add('expired');
                } else {
                    el.classList.remove('expired');
                }
            }
        });
    }, 1000);
}

function render() {
    if (!currentUser) return;

    const isSuperAdmin = currentUser.role === 'SUPER ADMIN' || currentUser.role === 'ADMIN';

    const visibleUids = uids.filter(item => {
        if (isSuperAdmin) return true;
        return item.addedBy === currentUser.username;
    });

    let total = visibleUids.length;
    let active = 0, warning = 0, expired = 0;

    visibleUids.forEach(item => {
        const info = getDetailedTimeRemaining(item.expiresAt);
        if (info.isExpired) expired++;
        else if (info.days <= 3) { warning++; active++; }
        else active++;
    });

    cntTotal.textContent = total;
    cntActive.textContent = active;
    cntWarning.textContent = warning;
    cntExpired.textContent = expired;
    uidCountLabel.textContent = total;

    dashActiveUids.textContent = active;
    dashResellerCount.textContent = users.length;
    resellerCountLabel.textContent = users.length;

    uidsTableBody.innerHTML = '';
    const q = globalSearch.value.toLowerCase().trim();

    const filtered = visibleUids.filter(item => {
        const matchesUid = item.uid.toLowerCase().includes(q);
        const matchesNote = item.note && item.note.toLowerCase().includes(q);
        const matchesUser = item.addedBy && item.addedBy.toLowerCase().includes(q);
        return matchesUid || matchesNote || matchesUser;
    });

    if (filtered.length === 0) {
        uidsEmptyState.classList.remove('hidden');
    } else {
        uidsEmptyState.classList.add('hidden');
        filtered.forEach(item => {
            const timerInfo = getDetailedTimeRemaining(item.expiresAt);
            const created = new Date(item.createdAt).toLocaleDateString();
            const expires = new Date(item.expiresAt).toLocaleDateString();
            const addedBy = item.addedBy || 'SpectralX';

            const tr = document.createElement('tr');
            tr.setAttribute('id', `uid-row-${item.uid}`);
            tr.innerHTML = `
                <td><span class="uid-font">${sanitizeHtml(item.uid)}</span></td>
                <td>${sanitizeHtml(item.note) || '<span style="color:var(--text-muted)">-</span>'}</td>
                <td><span class="badge purple">👤 ${sanitizeHtml(addedBy)}</span></td>
                <td>${item.days} días</td>
                <td>${created}</td>
                <td>${expires}</td>
                <td><span class="timer-ticker ${timerInfo.isExpired ? 'expired' : ''}" data-expires="${item.expiresAt}">${timerInfo.text}</span></td>
                <td>${getBadgeHtml(timerInfo.days)}</td>
                <td class="text-right" style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn-action-primary" style="padding:4px 8px; font-size:11px;" onclick="openExtendModal('${item.uid}')">➕ Sumar Días</button>
                    <button class="btn-delete-row" onclick="removeUid('${item.uid}')">🗑️ Eliminar</button>
                </td>
            `;
            uidsTableBody.appendChild(tr);
        });
    }

    renderResellersTable();
    renderLogsUI();
}

function renderResellersTable() {
    resellersTableBody.innerHTML = '';
    users.forEach(u => {
        const uidsCreatedCount = uids.filter(i => i.addedBy === u.username).length;
        const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Sistema';
        const expiresDate = u.expiresAt ? new Date(u.expiresAt).toLocaleDateString() : 'Ilimitado';
        const userAvatarHtml = u.avatar ? `<img src="${u.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;">` : '👤 ';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:var(--text-primary);">${userAvatarHtml}${sanitizeHtml(u.username)}</strong></td>
            <td><code style="color:var(--accent-cyan);">${sanitizeHtml(u.password)}</code></td>
            <td><span class="badge ${u.role === 'SUPER ADMIN' || u.role === 'ADMIN' ? 'purple' : 'green'}">${u.role}</span></td>
            <td>${u.days || 30} días</td>
            <td>${expiresDate}</td>
            <td><strong>${uidsCreatedCount} UIDs</strong></td>
            <td class="text-right">
                ${u.username.toLowerCase() !== 'spectralx@gmail.com' ? `<button class="btn-delete-row" onclick="deleteReseller('${u.username}')">🗑️ Eliminar</button>` : '<span style="color:var(--text-muted)">Super Admin</span>'}
            </td>
        `;
        resellersTableBody.appendChild(tr);
    });
}

window.openExtendModal = (uid) => {
    const item = uids.find(i => i.uid === uid);
    if (item) {
        extendUidTarget.value = item.uid;
        extendUidDisplay.value = `${item.uid} (${item.note || 'Sin nota'})`;
        extendModal.classList.remove('hidden');
    }
};

window.removeUid = (uid) => {
    if (confirm(`¿Eliminar la licencia para el UID ${uid}?`)) {
        uids = uids.filter(i => i.uid !== uid);
        saveUids();
        logSystemEvent('UID', `Licencia para UID ${uid} eliminada por ${currentUser.username}.`, 'warn');
        render();
        sendApiCall('remove', { account_id: parseInt(uid, 10) });
    }
};

window.deleteReseller = (username) => {
    if (confirm(`¿Estás seguro de borrar al revendedor "${username}"?`)) {
        users = users.filter(u => u.username !== username);
        saveUsers();
        logSystemEvent('RESELLER', `Revendedor "${username}" eliminado del sistema.`, 'warn');
        render();
    }
};

async function sendApiCall(action, payload) {
    if (!apiConfig.url) return;
    try {
        await fetch(`${apiConfig.url}?action=${action}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-API-KEY': apiConfig.key 
            },
            body: JSON.stringify(payload)
        });
    } catch(e) {
        console.error("API Call error:", e);
    }
}

function processAiChatMessage(msg) {
    const text = msg.trim().toLowerCase();
    
    const uidMatch = text.match(/\b\d{5,15}\b/);
    const daysMatch = text.match(/(\d+)\s*(dias|día|días|dia|d)/);

    const extractedUid = uidMatch ? uidMatch[0] : null;
    const extractedDays = daysMatch ? parseInt(daysMatch[1], 10) : 30;

    if (text.includes('eliminar') || text.includes('borrar') || text.includes('remove')) {
        if (!extractedUid) return "🤖 No encontré ningún número de UID en tu mensaje para eliminar. Por favor incluye el UID (Ej: Eliminar 57546546).";
        const idx = uids.findIndex(i => i.uid === extractedUid);
        if (idx !== -1) {
            uids.splice(idx, 1);
            saveUids();
            render();
            sendApiCall('remove', { account_id: parseInt(extractedUid, 10) });
            return `✅ **Licencia Eliminada**: El UID \`${extractedUid}\` ha sido eliminado exitosamente del sistema.`;
        } else {
            return `⚠️ El UID \`${extractedUid}\` no se encontró registrado en tu lista.`;
        }
    } else if (text.includes('extender') || text.includes('sumar') || text.includes('renovar')) {
        if (!extractedUid) return "🤖 Por favor especifica el UID que deseas extender (Ej: Extender 57546546 por 15 dias).";
        const item = uids.find(i => i.uid === extractedUid);
        if (item) {
            item.days += extractedDays;
            const currentExpiry = new Date(item.expiresAt) > new Date() ? new Date(item.expiresAt) : new Date();
            item.expiresAt = new Date(currentExpiry.getTime() + extractedDays * 24 * 60 * 60 * 1000).toISOString();
            saveUids();
            render();
            return `✅ **Licencia Extendida**: Se han sumado \`${extractedDays} días\` al UID \`${extractedUid}\`. Nueva expiración: ${new Date(item.expiresAt).toLocaleDateString()}.`;
        } else {
            return `⚠️ El UID \`${extractedUid}\` no se encontró registrado.`;
        }
    } else if (text.includes('registrar') || text.includes('agregar') || text.includes('crear') || uidMatch) {
        if (!extractedUid) return "🤖 Para registrar una nueva licencia, envíame el UID del jugador (Ej: Registrar 57546546 por 30 días).";
        
        const now = new Date();
        const expiresAt = new Date(now.getTime() + extractedDays * 24 * 60 * 60 * 1000).toISOString();

        const existingIdx = uids.findIndex(i => i.uid === extractedUid);
        if (existingIdx !== -1) {
            uids[existingIdx].days = extractedDays;
            uids[existingIdx].expiresAt = expiresAt;
            uids[existingIdx].addedBy = currentUser.username;
        } else {
            uids.unshift({
                uid: extractedUid,
                days: extractedDays,
                note: 'Registrado vía IA',
                addedBy: currentUser.username,
                createdAt: now.toISOString(),
                expiresAt: expiresAt
            });
        }
        saveUids();
        render();
        sendApiCall('add', { account_id: parseInt(extractedUid, 10), for_days: extractedDays });
        return `🎉 **UID Registrado**: El UID \`${extractedUid}\` ha sido activado exitosamente por \`${extractedDays} días\`.`;
    }

    return "🤖 No entendí tu comando. Puedes pedirme: 'Registrar [UID] por [Días]', 'Extender [UID] por [Días]' o 'Eliminar [UID]'.";
}

function setupEvents() {
    if (btnOpenMobileMenu) btnOpenMobileMenu.addEventListener('click', openMobileMenu);
    if (btnCloseMobileSidebar) btnCloseMobileSidebar.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    if (btnToggleTheme) btnToggleTheme.addEventListener('click', toggleTheme);

    // AI Chat Send Event
    if (btnSendAiMsg && aiChatInput) {
        const sendAi = () => {
            const val = aiChatInput.value.trim();
            if (!val) return;

            const userDiv = document.createElement('div');
            userDiv.className = 'ai-msg user';
            userDiv.innerHTML = `👤 ${sanitizeHtml(val)}`;
            aiChatConsole.appendChild(userDiv);

            const botReply = processAiChatMessage(val);
            const botDiv = document.createElement('div');
            botDiv.className = 'ai-msg bot';
            botDiv.innerHTML = botReply;
            aiChatConsole.appendChild(botDiv);

            aiChatInput.value = '';
            aiChatConsole.scrollTop = aiChatConsole.scrollHeight;
        };

        btnSendAiMsg.addEventListener('click', sendAi);
        aiChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendAi();
        });
    }

    if (modalExtendForm) {
        modalExtendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const targetUid = extendUidTarget.value;
            const addDays = parseInt(extendDaysInput.value, 10);

            if (!targetUid || isNaN(addDays) || addDays <= 0) return;

            const item = uids.find(i => i.uid === targetUid);
            if (item) {
                item.days += addDays;
                const currentExpiry = new Date(item.expiresAt) > new Date() ? new Date(item.expiresAt) : new Date();
                item.expiresAt = new Date(currentExpiry.getTime() + addDays * 24 * 60 * 60 * 1000).toISOString();
                saveUids();
                logSystemEvent('UID', `Se extendieron ${addDays} días a la licencia UID ${targetUid} por ${currentUser.username}.`, 'info');
                render();
                alert(`¡Se han sumado ${addDays} días al UID ${targetUid} exitosamente!`);
            }
            extendModal.classList.add('hidden');
        });
    }

    if (btnCloseExtendModal && extendModal) btnCloseExtendModal.addEventListener('click', () => extendModal.classList.add('hidden'));
    if (btnCancelExtendModal && extendModal) btnCancelExtendModal.addEventListener('click', () => extendModal.classList.add('hidden'));

    if (btnNotifications) {
        btnNotifications.addEventListener('click', () => {
            const isSuperAdmin = currentUser.role === 'SUPER ADMIN' || currentUser.role === 'ADMIN';
            if (isSuperAdmin && adminBroadcastBox) {
                adminBroadcastBox.classList.remove('hidden');
            } else if (adminBroadcastBox) {
                adminBroadcastBox.classList.add('hidden');
            }
            renderBroadcastsUI();
            if (notifModal) notifModal.classList.remove('hidden');
        });
    }

    if (btnCloseNotifModal && notifModal) {
        btnCloseNotifModal.addEventListener('click', () => notifModal.classList.add('hidden'));
    }

    if (btnSendBroadcast) {
        btnSendBroadcast.addEventListener('click', () => {
            const text = broadcastInput.value.trim();
            if (!text) return;

            broadcasts.unshift({
                id: Date.now(),
                author: currentUser.username === 'spectralx@gmail.com' ? 'SpectralX (Super Admin)' : currentUser.username,
                text: text,
                date: new Date().toLocaleString()
            });

            localStorage.setItem(STORAGE_BC, JSON.stringify(broadcasts));
            broadcastInput.value = '';
            updateNotifBadge();
            renderBroadcastsUI();
            logSystemEvent('ANUNCIO', `Anuncio global emitido: "${text.substring(0, 30)}..."`, 'info');
            alert('¡Anuncio emitido a todos los usuarios!');
        });
    }

    if (btnTogglePassShow) {
        btnTogglePassShow.addEventListener('click', () => {
            if (loginPassword.type === 'password') {
                loginPassword.type = 'text';
                btnTogglePassShow.textContent = '🙈';
            } else {
                loginPassword.type = 'password';
                btnTogglePassShow.textContent = '👁️';
            }
        });
    }

    if (btnToggleFullscreen) {
        btnToggleFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        });
    }

    // LOGIN FORM SUBMIT (REQUIERE INGRESO MANUAL DE USUARIO Y CONTRASEÑA)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (Date.now() < loginLockoutTime) {
            const secsLeft = Math.ceil((loginLockoutTime - Date.now()) / 1000);
            loginErrorMsg.textContent = `🚫 Sistema bloqueado por demasiados intentos. Espera ${secsLeft} segundos.`;
            loginErrorMsg.classList.remove('hidden');
            return;
        }

        const user = loginUsername.value.trim();
        const pass = loginPassword.value.trim();

        const found = users.find(u => 
            (u.username.toLowerCase() === user.toLowerCase() || 
             (user.toLowerCase() === 'spectralx' && u.username.toLowerCase() === 'spectralx@gmail.com') ||
             (user.toUpperCase() === 'UID IA' && u.username.toUpperCase() === 'UID IA')) 
            && u.password === pass
        );

        if (found) {
            loginFailedAttempts = 0;
            currentUser = found;

            if (chkRememberMe && chkRememberMe.checked) {
                localStorage.setItem(STORAGE_SESS, JSON.stringify(found));
            } else {
                sessionStorage.setItem(STORAGE_SESS, JSON.stringify(found));
            }

            showApp();
        } else {
            loginFailedAttempts++;
            if (loginFailedAttempts >= 5) {
                loginLockoutTime = Date.now() + 60000;
                loginErrorMsg.textContent = '🚫 Demasiados intentos fallidos. Sistema bloqueado por 60 segundos por seguridad.';
                logSystemEvent('SEGURIDAD', `Bloqueo temporal por intentos fallidos de login.`, 'err');
            } else {
                loginErrorMsg.textContent = `❌ Usuario o contraseña incorrectos (Intento ${loginFailedAttempts}/5)`;
            }
            loginErrorMsg.classList.remove('hidden');
        }
    });

    btnLogout.addEventListener('click', logout);

    if (topbarProfileBtn) {
        topbarProfileBtn.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            document.querySelector('[data-view="profile"]').classList.add('active');
            document.getElementById('viewProfile').classList.add('active');
        });
    }

    // Navigation Tabs
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            item.classList.add('active');
            const targetView = item.dataset.view;
            if (targetView === 'dashboard') document.getElementById('viewDashboard').classList.add('active');
            if (targetView === 'uids') document.getElementById('viewUids').classList.add('active');
            if (targetView === 'aiAssistant') document.getElementById('viewAiAssistant').classList.add('active');
            if (targetView === 'resellers') document.getElementById('viewResellers').classList.add('active');
            if (targetView === 'profile') document.getElementById('viewProfile').classList.add('active');
            if (targetView === 'config') document.getElementById('viewConfig').classList.add('active');
            if (targetView === 'logs') document.getElementById('viewLogs').classList.add('active');
            if (targetView === 'support') document.getElementById('viewSupport').classList.add('active');
            closeMobileMenu();
        });
    });

    if (avatarFileInput) {
        avatarFileInput.addEventListener('change', (e) => {
            if (currentUser.avatarLocked) {
                alert('Tu foto de perfil ya fue configurada y no puede ser cambiada de nuevo.');
                return;
            }

            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Image = event.target.result;
                    currentUser.avatar = base64Image;
                    currentUser.avatarLocked = true;
                    
                    const uIdx = users.findIndex(u => u.username === currentUser.username);
                    if (uIdx !== -1) {
                        users[uIdx].avatar = base64Image;
                        users[uIdx].avatarLocked = true;
                        saveUsers();
                    }
                    localStorage.setItem(STORAGE_SESS, JSON.stringify(currentUser));
                    updateAvatarUI();
                    logSystemEvent('PERFIL', 'Foto de perfil fijada permanentemente (1 sola subida permitida).', 'info');
                    render();
                    alert('¡Foto de perfil establecida con éxito! Ha quedado bloqueada para cambios futuros.');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    btnOpenAddModal.addEventListener('click', () => addModal.classList.remove('hidden'));
    btnCloseAddModal.addEventListener('click', () => addModal.classList.add('hidden'));
    btnCancelAddModal.addEventListener('click', () => addModal.classList.add('hidden'));

    modalAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const uid = addUidInput.value.trim().replace(/\D/g, '');
        const days = parseInt(addDaysInput.value, 10);
        const note = addNoteInput.value.trim();

        if (!uid || isNaN(days) || days <= 0) return;

        const now = new Date();
        const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

        const existingIdx = uids.findIndex(i => i.uid === uid);
        if (existingIdx !== -1) {
            uids[existingIdx].days = days;
            uids[existingIdx].note = note || uids[existingIdx].note;
            uids[existingIdx].expiresAt = expiresAt;
            uids[existingIdx].addedBy = currentUser.username;
        } else {
            uids.unshift({
                uid: uid,
                days: days,
                note: note,
                addedBy: currentUser.username,
                createdAt: now.toISOString(),
                expiresAt: expiresAt
            });
        }

        saveUids();
        logSystemEvent('UID', `Licencia UID ${uid} registrada por ${days} días por ${currentUser.username}.`, 'info');
        render();
        sendApiCall('add', { account_id: parseInt(uid, 10), for_days: days });

        addUidInput.value = '';
        addNoteInput.value = '';
        addModal.classList.add('hidden');
    });

    btnOpenAddResellerModal.addEventListener('click', () => addResellerModal.classList.remove('hidden'));
    btnCloseResellerModal.addEventListener('click', () => addResellerModal.classList.add('hidden'));
    btnCancelResellerModal.addEventListener('click', () => addResellerModal.classList.add('hidden'));

    modalResellerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resUser = resellerUsernameInput.value.trim();
        const resPass = resellerPasswordInput.value.trim();
        const resDays = parseInt(resellerDaysInput.value, 10) || 30;

        if (!resUser || !resPass) return;

        if (users.some(u => u.username.toLowerCase() === resUser.toLowerCase())) {
            alert('El nombre de usuario o correo ya existe. Elige otro.');
            return;
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + resDays * 24 * 60 * 60 * 1000).toISOString();

        users.push({
            username: resUser,
            password: resPass,
            role: 'RESELLER',
            avatar: null,
            avatarLocked: false,
            days: resDays,
            createdAt: now.toISOString(),
            expiresAt: expiresAt
        });

        saveUsers();
        logSystemEvent('RESELLER', `Nuevo revendedor "${resUser}" creado por ${currentUser.username} con ${resDays} días de duración.`, 'info');
        render();

        resellerUsernameInput.value = '';
        resellerPasswordInput.value = '';
        addResellerModal.classList.add('hidden');
        alert(`Reseller "${resUser}" creado con éxito por ${resDays} días.`);
    });

    globalSearch.addEventListener('input', () => {
        render();
        const q = globalSearch.value.trim();
        if (q.length >= 4) {
            const targetRow = document.querySelector(`[id*="${q}"]`);
            if (targetRow) {
                targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetRow.style.outline = '2px solid #00c8ff';
                setTimeout(() => targetRow.style.outline = 'none', 3000);
            }
        }
    });

    btnSaveConfig.addEventListener('click', () => {
        apiConfig.url = configApiUrl.value.trim();
        apiConfig.key = configApiKey.value.trim();
        localStorage.setItem(STORAGE_CFG, JSON.stringify(apiConfig));
        logSystemEvent('CONFIG', 'Parámetros de API guardados.', 'info');
        alert('Configuración guardada correctamente.');
    });

    btnTestApiConnection.addEventListener('click', async () => {
        apiTestStatus.textContent = 'Probando conexión...';
        apiTestStatus.style.color = '#00c8ff';
        try {
            const res = await fetch(`${configApiUrl.value.trim()}?action=banners`, {
                headers: { 'X-API-KEY': configApiKey.value.trim() }
            });
            if (res.ok || res.status === 200) {
                apiTestStatus.textContent = '✅ Conexión con la API establecida correctamente.';
                apiTestStatus.style.color = '#00e676';
            } else {
                apiTestStatus.textContent = `⚠️ Servidor respondió con código HTTP ${res.status}`;
                apiTestStatus.style.color = '#ffc400';
            }
        } catch(e) {
            apiTestStatus.textContent = `❌ Error de conexión: ${e.message}`;
            apiTestStatus.style.color = '#ff1744';
        }
    });
}
