/**
 * admin.js — Admin dashboard logic for managing portfolio projects
 * (Supabase-backed: all data operations are async)
 */

const els = {
  tableBody: document.getElementById('tableBody'),
  tableEmpty: document.getElementById('tableEmpty'),
  tableCount: document.getElementById('tableCount'),
  searchInput: document.getElementById('searchInput'),
  statTotal: document.getElementById('statTotal'),
  statWeb: document.getElementById('statWeb'),
  statMc: document.getElementById('statMc'),
  statPy: document.getElementById('statPy'),
  recentList: document.getElementById('recentList'),

  modalOverlay: document.getElementById('projectModal'),
  modalTitle: document.getElementById('pmTitle'),
  form: document.getElementById('projectForm'),
  fId: document.getElementById('fId'),
  fTitle: document.getElementById('fTitle'),
  fCategory: document.getElementById('fCategory'),
  fTag: document.getElementById('fTag'),
  fImage: document.getElementById('fImage'),
  fLink: document.getElementById('fLink'),
  fDesc: document.getElementById('fDesc'),

  confirmOverlay: document.getElementById('confirmModal'),
  confirmText: document.getElementById('confirmText'),

  toastContainer: document.getElementById('toastContainer'),

  sidebarUsername: document.getElementById('sidebarUsername'),
};

let deleteTargetId = null;
let currentSearch = '';
let cachedProjects = [];

/* ---------- render ---------- */
async function refreshAll() {
  cachedProjects = await getProjects();
  renderTable();
  renderStats();
  renderRecent();
}

function renderTable() {
  const q = currentSearch.trim().toLowerCase();
  const list = q
    ? cachedProjects.filter(p => (p.title + ' ' + p.tag + ' ' + p.description).toLowerCase().includes(q))
    : cachedProjects;

  els.tableCount.textContent = `${list.length} project${list.length === 1 ? '' : 's'}`;

  if (!list.length) {
    els.tableBody.innerHTML = '';
    els.tableEmpty.style.display = 'block';
    return;
  }
  els.tableEmpty.style.display = 'none';

  els.tableBody.innerHTML = list.map(p => `
    <tr>
      <td>
        <div class="table-name">
          <div class="table-thumb">${p.image ? `<img src="${escapeHtml(p.image)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : '📦'}</div>
          ${escapeHtml(p.title)}
        </div>
      </td>
      <td><span class="table-version">${escapeHtml(p.tag || '—')}</span></td>
      <td><span class="table-category">${escapeHtml(p.category)}</span></td>
      <td class="table-desc" title="${escapeHtml(p.description || '')}">${escapeHtml(p.description || '')}</td>
      <td>${p.link && p.link !== '#' ? `<a class="table-link" href="${escapeHtml(p.link)}" target="_blank">${escapeHtml(p.link)}</a>` : '—'}</td>
      <td>
        <div class="table-actions">
          <button class="action-btn edit" onclick="openEditModal('${p.id}')" aria-label="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button class="action-btn delete" onclick="openDeleteConfirm('${p.id}')" aria-label="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderStats() {
  els.statTotal.textContent = cachedProjects.length;
  els.statWeb.textContent = cachedProjects.filter(p => p.category === 'web').length;
  els.statMc.textContent = cachedProjects.filter(p => p.category === 'minecraft').length;
  els.statPy.textContent = cachedProjects.filter(p => p.category === 'python').length;
}

function renderRecent() {
  const all = cachedProjects.slice(0, 4);
  if (!els.recentList) return;
  if (!all.length) {
    els.recentList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No projects yet.</p>';
    return;
  }
  els.recentList.innerHTML = all.map(p => `
    <div class="recent-row">
      <div class="recent-img">${p.image ? `<img src="${escapeHtml(p.image)}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : '📦'}</div>
      <div class="recent-info">
        <div class="recent-name">${escapeHtml(p.title)}</div>
        <div class="recent-desc">${escapeHtml(p.description || '')}</div>
      </div>
      <span class="recent-version">${escapeHtml(p.tag || '')}</span>
    </div>
  `).join('');
}

/* ---------- modal: add / edit ---------- */
function openAddModal() {
  els.modalTitle.textContent = 'Add Project';
  els.form.reset();
  els.fId.value = '';
  els.modalOverlay.classList.add('active');
}

function openEditModal(id) {
  const p = cachedProjects.find(x => x.id === id);
  if (!p) return;
  els.modalTitle.textContent = 'Edit Project';
  els.fId.value = p.id;
  els.fTitle.value = p.title;
  els.fCategory.value = p.category;
  els.fTag.value = p.tag || '';
  els.fImage.value = p.image || '';
  els.fLink.value = p.link || '';
  els.fDesc.value = p.description || '';
  els.modalOverlay.classList.add('active');
}

function closeProjectModal() {
  els.modalOverlay.classList.remove('active');
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    title: els.fTitle.value.trim(),
    category: els.fCategory.value,
    tag: els.fTag.value.trim(),
    image: els.fImage.value.trim(),
    link: els.fLink.value.trim() || '#',
    desc: els.fDesc.value.trim()
  };
  if (!data.title) { showToast('Title is required', 'error'); return; }

  const submitBtn = els.form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    if (els.fId.value) {
      await updateProject(els.fId.value, data);
      showToast('Project updated', 'success');
    } else {
      await addProject(data);
      showToast('Project added', 'success');
    }
    closeProjectModal();
    await refreshAll();
  } catch (err) {
    showToast(err.message || 'Something went wrong', 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

/* ---------- delete confirm ---------- */
function openDeleteConfirm(id) {
  deleteTargetId = id;
  const p = cachedProjects.find(x => x.id === id);
  els.confirmText.textContent = `This will permanently remove "${p ? p.title : 'this project'}" from your portfolio.`;
  els.confirmOverlay.classList.add('active');
}

function closeConfirm() {
  deleteTargetId = null;
  els.confirmOverlay.classList.remove('active');
}

async function confirmDelete() {
  if (deleteTargetId) {
    try {
      await deleteProject(deleteTargetId);
      showToast('Project deleted', 'success');
      await refreshAll();
    } catch (err) {
      showToast(err.message || 'Could not delete project', 'error');
    }
  }
  closeConfirm();
}

/* ---------- toasts ---------- */
function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  els.toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 300);
  }, 2400);
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str == null ? '' : str;
  return d.innerHTML;
}

/* ---------- search ---------- */
if (els.searchInput) {
  els.searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderTable();
  });
}

/* ---------- sidebar / navigation ---------- */
document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('topbarTitle').textContent = link.dataset.title || 'Dashboard';
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  });
});

const hamburgerBtn = document.getElementById('topbarMenu');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('active');
  });
}
const sidebarClose = document.getElementById('sidebarClose');
if (sidebarClose) {
  sidebarClose.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
  });
}
const sidebarOverlay = document.getElementById('sidebarOverlay');
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
}

document.getElementById('logoutBtn').addEventListener('click', adminLogout);

/* ---------- init ---------- */
(async () => {
  await requireAuth();
  const email = await getCurrentUserEmail();
  if (email) els.sidebarUsername.textContent = email;
  await refreshAll();
})();
