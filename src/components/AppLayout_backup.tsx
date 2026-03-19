import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Bot, GraduationCap, ShieldCheck, Sparkles, UserCog, BarChart3, Code, FileCode, BookOpen, MessageSquare, Database } from 'lucide-react'
import { cn } from '../lib/cn'

function TopNav() {
  const location = useLocation()

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-300/25 via-indigo-300/20 to-fuchsia-300/25 blur-xl" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_70px_-35px_rgba(74,222,255,0.55)]">
              <Bot className="h-6 w-6 text-cyan-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wide text-white/90">
              Algo 教学辅助智能体 
              </span>
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5 text-fuchsia-200" />
                课堂展示模式
              </span>
            </div>
            <div className="text-xs text-white/60">
              课程：算法设计与分析｜专题：贪心思想（区间调度）
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/student"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <GraduationCap className="h-4 w-4" />
            学生问答
          </NavLink>
          <NavLink
            to="/student/oj"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <Code className="h-4 w-4" />
            编程练习
          </NavLink>
          <NavLink
            to="/teacher"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <UserCog className="h-4 w-4" />
            教师实验
          </NavLink>
          <NavLink
            to="/teacher/analytics"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <BarChart3 className="h-4 w-4" />
            答题分析
          </NavLink>
          <NavLink
            to="/teacher/submissions"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <FileCode className="h-4 w-4" />
            提交记录
          </NavLink>
          <NavLink
            to="/courseware"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <BookOpen className="h-4 w-4" />
            课件资源
          </NavLink>
          <NavLink
            to="/discussion"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <MessageSquare className="h-4 w-4" />
            讨论区
          </NavLink>
          <NavLink
            to="/teacher/question-bank"
            className={({ isActive }) =>
              cn(
                'btn',
                isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
              )
            }
          >
            <Database className="h-4 w-4" />
            题库管理
          </NavLink>
          <div
            className={cn(
              'hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 md:flex',
              location.pathname.startsWith('/teacher') ? 'neon-border' : ''
            )}
          >
            <ShieldCheck className="h-4 w-4 text-cyan-200" />
            场景：网络安全漏洞修复任务调度
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppLayout() {
  return (
    <div className="relative min-h-screen">
      <TopNav />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="scanline absolute inset-0" />
      </div>
      <main className="mx-auto max-w-7xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  )
}
