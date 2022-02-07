#!/usr/bin/env zx

function countIndentation(line) {
  let numIndent = 0
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '\t' || line[i] === ' ') {
      numIndent += 1
    } else {
      break
    }
  }
  return numIndent
}

async function getCardDetail({ path, text, lineNum }) {
  const md = await fs.promises.readFile(path, 'utf-8')
  const lines = md.split('\n')
  const startIdx = lineNum - 1
  const line = lines[startIdx]
  const baseIndent = countIndentation(line)
  let endLineNum = startIdx + 1

  while (endLineNum < lines.length) {
    if (countIndentation(lines[endLineNum]) <= baseIndent) {
      break
    }
    endLineNum += 1
  }

  const fullText = lines.slice(startIdx, endLineNum).join('\n')

  return {
    path,
    fullText,
    lineNum,
  }
}

import path from 'path'
;(async () => {
  $.verbose = false

  const LOGSEQ_DIR = process.env.LOGSEQ_DIR

  if (!LOGSEQ_DIR) {
    throw new Error('Please provide LOGSEQ_DIR env variable.')
  }

  try {
    await fs.promises.stat(path.resolve(LOGSEQ_DIR, 'journals'))
    await fs.promises.stat(path.resolve(LOGSEQ_DIR, 'pages'))
  } catch (e) {
    console.log(
      `It looks like ${LOGSEQ_DIR} is not a proper Logseq root directory.`
    )
    throw e
  }

  const rs = await $`rg --json -e "\\s#card\\s" ${LOGSEQ_DIR} |
                      fx "select(x => x.type === 'match')" "{path: this.data.path.text, text: this.data.lines.text, lineNum: this.data.line_number}" |
                      jq -c`

  const cards = JSON.parse(
    `[${rs.stdout
      .split('\n')
      .filter((x) => x)
      .join(',')}]`
  )

  const idx = Math.floor(Math.random() * cards.length)
  const detail = await getCardDetail(cards[idx])
  console.log(
    detail.fullText
      .split('\n')
      .filter((x) => !x.trim().startsWith('card-'))
      .map((s) => s.replace(/{{cloze .*}}/g, '[...]'))
      .join('\n')
  )
})()
