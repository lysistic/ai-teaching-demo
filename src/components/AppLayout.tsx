import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bot, BarChart3, Code, FileCode, BookOpen, MessageSquare, Database, User, Users, Home, Sun, Moon } from 'lucide-react'
import { cn } from '../lib/cn'
import { useState, useEffect } from 'react'

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student')
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }
    const savedTheme = window.localStorage.getItem('theme-mode')
    return savedTheme === 'light' ? 'light' : 'dark'
  })
  
  // 1. 监听路由变化，自动且安全地同步角色状态
  useEffect(() => {
    if (location.pathname.startsWith('/teacher')) {
      setUserRole('teacher')
    } else if (location.pathname.startsWith('/student') || location.pathname === '/') {
      setUserRole('student')
    }
    // 注：对于 /courseware 或 /discussion 这种公共路由，保持当前的 userRole 状态不变
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode)
    window.localStorage.setItem('theme-mode', themeMode)
  }, [themeMode])

  // 2. 处理手动角色切换：除了改状态，还要根据当前所在的专属页面进行路由跳转
  const handleRoleSwitch = (role: 'student' | 'teacher') => {
    setUserRole(role)
    if (role === 'student' && location.pathname.startsWith('/teacher')) {
      navigate('/student') // 教师专属页 -> 切学生时回到学生首页
    } else if (role === 'teacher' && location.pathname.startsWith('/student')) {
      navigate('/teacher') // 学生专属页 -> 切教师时回到教师首页
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo和标题 */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white/90">AI教学平台</h1>
                <p className="text-xs text-white/60">教学创新大赛AI赛道</p>
              </div>
            </div>

            {/* 角色切换 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className={cn(
                  'px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 border',
                  themeMode === 'dark'
                    ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    : 'bg-slate-900/5 border-slate-300 text-slate-700 hover:bg-slate-900/10'
                )}
                title="切换主题"
              >
                {themeMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {themeMode === 'dark' ? '白色系' : '深色系'}
              </button>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => handleRoleSwitch('student')}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2',
                    userRole === 'student' 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-white/60 hover:text-white/90'
                  )}
                >
                  <User className="h-4 w-4" />
                  学生端
                </button>
                <button
                  onClick={() => handleRoleSwitch('teacher')}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2',
                    userRole === 'teacher' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                      : 'text-white/60 hover:text-white/90'
                  )}
                >
                  <Users className="h-4 w-4" />
                  教师端
                </button>
              </div>
            </div>
          </div>

          {/* 导航菜单 - 根据角色显示不同的菜单 */}
          <div className="mt-4">
            {userRole === 'student' ? (
              // 学生端导航菜单
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <NavLink
                  to="/student"
                  end
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <Home className="h-4 w-4" />
                  首页
                </NavLink>
                <NavLink
                  to="/student/oj"
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <Code className="h-4 w-4" />
                  编程练习
                </NavLink>
                <NavLink
                  to="/courseware"
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
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
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <MessageSquare className="h-4 w-4" />
                  讨论区
                </NavLink>
              </div>
            ) : (
              // 教师端导航菜单
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <NavLink
                  to="/teacher"
                  end
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <Home className="h-4 w-4" />
                  实验管理
                </NavLink>
                <NavLink
                  to="/teacher/analytics"
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
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
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <FileCode className="h-4 w-4" />
                  提交记录
                </NavLink>
                <NavLink
                  to="/teacher/question-bank"
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <Database className="h-4 w-4" />
                  题库管理
                </NavLink>
                <NavLink
                  to="/courseware"
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <BookOpen className="h-4 w-4" />
                  课件管理
                </NavLink>
                <NavLink
                  to="/discussion"
                  className={({ isActive }) =>
                    cn(
                      'btn whitespace-nowrap',
                      isActive ? 'btn-primary neon-border' : 'bg-white/5 hover:bg-white/10'
                    )
                  }
                >
                  <MessageSquare className="h-4 w-4" />
                  讨论区管理
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 底部信息 */}
      <footer className="border-t border-white/10 bg-black/20 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white/90">AI教学演示平台</div>
                <div className="text-xs text-white/60">教学创新大赛AI赛道前端Demo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60">
                当前角色: <span className={cn(
                  'font-medium',
                  userRole === 'student' ? 'text-cyan-300' : 'text-purple-300'
                )}>
                  {userRole === 'student' ? '学生' : '教师'}
                </span>
              </div>
              <div className="text-xs text-white/40">
                © 2026 AI教学平台 · 仅供演示使用
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
