<template>
  <div class="quiz-container">
    <div v-if="!showResult" class="quiz-content">
      <div class="progress">
        第 {{ currentQuestionIndex + 1 }}/{{ questions.length }} 题
      </div>
      <div class="question">
        <h2>{{ currentQuestion.question }}</h2>
        <div class="options">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-btn"
            :class="{ selected: selectedAnswer === index }"
            @click="selectAnswer(index)"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div class="actions">
        <button
          v-if="selectedAnswer !== null"
          class="submit-btn"
          @click="submitAnswer"
        >
          提交答案
        </button>
      </div>
    </div>
    
    <div v-else class="result-content">
      <h2>答题完成！</h2>
      <p>您答对了 {{ correctCount }} 题</p>
      <div v-if="correctCount >= 8" class="coupon">
        <h3>恭喜获得礼品券！</h3>
        <div class="coupon-code">{{ couponCode }}</div>
        <p class="coupon-tip">请截图保存此券码，凭码领取礼品</p>
      </div>
      <div v-else class="no-coupon">
        <p>很遗憾，答对8题以上才能获得礼品券</p>
        <p>继续加油哦！</p>
      </div>
      <button class="restart-btn" @click="restartQuiz">重新答题</button>
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

// 礼品券码池
const couponCodes = [
  'DB2024001', 'DB2024002', 'DB2024003', 'DB2024004', 'DB2024005',
  'DB2024006', 'DB2024007', 'DB2024008', 'DB2024009', 'DB2024010'
]

const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const correctCount = ref(0)
const couponCode = ref('')

const currentQuestion = computed(() => questions[currentQuestionIndex.value])

const selectAnswer = (index: number): void => {
  selectedAnswer.value = index
}

const submitAnswer = () => {
  if (selectedAnswer.value === currentQuestion.value.correct) {
    correctCount.value++
  }
  
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  } else {
    showResult.value = true
    if (correctCount.value >= 8) {
      // 随机选择一个未使用的券码
      const randomIndex = Math.floor(Math.random() * couponCodes.length)
      couponCode.value = couponCodes[randomIndex]
    }
  }
}

const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  correctCount.value = 0
  couponCode.value = ''
}
</script>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.progress {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.question {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.question h2 {
  color: #333;
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn.selected {
  border-color: #d4380d;
  background: #fff1f0;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #d4380d;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.result-content {
  text-align: center;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coupon {
  margin: 20px 0;
  padding: 20px;
  background: #fff1f0;
  border-radius: 8px;
}

.coupon-code {
  font-size: 24px;
  font-weight: bold;
  color: #d4380d;
  margin: 15px 0;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}

.coupon-tip {
  color: #666;
  font-size: 14px;
}

.restart-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: #d4380d;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style> 