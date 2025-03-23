import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const svgFiles = ['boat.svg', 'obstacle.svg', 'background.svg']
const publicDir = join(__dirname, '../public')

async function convertSvgToPng(svgFile) {
  const svgPath = join(publicDir, svgFile)
  const pngFile = svgFile.replace('.svg', '.png')
  const pngPath = join(publicDir, pngFile)

  try {
    await sharp(svgPath)
      .resize(800, 600, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(pngPath)
    console.log(`Converted ${svgFile} to ${pngFile}`)
  } catch (error) {
    console.error(`Error converting ${svgFile}:`, error)
  }
}

async function convertAll() {
  for (const svgFile of svgFiles) {
    await convertSvgToPng(svgFile)
  }
}

convertAll() 