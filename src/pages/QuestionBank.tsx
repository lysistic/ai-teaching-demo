// src/pages/QuestionBank.tsx
import { useState, useMemo } from 'react'
import { 
  Database, Search, Plus, Filter, Bot, Sparkles, 
  Eye, Edit, Trash2, FileCode2, FlaskConical, CheckCircle2,
  ChevronRight, BookOpen
} from 'lucide-react'
import { cn } from '../lib/cn'
import { Thinking } from '../components/Thinking'
import { TypewriterCode } from '../components/TypewriterCode'

// --- Mock Data ---
type Difficulty = '简单' | '中等' | '困难'
type Topic = '贪心算法' | '动态规划' | '图论' | '搜索'

interface Question {
  id: string
  title: string
  topic: Topic
  difficulty: Difficulty
  usageCount: number
  description: string
}

const mockQuestions: Question[] = [
  { id: 'Q-1001', title: '会议室日程安排 (区间调度)', topic: '贪心算法', difficulty: '简单', usageCount: 156, description: '给定一系列会议的开始和结束时间，求最少需要多少个会议室，或者一个会议室最多能安排多少场会议。' },
  { id: 'Q-1002', title: '服务器漏洞修复任务调度', topic: '贪心算法', difficulty: '中等', usageCount: 89, description: '有N个漏洞修复任务，每个任务有截止时间和修复耗时。如何安排修复顺序以最小化逾期惩罚？' },
  { id: 'Q-1003', title: '0-1 背包问题 (资源分配)', topic: '动态规划', difficulty: '中等', usageCount: 234, description: '给定N个物品的重量和价值，以及一个容量为W的背包。求能装入背包的最大价值总和。' },
  { id: 'Q-1004', title: '最短数据传输路径', topic: '图论', difficulty: '中等', usageCount: 112, description: '在一个带权有向图中，寻找从源节点到目标节点的最短数据传输延迟路径。' },
  { id: 'Q-1005', title: '核心网络连通性 (最小生成树)', topic: '图论', difficulty: '困难', usageCount: 45, description: '给定一个无向连通图，代表网络节点和连接成本，求以最低总成本连接所有节点的方案。' },
  { id: 'Q-1006', title: '迷宫中的最优逃生路线', topic: '搜索', difficulty: '简单', usageCount: 320, description: '在一个 N*M 的网格迷宫中，包含障碍物。求从起点到终点的最短步数（BFS）。' },
]

export function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTopic, setFilterTopic] = useState<Topic | '全部'>('全部')
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | '全部'>('全部')
  
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(mockQuestions[0])
  const [aiState, setAiState] = useState<'idle' | 'generating' | 'done'>('idle')
  const [aiMode, setAiMode] = useState<'testcase' | 'variant'>('testcase')

  // Filter Logic
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(q => {
      const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchTopic = filterTopic === '全部' || q.topic === filterTopic
      const matchDiff = filterDifficulty === '全部' || q.difficulty === filterDifficulty
      return matchSearch && matchTopic && matchDiff
    })
  }, [searchQuery, filterTopic, filterDifficulty])

  // Helpers for styling
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case '简单': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
      case '中等': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
      case '困难': return 'text-rose-400 bg-rose-400/10 border-rose-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getTopicColor = (topic: Topic) => {
    switch (topic) {
      case '贪心算法': return 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20'
      case '动态规划': return 'text-purple-300 bg-purple-400/10 border-purple-400/20'
      case '图论': return 'text-blue-300 bg-blue-400/10 border-blue-400/20'
      case '搜索': return 'text-pink-300 bg-pink-400/10 border-pink-400/20'
      default: return 'text-gray-300 bg-gray-400/10 border-gray-400/20'
    }
  }

  // Simulate AI Generation
  const handleAiAction = (mode: 'testcase' | 'variant') => {
    setAiMode(mode)
    setAiState('generating')
    setTimeout(() => {
      setAiState('done')
    }, 2500)
  }

  const aiMockResult = aiMode === 'testcase' 
    ? `// AI 自动生成的边界测试用例 (JSON格式)\n{\n  "testCases": [\n    {\n      "input": "[[1,2],[2,3],[3,4],[1,3]]",\n      "expected": 1,\n      "description": "存在重叠区间，需剔除[1,3]以获得最大不相交子集。"\n    },\n    {\n      "input": "[[1,10],[2,3],[4,5],[6,7]]",\n      "expected": 3,\n      "description": "包含一个超长区间，验证贪心策略是否会被长区间误导。"\n    },\n    {\n      "input": "[]",\n      "expected": 0,\n      "description": "空数组边界情况测试。"\n    }\n  ]\n}`
    : `// AI 生成的相似题目变体：\n// 题目名称：《云平台虚拟机调度》\n\n【背景描述】\n某云平台收到 N 个虚拟机的运行请求。每个请求 i 包含启动时间 start[i] 和 结束时间 end[i]。为了节省服务器资源，你需要计算至少需要开启多少台物理服务器，才能满足所有请求（同一台服务器同一时刻只能运行一个虚拟机）。\n\n【考察点】\n此题从"求最大不相交子集"变体为"求最大重叠度"，要求学生转换贪心思路或使用差分数组/优先队列求解。\n\n【难度评估】中等（相比原题难度提升）`

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* 左侧：题库列表区 */}
      <div className="glass neon-border flex flex-col lg:col-span-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <Database className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <div className="text-lg font-bold text-white/90">题库管理</div>
              <div className="text-sm text-white/60">管理课程算法题目，支持 AI 辅助分析与扩编</div>
            </div>
          </div>
          <button className="btn btn-primary neon-border px-4 py-2">
            <Plus className="h-4 w-4" />
            新建题目
          </button>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 bg-black/20 px-6 py-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input 
              type="text"
              placeholder="搜索题目 ID 或名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-cyan-500/50 focus:bg-white/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/40" />
            <select 
              value={filterTopic} 
              onChange={(e) => setFilterTopic(e.target.value as any)}
              className="rounded-xl border border-white/10 bg-[#1a1c23] px-3 py-2 text-sm text-white/80 outline-none focus:border-cyan-500/50"
            >
              <option value="全部">所有考点</option>
              <option value="贪心算法">贪心算法</option>
              <option value="动态规划">动态规划</option>
              <option value="图论">图论</option>
              <option value="搜索">搜索</option>
            </select>
            <select 
              value={filterDifficulty} 
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="rounded-xl border border-white/10 bg-[#1a1c23] px-3 py-2 text-sm text-white/80 outline-none focus:border-cyan-500/50"
            >
              <option value="全部">所有难度</option>
              <option value="简单">简单</option>
              <option value="中等">中等</option>
              <option value="困难">困难</option>
            </select>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-6 py-4 font-medium">题目 ID / 名称</th>
                <th className="px-6 py-4 font-medium">考点标签</th>
                <th className="px-6 py-4 font-medium">难度</th>
                <th className="px-6 py-4 font-medium">引用次数</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">
                    未找到匹配的题目
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr 
                    key={q.id} 
                    onClick={() => { setActiveQuestion(q); setAiState('idle'); }}
                    className={cn(
                      "group cursor-pointer transition-all hover:bg-white/5",
                      activeQuestion?.id === q.id ? "bg-white/5 border-l-2 border-cyan-400" : "border-l-2 border-transparent"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white/90 group-hover:text-cyan-300 transition-colors">
                        {q.title}
                      </div>
                      <div className="mt-1 text-xs text-white/50">{q.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", getTopicColor(q.topic))}>
                        {q.topic}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", getDifficultyColor(q.difficulty))}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {q.usageCount} 次
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 transition-opacity group-hover:opacity-100">
                        <button className="rounded-lg p-2 hover:bg-white/10 text-white/70 hover:text-cyan-300 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-white/10 text-white/70 hover:text-blue-300 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 右侧：题目详情与 AI 助手 */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        {activeQuestion ? (
          <>
            {/* 题目详情卡片 */}
            <div className="glass neon-border p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <BookOpen className="h-24 w-24 text-cyan-300" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 mb-2">
                  <span>{activeQuestion.id}</span>
                  <span>•</span>
                  <span>{activeQuestion.topic}</span>
                </div>
                <h2 className="text-xl font-bold text-white/90 leading-tight mb-4">
                  {activeQuestion.title}
                </h2>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-white/70 mb-5">
                  {activeQuestion.description}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col items-center justify-center gap-1">
                    <span className="text-white/50 text-xs">难度评估</span>
                    <span className={cn("font-medium", getDifficultyColor(activeQuestion.difficulty).split(' ')[0])}>
                      {activeQuestion.difficulty}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col items-center justify-center gap-1">
                    <span className="text-white/50 text-xs">被引用次数</span>
                    <span className="font-medium text-white/90">{activeQuestion.usageCount} 次</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI 助手卡片 */}
            <div className="glass neon-border p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 blur-md" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black border border-purple-500/30">
                    <Bot className="h-4 w-4 text-purple-300" />
                  </div>
                </div>
                <h3 className="font-semibold text-white/90">AI 题库助手</h3>
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-1 gap-3 mb-5">
                <button 
                  onClick={() => handleAiAction('testcase')}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FlaskConical className="h-5 w-5 text-cyan-400" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-white/80 group-hover:text-white">生成强化测试用例</div>
                      <div className="text-xs text-white/40">基于边界条件自动生成测例</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-cyan-400" />
                </button>

                <button 
                  onClick={() => handleAiAction('variant')}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileCode2 className="h-5 w-5 text-purple-400" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-white/80 group-hover:text-white">生成同类变体题目</div>
                      <div className="text-xs text-white/40">用于防作弊或巩固练习</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-purple-400" />
                </button>
              </div>

              {/* AI 生成结果展示区 */}
              <div className="flex-1 mt-2">
                {aiState === 'idle' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-white/5 border-dashed rounded-xl bg-black/10">
                    <Sparkles className="h-6 w-6 text-white/20 mb-2" />
                    <p className="text-xs text-white/40">点击上方按钮，让 AI 协助完善题库</p>
                  </div>
                ) : aiState === 'generating' ? (
                  <Thinking label={aiMode === 'testcase' ? 'AI 正在分析题目边界条件...' : 'AI 正在构思业务场景变体...'} />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/40 p-1 flex flex-col h-full min-h-[200px]">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                      <span className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {aiMode === 'testcase' ? '测试用例已生成' : '变体题目已生成'}
                      </span>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300">
                        采用此结果
                      </button>
                    </div>
                    <div className="p-3 flex-1 overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-white/10">
                      <TypewriterCode 
                        code={aiMockResult} 
                        speedMs={10} 
                        className="!text-xs !text-white/70"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="glass neon-border h-full flex flex-col items-center justify-center p-12 text-center">
            <Database className="h-12 w-12 text-white/10 mb-4" />
            <h3 className="text-lg font-medium text-white/80 mb-2">未选择题目</h3>
            <p className="text-sm text-white/50">请在左侧列表中点击任意题目查看详情并使用 AI 助手功能。</p>
          </div>
        )}
      </div>
    </div>
  )
}