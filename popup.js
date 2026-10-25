const input = document.getElementById("q");
const list = document.getElementById("list");
const count = document.getElementById("count");
const isMac = navigator.platform.startsWith("Mac");
const MOD = isMac ? "⌘" : "Ctrl+";

let tabs = [];
let shown = [];
let selected = 0;

// ---- Matching ----

// Lowercase, no accents: "Notícias" and "noticias" match each other.
const fold = s => (s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// The address without the parts nobody types: scheme, "www." and the domain's
// ending (".com", ".com.br"…), so "com" doesn't match every tab.
function cleanUrl(url) {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return url.replace(/^[a-z-]+:\/*/, "");
    const labels = u.hostname.replace(/^www\./, "").split(".");
    if (labels.length > 1) labels.pop();
    if (labels.length > 1 && labels.at(-1).length <= 3) labels.pop();
    return labels.join(".") + decodeURIComponent(u.pathname + u.search).replace(/\/$/, "");
  } catch {
    return url;
  }
}

function prepare(tab) {
  return { ...tab, display: cleanUrl(tab.url), haystack: fold(tab.title) + " " + fold(cleanUrl(tab.url)) };
}

// Every word typed has to appear somewhere in the title or address.
function matches(tab, words) {
  return words.every(w => tab.haystack.includes(w));
}

// ---- Rendering ----

const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);
const AUDIBLE = document.getElementById("audible").content;
const BLANK = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="3" fill="#888" opacity=".35"/></svg>`);

function render() {
  const words = fold(input.value).split(/\s+/).filter(Boolean);
  shown = words.length ? tabs.filter(t => matches(t, words)) : tabs;
  selected = Math.min(selected, Math.max(0, shown.length - 1));
  count.textContent = words.length ? `${shown.length} de ${tabs.length}` : `${tabs.length}`;

  list.replaceChildren();
  if (!shown.length) {
    list.append(el("li", { className: "empty", textContent: "Nenhuma aba com isso." }));
    return;
  }
  shown.forEach((tab, i) => {
    const li = el("li");
    li.dataset.index = i;
    li.classList.toggle("selected", i === selected);
    li.classList.toggle("active", tab.active);
    const img = el("img", { src: tab.favIconUrl || BLANK, alt: "" });
    img.addEventListener("error", () => (img.src = BLANK));
    const text = el("div", { className: "text" });
    text.append(el("div", { className: "title", textContent: tab.title || tab.url }), el("div", { className: "url", textContent: tab.display }));
    li.append(img, text);
    if (tab.audible) li.append(AUDIBLE.cloneNode(true));
    const close = el("button", { className: "close", title: `Fechar aba (${MOD}⌫)`, textContent: "×" });
    close.addEventListener("click", event => {
      event.stopPropagation();
      closeTab(tab);
    });
    li.append(close);
    li.addEventListener("mousemove", () => select(i));
    li.addEventListener("click", () => go(tab));
    list.append(li);
  });
}

function select(i) {
  if (i === selected || !shown.length) return;
  selected = (i + shown.length) % shown.length;
  list.querySelectorAll("li").forEach((li, j) => li.classList.toggle("selected", j === selected));
  list.children[selected]?.scrollIntoView({ block: "nearest" });
}

// ---- Actions ----

async function go(tab) {
  await browser.tabs.update(tab.id, { active: true });
  window.close();
}

async function closeTab(tab) {
  await browser.tabs.remove(tab.id);
  tabs = tabs.filter(t => t.id !== tab.id);
  render();
}

// ---- Keyboard ----

input.addEventListener("input", () => {
  selected = 0;
  render();
});

document.addEventListener("keydown", event => {
  const mod = isMac ? event.metaKey : event.ctrlKey;
  if (event.key === "ArrowDown" || (event.key === "n" && event.ctrlKey)) {
    event.preventDefault();
    select(selected + 1);
  } else if (event.key === "ArrowUp" || (event.key === "p" && event.ctrlKey)) {
    event.preventDefault();
    select(selected - 1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (shown[selected]) go(shown[selected]);
  } else if (mod && event.key === "Backspace") {
    event.preventDefault();
    if (shown[selected]) closeTab(shown[selected]);
  } else if (event.key === "Escape") {
    if (input.value) {
      event.preventDefault();
      input.value = "";
      selected = 0;
      render();
    } else {
      window.close();
    }
  }
});

// ---- Load: this window's tabs, in the same order as the tab strip ----

async function load() {
  const all = await browser.tabs.query({ currentWindow: true });
  tabs = all.sort((a, b) => a.index - b.index).map(prepare);
  render();
  input.focus();
}
load();
