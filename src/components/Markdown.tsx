import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../lib/cn'

export function Markdown({ className, children }: { className?: string; children: string }) {
  return (
    <div className={cn('prose prose-invert prose-sm max-w-none prose-p:my-2 prose-li:my-1', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => (
            <a
              {...props}
              className="text-cyan-200/90 underline underline-offset-4 hover:text-cyan-100"
              target="_blank"
              rel="noreferrer"
            />
          ),
          code: ({ className, children, ...props }) => {
            const inline = !className
            if (inline) {
              return (
                <code
                  {...props}
                  className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[0.92em] text-white/90"
                >
                  {children}
                </code>
              )
            }
            return (
              <code {...props} className={className}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-3 overflow-auto rounded-2xl border border-white/10 bg-black/35 p-4">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-auto rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-white/5 text-xs text-white/70">{children}</thead>,
          tbody: ({ children }) => <tbody className="text-white/80">{children}</tbody>,
          tr: ({ children }) => <tr className="border-t border-white/10">{children}</tr>,
          th: ({ children }) => <th className="px-3 py-2 font-semibold">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 align-top">{children}</td>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-2xl border border-cyan-200/15 bg-cyan-200/5 px-4 py-3 text-white/78">
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

