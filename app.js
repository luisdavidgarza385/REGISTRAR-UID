// SpectralX Registrar Bypass UID Global - Logic, Live Countdown & Avatar Upload
const STORAGE_UIDS  = 'registrar_bypass_uids';
const STORAGE_USERS = 'registrar_bypass_users';
const STORAGE_CFG   = 'registrar_bypass_config';
const STORAGE_SESS  = 'registrar_bypass_session';

// State
let uids = [];
let users = [];
let currentUser = null;
let apiConfig = {
    url: 'https://apix.vypermods.com/bypass/vp',
    key: 'VPAPI-88HD63H6RSW78HQSHPHXM3P432HULZ'
};
let countdownInterval = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const loginLogoPreview = document.getElementById('loginLogoPreview');

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
    initCanvasWaves();
    loadUsers();
    loadConfig();
    loadUids();
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

    // Iniciar temporizador en tiempo real (cada 1 segundo)
    startLiveTimerTicker();
});

// CANVAS LASER WAVES ANIMATION (60 FPS FLUID)
function initCanvasWaves() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    let step = 0;
    const waves = [
        { amplitude: 45, frequency: 0.006, speed: 0.02, color: 'rgba(192, 132, 252, 0.45)', lineWidth: 3 },
        { amplitude: 60, frequency: 0.004, speed: 0.015, color: 'rgba(168, 85, 247, 0.35)', lineWidth: 2.5 },
        { amplitude: 75, frequency: 0.003, speed: 0.01, color: 'rgba(147, 51, 234, 0.25)', lineWidth: 2 },
        { amplitude: 90, frequency: 0.002, speed: 0.008, color: 'rgba(126, 34, 206, 0.2)', lineWidth: 1.5 }
    ];

    function animate() {
        ctx.clearRect(0, 0, width, height);
        step += 1;

        waves.forEach((w, index) => {
            ctx.beginPath();
            ctx.lineWidth = w.lineWidth;
            ctx.strokeStyle = w.color;
            ctx.shadowBlur = 18;
            ctx.shadowColor = '#a855f7';

            const centerY = height * 0.65 + index * 25;
            for (let x = 0; x < width; x += 5) {
                const y = centerY + Math.sin(x * w.frequency + step * w.speed) * w.amplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#c084fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#e9d5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        profileAvatarPreview.innerHTML = `<span>${char}</span>`;
    }
}

function logout() {
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

// CÁLCULO DE TIEMPO EXACTO EN DÍAS, HORAS, MINUTOS Y SEGUNDOS
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
                <td><span class="uid-font">${item.uid}</span></td>
                <td>${item.note || '<span style="color:var(--text-muted)">-</span>'}</td>
                <td><span class="badge purple">👤 ${addedBy}</span></td>
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
}

function renderResellersTable() {
    resellersTableBody.innerHTML = '';
    users.forEach(u => {
        const uidsCreatedCount = uids.filter(i => i.addedBy === u.username).length;
        const createdDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Sistema';
        const userAvatarHtml = u.avatar ? `<img src="${u.avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;">` : '👤 ';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color:#fff;">${userAvatarHtml}${u.username}</strong></td>
            <td><code style="color:#c084fc;">${u.password}</code></td>
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
        render();
        sendApiCall('remove', { account_id: parseInt(uid, 10) });
    }
};

window.deleteReseller = (username) => {
    if (confirm(`¿Estás seguro de borrar al revendedor "${username}"?`)) {
        users = users.filter(u => u.username !== username);
        saveUsers();
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

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = loginUsername.value.trim();
        const pass = loginPassword.value.trim();

        const found = users.find(u => 
            (u.username.toLowerCase() === user.toLowerCase() || (user.toLowerCase() === 'spectralx' && u.username.toLowerCase() === 'spectralx@gmail.com')) 
            && u.password === pass
        );

        if (found) {
            currentUser = found;
            localStorage.setItem(STORAGE_SESS, JSON.stringify(found));
            showApp();
        } else {
            loginErrorMsg.textContent = '❌ Usuario o contraseña incorrectos';
            loginErrorMsg.classList.remove('hidden');
        }
    });

    btnLogout.addEventListener('click', logout);

    // Click Topbar Profile Avatar to go to Profile
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
                    
                    // Guardar en array de usuarios
                    const uIdx = users.findIndex(u => u.username === currentUser.username);
                    if (uIdx !== -1) {
                        users[uIdx].avatar = base64Image;
                        saveUsers();
                    }
                    localStorage.setItem(STORAGE_SESS, JSON.stringify(currentUser));
                    updateAvatarUI();
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
        render();

        resellerUsernameInput.value = '';
        resellerPasswordInput.value = '';
        addResellerModal.classList.add('hidden');
        alert(`Reseller "${resUser}" creado con éxito.`);
    });

    // BUSCADOR EN TIEMPO REAL AL ESCRIBIR EN LA LUPITA 🔍
    globalSearch.addEventListener('input', render);

    // Save Config
    btnSaveConfig.addEventListener('click', () => {
        apiConfig.url = configApiUrl.value.trim();
        apiConfig.key = configApiKey.value.trim();
        localStorage.setItem(STORAGE_CFG, JSON.stringify(apiConfig));
        alert('Configuración guardada correctamente.');
    });

    // Test API Connection
    btnTestApiConnection.addEventListener('click', async () => {
        apiTestStatus.textContent = 'Probando conexión...';
        apiTestStatus.style.color = '#c084fc';
        try {
            const res = await fetch(`${configApiUrl.value.trim()}?action=banners`, {
                headers: { 'X-API-KEY': configApiKey.value.trim() }
            });
            if (res.ok || res.status === 200) {
                apiTestStatus.textContent = '✅ Conexión con la API establecida correctamente.';
                apiTestStatus.style.color = '#4ade80';
            } else {
                apiTestStatus.textContent = `⚠️ Servidor respondió con código HTTP ${res.status}`;
                apiTestStatus.style.color = '#facc15';
            }
        } catch(e) {
            apiTestStatus.textContent = `❌ Error de conexión: ${e.message}`;
            apiTestStatus.style.color = '#f87171';
        }
    });
}
