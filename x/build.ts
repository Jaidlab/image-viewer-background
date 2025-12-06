import path from 'path'

import * as sass from "sass-embedded"
import {minify} from "html-minifier-terser"
import sharp from 'sharp'
import fs from 'fs-extra'

import inputHtml from "src/index.html" with { type: "text" }

const srcDir = path.resolve(import.meta.dir, '..', 'src')
const outDir = path.resolve(import.meta.dir, '..', 'out', 'page')
fs.emptyDirSync(outDir)

const buildCss = async () => {
  const sassResult = sass.compile(path.join(srcDir, 'index.sass'))
  return Bun.write(path.join(outDir, 'main.css'), sassResult.css)
}

const buildImage = async () => {
  const inputFile = path.join(srcDir, 'bun.jxl')
  const outputFile = path.join(outDir, 'bun.webp')
  return sharp(inputFile).avif().toFile(outputFile)
}

const buildHtml = async () => {
  const minifiedHtml = await minify(inputHtml, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
  })
  return Bun.write(path.join(outDir, 'index.html'), minifiedHtml)
}

await Promise.all([
  buildCss(),
  buildImage(),
  buildHtml(),
])
