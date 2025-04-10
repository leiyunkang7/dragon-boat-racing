import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  private boat!: Phaser.GameObjects.Sprite
  private obstacles: Phaser.GameObjects.Sprite[] = []
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private gameOver: boolean = false
  private gameStarted: boolean = false
  private startText!: Phaser.GameObjects.Text
  private gameOverText?: Phaser.GameObjects.Text
  private touchStartX: number = 0
  private touchStartY: number = 0
  private gameWidth: number = 0
  private gameHeight: number = 0
  private lastObstacleX: number = 0
  private moveSpeed: number = 0
  private baseScale: number = 0

  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.load.image('boat', '/boat.png')
    this.load.image('zongzi1', '/zongzi-1.png')
    this.load.image('zongzi2', '/zongzi-2.png')
    this.load.image('background', '/game-background.png')
  }

  create() {
    this.initializeGameDimensions()
    this.initializeGameObjects()
    this.setupEventListeners()
  }

  private initializeGameDimensions() {
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
    this.baseScale = Math.min(this.gameWidth / 800, this.gameHeight / 600)
  }

  private initializeGameObjects() {
    // 计算移动速度
    const screenDiagonal = Math.sqrt(this.gameWidth * this.gameWidth + this.gameHeight * this.gameHeight)
    this.moveSpeed = screenDiagonal * 0.02

    // 添加背景图片
    const background = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.gameWidth, this.gameHeight)
      .setDepth(0)

    // 添加龙舟
    this.boat = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight * 0.7,
      'boat'
    ).setScale(this.baseScale * 0.3)

    // 添加分数文本
    this.scoreText = this.createText(this.gameWidth - 16, 16, '得分: 0', { align: 'right' })
      .setOrigin(1, 0)
      .setScrollFactor(0)

    // 添加开始游戏文本
    this.startText = this.createText(
      this.gameWidth / 2,
      this.gameHeight / 2,
      '点击屏幕开始游戏',
      { align: 'center' }
    ).setOrigin(0.5)
  }

  private setupEventListeners() {
    // 添加触摸事件
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameStarted) {
        this.startGame()
      }
    })

    // 添加触摸移动事件
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.gameStarted || this.gameOver) return
      this.handleBoatMovement(pointer)
    })

    // 添加键盘控制
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (!this.gameStarted || this.gameOver) return
      this.handleKeyboardInput(event)
    })
  }

  private handleBoatMovement(pointer: Phaser.Input.Pointer) {
    const dx = pointer.x - this.boat.x
    const dy = pointer.y - this.boat.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > this.moveSpeed) {
      const ratio = this.moveSpeed / distance
      this.boat.x += dx * ratio
      this.boat.y += dy * ratio
    } else {
      this.boat.x = pointer.x
      this.boat.y = pointer.y
    }
    
    this.clampBoatPosition()
  }

  private handleKeyboardInput(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.boat.x = Math.max(this.boat.displayWidth/2, this.boat.x - this.moveSpeed)
        break
      case 'ArrowRight':
        this.boat.x = Math.min(this.gameWidth - this.boat.displayWidth/2, this.boat.x + this.moveSpeed)
        break
      case 'ArrowUp':
        this.boat.y = Math.max(this.boat.displayHeight/2, this.boat.y - this.moveSpeed)
        break
      case 'ArrowDown':
        this.boat.y = Math.min(this.gameHeight - this.boat.displayHeight/2, this.boat.y + this.moveSpeed)
        break
    }
    this.clampBoatPosition()
  }

  private clampBoatPosition() {
    const boatWidth = this.boat.displayWidth
    const boatHeight = this.boat.displayHeight
    this.boat.x = Phaser.Math.Clamp(this.boat.x, boatWidth/2, this.gameWidth - boatWidth/2)
    this.boat.y = Phaser.Math.Clamp(this.boat.y, boatHeight/2, this.gameHeight - boatHeight/2)
  }

  private createText(x: number, y: number, text: string, style: Partial<Phaser.Types.GameObjects.Text.TextStyle> = {}) {
    return this.add.text(x, y, text, {
      fontSize: `${Math.floor(this.baseScale * 24)}px`,
      color: '#fff',
      fontFamily: 'Arial',
      resolution: 2,
      padding: { x: 2, y: 2 },
      ...style
    })
      .setDepth(100)
      .setAlpha(1)
  }

  override update() {
    if (!this.gameStarted || this.gameOver) return

    this.updateScore()
    this.updateObstacles()
    this.checkCollisions()
    this.spawnObstacles()
  }

  private updateScore() {
    this.score++
    this.scoreText.setText('得分: ' + this.score)
  }

  private updateObstacles() {
    this.obstacles.forEach((obstacle, index) => {
      obstacle.y += 2 + Math.floor(this.score / 200)
      
      if (obstacle.y > this.gameHeight + 50) {
        obstacle.destroy()
        this.obstacles.splice(index, 1)
      }
    })
  }

  private spawnObstacles() {
    if (Math.random() < 0.01 + Math.floor(this.score / 300) * 0.003) {
      this.spawnObstacle()
    }
  }

  private startGame() {
    this.gameStarted = true
    this.startText.destroy()
    this.resetGameState()
  }

  private spawnObstacle() {
    const sectionWidth = this.gameWidth / 8
    this.lastObstacleX = (this.lastObstacleX + sectionWidth) % this.gameWidth
    
    // 随机选择粽子图片
    const zongziKey = Math.random() < 0.5 ? 'zongzi1' : 'zongzi2'
    
    const obstacle = this.add.sprite(
      this.lastObstacleX,
      -50,
      zongziKey
    ).setScale(this.baseScale * 0.15)
    
    this.obstacles.push(obstacle)
  }

  private checkCollisions() {
    for (const obstacle of this.obstacles) {
      const boatRadius = this.boat.displayWidth * 0.25
      const obstacleRadius = obstacle.displayWidth * 0.3
      
      const dx = this.boat.x - obstacle.x
      const dy = this.boat.y - obstacle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < boatRadius + obstacleRadius) {
        this.handleGameOver()
        break
      }
    }
  }

  private handleGameOver() {
    this.gameOver = true
    this.gameOverText = this.createText(
      this.gameWidth / 2,
      this.gameHeight / 2,
      '游戏结束\n点击屏幕重新开始',
      { align: 'center' }
    ).setOrigin(0.5)

    this.input.once('pointerdown', () => {
      this.restartGame()
    })
  }

  private restartGame() {
    this.gameOver = false
    this.gameStarted = false
    this.resetGameState()
    this.resetUI()
  }

  private resetGameState() {
    this.score = 0
    this.obstacles.forEach(obstacle => obstacle.destroy())
    this.obstacles = []
    this.lastObstacleX = 0
    this.boat.x = this.gameWidth / 2
    this.boat.y = this.gameHeight * 0.7
  }

  private resetUI() {
    if (this.gameOverText) {
      this.gameOverText.destroy()
      this.gameOverText = undefined
    }
    
    this.scoreText.setText('得分: 0')
    this.startText = this.createText(
      this.gameWidth / 2,
      this.gameHeight / 2,
      '点击屏幕开始游戏',
      { align: 'center' }
    ).setOrigin(0.5)
  }
} 