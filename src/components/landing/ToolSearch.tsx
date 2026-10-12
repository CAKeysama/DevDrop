import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { links } from '../../lib/links'
import { SearchField } from '../ui/SearchField'

/** Sends the visitor to the catalog with the query applied — the catalog owns the search. */
export function ToolSearch() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `${links.tools}?q=${encodeURIComponent(q)}` : links.tools)
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full">
      <SearchField
        id="landing-tool-search"
        label="Buscar ferramentas"
        placeholder="Buscar ferramenta: JSON, senha, CPF…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="pr-16"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white transition-[scale] duration-150 ease-out hover:scale-105 active:scale-[0.97]"
      >
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>
    </form>
  )
}
