import { fetchManifest } from "./manifest.js";
import { renderPostList, renderTagChips } from "./render.js";
import { filterPosts, ensureFullTextIndex } from "./search.js";
import { initThemeToggle } from "./theme.js";

initThemeToggle();

const listEl = document.getElementById("post-list");
const tagChipsEl = document.getElementById("tag-chips");
const searchInput = document.getElementById("search-input");
const searchStatus = document.getElementById("search-status");

const params = new URLSearchParams(location.search);
let state = {
  tag: params.get("tag") || null,
  query: params.get("q") || "",
};
let allPosts = [];
let fullTextMap = null;
let debounceTimer = null;

function sortByDateDesc(posts) {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function syncUrl() {
  const next = new URLSearchParams();
  if (state.tag) next.set("tag", state.tag);
  if (state.query) next.set("q", state.query);
  const qs = next.toString();
  history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
}

function render() {
  const allTags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();
  renderTagChips(tagChipsEl, allTags, state.tag, (tag) => {
    state.tag = tag;
    syncUrl();
    render();
  });

  const filtered = filterPosts(sortByDateDesc(allPosts), {
    query: state.query,
    tag: state.tag,
    fullTextMap,
  });
  renderPostList(listEl, filtered);
}

searchInput.value = state.query;
searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  render();

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(syncUrl, 250);

  if (state.query.trim() && !fullTextMap) {
    searchStatus.textContent = "본문 검색 중...";
    ensureFullTextIndex(allPosts).then((map) => {
      fullTextMap = map;
      searchStatus.textContent = "";
      render();
    });
  }
});

fetchManifest()
  .then((posts) => {
    allPosts = posts;
    render();
  })
  .catch(() => {
    listEl.innerHTML = '<p class="empty-state">글 목록을 불러오지 못했습니다.</p>';
  });
