import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  private boat!: Phaser.GameObjects.Sprite
  private obstacles: Phaser.GameObjects.Sprite[] = []
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private gameOver: boolean = false
  private gameStarted: boolean = false
  private startText!: Phaser.GameObjects.Text
  private gameOverText?: Phaser.GameObjects.Text  // 修改为可选类型
  private touchStartX: number = 0
  private touchStartY: number = 0
  private gameWidth: number = 0
  private gameHeight: number = 0
  private lastObstacleX: number = 0  // 记录上一个障碍物的X坐标

  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    // 加载游戏资源
    this.load.image('boat', '/boat.png')
    this.load.image('obstacle', '/obstacle.png')
    this.load.image('background', '/background.png')
  }

  create() {
    // 获取游戏尺寸
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height

    // 计算缩放比例
    const baseScale = Math.min(this.gameWidth / 800, this.gameHeight / 600)
    const boatScale = baseScale * 0.4
    const obstacleScale = baseScale * 0.25

    // 添加背景
    this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background')
      .setDisplaySize(this.gameWidth, this.gameHeight)

    // 添加龙舟
    this.boat = this.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'boat')
    this.boat.setScale(boatScale)

    // 添加分数文本
    this.scoreText = this.add.text(16, 16, '得分: 0', {
      fontSize: `${Math.floor(baseScale * 24)}px`,
      color: '#fff'
    })

    // 添加开始游戏文本
    this.startText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, '点击屏幕开始游戏', {
      fontSize: `${Math.floor(baseScale * 24)}px`,
      color: '#fff'
    }).setOrigin(0.5)

    // 添加触摸事件
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameStarted) {
        this.startGame()
      }
    })

    // 添加触摸移动事件
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameStarted || this.gameOver) return
      
      const speed = baseScale * 8
      const targetX = pointer.x
      const targetY = pointer.y
      
      // 平滑移动
      if (Math.abs(this.boat.x - targetX) > speed) {
        this.boat.x += this.boat.x < targetX ? speed : -speed
      }
      if (Math.abs(this.boat.y - targetY) > speed) {
        this.boat.y += this.boat.y < targetY ? speed : -speed
      }
      
      // 限制边界
      const boatWidth = this.boat.displayWidth
      const boatHeight = this.boat.displayHeight
      this.boat.x = Phaser.Math.Clamp(this.boat.x, boatWidth/2, this.gameWidth - boatWidth/2)
      this.boat.y = Phaser.Math.Clamp(this.boat.y, boatHeight/2, this.gameHeight - boatHeight/2)
    })

    // 添加键盘控制
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (!this.gameStarted || this.gameOver) return

      const speed = baseScale * 8
      switch (event.key) {
        case 'ArrowLeft':
          this.boat.x = Math.max(this.boat.displayWidth/2, this.boat.x - speed)
          break
        case 'ArrowRight':
          this.boat.x = Math.min(this.gameWidth - this.boat.displayWidth/2, this.boat.x + speed)
          break
        case 'ArrowUp':
          this.boat.y = Math.max(this.boat.displayHeight/2, this.boat.y - speed)
          break
        case 'ArrowDown':
          this.boat.y = Math.min(this.gameHeight - this.boat.displayHeight/2, this.boat.y + speed)
          break
      }
    })
  }

  override update() {
    if (!this.gameStarted || this.gameOver) return

    // 更新分数
    this.score++
    this.scoreText.setText('得分: ' + this.score)

    // 移动障碍物
    this.obstacles.forEach((obstacle, index) => {
      // 向下移动
      obstacle.y += 2 + Math.floor(this.score / 200)
      
      // 如果障碍物移出屏幕底部，则销毁
      if (obstacle.y > this.gameHeight + 50) {
        obstacle.destroy()
        this.obstacles.splice(index, 1)
      }
    })

    // 检查碰撞
    this.checkCollisions()

    // 根据分数增加障碍物生成频率
    if (Math.random() < 0.01 + Math.floor(this.score / 300) * 0.003) {
      this.spawnObstacle()
    }
  }

  private startGame() {
    this.gameStarted = true
    this.startText.destroy()
    this.score = 0
    this.obstacles.forEach(obstacle => obstacle.destroy())
    this.obstacles = []
    this.lastObstacleX = 0  // 重置上一个障碍物的X坐标
  }

  private spawnObstacle() {
    const baseScale = Math.min(this.gameWidth / 800, this.gameHeight / 600)
    const obstacleScale = baseScale * 0.25

    // 从左到右依次生成障碍物
    const sectionWidth = this.gameWidth / 8  // 将屏幕宽度分成8个区域
    this.lastObstacleX = (this.lastObstacleX + sectionWidth) % this.gameWidth
    
    const obstacle = this.add.sprite(
      this.lastObstacleX,
      -50,  // 从屏幕上方生成
      'obstacle'
    )
    obstacle.setScale(obstacleScale)
    this.obstacles.push(obstacle)
  }

  private checkCollisions() {
    for (const obstacle of this.obstacles) {
      // 使用圆形碰撞检测，减小碰撞半径
      const boatRadius = this.boat.displayWidth * 0.25  // 从0.4减小到0.25
      const obstacleRadius = obstacle.displayWidth * 0.3  // 从0.4减小到0.3
      
      // 计算两个圆心的距离
      const dx = this.boat.x - obstacle.x
      const dy = this.boat.y - obstacle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // 如果距离小于两个半径之和，则发生碰撞
      if (distance < boatRadius + obstacleRadius) {
        this.gameOver = true
        this.gameOverText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, '游戏结束\n点击屏幕重新开始', {
          fontSize: `${Math.floor(Math.min(this.gameWidth / 800, this.gameHeight / 600) * 24)}px`,
          color: '#fff',
          align: 'center'
        }).setOrigin(0.5)

        // 添加点击事件处理程序
        this.input.once('pointerdown', () => {
          this.restartGame()
        })
        break
      }
    }
  }

  private restartGame() {
    this.gameOver = false
    this.gameStarted = false
    this.score = 0
    this.scoreText.setText('得分: 0')
    
    // 清除所有障碍物
    this.obstacles.forEach(obstacle => obstacle.destroy())
    this.obstacles = []
    
    // 重置龙舟位置
    this.boat.x = this.gameWidth / 2
    this.boat.y = this.gameHeight / 2
    
    // 清除游戏结束文本
    if (this.gameOverText) {
      this.gameOverText.destroy()
      this.gameOverText = undefined
    }
    
    // 显示开始游戏文本
    this.startText = this.add.text(this.gameWidth / 2, this.gameHeight / 2, '点击屏幕开始游戏', {
      fontSize: `${Math.floor(Math.min(this.gameWidth / 800, this.gameHeight / 600) * 24)}px`,
      color: '#fff'
    }).setOrigin(0.5)
  }
} 