import { useState, useEffect } from 'react'
import { Brain, Code, Cpu, Terminal, CheckCircle, FileCode, Play, RefreshCw, Save, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '../lib/cn'

// 模拟编程题目数据
const mockProblems = [
  {
    id: 1,
    title: '两数之和',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
    description: `## 题目描述

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

## 示例

**示例 1：**
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

**示例 2：**
输入：nums = [3,2,4], target = 6
输出：[1,2]

**示例 3：**
输入：nums = [3,3], target = 6
输出：[0,1]

## 提示
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- 只会存在一个有效答案

## 进阶
你可以想出一个时间复杂度小于 O(n^2) 的算法吗？`,
    starterCode: `function twoSum(nums: number[], target: number): number[] {
    // 在这里编写你的代码
    // 提示：可以使用哈希表来优化时间复杂度
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}`,
    testCases: [
      { input: [[2,7,11,15], 9], output: [0,1] },
      { input: [[3,2,4], 6], output: [1,2] },
      { input: [[3,3], 6], output: [0,1] },
      { input: [[1,2,3,4,5], 9], output: [3,4] },
      { input: [[-1,-2,-3,-4,-5], -8], output: [2,4] }
    ]
  },
  {
    id: 2,
    title: '最长公共前缀',
    difficulty: '简单',
    tags: ['字符串'],
    description: `## 题目描述

编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

## 示例

**示例 1：**
输入：strs = ["flower","flow","flight"]
输出："fl"

**示例 2：**
输入：strs = ["dog","racecar","car"]
输出：""
解释：输入不存在公共前缀。

## 提示
- 1 <= strs.length <= 200
- 0 <= strs[i].length <= 200
- strs[i] 仅由小写英文字母组成`,
    starterCode: `function longestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) return "";
    
    // 以第一个字符串为基准
    let prefix = strs[0];
    
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }
    
    return prefix;
}`,
    testCases: [
      { input: [["flower","flow","flight"]], output: "fl" },
      { input: [["dog","racecar","car"]], output: "" },
      { input: [["interspecies","interstellar","interstate"]], output: "inters" },
      { input: [["apple","apricot","apartment"]], output: "ap" }
    ]
  },
  {
    id: 3,
    title: '有效的括号',
    difficulty: '简单',
    tags: ['栈', '字符串'],
    description: `## 题目描述

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：
1. 左括号必须用相同类型的右括号闭合。
2. 左括号必须以正确的顺序闭合。
3. 每个右括号都有一个对应的相同类型的左括号。

## 示例

**示例 1：**
输入：s = "()"
输出：true

**示例 2：**
输入：s = "()[]{}"
输出：true

**示例 3：**
输入：s = "(]"
输出：false

**示例 4：**
输入：s = "([)]"
输出：false

**示例 5：**
输入：s = "{[]}"
输出：true

## 提示
- 1 <= s.length <= 10^4
- s 仅由括号 '()[]{}' 组成`,
    starterCode: `function isValid(s: string): boolean {
    const stack: string[] = [];
    const map: { [key: string]: string } = {
        ')': '(',
        ']': '[',
        '}': '{'
    };
    
    for (let char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack.pop() !== map[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}`,
    testCases: [
      { input: ["()"], output: true },
      { input: ["()[]{}"], output: true },
      { input: ["(]"], output: false },
      { input: ["([)]"], output: false },
      { input: ["{[]}"], output: true }
    ]
  }
]

// 评测结果类型
type SubmissionResult = {
  status: string
  message: string
  passedTests: number
  totalTests: number
  runtime: string
  memory: string
}

// 格式化题目描述文本
const formatDescription = (text: string) => {
  return text.split('\n').map((line, index) => {
    if (line.startsWith('## ')) {
      return <h3 key={index} className="text-lg font-semibold text-white/90 mt-4 mb-2">{line.substring(3)}</h3>
    } else if (line.startsWith('**')) {
      const parts = line.split('**')
      return (
        <p key={index} className="my-2">
          {parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i} className="text-white/90">{part}</strong> : part
          )}
        </p>
      )
    } else if (line.trim() === '') {
      return <br key={index} />
    } else {
      return <p key={index} className="text-white/75 my-2">{line}</p>
    }
  })
}

export function StudentOJ() {
  const [currentProblem, setCurrentProblem] = useState(mockProblems[0])
  const [code, setCode] = useState(currentProblem.starterCode)
  const [language, setLanguage] = useState('typescript')
  const [isRunning, setIsRunning] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
  const [showAiAnalysis, setShowAiAnalysis] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<string>('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 当切换题目时重置代码
  useEffect(() => {
    setCode(currentProblem.starterCode)
    setSubmissionResult(null)
    setShowAiAnalysis(false)
  }, [currentProblem])

  // 模拟运行代码
  const handleRunCode = () => {
    setIsRunning(true)
    setSubmissionResult(null)
    setShowAiAnalysis(false)

    // 模拟API调用延迟
    setTimeout(() => {
      const passed = Math.floor(Math.random() * currentProblem.testCases.length) + 1
      const total = currentProblem.testCases.length
      const status = passed === total ? 'Accepted' : 'Wrong Answer'
      
      setSubmissionResult({
        status,
        message: status === 'Accepted' 
          ? '恭喜！所有测试用例都通过了。' 
          : `有 ${total - passed} 个测试用例未通过。`,
        passedTests: passed,
        totalTests: total,
        runtime: `${Math.random() * 10 + 1}ms`,
        memory: `${(Math.random() * 5 + 40).toFixed(1)}MB`
      })
      setIsRunning(false)
    }, 1500)
  }

  // 模拟提交代码
  const handleSubmitCode = () => {
    setIsRunning(true)
    setSubmissionResult(null)
    setShowAiAnalysis(false)

    // 模拟API调用延迟
    setTimeout(() => {
      const passed = Math.random() > 0.3 ? currentProblem.testCases.length : 0
      const total = currentProblem.testCases.length
      const status = passed === total ? 'Accepted' : 'Wrong Answer'
      
      setSubmissionResult({
        status,
        message: status === 'Accepted' 
          ? '提交成功！恭喜你解决了这个问题。' 
          : '提交失败，请检查你的代码逻辑。',
        passedTests: passed,
        totalTests: total,
        runtime: `${Math.random() * 10 + 1}ms`,
        memory: `${(Math.random() * 5 + 40).toFixed(1)}MB`
      })

      // 生成AI反馈
      if (status === 'Accepted') {
        setAiFeedback(`🎉 优秀！你的解法通过了所有测试用例。

💡 **代码亮点：**
- 时间复杂度：O(n)，空间复杂度：O(n)，这是最优解法
- 使用了哈希表来存储已访问过的数字，避免了双重循环
- 代码结构清晰，变量命名规范

📚 **学习建议：**
1. 可以尝试思考一下，如果数组已经排序，是否有更优的解法？
2. 考虑一下边界情况，比如空数组或只有一个元素的情况
3. 尝试用不同的数据结构（如Map）来实现相同的功能

🔍 **进阶挑战：**
- 如果要求返回所有可能的组合，而不是唯一解，你会如何修改代码？
- 如果数组非常大（超过10^6个元素），你的算法还能正常工作吗？`)
      } else {
        setAiFeedback(`🤔 你的代码没有通过所有测试用例。

🔍 **可能的问题：**
1. 边界条件处理不完整
2. 算法逻辑有误
3. 没有正确处理特殊情况

💡 **调试建议：**
1. 使用console.log输出中间结果，观察程序执行流程
2. 针对失败的测试用例，手动模拟执行过程
3. 检查数组越界、空指针等常见错误

📚 **学习资源：**
- 复习哈希表的基本操作
- 理解两数之和问题的经典解法
- 练习更多类似题目来巩固知识`)
      }

      setIsRunning(false)
    }, 2000)
  }

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case '简单': return 'text-green-400'
      case '中等': return 'text-yellow-400'
      case '困难': return 'text-red-400'
      default: return 'text-white/60'
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-4 space-y-4">
      {/* 顶部：题目列表和工具栏 */}
      <div className="flex space-x-4">
        {/* 题目列表 */}
        <div className="glass neon-border p-5 w-80 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
              <FileCode className="h-5 w-5 text-cyan-300" />
              题目列表
            </h2>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="btn bg-white/5 hover:bg-white/10"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="space-y-3 overflow-y-auto max-h-60">
              {mockProblems.map(problem => (
                <button
                  key={problem.id}
                  onClick={() => setCurrentProblem(problem)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border transition-all',
                    currentProblem.id === problem.id
                      ? 'border-cyan-500/50 bg-cyan-500/5 neon-border'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white/90">{problem.title}</span>
                        <span className={cn('chip text-xs', getDifficultyColor(problem.difficulty))}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {problem.tags.map(tag => (
                          <span key={tag} className="chip text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 工具栏和当前题目信息 */}
        <div className="flex-1 glass neon-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white/90 flex items-center gap-3">
                <Code className="h-6 w-6 text-cyan-300" />
                {currentProblem.title}
                <span className={cn('chip', getDifficultyColor(currentProblem.difficulty))}>
                  {currentProblem.difficulty}
                </span>
              </h1>
              <p className="text-white/60 mt-1">
                编写代码解决这个问题，点击运行测试你的解法
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 min-w-32"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
              <button className="btn bg-white/5 hover:bg-white/10">
                <Save className="h-4 w-4" />
                保存
              </button>
              <button 
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    运行中...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    运行代码
                  </>
                )}
              </button>
              <button 
                onClick={handleSubmitCode}
                disabled={isRunning}
                className="btn btn-primary neon-border"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    提交代码
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 当前题目信息 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-sm text-white/60">测试用例</div>
              <div className="text-lg font-semibold text-white/90">{currentProblem.testCases.length} 个</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-sm text-white/60">难度</div>
              <div className={cn('text-lg font-semibold', getDifficultyColor(currentProblem.difficulty))}>
                {currentProblem.difficulty}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <div className="text-sm text-white/60">标签</div>
              <div className="text-sm font-semibold text-white/90 truncate" title={currentProblem.tags.join(', ')}>
                {currentProblem.tags.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 中间：题目描述和测试用例 */}
      <div className="flex space-x-4 flex-1">
        {/* 题目描述 */}
        <div className="glass neon-border p-5 flex-1">
          <h2 className="text-lg font-semibold text-white/90 mb-4">📖 题目描述</h2>
          <div className="overflow-y-auto h-[calc(100%-2rem)]">
            <div className="prose prose-invert max-w-none">
              {formatDescription(currentProblem.description)}
            </div>
          </div>
        </div>

        {/* 测试用例 */}
        <div className="glass neon-border p-5 w-96 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white/90 mb-4">🧪 测试用例</h2>
          <div className="space-y-3 overflow-y-auto h-[calc(100%-2rem)]">
            {currentProblem.testCases.map((testCase, index) => (
              <div key={index} className="p-3 rounded-lg border border-white/10 bg-white/5">
                <div className="text-sm font-medium text-white/90 mb-2">用例 {index + 1}</div>
                <div className="text-xs text-white/60 mb-1">
                  <span className="text-white/40">输入:</span>
                  <div className="font-mono mt-1 p-2 bg-black/20 rounded overflow-x-auto">
                    {JSON.stringify(testCase.input)}
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  <span className="text-white/40">输出:</span>
                  <div className="font-mono mt-1 p-2 bg-black/20 rounded overflow-x-auto">
                    {JSON.stringify(testCase.output)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 代码编辑器 */}
      <div className="glass neon-border p-5 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-cyan-300" />
            代码编辑器
          </h2>
          <div className="text-sm text-white/40">
            {code.length} 字符
          </div>
        </div>
        <div className="relative h-[calc(100%-3rem)] min-h-[300px]">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="relative w-full h-full font-mono text-sm bg-black/30 border border-white/10 rounded-xl p-4 text-white/90 resize-none focus:outline-none focus:border-cyan-500/50"
            spellCheck="false"
          />
        </div>
      </div>

      {/* 运行结果 */}
      <div className="glass neon-border p-5">
        <h2 className="text-lg font-semibold text-white/90 mb-4">📊 运行结果</h2>
        
        {submissionResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {submissionResult.status === 'Accepted' ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <span className="text-red-400 text-2xl">✗</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white/90">
                    {submissionResult.status}
                  </h3>
                  <p className="text-sm text-white/60">{submissionResult.message}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white/90">
                  {submissionResult.passedTests}/{submissionResult.totalTests}
                </div>
                <div className="text-sm text-white/60">测试用例通过</div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-sm text-white/60 mb-1">运行时间</div>
                <div className="text-lg font-semibold text-white/90 truncate" title={submissionResult.runtime}>
                  {submissionResult.runtime}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-sm text-white/60 mb-1">内存使用</div>
                <div className="text-lg font-semibold text-white/90 truncate" title={submissionResult.memory}>
                  {submissionResult.memory}
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-sm text-white/60 mb-1">代码长度</div>
                <div className="text-lg font-semibold text-white/90">{code.length} 字符</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-sm text-white/60 mb-1">语言</div>
                <div className="text-lg font-semibold text-white/90 capitalize">{language}</div>
              </div>
            </div>

            {/* AI分析按钮 */}
            <button
              onClick={() => setShowAiAnalysis(!showAiAnalysis)}
              className="w-full p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-300" />
                  <span className="font-medium text-white/90">
                    {showAiAnalysis ? '隐藏AI分析' : '查看AI智能分析'}
                  </span>
                </div>
                <span className="chip">个性化反馈</span>
              </div>
            </button>

            {/* AI分析内容 */}
            {showAiAnalysis && aiFeedback && (
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="h-5 w-5 text-purple-300" />
                  <span className="font-semibold text-white/90">AI学习助手分析</span>
                </div>
                <div className="prose prose-invert max-w-none text-sm">
                  <div className="whitespace-pre-line text-white/75 overflow-y-auto max-h-40">
                    {aiFeedback}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <Terminal className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">点击"运行代码"按钮测试你的解法</p>
              <p className="text-sm text-white/40 mt-2">运行结果将显示在这里</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
