<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <!-- 背景图片容器 -->
    <div class="absolute inset-0">
      <img 
        src="/question-background.png" 
        alt="背景" 
        class="w-full h-full object-cover"
      />
    </div>
    
    <!-- 内容区域 -->
    <div class="relative z-10 w-full h-full flex flex-col items-center safe-area-inset">
      <div class="content-container w-full flex flex-col items-center justify-center px-[32px]">
        <div v-if="!showResult" class="w-[85%]">
          <!-- 问题卡片 -->
          <div class="bg-white rounded-[16px] p-[40px] shadow-[-8px_8px_16px_rgba(0,0,0,0.15)]">
            <div class="flex items-start justify-between gap-[24px]">
              <h2 class="text-[32px] text-gray-800 leading-[48px] flex-1 max-h-[96px] overflow-hidden pr-[32px] font-medium">{{ currentQuestion.question }}</h2>
              <div class="flex items-center gap-[16px]">
                <span class="text-[28px] text-gray-500 whitespace-nowrap mt-[4px]">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
              </div>
            </div>
          </div>

          <!-- 选项卡片 -->
          <div class="bg-white rounded-[16px] px-8 py-10 shadow-[-8px_8px_16px_rgba(0,0,0,0.15)] relative -mt-[2px]">
            <div class="absolute top-0 left-0 w-full">
              <div class="w-[80%] mx-auto border-b border-dashed border-gray-200"></div>
            </div>
            
            <div class="space-y-5">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="w-full px-[32px] py-[12px] text-left text-[28px] text-gray-800 border-[2px] border-gray-200 rounded-[16px] bg-[#DCF4F3]/30 font-normal"
                :class="{
                  'border-[#ff6b00] bg-[#fff5f0] text-[#ff6b00]': isAnswerSelected(index),
                  'cursor-pointer': true
                }"
                @click="selectAnswer(index)"
              >
                <div class="flex items-center">
                  <div class="w-[40px] h-[40px] mr-[24px] flex items-center justify-center">
                    <div v-if="isMultiChoice" class="w-[32px] h-[32px] border-[3px] rounded-[8px]" :class="isAnswerSelected(index) ? 'bg-[#ff6b00] border-[#ff6b00]' : 'border-gray-300'">
                      <svg v-if="isAnswerSelected(index)" class="w-[24px] h-[24px] text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div v-else class="w-[32px] h-[32px] border-[3px] rounded-full flex items-center justify-center" :class="isAnswerSelected(index) ? 'border-[#ff6b00]' : 'border-gray-300'">
                      <div v-if="isAnswerSelected(index)" class="w-[16px] h-[16px] rounded-full bg-[#ff6b00]"></div>
                    </div>
                  </div>
                  {{ option }}
                </div>
              </button>
            </div>

            <div class="h-[96px] mt-[24px]">
              <button
                v-if="selectedAnswer !== null"
                class="w-[calc(100%+32px)] -ml-[16px] h-[96px] bg-[#ff6b00] text-white rounded-[16px] text-[32px] font-medium"
                @click="submitAnswer"
              >
                提交答案
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="w-[85%] bg-white rounded-[16px] p-[80px] shadow-[-8px_8px_16px_rgba(0,0,0,0.15)] text-center">
          <h2 class="text-[40px] text-gray-800 font-medium mb-[40px]">恭喜闯关成功</h2>
          <button 
            class="px-[80px] py-[32px] bg-[#ff6b00] text-white rounded-[16px] text-[32px] font-medium"
            @click="restartQuiz"
          >
            重新答题
          </button>
        </div>
      </div>
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