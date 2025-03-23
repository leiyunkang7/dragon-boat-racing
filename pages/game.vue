<template>
  <div class="w-full h-screen bg-gray-100 flex items-center justify-center">
    <ClientOnly>
      <PhaserGame />
    </ClientOnly>
  </div>
</template>

<script setup>
// 禁用页面级别的 SSR
definePageMeta({
  ssr: false
})
</script>

<style>
#game-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 600px;
  margin: 0 auto;
  background: #000;
  touch-action: none; /* 防止移动端默认触摸行为 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  #game-container {
    max-height: 100vh;
  }
}
</style> 