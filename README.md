<div align="center">

# 👋 Ali Haider Kazim
### `alihaider.kzm`

**Full Stack Developer • Frontend Web Developer • Python Tool Builder • Minecraft Plugin & Server Developer**

📍 Faisalabad, Pakistan

[![Portfolio](https://img.shields.io/badge/Portfolio-alihaiderkzm.netlify.app-DA22FF?style=for-the-badge&logo=netlify&logoColor=white)](https://alihaiderkzm.netlify.app/)
[![Instagram](https://img.shields.io/badge/Instagram-alihaider.kzm-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/alihaider.kzm)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Chat-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/923318365450)

</div>

---

## 🚀 About This Project

This is my personal developer portfolio — a single-page site built from scratch to showcase who I am, what I build, and the work I've shipped. No templates, no page builders — every animation, layout, and interaction here is hand-coded.

**Live site:** [alihaiderkzm.netlify.app](https://alihaiderkzm.netlify.app/)

---

## ✨ Features

- 🎨 **Custom animated UI** — scroll-triggered reveals, magnetic buttons, and a live typing effect
- 🌌 **3D hero visual** — an interactive Three.js scene that reacts to cursor movement
- 🕸️ **Constellation background** — a canvas-based particle network that responds to scroll and mouse position
- 📦 **Dynamic projects grid** — powered by Supabase, with a private admin panel to add/edit/delete projects without touching code
- 🔍 **SEO-ready** — Open Graph tags, Twitter Cards, JSON-LD Person schema, sitemap, and build-time static rendering so search engines see real content on first load
- 📱 **Fully responsive** — tuned breakpoints from large desktops down to small phones
- ⚡ **Fast & lightweight hosting** — deployed on Netlify with an automated build step

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Structure & Styling | HTML5, CSS3 (custom, no framework) |
| Animation | [GSAP](https://gsap.com/) + ScrollTrigger |
| 3D Graphics | [Three.js](https://threejs.org/) |
| Data / Backend | [Supabase](https://supabase.com/) (Postgres + Row Level Security) |
| Hosting / CI | [Netlify](https://www.netlify.com/) |
| Build Tooling | Node.js (build-time project pre-rendering) |

---

## 📁 Project Structure

```
alihaiderkzm-portfolio/
├── index.html              # Main site (structure, styles, animations)
├── login.html               # Admin login for managing projects
├── js/
│   ├── supabase-config.js   # Supabase client setup
│   └── projects.js          # Fetch, render & manage the projects grid
├── scripts/
│   └── build-projects.mjs   # Build-time script: bakes live projects into HTML for SEO
├── sitemap.xml
├── netlify.toml              # Netlify build & deploy config
└── package.json
```

---

## ⚙️ How the Projects System Works

Projects aren't hardcoded — they live in a Supabase table and are:

1. **Managed** through a private admin panel (add / edit / delete), protected by Supabase Auth + Row Level Security (public users can only *read*)
2. **Rendered live** in the browser via `js/projects.js`
3. **Pre-rendered at build time** via `scripts/build-projects.mjs`, so the very first HTML response already contains real project cards — great for SEO and for anyone with JavaScript disabled

---

## 📬 Contact

Open to web projects, Python tooling work, or Minecraft plugin/server development.

- **Instagram:** [@alihaider.kzm](https://instagram.com/alihaider.kzm)
- **WhatsApp:** [+92 331 8365450](https://wa.me/923318365450)
- **Discord:** `alihaider.kzm`
- **Email:** alihumai777@gmail.com

---

<div align="center">

**Built with ☕ and a lot of late nights.**

© 2026 Ali Haider Kazim — `alihaider.kzm`

</div>
