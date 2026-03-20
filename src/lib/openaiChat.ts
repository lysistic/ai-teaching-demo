type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatInputMessage = {
  role: 'user' | 'assistant'
  text: string
  imageDataUrl?: string
}

type ResponsesApiResponse = {
  output_text?: string
  output?: Array<{
    content?: Array<{
      type?: string
      text?: string
    }>
  }>
}

const DEFAULT_BASE_URL = 'https://yunyi.cfd/codex/v1'
const DEFAULT_MODEL = 'gpt-5.4'

function resolveBaseUrl(baseUrl: string) {
  if (import.meta.env.DEV) {
    return '/api'
  }
  return baseUrl
}

function extractFirstJsonObject(raw: string) {
  const source = raw.trimStart()
  const start = source.indexOf('{')
  if (start < 0) {
    return null
  }

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

function getResponsesUrl(baseUrl: string) {
  return baseUrl.endsWith('/responses') ? baseUrl : `${baseUrl}/responses`
}

function extractResponseText(data: ResponsesApiResponse) {
  const contentFromOutput = data.output_text?.trim()
  const contentFromItems = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((item) => item.text?.trim() ?? '')
    .filter(Boolean)
    .join('\n')
    .trim()

  return contentFromOutput || contentFromItems
}

type SendResponseOptions = {
  apiKey?: string
  model: string
  baseUrl: string
  input: unknown
  useWebSearch: boolean
}

async function sendResponsesRequest(options: SendResponseOptions) {
  const payload = {
    model: options.model,
    input: options.input,
    temperature: 0.6,
    ...(options.useWebSearch ? { tools: [{ type: 'web_search_preview' }] } : {}),
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.apiKey) {
    headers.Authorization = `Bearer ${options.apiKey}`
  }

  return fetch(getResponsesUrl(options.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
}

async function parseRelayResponse(response: Response) {
  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`调用失败(${response.status}): ${errText || '未知错误'}`)
  }

  const rawText = await response.text()
  const jsonText = extractFirstJsonObject(rawText)
  if (!jsonText) {
    throw new Error('中转返回非JSON内容，无法解析')
  }

  let data: ResponsesApiResponse
  try {
    data = JSON.parse(jsonText) as ResponsesApiResponse
  } catch {
    throw new Error('中转返回JSON格式异常，无法解析')
  }

  const content = extractResponseText(data)

  if (!content) {
    throw new Error('模型返回为空')
  }

  return content
}

export async function askTeachingAssistant(question: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  const baseUrl = resolveBaseUrl(
    (import.meta.env.VITE_OPENAI_BASE_URL as string | undefined) || DEFAULT_BASE_URL
  )
  const model = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || DEFAULT_MODEL

  if (!import.meta.env.DEV && !apiKey) {
    throw new Error('缺少 VITE_OPENAI_API_KEY，请先在 .env.local 配置。')
  }

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content:
        '你是一名AI教学助教，请用中文回答。输出结构为：核心要点、解题思路、学习建议。内容精炼、鼓励式、可执行。',
    },
    {
      role: 'user',
      content: question,
    },
  ]

  const response = await sendResponsesRequest({
    apiKey,
    model,
    baseUrl,
    input: messages,
    useWebSearch: false,
  })

  return parseRelayResponse(response)
}

export async function chatWithCodex(options: {
  systemInstruction?: string
  messages: ChatInputMessage[]
  useWebSearch?: boolean
}): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  const baseUrl = resolveBaseUrl(
    (import.meta.env.VITE_OPENAI_BASE_URL as string | undefined) || DEFAULT_BASE_URL
  )
  const model = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || DEFAULT_MODEL

  if (!import.meta.env.DEV && !apiKey) {
    throw new Error('缺少 VITE_OPENAI_API_KEY，请先在 .env.local 配置。')
  }

  if (!options.messages.length) {
    throw new Error('消息为空，无法发起对话')
  }

  const input: Array<{ role: 'system' | 'user' | 'assistant'; content: string | Array<{ type: string; text?: string; image_url?: string }> }> = []

  if (options.systemInstruction?.trim()) {
    input.push({
      role: 'system',
      content: options.systemInstruction.trim(),
    })
  }

  options.messages.forEach((msg) => {
    if (msg.imageDataUrl) {
      input.push({
        role: msg.role,
        content: [
          { type: 'input_text', text: msg.text || '请结合这张图片回答。' },
          { type: 'input_image', image_url: msg.imageDataUrl },
        ],
      })
      return
    }

    input.push({
      role: msg.role,
      content: msg.text,
    })
  })

  const useWebSearch = Boolean(options.useWebSearch)
  let response = await sendResponsesRequest({
    apiKey,
    model,
    baseUrl,
    input,
    useWebSearch,
  })

  if (!response.ok && useWebSearch) {
    response = await sendResponsesRequest({
      apiKey,
      model,
      baseUrl,
      input,
      useWebSearch: false,
    })
  }

  return parseRelayResponse(response)
}
