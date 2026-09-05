import { stripFrontmatter } from "./markdown.js";

let fullTextIndexPromise = null;

export function matchesMetadata(post, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [post.title, post.excerpt, ...(post.tags || [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function ensureFullTextIndex(posts) {
  if (!fullTextIndexPromise) {
    fullTextIndexPromise = Promise.all(
      posts.map((post) =>
        fetch(`posts/${post.slug}.md`)
          .then((res) => (res.ok ? res.text() : ""))
          .then((text) => [post.slug, stripFrontmatter(text).toLowerCase()])
          .catch(() => [post.slug, ""])
      )
    ).then((entries) => new Map(entries));
  }
  return fullTextIndexPromise;
}

export function filterPosts(posts, { query = "", tag = null, fullTextMap = null } = {}) {
  const q = query.trim().toLowerCase();

  return posts.filter((post) => {
    if (tag && !post.tags.includes(tag)) return false;
    if (!q) return true;

    if (matchesMetadata(post, q)) return true;
    if (fullTextMap && fullTextMap.get(post.slug)?.includes(q)) return true;
    return false;
  });
}
