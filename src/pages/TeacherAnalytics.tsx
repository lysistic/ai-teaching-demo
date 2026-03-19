import { useMemo, useState, type ElementType } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { cn } from '../lib/cn'
import {
  BookOpen,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react'

const PRE_CLASS_WEIGHT = 0.2
const IN_CLASS_WEIGHT = 0.3
const POST_CLASS_WEIGHT = 0.5
const COLORS = ['#4ade80', '#f87171', '#fbbf24', '#a78bfa']

const mockStudentData = [
  { id: 1, name: '陈浩然', className: '1班', choice: 'A', correct: true, timeSpent: 45, attempts: 1, preScore: 74, preCompleted: true, postScore: 93, postCompleted: true, postInteractions: 3, reflectionQuality: 90 },
  { id: 2, name: '林雨桐', className: '1班', choice: 'B', correct: false, timeSpent: 120, attempts: 3, preScore: 58, preCompleted: true, postScore: 76, postCompleted: true, postInteractions: 3, reflectionQuality: 82 },
  { id: 3, name: '王梓萱', className: '1班', choice: 'A', correct: true, timeSpent: 62, attempts: 1, preScore: 70, preCompleted: true, postScore: 90, postCompleted: true, postInteractions: 2, reflectionQuality: 88 },
  { id: 4, name: '张子墨', className: '2班', choice: 'C', correct: false, timeSpent: 95, attempts: 2, preScore: 62, preCompleted: true, postScore: 74, postCompleted: true, postInteractions: 2, reflectionQuality: 70 },
  { id: 5, name: '刘欣怡', className: '2班', choice: 'A', correct: true, timeSpent: 38, attempts: 1, preScore: 79, preCompleted: true, postScore: 95, postCompleted: true, postInteractions: 3, reflectionQuality: 94 },
  { id: 6, name: '李子轩', className: '2班', choice: 'D', correct: false, timeSpent: 180, attempts: 4, preScore: 55, preCompleted: false, postScore: 68, postCompleted: true, postInteractions: 2, reflectionQuality: 72 },
  { id: 7, name: '黄诗涵', className: '1班', choice: 'A', correct: true, timeSpent: 55, attempts: 1, preScore: 76, preCompleted: true, postScore: 91, postCompleted: true, postInteractions: 3, reflectionQuality: 89 },
  { id: 8, name: '吴俊熙', className: '1班', choice: 'B', correct: false, timeSpent: 78, attempts: 2, preScore: 60, preCompleted: true, postScore: 73, postCompleted: false, postInteractions: 1, reflectionQuality: 68 },
  { id: 9, name: '周可馨', className: '2班', choice: 'A', correct: true, timeSpent: 42, attempts: 1, preScore: 82, preCompleted: true, postScore: 96, postCompleted: true, postInteractions: 3, reflectionQuality: 95 },
  { id: 10, name: '徐志远', className: '2班', choice: 'A', correct: true, timeSpent: 67, attempts: 2, preScore: 72, preCompleted: true, postScore: 88, postCompleted: true, postInteractions: 2, reflectionQuality: 86 },
  { id: 11, name: '孙梦琪', className: '1班', choice: 'C', correct: false, timeSpent: 110, attempts: 3, preScore: 57, preCompleted: false, postScore: 71, postCompleted: true, postInteractions: 2, reflectionQuality: 69 },
  { id: 12, name: '马博文', className: '1班', choice: 'A', correct: true, timeSpent: 51, attempts: 1, preScore: 75, preCompleted: true, postScore: 90, postCompleted: true, postInteractions: 3, reflectionQuality: 87 },
  { id: 13, name: '朱雅婷', className: '1班', choice: 'A', correct: true, timeSpent: 49, attempts: 1, preScore: 77, preCompleted: true, postScore: 92, postCompleted: true, postInteractions: 3, reflectionQuality: 90 },
  { id: 14, name: '胡宇轩', className: '2班', choice: 'B', correct: false, timeSpent: 88, attempts: 2, preScore: 63, preCompleted: true, postScore: 78, postCompleted: true, postInteractions: 2, reflectionQuality: 75 },
  { id: 15, name: '郭思颖', className: '2班', choice: 'A', correct: true, timeSpent: 56, attempts: 1, preScore: 74, preCompleted: true, postScore: 89, postCompleted: true, postInteractions: 3, reflectionQuality: 88 },
]

export function TeacherAnalytics() {
  const [selectedClass, setSelectedClass] = useState<'all' | '1班' | '2班'>('all')

  const filteredStudents = useMemo(() => {
    return selectedClass === 'all'
      ? mockStudentData
      : mockStudentData.filter((student) => student.className === selectedClass)
  }, [selectedClass])

  const enrichedStudents = useMemo(() => {
    return filteredStudents.map((student) => {
      const inClassScore = student.correct
        ? Math.min(100, 92 - Math.max(0, student.attempts - 1) * 4)
        : Math.max(45, 78 - student.attempts * 8)
      const postInteractionScore = Math.round((student.postInteractions / 3) * 100)
      const postWeightedScore = Math.round(student.postScore * 0.75 + postInteractionScore * 0.25)
      const compositeScore = Math.round(
        student.preScore * PRE_CLASS_WEIGHT +
          inClassScore * IN_CLASS_WEIGHT +
          postWeightedScore * POST_CLASS_WEIGHT
      )
      const growth = postWeightedScore - student.preScore

      return {
        ...student,
        inClassScore,
        postInteractionScore,
        postWeightedScore,
        compositeScore,
        growth,
      }
    })
  }, [filteredStudents])

  const stats = useMemo(() => {
    const total = enrichedStudents.length
    const safeTotal = total || 1
    const correct = enrichedStudents.filter((student) => student.correct).length
    const correctRate = Math.round((correct / safeTotal) * 100)
    const avgTime = Math.round(
      enrichedStudents.reduce((acc, student) => acc + student.timeSpent, 0) / safeTotal
    )
    const avgAttempts = (
      enrichedStudents.reduce((acc, student) => acc + student.attempts, 0) / safeTotal
    ).toFixed(1)
    const preCompletionRate = Math.round(
      (enrichedStudents.filter((student) => student.preCompleted).length / safeTotal) * 100
    )
    const postCompletionRate = Math.round(
      (enrichedStudents.filter((student) => student.postCompleted).length / safeTotal) * 100
    )
    const avgWeightedPost = Math.round(
      enrichedStudents.reduce((acc, student) => acc + student.postWeightedScore, 0) / safeTotal
    )
    const avgGrowth = Math.round(
      enrichedStudents.reduce((acc, student) => acc + student.growth, 0) / safeTotal
    )
    const avgReflection = Math.round(
      enrichedStudents.reduce((acc, student) => acc + student.reflectionQuality, 0) / safeTotal
    )

    return {
      total,
      correct,
      correctRate,
      avgTime,
      avgAttempts,
      preCompletionRate,
      postCompletionRate,
      avgWeightedPost,
      avgGrowth,
      avgReflection,
    }
  }, [enrichedStudents])

  const choiceDistribution = useMemo(() => {
    const choices = ['A', 'B', 'C', 'D'] as const
    return choices.map((choice) => ({
      name: `选项 ${choice}`,
      value: enrichedStudents.filter((student) => student.choice === choice).length,
      correct: choice === 'A',
    }))
  }, [enrichedStudents])

  const timeDistribution = useMemo(() => {
    const ranges = [
      { name: '< 1 分钟', min: 0, max: 60 },
      { name: '1-2 分钟', min: 60, max: 120 },
      { name: '2-3 分钟', min: 120, max: 180 },
      { name: '> 3 分钟', min: 180, max: 9999 },
    ]

    return ranges.map((range) => ({
      name: range.name,
      value: enrichedStudents.filter(
        (student) => student.timeSpent >= range.min && student.timeSpent < range.max
      ).length,
    }))
  }, [enrichedStudents])

  const phaseCompareData = useMemo(() => {
    return enrichedStudents.map((student) => ({
      name: student.name.slice(0, 2),
      课前诊断: student.preScore,
      课后掌握: student.postWeightedScore,
    }))
  }, [enrichedStudents])

  const interactionCompletionData = useMemo(() => {
    const total = enrichedStudents.length
    return [
      {
        phase: '课前互动',
        已完成: enrichedStudents.filter((student) => student.preCompleted).length,
        待补做: total - enrichedStudents.filter((student) => student.preCompleted).length,
      },
      {
        phase: '课后互动',
        已完成: enrichedStudents.filter((student) => student.postCompleted).length,
        待补做: total - enrichedStudents.filter((student) => student.postCompleted).length,
      },
    ]
  }, [enrichedStudents])

  const needsAttention = useMemo(() => {
    return [...enrichedStudents]
      .filter(
        (student) =>
          !student.correct || !student.postCompleted || student.growth < 12 || student.attempts >= 3
      )
      .sort(
        (a, b) =>
          Number(a.postCompleted) - Number(b.postCompleted) ||
          a.growth - b.growth ||
          b.attempts - a.attempts
      )
      .slice(0, 5)
  }, [enrichedStudents])

  const knowledgeData = useMemo(
    () => [
      { label: '区间调度问题', value: Math.round((stats.preCompletionRate + stats.correctRate) / 2) },
      { label: '贪心策略选择', value: stats.correctRate },
      { label: '课后复盘掌握', value: stats.avgWeightedPost },
      { label: '迁移应用能力', value: stats.avgReflection },
    ],
    [stats]
  )

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Users} label="总人数" value={stats.total} sub="参与分析" color="cyan" />
          <StatCard
            icon={BookOpen}
            label="课前完成率"
            value={`${stats.preCompletionRate}%`}
            sub="预习互动"
            color="indigo"
          />
          <StatCard
            icon={CheckCircle2}
            label="课堂正确率"
            value={`${stats.correctRate}%`}
            sub={`${stats.correct} 人答对`}
            color="green"
          />
          <StatCard
            icon={Sparkles}
            label="课后完成率"
            value={`${stats.postCompletionRate}%`}
            sub="复盘互动"
            color="fuchsia"
          />
          <StatCard
            icon={Target}
            label="课后加权均分"
            value={stats.avgWeightedPost}
            sub="综合评价占 50%"
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            label="平均成长"
            value={`+${stats.avgGrowth}`}
            sub={`平均用时 ${stats.avgTime}s`}
            color="cyan"
          />
        </div>

        <div className="glass neon-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <TrendingUp className="h-6 w-6 text-cyan-200" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">课前课后成效对比</div>
                <div className="text-base text-white/60">把预习诊断、课堂表现和课后复盘串成一个闭环</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base text-white/60">班级：</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as 'all' | '1班' | '2班')}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-base text-white/80 focus:outline-none focus:ring-1 focus:ring-cyan-200/50"
              >
                <option value="all">全部班级</option>
                <option value="1班">1 班</option>
                <option value="2班">2 班</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="h-[300px] rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-3 flex items-center justify-between px-2">
                <div className="text-base font-semibold text-white/80">课前诊断 vs 课后掌握</div>
                <div className="text-sm text-white/55">课后结果已纳入 50% 权重</div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseCompareData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 14,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="课前诊断" fill="rgba(129,140,248,0.75)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="课后掌握" fill="rgba(74,222,128,0.75)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[300px] rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="mb-3 flex items-center justify-between px-2">
                <div className="text-base font-semibold text-white/80">互动完成情况</div>
                <div className="text-sm text-white/55">纯前端静态数据演示</div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interactionCompletionData} layout="vertical">
                  <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="phase"
                    tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 14,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="已完成" stackId="a" fill="rgba(74,222,128,0.78)" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="待补做" stackId="a" fill="rgba(248,113,113,0.7)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass neon-border p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Target className="h-6 w-6 text-cyan-200" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">选项分布</div>
                <div className="text-base text-white/60">课堂作答的策略选择占比</div>
              </div>
            </div>

            <div className="mt-5 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={choiceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {choiceDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.correct ? '#4ade80' : COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 15,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 flex items-center justify-center gap-6 text-base">
              {choiceDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className={cn('h-4 w-4 rounded-full', item.correct ? 'bg-green-400' : 'bg-white/40')} />
                  <span className="text-white/70">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass neon-border p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Clock className="h-6 w-6 text-indigo-200" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">答题时长分布</div>
                <div className="text-base text-white/60">学生课堂作答时间区间统计</div>
              </div>
            </div>

            <div className="mt-5 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistribution}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 14 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 15,
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {timeDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={`rgba(74, 222, 255, ${0.3 + index * 0.15})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Users className="h-6 w-6 text-fuchsia-200" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">学生答题详情</div>
                <div className="text-base text-white/60">增加课前/课后数据后的完整学情视图</div>
              </div>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="bg-white/5 text-base text-white/70">
                <tr>
                  <th className="rounded-l-xl px-5 py-4">学生</th>
                  <th className="px-5 py-4">选择</th>
                  <th className="px-5 py-4">课堂结果</th>
                  <th className="px-5 py-4">课前诊断</th>
                  <th className="px-5 py-4">课后掌握</th>
                  <th className="px-5 py-4">成长值</th>
                  <th className="rounded-r-xl px-5 py-4">综合状态</th>
                </tr>
              </thead>
              <tbody>
                {enrichedStudents.map((student) => (
                  <tr key={student.id} className="border-t border-white/10">
                    <td className="px-5 py-4 text-lg font-medium text-white/85">
                      <div>
                        <div>{student.name}</div>
                        <div className="mt-1 text-xs text-white/50">{student.className}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center rounded-lg px-3 py-2 text-base font-semibold',
                          student.choice === 'A' ? 'bg-green-400/20 text-green-300' : 'bg-white/10 text-white/70'
                        )}
                      >
                        {student.choice}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {student.correct ? (
                        <span className="inline-flex items-center gap-2 text-lg text-green-300">
                          <CheckCircle2 className="h-5 w-5" />
                          正确
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-lg text-red-300">
                          <AlertCircle className="h-5 w-5" />
                          错误
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/75">
                      <div>{student.preScore} 分</div>
                      <div className="mt-1 text-xs text-white/50">
                        {student.preCompleted ? '已预习' : '待补预习'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/75">
                      <div>{student.postWeightedScore} 分</div>
                      <div className="mt-1 text-xs text-white/50">
                        {student.postCompleted ? '已复盘' : '待补复盘'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/75">+{student.growth}</td>
                    <td className="px-5 py-4">
                      {student.correct && student.growth >= 15 && student.postCompleted ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-base font-semibold text-green-300">
                          <TrendingUp className="h-4 w-4" />
                          提升明显
                        </span>
                      ) : !student.postCompleted || student.growth < 12 ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-base font-semibold text-yellow-300">
                          <AlertCircle className="h-4 w-4" />
                          需课后跟进
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-base font-semibold text-white/60">
                          课堂达标
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-4">
        <div className="glass neon-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <AlertCircle className="h-6 w-6 text-yellow-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">需要关注</div>
              <div className="text-base text-white/60">课堂卡点或课后未闭环的学生</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {needsAttention.map((student) => (
              <div
                key={student.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-white/85">{student.name}</div>
                  <div className="text-sm text-white/50">{student.className}</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-base text-white/60">
                  <span>选择：{student.choice}</span>
                  <span>尝试：{student.attempts} 次</span>
                  <span>课前：{student.preScore} 分</span>
                  <span>课后：{student.postWeightedScore} 分</span>
                </div>
                <div className="mt-3 text-base text-yellow-300">
                  {!student.postCompleted
                    ? '课后复盘未完成，建议优先补做课后互动。'
                    : `成长值仅 +${student.growth}，建议安排针对性辅导与反例复盘。`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <BookOpen className="h-6 w-6 text-cyan-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">教学建议</div>
              <div className="text-base text-white/60">AI 生成的阶段化建议</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-green-300" />
                <div>
                  <div className="text-lg font-medium text-white/85">课后权重已体现提升</div>
                  <div className="mt-2 text-base text-white/65">
                    当前综合评价中，课后复盘与迁移任务占比 {Math.round(POST_CLASS_WEIGHT * 100)}%，有利于鼓励学生把课堂结论转化成真正掌握。
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-yellow-300" />
                <div>
                  <div className="text-lg font-medium text-white/85">预习短板仍需补齐</div>
                  <div className="mt-2 text-base text-white/65">
                    课前完成率为 {stats.preCompletionRate}%，建议对未完成预习的学生推送“知识唤醒 + 预习提问”两步式任务，帮助他们带着问题进课堂。
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <Target className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                <div>
                  <div className="text-lg font-medium text-white/85">下节课建议</div>
                  <div className="mt-2 text-base text-white/65">
                    针对成长值低于 +12 的学生，建议安排一次课后小组复盘，让他们用自己的语言解释 B/C 为什么会失败，再做迁移应用任务。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Award className="h-6 w-6 text-indigo-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">综合评价权重</div>
              <div className="text-base text-white/60">课后的比重已提高到 50%</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <WeightRow label="课前预习" value={PRE_CLASS_WEIGHT} tone="from-indigo-300/70 to-cyan-300/70" />
            <WeightRow label="课堂表现" value={IN_CLASS_WEIGHT} tone="from-cyan-300/70 to-emerald-300/70" />
            <WeightRow label="课后巩固" value={POST_CLASS_WEIGHT} tone="from-emerald-300/70 to-yellow-300/70" />
          </div>
        </div>

        <div className="glass neon-border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Award className="h-6 w-6 text-indigo-200" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white/90">知识点掌握</div>
              <div className="text-base text-white/60">已纳入课后复盘结果</div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {knowledgeData.map((item) => (
              <KnowledgeBar key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: ElementType
  label: string
  value: string | number
  sub: string
  color: 'cyan' | 'green' | 'indigo' | 'fuchsia' | 'yellow'
}) {
  const colorClasses = {
    cyan: 'text-cyan-200',
    green: 'text-green-200',
    indigo: 'text-indigo-200',
    fuchsia: 'text-fuchsia-200',
    yellow: 'text-yellow-200',
  }

  return (
    <div className="glass neon-border p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className={cn('h-6 w-6', colorClasses[color])} />
        </div>
        <div>
          <div className="text-base text-white/60">{label}</div>
          <div className="text-2xl font-bold text-white/90">{value}</div>
        </div>
      </div>
      <div className="mt-3 text-base text-white/50">{sub}</div>
    </div>
  )
}

function WeightRow({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-base">
        <span className="text-white/70">{label}</span>
        <span className="text-lg font-medium text-white/85">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-white/10">
        <div className={cn('h-3 rounded-full bg-gradient-to-r transition-all', tone)} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}

function KnowledgeBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-base">
        <span className="text-white/70">{label}</span>
        <span className="text-lg font-medium text-white/85">{value}%</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-white/10">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-300/60 via-indigo-300/60 to-fuchsia-300/60 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
