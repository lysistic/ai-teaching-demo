import React, { useCallback, useState } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import type { Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialNodes = [
  // 根节点：最高层级
  { id: '1', position: { x: 500, y: 20 }, data: { label: '《算法设计与分析》' }, style: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: 'bold', fontSize: '16px' } },

  // 一级章节
  { id: 'ch1', position: { x: 50, y: 120 }, data: { label: '第一章 基础与复杂度' }, style: { background: '#dcfce7', color: '#166534', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px' } },
  { id: 'ch2', position: { x: 250, y: 120 }, data: { label: '第二章 递归与分治' }, style: { background: '#dcfce7', color: '#166534', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px' } },
  { id: 'ch3', position: { x: 450, y: 120 }, data: { label: '第三章 动态规划' }, style: { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' } },
  { id: 'ch4', position: { x: 650, y: 120 }, data: { label: '第四章 贪心算法' }, style: { background: '#fef9c3', color: '#854d0e', border: '1px solid #eab308', borderRadius: '8px', padding: '10px' } },
  { id: 'ch5', position: { x: 850, y: 120 }, data: { label: '第五章 图与遍历' }, style: { background: '#fef9c3', color: '#854d0e', border: '1px solid #eab308', borderRadius: '8px', padding: '10px' } },
  { id: 'ch6', position: { x: 1050, y: 120 }, data: { label: '第六章 回溯与分支限界' }, style: { background: '#f8fafc', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '10px' } },

  // 二级知识点 (分治)
  { id: 'dc1', position: { x: 250, y: 220 }, data: { label: '快速排序 / 归并排序' }, style: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' } },

  // 二级知识点 (动规)
  { id: 'dp1', position: { x: 400, y: 220 }, data: { label: '矩阵连乘' }, style: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' } },
  { id: 'dp2', position: { x: 500, y: 220 }, data: { label: '0-1背包问题' }, style: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' } },

  // 二级知识点 (贪心算法)
  { id: 'gr1', position: { x: 600, y: 220 }, data: { label: '活动安排问题' }, style: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' } },
  { id: 'gr2', position: { x: 740, y: 220 }, data: { label: '单源最短路径 (Dijkstra)' }, style: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' } },

  // 二级知识点 (图论)
  { id: 'gr3', position: { x: 880, y: 220 }, data: { label: '图的遍历 (DFS/BFS)' }, style: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px' } },

  // === 核心高亮节点：最小生成树 ===
  {
    id: 'core_mst',
    position: { x: 740, y: 350 },
    data: { label: '🌟 最小生成树 (MST)' },
    style: { 
      background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)', 
      color: '#854d0e', 
      border: '2px solid #eab308', 
      borderRadius: '8px', 
      padding: '14px 20px',
      fontWeight: 'bold',
      fontSize: '16px',
      boxShadow: '0 0 25px rgba(234, 179, 8, 0.8)'
    }
  },

  // 前置数据结构依赖 (底部)
  { id: 'ds1', position: { x: 600, y: 480 }, data: { label: '前置结构: 并查集 (Disjoint Set)' }, style: { background: '#f8fafc', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '8px' } },
  { id: 'ds2', position: { x: 880, y: 480 }, data: { label: '前置结构: 优先队列 (堆)' }, style: { background: '#f8fafc', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '8px' } },
];

const initialEdges = [
  // 根节点到各章节
  { id: 'e-r-1', source: '1', target: 'ch1', animated: false, style: { stroke: '#22c55e' } },
  { id: 'e-r-2', source: '1', target: 'ch2', animated: false, style: { stroke: '#22c55e' } },
  { id: 'e-r-3', source: '1', target: 'ch3', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-r-4', source: '1', target: 'ch4', animated: true, style: { stroke: '#eab308', strokeWidth: 2 } },
  { id: 'e-r-5', source: '1', target: 'ch5', animated: true, style: { stroke: '#eab308', strokeWidth: 2 } },
  { id: 'e-r-6', source: '1', target: 'ch6', animated: false, style: { stroke: '#cbd5e1' } },

  // 章节到子知识点
  { id: 'e-ch2-1', source: 'ch2', target: 'dc1', animated: false, style: { stroke: '#cbd5e1' } },
  
  { id: 'e-ch3-1', source: 'ch3', target: 'dp1', animated: false, style: { stroke: '#93c5fd' } },
  { id: 'e-ch3-2', source: 'ch3', target: 'dp2', animated: false, style: { stroke: '#93c5fd' } },
  
  { id: 'e-ch4-1', source: 'ch4', target: 'gr1', animated: false, style: { stroke: '#cbd5e1' } },
  { id: 'e-ch4-2', source: 'ch4', target: 'gr2', animated: false, style: { stroke: '#cbd5e1' } },
  
  { id: 'e-ch5-1', source: 'ch5', target: 'gr3', animated: false, style: { stroke: '#cbd5e1' } },

  // === 汇聚到【最小生成树】的黄金主路径 ===
  // 最小生成树既属于贪心算法，也是图论的经典应用
  { id: 'e-ch4-mst', source: 'ch4', target: 'core_mst', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },
  { id: 'e-ch5-mst', source: 'ch5', target: 'core_mst', animated: true, style: { stroke: '#eab308', strokeWidth: 3 } },

  // === 数据结构支撑路径 ===
  { id: 'e-ds1-mst', source: 'ds1', target: 'core_mst', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' }, label: '支撑 Kruskal' },
  { id: 'e-ds2-mst', source: 'ds2', target: 'core_mst', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5,5' }, label: '支撑 Prim' },
  
  // 其他关联
  { id: 'e-gr3-gr2', source: 'gr3', target: 'gr2', animated: false, style: { stroke: '#cbd5e1', strokeDasharray: '5,5' } }, // 遍历可支撑最短路径
];

export default function KnowledgeGraph() {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50">
      {/* 图谱主区域 */}
      <div className="flex-1 relative border-r border-slate-200">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* 侧边栏：知识点信息 */}
      <div className="w-80 bg-white p-6 overflow-y-auto">
        {selectedNode ? (
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              {selectedNode.data.label}
            </h2>
            <div className="bg-slate-100 p-4 rounded-lg mb-4 text-sm text-slate-600 leading-relaxed">
              这是关于【{selectedNode.data.label}】的预设图谱介绍。在这里你能看到该节点的前置依赖和后续学习路线。
            </div>
            
            {/* 模拟针对特定知识点的跳转动作 */}
            {selectedNode.data.label.includes('最小生成树') && (
              <div className="flex flex-col gap-3 mt-6">
                <p className="text-sm font-semibold text-slate-700 mb-1">相关实验与练习：</p>
                <button
                  onClick={() => navigate('/student/kruskal')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md shadow-sm transition-colors text-sm"
                >
                  去完成 Kruskal 算法练习
                </button>
                <button
                  onClick={() => navigate('/student/prim')}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded-md shadow-sm transition-colors text-sm"
                >
                  去完成 Prim 算法练习
                </button>
              </div>
            )}
            
            {selectedNode.data.label.includes('已掌握') && (
              <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md border border-green-200 text-sm">
                <CheckCircle className="w-4 h-4" />
                恭喜，你已经熟练掌握了该知识点！
              </div>
            )}
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
            <p>请在左侧图谱中点击知识节点<br/>查看关联信息或进行针对性练习</p>
          </div>
        )}
      </div>
    </div>
  );
}
