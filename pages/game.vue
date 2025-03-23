<template>
  <div class="w-full h-screen bg-gray-100 relative overflow-hidden">
    <div v-if="!gameStarted" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">划龙舟</h2>
      <p class="text-gray-600">点击屏幕开始游戏</p>
      <p class="text-sm text-gray-500 mt-2">躲避障碍物，坚持越久越好！</p>
    </div>
    
    <div v-else class="w-full h-full">
      <div class="absolute top-5 right-5 bg-black/50 text-white px-4 py-2 rounded-full z-10">
        得分: {{ score }}
      </div>
      <div class="w-full h-full relative bg-gradient-to-b from-sky-300 to-blue-500 overflow-hidden" ref="gameArea">
        <div 
          class="absolute w-16 h-16 transition-all duration-75 ease-out"
          :style="{ 
            bottom: boatPosition + '%',
            left: boatHorizontalPosition + '%',
            background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d4380d"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>') no-repeat center`,
            backgroundSize: 'contain',
            transform: 'rotate(90deg)'
          }"
        ></div>
        <div
          v-for="(obstacle, index) in obstacles"
          :key="index"
          class="absolute w-8 h-8"
          :style="{
            bottom: obstacle.position + '%',
            left: obstacle.x + '%',
            background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23d4380d"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>') no-repeat center`,
            backgroundSize: 'contain'
          }"
        ></div>
      </div>
    </div>
    
    <div v-if="gameOver" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 p-8 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">游戏结束</h2>
      <p class="text-gray-600">您的得分: {{ score }}</p>
      <button 
        @click="restartGame"
        class="mt-5 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        重新开始
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const gameStarted = ref(false)
const gameOver = ref(false)
const score = ref(0)
const gameArea = ref<HTMLElement | null>(null)
const boatPosition = ref(30)
const boatHorizontalPosition = ref(50)
const obstacles = ref<Array<{ position: number; x: number }>>([])
let gameLoop: number | null = null
let obstacleInterval: number | null = null

const startGame = () => {
  gameStarted.value = true
  gameOver.value = false
  score.value = 0
  obstacles.value = []
  boatPosition.value = 30
  boatHorizontalPosition.value = 50
  
  // 开始游戏循环
  gameLoop = window.setInterval(() => {
    score.value++
    // 根据分数增加难度
    const speed = Math.min(3, 1 + Math.floor(score.value / 100))
    // 移动障碍物
    obstacles.value = obstacles.value.map(obs => ({
      ...obs,
      position: obs.position - speed
    }))
    // 移除超出屏幕的障碍物
    obstacles.value = obstacles.value.filter(obs => obs.position > -20)
    
    // 检查碰撞
    checkCollision()
  }, 50)
  
  // 生成障碍物
  obstacleInterval = window.setInterval(() => {
    // 根据分数增加障碍物生成频率
    const frequency = Math.min(0.5, 0.3 + Math.floor(score.value / 200) * 0.05)
    if (Math.random() < frequency) {
      obstacles.value.push({
        position: 100,
        x: Math.random() * 80 + 10
      })
    }
  }, 1000)
}

const checkCollision = () => {
  const boatRect = {
    left: boatHorizontalPosition.value,
    right: boatHorizontalPosition.value + 20,
    top: boatPosition.value,
    bottom: boatPosition.value + 20
  }
  
  for (const obstacle of obstacles.value) {
    const obstacleRect = {
      left: obstacle.x,
      right: obstacle.x + 20,
      top: obstacle.position,
      bottom: obstacle.position + 20
    }
    
    if (
      boatRect.left < obstacleRect.right &&
      boatRect.right > obstacleRect.left &&
      boatRect.top < obstacleRect.bottom &&
      boatRect.bottom > obstacleRect.top
    ) {
      endGame()
      break
    }
  }
}

const endGame = () => {
  if (gameLoop) clearInterval(gameLoop)
  if (obstacleInterval) clearInterval(obstacleInterval)
  gameOver.value = true
}

const restartGame = () => {
  startGame()
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (!gameStarted.value || gameOver.value) return
  
  const moveStep = 3
  
  switch (e.key) {
    case 'ArrowLeft':
      boatHorizontalPosition.value = Math.max(10, boatHorizontalPosition.value - moveStep)
      break
    case 'ArrowRight':
      boatHorizontalPosition.value = Math.min(90, boatHorizontalPosition.value + moveStep)
      break
    case 'ArrowUp':
      boatPosition.value = Math.min(70, boatPosition.value + moveStep)
      break
    case 'ArrowDown':
      boatPosition.value = Math.max(10, boatPosition.value - moveStep)
      break
  }
}

const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault()
  if (!gameStarted.value) {
    startGame()
    return
  }
  
  const touch = e.touches[0]
  const rect = gameArea.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = ((touch.clientX - rect.left) / rect.width) * 100
  const y = ((touch.clientY - rect.top) / rect.height) * 100
  
  boatHorizontalPosition.value = Math.max(10, Math.min(90, x))
  boatPosition.value = Math.max(10, Math.min(70, y))
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  if (!gameStarted.value || gameOver.value) return
  
  const touch = e.touches[0]
  const rect = gameArea.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = ((touch.clientX - rect.left) / rect.width) * 100
  const y = ((touch.clientY - rect.top) / rect.height) * 100
  
  boatHorizontalPosition.value = Math.max(10, Math.min(90, x))
  boatPosition.value = Math.max(10, Math.min(70, y))
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
  window.addEventListener('touchstart', handleTouchStart, { passive: false })
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  if (gameLoop) clearInterval(gameLoop)
  if (obstacleInterval) clearInterval(obstacleInterval)
})
</script>

<style>
/* 移除所有原有的样式，因为已经使用 Tailwind CSS 类替代 */
</style> 