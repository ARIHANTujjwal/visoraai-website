const html = document.documentElement;
html.classList.remove("no-js");

const menuButton = document.querySelector("[data-menu-button]");
const navMenu = document.querySelector("[data-nav-menu]");
const settingsPanel = document.querySelector("[data-settings-panel]");
const settingsOpenButtons = document.querySelectorAll("[data-settings-open]");
const settingsCloseButtons = document.querySelectorAll("[data-settings-close]");
const filterButtons = document.querySelectorAll("[data-filter]");
const workCards = document.querySelectorAll("[data-category]");

const contrastButton = document.querySelector("[data-toggle-contrast]");
const textButton = document.querySelector("[data-toggle-text]");
const motionButton = document.querySelector("[data-toggle-motion]");

const STORAGE_KEYS = {
  contrast: "visoraai_high_contrast",
  text: "visoraai_large_text",
  motion: "visoraai_reduce_motion"
};

function closeMenu() {
  if (!menuButton || !navMenu) return;
  document.body.classList.remove("menu-open");
  menuButton.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
}

function toggleMenu() {
  if (!menuButton || !navMenu) return;
  const isOpen = menuButton.classList.toggle("is-open");
  navMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
}

function openSettings() {
  if (!settingsPanel) return;
  closeMenu();
  settingsPanel.classList.add("is-open");
  settingsPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("settings-open");
}

function closeSettings() {
  if (!settingsPanel) return;
  settingsPanel.classList.remove("is-open");
  settingsPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("settings-open");
}

function getStoredValue(key) {
  return window.localStorage.getItem(key) === "true";
}

function setStoredValue(key, value) {
  window.localStorage.setItem(key, String(value));
}

function setToggleState(button, active) {
  if (!button) return;
  button.setAttribute("aria-pressed", String(active));
}

function applyAccessibilityPreferences() {
  const highContrast = getStoredValue(STORAGE_KEYS.contrast);
  const largeText = getStoredValue(STORAGE_KEYS.text);
  const reduceMotion = getStoredValue(STORAGE_KEYS.motion);
  document.body.classList.toggle("high-contrast", highContrast);
  document.body.classList.toggle("large-text", largeText);
  document.body.classList.toggle("reduce-motion", reduceMotion);
  setToggleState(contrastButton, highContrast);
  setToggleState(textButton, largeText);
  setToggleState(motionButton, reduceMotion);
}

function togglePreference(key, className, button) {
  const active = !document.body.classList.contains(className);
  document.body.classList.toggle(className, active);
  setStoredValue(key, active);
  setToggleState(button, active);
}

if (menuButton) menuButton.addEventListener("click", toggleMenu);
if (navMenu) {
  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });
}
settingsOpenButtons.forEach((button) => button.addEventListener("click", openSettings));
settingsCloseButtons.forEach((button) => button.addEventListener("click", closeSettings));
if (contrastButton) contrastButton.addEventListener("click", () => togglePreference(STORAGE_KEYS.contrast, "high-contrast", contrastButton));
if (textButton) textButton.addEventListener("click", () => togglePreference(STORAGE_KEYS.text, "large-text", textButton));
if (motionButton) motionButton.addEventListener("click", () => togglePreference(STORAGE_KEYS.motion, "reduce-motion", motionButton));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeSettings();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((other) => other.classList.remove("is-active"));
    button.classList.add("is-active");
    workCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.hidden = !shouldShow;
    });
  });
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -80px 0px" });

revealElements.forEach((element) => revealObserver.observe(element));
applyAccessibilityPreferences();
