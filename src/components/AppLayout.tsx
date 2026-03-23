import { cn } from '../lib/cn'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bot,
  BarChart3,
  Code,
  FileCode,
  BookOpen,
  MessageSquare,
  Database,
  User,
  Users,
  Home,
  Sun,
  Moon,
  Menu,
  
  type LucideIcon,
} from 'lucide-react'
import { useState, useEffect } from 'react'

type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

const NAV_BY_ROLE: Record<'student' | 'teacher', NavItem[]> = {
  student: [
    { label: '学习首页', to: '/student', icon: Home, end: true },
    { label: '知识图谱', to: '/student/knowledge-graph', icon: Database },
    { label: 'AI互动引导', to: '/student/qa', icon: Bot },
    { label: '编程练习', to: '/student/oj', icon: Code },
    { label: '课件资源', to: '/courseware', icon: BookOpen },
    { label: '讨论区', to: '/discussion', icon: MessageSquare },
  ],
  teacher: [
    { label: '实验管理', to: '/teacher', icon: Home, end: true },
    { label: '答题分析', to: '/teacher/analytics', icon: BarChart3 },
    { label: '提交记录', to: '/teacher/submissions', icon: FileCode },
    { label: '题库管理', to: '/teacher/question-bank', icon: Database },
    { label: '课件资源', to: '/courseware', icon: BookOpen },
    { label: '讨论区', to: '/discussion', icon: MessageSquare },
  ],
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark'
    }
    const savedTheme = window.localStorage.getItem('theme-mode')
    return savedTheme === 'light' ? 'light' : 'dark'
  })
  
  // 监听路由变化，自动且安全地同步角色状态
  useEffect(() => {
    if (location.pathname.startsWith('/teacher')) {
      setUserRole('teacher')
    } else if (location.pathname.startsWith('/student') || location.pathname === '/') {
      setUserRole('student')
    }
    setIsSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    if (themeMode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    window.localStorage.setItem('theme-mode', themeMode)
  }, [themeMode])

  // 处理手动角色切换：除了改状态，还要根据当前所在的专属页面进行路由跳转
  const handleRoleSwitch = (role: 'student' | 'teacher') => {
    setUserRole(role)
    if (role === 'student' && location.pathname.startsWith('/teacher')) {
      navigate('/student')
    } else if (role === 'teacher' && location.pathname.startsWith('/student')) {
      navigate('/teacher')
    }
  }

  const navItems = NAV_BY_ROLE[userRole]
  const roleTitle = userRole === 'student' ? '学生端' : '教师端'

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden transition-colors duration-300",
      themeMode === 'dark' ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* 移动端遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        themeMode === 'dark' 
          ? "bg-slate-900/80 border-slate-800 backdrop-blur-xl" 
          : "bg-white/80 border-slate-200 backdrop-blur-xl",
        "border-r shadow-2xl lg:shadow-none"
      )}>
        {/* Logo 区域 */}
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-md">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="truncate text-lg font-bold tracking-tight">AI教学平台</h1>
            <span className="truncate text-xs text-slate-500 mix-blend-luminosity">教学创新大赛核心系统</span>
          </div>
        </div>

        {/* 角色切换区 */}
        <div className="px-4 py-2">
          <div className={cn(
            "flex w-full items-center rounded-xl p-1",
            themeMode === 'dark' ? "bg-slate-800/50" : "bg-slate-100/80"
          )}>
            <button
              onClick={() => handleRoleSwitch('student')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-200',
                userRole === 'student'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <User className="h-4 w-4" />
              学生
            </button>
            <button
              onClick={() => handleRoleSwitch('teacher')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-200',
                userRole === 'teacher'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Users className="h-4 w-4" />
              教师
            </button>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4 app-scrollbar">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {roleTitle}导航
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? themeMode === 'dark'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-indigo-50 text-indigo-700'
                      : themeMode === 'dark'
                        ? 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )
                }
              >
                <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/')) ? "animate-pulse-once" : "")} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* 底部功能区 (主题切换) */}
        <div className={cn(
          "mt-auto border-t p-4",
          themeMode === 'dark' ? "border-slate-800" : "border-slate-200"
        )}>
          <button
            onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              themeMode === 'dark' 
                ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800" 
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            )}
          >
            <span className="flex items-center gap-2">
              {themeMode === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {themeMode === 'dark' ? '深色模式' : '浅色模式'}
            </span>
            <div className={cn(
              "flex h-5 w-8 items-center rounded-full p-1",
              themeMode === 'dark' ? "bg-indigo-500 justify-end" : "bg-slate-300 justify-start"
            )}>
              <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
            </div>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 移动端顶部导航条 */}
        <header className={cn(
          "flex h-16 shrink-0 items-center justify-between border-b px-4 lg:hidden",
          themeMode === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        )}>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-500" />
            <span className="font-bold">AI教学平台</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* 主体滚动区 */}
        <main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-transparent custom-scrollbar">
          <div className="flex w-full flex-1 flex-col p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

