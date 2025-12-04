import path from 'path'

import * as sass from "sass"
import {minify} from "html-minifier-terser"
import {renderHtmlHandlebars} from "zeug"

const srcDir = path.resolve(import.meta.dir, '..', 'src')
const outDir = path.resolve(import.meta.dir, '..', 'out')

const htmlTemplate = await Bun.file(path.join(srcDir, 'index.html.hbs')).text()
const sassResult = await sass.compileAsync(path.join(srcDir, 'index.sass'), {
  style: "compressed",
})

const imagePath = path.join(srcDir, 'bun.webp')
const imageFile = Bun.file(imagePath)
const imageBuffer = await imageFile.arrayBuffer()
const base64 = Buffer.from(imageBuffer).toString("base64")
const imageUrl = `data:image/webp;base64,${base64}`

const html = renderHtmlHandlebars(htmlTemplate, {
  CSS: sassResult.css,
  imageUrl,
})

const minifiedHtml = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
})

await Bun.write(path.join(outDir, 'index.html'), minifiedHtml)

console.log(`Built to ${path.join(outDir, 'index.html')}`)
