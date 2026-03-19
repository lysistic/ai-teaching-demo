import { useState, useRef, useEffect } from 'react'
import { 
  MessageSquare, 
  Send, 
  Bot, 
  ThumbsUp, 
  Bookmark, 
  Share2, 
  MoreVertical,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  Brain,
  Lightbulb,
  Filter,
  Search,
  Hash,
  Award,
  Crown,
  RefreshCw,
  Zap,
  Volume2
} from 'lucide-react'
import { cn } from '../lib/cn'

// 模拟讨论帖子数据
const mockPosts = [
  {
    id: 1,
    author: '陈浩然',
    avatar: 'CH',
    role: '学生',
    time: '2分钟前',
    content: '关于动态规划中的背包问题，有没有更直观的理解方式？我总是搞不清楚状态转移方程。',
    likes: 24,
    replies: 8,
    tags: ['算法', '动态规划', '背包问题'],
    isLiked: false,
    isBookmarked: false,
    isHot: true,
    aiResponse: '背包问题的核心是"选择"与"不选择"当前物品。你可以想象一个二维表格，行代表物品，列代表背包容量。状态转移方程 dp[i][j] = max(dp[i-1][j], dp[i-1][j-weight[i]] + value[i]) 实际上就是在比较：不拿当前物品 vs 拿当前物品。'
  },
  {
    id: 2,
    author: '李老师',
    avatar: 'LT',
    role: '教师',
    time: '15分钟前',
    content: '本周作业：实现一个快速排序算法，要求时间复杂度为O(n log n)，并分析其空间复杂度。提交截止时间：本周五23:59。',
    likes: 42,
    replies: 15,
    tags: ['作业', '排序算法', '快速排序'],
    isLiked: true,
    isBookmarked: true,
    isHot: true,
    aiResponse: null
  },
  {
    id: 3,
    author: '林雨桐',
    avatar: 'LY',
    role: '学生',
    time: '1小时前',
    content: '递归和迭代哪种方式在解决二叉树问题时更优？在实际项目中应该如何选择？',
    likes: 18,
    replies: 12,
    tags: ['数据结构', '二叉树', '递归'],
    isLiked: false,
    isBookmarked: false,
    isHot: false,
    aiResponse: '递归更简洁但可能有栈溢出风险，迭代更安全但代码复杂。对于二叉树：前序/中序/后序遍历用递归更直观；层序遍历用迭代（队列）更合适。实际项目中：深度优先用递归，广度优先用迭代。'
  },
  {
    id: 4,
    author: 'AI助教',
    avatar: 'AI',
    role: 'AI助教',
    time: '2小时前',
    content: '大家好！我是AI助教小智，专门解答算法和编程问题。今天推荐的学习主题：贪心算法的应用场景和证明技巧。有问题随时@我！',
    likes: 56,
    replies: 23,
    tags: ['AI助教', '学习建议', '贪心算法'],
    isLiked: true,
    isBookmarked: true,
    isHot: true,
    aiResponse: null
  },
  {
    id: 5,
    author: '王梓萱',
    avatar: 'WZ',
    role: '学生',
    time: '3小时前',
    content: '在LeetCode上刷了100题，感觉进步不明显，求高效刷题方法！',
    likes: 31,
    replies: 19,
    tags: ['刷题', '学习方法', 'LeetCode'],
    isLiked: false,
    isBookmarked: false,
    isHot: false,
    aiResponse: '建议：1. 按专题刷题（数组→链表→树→图→动态规划）2. 每道题至少做两遍 3. 总结模板和套路 4. 参加周赛锻炼实战能力 5. 定期复习错题。质量比数量更重要！'
  },
  {
    id: 6,
    author: '张老师',
    avatar: 'ZT',
    role: '教师',
    time: '5小时前',
    content: '下周三下午3点将举行算法竞赛模拟赛，欢迎同学们报名参加！前三名有额外学分奖励。',
    likes: 38,
    replies: 11,
    tags: ['竞赛', '模拟赛', '学分奖励'],
    isLiked: true,
    isBookmarked: false,
    isHot: true,
    aiResponse: null
  }
]

// 模拟热门话题
const hotTopics = [
  { id: 1, name: '动态规划', count: 42, trend: 'up' },
  { id: 2, name: '二叉树', count: 38, trend: 'up' },
  { id: 3, name: '排序算法', count: 35, trend: 'steady' },
  { id: 4, name: '图论', count: 28, trend: 'up' },
  { id: 5, name: '贪心算法', count: 25, trend: 'down' },
  { id: 6, name: '作业讨论', count: 22, trend: 'up' }
]

// 模拟活跃用户
const activeUsers = [
  { id: 1, name: '陈浩然', avatar: 'CH', posts: 24, replies: 56, isOnline: true },
  { id: 2, name: '林雨桐', avatar: 'LY', posts: 18, replies: 42, isOnline: true },
  { id: 3, name: 'AI助教', avatar: 'AI', posts: 156, replies: 389, isOnline: true },
  { id: 4, name: '王梓萱', avatar: 'WZ', posts: 12, replies: 31, isOnline: false },
  { id: 5, name: '张子墨', avatar: 'ZZ', posts: 8, replies: 19, isOnline: true }
]

export function Discussion() {
  const [posts, setPosts] = useState(mockPosts)
  const [newPost, setNewPost] = useState('')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [aiAssistantActive, setAiAssistantActive] = useState(true)
  const [aiThinking, setAiThinking] = useState(false)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [newPost])

  // 发布新帖子
  const handlePost = () => {
    if (!newPost.trim()) return

    const newPostObj = {
      id: posts.length + 1,
      author: '当前用户',
      avatar: 'ME',
      role: '学生',
      time: '刚刚',
      content: newPost,
      likes: 0,
      replies: 0,
      tags: ['新话题'],
      isLiked: false,
      isBookmarked: false,
      isHot: false,
      aiResponse: null
    }

    setPosts([newPostObj, ...posts])
    setNewPost('')
    
    // 如果有AI助教，自动生成回复
    if (aiAssistantActive) {
      setTimeout(() => {
        const aiReply = {
          id: posts.length + 1000,
          postId: newPostObj.id,
          author: 'AI助教',
          avatar: 'AI',
          role: 'AI助教',
          time: '刚刚',
          content: '感谢分享！这是一个很好的问题。作为AI助教，我可以帮你分析这个问题。从你的描述来看，这涉及到算法设计的关键概念。建议先明确问题的约束条件，然后选择合适的算法范式。',
          likes: 0,
          isLiked: false
        }
        // 在实际应用中，这里会调用AI API生成回复
        console.log('AI助教回复:', aiReply)
      }, 2000)
    }
  }

  // 点赞帖子
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
  }

  // 收藏帖子
  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  // 咨询AI助教
  const handleAskAI = (postId: number) => {
    setAiThinking(true)
    setSelectedPost(postId)
    
    // 模拟AI思考过程
    setTimeout(() => {
      const post = posts.find(p => p.id === postId)
      if (post && !post.aiResponse) {
        // 生成AI回复
        const aiResponse = `作为AI助教，我对"${post.content.substring(0, 50)}..."的分析如下：

💡 **核心要点：**
1. 这个问题涉及到算法设计的关键概念
2. 需要从多个角度考虑解决方案
3. 建议先理解问题本质，再选择合适算法

🔍 **解题思路：**
- 分析问题约束条件
- 确定算法复杂度要求
- 选择合适的算法范式
- 编写代码并测试

📚 **学习建议：**
建议参考相关教材和在线资源，加深理解。`

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, aiResponse }
            : p
        ))
      }
      setAiThinking(false)
    }, 1500)
  }

  // 过滤帖子
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTag = filterTag === null || post.tags.includes(filterTag)
    return matchesSearch && matchesTag
  })

  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case '教师': return 'text-cyan-300'
      case 'AI助教': return 'text-purple-300'
      case '学生': return 'text-green-300'
      default: return 'text-white/60'
    }
  }

  // 获取角色背景色
  const getRoleBgColor = (role: string) => {
    switch (role) {
      case '教师': return 'bg-cyan-500/10 border-cyan-500/30'
      case 'AI助教': return 'bg-purple-500/10 border-purple-500/30'
      case '学生': return 'bg-green-500/10 border-green-500/30'
      default: return 'bg-white/5 border-white/10'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 顶部标题和统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-cyan-300" />
            算法讨论区
          </h1>
          <p className="text-white/60 mt-2">
            与同学、老师、AI助教一起讨论算法问题，共同进步
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* AI助教开关 */}
          <div className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg border',
              aiAssistantActive 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' 
                : 'bg-white/5 border-white/10 text-white/60'
            )}>
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">AI助教</span>
            </div>
            <button
              onClick={() => setAiAssistantActive(!aiAssistantActive)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                aiAssistantActive ? 'bg-purple-500' : 'bg-white/10'
              )}
            >
              <span className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                aiAssistantActive ? 'translate-x-6' : 'translate-x-1'
              )} />
            </button>
          </div>

          {/* 统计信息 */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white/90">{posts.length}</div>
              <div className="text-xs text-white/60">讨论帖子</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white/90">
                {posts.reduce((sum, post) => sum + post.replies, 0)}
              </div>
              <div className="text-xs text-white/60">总回复</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white/90">
                {posts.filter(p => p.isHot).length}
              </div>
              <div className="text-xs text-white/60">热门话题</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：发布区和热门话题 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 发布新帖子 */}
          <div className="glass neon-border p-5">
            <h2 className="text-lg font-semibold text-white/90 mb-4">💬 发布新讨论</h2>
            <div className="space-y-4">
              <div>
                <textarea
                  ref={textareaRef}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="分享你的算法问题、学习心得或想法..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/40 focus:outline-none focus:border-cyan-500/50 resize-none min-h-[100px]"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">添加标签：</span>
                  {['算法', '作业', '求助', '分享'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setNewPost(prev => prev + ` #${tag}`)}
                      className="chip text-xs"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className={cn(
                    'btn flex items-center gap-2',
                    newPost.trim() ? 'btn-primary neon-border' : 'bg-white/5 text-white/40'
                  )}
                >
                  <Send className="h-4 w-4" />
                  发布
                </button>
              </div>
            </div>
          </div>

          {/* 热门话题 */}
          <div className="glass neon-border p-5">
            <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-300" />
              热门话题
            </h2>
            <div className="space-y-3">
              {hotTopics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setFilterTag(topic.name)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
                    filterTag === topic.name 
                      ? 'bg-cyan-500/10 border border-cyan-500/30' 
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-white/40" />
                    <span className="font-medium text-white/90">{topic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">{topic.count}</span>
                    {topic.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                    {topic.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 活跃用户 */}
          <div className="glass neon-border p-5">
            <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-300" />
              活跃用户
            </h2>
            <div className="space-y-3">
              {activeUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <span className="font-semibold text-white/90">{user.avatar}</span>
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-black/20" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white/90">{user.name}</div>
                      <div className="text-xs text-white/60">
                        {user.posts}帖 · {user.replies}回复
                      </div>
                    </div>
                  </div>
                  {user.name === 'AI助教' && (
                    <Crown className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI助教功能 */}
          <div className="glass neon-border p-5">
            <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-300" />
              AI助教功能
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <div className="text-left">
                  <div className="font-medium text-white/90">智能答疑</div>
                  <div className="text-xs text-white/60">24小时在线解答</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Zap className="h-5 w-5 text-cyan-400" />
                <div className="text-left">
                  <div className="font-medium text-white/90">学习建议</div>
                  <div className="text-xs text-white/60">个性化学习路径</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Volume2 className="h-5 w-5 text-green-400" />
                <div className="text-left">
                  <div className="font-medium text-white/90">语音交流</div>
                  <div className="text-xs text-white/60">支持语音提问</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：讨论帖子列表 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 搜索和筛选 */}
          <div className="glass neon-border p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索讨论内容、用户或标签..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-white/40" />
                  <select 
                    value={filterTag || 'all'}
                    onChange={(e) => setFilterTag(e.target.value === 'all' ? null : e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90"
                  >
                    <option value="all">全部话题</option>
                    {Array.from(new Set(posts.flatMap(p => p.tags))).map(tag => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    setFilterTag(null)
                    setSearchQuery('')
                  }}
                  className="btn bg-white/5 hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* 讨论帖子列表 */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="glass neon-border p-5 hover:scale-[1.005] transition-all duration-300">
                {/* 帖子头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center',
                        getRoleBgColor(post.role)
                      )}>
                        <span className="font-bold text-white/90">{post.avatar}</span>
                      </div>
                      {post.isHot && (
                        <div className="absolute -top-2 -right-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white/90">{post.author}</span>
                        <span className={cn('chip text-xs', getRoleColor(post.role))}>
                          {post.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="h-3 w-3" />
                        {post.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                      <ThumbsUp className={cn(
                        'h-4 w-4',
                        post.isLiked ? 'fill-cyan-400 text-cyan-400' : 'text-white/60'
                      )} />
                      <span className="text-sm text-white/90">{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => handleBookmark(post.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Bookmark className={cn(
                        'h-4 w-4',
                        post.isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-white/60'
                      )} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5">
                      <MoreVertical className="h-4 w-4 text-white/60" />
                    </button>
                  </div>
                </div>

                {/* 帖子内容 */}
                <div className="mb-4">
                  <p className="text-white/90 mb-3 whitespace-pre-line">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className="chip hover:bg-cyan-500/20 hover:border-cyan-500/30"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI助教回复 */}
                {post.aiResponse && (
                  <div className="mb-4 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="h-5 w-5 text-purple-300" />
                      <span className="font-semibold text-white/90">AI助教分析</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-sm">
                      <div className="whitespace-pre-line text-white/75">
                        {post.aiResponse}
                      </div>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white/90">
                      <MessageSquare className="h-4 w-4" />
                      {post.replies} 条回复
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white/90">
                      <Share2 className="h-4 w-4" />
                      分享
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {aiAssistantActive && !post.aiResponse && (
                      <button
                        onClick={() => handleAskAI(post.id)}
                        disabled={aiThinking && selectedPost === post.id}
                        className={cn(
                          'btn flex items-center gap-2',
                          aiThinking && selectedPost === post.id 
                            ? 'bg-purple-500/20' 
                            : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30'
                        )}
                      >
                        {aiThinking && selectedPost === post.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            思考中...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4" />
                            咨询AI助教
                          </>
                        )}
                      </button>
                    )}
                    
                    <button className="btn bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30">
                      <MessageSquare className="h-4 w-4" />
                      回复
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredPosts.length === 0 && (
            <div className="glass neon-border p-12 text-center">
              <MessageSquare className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/90 mb-2">暂无讨论</h3>
              <p className="text-white/60 mb-6">
                {searchQuery ? '没有找到匹配的讨论内容' : '还没有人发起讨论，快来发布第一个话题吧！'}
              </p>
              <button
                onClick={() => {
                  setFilterTag(null)
                  setSearchQuery('')
                  textareaRef.current?.focus()
                }}
                className="btn btn-primary neon-border"
              >
                <Send className="h-4 w-4" />
                发起讨论
              </button>
            </div>
          )}

          {/* 底部统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass neon-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <div className="font-semibold text-white/90">活跃讨论</div>
                  <div className="text-sm text-white/60">今日新增 {Math.floor(Math.random() * 10) + 5} 条</div>
                </div>
              </div>
            </div>
            <div className="glass neon-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <div className="font-semibold text-white/90">AI解答</div>
                  <div className="text-sm text-white/60">已解答 {Math.floor(Math.random() * 50) + 30} 个问题</div>
                </div>
              </div>
            </div>
            <div className="glass neon-border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <div className="font-semibold text-white/90">学习成就</div>
                  <div className="text-sm text-white/60">{Math.floor(Math.random() * 100) + 50} 个知识点掌握</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
