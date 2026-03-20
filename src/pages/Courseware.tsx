import { useState } from 'react'
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  Folder, 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen,
  File,
  Video,
  Archive,
  Trash2,
  Star,
  Share2,
  MoreVertical,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { cn } from '../lib/cn'

// 模拟课件数据
const mockCoursewares = [
  {
    id: 1,
    title: '算法导论 - 第一章：算法基础',
    description: '介绍算法的基本概念、时间复杂度和空间复杂度分析，包含经典算法示例。',
    type: 'pdf',
    size: '2.4 MB',
    uploader: '张老师',
    uploadTime: '2026-03-15 14:30',
    views: 156,
    downloads: 89,
    tags: ['算法', '基础', '计算机科学'],
    starred: true,
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 2,
    title: '数据结构与算法 - 二叉树专题',
    description: '详细讲解二叉树的各种操作，包括遍历、查找、插入、删除等算法实现。',
    type: 'ppt',
    size: '5.7 MB',
    uploader: '李老师',
    uploadTime: '2026-03-14 10:15',
    views: 234,
    downloads: 145,
    tags: ['数据结构', '二叉树', '算法'],
    starred: true,
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: 3,
    title: '动态规划算法精讲',
    description: '从基础到进阶，全面讲解动态规划算法的原理和应用场景。',
    type: 'pdf',
    size: '3.2 MB',
    uploader: '王老师',
    uploadTime: '2026-03-13 16:45',
    views: 189,
    downloads: 112,
    tags: ['动态规划', '算法', '优化'],
    starred: false,
    color: 'from-green-500/20 to-emerald-500/20'
  },
  {
    id: 4,
    title: 'Python编程入门视频教程',
    description: '适合初学者的Python编程视频教程，包含基础语法和实战项目。',
    type: 'video',
    size: '125 MB',
    uploader: '陈老师',
    uploadTime: '2026-03-12 09:20',
    views: 321,
    downloads: 198,
    tags: ['Python', '编程', '视频教程'],
    starred: true,
    color: 'from-red-500/20 to-orange-500/20'
  },
  {
    id: 5,
    title: '机器学习基础课件',
    description: '机器学习的基本概念、常用算法和实际应用案例。',
    type: 'pdf',
    size: '4.8 MB',
    uploader: '赵老师',
    uploadTime: '2026-03-11 11:30',
    views: 278,
    downloads: 167,
    tags: ['机器学习', '人工智能', '数据科学'],
    starred: false,
    color: 'from-yellow-500/20 to-amber-500/20'
  },
  {
    id: 6,
    title: 'Web前端开发实战',
    description: '现代Web前端开发技术栈，包含React、Vue、TypeScript等。',
    type: 'zip',
    size: '18.5 MB',
    uploader: '孙老师',
    uploadTime: '2026-03-10 15:40',
    views: 198,
    downloads: 134,
    tags: ['前端', 'Web开发', 'React'],
    starred: false,
    color: 'from-indigo-500/20 to-blue-500/20'
  },
  {
    id: 7,
    title: '数据库系统原理',
    description: '数据库系统的基本原理、SQL语言和数据库设计规范。',
    type: 'pdf',
    size: '3.6 MB',
    uploader: '周老师',
    uploadTime: '2026-03-09 13:25',
    views: 145,
    downloads: 98,
    tags: ['数据库', 'SQL', '系统设计'],
    starred: true,
    color: 'from-pink-500/20 to-rose-500/20'
  },
  {
    id: 8,
    title: '计算机网络实验指导',
    description: '计算机网络实验的详细指导手册和实验报告模板。',
    type: 'doc',
    size: '1.8 MB',
    uploader: '吴老师',
    uploadTime: '2026-03-08 17:10',
    views: 112,
    downloads: 76,
    tags: ['网络', '实验', '指导'],
    starred: false,
    color: 'from-teal-500/20 to-cyan-500/20'
  }
]

// 文件类型图标映射
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="h-6 w-6 text-red-400" />
    case 'ppt': return <FileText className="h-6 w-6 text-orange-400" />
    case 'doc': return <FileText className="h-6 w-6 text-blue-400" />
    case 'video': return <Video className="h-6 w-6 text-purple-400" />
    case 'zip': return <Archive className="h-6 w-6 text-yellow-400" />
    default: return <File className="h-6 w-6 text-gray-400" />
  }
}

// 文件类型颜色
const getFileTypeColor = (type: string) => {
  switch (type) {
    case 'pdf': return 'text-red-400'
    case 'ppt': return 'text-orange-400'
    case 'doc': return 'text-blue-400'
    case 'video': return 'text-purple-400'
    case 'zip': return 'text-yellow-400'
    default: return 'text-gray-400'
  }
}

export function Courseware() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isTeacherMode, setIsTeacherMode] = useState(true) // 默认教师模式

  // 过滤课件
  const filteredCoursewares = mockCoursewares.filter(courseware => {
    const matchesSearch = courseware.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         courseware.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         courseware.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'all' || courseware.type === selectedType
    return matchesSearch && matchesType
  })

  // 模拟上传文件
  const handleUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploading(false)
            setUploadModalOpen(false)
            setUploadProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // 切换收藏状态
  const toggleStar = (id: number) => {
    // 在实际应用中，这里会调用API更新收藏状态
    console.log('Toggle star for courseware:', id)
  }

  // 获取文件类型列表
  const fileTypes = ['all', ...new Set(mockCoursewares.map(c => c.type))]

  return (
    <div className="p-6 space-y-6">
      {/* 顶部标题和统计 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white/90 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-cyan-300" />
            课件资源中心
          </h1>
          <p className="text-slate-500 dark:text-white/60 mt-2">
            {isTeacherMode ? '上传和管理教学课件，学生可在线查看和下载' : '查看和下载老师上传的课件资源'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 模式切换 */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setIsTeacherMode(true)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isTeacherMode 
                  ? 'bg-cyan-500/20 text-cyan-300' 
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:text-white/90'
              )}
            >
              教师模式
            </button>
            <button
              onClick={() => setIsTeacherMode(false)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                !isTeacherMode 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:text-white/90'
              )}
            >
              学生模式
            </button>
          </div>

          {/* 上传按钮（仅教师模式显示） */}
          {isTeacherMode && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="btn btn-primary neon-border flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              上传课件
            </button>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass neon-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Folder className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-white/60">课件总数</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white/90">{mockCoursewares.length}</div>
            </div>
          </div>
        </div>
        <div className="glass neon-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-300" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-white/60">总浏览量</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white/90">
                {mockCoursewares.reduce((sum, c) => sum + c.views, 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="glass neon-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Download className="h-6 w-6 text-green-300" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-white/60">总下载量</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white/90">
                {mockCoursewares.reduce((sum, c) => sum + c.downloads, 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="glass neon-border p-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <User className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-white/60">上传教师</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white/90">
                {new Set(mockCoursewares.map(c => c.uploader)).size}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                placeholder="搜索课件标题、描述或标签..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white/90 placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 文件类型筛选 */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-white/40" />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white/90"
              >
                {fileTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? '全部类型' : type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* 视图切换 */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:text-white/90'
                )}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list' 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:text-white/90'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 课件展示 */}
      {viewMode === 'grid' ? (
        // 网格视图
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCoursewares.map(courseware => (
            <div 
              key={courseware.id}
              className="glass neon-border p-5 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${courseware.color} flex items-center justify-center`}>
                  {getFileIcon(courseware.type)}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStar(courseware.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5"
                  >
                    <Star className={cn(
                      'h-4 w-4',
                      courseware.starred ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'
                    )} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5">
                    <MoreVertical className="h-4 w-4 text-white/40" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white/90 mb-2 line-clamp-1" title={courseware.title}>
                {courseware.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-white/60 mb-4 line-clamp-2">
                {courseware.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {courseware.tags.map(tag => (
                  <span key={tag} className="chip text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{courseware.uploader}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{courseware.uploadTime.split(' ')[0]}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-white/40" />
                    <span className="text-xs text-slate-500 dark:text-white/60">{courseware.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3 text-white/40" />
                    <span className="text-xs text-slate-500 dark:text-white/60">{courseware.downloads}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10 text-xs">
                    <Eye className="h-3 w-3" />
                    查看
                  </button>
                  <button className="btn bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-xs">
                    <Download className="h-3 w-3" />
                    下载
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 列表视图
        <div className="glass neon-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70">
                <tr>
                  <th className="rounded-l-xl px-5 py-4">课件</th>
                  <th className="px-5 py-4">类型</th>
                  <th className="px-5 py-4">大小</th>
                  <th className="px-5 py-4">上传者</th>
                  <th className="px-5 py-4">上传时间</th>
                  <th className="px-5 py-4">浏览量</th>
                  <th className="px-5 py-4">下载量</th>
                  <th className="rounded-r-xl px-5 py-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoursewares.map(courseware => (
                  <tr key={courseware.id} className="border-b border-white/5 hover:bg-slate-50 dark:bg-white/5">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${courseware.color} flex items-center justify-center`}>
                          {getFileIcon(courseware.type)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white/90 truncate max-w-[200px]" title={courseware.title}>
                            {courseware.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-white/60 truncate max-w-[200px]">
                            {courseware.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('chip', getFileTypeColor(courseware.type))}>
                        {courseware.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-900 dark:text-white/90">{courseware.size}</td>
                    <td className="px-5 py-4 text-slate-900 dark:text-white/90">{courseware.uploader}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-white/60 text-sm">{courseware.uploadTime}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-white/40" />
                        <span className="text-slate-900 dark:text-white/90">{courseware.views}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3 text-white/40" />
                        <span className="text-slate-900 dark:text-white/90">{courseware.downloads}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5">
                          <Eye className="h-4 w-4 text-slate-500 dark:text-white/60" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5">
                          <Download className="h-4 w-4 text-slate-500 dark:text-white/60" />
                        </button>
                        <button 
                          onClick={() => toggleStar(courseware.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5"
                        >
                          <Star className={cn(
                            'h-4 w-4',
                            courseware.starred ? 'fill-yellow-400 text-yellow-400' : 'text-slate-500 dark:text-white/60'
                          )} />
                        </button>
                        {isTeacherMode && (
                          <button className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5">
                            <Trash2 className="h-4 w-4 text-red-400/60" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 上传模态框 */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass neon-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white/90 flex items-center gap-2">
                <Upload className="h-6 w-6 text-cyan-300" />
                上传课件
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 dark:bg-white/5"
              >
                <XCircle className="h-5 w-5 text-white/40" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white/90 mb-2">
                  课件标题
                </label>
                <input
                  type="text"
                  placeholder="请输入课件标题"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white/90 placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white/90 mb-2">
                  课件描述
                </label>
                <textarea
                  placeholder="请输入课件描述"
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white/90 placeholder-white/40 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white/90 mb-2">
                  选择文件
                </label>
                <div className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-8 text-center hover:border-cyan-500/30 transition-colors">
                  <Upload className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-white/60 mb-2">点击或拖拽文件到此处上传</p>
                  <p className="text-sm text-white/40">支持 PDF, PPT, DOC, 视频等格式</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white/90 mb-2">
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  placeholder="算法, 数据结构, 编程"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white/90 placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* 上传进度 */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-white/60">上传中...</span>
                    <span className="text-slate-900 dark:text-white/90">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 btn btn-primary neon-border"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      上传中...
                    </>
                  ) : (
                    '开始上传'
                  )}
                </button>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  disabled={uploading}
                  className="btn bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:bg-white/10"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {filteredCoursewares.length === 0 && (
        <div className="glass neon-border p-12 text-center">
          <FileText className="h-16 w-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white/90 mb-2">暂无课件</h3>
          <p className="text-slate-500 dark:text-white/60 mb-6">
            {searchQuery ? '没有找到匹配的课件，请尝试其他搜索词' : '还没有上传任何课件'}
          </p>
          {isTeacherMode && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="btn btn-primary neon-border"
            >
              <Upload className="h-4 w-4" />
              上传第一个课件
            </button>
          )}
        </div>
      )}

      {/* 底部信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass neon-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white/90">多格式支持</div>
              <div className="text-sm text-slate-500 dark:text-white/60">PDF, PPT, DOC, 视频等</div>
            </div>
          </div>
        </div>
        <div className="glass neon-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Cloud className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white/90">云端存储</div>
              <div className="text-sm text-slate-500 dark:text-white/60">安全可靠，随时访问</div>
            </div>
          </div>
        </div>
        <div className="glass neon-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white/90">一键分享</div>
              <div className="text-sm text-slate-500 dark:text-white/60">快速分享给班级学生</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 添加缺失的Cloud图标组件
const Cloud = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
  </svg>
)
