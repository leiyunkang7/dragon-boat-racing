<template>
  <div class="flex min-h-screen items-center justify-center p-5 bg-cover bg-center" style="background-image: url('/question-background.png')">
    <div v-if="!showResult" class="w-[90%] max-w-[550px] bg-white rounded-[18px] p-8 shadow-lg relative">
      <div class="mb-5">
        <div class="relative pb-5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[90%] after:border-b after:border-dashed after:border-gray-200">
          <div class="flex items-start justify-between gap-3">
            <h2 class="text-lg text-gray-800 font-normal leading-7 flex-1 max-h-[56px] overflow-hidden pr-4">{{ currentQuestion.question }}</h2>
            <span class="text-sm text-gray-500 whitespace-nowrap mt-1.5">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-2.5 px-2.5">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="w-full px-5 py-3 text-left text-base text-gray-800 border border-gray-200 rounded-xl bg-[#f0fcf8]/30 transition-all hover:border-[#ff6b00] hover:bg-[#fff5f0]"
          :class="{ 'border-[#ff6b00] bg-[#fff5f0] text-[#ff6b00]': selectedAnswer === index }"
          @click="selectAnswer(index)"
        >
          {{ option }}
        </button>
      </div>

      <div class="h-12 mt-4">
        <button
          v-if="selectedAnswer !== null"
          class="w-full h-12 bg-[#ff6b00] text-white rounded-xl text-lg hover:bg-[#ff8533]"
          @click="submitAnswer"
        >
          提交答案
        </button>
      </div>
    </div>
    
    <div v-else class="w-[90%] max-w-[550px] bg-white rounded-[18px] p-10 shadow-lg text-center">
      <h2 class="text-2xl text-gray-800 font-normal mb-5">恭喜闯关成功</h2>
      <button 
        class="px-10 py-4 bg-[#ff6b00] text-white rounded-xl text-lg transition-all hover:bg-[#ff8533]"
        @click="restartQuiz"
      >
        重新答题
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 题目数据
const questions = [
  {
    question: '端午节是农历几月几日？',
    options: ['五月初五', '五月初六', '五月初四', '五月初七'],
    correct: 0
  },
  {
    question: '端午节的传统习俗不包括以下哪项？',
    options: ['吃粽子', '放鞭炮', '赛龙舟', '挂艾草'],
    correct: 1
  },
  {
    question: '端午节吃粽子的习俗是为了纪念谁？',
    options: ['屈原', '孔子', '老子', '孟子'],
    correct: 0
  },
  {
    question: '以下哪种不是传统的端午节食物？',
    options: ['粽子', '咸鸭蛋', '月饼', '雄黄酒'],
    correct: 2
  },
  {
    question: '端午节赛龙舟起源于哪个地区？',
    options: ['长江流域', '黄河流域', '珠江流域', '淮河流域'],
    correct: 0
  },
  {
    question: '端午节佩戴香囊的主要目的是什么？',
    options: ['装饰', '驱邪避疫', '显示身份', '储存物品'],
    correct: 1
  },
  {
    question: '端午节的传统活动不包括以下哪项？',
    options: ['赛龙舟', '放风筝', '吃粽子', '挂艾草'],
    correct: 1
  },
  {
    question: '端午节为什么要挂艾草？',
    options: ['装饰', '驱邪避疫', '食用', '制作香囊'],
    correct: 1
  },
  {
    question: '端午节的传统饮品是什么？',
    options: ['雄黄酒', '菊花茶', '绿茶', '咖啡'],
    correct: 0
  },
  {
    question: '端午节赛龙舟时，龙舟上通常有多少人？',
    options: ['10-20人', '20-30人', '30-40人', '40-50人'],
    correct: 1
  }
]

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const selectAnswer = (index: number) => {
  selectedAnswer.value = index
}

const submitAnswer = () => {
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  } else {
    showResult.value = true
  }
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
}
</script> 