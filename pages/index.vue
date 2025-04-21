<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <!-- 背景图片容器 -->
    <div class="absolute inset-0">
      <img 
        src="/home-background.png" 
        alt="背景" 
        class="w-full h-full object-cover"
      />
    </div>
    
    <!-- 内容区域 -->
    <div class="relative z-10 w-full h-full flex flex-col items-center safe-area-inset">
      <!-- 按钮区域 -->
      <div class="content-container w-full flex flex-col items-center justify-end px-[32px]">
        <div class="w-full max-w-[686px] space-y-[40px] mb-[98px]">
          <!-- 趣味答题按钮 -->
          <NuxtLink to="/quiz" class="w-full relative">
            <img 
              src="/button-1.png" 
              alt="趣味答题" 
              class="w-full h-auto cursor-pointer transition-transform hover:scale-105"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-[48px] font-bold text-white drop-shadow-lg">趣味答题</span>
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
              <span class="text-[48px] font-bold text-white drop-shadow-lg">划龙舟小游戏</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: '端午节活动',
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.text-orange-600 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.safe-area-padding {
  padding-top: env(safe-area-inset-top, 20px);
  padding-bottom: env(safe-area-inset-bottom, 20px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  min-height: 100vh;
  height: 100%;
}

/* 微信浏览器适配 */
@supports not (padding: env(safe-area-inset-top)) {
  .safe-area-padding {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}

/* iOS 设备适配 */
@supports (-webkit-touch-callout: none) {
  .safe-area-padding {
    height: -webkit-fill-available;
  }
}

/* 移动端适配 */
@media screen and (max-width: 750px) {
  .content-container {
    padding-left: 4.267vw;  /* 32/750*100 */
    padding-right: 4.267vw;
  }
  
  .text-[48px] {
    font-size: 6.4vw;  /* 48/750*100 */
  }
}
</style> 