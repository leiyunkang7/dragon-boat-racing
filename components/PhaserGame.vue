<template>
  <div id="game-container" class="w-full h-full">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
      游戏加载中...
    </div>
    <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
      {{ error }}
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

onMounted(async () => {
  try {
    // 动态导入 Phaser
    const Phaser = await import('phaser')
    
    // 添加主场景到游戏配置
    config.scene = [MainScene]
    
    // 创建游戏实例
    game.value = new Phaser.Game(config)
    
    // 游戏加载完成
    loading.value = false
  } catch (err) {
    console.error('Failed to initialize Phaser:', err)
    error.value = '游戏加载失败，请刷新页面重试'
    loading.value = false
  }
})

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
  margin: 0 auto;
  max-width: 800px;
  max-height: 600px;
}
</style> 