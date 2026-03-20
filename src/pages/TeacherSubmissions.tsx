import { useMemo, useState } from 'react'
import {
  Trophy,
  TrendingUp,
  CheckCircle,
  FileCode,
  BarChart3,
  Filter,
  Download,
  Eye,
  Zap,
  Cpu,
  Sparkles,
  BookOpenCheck,
} from 'lucide-react'
import { cn } from '../lib/cn'
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts'

const POST_CLASS_WEIGHT_CONFIG = {
  classroom: 0.55,
  postClass: 0.45,
  boostFactor: 1.2,
}

const mockStudents = [
  { id: 1, name: '陈浩然', class: '1班', avatar: 'CH' },
  { id: 2, name: '林雨桐', class: '1班', avatar: 'LY' },
  { id: 3, name: '王梓萱', class: '1班', avatar: 'WZ' },
  { id: 4, name: '张子墨', class: '2班', avatar: 'ZZ' },
  { id: 5, name: '刘欣怡', class: '2班', avatar: 'LX' },
  { id: 6, name: '李子轩', class: '2班', avatar: 'LZ' },
  { id: 7, name: '黄诗涵', class: '1班', avatar: 'HS' },
  { id: 8, name: '吴俊熙', class: '1班', avatar: 'WJ' },
  { id: 9, name: '周可馨', class: '2班', avatar: 'ZK' },
  { id: 10, name: '徐志远', class: '2班', avatar: 'XZ' },
]

const mockProblems = [
  { id: 1, title: '两数之和', difficulty: '简单', tags: ['数组', '哈希表'] },
  { id: 2, title: '最长公共前缀', difficulty: '简单', tags: ['字符串'] },
  { id: 3, title: '有效的括号', difficulty: '简单', tags: ['栈', '字符串'] },
  { id: 4, title: '合并两个有序链表', difficulty: '中等', tags: ['链表', '递归'] },
  { id: 5, title: '二叉树的中序遍历', difficulty: '中等', tags: ['二叉树', '递归'] },
]

const mockSubmissions = [
  { id: 1, studentId: 1, problemId: 1, status: 'Accepted', phase: '课堂', time: '2024-03-16 10:30', runtime: '2ms', memory: '42.1MB', code: 'function twoSum(nums, target) {...}' },
  { id: 2, studentId: 2, problemId: 1, status: 'Wrong Answer', phase: '课堂', time: '2024-03-16 10:25', runtime: '1ms', memory: '41.8MB', code: 'function twoSum(nums, target) {...}' },
  { id: 3, studentId: 3, problemId: 2, status: 'Accepted', phase: '课堂', time: '2024-03-16 09:20', runtime: '3ms', memory: '43.2MB', code: 'function longestCommonPrefix(strs) {...}' },
  { id: 4, studentId: 4, problemId: 3, status: 'Time Limit Exceeded', phase: '课堂', time: '2024-03-16 08:10', runtime: '1000ms', memory: '45.5MB', code: 'function isValid(s) {...}' },
  { id: 5, studentId: 5, problemId: 3, status: 'Accepted', phase: '课堂', time: '2024-03-16 08:15', runtime: '5ms', memory: '42.3MB', code: 'function isValid(s) {...}' },
  { id: 6, studentId: 6, problemId: 4, status: 'Accepted', phase: '课后', time: '2024-03-15 15:30', runtime: '8ms', memory: '44.1MB', code: 'function mergeTwoLists(l1, l2) {...}' },
  { id: 7, studentId: 7, problemId: 4, status: 'Runtime Error', phase: '课后', time: '2024-03-15 14:45', runtime: '0ms', memory: '0MB', code: 'function mergeTwoLists(l1, l2) {...}' },
  { id: 8, studentId: 8, problemId: 5, status: 'Accepted', phase: '课后', time: '2024-03-15 13:20', runtime: '12ms', memory: '46.2MB', code: 'function inorderTraversal(root) {...}' },
  { id: 9, studentId: 9, problemId: 5, status: 'Memory Limit Exceeded', phase: '课后', time: '2024-03-15 12:30', runtime: '15ms', memory: '128MB', code: 'function inorderTraversal(root) {...}' },
  { id: 10, studentId: 10, problemId: 1, status: 'Accepted', phase: '课后', time: '2024-03-15 11:45', runtime: '2ms', memory: '42.0MB', code: 'function twoSum(nums, target) {...}' },
  { id: 11, studentId: 1, problemId: 2, status: 'Accepted', phase: '课后', time: '2024-03-15 10:30', runtime: '3ms', memory: '43.1MB', code: 'function longestCommonPrefix(strs) {...}' },
  { id: 12, studentId: 2, problemId: 3, status: 'Accepted', phase: '课后', time: '2024-03-15 09:25', runtime: '4ms', memory: '42.5MB', code: 'function isValid(s) {...}' },
  { id: 13, studentId: 3, problemId: 4, status: 'Accepted', phase: '课后', time: '2024-03-14 16:20', runtime: '7ms', memory: '43.8MB', code: 'function mergeTwoLists(l1, l2) {...}' },
  { id: 14, studentId: 4, problemId: 5, status: 'Accepted', phase: '课后', time: '2024-03-14 15:10', runtime: '11ms', memory: '45.1MB', code: 'function inorderTraversal(root) {...}' },
  { id: 15, studentId: 5, problemId: 1, status: 'Accepted', phase: '课后', time: '2024-03-14 14:15', runtime: '2ms', memory: '41.9MB', code: 'function twoSum(nums, target) {...}' },
]

const postClassProfiles: Record<
  number,
  { reviewCompletion: number; reflectionScore: number; transferScore: number; interactionCount: number }
> = {
  1: { reviewCompletion: 96, reflectionScore: 91, transferScore: 88, interactionCount: 3 },
  2: { reviewCompletion: 82, reflectionScore: 84, transferScore: 74, interactionCount: 3 },
  3: { reviewCompletion: 93, reflectionScore: 89, transferScore: 90, interactionCount: 2 },
  4: { reviewCompletion: 76, reflectionScore: 70, transferScore: 68, interactionCount: 2 },
  5: { reviewCompletion: 98, reflectionScore: 94, transferScore: 92, interactionCount: 3 },
  6: { reviewCompletion: 80, reflectionScore: 78, transferScore: 75, interactionCount: 2 },
  7: { reviewCompletion: 79, reflectionScore: 73, transferScore: 72, interactionCount: 2 },
  8: { reviewCompletion: 75, reflectionScore: 72, transferScore: 70, interactionCount: 1 },
  9: { reviewCompletion: 88, reflectionScore: 83, transferScore: 80, interactionCount: 2 },
  10: { reviewCompletion: 91, reflectionScore: 86, transferScore: 84, interactionCount: 2 },
}

const leaderboardData = mockStudents
  .map((student) => {
    const studentSubmissions = mockSubmissions.filter((submission) => submission.studentId === student.id)
    const acceptedSubmissions = studentSubmissions.filter((submission) => submission.status === 'Accepted')
    const inClassSubmissions = studentSubmissions.filter((submission) => submission.phase === '课堂')
    const postClassSubmissions = studentSubmissions.filter((submission) => submission.phase === '课后')
    const postClassAccepted = postClassSubmissions.filter((submission) => submission.status === 'Accepted')
    const uniqueAcceptedProblems = [...new Set(acceptedSubmissions.map((submission) => submission.problemId))].length
    const totalRuntime = studentSubmissions.reduce((sum, submission) => sum + parseFloat(submission.runtime), 0)
    const avgRuntime = studentSubmissions.length > 0 ? (totalRuntime / studentSubmissions.length).toFixed(1) : '0'
    const postProfile = postClassProfiles[student.id]

    const classroomScore =
      uniqueAcceptedProblems * 80 +
      acceptedSubmissions.length * 12 +
      inClassSubmissions.filter((submission) => submission.status === 'Accepted').length * 10 -
      studentSubmissions.length * 3

    const postClassRawScore = Math.round(
      postProfile.reviewCompletion * 0.35 +
        postProfile.reflectionScore * 0.25 +
        postProfile.transferScore * 0.4 +
        postClassAccepted.length * 6
    )

    const postClassWeightedScore = Math.round(
      postClassRawScore * POST_CLASS_WEIGHT_CONFIG.boostFactor
    )

    const score = Math.round(
      classroomScore * POST_CLASS_WEIGHT_CONFIG.classroom +
        postClassWeightedScore * POST_CLASS_WEIGHT_CONFIG.postClass
    )

    return {
      ...student,
      totalSubmissions: studentSubmissions.length,
      acceptedCount: acceptedSubmissions.length,
      acceptanceRate:
        studentSubmissions.length > 0
          ? Math.round((acceptedSubmissions.length / studentSubmissions.length) * 100)
          : 0,
      solvedProblems: uniqueAcceptedProblems,
      avgRuntime: `${avgRuntime}ms`,
      classroomScore,
      postClassRawScore,
      postClassWeightedScore,
      postBoost: postClassWeightedScore - postClassRawScore,
      postClassCompletion: postProfile.reviewCompletion,
      reflectionScore: postProfile.reflectionScore,
      transferScore: postProfile.transferScore,
      interactionCount: postProfile.interactionCount,
      score,
    }
  })
  .sort((a, b) => b.score - a.score)

export function TeacherSubmissions() {
  const [selectedClass, setSelectedClass] = useState<'all' | '1班' | '2班'>('all')
  const [selectedProblem, setSelectedProblem] = useState<number | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPhase, setSelectedPhase] = useState<'all' | '课堂' | '课后'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list')
  const [selectedSubmission, setSelectedSubmission] = useState<typeof mockSubmissions[0] | null>(null)

  const filteredSubmissions = useMemo(() => {
    return mockSubmissions
      .filter((submission) => {
        const student = mockStudents.find((item) => item.id === submission.studentId)
        if (!student) return false

        const classMatch = selectedClass === 'all' || student.class === selectedClass
        const problemMatch = selectedProblem === 'all' || submission.problemId === selectedProblem
        const statusMatch = selectedStatus === 'all' || submission.status === selectedStatus
        const phaseMatch = selectedPhase === 'all' || submission.phase === selectedPhase

        return classMatch && problemMatch && statusMatch && phaseMatch
      })
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  }, [selectedClass, selectedProblem, selectedStatus, selectedPhase])

  const filteredLeaderboard = useMemo(() => {
    return selectedClass === 'all'
      ? leaderboardData
      : leaderboardData.filter((student) => student.class === selectedClass)
  }, [selectedClass])

  const stats = useMemo(() => {
    const total = filteredSubmissions.length
    const accepted = filteredSubmissions.filter((submission) => submission.status === 'Accepted').length
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0
    const avgRuntime =
      total > 0
        ? (
            filteredSubmissions.reduce((sum, submission) => sum + parseFloat(submission.runtime), 0) / total
          ).toFixed(1)
        : '0'
    const postClassDone =
      filteredLeaderboard.length > 0
        ? Math.round(
            filteredLeaderboard.filter((student) => student.postClassCompletion >= 80).length /
              filteredLeaderboard.length *
              100
          )
        : 0
    const avgWeightedScore =
      filteredLeaderboard.length > 0
        ? Math.round(
            filteredLeaderboard.reduce((sum, student) => sum + student.postClassWeightedScore, 0) /
              filteredLeaderboard.length
          )
        : 0

    return { total, accepted, acceptanceRate, avgRuntime, postClassDone, avgWeightedScore }
  }, [filteredSubmissions, filteredLeaderboard])

  const submissionTrend = useMemo(() => {
    const trendMap = new Map<string, number>()

    filteredSubmissions.forEach((submission) => {
      const date = submission.time.split(' ')[0]
      trendMap.set(date, (trendMap.get(date) || 0) + 1)
    })

    return Array.from(trendMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
  }, [filteredSubmissions])

  const statusDistribution = useMemo(() => {
    const statusCounts = new Map<string, number>()

    filteredSubmissions.forEach((submission) => {
      statusCounts.set(submission.status, (statusCounts.get(submission.status) || 0) + 1)
    })

    return Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: filteredSubmissions.length > 0 ? Math.round((count / filteredSubmissions.length) * 100) : 0,
    }))
  }, [filteredSubmissions])

  const boostContributionData = useMemo(() => {
    return filteredLeaderboard.slice(0, 8).map((student) => ({
      name: student.name.slice(0, 2),
      课堂基础: student.classroomScore,
      课后加权: student.postClassWeightedScore,
    }))
  }, [filteredLeaderboard])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-400'
      case 'Wrong Answer':
        return 'text-red-400'
      case 'Time Limit Exceeded':
        return 'text-yellow-400'
      case 'Memory Limit Exceeded':
        return 'text-orange-400'
      case 'Runtime Error':
        return 'text-purple-400'
      default:
        return 'text-slate-500 dark:text-white/60'
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-400/10 border-green-400/30'
      case 'Wrong Answer':
        return 'bg-red-400/10 border-red-400/30'
      case 'Time Limit Exceeded':
        return 'bg-yellow-400/10 border-yellow-400/30'
      case 'Memory Limit Exceeded':
        return 'bg-orange-400/10 border-orange-400/30'
      case 'Runtime Error':
        return 'bg-purple-400/10 border-purple-400/30'
      default:
        return 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
    }
  }

  const handleViewCode = (submission: typeof mockSubmissions[0]) => {
    setSelectedSubmission(submission)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white/90">
            <FileCode className="h-7 w-7 text-cyan-300" />
            学生提交记录与排行榜
          </h1>
          <p className="mt-1 text-slate-500 dark:text-white/60">AI 汇聚生成的课后加权后的综合评价与提交分析</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'stats' : 'list')}
            className="btn bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10"
          >
            {viewMode === 'list' ? (
              <>
                <BarChart3 className="h-4 w-4" />
                查看统计
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                查看列表
              </>
            )}
          </button>
          <button className="btn btn-primary neon-border">
            <Download className="h-4 w-4" />
            导出数据
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard icon={FileCode} label="总提交数" value={stats.total} sub="当前筛选范围" tone="cyan" />
        <MetricCard icon={CheckCircle} label="通过数" value={stats.accepted} sub="Accepted" tone="green" />
        <MetricCard icon={TrendingUp} label="通过率" value={`${stats.acceptanceRate}%`} sub="提交维度" tone="purple" />
        <MetricCard icon={Zap} label="平均用时" value={`${stats.avgRuntime}ms`} sub="提交性能" tone="yellow" />
        <MetricCard icon={BookOpenCheck} label="课后达标率" value={`${stats.postClassDone}%`} sub="复盘完成度 ≥ 80" tone="emerald" />
        <MetricCard icon={Sparkles} label="课后加权均分" value={stats.avgWeightedScore} sub={`系数 x${POST_CLASS_WEIGHT_CONFIG.boostFactor}`} tone="pink" />
      </div>

      <div className="glass neon-border p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white/90">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              课后加权规则
            </h2>
            <div className="mt-1 text-sm text-slate-500 dark:text-white/60">
              排行榜综合得分 = 课堂基础 {Math.round(POST_CLASS_WEIGHT_CONFIG.classroom * 100)}% + 课后复盘 {Math.round(POST_CLASS_WEIGHT_CONFIG.postClass * 100)}%
            </div>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            课后系数 x{POST_CLASS_WEIGHT_CONFIG.boostFactor}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <RuleCard title="课堂基础" value="55%" desc="解题数、通过数、课堂提交质量" />
          <RuleCard title="课后复盘" value="45%" desc="复盘完成度、反思质量、迁移任务" />
          <RuleCard title="加权系数" value={`x${POST_CLASS_WEIGHT_CONFIG.boostFactor}`} desc="对课后原始分进行强化" />
          <RuleCard title="激励方向" value="重掌握" desc="鼓励学生课后真正完成巩固" />
        </div>
      </div>

      <div className="glass neon-border p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white/90">
            <Filter className="h-5 w-5 text-cyan-300" />
            筛选条件
          </h2>
          <div className="text-sm text-slate-500 dark:text-white/60">共 {filteredSubmissions.length} 条记录</div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm text-slate-500 dark:text-white/60">班级筛选</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as 'all' | '1班' | '2班')}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white/90 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">所有班级</option>
              <option value="1班">1班</option>
              <option value="2班">2班</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500 dark:text-white/60">题目筛选</label>
            <select
              value={selectedProblem}
              onChange={(e) => setSelectedProblem(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white/90 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">所有题目</option>
              {mockProblems.map((problem) => (
                <option key={problem.id} value={problem.id}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500 dark:text-white/60">状态筛选</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white/90 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">所有状态</option>
              <option value="Accepted">通过</option>
              <option value="Wrong Answer">答案错误</option>
              <option value="Time Limit Exceeded">超时</option>
              <option value="Memory Limit Exceeded">内存超限</option>
              <option value="Runtime Error">运行时错误</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-500 dark:text-white/60">阶段筛选</label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value as 'all' | '课堂' | '课后')}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white/90 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">全部阶段</option>
              <option value="课堂">课堂</option>
              <option value="课后">课后</option>
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          <div className="glass neon-border p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white/90">提交记录列表</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70">
                  <tr>
                    <th className="rounded-l-xl px-5 py-4">学生</th>
                    <th className="px-5 py-4">题目</th>
                    <th className="px-5 py-4">阶段</th>
                    <th className="px-5 py-4">状态</th>
                    <th className="px-5 py-4">用时</th>
                    <th className="px-5 py-4">内存</th>
                    <th className="px-5 py-4">提交时间</th>
                    <th className="rounded-r-xl px-5 py-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => {
                    const student = mockStudents.find((item) => item.id === submission.studentId)
                    const problem = mockProblems.find((item) => item.id === submission.problemId)

                    return (
                      <tr key={submission.id} className="border-t border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:bg-white/5">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                              <span className="font-semibold text-slate-900 dark:text-white/90">{student?.avatar}</span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white/90">{student?.name}</div>
                              <div className="text-xs text-slate-500 dark:text-white/60">{student?.class}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="max-w-[150px] truncate font-medium text-slate-900 dark:text-white/90" title={problem?.title}>
                            {problem?.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-white/60">{problem?.difficulty}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold',
                              submission.phase === '课后'
                                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                                : 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                            )}
                          >
                            {submission.phase}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold',
                              getStatusBgColor(submission.status),
                              getStatusColor(submission.status)
                            )}
                          >
                            {submission.status === 'Accepted' && <CheckCircle className="h-3 w-3" />}
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-900 dark:text-white/90">{submission.runtime}</td>
                        <td className="px-5 py-4 text-slate-900 dark:text-white/90">{submission.memory}</td>
                        <td className="px-5 py-4 text-slate-900 dark:text-white/90">{submission.time}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleViewCode(submission)}
                            className="btn bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10 text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            查看代码
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass neon-border p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white/90">
              <Trophy className="h-5 w-5 text-yellow-400" />
              学生排行榜
            </h2>
            <div className="space-y-4">
              {filteredLeaderboard.map((student, index) => (
                <div
                  key={student.id}
                  className={cn(
                    'rounded-xl border p-4 transition-all',
                    index < 3
                      ? 'border-yellow-500/30 bg-yellow-500/5 neon-border'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {index < 3 && (
                          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-500/25 via-orange-500/20 to-red-500/25 blur-xl" />
                        )}
                        <div
                          className={cn(
                            'relative flex h-12 w-12 items-center justify-center rounded-full',
                            index === 0
                              ? 'bg-gradient-to-br from-yellow-500/30 to-yellow-600/20'
                              : index === 1
                                ? 'bg-gradient-to-br from-gray-400/30 to-gray-500/20'
                                : index === 2
                                  ? 'bg-gradient-to-br from-orange-500/30 to-orange-600/20'
                                  : 'bg-slate-50 dark:bg-white/5'
                          )}
                        >
                          {index < 3 ? (
                            <Trophy
                              className={cn(
                                'h-6 w-6',
                                index === 0
                                  ? 'text-yellow-300'
                                  : index === 1
                                    ? 'text-gray-300'
                                    : 'text-orange-300'
                              )}
                            />
                          ) : (
                            <span className="font-bold text-slate-900 dark:text-white/90">{index + 1}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white/90">{student.name}</span>
                          <span className="chip text-xs">{student.class}</span>
                          <span className="chip text-xs bg-emerald-400/10 text-emerald-300">
                            课后 +{student.postBoost}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-slate-500 dark:text-white/60">
                          课堂基础 {student.classroomScore} 分 · 课后加权 {student.postClassWeightedScore} 分
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white/90">{student.score} 分</div>
                      <div className="text-sm text-slate-500 dark:text-white/60">综合得分</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-6">
                    <RankMetric label="通过率" value={`${student.acceptanceRate}%`} />
                    <RankMetric label="通过数" value={student.acceptedCount} />
                    <RankMetric label="平均用时" value={student.avgRuntime} />
                    <RankMetric label="解题数" value={student.solvedProblems} />
                    <RankMetric label="课后复盘" value={`${student.postClassCompletion}%`} />
                    <RankMetric label="迁移任务" value={student.transferScore} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="glass neon-border p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white/90">提交趋势</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass neon-border p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white/90">提交状态分布</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusDistribution}>
                  <XAxis
                    dataKey="status"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                    formatter={(value) => [`${value} 次`, '提交数']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusDistribution.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={
                          entry.status === 'Accepted'
                            ? '#4ade80'
                            : entry.status === 'Wrong Answer'
                              ? '#f87171'
                              : entry.status === 'Time Limit Exceeded'
                                ? '#fbbf24'
                                : entry.status === 'Memory Limit Exceeded'
                                  ? '#fb923c'
                                  : '#a78bfa'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
              {statusDistribution.map((item) => (
                <div key={item.status} className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-sm font-medium', getStatusColor(item.status))}>{item.status}</span>
                    <span className="text-xs text-slate-500 dark:text-white/60">{item.percentage}%</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white/90">{item.count}</div>
                  <div className="text-xs text-slate-500 dark:text-white/60">提交次数</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass neon-border p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white/90">课后加权贡献榜</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={boostContributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(5,6,13,0.92)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="课堂基础" fill="rgba(74,222,255,0.72)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="课后加权" fill="rgba(74,222,128,0.72)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass neon-border mx-4 max-h-[80vh] w-full max-w-4xl overflow-hidden">
            <div className="border-b border-slate-200 dark:border-white/10 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white/90">代码详情</h3>
                <button onClick={() => setSelectedSubmission(null)} className="btn bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10">
                  关闭
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                <InfoCard
                  label="学生"
                  value={mockStudents.find((student) => student.id === selectedSubmission.studentId)?.name || '-'}
                />
                <InfoCard
                  label="题目"
                  value={mockProblems.find((problem) => problem.id === selectedSubmission.problemId)?.title || '-'}
                />
                <InfoCard label="状态" value={selectedSubmission.status} valueClass={getStatusColor(selectedSubmission.status)} />
                <InfoCard label="阶段" value={selectedSubmission.phase} />
                <InfoCard label="提交时间" value={selectedSubmission.time} />
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
                <pre className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-black/30 p-4 font-mono text-sm text-slate-900 dark:text-white/90">
                  {selectedSubmission.code}
                </pre>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <InfoCard label="运行时间" value={selectedSubmission.runtime} centered />
                <InfoCard label="内存使用" value={selectedSubmission.memory} centered />
                <InfoCard label="代码长度" value={`${selectedSubmission.code.length} 字符`} centered />
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 p-5">
              <div className="flex justify-end gap-3">
                <button className="btn bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10">
                  <Download className="h-4 w-4" />
                  下载代码
                </button>
                <button className="btn btn-primary neon-border">
                  <Cpu className="h-4 w-4" />
                  AI分析代码
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <FooterCard
          icon={Eye}
          title="实时监控"
          desc="课堂提交与课后复盘都在同一份前端数据面板中展示。"
          tone="cyan"
        />
        <FooterCard
          icon={Trophy}
          title="智能排行"
          desc="排行榜已纳入课后加权分，鼓励学生在课后真正完成巩固。"
          tone="purple"
        />
        <FooterCard
          icon={BarChart3}
          title="数据分析"
          desc="教师可以直接查看课后加权对综合得分和学习成长的影响。"
          tone="green"
        />
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof FileCode
  label: string
  value: string | number
  sub: string
  tone: 'cyan' | 'green' | 'purple' | 'yellow' | 'emerald' | 'pink'
}) {
  const toneClasses = {
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-300',
    green: 'from-green-500/20 to-emerald-500/20 text-green-300',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-300',
    yellow: 'from-yellow-500/20 to-orange-500/20 text-yellow-300',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-300',
    pink: 'from-pink-500/20 to-rose-500/20 text-pink-300',
  }

  return (
    <div className="glass neon-border p-5">
      <div className="flex items-center gap-3">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br', toneClasses[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm text-slate-500 dark:text-white/60">{label}</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white/90">{value}</div>
          <div className="text-xs text-slate-500 dark:text-white/60">{sub}</div>
        </div>
      </div>
    </div>
  )
}

function RuleCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
      <div className="text-sm text-white/55">{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white/90">{value}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-white/60">{desc}</div>
    </div>
  )
}

function RankMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-2 text-center">
      <div className="text-xs text-slate-500 dark:text-white/60">{label}</div>
      <div className="text-lg font-semibold text-slate-900 dark:text-white/90">{value}</div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  centered,
  valueClass,
}: {
  label: string
  value: string
  centered?: boolean
  valueClass?: string
}) {
  return (
    <div className={cn('rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-3', centered && 'text-center')}>
      <div className="text-xs text-slate-500 dark:text-white/60">{label}</div>
      <div className={cn('font-medium text-slate-900 dark:text-white/90', valueClass)}>{value}</div>
    </div>
  )
}

function FooterCard({
  icon: Icon,
  title,
  desc,
  tone,
}: {
  icon: typeof Eye
  title: string
  desc: string
  tone: 'cyan' | 'purple' | 'green'
}) {
  const toneClasses = {
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-300',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-300',
    green: 'from-green-500/20 to-emerald-500/20 text-green-300',
  }

  return (
    <div className="glass neon-border p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br', toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white/90">{title}</div>
          <div className="text-sm text-slate-500 dark:text-white/60">{desc}</div>
        </div>
      </div>
    </div>
  )
}
