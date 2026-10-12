import type { CategoryId } from '../../data/tools'

/** Small decorative illustration per category. Purely visual: hidden from assistive tech. */
export function CategoryVisual({ id }: { id: CategoryId }) {
  switch (id) {
    case 'developer':
      return (
        <div aria-hidden="true" className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 font-mono text-[12px] leading-6 text-white/50 sm:text-[13px] lg:p-7 lg:text-[15px] lg:leading-8">
          <div className="mb-3 flex gap-1.5">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
          </div>
          <p>{'{'}</p>
          <p className="pl-4">
            <span className="text-sky-300">"name"</span>: <span className="text-emerald-300">"DevDrop"</span>,
          </p>
          <p className="pl-4">
            <span className="text-sky-300">"formatted"</span>: <span className="text-amber-300">true</span>,
          </p>
          <p className="pl-4">
            <span className="text-sky-300">"tools"</span>: [<span className="text-emerald-300">"json"</span>,{' '}
            <span className="text-emerald-300">"xml"</span>, <span className="text-emerald-300">"sql"</span>],
          </p>
          <p className="pl-4">
            <span className="text-sky-300">"encoding"</span>: <span className="text-emerald-300">"base64"</span>
          </p>
          <p>{'}'}</p>
        </div>
      )
    case 'security':
      return (
        <div aria-hidden="true">
          <p className="font-mono text-[18px] tracking-[0.2em] text-ink">••••••••••••</p>
          <div className="mt-3 flex gap-1.5">
            <span className="h-1.5 flex-1 rounded-full bg-emerald-500" />
            <span className="h-1.5 flex-1 rounded-full bg-emerald-500" />
            <span className="h-1.5 flex-1 rounded-full bg-emerald-500" />
            <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
          </div>
        </div>
      )
    case 'text':
      return (
        <p aria-hidden="true" className="font-display text-[40px] font-medium leading-none tracking-tight text-ink">
          Aa <span className="text-slate-300">AA aa</span>
        </p>
      )
    case 'calculators':
      return (
        <p aria-hidden="true" className="font-display text-[40px] font-medium leading-none tracking-tight text-ink">
          25<span className="text-slate-300">%</span>
          <span className="ml-3 align-middle font-sans text-[13px] font-medium tracking-normal text-subtle">de 480 = 120</span>
        </p>
      )
    case 'data':
      return (
        <div aria-hidden="true" className="space-y-1.5 overflow-hidden font-mono text-[12px] text-subtle sm:text-[13px]">
          <p className="truncate text-ink">3f2b8c1e-9a4d-4e7b-b1c6-5d0a7e2f9c84</p>
          <p className="truncate">a81d0c57-62fe-4b39-8e15-c7f4d2903b6a</p>
        </div>
      )
    case 'css':
      return (
        <div aria-hidden="true" className="flex items-center gap-3">
          <span className="size-14 rounded-2xl bg-linear-to-br from-sky-300 to-indigo-500" />
          {/* In dark mode a shadow alone doesn't show on the dark card: the tile lifts to a
              lighter fill and casts a black shadow, so it still reads as elevated. */}
          <span className="size-14 rounded-2xl bg-white shadow-[0_14px_30px_-8px_rgba(10,27,51,0.3)] ring-1 ring-slate-100 dark:bg-slate-200 dark:shadow-[0_14px_30px_-6px_rgba(0,0,0,0.75)] dark:ring-slate-300" />
          <span className="size-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-400" />
        </div>
      )
  }
}
