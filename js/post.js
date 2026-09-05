import { fetchManifest, getPostBySlug } from "./manifest.js";
import { configureMarked, mdToHtml } from "./markdown.js";
import { renderPostDetail, renderEmptyState } from "./render.js";
import { initThemeToggle } from "./theme.js";

initThemeToggle();
configureMarked();

const articleEl = document.getElementById("post-article");
const slug = new URLSearchParams(location.search).get("slug");

if (!slug) {
  renderEmptyState(articleEl, "글을 찾을 수 없습니다.");
} else {
  fetchManifest()
    .then((posts) => {
      const meta = getPostBySlug(posts, slug);
      if (!meta) {
        renderEmptyState(articleEl, "글을 찾을 수 없습니다.");
        return;
      }

      return fetch(`posts/${meta.slug}.md`)
        .then((res) => {
          if (!res.ok) throw new Error("not found");
          return res.text();
        })
        .then((source) => {
          document.title = `${meta.title} · My Blog`;
          renderPostDetail(articleEl, meta, mdToHtml(source));
        })
        .catch(() => {
          renderEmptyState(articleEl, "글을 불러오지 못했습니다.");
        });
    })
    .catch(() => {
      renderEmptyState(articleEl, "글을 불러오지 못했습니다.");
    });
}
