import { useMemo, useRef, useState } from 'react'
import { Bot, Braces, Code2, Loader2, Play, Table2, Terminal as TerminalIcon, Timer, Wrench, Search, Plus, Beaker, CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/cn'
import { coreTasks, runStrategy, type StrategyKey } from '../lib/intervalScheduling'
import { Thinking } from '../components/Thinking'
import { TypewriterCode } from '../components/TypewriterCode'

// 实验列表模拟数据
const EXPERIMENTS = [
  {
    id: 'exp-algo-01',
    title: '贪心算法：区间调度（漏洞修复任务）',
    course: '算法设计与分析',
    status: 'active',
    desc: '同一数据下 A/B/C（贪心）与 D（暴力最优）对比，支持验证最优贪心策略。',
    lastRun: '10分钟前',
  },
  {
    id: 'exp-algo-02',
    title: '动态规划：最长公共子序列验证',
    course: '算法设计与分析',
    status: 'ready',
    desc: '对比递归剪枝与自底向上状态转移的性能差异（时间/空间复杂度对照）。',
    lastRun: '昨天',
  },
  {
    id: 'exp-ds-01',
    title: '图算法：Dijkstra 选路策略模拟',
    course: '数据结构',
    status: 'ready',
    desc: '在网络拓扑中模拟链路延迟，对比单源最短路径计算结果。',
    lastRun: '3天前',
  },
]

const codeSnippets: Record<StrategyKey, string> = {
  A: `// A. 最早结束时间（最优贪心）\n// 按结束时间升序排序，优先选择最早结束的任务\nfunction earliestFinish(tasks){\n  tasks.sort((a,b)=>a.end-b.end||a.start-b.start)\n  const picked=[]\n  let lastEnd=-Infinity\n  for(const t of tasks){\n    if(t.start>=lastEnd){\n      picked.push(t)\n      lastEnd=t.end\n    }\n  }\n  return picked\n}\n`,
  B: `// B. 最早开始时间（非最优）\n// 按开始时间升序排序，但可能选择长任务挡住后续\nfunction earliestStart(tasks){\n  tasks.sort((a,b)=>a.start-b.start||a.end-b.end)\n  const picked=[]\n  let lastEnd=-Infinity\n  for(const t of tasks){\n    if(t.start>=lastEnd){\n      picked.push(t)\n      lastEnd=t.end\n    }\n  }\n  return picked\n}\n`,
  C: `// C. 最短任务间隔（启发式，非最优）\n// 按工期升序排序，但短任务可能互相冲突\nfunction shortestDuration(tasks){\n  tasks.sort((a,b)=>((a.end-a.start)-(b.end-b.start))||b.severity-a.severity||a.end-b.end)\n  const picked=[]\n  let lastEnd=-Infinity\n  for(const t of tasks){\n    if(t.start>=lastEnd){\n      picked.push(t)\n      lastEnd=t.end\n    }\n  }\n  return picked\n}\n`,
  D: `// D. 最少冲突区间（暴力最优基准）\n// 枚举所有子集验证最优，用于实验对照\nfunction bruteForce(tasks){\n  let best=[]\n  function ok(cur,t){\n    for(const c of cur){\n      if(!(c.end<=t.start||t.end<=c.start)) return false\n    }\n    return true\n  }\n  function dfs(i,cur){\n    if(i===tasks.length){\n      if(cur.length>best.length) best=[...cur]\n      return\n    }\n    if(cur.length+(tasks.length-i)<best.length) return\n    if(ok(cur,tasks[i])){ cur.push(tasks[i]); dfs(i+1,cur); cur.pop() }\n    dfs(i+1,cur)\n  }\n  dfs(0,[])\n  best.sort((a,b)=>a.start-b.start||a.end-b.end)\n  return best\n}\n`,
}

type RunState = 'idle' | 'generating' | 'running' | 'done'

export function TeacherLab() {
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-algo-01')
  const [active, setActive] = useState<StrategyKey>('A')
  const [state, setState] = useState<RunState>('idle')
  const [showCodes, setShowCodes] = useState(false)
  const [genDone, setGenDone] = useState<Record<StrategyKey, boolean>>({
    A: false,
    B: false,
    C: false,
    D: false,
  })
  const [runStarted, setRunStarted] = useState(false)
  const runTokenRef = useRef(0)
  const [terminal, setTerminal] = useState<string[]>([
    '实验环境：GreedyLab Environment',
    '数据集：漏洞修复任务（区间）',
    '提示：点击"生成并运行"观察四策略输出差异。',
  ])

  const results = useMemo(() => {
    const keys: StrategyKey[] = ['A', 'B', 'C', 'D']
    return keys.map((k) => {
      const r = runStrategy(k, coreTasks)
      return { k, ...r, ids: r.picked.map((t) => t.id).join(' → ') }
    })
  }, [])

  function append(line: string) {
    setTerminal((t) => [...t, line].slice(-120))
  }

  function allGenerated(next: Record<StrategyKey, boolean>) {
    return (['A', 'B', 'C', 'D'] as StrategyKey[]).every((k) => next[k])
  }

  function runAll() {
    if (selectedExpId !== 'exp-algo-01') {
      alert('当前评测沙箱仅挂载了【区间调度】实验环境。')
      return
    }
    const token = runTokenRef.current + 1
    runTokenRef.current = token
    setRunStarted(false)
    setShowCodes(true)
    setState('generating')
    setGenDone({ A: false, B: false, C: false, D: false })
    setState('generating')
    append('')
    append(`[AI] 任务：为 A/B/C/D 同时生成代码 → 运行 → 对比验证`)

    window.setTimeout(() => {
      if (runTokenRef.current !== token) return
    }, 10000)
  }

  const renderMockLab = (title: string, desc: string, methods: string[], snippets: string[]) => {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="glass neon-border xl:col-span-7 bg-white dark:bg-slate-900 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-cyan-800/30">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                <Beaker className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</div>
                <div className="text-base text-slate-500 dark:text-slate-400">{desc}</div>
              </div>
            </div>

            <button className="btn bg-indigo-600/50 text-white px-6 py-3 text-base rounded-xl cursor-not-allowed">
              <Play className="h-5 w-5 mr-2 inline-block" />
              云端资源调度中...
            </button>
          </div>

          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            {methods.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5 text-left transition-all border-slate-200 bg-white/5 dark:bg-slate-800/40 dark:border-slate-700 dark:bg-slate-800/40"
              >
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{m}</div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Code2 className="h-3.5 w-3.5" />
                    {snippets[i]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-6 py-5 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10">
                <Bot className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI 分析面板</div>
                <div className="text-base text-slate-500 dark:text-slate-400">算法时间约束多维分析引擎</div>
              </div>
            </div>
            
            <div className="mt-5 p-4 rounded-xl border border-dashed border-slate-300 bg-white/5 dark:bg-slate-800/40 dark:border-slate-700 dark:bg-slate-800/30 text-center text-slate-500 dark:text-slate-400">
               云端评测节点分配中，请先浏览实验环境说明配置...
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <div className="glass neon-border p-6 font-mono bg-white dark:bg-slate-900 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-cyan-800/30">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:bg-slate-800">
                <TerminalIcon className="h-6 w-6 text-slate-700 dark:text-cyan-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">运行日志</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Console Output</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 dark:bg-slate-800/40 p-5 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 text-center">
               日志追踪系统已挂起
            </div>
          </div>

          <div className="glass neon-border p-6 bg-white dark:bg-slate-900 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-cyan-800/30">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-200 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-500/10">
                <Table2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">模拟结果报告</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">等待云端数据回传</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/5 dark:bg-slate-800/40 p-5 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/30 text-center">
               暂无对比结果
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLabContent = () => {
    if (selectedExpId === 'exp-algo-02') {
      return renderMockLab(
        '动态规划：最长公共子序列验证',
        '对比递归剪枝与自底向上状态转移的性能差异',
        ['A. 朴素递归 (指数级)', 'B. 记忆化搜索 (O(n×m))', 'C. 动态规划 (O(n×m))', 'D. 空间优化 DP (O(m))'],
        ['dfs(i, j)', 'memo[i][j]', 'dp[i][j]', 'dp[2][j]']
      )
    }

    if (selectedExpId === 'exp-ds-01') {
      return renderMockLab(
        '图算法：Dijkstra 选路策略模拟',
        '在网络拓扑中模拟链路延迟，对比单源最短路径计算结果',
        ['A. 邻接矩阵 (O(V²))', 'B. 邻接表+堆 (O((V+E)logV))', 'C. 斐波那契堆 (O(E+VlogV))', 'D. SPFA (O(VE))'],
        ['graph[u][v]', 'PriorityQueue', 'FibHeap', 'queue.push']
      )
    }

    if (selectedExpId !== 'exp-algo-01') {
      return (
        <div className="flex h-[600px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 text-slate-500 dark:text-slate-400">
          <Beaker className="mb-4 h-12 w-12 text-slate-400 opacity-50" />
          <p className="text-lg font-medium">该实验环境尚未在当前课程模块中开放</p>
          <p className="mt-2 text-sm">请选择【贪心算法：区间调度】进行体验</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="glass neon-border xl:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-indigo-500/10 dark:bg-white/5">
                <Wrench className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white/90">实验验证环境</div>
                <div className="text-base text-slate-500 dark:text-white/60">
                  同一数据下 A/B/C（贪心）与最优集对比，支持大屏教学展示
                </div>
              </div>
            </div>

            <button onClick={runAll} className="btn bg-indigo-600 text-white hover:bg-indigo-700 dark:btn-primary dark:neon-border px-6 py-3 text-base">
              <Play className="h-5 w-5" />
              生成并运行
            </button>
          </div>

          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            {(['A', 'B', 'C', 'D'] as StrategyKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setActive(k)}
                className={cn(
                  'rounded-2xl border p-5 text-left transition-all',
                  active === k 
                    ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400/50 dark:bg-indigo-500/10 shadow-sm' 
                    : 'border-slate-200 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                )}
              >
                <div className="text-xl font-bold text-slate-900 dark:text-white/90">
                  {k === 'A' ? 'A. 最早结束时间' : k === 'B' ? 'B. 最早开始时间' : k === 'C' ? 'C. 最短任务间隔' : 'D. 最少冲突区间'}
                </div>
                <div className="mt-2 text-sm text-slate-500 dark:text-white/60">
                  {k === 'A' ? '按结束时间升序排序，优先选择最早结束且可兼容的任务（最优贪心）' : 
                   k === 'B' ? '按开始时间升序排序，但可能选择长任务挡住后续多个短任务' : 
                   k === 'C' ? '按工期升序排序，优先短任务，但短任务可能互相冲突' : 
                   '枚举所有子集验证最优解，用于实验对照（复杂度高）'}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-white/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5" />
                    查看 AI 生成代码
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5" />
                    {k === 'D' ? 'O(2ⁿ)' : 'O(n log n)'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 px-6 py-5 dark:border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-200 bg-fuchsia-50 dark:border-white/10 dark:bg-white/5">
                <Bot className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-300" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white/90">AI 生成代码（四种策略对照）</div>
                <div className="text-base text-slate-500 dark:text-white/60">同时生成 A/B/C/D 四段代码，对比验证最优性</div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {state === 'generating' && <div className="dark:text-white"><Thinking label="AI 正在并行生成 A/B/C/D 的代码…" /></div>}

              {showCodes && (
                <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-base font-semibold text-slate-700 dark:text-white/80">生成进度</div>
                    <div className="text-base text-slate-500 dark:text-white/60">
                      {(['A', 'B', 'C', 'D'] as StrategyKey[]).filter((k) => genDone[k]).length}/4
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {(['A', 'B', 'C', 'D'] as StrategyKey[]).map((k) => (
                      <div
                        key={k}
                        className={cn(
                          'h-3 rounded-full border transition-colors',
                          genDone[k] 
                            ? 'border-indigo-400 bg-indigo-500/20 dark:border-indigo-400/50 dark:bg-cyan-200/35' 
                            : 'border-slate-200 bg-white/5 dark:bg-slate-800/40 dark:border-white/10 dark:bg-white/5'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {(['A', 'B', 'C', 'D'] as StrategyKey[]).map((k) => (
                  <div
                    key={k}
                    className={cn(
                      'rounded-2xl border p-5',
                      active === k 
                        ? 'border-indigo-500 ring-1 ring-indigo-500/20 dark:neon-border dark:bg-black/25' 
                        : 'border-slate-200 bg-white/5 dark:bg-slate-800/40 dark:border-white/10 dark:bg-black/25'
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-base font-semibold text-slate-800 dark:text-white/80">
                        {k === 'A' ? 'A. 最早结束时间' : k === 'B' ? 'B. 最早开始时间' : k === 'C' ? 'C. 最短间隔' : 'D. 最少冲突'}
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/12 dark:bg-white/5 dark:text-white/70">
                        <Braces className="h-3.5 w-3.5" />
                        code
                      </span>
                    </div>
                    <div className="dark:text-slate-300">
                    {showCodes ? (
                      <TypewriterCode
                        code={codeSnippets[k]}
                        speedMs={4}
                        startDelayMs={120}
                        enabled={state === 'generating' && !genDone[k]}
                        onDone={() => {
                          setGenDone((prev: Record<StrategyKey, boolean>) => {
                            if (prev[k]) return prev
                            const next = { ...prev, [k]: true }
                            if (allGenerated(next)) {
                              append(`[AI] 代码生成完成（4/4）。准备开始运行…`)
                              setState('running')
                              setRunStarted(true)
                              window.setTimeout(() => {
                                append(`[RUN] 加载数据集：${coreTasks.length} 个区间任务`)
                                append(`[RUN] 运行策略 A/B/C/D …`)
                              }, 260)
                              window.setTimeout(() => {
                                for (const r of results) {
                                  append(
                                    `[OUT] ${r.k} | 选中 ${r.score.count} 个 | 严重度总和 ${r.score.severitySum} | ${r.ids}`
                                  )
                                }
                                const a = results.find((x) => x.k === 'A')!
                                const d = results.find((x) => x.k === 'D')!
                                append(
                                  `[CHECK] A vs D：${a.score.count === d.score.count ? '一致（A 为最优贪心）' : '不一致（需检查）'}`
                                )
                                append('[DONE] 实验完成：先"暴力验证"再"贪心证明"，适合课堂投屏。')
                                setState('done')
                              }, 1200)
                            }
                            return next
                          })
                        }}
                      />
                    ) : (
                      <div className="text-base text-slate-400 dark:text-white/55">点击上方"生成并运行"后显示</div>
                    )}
                    </div>
                  </div>
                ))}
              </div>

              {state === 'running' && runStarted && (
                <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 dark:border-indigo-500/30 dark:bg-indigo-900/20">
                  <div className="flex items-center gap-4">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-cyan-400" />
                    <div>
                      <div className="text-base font-semibold text-indigo-900 dark:text-white/85">开始运行</div>
                      <div className="text-base text-indigo-700 dark:text-white/60">正在执行 A/B/C/D，并汇总对比结果…</div>
                    </div>
                  </div>
                  <div className="text-base text-indigo-700 dark:text-white/60">数据规模：n={coreTasks.length}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <div className="glass neon-border p-6 font-mono">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-white/10 dark:bg-white/5">
                <TerminalIcon className="h-6 w-6 text-slate-700 dark:text-cyan-200" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white/90">运行日志</div>
                <div className="text-sm text-slate-500 dark:text-white/60">Console Output</div>
              </div>
            </div>
            <div className="mt-5 max-h-[380px] overflow-auto rounded-xl bg-slate-950 p-5 text-sm leading-relaxed text-emerald-400 shadow-inner">
              {terminal.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap font-mono">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className={cn('glass neon-border p-6 transition-all duration-500', state !== 'done' ? 'opacity-60 grayscale-[50%]' : '')}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-purple-50 dark:border-white/10 dark:bg-white/5">
                <Table2 className="h-6 w-6 text-purple-600 dark:text-indigo-300" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white/90">策略结果对比（多维评价）</div>
                <div className="text-sm text-slate-500 dark:text-white/60">
                  {state === 'done' ? '数量最优 + 风险收益实验总结' : '等待实验完成后展示对比'}
                </div>
              </div>
            </div>

            {state === 'done' ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 dark:bg-slate-800/40 text-slate-600 dark:bg-white/5 dark:text-white/70">
                    <tr>
                      <th className="px-5 py-3 font-medium">策略</th>
                      <th className="px-5 py-3 font-medium">选中任务数</th>
                      <th className="px-5 py-3 font-medium">严重度总和</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                    {results.map((r) => (
                      <tr key={r.k} className="bg-white dark:bg-slate-900 hover:bg-white/5 dark:bg-slate-800/40 dark:bg-transparent dark:hover:bg-white/5">
                        <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white/85">
                          {r.k === 'A' ? 'A. 最早结束时间' : r.k === 'B' ? 'B. 最早开始时间' : r.k === 'C' ? 'C. 最短任务间隔' : 'D. 最少冲突区间'}
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-600 dark:text-white/75">{r.score.count}</td>
                        <td className="px-5 py-3 font-mono text-slate-600 dark:text-white/75">{r.score.severitySum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white/5 dark:bg-slate-800/40 p-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-black/25 dark:text-white/60">
                进行中：先完成"代码生成 → 运行 → 输出"
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 min-h-0">
      {/* 左侧：实验列表导航 */}
      <div className="glass w-full shrink-0 flex-col overflow-hidden lg:flex lg:w-80 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">教学实验大厅</h2>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索实验..."
              className="w-full rounded-lg border border-slate-200 bg-white/5 dark:bg-slate-800/40 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/50 pointer-events-none"
              readOnly
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 app-scrollbar">
          {EXPERIMENTS.map((exp) => {
            const isActive = selectedExpId === exp.id
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedExpId(exp.id)}
                className={cn(
                  "w-full text-left rounded-xl p-3 transition-all duration-200 ring-1",
                  isActive 
                    ? "bg-indigo-50 ring-indigo-500 shadow-sm dark:bg-indigo-500/10 dark:ring-indigo-500/50" 
                    : "bg-white dark:bg-slate-900 ring-slate-200 hover:bg-white/5 dark:bg-slate-800/40 hover:ring-slate-300 dark:bg-slate-800/40 dark:ring-slate-700 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-md",
                    exp.status === 'active' 
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    {exp.course}
                  </span>
                  {exp.status === 'active' && <CheckCircle2 className="h-4 w-4 text-indigo-500" />}
                </div>
                <h3 className={cn(
                  "font-bold mt-2 text-sm",
                  isActive ? "text-indigo-900 dark:text-indigo-100" : "text-slate-800 dark:text-slate-200"
                )}>
                  {exp.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {exp.desc}
                </p>
                <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                  最近运行：{exp.lastRun}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 右侧：实验详情/执行区 */}
      <div className="flex-1 overflow-x-hidden">
        {renderLabContent()}
      </div>
    </div>
  )
}
