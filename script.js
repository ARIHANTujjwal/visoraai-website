const html = document.documentElement;
html.classList.remove("no-js");

const menuButton = document.querySelector("[data-menu-button]");
const navMenu = document.querySelector("[data-nav-menu]");
const drawer = document.querySelector("[data-settings-panel]");
const openDrawerButtons = document.querySelectorAll("[data-settings-open]");
const closeDrawerButtons = document.querySelectorAll("[data-settings-close]");
const contrastButton = document.querySelector("[data-toggle-contrast]");
const textButton = document.querySelector("[data-toggle-text]");
const motionButton = document.querySelector("[data-toggle-motion]");

const KEYS = {
  contrast: "visoraai_high_contrast",
  text: "visoraai_large_text",
  motion: "visoraai_reduce_motion"
};

function closeMenu() {
  if (!menuButton || !navMenu) return;
  menuButton.classList.remove("is-open");
  navMenu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!menuButton || !navMenu) return;
  const open = menuButton.classList.toggle("is-open");
  navMenu.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}

function openSettings() {
  if (!drawer) return;
  closeMenu();
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeSettings() {
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function stored(key) {
  return window.localStorage.getItem(key) === "true";
}

function setStored(key, value) {
  window.localStorage.setItem(key, String(value));
}

function press(button, active) {
  if (button) button.setAttribute("aria-pressed", String(active));
}

function applyPrefs() {
  const contrast = stored(KEYS.contrast);
  const text = stored(KEYS.text);
  const motion = stored(KEYS.motion);
  document.body.classList.toggle("high-contrast", contrast);
  document.body.classList.toggle("large-text", text);
  document.body.classList.toggle("reduce-motion", motion);
  press(contrastButton, contrast);
  press(textButton, text);
  press(motionButton, motion);
}

function togglePref(key, className, button) {
  const active = !document.body.classList.contains(className);
  document.body.classList.toggle(className, active);
  setStored(key, active);
  press(button, active);
}

if (menuButton) menuButton.addEventListener("click", toggleMenu);
if (navMenu) {
  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });
}
openDrawerButtons.forEach((button) => button.addEventListener("click", openSettings));
closeDrawerButtons.forEach((button) => button.addEventListener("click", closeSettings));
if (contrastButton) contrastButton.addEventListener("click", () => togglePref(KEYS.contrast, "high-contrast", contrastButton));
if (textButton) textButton.addEventListener("click", () => togglePref(KEYS.text, "large-text", textButton));
if (motionButton) motionButton.addEventListener("click", () => togglePref(KEYS.motion, "reduce-motion", motionButton));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeSettings();
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".section-head, .module-card, .benefit-panel, .start-item, .detail-block, .process-link, .research-item, .diagram-box").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

applyPrefs();
