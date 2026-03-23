import { useNavigate } from 'react-router-dom'
import {
  Bot,
    BookOpen,
    ArrowRight,
  Clock,
  Activity,
    CheckCircle2,
  Lock,
  MessageSquareWarning,
  Sparkles,
    Brain,
  ShieldAlert,
  Terminal,
  Zap,
  Network,
  Cloud
} from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const radarData = [
  { subject: '数据结构', A: 85, fullMark: 100 },
  { subject: '算法思维', A: 65, fullMark: 100 },
  { subject: '代码规范', A: 90, fullMark: 100 },
  { subject: '系统设计', A: 50, fullMark: 100 },
  { subject: '调试能力', A: 75, fullMark: 100 },
  { subject: '理论推导', A: 60, fullMark: 100 },
]

export function StudentHome() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col space-y-8 pb-8">
      {/* 欢迎模块 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            欢迎回来，同学 👋
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              当前状态：极佳
            </span>
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
            根据你的学习轨迹，本次<span className="font-semibold text-indigo-600 dark:text-indigo-400">《算法设计与分析：动态规划》</span>旅程已经为你自动生成。请按照路径推进。
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
            <Clock className="h-4 w-4" />
            <span>AI 同步学习中: 12m</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* 左侧：学习旅程时间轴（数据流主线） */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-500" />
                闭环学习路径指南
             </h2>
             <span className="text-sm text-slate-500 dark:text-slate-400">第 3 单元 / 共 8 单元</span>
          </div>

          <div className="glass default-dark-card border border-slate-200 dark:border-slate-800 p-8 relative overflow-hidden">
             {/* 装饰性背景 */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
             
             <div className="relative space-y-8">
                {/* Node 1: 课前预习 - 已完成 */}
                <div className="flex gap-6 group relative">
                   <div className="absolute top-8 left-6 w-0.5 h-16 bg-emerald-500/30"></div>
                   <div className="flex flex-col items-center shrink-0 w-12 z-10">
                      <div className="h-12 w-12 rounded-full border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                         <CheckCircle2 className="h-6 w-6" />
                      </div>
                   </div>
                   <div className="flex-1 bg-white/50 dark:bg-slate-800/30 rounded-2xl p-5 border border-emerald-200/50 dark:border-emerald-500/20 transition-all hover:bg-emerald-50/50 dark:hover:bg-slate-800/50 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">关卡 01</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">预习：动态规划的重叠子问题</h3>
                         </div>
                         <button onClick={() => navigate('/student/qa')} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1">
                            查看对话报告 <ArrowRight className="h-4 w-4" />
                         </button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                         AI学情记录：<span className="font-semibold text-emerald-600 dark:text-emerald-400">优秀</span>。你成功解答了备忘录模式的推导。
                      </p>
                      <div className="mt-3 flex gap-2">
                         <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">打败了 85% 同学</span>
                      </div>
                   </div>
                </div>

                {/* Node 2: 课堂互动 - 刚刚结束 */}
                <div className="flex gap-6 group relative">
                   <div className="absolute top-8 left-6 w-0.5 h-16 bg-amber-500/50"></div>
                   <div className="flex flex-col items-center shrink-0 w-12 z-10">
                      <div className="h-12 w-12 rounded-full border-2 border-amber-500 bg-amber-50 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                         <BookOpen className="h-6 w-6" />
                      </div>
                   </div>
                   <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-500/20 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-1 bg-amber-500 h-full"></div>
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold font-mono">关卡 02</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">出席课堂：状态转移方程</h3>
                         </div>
                         <button onClick={() => navigate('/courseware')} className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline">
                            回看板书 <ArrowRight className="h-4 w-4" />
                         </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-500/10 border border-amber-200/30 dark:border-amber-500/20">
                         <MessageSquareWarning className="h-4 w-4 text-amber-500 shrink-0" />
                         <p className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>AI 听课记录：</strong>你在这节课向 AI 助教提问了 3 次关于“背包容量压缩”的疑惑，系统已将其标记为你的薄弱点。
                         </p>
                      </div>
                   </div>
                </div>

                {/* Node 3: 课后诊断 - 待办 */}
                <div className="flex gap-6 group relative">
                   <div className="absolute top-8 left-6 w-0.5 h-16 bg-slate-200 dark:bg-slate-700 border-l border-dashed border-indigo-300 dark:border-indigo-600"></div>
                   <div className="flex flex-col items-center shrink-0 w-12 z-10">
                      <div className="h-12 w-12 rounded-full border-2 border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] animate-pulse">
                         <Brain className="h-6 w-6" />
                      </div>
                   </div>
                   <div className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl p-[1px] shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform cursor-pointer" onClick={() => navigate('/student/oj')}>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 h-full relative overflow-hidden">
                         <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                            <Bot className="h-32 w-32 -mr-8 -mt-8" />
                         </div>
                         <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-3">
                               <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold font-mono shadow-sm">当前关卡</span>
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  专属复习靶场
                                  <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                  </span>
                               </h3>
                            </div>
                            <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                               去攻克 <Zap className="h-4 w-4" />
                            </span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 relative z-10">
                            AI 已根据你的课中疑问，自动为你生成了 <strong className="text-indigo-600 dark:text-indigo-400">2道定制练习题</strong>。重点攻克“状态压缩”知识点。
                         </p>
                      </div>
                   </div>
                </div>

                {/* Node 4: Kruskal随堂互动探索 */}
                <div className="flex gap-6 relative pt-2">
                   <div className="absolute top-8 left-6 w-0.5 h-16 bg-slate-200 dark:bg-slate-700 border-l border-dashed border-purple-300 dark:border-purple-600"></div>
                   <div className="flex flex-col items-center shrink-0 w-12 z-10">
                      <div className="h-12 w-12 rounded-full border-2 border-purple-500 bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse">
                         <Sparkles className="h-6 w-6" />
                      </div>
                   </div>
                   <div className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-[1px] shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-transform cursor-pointer" onClick={() => navigate('/student/kruskal')}>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 h-full relative overflow-hidden">
                         <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-3">
                               <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white text-xs font-bold font-mono shadow-sm">特别推荐</span>
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  Kruskal 算法动态实验
                               </h3>
                            </div>
                            <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                               去探索 <ArrowRight className="h-4 w-4" />
                            </span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 relative z-10">
                            沉浸式的最小生成树探索（基于全局贪心）。在图形化界面拖拽连线，<strong className="text-purple-600 dark:text-purple-400">实时 AI 助教诊断</strong>你的每一步选择。
                         </p>
                      </div>
                   </div>
                </div>

                {/* Node 5: Prim随堂互动探索 */}
                <div className="flex gap-6 relative pt-2">
                   <div className="absolute top-8 left-6 w-0.5 h-16 bg-slate-200 dark:bg-slate-700 border-l border-dashed border-emerald-300 dark:border-emerald-600"></div>
                   <div className="flex flex-col items-center shrink-0 w-12 z-10">
                      <div className="h-12 w-12 rounded-full border-2 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
                         <Network className="h-6 w-6" />
                      </div>
                   </div>
                   <div className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-[1px] shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform cursor-pointer" onClick={() => navigate('/student/prim')}>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 h-full relative overflow-hidden">
                         <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-3">
                               <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold font-mono shadow-sm">关联推荐</span>
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  Prim 算法动态实验
                               </h3>
                            </div>
                            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                               去探索 <ArrowRight className="h-4 w-4" />
                            </span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 relative z-10">
                            沉浸式的最小生成树探索（基于节点延展）。掌握如何从单点出发，稳扎稳打扩张连通网。
                         </p>
                      </div>
                   </div>
                </div>

                {/* Node 6: 课堂词云互动 */}
                <div className="flex gap-6 relative pt-2">
                   <div className="flex flex-col items-center shrink-0 w-12 z-10">
                      <div className="h-12 w-12 rounded-full border-2 border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse">
                         <Cloud className="h-6 w-6" />
                      </div>
                   </div>
                   <div className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-[1px] shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-transform cursor-pointer" onClick={() => navigate('/student/wordcloud')}>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 h-full relative overflow-hidden">
                         <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex items-center gap-3">
                               <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-white text-xs font-bold font-mono shadow-sm">全班互动</span>
                               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  课堂实时词云
                               </h3>
                            </div>
                            <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                               去发言 <ArrowRight className="h-4 w-4" />
                            </span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 relative z-10">
                            分享你这节课印象最深的算法关键词，实时汇入班级知识星海！
                         </p>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        </div>

        {/* 右侧：知识画像雷达与统计 */}
        <div className="xl:col-span-4 flex flex-col space-y-6">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-fuchsia-500" />
              全息学情画像
           </h2>
           
           {/* 雷达图卡片 */}
           <div className="glass default-dark-card border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center items-center relative overflow-hidden">
              {/* Context / Lore label */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                 <ShieldAlert className="h-4 w-4 text-fuchsia-500" />
                 <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">AI DOMAIN ANALYSIS</span>
              </div>
              
              <div className="h-[280px] w-full mt-4 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(156, 163, 175, 0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-slate-600 dark:text-slate-300 font-medium" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="能力值"
                      dataKey="A"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="#8b5cf6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 text-sm">
                 <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    AI 诊断点评
                 </h4>
                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    你的<span className="text-fuchsia-600 dark:text-fuchsia-400 font-semibold px-1">数据结构</span>与<span className="text-fuchsia-600 dark:text-fuchsia-400 font-semibold px-1">代码规范</span>基础扎实。但在应对复杂题型时，<span className="text-rose-500 font-semibold px-1">系统设计</span>方面的短板会限制你的解题效率。当前推荐专注于复习靶场，提升设计思维。
                 </p>
              </div>
           </div>

           {/* 核心指标统计 */}
           <div className="grid grid-cols-2 gap-4">
              <div className="glass default-dark-card border border-slate-200 dark:border-slate-800 p-4 shrink-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">代码平均通过率</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">85<span className="text-lg">%</span></span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-100 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">↑ 5%</span>
                 </div>
              </div>
              <div className="glass default-dark-card border border-slate-200 dark:border-slate-800 p-4 shrink-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">累计问答交互</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">128<span className="text-lg">次</span></span>
                 </div>
              </div>
              <div className="glass default-dark-card border border-slate-200 dark:border-slate-800 p-4 shrink-0 col-span-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group" onClick={() => navigate('/student/oj')}>
                 <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">本周错题池收录</p>
                    <div className="text-xl font-bold text-rose-500 dark:text-rose-400">
                       <span className="font-mono">4</span> 题亟待攻克
                    </div>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <Terminal className="h-5 w-5" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
