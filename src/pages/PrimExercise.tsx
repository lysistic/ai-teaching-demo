import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, RefreshCw, Network } from 'lucide-react';
import { cn } from '../lib/cn';
import { chatWithCodex } from '../lib/openaiChat';

type Node = {
  id: string;
  x: number;
  y: number;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  selected: boolean;
  error: boolean;
};

const initialNodes: Node[] = [
  { id: 'A', x: 200, y: 150 },
  { id: 'B', x: 500, y: 150 },
  { id: 'C', x: 650, y: 300 },
  { id: 'D', x: 500, y: 450 },
  { id: 'E', x: 200, y: 450 },
];

const initialEdges: Edge[] = [
  { id: 'A-E', source: 'A', target: 'E', weight: 1, selected: false, error: false },
  { id: 'A-B', source: 'A', target: 'B', weight: 2, selected: false, error: false },
  { id: 'E-D', source: 'E', target: 'D', weight: 2, selected: false, error: false },
  { id: 'C-D', source: 'C', target: 'D', weight: 3, selected: false, error: false },
  { id: 'B-C', source: 'B', target: 'C', weight: 4, selected: false, error: false },
  { id: 'B-D', source: 'B', target: 'D', weight: 5, selected: false, error: false },
  { id: 'A-D', source: 'A', target: 'D', weight: 6, selected: false, error: false },
];

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function PrimExercise() {
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['A']);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: '你好！我是你的算法助教。今天我们要练习 Prim（普里姆）最小生成树算法。算法从一个初始节点开始（我们已经为你默认点亮了节点 A），你的任务是每次从**已连接的节点集合**中，找到一条通向**未连接节点**的最小权重边并点击它，直到连通所有节点！'
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleEdgeClick = async (edgeId: string) => {
    if (isComplete || isTyping) return;
    
    const edgeIndex = edges.findIndex(e => e.id === edgeId);
    const edge = edges[edgeIndex];
    if (edge.selected) return; // Already selected
    
    const isSourceVisited = visitedNodes.includes(edge.source);
    const isTargetVisited = visitedNodes.includes(edge.target);
    
    let errorType = null;
    let minValidWeight = Infinity;
    const validEdges: string[] = [];

    // Find what SHOULD be the next valid minimum edge for Prim
    edges.forEach(e => {
      if (e.selected) return;
      const sVis = visitedNodes.includes(e.source);
      const tVis = visitedNodes.includes(e.target);
      // Valid if exactly one endpoint is in the visited set
      if ((sVis && !tVis) || (!sVis && tVis)) {
        if (e.weight < minValidWeight) {
          minValidWeight = e.weight;
          validEdges.length = 0;
          validEdges.push(e.id);
        } else if (e.weight === minValidWeight) {
          validEdges.push(e.id);
        }
      }
    });

    if (!isSourceVisited && !isTargetVisited) {
      errorType = 'disconnected'; // Neither endpoint is in the tree yet
    } else if (isSourceVisited && isTargetVisited) {
      errorType = 'cycle'; // Both endpoints already in the tree
    } else if (edge.weight !== minValidWeight) {
      errorType = 'not_min'; // Valid connectivity, but not the minimum weight available
    }

    if (errorType) {
      // Temporarily mark error
      setEdges(edges.map(e => e.id === edgeId ? { ...e, error: true } : e));
      setTimeout(() => {
        setEdges(edges => edges.map(e => e.id === edgeId ? { ...e, error: false } : e));
      }, 1000);

      // Call AI for explanation
      setIsTyping(true);
      
      let errorDesc = '';
      if (errorType === 'disconnected') {
        errorDesc = '这条边两端的节点目前都没有加入生成树，Prim算法要求我们必须从已连通的“树”向外延伸寻找相邻边。';
      } else if (errorType === 'cycle') {
        errorDesc = '这条边连接的两个节点都已经连通了，加上这条边就会形成环。';
      } else {
        errorDesc = `这条边可以延伸，但它的权重(${edge.weight})不是当前向外延伸的所有边中最小的。当前应该选择权重为${minValidWeight}的边(${validEdges.join('或')})。`;
      }

      const contextualMessage = `学生在做Prim算法时选错了边。
图的状态：总共有5个节点。当前已连通进入生成树的节点：${visitedNodes.join(',')}。
当前已选择的边: ${edges.filter(e => e.selected).map(e => e.id + '(权重' + e.weight + ')').join(', ') || '无'}。
学生刚点击了边 ${edge.id}（权重 ${edge.weight}，连接 ${edge.source} 和 ${edge.target}）。
错误类型：${errorDesc}
请扮演和蔼可亲的AI教学助教，用不到100字简短地告诉学生哪里错了，引导他们按照Prim算法的规则（从已连通节点集合中寻找通向未连通集合的最小边）重新选择。不要直接给出具体该选哪条边的直接答案。`;

      try {
        const responseText = await chatWithCodex({
          messages: [{ role: 'user', text: contextualMessage }],
        });
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: '哎呀，网络出了点小差错。记住哦，Prim要求每次都要从已连通的节点往外找最小的边。看看哪个未连通邻居最近？' }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Valid step
      const newEdges = edges.map(e => e.id === edgeId ? { ...e, selected: true } : e);
      const newVisitedNode = isSourceVisited ? edge.target : edge.source;
      const newVisitedList = [...visitedNodes, newVisitedNode];
      
      setEdges(newEdges);
      setVisitedNodes(newVisitedList);
      
      // Graph is fully connected if visited nodes count = initial nodes count
      if (newVisitedList.length === initialNodes.length) {
        setIsComplete(true);
        setMessages(prev => [...prev, { role: 'assistant', content: '🎉 太棒了！你已经成功使用 Prim 算法构建了最小生成树！你完全掌握了从点出发不断扩张的贪心策略。' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `很棒！选择边 ${edge.id} 是正确的。节点 ${newVisitedNode} 已经成功加入生成树，我们的可用节点集合扩大了。继续寻找下一条最小向外延伸边吧！` }]);
      }
    }
  };

  const resetGraph = () => {
    setEdges(initialEdges);
    setVisitedNodes(['A']);
    setIsComplete(false);
    setMessages([{
      role: 'assistant',
      content: '图已重置。我们再次从节点 A 开始全新的连通之旅！'
    }]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 p-6 select-none bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col relative">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-500" />
            Prim 最小生成树挑战
          </h2>
          <button
            onClick={resetGraph}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
        </div>
        <div className="flex-1 relative cursor-crosshair flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 600">
            {edges.map(edge => {
              const sourceNode = initialNodes.find(n => n.id === edge.source)!;
              const targetNode = initialNodes.find(n => n.id === edge.target)!;
              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2;
              
              const bgWidth = 24;
              const bgHeight = 16;
              
              return (
                <g key={edge.id} onClick={() => handleEdgeClick(edge.id)} className="cursor-pointer group">
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    strokeWidth="20"
                    stroke="transparent" 
                  />
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    strokeWidth="4"
                    className={cn(
                      'transition-all duration-300',
                      edge.selected
                        ? 'stroke-emerald-500'
                        : edge.error
                        ? 'stroke-red-500 animate-pulse'
                        : 'stroke-slate-300 dark:stroke-slate-600 group-hover:stroke-emerald-300'
                    )}
                  />
                  <rect
                    x={midX - bgWidth / 2}
                    y={midY - bgHeight / 2}
                    width={bgWidth}
                    height={bgHeight}
                    rx="4"
                    className={cn(
                      'transition-all duration-300',
                      edge.selected
                        ? 'fill-emerald-500'
                        : edge.error
                        ? 'fill-red-500'
                        : 'fill-slate-100 dark:fill-slate-700'
                    )}
                  />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn(
                      'text-xs font-bold pointer-events-none transition-colors duration-300',
                      edge.selected || edge.error ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'
                    )}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {initialNodes.map(node => {
              const isVisited = visitedNodes.includes(node.id);
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="22"
                    className={cn(
                      'stroke-2 transition-all duration-300',
                      isVisited
                        ? 'fill-emerald-100 dark:fill-emerald-900/30 stroke-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600'
                    )}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn(
                      "font-bold pointer-events-none text-sm transition-colors",
                      isVisited ? "fill-emerald-700 dark:fill-emerald-400" : "fill-slate-700 dark:fill-slate-300"
                    )}
                  >
                    {node.id}
                  </text>
                  {isVisited && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      className="fill-none stroke-emerald-500/30 stroke-[3] animate-pulse pointer-events-none"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm pointer-events-none"
            >
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">挑战完成！</h3>
                <p className="text-slate-600 dark:text-slate-400">你已经成功掌握了 Prim 算法的核心策略。</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="w-[380px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        <div className="bg-emerald-600 px-4 py-3 text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-50" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI 算法助教</h3>
            <p className="text-xs text-emerald-100">实时分析 Prim 算法意图</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900 flex flex-col">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn('flex flex-col max-w-[85%] gap-1 relative', msg.role === 'user' ? 'self-end items-end' : 'self-start items-start')}
              >
                <div
                  className={cn(
                    'px-4 py-3 shadow-sm text-[13px] whitespace-pre-wrap leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="self-start flex gap-2"
              >
                <div className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}