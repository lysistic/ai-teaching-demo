import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
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

// Simple Union-Find for Kruskal's algorithm
class DisjointSet {
  parent: Record<string, string> = {};
  
  constructor(nodes: string[]) {
    nodes.forEach(n => this.parent[n] = n);
  }
  
  find(i: string): string {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }
  
  union(i: string, j: string): void {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
    }
  }
}

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

export function KruskalExercise() {
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: '你好！我是你的算法助教。今天我们要练习 Kruskal（克鲁斯卡尔）最小生成树算法。请按正确的顺序在左侧图中点击边来构建最小生成树。如果你犯了错我会提醒你哦！'
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
    
    // Validate the step
    const ds = new DisjointSet(initialNodes.map(n => n.id));
    const selectedEdges = edges.filter(e => e.selected);
    selectedEdges.forEach(e => ds.union(e.source, e.target));
    
    const formsCycle = ds.find(edge.source) === ds.find(edge.target);
    
    // Find what SHOULD be the next valid minimum edge
    const availableEdges = edges.filter(e => !e.selected);
    let minValidWeight = Infinity;
    const validEdges: string[] = [];
    
    availableEdges.forEach(e => {
      if (ds.find(e.source) !== ds.find(e.target)) {
        if (e.weight < minValidWeight) {
          minValidWeight = e.weight;
          validEdges.length = 0;
          validEdges.push(e.id);
        } else if (e.weight === minValidWeight) {
          validEdges.push(e.id);
        }
      }
    });

    const isMinimum = edge.weight === minValidWeight;
    let errorType = null;
    if (formsCycle) errorType = 'cycle';
    else if (!isMinimum) errorType = 'not_min';

    if (errorType) {
      // Temporarily mark error
      setEdges(edges.map(e => e.id === edgeId ? { ...e, error: true } : e));
      setTimeout(() => {
        setEdges(edges => edges.map(e => e.id === edgeId ? { ...e, error: false } : e));
      }, 1000);

      // Call AI for explanation
      setIsTyping(true);
      const contextualMessage = `学生在做Kruskal算法时选错了边。
图的状态：总共有5个节点(${initialNodes.map(n=>n.id).join(',')})。
当前已选择的边: ${selectedEdges.map(e => e.id + '(权重' + e.weight + ')').join(', ') || '无'}。
学生刚点击了边 ${edge.id}（权重 ${edge.weight}）。
错误类型：${errorType === 'cycle' ? '这条边连接的两个节点已经连通，形成环。' : `这条边不是当前可用且不形成环的最小权重边。当前应该选择权重为${minValidWeight}的边(${validEdges.join('或')})。`}
请扮演和蔼可亲的AI教学助教，用不到100字简短地告诉学生哪里错了，引导他们按照Kruskal算法的规则（每次选不形成环的最小边）重新选择。不要直接给出具体答案。`;

      try {
        const responseText = await chatWithCodex({
          messages: [{ role: 'user', text: contextualMessage }],
        });
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: '哎呀，网络出了点小差错。记住哦，Kruskal要求每次都挑不构成环的最小边。再找找有没有更小的？' }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Valid step
      const newEdges = edges.map(e => e.id === edgeId ? { ...e, selected: true } : e);
      setEdges(newEdges);
      
      const newSelected = newEdges.filter(e => e.selected);
      // Graph is fully connected if edge count = node count - 1
      if (newSelected.length === initialNodes.length - 1) {
        setIsComplete(true);
        setMessages(prev => [...prev, { role: 'assistant', content: '🎉 恭喜你！你已经成功构建了最小生成树！你完全掌握了 Kruskal 算法的核心原理。' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `很棒！选择边 ${edge.id}（权重 ${edge.weight}）是正确的。继续寻找下一条边吧！` }]);
      }
    }
  };

  const resetGraph = () => {
    setEdges(initialEdges);
    setIsComplete(false);
    setMessages([{
      role: 'assistant',
      content: '图已重置。让我们再来一次！'
    }]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 p-6 select-none bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col relative">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Kruskal 最小生成树挑战
          </h2>
          <button
            onClick={resetGraph}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10"
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
              
              // Draw text block background
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
                    stroke="transparent" // Invisible hitbox
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
                        ? 'stroke-indigo-500'
                        : edge.error
                        ? 'stroke-red-500 animate-pulse'
                        : 'stroke-slate-300 dark:stroke-slate-600 group-hover:stroke-indigo-300'
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
                        ? 'fill-indigo-500'
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

            {initialNodes.map(node => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  className={cn(
                    'fill-white dark:fill-slate-800 stroke-2 transition-colors duration-300',
                    edges.some(e => e.selected && (e.source === node.id || e.target === node.id))
                      ? 'stroke-indigo-500'
                      : 'stroke-slate-300 dark:stroke-slate-600'
                  )}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-slate-700 dark:fill-slate-300 font-bold pointer-events-none text-sm"
                >
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
          
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm pointer-events-none"
            >
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">挑战完成！</h3>
                <p className="text-slate-600 dark:text-slate-400">你已经找到了正确的最小生成树。</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="w-[380px] bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        <div className="bg-indigo-600 px-4 py-3 text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-50" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI 算法助教</h3>
            <p className="text-xs text-indigo-200">实时分析你的操作意图</p>
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
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
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
