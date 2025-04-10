<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 背景图片 -->
    <img 
      src="/home-background.png" 
      alt="背景" 
      class="absolute inset-0 w-full h-full object-cover"
    />
    
    <!-- 内容区域 -->
    <div class="relative z-10 w-full h-full flex flex-col items-center">
      <!-- 按钮区域 -->
      <div class="absolute bottom-32 flex flex-col items-center space-y-6 w-full max-w-xs px-4">
        <!-- 趣味答题按钮 -->
        <NuxtLink to="/quiz" class="w-full relative">
          <img 
            src="/button-1.png" 
            alt="趣味答题" 
            class="w-full h-auto cursor-pointer transition-transform hover:scale-105"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl font-bold text-white drop-shadow-lg">趣味答题</span>
          </div>
        </NuxtLink>

        <!-- 划龙舟按钮 -->
        <NuxtLink to="/game" class="w-full relative">
          <img 
            src="/button-2.png" 
            alt="划龙舟" 
            class="w-full h-auto cursor-pointer transition-transform hover:scale-105"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl font-bold text-white drop-shadow-lg">划龙舟小游戏</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '端午龙舟赛',
  meta: [
    { name: 'description', content: '欢迎来到端午龙舟赛游戏' }
  ]
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.text-orange-600 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
</style> 