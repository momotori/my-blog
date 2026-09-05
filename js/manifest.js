let manifestPromise = null;

export function fetchManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("posts/manifest.json")
      .then((res) => {
        if (!res.ok) throw new Error(`manifest.json 로드 실패: ${res.status}`);
        return res.json();
      })
      .then((data) => data.posts || []);
  }
  return manifestPromise;
}

export function getPostBySlug(posts, slug) {
  return posts.find((post) => post.slug === slug) || null;
}
