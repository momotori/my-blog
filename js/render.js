function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

export function renderTagChips(container, allTags, activeTag, onSelect) {
  container.innerHTML = "";

  const makeChip = (label, value, isActive) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-chip";
    btn.textContent = label;
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    btn.addEventListener("click", () => onSelect(isActive ? null : value));
    return btn;
  };

  container.appendChild(makeChip("전체", null, !activeTag));
  allTags.forEach((tag) => {
    container.appendChild(makeChip(tag, tag, tag === activeTag));
  });
}

export function renderPostList(container, posts) {
  container.innerHTML = "";

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "조건에 맞는 글이 없습니다.";
    container.appendChild(empty);
    return;
  }

  posts.forEach((post) => {
    const li = document.createElement("li");
    li.className = "post-card";
    li.innerHTML = `
      <h2 class="post-card__title"><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2>
      <div class="post-card__meta">
        <time datetime="${post.date}">${formatDate(post.date)}</time>
        <span class="post-card__tags">${post.tags
          .map((t) => `<span class="post-card__tag">${escapeHtml(t)}</span>`)
          .join("")}</span>
      </div>
      <p class="post-card__excerpt">${escapeHtml(post.excerpt || "")}</p>
    `;
    container.appendChild(li);
  });
}

export function renderPostDetail(container, meta, htmlBody) {
  container.innerHTML = `
    <header class="post-header">
      <h1 class="post-header__title">${escapeHtml(meta.title)}</h1>
      <div class="post-header__meta">
        <time datetime="${meta.date}">${formatDate(meta.date)}</time>
        <span class="post-card__tags">${meta.tags
          .map((t) => `<span class="post-card__tag">${escapeHtml(t)}</span>`)
          .join("")}</span>
      </div>
    </header>
    <div class="post-body">${htmlBody}</div>
  `;
}

export function renderEmptyState(container, message) {
  container.innerHTML = `<p class="empty-state">${escapeHtml(message)}</p>`;
}
