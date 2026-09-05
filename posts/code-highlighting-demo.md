---
title: 코드 하이라이팅 데모
date: 2026-03-10
tags: [web, demo]
---

# 코드 하이라이팅 데모

이 글은 코드 블록이 라이트/다크 테마에서 어떻게 보이는지 확인하기 위한 데모입니다.

## JavaScript

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet("World");
```

## CSS

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

[data-theme="dark"] {
  --bg: #12141a;
  --text: #e6e6e6;
}
```

## 인라인 코드

`fetch()`와 `localStorage`는 이 프로젝트에서 핵심적으로 사용되는 브라우저 API입니다.

우측 상단의 다크모드 토글을 눌러 두 테마에서 코드 블록 색상이 어떻게 달라지는지 비교해보세요.
