// remove-comments.cjs
const { build } = require('esbuild')
const { globSync } = require('glob')
const fs = require('fs')

const files = globSync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['node_modules/**', 'public/**', 'dist/**'],
})

console.log(`🔍 Найдено ${files.length} файлов`)

for (const file of files) {
  try {
    const result = build.sync({
      entryPoints: [file],
      write: false,
      bundle: false,
      minify: false,
      legalComments: 'none',
      format: 'esm',
      target: 'es2020',
    })

    fs.writeFileSync(file, result.outputFiles[0].text)
    console.log(`✅ Очищено: ${file}`)
  } catch (e) {
    console.error(`❌ Ошибка в ${file}:`, e.message)
  }
}

console.log('🎉 Готово. Все комментарии удалены.')
