import fs from 'node:fs'
import path from 'node:path'

function loadEnvFile(filePath) {
  const env = {}
  if (!fs.existsSync(filePath)) return env

  const content = fs.readFileSync(filePath, 'utf-8')
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const index = line.indexOf('=')
    if (index <= 0) continue
    const key = line.slice(0, index).trim()
    const value = line.slice(index + 1).trim().replace(/^"|"$/g, '')
    env[key] = value
  }
  return env
}

function buildResponsesUrl(baseUrl) {
  if (!baseUrl) return ''
  return baseUrl.endsWith('/responses') ? baseUrl : `${baseUrl}/responses`
}

function extractFirstJsonObject(raw) {
  const source = raw.trimStart()
  const start = source.indexOf('{')
  if (start < 0) return null

  let inString = false
  let escaped = false
  let depth = 0

  for (let index = start; index < source.length; index += 1) {
    const ch = source[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch === '{') {
      depth += 1
      continue
    }

    if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        return source.slice(start, index + 1)
      }
    }
  }

  return null
}

function extractResponseText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  const outputChunks = (data?.output ?? [])
    .flatMap((item) => item?.content ?? [])
    .map((item) => {
      if (typeof item?.text === 'string') return item.text.trim()
      if (typeof item?.output_text === 'string') return item.output_text.trim()
      if (typeof item?.transcript === 'string') return item.transcript.trim()
      return ''
    })
    .filter(Boolean)

  const choiceChunks = (data?.choices ?? [])
    .map((choice) => {
      const content = choice?.message?.content
      if (typeof content === 'string') return content.trim()
      if (Array.isArray(content)) {
        return content
          .map((part) => (typeof part?.text === 'string' ? part.text.trim() : ''))
          .filter(Boolean)
          .join('\n')
      }
      return ''
    })
    .filter(Boolean)

  return [...outputChunks, ...choiceChunks].join('\n').trim()
}

async function main() {
  const projectRoot = process.cwd()
  const envFile = path.join(projectRoot, '.env.local')
  const fileEnv = loadEnvFile(envFile)

  const baseUrl = process.env.VITE_OPENAI_BASE_URL || fileEnv.VITE_OPENAI_BASE_URL
  const model = process.env.VITE_OPENAI_MODEL || fileEnv.VITE_OPENAI_MODEL || 'gpt-5.4'
  const apiKey = process.env.VITE_OPENAI_API_KEY || fileEnv.VITE_OPENAI_API_KEY

  if (!baseUrl || !apiKey) {
    console.error('❌ 缺少配置：请在 .env.local 设置 VITE_OPENAI_BASE_URL 和 VITE_OPENAI_API_KEY')
    process.exit(1)
  }

  const url = buildResponsesUrl(baseUrl)
  console.log(`🔗 Testing relay: ${url}`)
  console.log(`🤖 Model: ${model}`)

  const requestBody = {
    model,
    input: [
      { role: 'system', content: 'You are a concise Chinese teaching assistant.' },
      { role: 'user', content: '请回复“relay ok”，并附上一个10字以内的教学建议。' },
    ],
    temperature: 0.2,
  }

  const startedAt = Date.now()
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  })
  const elapsed = Date.now() - startedAt

  const text = await response.text()
  const jsonText = extractFirstJsonObject(text)
  let data = null
  try {
    data = jsonText ? JSON.parse(jsonText) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    console.error(`❌ Relay request failed: HTTP ${response.status} (${elapsed}ms)`)
    console.error(text.slice(0, 500) || '<empty body>')
    process.exit(1)
  }

  const answer = data ? extractResponseText(data) : ''
  console.log(`✅ Relay request succeeded: HTTP ${response.status} (${elapsed}ms)`)
  if (answer) {
    console.log('🧠 Model output:')
    console.log(answer)
  } else {
    console.log('⚠️ 响应成功，但未解析到 output_text，原始返回片段如下：')
    if (data && typeof data === 'object') {
      const keys = Object.keys(data)
      console.log(`(debug) top-level keys: ${keys.join(', ')}`)
      if (Array.isArray(data.output)) {
        console.log(`(debug) output items: ${data.output.length}`)
      }
    }
    console.log(text.slice(0, 500))
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`❌ Script error: ${message}`)
  process.exit(1)
})
