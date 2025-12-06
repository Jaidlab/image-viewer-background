import path from 'path'

import * as sass from "sass-embedded"
import {minify} from "html-minifier-terser"
import sharp from 'sharp'
import fs from 'fs-extra'

const srcDir = path.resolve(import.meta.dir, '..', 'src')
const outDir = path.resolve(import.meta.dir, '..', 'out', 'page')
fs.emptyDirSync(outDir)

const buildCss = async () => {
  const inputFile = path.join(srcDir, 'index.sass')
  const outputFile = path.join(outDir, 'main.css')
  const sassResult = sass.compile(inputFile)
  return Bun.write(outputFile, sassResult.css)
}

const buildImage = async () => {
  const inputFile = path.join(srcDir, 'bun.jxl')
  const outputFile = path.join(outDir, 'bun.webp')
  // WAITINGFOR https://chromium-review.googlesource.com/c/chromium/src/+/7184969 so we can remove the conversion
  return sharp(inputFile).toFile(outputFile)
}

const buildHtml = async () => {
  const inputFile = path.join(srcDir, 'index.html')
  const outputFile = path.join(outDir, 'index.html')
  const html = await fs.readFile(inputFile)
  const minifiedHtml = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
  })
  return Bun.write(outputFile, minifiedHtml)
}

await Promise.all([
  buildCss(),
  buildImage(),
  buildHtml(),
])
