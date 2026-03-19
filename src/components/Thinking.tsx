import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export function Thinking({ label = 'AI 正在思考…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="relative">
        <div className="absolute -inset-2 rounded-2xl bg-cyan-300/10 blur-xl" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
          <Bot className="h-5 w-5 text-cyan-200" />
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-white/85">{label}</div>
        <div className="mt-1 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-200/80 to-fuchsia-200/70"
              initial={{ opacity: 0.25, y: 0 }}
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.16 }}
            />
          ))}
          <span className="ml-2 text-xs text-white/55">生成提示/反例/评价中</span>
        </div>
      </div>
    </div>
  )
}

