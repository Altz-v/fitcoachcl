import React from 'react'

export default function Ejercicios({ items=[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(it => (
        <div key={it.id} className="rounded-2xl border p-3 dark:border-zinc-800">
          <img src={it.img} alt={it.nombre} className="h-40 w-full object-cover rounded-xl"/>
          <div className="mt-2">
            <p className="font-semibold">{it.nombre}</p>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{it.grupo} • {it.notas}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
