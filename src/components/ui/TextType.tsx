import { useEffect, useState } from 'react'

type TextTypeProps = {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

/**
 * Efeito "text type" (React Bits): digita, pausa, apaga e passa para a próxima palavra.
 * Com prefers-reduced-motion, mostra apenas a primeira palavra, sem animação.
 */
export function TextType({ words, typingSpeed = 150, deletingSpeed = 90, pauseTime = 2200 }: TextTypeProps) {
  const [reduced, setReduced] = useState(false)
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(words[0])
  const [deleting, setDeleting] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) return
    const word = words[index]
    let delay = deleting ? deletingSpeed : typingSpeed

    if (!deleting && text === word) delay = pauseTime
    else if (deleting && text === '') delay = 250

    const id = window.setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      } else {
        setText(deleting ? text.slice(0, -1) : word.slice(0, text.length + 1))
      }
    }, delay)
    return () => window.clearTimeout(id)
  }, [text, deleting, index, reduced, words, typingSpeed, deletingSpeed, pauseTime])

  if (reduced) return <span className="rounded-[0.12em] bg-violet-500/40 text-white">{words[0]}</span>

  // Reserva a largura da maior palavra: a linha nunca reflui enquanto digita.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a))

  return (
    <span aria-hidden="true" className="relative inline-block whitespace-nowrap text-left">
      <span className="invisible">{longest}</span>
      <span className="absolute inset-y-0 left-0 rounded-[0.12em] bg-violet-500/40 text-white">
        {text}
        <span className="text-type-cursor ml-0.5 inline-block w-[0.06em] translate-y-[0.08em] bg-current align-baseline">
          &nbsp;
        </span>
      </span>
    </span>
  )
}
