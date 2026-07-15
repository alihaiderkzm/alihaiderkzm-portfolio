/**
 * supabase-config.js
 * Requires the Supabase JS CDN script to be loaded first:
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
 */

const SUPABASE_URL = 'https://blsedknkchudwqfsoazm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsc2Vka25rY2h1ZHdxZnNvYXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzA1ODgsImV4cCI6MjA5OTUwNjU4OH0.k3vTYpU4sRsLgrrcis2OEd_TtGkuEOo7jIh2JGOqBaQ';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
