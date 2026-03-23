import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, QrCode, ArrowLeft, Trash2, ListChecks } from 'lucide-react';
import { cn } from '../lib/cn';

const colors = [
  'text-indigo-500 dark:text-indigo-400',
  'text-purple-500 dark:text-purple-400',
  'text-pink-500 dark:text-pink-400',
  'text-rose-500 dark:text-rose-400',
  'text-emerald-500 dark:text-emerald-400',
  'text-teal-500 dark:text-teal-400',
  'text-cyan-500 dark:text-cyan-400',
  'text-blue-500 dark:text-blue-400',
  'text-amber-500 dark:text-amber-400',
  'text-orange-500 dark:text-orange-400',
];

export function WordCloud() {
  const [view, setView] = useState<'qr' | 'cloud'>('qr');
  const [words, setWords] = useState<{text: string, count: number}[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);

  // 动态生成二维码的 IP，如果是 localhost 则使用本机的局域网 IP 会更好，这里使用 origin 也可以。
  // 在实际部署中，可以通过后端注入环境变量，这里先简单取当前的 host
  const qrLink = `${window.location.origin}/mobile-submit`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrLink)}&margin=10`;

  // 从后端提取 active pool 的词
  useEffect(() => {
    if (view === 'cloud') {
      fetch('/api/wordcloud/pool')
        .then(res => res.json())
        .then(data => setWords(data))
        .catch(console.error);
    }
  }, [view]);

  // 轮询收集表单池里的最新提交数量（从后端）
  useEffect(() => {
    if (view !== 'qr') return;
    const interval = setInterval(() => {
      fetch('/api/wordcloud/submissions')
        .then(res => res.json())
        .then(subs => setSubmissionCount(subs.length))
        .catch(console.error);
    }, 1000);
    return () => clearInterval(interval);
  }, [view]);

  const handleGenerateWordCloud = async () => {
    try {
      // 通过调用后端的 merge 接口来实现转换，并返回最新的 pool
      const response = await fetch('/api/wordcloud/merge', { method: 'POST' });
      const newPool = await response.json();
      
      setWords(newPool);
      setSubmissionCount(0);
      setView('cloud');
    } catch (err) {
      console.error('合并失败:', err);
    }
  };

  const clearCloudPool = async () => {
    if(window.confirm('确定要清空正在显示的所有词汇吗？')) {
      try {
        await fetch('/api/wordcloud/pool', { method: 'DELETE' });
        setWords([]);
      } catch (err) {
        console.error('清空失败:', err);
      }
    }
  };

  const maxCount = Math.max(...words.map(w => w.count), 1);
  const minCount = Math.min(...words.map(w => w.count), 1);

  // 打乱词汇顺序并锁定
  const displayWords = useMemo(() => {
    return [...words].sort((a, b) => (a.text.length % 3) - (b.text.length % 3) || a.count - b.count);
  }, [words]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 p-6">
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col items-center justify-center">
        
        <AnimatePresence mode="wait">
          {view === 'qr' ? (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-800 p-12 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center max-w-xl w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
              
              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl mb-6 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                <QrCode className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3">扫描二维码提交关键词</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                让全班同学使用手机微信或浏览器扫码，表单池里已经收到大家的提交啦。
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl shadow-inner border border-slate-200 dark:border-slate-700 mb-8 relative group">
                 <img src={qrImageUrl} alt="QR Code" className="w-[200px] h-[200px] mx-auto mix-blend-multiply dark:mix-blend-normal rounded-xl" />
                 
                 <div className="absolute -top-3 -right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-full text-sm shadow-lg font-bold flex items-center gap-2 animate-bounce">
                    <ListChecks className="w-4 h-4" />
                    待合并：{submissionCount} 条
                 </div>
              </div>

              <button
                onClick={handleGenerateWordCloud}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all font-bold text-lg hover:-translate-y-1"
              >
                <Cloud className="w-6 h-6" />
                去展示词云
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="cloud"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="w-full flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 relative overflow-hidden min-h-[600px]"
            >
              {/* 顶部控制栏 */}
              <div className="flex justify-between items-center z-20 mb-8">
                <button
                  onClick={() => setView('qr')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all font-semibold active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" /> 回到扫码收集
                </button>
                <button
                    onClick={clearCloudPool}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all font-semibold text-sm active:scale-95"
                >
                    <Trash2 className="w-4 h-4" /> 清空实时大屏
                </button>
              </div>

              {/* 词云区域 */}
              <div className="flex-1 relative flex items-center justify-center p-8">
                {/* 氛围散景背景 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
                   <div className="w-[50rem] h-[50rem] bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-all duration-1000 animate-pulse"></div>
                </div>

                {displayWords.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-slate-400 dark:text-slate-500 text-xl font-medium flex flex-col items-center gap-4 relative z-10"
                  >
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-full">
                      <Cloud className="w-16 h-16 opacity-30" />
                    </div>
                    目前的词云池是空的，可以回到扫码界面提交！
                  </motion.div>
                ) : (
                  <div className="relative z-10 flex flex-wrap justify-center align-middle content-center gap-x-10 gap-y-8 px-8 w-full max-w-[90%]">
                    <AnimatePresence>
                      {displayWords.map((word, index) => {
                        const sizeRatio = maxCount === minCount ? 0.5 : (word.count - minCount) / (maxCount - minCount);
                        const fontSize = 2 + sizeRatio * 6; // 从 2rem 到 8rem 平滑过渡
                        const colorClass = colors[(index + word.text.length) % colors.length];

                        return (
                          <motion.div
                            key={word.text}
                            initial={{ opacity: 0, scale: 0, filter: 'blur(20px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{
                              type: 'spring',
                              stiffness: 70,
                              damping: 12,
                              delay: index * 0.05 > 1.5 ? 0 : index * 0.05
                            }}
                            className={cn(
                              'font-black tracking-tight leading-none cursor-default hover:scale-110 transition-transform select-none drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:drop-shadow-lg z-10 hover:z-50',
                              colorClass
                            )}
                            style={{ fontSize: `${fontSize}rem` }}
                            whileHover={{ rotate: Math.random() * 10 - 5 }}
                            title={`提交热度：${Math.floor(word.count / 5)}`}
                          >
                            {word.text}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}