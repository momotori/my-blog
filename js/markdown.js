export function stripFrontmatter(source) {
  return source.replace(/^---\s*[\s\S]*?\n---\s*\n/, "");
}

export function configureMarked() {
  const renderer = new marked.Renderer();

  renderer.code = function (code, infostring) {
    const lang = (infostring || "").trim().split(/\s+/)[0];
    let highlighted;
    let langClass = "hljs";

    if (lang && hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(code, { language: lang }).value;
      langClass += ` language-${lang}`;
    } else {
      highlighted = hljs.highlightAuto(code).value;
    }

    return `<pre><code class="${langClass}">${highlighted}</code></pre>`;
  };

  marked.setOptions({ renderer });
}

export function mdToHtml(source) {
  return marked.parse(stripFrontmatter(source));
}
