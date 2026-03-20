import { useNavigate } from 'react-router-dom'
import {
  Bot,
  PlayCircle,
  BookOpen,
  Code,
  ArrowRight,
  Clock,
  Activity,
  Award,
} from 'lucide-react'
import { cn } from '../lib/cn'

export function StudentHome() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col space-y-8">
      {/* 欢迎模块 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">欢迎回来，同学 👋</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            今天是继续学习《算法设计与分析》的好日子。
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>本次登录时长: 12 分钟</span>
          </div>
        </div>
      </div>

      {/* 核心应用入口 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* AI 问答/引导入口 */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-6 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30">
          <div className="absolute -right-6 -top-6 rounded-full bg-white/10 p-4 transition-transform duration-500 group-hover:scale-110">
            <Bot className="h-24 w-24 text-white/20" />
          </div>
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">AI 智能辅助解答</h3>
            <p className="mt-2 line-clamp-2 text-sm text-indigo-100">
              包含课前预习、课堂互动、课后复盘。沉浸式区间调度实验推导与问答。
            </p>
            <button
              onClick={() => navigate('/student/qa')}
              className="mt-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
            >
              立刻进入
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 编程练习入口 */}
        <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold">在线评测 (OJ)</h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              完成针对贪心算法的实战编程题，自动生成 AI 诊断报告与提示。
            </p>
            <button
              onClick={() => navigate('/student/oj')}
              className="mt-6 flex items-center gap-2 font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              去练习
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 课件资源入口 */}
        <div className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold">课件与资料</h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              查看教师下发的电子讲义、思维导图和课堂实录。
            </p>
            <button
              onClick={() => navigate('/courseware')}
              className="mt-6 flex items-center gap-2 font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              查看资源
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 学习动态概览 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="flex items-center gap-2 font-bold">
            <Activity className="h-5 w-5 text-indigo-500" />
            近日学习动态
          </h3>
          <div className="mt-6 space-y-6">
            <div className="relative pl-6 before:absolute before:bottom-0 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700">
              <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white bg-indigo-500 dark:border-slate-900"></div>
              <p className="text-sm font-medium">参加了【区间调度】课前知识唤醒</p>
              <p className="mt-1 text-xs text-slate-500">2 小时前</p>
            </div>
            <div className="relative pl-6 before:absolute before:bottom-0 before:left-[11px] before:top-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700">
              <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white bg-emerald-500 dark:border-slate-900"></div>
              <p className="text-sm font-medium">阅读了课件《网络安全漏洞修复任务调度》</p>
              <p className="mt-1 text-xs text-slate-500">昨天 16:30</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white bg-slate-300 dark:border-slate-900 dark:bg-slate-600"></div>
              <p className="text-sm font-medium text-slate-500 line-through">完成了编程练习【跳跃游戏】</p>
              <p className="mt-1 text-xs text-slate-500">3 天前</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="flex items-center gap-2 font-bold">
            <Award className="h-5 w-5 text-amber-500" />
            学情简报
          </h3>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">代码通过率</p>
                <p className="text-xs text-slate-500">本周新高</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">85%</span>
          </div>
          
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <PlayCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">课堂互动度</p>
                <p className="text-xs text-slate-500">位于班级前 15%</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">优</span>
          </div>
        </div>
      </div>
    </div>
  )
}
