import React, { useState } from 'react';
import { Send, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileWordForm() {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/wordcloud/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed })
      });
      
      setInputValue('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-sm border border-indigo-200/50 dark:border-indigo-400/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2 text-slate-800 dark:text-white">课堂互动关键词</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">总结你的所学，结果将实时同步到大屏</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="输入关键词 (最多10字)"
              maxLength={10}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg shadow-inner text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>发射到大屏 <Send className="w-5 h-5 ml-1" /></>
            )}
          </button>
        </form>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 rounded-3xl"
            >
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <CheckCircle className="w-20 h-20 text-emerald-500 mb-5 shadow-sm rounded-full bg-white dark:bg-slate-800" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">发送成功！</h2>
              <p className="text-slate-500 dark:text-slate-400">词汇已进入表单排队池<br/>等待老师刷新大屏即可看到</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}