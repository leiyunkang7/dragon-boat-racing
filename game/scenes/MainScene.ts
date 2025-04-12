import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  private boat!: Phaser.GameObjects.Sprite
  private obstacles: Phaser.GameObjects.Sprite[] = []
  private score: number = 0
  private avoidedZongziCount: number = 0  // 记录成功躲避的粽子数量
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
  private lastObstacleY: number = 0  // 记录上一个障碍物的Y坐标
  private readonly MIN_OBSTACLE_DISTANCE = 150  // 障碍物之间的最小距离
  private readonly SCREEN_SECTIONS = 5  // 将屏幕分成5个区域
  private lastSection: number = -1  // 记录上一个障碍物所在的区域
  private readonly BASE_SPEED = 3  // 基础移动速度
  private readonly MAX_SPEED = 6   // 最大移动速度
  private readonly MIN_SPAWN_INTERVAL = 0.5  // 最小生成间隔（秒）
  private readonly MAX_SPAWN_INTERVAL = 2.0  // 最大生成间隔（秒）
  private lastSpawnTime: number = 0  // 上次生成时间

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
    ).setScale(this.baseScale * 0.2)

    // 添加分数文本
    this.scoreText = this.createText(this.gameWidth - 16, 16, '0/30', { align: 'right' })
      .setOrigin(1, 0)
      .setScrollFactor(0)

    // 添加提示文本
    this.createText(
      this.gameWidth / 2,
      16,
      '躲避30个粽子即可通关',
      { align: 'center' }
    ).setOrigin(0.5, 0)
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
      color: '#000000',
      fontFamily: 'Arial',
      resolution: 2,
      padding: { x: 2, y: 2 },
      stroke: '#ffffff',
      strokeThickness: 3,
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

  private updateObstacles() {
    // 根据进度计算当前速度
    const progress = this.avoidedZongziCount / 30
    const currentSpeed = this.BASE_SPEED + 
      (this.MAX_SPEED - this.BASE_SPEED) * progress

    this.obstacles.forEach((obstacle, index) => {
      obstacle.y += currentSpeed
      
      if (obstacle.y > this.gameHeight + 50) {
        this.avoidedZongziCount++
        this.updateScore()
        obstacle.destroy()
        this.obstacles.splice(index, 1)
        
        if (this.avoidedZongziCount >= 30) {
          this.handleGameOver()
        }
      }
    })
  }

  private updateScore() {
    this.scoreText.setText('' + this.avoidedZongziCount + '/30')
  }

  private spawnObstacles() {
    const currentTime = this.time.now
    const timeSinceLastSpawn = (currentTime - this.lastSpawnTime) / 1000  // 转换为秒
    
    // 根据已躲避的粽子数量计算当前难度
    const progress = this.avoidedZongziCount / 30
    const currentSpawnInterval = this.MAX_SPAWN_INTERVAL - 
      (this.MAX_SPAWN_INTERVAL - this.MIN_SPAWN_INTERVAL) * progress
    
    if (timeSinceLastSpawn >= currentSpawnInterval) {
      this.spawnObstacle()
      this.lastSpawnTime = currentTime
    }
  }

  private spawnObstacle() {
    let targetSection = Math.floor(Math.random() * this.SCREEN_SECTIONS)
    
    if (targetSection === this.lastSection) {
      targetSection = (targetSection + 1) % this.SCREEN_SECTIONS
    }
    this.lastSection = targetSection
    
    const sectionWidth = this.gameWidth / this.SCREEN_SECTIONS
    const minX = targetSection * sectionWidth
    const maxX = (targetSection + 1) * sectionWidth
    
    const x = minX + Math.random() * sectionWidth
    const y = -50
    
    // 根据进度调整粽子大小
    const progress = this.avoidedZongziCount / 30
    const minScale = 0.12
    const maxScale = 0.18
    const currentScale = minScale + (maxScale - minScale) * progress
    
    const zongziKey = Math.random() < 0.5 ? 'zongzi1' : 'zongzi2'
    
    const obstacle = this.add.sprite(
      x,
      y,
      zongziKey
    ).setScale(this.baseScale * currentScale)
    
    this.obstacles.push(obstacle)
  }

  private startGame() {
    this.gameStarted = true
    this.startText.destroy()
    this.resetGameState()
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
    
    // 发送游戏结束事件，包含是否通关和躲避的粽子数量
    this.game.events.emit('gameOver', {
      isSuccess: this.avoidedZongziCount >= 30,
      score: this.avoidedZongziCount
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
    this.avoidedZongziCount = 0
    this.obstacles.forEach(obstacle => obstacle.destroy())
    this.obstacles = []
    this.lastObstacleX = 0
    this.lastSpawnTime = 0
    this.boat.x = this.gameWidth / 2
    this.boat.y = this.gameHeight * 0.7
  }

  private resetUI() {
    this.scoreText.setText('0/30')
    this.startText = this.createText(
      this.gameWidth / 2,
      this.gameHeight / 2,
      '点击屏幕开始游戏',
      { align: 'center' }
    ).setOrigin(0.5)
  }
} 