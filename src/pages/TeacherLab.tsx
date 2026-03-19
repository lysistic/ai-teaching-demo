import { useMemo, useRef, useState } from 'react'
import { Bot, Braces, Code2, Loader2, Play, Table2, Terminal, Timer, Wrench } from 'lucide-react'
import { cn } from '../lib/cn'
import { demoTasks, runStrategy, type StrategyKey } from '../lib/intervalScheduling'
import { Thinking } from '../components/Thinking'
import { TypewriterCode } from '../components/TypewriterCode'

const codeSnippets: Record<StrategyKey, string> = {
  A: `// A. 最早结束时间（最优贪心）\n// 按结束时间升序排序，优先选择最早结束的任务\nfunction earliestFinish(tasks){\n  tasks.sort((a,b)=>a.end-b.end||a.start-b.start)\n  const picked=[]\n  let lastEnd=-Infinity\n  for(const t of tasks){\n    if(t.start>=lastEnd){\n      picked.push(t)\n      lastEnd=t.end\n    }\n  }\n  return picked\n}\n`,
  B: `// B. 最早开始时间（非最优）\n// 按开始时间升序排序，但可能选择长任务挡住后续\nfunction earliestStart(tasks){\n  tasks.sort((a,b)=>a.start-b.start||a.end-b.end)\n  const picked=[]\n  let lastEnd=-Infinity\n  for(const t of tasks){\n    if(t.start>=lastEnd){\n      picked.push(t)\n      lastEnd=t.end\n    }\n  }\n  return picked\n}\n`,
  C: `// C. 最短任务间隔（启发式，非最优）\n// 按工期升序排序，但短任务可能互相冲突\nfunction shortestDuration(tasks){\n  tasks.sort((a,b)=>((a.end-a.start)-(b.end-b.start))||b.severity-a.severity||a.end-b.end)\n  const picked=[]\n  let lastEnd=-Infinity\n  for(const t of tasks){\n    if(t.start>=lastEnd){\n      picked.push(t)\n      lastEnd=t.end\n    }\n  }\n  return picked\n}\n`,
  D: `// D. 最少冲突区间（暴力最优基准）\n// 枚举所有子集验证最优，用于实验对照\nfunction bruteForce(tasks){\n  let best=[]\n  function ok(cur,t){\n    for(const c of cur){\n      if(!(c.end<=t.start||t.end<=c.start)) return false\n    }\n    return true\n  }\n  function dfs(i,cur){\n    if(i===tasks.length){\n      if(cur.length>best.length) best=[...cur]\n      return\n    }\n    if(cur.length+(tasks.length-i)<best.length) return\n    if(ok(cur,tasks[i])){ cur.push(tasks[i]); dfs(i+1,cur); cur.pop() }\n    dfs(i+1,cur)\n  }\n  dfs(0,[])\n  best.sort((a,b)=>a.start-b.start||a.end-b.end)\n  return best\n}\n`,
}

type RunState = 'idle' | 'generating' | 'running' | 'done'

export function TeacherLab() {
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
    '实验环境：GreedyLab v0.1 (demo)',
    '数据集：漏洞修复任务（区间）',
    '提示：点击"生成并运行"观察四策略输出差异。',
  ])

  const results = useMemo(() => {
    const keys: StrategyKey[] = ['A', 'B', 'C', 'D']
    return keys.map((k) => {
      const r = runStrategy(k, demoTasks)
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="glass neon-border lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Wrench className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">教师实验验证 · AI 代码生成与运行对照</div>
              <div className="text-base text-white/60">
                同一数据下 A/B/C（贪心）与 D（暴力最优）对比，支持投屏演示
              </div>
            </div>
          </div>

          <button onClick={runAll} className="btn btn-primary neon-border px-6 py-3 text-base">
            <Play className="h-5 w-5 text-cyan-200" />
            生成并运行
          </button>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
          {(['A', 'B', 'C', 'D'] as StrategyKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={cn(
                'rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10',
                active === k ? 'neon-border' : ''
              )}
            >
              <div className="text-xl font-bold text-white/90">
                {k === 'A' ? 'A. 最早结束时间' : k === 'B' ? 'B. 最早开始时间' : k === 'C' ? 'C. 最短任务间隔' : 'D. 最少冲突区间'}
              </div>
              <div className="mt-2 text-base text-white/60">
                {k === 'A' ? '按结束时间升序排序，优先选择最早结束且可兼容的任务（最优贪心）' : 
                 k === 'B' ? '按开始时间升序排序，但可能选择长任务挡住后续多个短任务' : 
                 k === 'C' ? '按工期升序排序，优先短任务，但短任务可能互相冲突' : 
                 '枚举所有子集验证最优解，用于实验对照（复杂度高）'}
              </div>
              <div className="mt-4 flex items-center justify-between text-base text-white/55">
                <span className="inline-flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  查看 AI 生成代码
                </span>
                <span className="inline-flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  {k === 'D' ? 'O(2ⁿ)' : 'O(n log n)'}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Bot className="h-6 w-6 text-fuchsia-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">AI 生成代码（四种策略对照）</div>
              <div className="text-base text-white/60">同时生成 A/B/C/D 四段代码，对比验证最优性</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {state === 'generating' && <Thinking label="AI 正在并行生成 A/B/C/D 的代码…" />}

            {showCodes && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-base font-semibold text-white/80">生成进度</div>
                  <div className="text-base text-white/60">
                    {(['A', 'B', 'C', 'D'] as StrategyKey[]).filter((k) => genDone[k]).length}/4
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {(['A', 'B', 'C', 'D'] as StrategyKey[]).map((k) => (
                    <div
                      key={k}
                      className={cn(
                        'h-3 rounded-full border border-white/10',
                        genDone[k] ? 'bg-cyan-200/35' : 'bg-white/5'
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
                    'rounded-2xl border border-white/10 bg-black/25 p-5',
                    active === k ? 'neon-border' : ''
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-base font-semibold text-white/80">
                      {k === 'A' ? 'A. 最早结束时间' : k === 'B' ? 'B. 最早开始时间' : k === 'C' ? 'C. 最短任务间隔' : 'D. 最少冲突区间'}
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-2 text-base font-semibold text-white/70">
                      <Braces className="h-4 w-4" />
                      code
                    </span>
                  </div>
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
                              append(`[RUN] 加载数据集：${demoTasks.length} 个区间任务`)
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
                    <div className="text-base text-white/55">点击上方"生成并运行"后显示</div>
                  )}
                </div>
              ))}
            </div>

            {state === 'running' && runStarted && (
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
                  <div>
                    <div className="text-base font-semibold text-white/85">开始运行</div>
                    <div className="text-base text-white/60">正在执行 A/B/C/D，并汇总对比结果…</div>
                  </div>
                </div>
                <div className="text-base text-white/60">数据规模：n={demoTasks.length}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-5">
        <div className="glass neon-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Terminal className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">运行日志（对照实验）</div>
              <div className="text-base text-white/60">用于课堂投屏：强调"验证最优"</div>
            </div>
          </div>
          <div className="mt-5 max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-black/25 p-5 font-mono text-base leading-relaxed text-white/80">
            {terminal.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className={cn('glass neon-border p-6', state !== 'done' ? 'opacity-60' : '')}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Table2 className="h-6 w-6 text-indigo-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">策略结果对比（多维评价）</div>
              <div className="text-base text-white/60">
                {state === 'done' ? '数量最优 + 风险收益（严重度）' : '等待实验完成后展示对比'}
              </div>
            </div>
          </div>

          {state === 'done' ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-base">
                <thead className="bg-white/5 text-base text-white/70">
                  <tr>
                    <th className="px-5 py-4">策略</th>
                    <th className="px-5 py-4">选中任务数</th>
                    <th className="px-5 py-4">严重度总和</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.k} className="border-t border-white/10">
                      <td className="px-5 py-4 text-lg font-semibold text-white/85">
                        {r.k === 'A' ? 'A. 最早结束时间' : r.k === 'B' ? 'B. 最早开始时间' : r.k === 'C' ? 'C. 最短任务间隔' : 'D. 最少冲突区间'}
                      </td>
                      <td className="px-5 py-4 text-white/75">{r.score.count}</td>
                      <td className="px-5 py-4 text-white/75">{r.score.severitySum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5 text-base text-white/60">
              进行中：先完成"代码生成 → 运行 → 输出"，再展示对比表。
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 text-base leading-relaxed text-white/65">
            <div className="text-lg font-semibold text-white/85">教学建议</div>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-base">
              <li><strong className="text-white/80">课堂讲解：</strong>先运行 D（暴力最优）作为基准，再证明 A（最早结束）与 D 结果一致</li>
              <li><strong className="text-white/80">实验验证：</strong>让学生尝试 B（最早开始）和 C（最短间隔），观察输出差异并构造反例</li>
              <li><strong className="text-white/80">拓展思考：</strong>讨论不同策略的适用场景，如"最优数量"vs"严重度收益"的权衡</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
