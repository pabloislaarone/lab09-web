'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  // Retraso en milisegundos para que los elementos aparezcan en cascada
  delay?: number
  as?: 'div' | 'li' | 'section'
}

// Hace aparecer su contenido cuando entra en pantalla al hacer scroll
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // solo la primera vez
        }
      },
      { rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={{ '--retraso': `${delay}ms` } as React.CSSProperties}
      className={`revelar ${className}`}
    >
      {children}
    </Tag>
  )
}
