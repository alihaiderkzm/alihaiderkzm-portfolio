/**
 * projects.js — shared project data layer, backed by Supabase.
 * Public visitors can only READ (enforced by Row Level Security).
 * Only a logged-in admin session can insert/update/delete.
 */

async function getProjects() {
  const { data, error } = await supabaseClient
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getProjects error:', error.message);
    return [];
  }
  return data;
}

async function addProject(project) {
  const { data, error } = await supabaseClient
    .from('projects')
    .insert([{
      title: project.title,
      category: project.category,
      tag: project.tag,
      image: project.image,
      link: project.link,
      description: project.desc
    }])
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

async function updateProject(id, updates) {
  const { data, error } = await supabaseClient
    .from('projects')
    .update({
      title: updates.title,
      category: updates.category,
      tag: updates.tag,
      image: updates.image,
      link: updates.link,
      description: updates.desc
    })
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

async function deleteProject(id) {
  const { error } = await supabaseClient.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/* ---------- Public site rendering (index.html) ---------- */

function projectIconSVG(category) {
  if (category === 'minecraft') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
  }
  if (category === 'python') {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>';
}

async function renderPublicProjects() {
  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('projectsEmpty');
  if (!grid) return;

  const projects = await getProjects();

  if (!projects.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = projects.map(p => `
    <a class="pcard reveal" href="${p.link && p.link !== '#' ? p.link : '#'}" ${p.link && p.link !== '#' ? 'target="_blank" rel="noopener"' : 'onclick="return false;"'}>
      <div class="pcard-media">
        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}">` : `<div class="pcard-icon">${projectIconSVG(p.category)}</div>`}
      </div>
      <div class="pcard-body">
        <span class="pcard-tag">${escapeHtml(p.tag || 'Project')}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.description || '')}</p>
      </div>
    </a>
  `).join('');

  if (window.gsap) {
    gsap.set('.pcard.reveal', { opacity: 0, y: 30 });
    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: grid, start: 'top 85%', once: true,
        onEnter: () => gsap.to('.pcard.reveal', { opacity: 1, y: 0, duration: .7, stagger: .09, ease: 'power3.out' })
      });
    } else {
      gsap.to('.pcard.reveal', { opacity: 1, y: 0, duration: .5, stagger: .08 });
    }
  }
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str == null ? '' : str;
  return d.innerHTML;
}

document.addEventListener('DOMContentLoaded', renderPublicProjects);
