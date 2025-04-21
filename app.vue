<template>
  <div class="min-h-screen bg-gray-100">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=750, user-scalable=no, viewport-fit=cover'
    }
  ]
})
</script>

<style>
html {
  @apply antialiased;
  /* font-size: calc(100vw / 750 * 100); */
}

body {
  @apply m-0 p-0 font-sans;
  width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

h1, h2, h3, h4, h5, h6 {
  @apply m-0 text-gray-800;
}

button {
  @apply cursor-pointer border-none outline-none font-sans;
}

.container {
  @apply max-w-[750px] mx-auto;
}

/* 安全区域变量 */
:root {
  /* 顶部安全距离128px，转换为rem单位 */
  --safe-area-inset-top: max(env(safe-area-inset-top, 128px), 128px);
  /* 底部安全距离98px，转换为rem单位 */
  --safe-area-inset-bottom: max(env(safe-area-inset-bottom, 98px), 98px);
  /* 内容区域高度1300px */
  --content-height: 1300px;
  /* 弹窗高度1108px */
  --modal-height: 1108px;
}

/* 安全区域适配类 */
.safe-area-inset {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
}

.safe-area-inset-top {
  padding-top: var(--safe-area-inset-top);
}

.safe-area-inset-bottom {
  padding-bottom: var(--safe-area-inset-bottom);
}

/* 内容区域类 */
.content-container {
  min-height: var(--content-height);
  max-height: var(--content-height);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 弹窗容器类 */
.modal-container {
  max-height: var(--modal-height);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 750px) {
  body {
    width: 100%;
  }
}

@supports not (env(safe-area-inset-top)) {
  :root {
    --safe-area-inset-top: 128px;
    --safe-area-inset-bottom: 98px;
  }
}
</style>
