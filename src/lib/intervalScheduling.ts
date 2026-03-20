export type VulnTask = {
  id: string
  title: string
  system: 'WAF' | 'IDS' | 'SIEM' | 'EDR' | 'API-Gateway'
  severity: 1 | 2 | 3 | 4 | 5
  start: number
  end: number
  note?: string
}

export type ScheduleResult = {
  picked: VulnTask[]
  score: {
    count: number
    severitySum: number
    avgSeverity: number
  }
}

export type StrategyKey = 'A' | 'B' | 'C' | 'D'

function compatible(a: VulnTask, b: VulnTask) {
  return a.end <= b.start || b.end <= a.start
}

export function isNonOverlapping(picked: VulnTask[]) {
  const sorted = [...picked].sort((x, y) => x.start - y.start || x.end - y.end)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1]!.end > sorted[i]!.start) return false
  }
  return true
}

export function scoreOf(picked: VulnTask[]): ScheduleResult['score'] {
  const count = picked.length
  const severitySum = picked.reduce((acc, t) => acc + t.severity, 0)
  const avgSeverity = count === 0 ? 0 : Math.round((severitySum / count) * 10) / 10
  return { count, severitySum, avgSeverity }
}

function greedyPick(tasks: VulnTask[], compare: (a: VulnTask, b: VulnTask) => number): VulnTask[] {
  const sorted = [...tasks].sort(compare)
  const picked: VulnTask[] = []
  let lastEnd = -Infinity
  for (const t of sorted) {
    if (t.start >= lastEnd) {
      picked.push(t)
      lastEnd = t.end
    }
  }
  return picked
}

export function strategyA_EarliestFinish(tasks: VulnTask[]): ScheduleResult {
  // 最优贪心：按结束时间最早排序
  const picked = greedyPick(tasks, (a, b) => a.end - b.end || a.start - b.start)
  return { picked, score: scoreOf(picked) }
}

export function strategyB_EarliestStart(tasks: VulnTask[]): ScheduleResult {
  // 反例常见：按开始时间最早并不保证最优
  const picked = greedyPick(tasks, (a, b) => a.start - b.start || a.end - b.end)
  return { picked, score: scoreOf(picked) }
}

export function strategyC_ShortestDurationHighSeverity(tasks: VulnTask[]): ScheduleResult {
  // "看起来合理"的启发式：优先短工期；工期相同优先高严重度
  const picked = greedyPick(
    tasks,
    (a, b) => (a.end - a.start) - (b.end - b.start) || b.severity - a.severity || a.end - b.end
  )
  return { picked, score: scoreOf(picked) }
}

export function strategyD_BruteForceOptimal(tasks: VulnTask[]): ScheduleResult {
  // 暴力枚举：用于教学验证（n 小）
  const n = tasks.length
  let best: VulnTask[] = []

  function backtrack(i: number, current: VulnTask[]) {
    if (i === n) {
      if (current.length > best.length) best = [...current]
      return
    }
    // 上界剪枝：剩余全部选也不可能超过 best
    if (current.length + (n - i) < best.length) return

    // 选择 i
    const t = tasks[i]!
    let ok = true
    for (const c of current) {
      if (!compatible(t, c)) {
        ok = false
        break
      }
    }
    if (ok) {
      current.push(t)
      backtrack(i + 1, current)
      current.pop()
    }
    // 不选 i
    backtrack(i + 1, current)
  }

  backtrack(0, [])

  // 为了展示更直观：把结果按时间排序
  best.sort((a, b) => a.start - b.start || a.end - b.end)
  return { picked: best, score: scoreOf(best) }
}

export function runStrategy(key: StrategyKey, tasks: VulnTask[]): ScheduleResult {
  if (key === 'A') return strategyA_EarliestFinish(tasks)
  if (key === 'B') return strategyB_EarliestStart(tasks)
  if (key === 'C') return strategyC_ShortestDurationHighSeverity(tasks)
  return strategyD_BruteForceOptimal(tasks)
}

export const coreTasks: VulnTask[] = [
  { id: 'T1', title: '修复 SQL 注入规则', system: 'WAF', severity: 4, start: 1, end: 4, note: '规则变更需灰度' },
  { id: 'T2', title: '升级 IDS 规则集', system: 'IDS', severity: 3, start: 3, end: 5 },
  { id: 'T3', title: '补丁：API 鉴权绕过', system: 'API-Gateway', severity: 5, start: 0, end: 6, note: '覆盖面大但耗时' },
  { id: 'T4', title: '修复 EDR 驱动签名', system: 'EDR', severity: 5, start: 5, end: 7 },
  { id: 'T5', title: 'SIEM 解析器热更新', system: 'SIEM', severity: 2, start: 5, end: 9 },
  { id: 'T6', title: 'WAF 误报回滚窗口', system: 'WAF', severity: 2, start: 8, end: 11 },
  { id: 'T7', title: 'IDS 旁路修复', system: 'IDS', severity: 4, start: 8, end: 12 },
  { id: 'T8', title: 'EDR 策略小修', system: 'EDR', severity: 3, start: 2, end: 3 },
  { id: 'T9', title: 'API 限流参数调整', system: 'API-Gateway', severity: 2, start: 11, end: 13 },
  { id: 'T10', title: 'SIEM 告警降噪', system: 'SIEM', severity: 1, start: 13, end: 14 },
]

// 作为"引导反例"：让 B（最早开始）明显失败，A/D 给出更优解
export const counterExampleForB: VulnTask[] = [
  { id: 'C1', title: '长窗口-核心修复', system: 'API-Gateway', severity: 5, start: 0, end: 10 },
  { id: 'C2', title: '短修复 1', system: 'WAF', severity: 2, start: 1, end: 2 },
  { id: 'C3', title: '短修复 2', system: 'IDS', severity: 3, start: 2, end: 3 },
  { id: 'C4', title: '短修复 3', system: 'EDR', severity: 2, start: 3, end: 4 },
  { id: 'C5', title: '短修复 4', system: 'SIEM', severity: 1, start: 4, end: 5 },
]

// 作为"引导反例"：让 C（短工期优先）也失败（会先选一些短的，错过更好的组合）
export const counterExampleForC: VulnTask[] = [
  { id: 'S1', title: '关键修复 A', system: 'API-Gateway', severity: 5, start: 0, end: 2 },
  { id: 'S2', title: '关键修复 B', system: 'EDR', severity: 4, start: 2, end: 4 },
  { id: 'S3', title: '关键修复 C', system: 'WAF', severity: 4, start: 4, end: 6 },
  { id: 'S4', title: '短但冲突-分散修补', system: 'IDS', severity: 2, start: 1, end: 3 },
  { id: 'S5', title: '短但冲突-分散修补', system: 'SIEM', severity: 2, start: 3, end: 5 },
]

export const strategyMeta: Record<StrategyKey, { name: string; tagline: string; isGreedy: boolean }> = {
  A: { name: 'A. 最早结束时间', tagline: '按结束时间升序，优先最早结束（最优贪心）', isGreedy: true },
  B: { name: 'B. 最早开始时间', tagline: '按开始时间升序，但可能被长任务卡住', isGreedy: true },
  C: { name: 'C. 最短任务间隔', tagline: '按工期升序，短任务优先（启发式）', isGreedy: true },
  D: { name: 'D. 最少冲突区间', tagline: '暴力枚举验证最优（用于对照）', isGreedy: false },
}

