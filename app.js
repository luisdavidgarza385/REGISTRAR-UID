// Selling Panel - Admin & Reseller Logic
const STORAGE_KEY = 'selling_panel_uids';
const CONFIG_KEY  = 'selling_panel_config';

// App State
let uids = [];
let currentUser = null;
let apiConfig = {
    url: 'https://apix.vypermods.com/bypass/vp',
    key: 'VPAPI-88HD63H6RSW78HQSHPHXM3P432HULZ'
};

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');

const appLayout = document.getElementById('appLayout');
const userDisplayName = document.getElementById('userDisplayName');
const btnLogout = document.getElementById('btnLogout');

const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.content-view');

const uidsTableBody = document.getElementById('uidsTableBody');
const uidsEmptyState = document.getElementById('uidsEmptyState');
const uidCountLabel = document.getElementById('uidCountLabel');
const globalSearch = document.getElementById('globalSearch');

// Counter Elements
const cntTotal = document.getElementById('cntTotal');
const cntActive = document.getElementById('cntActive');
const cntWarning = document.getElementById('cntWarning');
const cntExpired = document.getElementById('cntExpired');

// Modal Elements
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadUids();
    setupEvents();

    // Check saved session
    const savedUser = localStorage.getItem('selling_panel_session');
    if (savedUser) {
        currentUser = savedUser;
        showApp();
    }
});

function loadConfig() {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
        try { apiConfig = JSON.parse(saved); } catch(e){}
    }
    configApiUrl.value = apiConfig.url;
    configApiKey.value = apiConfig.key;
}

function loadUids() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try { uids = JSON.parse(saved); } catch(e){ uids = []; }
    } else {
        uids = [];
    }
}

function saveUids() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uids));
}

function showApp() {
    loginScreen.style.display = 'none';
    appLayout.style.display = 'flex';
    userDisplayName.textContent = currentUser || 'admin';
    render();
}

function logout() {
    localStorage.removeItem('selling_panel_session');
    currentUser = null;
    appLayout.style.display = 'none';
    loginScreen.style.display = 'flex';
}

function getDaysLeft(expiresAt) {
    const expiry = new Date(expiresAt);
    const now = new Date();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

function getBadgeHtml(daysLeft) {
    if (daysLeft <= 0) {
        return `<span class="badge red">Expirado</span>`;
    } else if (daysLeft <= 3) {
        return `<span class="badge yellow">Por Vencer (${daysLeft}d)</span>`;
    } else {
        return `<span class="badge green">Activo (${daysLeft}d)</span>`;
    }
}

function render() {
    // Render Stats
    let total = uids.length;
    let active = 0, warning = 0, expired = 0;

    uids.forEach(item => {
        const d = getDaysLeft(item.expiresAt);
        if (d <= 0) expired++;
        else if (d <= 3) { warning++; active++; }
        else active++;
    });

    cntTotal.textContent = total;
    cntActive.textContent = active;
    cntWarning.textContent = warning;
    cntExpired.textContent = expired;
    uidCountLabel.textContent = total;

    // Render Table
    uidsTableBody.innerHTML = '';
    const q = globalSearch.value.toLowerCase().trim();

    const filtered = uids.filter(item => {
        return item.uid.toLowerCase().includes(q) || (item.note && item.note.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
        uidsEmptyState.classList.remove('hidden');
    } else {
        uidsEmptyState.classList.add('hidden');
        filtered.forEach(item => {
            const d = getDaysLeft(item.expiresAt);
            const created = new Date(item.createdAt).toLocaleDateString();
            const expires = new Date(item.expiresAt).toLocaleDateString();

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="uid-font">${item.uid}</span></td>
                <td>${item.note || '<span style="color:var(--text-muted)">-</span>'}</td>
                <td>${item.days} días</td>
                <td>${created}</td>
                <td>${expires}</td>
                <td>${getBadgeHtml(d)}</td>
                <td class="text-right">
                    <button class="btn-delete-row" onclick="removeUid('${item.uid}')">🗑️ Eliminar</button>
                </td>
            `;
            uidsTableBody.appendChild(tr);
        });
    }
}

window.removeUid = (uid) => {
    if (confirm(`¿Eliminar la licencia para el UID ${uid}?`)) {
        uids = uids.filter(i => i.uid !== uid);
        saveUids();
        render();
        sendApiCall('remove', { account_id: parseInt(uid, 10) });
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
    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUser = loginUsername.value.trim() || 'admin';
        localStorage.setItem('selling_panel_session', currentUser);
        showApp();
    });

    // Logout
    btnLogout.addEventListener('click', logout);

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
            if (targetView === 'config') document.getElementById('viewConfig').classList.add('active');
        });
    });

    // Modal Add UID
    btnOpenAddModal.addEventListener('click', () => addModal.classList.remove('hidden'));
    btnCloseAddModal.addEventListener('click', () => addModal.classList.add('hidden'));
    btnCancelAddModal.addEventListener('click', () => addModal.classList.add('hidden'));

    // Preset Days Buttons
    qDayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            qDayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            addDaysInput.value = btn.dataset.days;
        });
    });

    // Form Add UID Submit
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
        } else {
            uids.unshift({
                uid: uid,
                days: days,
                note: note,
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

    // Global Search Filter
    globalSearch.addEventListener('input', render);

    // Save Config
    btnSaveConfig.addEventListener('click', () => {
        apiConfig.url = configApiUrl.value.trim();
        apiConfig.key = configApiKey.value.trim();
        localStorage.setItem(CONFIG_KEY, JSON.stringify(apiConfig));
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
