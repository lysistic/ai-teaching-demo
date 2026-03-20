import fs from 'fs';

let content = fs.readFileSync('src/pages/StudentOJ.tsx', 'utf8');

// The return statement starts at:
const returnIndex = content.indexOf('  return (');
const preReturn = content.substring(0, returnIndex);

// I will rebuild the return statement to create a beautiful side-by-side IDE layout.
const newLayout = `  return (
    <div className="flex flex-col xl:flex-row gap-4 h-[calc(100vh-120px)] min-h-[600px]">
      
      {/* 左侧：题目列表 */}
      <div className={cn(
        "glass default-dark-card flex flex-col shrink-0 transition-all duration-300",
        sidebarCollapsed ? "xl:w-20" : "xl:w-80"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <h2 className={cn("font-semibold text-slate-900 dark:text-white/90 flex items-center gap-2", sidebarCollapsed && "hidden")}>
            <FileCode className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            题目列表
          </h2>
          <FileCode className={cn("h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto", !sidebarCollapsed && "hidden")} />
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn p-1.5 bg-white/[0.03] dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto app-scrollbar p-3 space-y-2">
          {!sidebarCollapsed ? mockProblems.map(problem => (
            <button
              key={problem.id}
              onClick={() => setCurrentProblem(problem)}
              className={cn(
                'w-full text-left p-3 rounded-xl border transition-all duration-200',
                currentProblem.id === problem.id
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] glow'
                  : 'border-slate-200 dark:border-white/10 bg-white/[0.03] dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-white/20'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-slate-900 dark:text-white/90 truncate pr-2">{problem.title}</span>
                <span className={cn('chip text-[10px] px-2 py-0.5 shrink-0', getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {problem.tags.map(tag => (
                  <span key={tag} className="chip text-[10px] px-1.5 py-0.5 bg-white/[0.05] dark:bg-black/20">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          )) : (
            <div className="flex flex-col items-center gap-3 mt-4">
               {mockProblems.map((p, idx) => (
                  <div key={p.id} onClick={() => setCurrentProblem(p)} className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all border", currentProblem.id === p.id ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "bg-white/[0.03] dark:bg-white/5 border-transparent text-white/50 hover:bg-white/10")}>
                    {idx + 1}
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* 中右侧主操作区 */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 min-w-0">
        
        {/* 中间栏：题目描述 */}
        <div className="xl:w-[45%] flex flex-col min-w-0 gap-4">
          <div className="glass default-dark-card p-5 shrink-0">
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white/90 flex items-center gap-3">
                <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate">{currentProblem.title}</span>
                <span className={cn('chip shrink-0', getDifficultyColor(currentProblem.difficulty))}>
                  {currentProblem.difficulty}
                </span>
              </h1>
              <div className="flex gap-2">
                {currentProblem.tags.map(tag => (
                  <span key={tag} className="text-xs text-slate-500 dark:text-white/50">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass default-dark-card flex-1 flex flex-col p-5 min-h-0 overflow-y-auto app-scrollbar">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white/90 mb-4 shrink-0">📖 题目描述</h2>
            <div className="prose prose-sm prose-invert max-w-none flex-1">
              {formatDescription(currentProblem.description)}
            </div>
          </div>
        </div>

        {/* 右侧栏：代码编辑与运行区 */}
        <div className="xl:flex-1 flex flex-col min-w-0 gap-4">
          {/* 编辑器上方控制条 */}
          <div className="glass default-dark-card p-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/[0.03] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white/90 outline-none focus:border-cyan-500/50"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            
            <div className="flex items-center gap-2">
              <button className="btn px-3 py-1.5 text-xs bg-white/[0.03] dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10">
                <Save className="h-3.5 w-3.5" /> 保存
              </button>
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn px-3 py-1.5 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30"
              >
                {isRunning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                运行
              </button>
              <button 
                onClick={handleSubmitCode}
                disabled={isRunning}
                className="btn btn-primary px-3 py-1.5 text-xs"
              >
                {isRunning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                提交
              </button>
            </div>
          </div>

          {/* 编辑器本体 */}
          <div className="glass default-dark-card flex-1 flex flex-col p-4 min-h-0 relative group">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white/90 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                编辑器
              </h2>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full resize-none rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 focus:border-cyan-500/50 outline-none bg-slate-50 dark:bg-black/40 p-4 font-mono text-sm leading-relaxed text-slate-900 dark:text-white/90 transition-colors app-scrollbar flex"
              spellCheck="false"
            />
          </div>

          {/* 运行区面板（终端风格） */}
          <div className="glass default-dark-card h-[280px] shrink-0 flex flex-col p-4 min-h-0 relative">
             <div className="flex items-center justify-between mb-3 shrink-0 border-b border-slate-200 dark:border-white/10 pb-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white/90 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  控制台
                </h2>
                <div className="flex gap-4 text-xs font-semibold">
                   <button className="text-cyan-400 border-b-2 border-cyan-400 pb-2 -mb-[9px]">执行结果</button>
                   <button className="text-slate-500 dark:text-white/40 pb-2 -mb-[9px] hover:text-white/70 transition">测试用例 (自测)</button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto app-scrollbar p-2">
                {!submissionResult && !isRunning && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-white/30 space-y-3">
                      <Terminal className="h-8 w-8 opacity-20" />
                      <p className="text-sm">点击"运行"按钮测试你的代码</p>
                   </div>
                )}
                
                {isRunning && (
                   <div className="h-full flex flex-col items-center justify-center text-cyan-400 space-y-3">
                      <RefreshCw className="h-8 w-8 animate-spin opacity-50" />
                      <p className="text-sm animate-pulse">核心调度中，正在编译沙箱环境...</p>
                   </div>
                )}

                {submissionResult && !isRunning && (
                   <div className="space-y-4">
                      <div className={cn("text-lg font-bold", submissionResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400')}>
                         {submissionResult.status}
                      </div>
                      <div className="rounded-lg bg-black/30 p-3 border border-white/5 font-mono text-xs space-y-2">
                         <div className="flex justify-between">
                            <span className="text-white/50">执行详情</span>
                            <span className="text-white/80">{submissionResult.message}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-white/50">通过用例</span>
                            <span className="text-emerald-400">{submissionResult.passedTests} / {submissionResult.totalTests}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-white/50">运行时长</span>
                            <span className="text-amber-400">{submissionResult.runtime}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-white/50">内存消耗</span>
                            <span className="text-purple-400">{submissionResult.memory}</span>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>
{showAiAnalysis && aiFeedback && (
  <div className="fixed bottom-8 right-8 w-[400px] glass default-dark-card shadow-2xl p-6 z-50 animate-in slide-in-from-bottom-8">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2 text-fuchsia-400 font-bold">
        <Brain className="h-5 w-5" />
        AI 性能诊断
      </div>
      <button onClick={() => setShowAiAnalysis(false)} className="text-white/40 hover:text-white/80">✕</button>
    </div>
    <div className="prose prose-sm prose-invert mt-2 text-white/80 leading-relaxed">
      {aiFeedback}
    </div>
  </div>
)}
    </div>
  )
}
`

fs.writeFileSync('src/pages/StudentOJ.tsx', preReturn + newLayout);
