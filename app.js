// Registrar Bypass UID Global System - Logic, Anti-Debug Security & Speed Lines
const STORAGE_UIDS  = 'registrar_bypass_uids';
const STORAGE_USERS = 'registrar_bypass_users';
const STORAGE_CFG   = 'registrar_bypass_config';
const STORAGE_SESS  = 'registrar_bypass_session';
const STORAGE_LOGS  = 'registrar_bypass_logs';

// App State
let uids = [];
let users = [];
let systemLogs = [];
let currentUser = null;
let apiConfig = {
    url: 'https://apix.vypermods.com/bypass/vp',
    key: 'VPAPI-88HD63H6RSW78HQSHPHXM3P432HULZ'
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

const btnToggleDarkMode = document.getElementById('btnToggleDarkMode');
const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');

const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.content-view');
const navResellersBtn = document.getElementById('navResellersBtn');

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

// Profile Elements
const profileAvatarPreview = document.getElementById('profileAvatarPreview');
const avatarFileInput = document.getElementById('avatarFileInput');
const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');
const systemLogsBox = document.getElementById('systemLogsBox');

// UID Modal Elements
const addModal = document.getElementById('addModal');
const btnOpenAddModal = document.getElementById('btnOpenAddModal');
const btnCloseAddModal = document.getElementById('btnCloseAddModal');
const btnCancelAddModal = document.getElementById('btnCancelAddModal');
const modalAddForm = document.getElementById('modalAddForm');
const addUidInput = document.getElementById('addUidInput');
const addDaysInput = document.getElementById('addDaysInput');
const addNoteInput = document.getElementById('addNoteInput');
const qDayBtns = document.querySelectorAll('.q-day-btn');

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
    loadUsers();
    loadConfig();
    loadUids();
    loadLogs();
    setupEvents();

    const savedSess = localStorage.getItem(STORAGE_SESS);
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

// 🛡️ MAXIMUM SECURITY & ANTI-DEBUGGING PROTECTION
function initAntiDebuggingProtection() {
    // 1. Bloquear inspeccionar elemento por teclado (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S)
    document.addEventListener('keydown', (e) => {
        if (
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
            (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83)) // Ctrl+U / Ctrl+S
        ) {
            e.preventDefault();
            e.stopPropagation();
            logSystemEvent('SEGURIDAD', 'Intento no autorizado de inspeccionar elemento bloqueado.', 'warn');
            return false;
        }

        // CTRL + K para enfocar la barra de búsqueda
        if (e.ctrlKey && e.keyCode === 75) {
            e.preventDefault();
            if (globalSearch) globalSearch.focus();
        }
    });

    // 2. Bloquear clic derecho (Menú contextual)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // 3. Trap de depuración en bucle para dificultar la inspección con DevTools
    (function antiDebugLoop() {
        try {
            (function() {
                return false;
            })['constructor']('debugger')['call']();
        } catch (e) {}
        setTimeout(antiDebugLoop, 1000);
    })();
}

// ELECTRIC CYBERPUNK SPEED LINES CANVAS
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
    if (!users || users.length === 0 || !spectralExists) {
        users = [
            { username: 'spectralx@gmail.com', password: 'SpectralX', role: 'SUPER ADMIN', avatar: null, createdAt: new Date().toISOString() },
            { username: 'reseller1', password: '123', role: 'RESELLER', avatar: null, createdAt: new Date().toISOString() }
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
    if (systemLogs.length === 0) {
        logSystemEvent('SISTEMA', 'Sistema Registrar Bypass UID Global iniciado correctamente.', 'info');
    }
}

function logSystemEvent(category, message, type = 'info') {
    const logItem = {
        time: new Date().toLocaleTimeString(),
        category: category,
        message: message,
        type: type
    };
    systemLogs.unshift(logItem);
    if (systemLogs.length > 100) systemLogs.pop();
    localStorage.setItem(STORAGE_LOGS, JSON.stringify(systemLogs));
    renderLogsUI();
}

function renderLogsUI() {
    if (!systemLogsBox) return;
    systemLogsBox.innerHTML = '';
    systemLogs.forEach(l => {
        const div = document.createElement('div');
        div.className = 'log-line';
        div.innerHTML = `<span class="log-time">[${l.time}]</span> <span class="log-${l.type}">[${l.category}]</span> <span>${sanitizeHtml(l.message)}</span>`;
        systemLogsBox.appendChild(div);
    });
}

function sanitizeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showApp() {
    loginScreen.classList.add('hidden');
    appLayout.classList.remove('hidden');

    const name = currentUser.username;
    const role = currentUser.role;

    userDisplayName.textContent = name === 'spectralx@gmail.com' ? 'SpectralX' : name;
    userRoleBadge.textContent = role === 'SUPER ADMIN' || role === 'ADMIN' ? 'SUPER ADMIN' : 'RESELLER';
    
    footerUserLabel.textContent = name;
    footerRoleLabel.textContent = role === 'SUPER ADMIN' || role === 'ADMIN' ? 'SUPER ADMIN' : 'RESELLER';

    updateAvatarUI();

    if (role !== 'ADMIN' && role !== 'SUPER ADMIN') {
        navResellersBtn.style.display = 'none';
    } else {
        navResellersBtn.style.display = 'flex';
    }

    logSystemEvent('AUTENTICACIÓN', `Sesión iniciada por el usuario ${name} (${role}).`, 'info');
    render();
}

function updateAvatarUI() {
    if (!currentUser) return;
    const name = currentUser.username;
    const avatar = currentUser.avatar;

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
}

function logout() {
    logSystemEvent('AUTENTICACIÓN', `Sesión cerrada por ${currentUser ? currentUser.username : 'Usuario'}.`, 'warn');
    localStorage.removeItem(STORAGE_SESS);
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

    let total = uids.length;
    let active = 0, warning = 0, expired = 0;

    uids.forEach(item => {
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

    // BUSCADOR EN TIEMPO REAL CON LA LUPITA
    uidsTableBody.innerHTML = '';
    const q = globalSearch.value.toLowerCase().trim();

    const filtered = uids.filter(item => {
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
            tr.innerHTML = `
                <td><span class="uid-font">${sanitizeHtml(item.uid)}</span></td>
                <td>${sanitizeHtml(item.note) || '<span style="color:var(--text-muted)">-</span>'}</td>
                <td><span class="badge purple">👤 ${sanitizeHtml(addedBy)}</span></td>
                <td>${item.days} días</td>
                <td>${created}</td>
                <td>${expires}</td>
                <td><span class="timer-ticker ${timerInfo.isExpired ? 'expired' : ''}" data-expires="${item.expiresAt}">${timerInfo.text}</span></td>
                <td>${getBadgeHtml(timerInfo.days)}</td>
                <td class="text-right">
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
        const userAvatarHtml = u.avatar ? `<img src="${u.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;">` : '👤 ';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:#fff;">${userAvatarHtml}${sanitizeHtml(u.username)}</strong></td>
            <td><code style="color:var(--accent-cyan);">${sanitizeHtml(u.password)}</code></td>
            <td><span class="badge ${u.role === 'SUPER ADMIN' || u.role === 'ADMIN' ? 'purple' : 'green'}">${u.role}</span></td>
            <td>${createdDate}</td>
            <td><strong>${uidsCreatedCount} UIDs</strong></td>
            <td class="text-right">
                ${u.username.toLowerCase() !== 'spectralx@gmail.com' ? `<button class="btn-delete-row" onclick="deleteReseller('${u.username}')">🗑️ Eliminar</button>` : '<span style="color:var(--text-muted)">Super Admin</span>'}
            </td>
        `;
        resellersTableBody.appendChild(tr);
    });
}

window.removeUid = (uid) => {
    if (confirm(`¿Eliminar la licencia para el UID ${uid}?`)) {
        uids = uids.filter(i => i.uid !== uid);
        saveUids();
        logSystemEvent('UID', `Licencia para UID ${uid} eliminada.`, 'warn');
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
            headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiConfig.key },
            body: JSON.stringify(payload)
        });
    } catch(e){}
}

function setupEvents() {
    if (btnOpenMobileMenu) btnOpenMobileMenu.addEventListener('click', openMobileMenu);
    if (btnCloseMobileSidebar) btnCloseMobileSidebar.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    // Toggle Mostrar/Ocultar Contraseña
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

    // Toggle Pantalla Completa
    if (btnToggleFullscreen) {
        btnToggleFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        });
    }

    // Login Form Submit (con bloqueo de fuerza bruta)
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
            (u.username.toLowerCase() === user.toLowerCase() || (user.toLowerCase() === 'spectralx' && u.username.toLowerCase() === 'spectralx@gmail.com')) 
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
                loginLockoutTime = Date.now() + 60000; // 60s lockout
                loginErrorMsg.textContent = '🚫 Demasiados intentos fallidos. Sistema bloqueado por 60 segundos por seguridad.';
                logSystemEvent('SEGURIDAD', `Bloqueo temporal por intentos fallidos repetidos desde IP local.`, 'err');
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
            if (targetView === 'resellers') document.getElementById('viewResellers').classList.add('active');
            if (targetView === 'profile') document.getElementById('viewProfile').classList.add('active');
            if (targetView === 'config') document.getElementById('viewConfig').classList.add('active');
            if (targetView === 'logs') document.getElementById('viewLogs').classList.add('active');
            if (targetView === 'support') document.getElementById('viewSupport').classList.add('active');
            closeMobileMenu();
        });
    });

    // Subir Foto / Logo de Perfil
    if (avatarFileInput) {
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Image = event.target.result;
                    currentUser.avatar = base64Image;
                    
                    const uIdx = users.findIndex(u => u.username === currentUser.username);
                    if (uIdx !== -1) {
                        users[uIdx].avatar = base64Image;
                        saveUsers();
                    }
                    localStorage.setItem(STORAGE_SESS, JSON.stringify(currentUser));
                    updateAvatarUI();
                    logSystemEvent('PERFIL', 'Logotipo/Foto de perfil actualizada.', 'info');
                    render();
                    alert('¡Foto / Logo actualizado correctamente!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemoveAvatar) {
        btnRemoveAvatar.addEventListener('click', () => {
            if (confirm('¿Quitar tu foto de perfil?')) {
                currentUser.avatar = null;
                const uIdx = users.findIndex(u => u.username === currentUser.username);
                if (uIdx !== -1) {
                    users[uIdx].avatar = null;
                    saveUsers();
                }
                localStorage.setItem(STORAGE_SESS, JSON.stringify(currentUser));
                updateAvatarUI();
                render();
            }
        });
    }

    // Modal Add UID
    btnOpenAddModal.addEventListener('click', () => addModal.classList.remove('hidden'));
    btnCloseAddModal.addEventListener('click', () => addModal.classList.add('hidden'));
    btnCancelAddModal.addEventListener('click', () => addModal.classList.add('hidden'));

    qDayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            qDayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            addDaysInput.value = btn.dataset.days;
        });
    });

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

    // Modal Add Reseller
    btnOpenAddResellerModal.addEventListener('click', () => addResellerModal.classList.remove('hidden'));
    btnCloseResellerModal.addEventListener('click', () => addResellerModal.classList.add('hidden'));
    btnCancelResellerModal.addEventListener('click', () => addResellerModal.classList.add('hidden'));

    modalResellerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resUser = resellerUsernameInput.value.trim();
        const resPass = resellerPasswordInput.value.trim();

        if (!resUser || !resPass) return;

        if (users.some(u => u.username.toLowerCase() === resUser.toLowerCase())) {
            alert('El nombre de usuario o correo ya existe. Elige otro.');
            return;
        }

        users.push({
            username: resUser,
            password: resPass,
            role: 'RESELLER',
            avatar: null,
            createdAt: new Date().toISOString()
        });

        saveUsers();
        logSystemEvent('RESELLER', `Nuevo revendedor "${resUser}" creado por ${currentUser.username}.`, 'info');
        render();

        resellerUsernameInput.value = '';
        resellerPasswordInput.value = '';
        addResellerModal.classList.add('hidden');
        alert(`Reseller "${resUser}" creado con éxito.`);
    });

    // Buscador global
    globalSearch.addEventListener('input', render);

    // Save Config
    btnSaveConfig.addEventListener('click', () => {
        apiConfig.url = configApiUrl.value.trim();
        apiConfig.key = configApiKey.value.trim();
        localStorage.setItem(STORAGE_CFG, JSON.stringify(apiConfig));
        logSystemEvent('CONFIG', 'Parámetros de API guardados.', 'info');
        alert('Configuración guardada correctamente.');
    });

    // Test API Connection
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
