/* Progressive enhancement of the old-wiki menu. Navigation stays native without JS. */
"use strict";
document.documentElement.classList.add("js");
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const groups = [...document.querySelectorAll(".nav-dropdown")];
function closeMenu(returnFocus = false) {
  menu?.classList.remove("is-open");
  toggle?.setAttribute("aria-expanded", "false");
  groups.forEach(group => { group.open = false; });
  if (returnFocus) toggle?.focus();
}
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  menu?.classList.toggle("is-open", open);
  if (!open) groups.forEach(group => { group.open = false; });
});
groups.forEach(group => {
  group.addEventListener("toggle", () => {
    if (group.open) groups.filter(other => other !== group).forEach(other => { other.open = false; });
  });
});
menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (menu?.classList.contains("is-open")) { closeMenu(true); return; }
  const group = groups.find(item => item.open);
  if (group) { group.open = false; group.querySelector("summary")?.focus(); }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 1024px)").addEventListener("change", () => closeMenu());
function revealAnchor() {
  if (!location.hash) return;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  let parent = target.parentElement;
  while (parent) { if (parent.tagName === "DETAILS") parent.open = true; parent = parent.parentElement; }
  requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
}
window.addEventListener("hashchange", revealAnchor);
window.addEventListener("load", revealAnchor);
const tocLinks = [...document.querySelectorAll(".page-toc .toc a")];
if ("IntersectionObserver" in window && tocLinks.length) {
  const observer = new IntersectionObserver(entries => {
    const entry = entries.find(item => item.isIntersecting);
    if (!entry) return;
    tocLinks.forEach(link => {
      if (decodeURIComponent(link.hash.slice(1)) === entry.target.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-110px 0px -65% 0px" });
  document.querySelectorAll("article.content h2[id], article.content h3[id]").forEach(heading => observer.observe(heading));
}
