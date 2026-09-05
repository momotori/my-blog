const HLJS_LIGHT_HREF =
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css";
const HLJS_DARK_HREF =
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/dracula.min.css";

function applyHljsTheme(theme) {
  const link = document.getElementById("hljs-theme");
  if (!link) return;
  link.href = theme === "dark" ? HLJS_DARK_HREF : HLJS_LIGHT_HREF;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* ignore */
  }
  applyHljsTheme(theme);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

export function initThemeToggle() {
  const currentTheme = document.documentElement.dataset.theme || "light";
  applyHljsTheme(currentTheme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  toggle.setAttribute("aria-pressed", currentTheme === "dark" ? "true" : "false");
  toggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  toggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
  });
}
