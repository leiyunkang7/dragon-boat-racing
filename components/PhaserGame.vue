<template>
  <div class="relative w-full h-screen">
    <div id="game-container" class="w-full h-full">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        游戏加载中...
      </div>
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        {{ error }}
      </div>
    </div>
    
    <!-- 游戏通关提示 -->
    <div v-if="showGameOver" class="absolute inset-0 flex items-center justify-center bg-black/50">
      <div class="w-[90%] max-w-[550px] bg-white rounded-[12px] p-10 shadow-[-8px_8px_16px_rgba(0,0,0,0.15)] text-center">
        <h2 class="text-2xl text-gray-800 font-medium mb-5">
          {{ isSuccess ? '恭喜闯关成功' : '游戏结束' }}
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          成功躲避了 {{ score }} 个粽子
        </p>
        <button 
          class="px-10 py-4 bg-[#ff6b00] text-white rounded-xl text-lg font-medium"
          @click="restartGame"
        >
          重新开始
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { config } from '~/game/config'
import MainScene from '~/game/scenes/MainScene'

const game = ref(null)
const loading = ref(true)
const error = ref(null)
const showGameOver = ref(false)
const isSuccess = ref(false)
const score = ref(0)

onMounted(async () => {
  try {
    // 动态导入 Phaser
    const Phaser = await import('phaser')
    
    // 添加主场景到游戏配置
    config.scene = [MainScene]
    
    // 创建游戏实例
    game.value = new Phaser.Game(config)
    
    // 监听游戏结束事件
    game.value.events.on('gameOver', (data) => {
      console.log('Game over event received:', data)
      showGameOver.value = true
      isSuccess.value = data.isSuccess
      score.value = data.score
    })
    
    // 游戏加载完成
    loading.value = false
  } catch (err) {
    console.error('Failed to initialize Phaser:', err)
    error.value = '游戏加载失败，请刷新页面重试'
    loading.value = false
  }
})

const restartGame = async () => {
  showGameOver.value = false
  if (game.value) {
    // 直接重置游戏状态
    game.value.scene.getScene('MainScene').events.emit('restart')
  }
}

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true)
    game.value = null
  }
})
</script>

<style>
#game-container {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: none; /* 防止移动端默认触摸行为 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  #game-container {
    max-height: 100vh;
  }
}
</style> 