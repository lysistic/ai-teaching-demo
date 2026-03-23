import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  HelpCircle, PlayCircle, ShieldAlert,
  Terminal, BookMarked, BrainCircuit, Zap,
  CheckCircle2, MessageSquareWarning, Sparkles, Loader2
} from 'lucide-react'
import { cn } from '../lib/cn'
import { askTeachingAssistant } from '../lib/openaiChat'
import { Markdown } from '../components/Markdown'

type ScenarioKey = '课前预习' | '课堂讲解' | '课后巩固' | '实验设计'

export function StudentQA() {
  const [scenario, setScenario] = useState<ScenarioKey>('课前预习')

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 统一头部：控制四个场景的切换 */}
      <div className="glass border-b border-slate-200 dark:border-white/10 shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
              <Bot className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                全链路场景互动
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  Data Flow 连贯加载中
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">目前你的学情档案已经跨环节打通，AI将根据历史记录动态调整反馈。</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
            {(['课前预习', '课堂讲解', '课后巩固', '实验设计'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all',
                  scenario === s 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 场景分发容器 */}
      <div className="flex-1 overflow-auto app-scrollbar px-6 pb-6">
        {scenario === '课前预习' && <PreClassView onNext={() => setScenario('课堂讲解')} />}
        {scenario === '课堂讲解' && <InClassView />}
        {scenario === '课后巩固' && <PostClassView onNext={() => setScenario('实验设计')} />}
        {scenario === '实验设计' && <LabView />}
      </div>
    </div>
  )
}

// ==========================================
// 1. 课前预习视图：类似 Duolingo 的对话与探究卡片
// ==========================================
function PreClassView({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <BookMarked className="h-6 w-6 text-fuchsia-500" />
          课前摸底与唤醒
        </h2>
        <p className="text-slate-500 dark:text-slate-400">结合你上周的历史错题，AI为你准备了针对性的前测小思考。</p>
      </div>

      {step === 0 ? (
        <div className="glass default-dark-card p-8 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <BrainCircuit className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold mb-4">灵魂拷问：如果会议室很抢手，你会怎么安排？</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            假设你是一个调度员，今天有10个会议要开，你要让尽可能多的会议开成。<br/>
            你有一个经验法则："优先安排那些<strong>结束得最早</strong>的会议"。你觉得这合理吗？
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <button onClick={() => setStep(1)} className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 font-bold transition-all text-left">
              🤔 合理，结束早就不占后面时间
            </button>
            <button onClick={() => setStep(1)} className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 font-bold transition-all text-left">
              🤨 不一定，万一它开始得很晚呢
            </button>
          </div>
        </div>
      ) : (
        <div className="glass default-dark-card p-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-6">
            <Bot className="h-6 w-6 text-indigo-500 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">AI 课前点评</h4>
              <p className="text-indigo-800 dark:text-indigo-300 text-sm leading-relaxed mb-3">
                你的直觉很好！"结束时间早"确实是给后续保留空间的关键。但你的第二个顾虑也很敏锐——这就引出了我们一会儿要在课堂上证明的：<strong>区间调度的贪心算法模型</strong>。
              </p>
              <div className="bg-white/50 dark:bg-slate-900/50 rounded p-3 text-xs border border-indigo-200/50 dark:border-indigo-500/30">
                <span className="font-bold">🏷️ 生成课堂锚点：</span>请带着"到底选开始早还是结束早"的疑问去听讲，我已经帮你标记到了听课提纲里。
              </div>
            </div>
          </div>
          <button onClick={onNext} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors">
            带着疑问进入课堂 👉
          </button>
        </div>
      )}
    </div>
  )
}

// ==========================================
// 2. 课堂讲解视图：伴随式同步看板
// ==========================================
function InClassView() {
  const [chat, setChat] = useState<{role: 'user'|'ai', text: string}[]>([
    {role: 'user', text: '我不理解，为什么"持续时间最短"不是最优策略？短会议不应该能塞更多吗？'},
    {role: 'ai', text: '观察得很好！你看左边PPT上的“反例2”：如果一个很短的会议恰好卡在两个更长但互不重叠的会议中间，选了它反而会损失两个能安排的会议。要我给你画个时间轴对比图吗？'}
  ])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

  const handleSend = async () => {
    if (!inputVal.trim() || loading) return
    const userMsg = inputVal
    setChat(prev => [...prev, {role: 'user', text: userMsg}])
    setInputVal('')
    setLoading(true)
    
    try {
      // 通过真实的 API 调用大模型
      let ctx = "我们正在学习区间调度的贪心算法模型。左边的代码演板展示了按'结束时间最早'排序来进行选择。\n"
      // 为了省 token 我们只携带最近几轮上下文
      const history = chat.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n')
      const prompt = `[Context Background: ${ctx}]\n\n[Chat History]\n${history}\nStudent: ${userMsg}\n\n请作为AI助教使用中文给予简短友好的回应（控制在100字以内），如果涉及到代码可以直接指出左边黑板的代码逻辑。`
      
      const reply = await askTeachingAssistant(prompt)
      setChat(prev => [...prev, {role: 'ai', text: reply}])
    } catch (e) {
      setChat(prev => [...prev, {role: 'ai', text: '网络有点小罢工，一会儿再试一下吧。'}])
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px] animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex-1 glass default-dark-card flex flex-col p-4">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <h3 className="font-bold flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-indigo-500" />
            AI 动态知识点推演引擎
          </h3>
          <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div> Live
          </span>
        </div>
        <div className="flex-1 bg-slate-900 rounded-xl flex items-stretch justify-center relative overflow-hidden shadow-inner border border-slate-800/80">
          {/* 代码/伪代码区域 */}
          <div className="w-1/3 border-r border-slate-800 bg-[#0f172a] p-4 flex flex-col pt-8">
            <div className="flex items-center gap-2 mb-4 opacity-50">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <pre className="text-xs font-mono text-slate-300 leading-relaxed">
              <span className="text-purple-400">function</span> <span className="text-blue-400">schedule</span>(tasks) {'{\n'}
              {'  '}<span className="text-slate-500">// 1. 按结束时间排序</span>{'\n'}
              {'  '}tasks.sort((a,b) {'=>'} a.end - b.end){'\n\n'}
              {'  '}<span className="text-slate-500">// 2. 选择兼容任务</span>{'\n'}
              {'  '}<span className="text-purple-400">let</span> count = 0, lastEnd = -1{'\n'}
              {'  '}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> t <span className="text-purple-400">of</span> tasks) {'{\n'}
              <span className="bg-blue-500/20 px-1 py-0.5 rounded ml-2">{'    '}<span className="text-purple-400">if</span> (t.start {'>='} lastEnd) {'{'}</span>{'\n'}
              {'      '}count++{'\n'}
              {'      '}lastEnd = t.end{'\n'}
              <span className="bg-blue-500/20 px-1 py-0.5 rounded ml-2">{'    }'}</span>{'\n'}
              {'  }'}{'\n'}
              {'  '}<span className="text-purple-400">return</span> count{'\n'}
              {'}'}
            </pre>
          </div>

          {/* 实时动画演板区域 */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
             <h2 className="text-xl font-bold text-white tracking-widest mb-10 flex items-center gap-3">
                <BrainCircuit className="h-6 w-6 text-fuchsia-400" />
                算法推演：为什么选最早结束？
             </h2>
             <div className="w-full max-w-md relative space-y-6">
                {/* 时间轴刻度 */}
                <div className="absolute top-0 bottom-0 left-8 w-px bg-slate-700"></div>
                
                {/* Task A */}
                <div className="relative flex items-center gap-4 group">
                   <div className="w-6 text-right text-xs text-slate-500 font-mono">0-3</div>
                   <div className="h-10 flex-1 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center px-4 relative overflow-hidden transition-all group-hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                      <span className="text-emerald-200 text-sm font-bold flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4" /> 任务 A (选我)
                      </span>
                   </div>
                </div>

                {/* Task B */}
                <div className="relative flex items-center gap-4 ml-12 opacity-80 hover:opacity-100 transition-opacity">
                   <div className="w-6 text-right text-xs text-slate-500 font-mono">2-4</div>
                   <div className="h-10 w-48 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center px-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/50"></div>
                      <span className="text-rose-300 text-sm flex items-center gap-2 line-through decoration-rose-500/50">
                         任务 B (持续短)
                      </span>
                   </div>
                   <span className="absolute -left-6 bg-slate-800 border border-rose-500/50 text-rose-400 text-[10px] px-1.5 rounded flex items-center gap-1 shadow-lg z-10"><MessageSquareWarning className="h-3 w-3"/>冲突</span>
                </div>

                {/* Task C */}
                <div className="relative flex items-center gap-4 ml-24 group">
                   <div className="w-6 text-right text-xs text-slate-500 font-mono">4-7</div>
                   <div className="h-10 w-56 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center px-4 relative overflow-hidden transition-all group-hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                      <span className="text-emerald-200 text-sm font-bold flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4" /> 任务 C (保留空间)
                      </span>
                   </div>
                </div>
             </div>

             <div className="mt-12 bg-slate-800/80 border border-indigo-500/30 text-indigo-200 text-sm px-6 py-3 rounded-2xl flex items-start gap-3 backdrop-blur-sm max-w-lg">
                <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                   <strong>AI Insight：</strong>如果我们贪图任务B短暂的耗时，它会同时卡掉任务A和任务C，导致最终只能容纳1个任务，而不是2个。这就是为未来妥协的智慧。
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] flex flex-col gap-4">
        <div className="glass default-dark-card flex-1 flex flex-col p-4 min-h-0">
           <h3 className="font-bold flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
            <Bot className="h-5 w-5 text-amber-500" />
            伴学专属 Copilot
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 app-scrollbar pr-2">
            {chat.map((m, i) => (
              <div key={i} className={cn("p-3 rounded-xl text-sm", m.role === 'user' ? "bg-slate-100 dark:bg-slate-800 ml-8 text-slate-800 dark:text-slate-200" : "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mr-8 text-indigo-900 dark:text-indigo-200")}>
                <div className="font-bold mb-1 opacity-50 text-[10px] uppercase tracking-wider">{m.role === 'user' ? 'You' : 'AI Assistant'}</div>
                {m.role === 'user' ? m.text : <Markdown>{m.text}</Markdown>}
              </div>
            ))}
            {loading && (
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mr-8 text-indigo-900 dark:text-indigo-200 p-3 rounded-xl text-sm w-fit flex items-center gap-2">
                 <Loader2 className="w-4 h-4 animate-spin" /> 正在思考...
              </div>
            )}
            <div ref={chatBottomRef}></div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10 flex gap-2">
             <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} disabled={loading} placeholder="听不懂这里？实时问 AI..." className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 disabled:opacity-50" />
             <button onClick={handleSend} disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-colors">→</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. 课后巩固视图：诊断面板与个性化复习靶场
// ==========================================
function PostClassView({ onNext }: { onNext: () => void }) {
  
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass default-dark-card p-6 md:col-span-2">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
              <ShieldAlert className="h-6 w-6 text-rose-500" />
              课后智能诊断报告
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
               在刚刚的课堂中，AI记录了你提问的<span className="font-bold text-rose-500 dark:text-rose-400 px-1">2次错误理解</span>。目前你的模型掌握度为75%。<br/>需要巩固的靶点区域：<strong>"为什么最短任务策略会在极端重叠数据下失效"</strong>。
            </p>
            <div className="space-y-3">
               <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/20 text-rose-900 dark:text-rose-200 text-sm">
                  🎯 <strong>薄弱点追踪：</strong> 课中你提出选择工期最短的任务。
               </div>
               <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-sm">
                  ✅ <strong>优势点保留：</strong> 对于反例的构造逻辑，你在预习时掌握得很扎实。
               </div>
            </div>
         </div>
         
         <div className="glass default-dark-card p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500 flex items-center justify-center mb-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
               +2
            </div>
            <h4 className="font-bold mb-2">生成专属靶场</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">已为你动态抽出2道填空与反例构造题。</p>
            <button onClick={onNext} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-slate-800 hover:text-white dark:hover:bg-indigo-500 text-white font-bold transition-colors">
               立刻开始攻克
            </button>
         </div>
      </div>
    </div>
  )
}

// ==========================================
// 4. 实验设计视图：带有线索剥夺的上下文IDE
// ==========================================
function LabView() {
  const [showPrompt, setShowPrompt] = useState(true)
  const [code, setCode] = useState(`function maxCompatibleTasks(tasks) {
  // AI 提示：第一步是对 tasks 排序。记不记得按照哪个字段排序？
  // 请在此写下你的逻辑...
  
  
  
  return count;
}`)

  const handleHint = () => {
    setCode(`function maxCompatibleTasks(tasks) {
  // AI 提示：第一步是对 tasks 排序。记不记得按照哪个字段排序？
  // 1. tasks.sort((a, b) => a.end - b.end); // 按照结束时间升序
  // 2. 遍历并记录上一个任务的结束时间
  // 请继续完善...
  
  
  
  return count;
}`)
    setShowPrompt(false)
  }

  const handleRun = () => {
    alert("自动评测提交成功！AI 正在分析你的代码...")
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px] animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="w-full lg:w-[350px] flex flex-col gap-4">
        <div className="glass default-dark-card flex-1 flex flex-col p-5 min-h-0">
          <h3 className="font-bold text-lg border-b border-slate-200 dark:border-white/10 pb-4 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" />
            实验任务
          </h3>
          <div className="flex-1 overflow-y-auto app-scrollbar pr-2 prose prose-sm dark:prose-invert">
            <p><strong>实战：</strong>请用代码完成贪心调度的核心逻辑。</p>
            <p>输入一个包含 <code>start</code> 和 <code>end</code> 的任务数组，返回最多能兼容的任务数量。</p>
            <hr className="my-4 border-slate-200 dark:border-slate-800" />
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-lg p-3 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold flex items-center gap-1 mb-1"><Bot className="h-3 w-3"/> 历史提醒：</span>
              AI探测到你在**课后巩固**中曾忽略了对数组深拷贝的问题，在此次编码中，请留意如何安全地进行原位排序操作。
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass default-dark-card flex-1 p-0 flex flex-col overflow-hidden relative group">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
          <span className="text-sm font-bold flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-500" /> 
            在线沙箱 (Lab Mode)
          </span>
          <button onClick={handleRun} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500/20">
             <PlayCircle className="h-3.5 w-3.5" /> 运行评测
          </button>
        </div>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 w-full bg-slate-900 text-slate-100 p-4 font-mono text-sm leading-relaxed outline-none resize-none"
          spellCheck="false"
        />
        {/* 提示剥夺浮层 */}
        {showPrompt && (
          <div className="absolute bottom-4 right-4 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl max-w-sm">
             <p className="text-xs text-slate-400 mb-2 font-mono flex items-center gap-2"><Zap className="h-3 w-3 text-amber-500"/> AI 代码陪伴向导</p>
             <p className="text-sm text-white font-medium">看你一直没动笔，需要我给你提供第一行的伪代码思路吗？</p>
             <div className="mt-3 flex gap-2">
                <button onClick={handleHint} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition-colors">给我思路</button>
                <button onClick={() => setShowPrompt(false)} className="px-3 py-1 border border-slate-600 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors">让我再想想</button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
