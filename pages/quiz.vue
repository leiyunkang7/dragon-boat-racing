<template>
  <div class="flex min-h-screen items-center justify-center p-5 bg-cover bg-center" style="background-image: url('/question-background.png')">
    <div v-if="!showResult" class="w-[90%] max-w-[550px] bg-white rounded-[18px] p-8 shadow-lg relative">
      <div class="mb-5">
        <div class="relative pb-5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[90%] after:border-b after:border-dashed after:border-gray-200">
          <div class="flex items-start justify-between gap-3">
            <h2 class="text-lg text-gray-800 font-normal leading-7 flex-1 max-h-[56px] overflow-hidden pr-4">{{ currentQuestion.question }}</h2>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500 whitespace-nowrap mt-1.5">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
             
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-2.5 px-2.5">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="w-full px-5 py-3 text-left text-base text-gray-800 border border-gray-200 rounded-xl bg-[#DCF4F3]/30"
          :class="{
            'border-[#ff6b00] bg-[#fff5f0] text-[#ff6b00]': isAnswerSelected(index),
            'cursor-pointer': true
          }"
          @click="selectAnswer(index)"
        >
          <div class="flex items-center">
            <div class="w-5 h-5 mr-3 flex items-center justify-center">
              <div v-if="isMultiChoice" class="w-4 h-4 border-2 rounded-sm" :class="isAnswerSelected(index) ? 'bg-[#ff6b00] border-[#ff6b00]' : 'border-gray-300'">
                <svg v-if="isAnswerSelected(index)" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div v-else class="w-4 h-4 border-2 rounded-full flex items-center justify-center" :class="isAnswerSelected(index) ? 'border-[#ff6b00]' : 'border-gray-300'">
                <div v-if="isAnswerSelected(index)" class="w-2 h-2 rounded-full bg-[#ff6b00]"></div>
              </div>
            </div>
            {{ option }}
          </div>
        </button>
      </div>

      <div class="h-12 mt-4">
        <button
          v-if="selectedAnswer !== null"
          class="w-full h-12 bg-[#ff6b00] text-white rounded-xl text-lg"
          @click="submitAnswer"
        >
          提交答案
        </button>
      </div>
    </div>
    
    <div v-else class="w-[90%] max-w-[550px] bg-white rounded-[18px] p-10 shadow-lg text-center">
      <h2 class="text-2xl text-gray-800 font-normal mb-5">恭喜闯关成功</h2>
      <button 
        class="px-10 py-4 bg-[#ff6b00] text-white rounded-xl text-lg"
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
    question: '道滘裹蒸粽属于哪个级别的非物质文化遗产？',
    options: ['国家级', '省级', '市级'],
    correct: 1
  },
  {
    question: '以下哪些非遗项目是华美粽飘香与之合作的？',
    options: ['中堂龙舟制作技艺', '赛龙舟号子', '汨罗龙舟打造技艺', '东莞道滘裹蒸粽'],
    correct: [0, 3]
  },
  {
    question: '以下哪些口味的粽子是华美粽飘香产品所涵盖的？',
    options: ['蛋黄鲜肉粽', '藤椒鸡丝粽', '桂花豆沙粽', '五花肉粽', '谷物杂粮粽', '香菇鸡肉黑糯粽'],
    correct: [0, 1, 2, 3, 4, 5]
  },
  {
    question: '华美集团成立多少年？总部位于哪个地方？',
    options: ['成立34年，总部位于广东广州', '成立33年，总部位于广东东莞', '成立34年，总部位于广东东莞', '成立33年，总部位于广东广州'],
    correct: 2
  },
  {
    question: '华美工厂没有分布于以下哪个地方？',
    options: ['广东东莞', '河北保定', '山东潍坊', '湖北仙桃'],
    correct: 2
  },
  {
    question: '以下哪些渠道可购买华美粽飘香产品？',
    options: ['抖音旗舰店', '淘宝旗舰店', '拼多多旗舰店', '微信小程序"华美食品烘焙星球"'],
    correct: [0, 1, 2, 3]
  },
  {
    question: '端午节在农历哪一天？',
    options: ['五月初一', '五月初五', '五月初十', '五月十五'],
    correct: 1
  },
  {
    question: '端午节"五色丝线"的寓意是什么？',
    options: ['驱邪避灾', '象征财富', '祈求丰收', '纪念战争'],
    correct: 0
  },
  {
    question: '东莞"龙船饭"必备的食材是什么？',
    options: ['烧鹅', '咸蛋黄', '东莞腊肠', '瑶柱'],
    correct: 2
  },
  {
    question: '东莞"裹蒸粽"与普通粽子的核心差异是？',
    options: ['使用冬叶包裹', '添加瑶柱馅料', '蒸制时间长达10小时', '用红蓝草染色'],
    correct: 0
  },
  {
    question: '东莞哪个镇被称为"中国龙舟之乡"？',
    options: ['万江', '石龙', '中堂', '麻涌'],
    correct: 2
  }
]

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | number[] | null>(null)
const showResult = ref(false)

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const isMultiChoice = computed(() => Array.isArray(currentQuestion.value.correct))

const selectAnswer = (index: number) => {
  if (isMultiChoice.value) {
    if (!selectedAnswer.value) {
      selectedAnswer.value = []
    }
    const currentSelected = selectedAnswer.value as number[]
    const answerIndex = currentSelected.indexOf(index)
    if (answerIndex === -1) {
      currentSelected.push(index)
    } else {
      currentSelected.splice(answerIndex, 1)
    }
  } else {
    selectedAnswer.value = index
  }
}

const isAnswerSelected = (index: number) => {
  if (isMultiChoice.value) {
    return selectedAnswer.value ? (selectedAnswer.value as number[]).includes(index) : false
  }
  return selectedAnswer.value === index
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