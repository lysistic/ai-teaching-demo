import { useMemo, useRef, useState } from 'react'
import {
  BadgeCheck,
  Bot,
  CircleHelp,
  GraduationCap,
 Library,
  NotebookPen,
  Radar,
  RefreshCcw,
  Rocket,
  Sparkles,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar as RadarShape,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { cn } from '../lib/cn'
import {
  counterExampleForB,
  counterExampleForC,
  demoTasks,
  runStrategy,
  type StrategyKey,
} from '../lib/intervalScheduling'
import { Thinking } from '../components/Thinking'
import { TypewriterText } from '../components/TypewriterText'
import { Markdown } from '../components/Markdown'

type ChatMsg =
  | { role: 'user'; text: string; ts: number }
  | { role: 'ai'; text: string; ts: number; streaming?: boolean }

type ScenarioKey = '课前预习' | '课堂讲解' | '课后巩固' | '实验验证'
type InteractionStageKey = 'pre' | 'post'

type QuickInteraction = {
  label: string
  helper: string
  userText: string
  aiText: string
}

const scenarioConfig: Record<
  ScenarioKey,
  {
    title: string
    subtitle: string
    questionText: string
    focus: string
  }
> = {
  课前预习: {
    title: '课前预习',
    subtitle: '先建立直觉，再带着问题进课堂',
    questionText:
      '课前预习：如果你的目标是给后续任务尽量留出空间，你会优先关注哪个贪心策略？',
    focus: '建议先判断“哪个选择最不容易挡住后续任务”。',
  },
  课堂讲解: {
    title: '课堂讲解',
    subtitle: '反例引导 + 交换论证 + 个性化反馈',
    questionText:
      '在"漏洞修复任务调度"中，每个任务占用一个时间区间（start, end）。目标：选择最多个互不重叠的修复任务。你会选哪种策略作为"最优贪心"？',
    focus: '课堂阶段建议同时比较“正确策略”和“看似合理但会失效的策略”。',
  },
  课后巩固: {
    title: '课后巩固',
    subtitle: '复盘错因，完成迁移应用',
    questionText:
      '课后巩固：如果你要把本节课的方法迁移到新场景，哪种策略仍然最能保证“可安排任务数最多”？',
    focus: '课后建议把结论转化成自己的语言，并完成一次迁移练习。',
  },
  实验验证: {
    title: '实验验证',
    subtitle: '用实验结果对照最优基准',
    questionText:
      '实验验证：当你把四种策略与暴力最优基准进行对照时，哪种策略能够稳定对齐最优结果？',
    focus: '实验阶段重点是“拿数据说话”，验证思路而不是只记结论。',
  },
}

const stageTail: Record<ScenarioKey, string> = {
  课前预习: [
    '### 课前互动建议',
    '- 先写一句自己的预测：为什么“结束更早”可能更有优势？',
    '- 把“开始最早为什么不稳妥”带着去听课，课堂上重点验证这个问题。',
  ].join('\n'),
  课堂讲解: [
    '### 课堂互动建议',
    '- 用同一组区间同时比较 A/B/C 三种策略的结果差异。',
    '- 尝试把“交换论证”的第一步口头讲给同桌听，看看是否说得清楚。',
  ].join('\n'),
  课后巩固: [
    '### 课后互动建议',
    '- 先写一段错因复盘：错误策略究竟挡住了哪些后续选择？',
    '- 再完成一道迁移题，把本节课方法用到新的排期场景里。',
  ].join('\n'),
  实验验证: [
    '### 实验互动建议',
    '- 把你自己的 6 个区间喂给四种策略，观察谁会偏离最优基准。',
    '- 记录“正确但低效”和“高效且最优”的差别，这是实验结论的一部分。',
  ].join('\n'),
}

const quickInteractions: Record<
  InteractionStageKey,
  {
    title: string
    subtitle: string
    icon: typeof NotebookPen
    targetScenario: ScenarioKey
    actions: QuickInteraction[]
  }
> = {
  pre: {
    title: '课前互动',
    subtitle: '唤醒旧知识，带着预测进入课堂',
    icon: NotebookPen,
    targetScenario: '课前预习',
    actions: [
      {
        label: '知识唤醒',
        helper: '先用生活化类比理解区间调度',
        userText: '请带我做一轮课前预习，用生活化例子唤醒我对区间调度的理解。',
        aiText: [
          '### 课前互动 · 知识唤醒',
          '把它想成“安排维修工程师的抢修窗口”：每个任务都会占用一段时间。',
          '- 如果一个任务结束得很早，后面还能继续接更多任务。',
          '- 如果一个任务开始很早但拖得很久，它可能会堵住后续许多短任务。',
          '先别急着记答案，先回答一句话：**你觉得什么样的任务最不容易挡住后面的安排？**',
        ].join('\n'),
      },
      {
        label: '策略预测',
        helper: '先猜一猜哪类指标最值得关注',
        userText: '我想做课前预测，请帮我梳理上课时应该优先观察哪些指标。',
        aiText: [
          '### 课前互动 · 策略预测',
          '建议你带着这份“观察清单”去听课：',
          '- 先看任务**何时结束**，因为它决定后面还能接多少任务。',
          '- 再看“开始早”和“工期短”为什么只是表面上看起来合理。',
          '- 课堂上重点验证：结束时间更早，是否真的给后续留下了更多空间？',
        ].join('\n'),
      },
      {
        label: '预习提问',
        helper: '生成一组带着去听课的问题',
        userText: '请帮我生成一组课前提问，让我带着问题去听这节课。',
        aiText: [
          '### 课前互动 · 预习提问',
          '建议你带着这 3 个问题进课堂：',
          '1. 为什么“开始最早”不一定最好？',
          '2. 结束时间最早和后续可选空间之间是什么关系？',
          '3. 如果正确答案已经知道了，怎样证明它不只是“碰巧有效”？',
        ].join('\n'),
      },
    ],
  },
  post: {
    title: '课后互动',
    subtitle: '复盘错因，迁移应用并生成复习单',
    icon: RefreshCcw,
    targetScenario: '课后巩固',
    actions: [
      {
        label: '错因复盘',
        helper: '把易错策略的失败原因讲清楚',
        userText: '我想做课后复盘，请帮我回顾 B/C 为什么不是最优策略。',
        aiText: [
          '### 课后互动 · 错因复盘',
          '你可以按这条线索回顾：',
          '- 选 B 时，问题不在“开始早”，而在它可能持续太久，挡住后续多个短任务。',
          '- 选 C 时，问题不在“任务短”，而在短任务之间可能依旧互相冲突。',
          '复盘时请补上一句：**真正应该优先保留的是后续可选空间，而不是眼前看起来最顺眼的指标。**',
        ].join('\n'),
      },
      {
        label: '迁移应用',
        helper: '把本节课方法迁移到新场景',
        userText: '请给我一个课后迁移任务，把这节课的方法用到新的应用场景。',
        aiText: [
          '### 课后互动 · 迁移应用',
          '迁移任务：把“漏洞修复调度”换成“机房停电检修排期”。',
          '- 每个检修任务都有开始和结束时间。',
          '- 目标仍然是安排最多个互不重叠的检修任务。',
          '请你自己完成两步：先选策略，再说明为什么“结束最早”仍然成立。',
        ].join('\n'),
      },
      {
        label: '复习单',
        helper: '按 10 分钟生成课后巩固安排',
        userText: '帮我生成一份 10 分钟的课后复习单，方便我自己巩固。',
        aiText: [
          '### 课后互动 · 10 分钟复习单',
          '- 第 1-3 分钟：回看正确策略，写下“为什么是结束最早”这句核心结论。',
          '- 第 4-6 分钟：任选 B 或 C，自己构造一个反例。',
          '- 第 7-8 分钟：用口头语言讲一遍交换论证的第一步。',
          '- 第 9-10 分钟：完成一个迁移场景，检查自己是否还能选出 A。',
        ].join('\n'),
      },
    ],
  },
}

function buildAiFeedback(choice: StrategyKey, scenario: ScenarioKey) {
  const correct: StrategyKey = 'A'
  const stageIntro = `> **当前阶段：${scenarioConfig[scenario].title}**  ${scenarioConfig[scenario].focus}`

  if (choice === correct) {
    const rA = runStrategy('A', demoTasks)
    const rD = runStrategy('D', demoTasks)
    const same = rA.score.count === rD.score.count

    return [
      `## ✅ 正确！你选择了"最早结束时间"`,
      stageIntro,
      `> **关键洞察**：在区间调度问题中，**按结束时间最早排序**的贪心策略可以证明是最优的。`,
      `### 为什么它是最优的？\n- **保留最多后续空间**：越早结束，留给后面任务的时间就越多\n- **交换论证**：任意最优解中的第一个任务，都可以替换成"结束最早的任务"，结果不会变差`,
      `### 验证结果（与暴力枚举对照）\n| 策略 | 选中任务数 | 严重度总和 |\n|---|---:|---:|\n| A（最早结束） | ${rA.score.count} | ${rA.score.severitySum} |\n| D（暴力最优） | ${rD.score.count} | ${rD.score.severitySum} |\n\n结论：A 与 D **${same ? '一致（验证最优）' : '不一致（需检查数据规模）'}**。`,
      `### 下一步建议\n- 试试提交其他选项，我会给你展示反例，解释为什么它们不是最优\n- 进阶练习：尝试用"交换论证"写出完整的证明过程`,
      stageTail[scenario],
    ].join('\n\n')
  }

  if (choice === 'B') {
    const rB = runStrategy('B', counterExampleForB)
    const rA = runStrategy('A', counterExampleForB)
    const rD = runStrategy('D', counterExampleForB)
    return [
      `## ❌ 不是最优："最早开始时间"`,
      stageIntro,
      `> **直觉陷阱**：开始最早的任务可能"持续时间很长"，会挡住后面多个短任务。`,
      `### 反例演示\n假设有 3 个任务：\n- 任务 1: [0, 10]（开始最早，但持续很久）\n- 任务 2: [1, 2]（开始稍晚，但很快结束）\n- 任务 3: [3, 4]（开始更晚，也很快结束）\n\n按"最早开始"会选择任务 1（只能选 1 个），但最优解是选任务 2+3（能选 2 个）。`,
      `### 实际运行结果\n- B（最早开始）：选中 **${rB.score.count}** 个\n- A（最早结束）：选中 **${rA.score.count}** 个\n- D（暴力最优）：选中 **${rD.score.count}** 个`,
      `### 提示\n- 弱提示：如果你想"尽量不挡后面的人"，应该关心任务何时**结束**，而不是何时**开始**\n- 强提示：**结束越早越好**，这样能为后续保留更多选择空间`,
      stageTail[scenario],
    ].join('\n\n')
  }

  if (choice === 'C') {
    const rC = runStrategy('C', counterExampleForC)
    const rA = runStrategy('A', counterExampleForC)
    const rD = runStrategy('D', counterExampleForC)
    return [
      `## ❌ 不是最优："最短任务间隔"`,
      stageIntro,
      `> **直觉陷阱**：短任务≠最优。多个短任务可能互相冲突，反而不如一个更合理的组合。`,
      `### 反例演示\n假设有 3 个任务：\n- 任务 1: [0, 2]（很短）\n- 任务 2: [1, 3]（也很短，但与任务 1 冲突）\n- 任务 3: [4, 10]（较长，但能和前面形成不同取舍）\n\n按"最短优先"会只盯着区间长度，却忽略了后续能否兼容更多任务。`,
      `### 实际运行结果\n- C（最短间隔）：选中 **${rC.score.count}** 个\n- A（最早结束）：选中 **${rA.score.count}** 个\n- D（暴力最优）：选中 **${rD.score.count}** 个`,
      `### 思考题\n如果你的目标是"最大化可兼容任务数"，你更应该关心什么？\n- ❌ 区间长度？（短不一定好）\n- ❌ 开始时间？（早开始可能持续很久）\n- ✅ **结束时间**！（正确方向）`,
      stageTail[scenario],
    ].join('\n\n')
  }

  const rD = runStrategy('D', demoTasks)
  const rA = runStrategy('A', demoTasks)
  return [
    `## ⚠️ 结果可能接近最优，但效率不适合课堂常用方案`,
    stageIntro,
    `> **"最少冲突区间"** 需要额外统计冲突关系，思路不够直接，也不利于快速推广。`,
    `### 问题分析\n- 计算复杂度高：需要比较大量区间关系\n- 不够稳定：冲突少不等于一定能形成最长兼容链\n- 课堂迁移弱：不如"结束最早"那样便于证明与复用`,
    `### 对照结果\n- D（暴力最优）：选中 **${rD.score.count}** 个\n- A（最早结束）：选中 **${rA.score.count}** 个（更低复杂度达到同样效果）`,
    `### 引导\n如果你必须用"贪心"做到最优，同时保持低复杂度，你会怎么排序这些区间？\n\n提示：回到最本质的问题——我们想最大化什么？`,
    stageTail[scenario],
  ].join('\n\n')
}

export function StudentQA() {
  const [choice, setChoice] = useState<StrategyKey>('A')
  const [scenario, setScenario] = useState<ScenarioKey>('课堂讲解')
  const [thinking, setThinking] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: '你好！我是本节课的 AI 教学助理。我已经为你接入了课前预习、课堂讲解、课后巩固三段式互动。',
      ts: Date.now(),
    },
    {
      role: 'ai',
      text: `${scenarioConfig.课堂讲解.questionText}\n\n你也可以先点右侧的课前/课后互动按钮，直接发起对应阶段的引导任务。`,
      ts: Date.now() + 1,
    },
  ])

  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [timeline, setTimeline] = useState<{ k: number; acc: number }[]>([{ k: 0, acc: 0 }])
  const [interactionProgress, setInteractionProgress] = useState<Record<InteractionStageKey, number>>({
    pre: 0,
    post: 0,
  })
  const [rubric, setRubric] = useState({
    concept: 78,
    proof: 64,
    counterexample: 71,
    coding: 62,
    communication: 74,
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const scenarioInfo = scenarioConfig[scenario]

  const optionCards = useMemo(
    () =>
      [
        {
          k: 'A' as StrategyKey,
          title: 'A. 最早结束时间',
          sub: '优先选择结束时间最早的任务',
          desc: '按结束时间从早到晚排序，每次选择最早结束且不与已选任务冲突的任务。这样能为后续任务保留最多的时间空间。',
        },
        {
          k: 'B' as StrategyKey,
          title: 'B. 最早开始时间',
          sub: '优先选择开始时间最早的任务',
          desc: '按开始时间从早到晚排序，每次选择最早开始且不冲突的任务。看似合理，但可能选择一个很早开始但持续很久的任务，挡住后续多个短任务。',
        },
        {
          k: 'C' as StrategyKey,
          title: 'C. 最短任务间隔',
          sub: '优先选择持续时间最短的任务',
          desc: '按任务工期（end - start）从小到大排序，优先安排短任务。但短任务可能密集分布，互相冲突，反而不如一个长任务覆盖更多时间。',
        },
        {
          k: 'D' as StrategyKey,
          title: 'D. 最少冲突区间',
          sub: '优先选择与其他任务冲突最少的任务',
          desc: '统计每个任务与其他任务的重叠数量，优先选择冲突最少的。计算复杂度高，且不能保证得到最优解。',
        },
      ],
    []
  )

  const resources = useMemo(() => {
    const shared = [
      { title: '区间调度：活动选择问题（经典证明）', tag: '讲义' },
      { title: '贪心算法的"交换论证"模板', tag: '模板' },
    ]

    const scenarioResources: Record<ScenarioKey, { title: string; tag: string }[]> = {
      课前预习: [
        { title: '课前导学单：先看结束时间还是开始时间？', tag: '预习' },
        { title: '3 分钟预测卡：把直觉先写下来', tag: '互动' },
      ],
      课堂讲解: [
        { title: '网络安全运维：变更窗口与风险评估', tag: '拓展' },
        { title: '实验：同一数据下不同贪心策略对比', tag: '实验' },
      ],
      课后巩固: [
        { title: '课后复盘单：错因定位与迁移应用', tag: '复盘' },
        { title: '巩固练习：自己构造一个失败反例', tag: '任务' },
      ],
      实验验证: [
        { title: '实验记录模板：四策略对照表', tag: '实验' },
        { title: '自定义数据集：验证最优与效率差异', tag: '数据' },
      ],
    }

    return [...shared, ...scenarioResources[scenario]]
  }, [scenario])

  const interactionOverview = useMemo(
    () => [
      {
        key: 'pre' as InteractionStageKey,
        title: '课前预习进度',
        count: interactionProgress.pre,
        total: quickInteractions.pre.actions.length,
        summary: '是否已完成知识唤醒、策略预测和预习提问',
      },
      {
        key: 'post' as InteractionStageKey,
        title: '课后巩固进度',
        count: interactionProgress.post,
        total: quickInteractions.post.actions.length,
        summary: '是否已完成错因复盘、迁移应用和复习单生成',
      },
    ],
    [interactionProgress]
  )

  function pushAiExchange(userText: string, aiText: string, onComplete?: () => void) {
    const now = Date.now()
    setChat((prev) => [...prev, { role: 'user', text: userText, ts: now }])
    setThinking(true)
    setHasSubmitted(true)

    window.setTimeout(() => {
      const aiTs = Date.now()
      setChat((prev) => [...prev, { role: 'ai', text: aiText, ts: aiTs, streaming: true }])
      setThinking(false)
      onComplete?.()
      window.setTimeout(() => scrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 30)
    }, 700)
  }

  function onAsk() {
    const userText = `【${scenario}】我选择：选项 ${choice}。请给出解析与引导（如有反例）。`
    pushAiExchange(userText, buildAiFeedback(choice, scenario), () => {
      const isCorrect = choice === 'A'
      const nextAttempts = attempts + 1
      const nextCorrect = correct + (isCorrect ? 1 : 0)
      const acc = Math.round((nextCorrect / nextAttempts) * 100)

      setAttempts(nextAttempts)
      setCorrect(nextCorrect)
      setTimeline((t) => [...t, { k: nextAttempts, acc }].slice(-10))

      setRubric((r) => ({
        concept: Math.min(100, r.concept + (isCorrect ? 2 : 1) + (scenario === '课前预习' ? 1 : 0)),
        proof: Math.min(100, r.proof + (isCorrect ? 4 : 2) + (scenario === '课后巩固' ? 1 : 0)),
        counterexample: Math.min(100, r.counterexample + (isCorrect ? 2 : 5)),
        coding: Math.min(100, r.coding + (scenario === '实验验证' ? 3 : isCorrect ? 2 : 1)),
        communication: Math.min(100, r.communication + 2),
      }))
    })
  }

  function handleQuickInteraction(stage: InteractionStageKey, action: QuickInteraction) {
    const targetScenario = quickInteractions[stage].targetScenario
    setScenario(targetScenario)

    pushAiExchange(action.userText, action.aiText, () => {
      setInteractionProgress((prev) => ({
        ...prev,
        [stage]: Math.min(quickInteractions[stage].actions.length, prev[stage] + 1),
      }))

      setRubric((r) => ({
        concept: Math.min(100, r.concept + (stage === 'pre' ? 3 : 1)),
        proof: Math.min(100, r.proof + (stage === 'post' ? 3 : 1)),
        counterexample: Math.min(100, r.counterexample + (stage === 'post' ? 4 : 1)),
        coding: Math.min(100, r.coding + (stage === 'post' ? 2 : 0)),
        communication: Math.min(100, r.communication + 2),
      }))
    })
  }

  const radarData = useMemo(
    () => [
      { subject: '概念理解', v: rubric.concept },
      { subject: '证明思维', v: rubric.proof },
      { subject: '反例构造', v: rubric.counterexample },
      { subject: '编码表达', v: rubric.coding },
      { subject: '表达清晰', v: rubric.communication },
    ],
    [rubric]
  )

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 flex-1 min-h-0">
      <div className="glass neon-border flex h-full flex-col lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <CircleHelp className="h-6 w-6 text-indigo-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">学生问答 · AI 引导式学习</div>
              <div className="text-base text-white/60">课前预习 / 课堂互动 / 课后复盘一体化闭环</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white/80">场景：</span>
            <div className="flex max-w-full flex-nowrap gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 app-scrollbar">
              {(['课前预习', '课堂讲解', '课后巩固', '实验验证'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition whitespace-nowrap',
                    scenario === s ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/85'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/5 px-5 py-4">
            <div>
              <div className="text-lg font-semibold text-white/90">{scenarioInfo.title}</div>
              <div className="mt-1 text-base text-white/65">{scenarioInfo.subtitle}</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Rocket className="h-4 w-4 text-cyan-200" />
              {scenarioInfo.focus}
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          {optionCards.map((o) => (
            <button
              key={o.k}
              onClick={() => setChoice(o.k)}
              className={cn(
                'group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10 md:min-h-[138px]',
                choice === o.k ? 'neon-border' : ''
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-bold text-white/90">{o.title}</div>
                  <div className="mt-1 text-sm text-white/55">{o.sub}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white/70 whitespace-nowrap">
                    最大数量
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white/70 whitespace-nowrap">
                    {o.k === 'D' ? 'O(2ⁿ)' : 'O(n log n)'}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-base leading-relaxed text-white/70">{o.desc}</div>
              <div className="mt-3 flex items-center justify-between text-base text-white/55">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white/60" />
                  先选择，再提交
                </span>
                <span className="opacity-0 text-xl transition group-hover:opacity-100">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-5">
          <div className="flex-1 text-base text-white/65">
            <span className="text-lg font-semibold text-white/85">问题：</span>
            {scenarioInfo.questionText}
          </div>
          <button onClick={onAsk} className="btn btn-primary neon-border px-5 py-2.5 text-sm whitespace-nowrap">
            <Bot className="h-4 w-4 text-cyan-200" />
            提交并解析
          </button>
        </div>

        <div className="min-h-[420px] flex-1">
          <div
            ref={scrollRef}
            className="app-scrollbar h-full max-h-[680px] overflow-auto px-6 pb-6 pt-5 lg:max-h-[760px]"
          >
            <div className="space-y-4">
              {chat.map((m) => (
                <div
                  key={m.ts}
                  className={cn('flex items-start gap-4', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {m.role === 'ai' && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Bot className="h-6 w-6 text-cyan-200" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'w-fit max-w-[80ch] rounded-2xl border px-5 py-4 text-base leading-relaxed',
                      m.role === 'user'
                        ? 'border-white/10 bg-white/10 text-white/90'
                        : 'border-cyan-200/15 bg-gradient-to-b from-white/5 to-white/4 text-white/88'
                    )}
                  >
                    {m.role === 'ai' ? (
                      m.streaming ? (
                        <TypewriterText
                          text={m.text}
                          speedMs={9}
                          className="whitespace-pre-wrap text-base"
                          onDone={() => {
                            setChat((prev) =>
                              prev.map((x) =>
                                x.role === 'ai' && x.ts === m.ts ? { ...x, streaming: false } : x
                              )
                            )
                          }}
                        />
                      ) : (
                        <Markdown>{m.text}</Markdown>
                      )
                    ) : (
                      <span className="whitespace-pre-wrap text-base">{m.text}</span>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <GraduationCap className="h-6 w-6 text-indigo-200" />
                    </div>
                  )}
                </div>
              ))}

              {thinking && <Thinking />}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-4">
        <div className="glass neon-border p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-white/90">课前课后互动闭环</div>
              <div className="text-base text-white/60">纯前端模拟课前预习与课后巩固，无需后端支持</div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75">
              <BadgeCheck className="h-4 w-4 text-emerald-200" />
              Demo 可直接使用
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {interactionOverview.map((item) => {
              const percent = Math.round((item.count / item.total) * 100)
              return (
                <div key={item.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-white/85">{item.title}</div>
                      <div className="mt-1 text-sm text-white/55">{item.summary}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white/90">
                        {item.count}/{item.total}
                      </div>
                      <div className="text-xs text-white/55">{percent}%</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-300/70 via-blue-300/60 to-emerald-300/70"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid gap-4">
            {(['pre', 'post'] as const).map((stageKey) => {
              const stage = quickInteractions[stageKey]
              const Icon = stage.icon
              return (
                <div key={stageKey} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white/88">{stage.title}</div>
                      <div className="text-sm text-white/55">{stage.subtitle}</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {stage.actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleQuickInteraction(stageKey, action)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white/88">{action.label}</div>
                            <div className="mt-1 text-xs text-white/55">{action.helper}</div>
                          </div>
                          <span className="text-white/40">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Radar className="h-6 w-6 text-fuchsia-200" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">多维智能评价反馈</div>
                <div className="text-base text-white/60">概念/证明/反例/编码/表达</div>
              </div>
            </div>
            <div className="text-right text-base">
              <div className="text-lg font-semibold text-white/85">{attempts} 次答题</div>
              <div className="text-white/60">正确 {correct} 次</div>
            </div>
          </div>

          <div className="mt-5 grid gap-5">
            <div className="h-[260px] rounded-2xl border border-white/10 bg-black/20 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.10)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 14 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <RadarShape dataKey="v" stroke="rgba(74,222,255,0.85)" fill="rgba(120,110,255,0.25)" />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[200px] rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-3 flex items-center justify-between px-2">
                <div className="text-base font-semibold text-white/80">学情数据采集与分析</div>
                <div className="text-base text-white/60">正确率走势</div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="accFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(74,222,255,0.40)" />
                      <stop offset="100%" stopColor="rgba(74,222,255,0.02)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="k" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 13 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 13 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 14,
                    }}
                  />
                  <Area type="monotone" dataKey="acc" stroke="rgba(74,222,255,0.85)" fill="url(#accFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Library className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">数字资源整合与运用</div>
              <div className="text-base text-white/60">资源会随当前教学阶段切换</div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {resources.map((r) => (
              <div
                key={r.title}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base"
              >
                <div className="flex-1 pr-4 text-white/85">{r.title}</div>
                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/65 whitespace-nowrap">
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-white/90">创新点：前中后贯通式互动</div>
              <div className="text-base text-white/60">从预习提问到课后复盘都挂接在同一条学习路径上</div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-base font-semibold text-white/75">
              {hasSubmitted ? '已生成学习建议' : '互动后生成'}
            </span>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5 text-base leading-relaxed text-white/75">
            <div className="text-lg font-semibold text-white/85">个性化学习支持（自动生成）</div>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
              {!hasSubmitted ? (
                <>
                  <li>先点击右侧课前或课后互动按钮，或直接提交策略选择，我会自动生成下一步学习路径。</li>
                  <li>整个功能仅靠前端静态数据和本地状态模拟，不依赖后端接口。</li>
                </>
              ) : (
                <>
                  <li>如果你仍容易选 B/C，建议优先回到“课后错因复盘”按钮，再做一次迁移应用。</li>
                  <li>如果你已经稳定选择 A，建议继续完成交换论证书写和自定义反例构造。</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="text-lg font-semibold text-white/90">师生机协同教学</div>
          <div className="mt-3 text-base text-white/60">
            教师可在课堂投屏时统一讲解，学生侧则用课前/课后快捷互动完成预热与复盘，形成完整的教学闭环。
          </div>
        </div>
      </div>
    </div>
  )
}
