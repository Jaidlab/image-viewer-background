import path from 'path'

import * as sass from "sass"
import {minify} from "html-minifier-terser"

const srcDir = path.resolve(import.meta.dir, '..', 'src')
const outDir = path.resolve(import.meta.dir, '..', 'out', 'page')

const sassResult = sass.compile(path.join(srcDir, 'index.sass'))

await Bun.write(path.join(outDir, 'main.css'), sassResult.css)

const imagePath = path.join(srcDir, 'bun.webp')
const imageFile = Bun.file(imagePath)
await Bun.write(path.join(outDir, 'bun.webp'), imageFile)

const htmlTemplate = await Bun.file(path.join(srcDir, 'index.html')).text()

const minifiedHtml = await minify(htmlTemplate, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
})

await Bun.write(path.join(outDir, 'index.html'), minifiedHtml)

console.log(`Built to ${outDir}`)
