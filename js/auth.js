/**
 * auth.js — Supabase-backed authentication
 * The actual password check happens on Supabase's servers, never in this
 * file. This script only asks Supabase "is this email/password correct?"
 * and stores the session token Supabase gives back.
 */

async function adminLogin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, session: data.session };
}

async function adminLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

async function isAdminAuthenticated() {
  const { data } = await supabaseClient.auth.getSession();
  return !!data.session;
}

async function requireAuth() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    window.location.href = 'login.html';
  }
}

async function getCurrentUserEmail() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user ? data.user.email : '';
}
