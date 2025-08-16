import React, { useState } from 'react'

export default function Progreso({ list=[], onAdd }) {
  const [fecha, setFecha] = useState(''); const [peso, setPeso] = useState('');
  return (
    <div className="rounded-2xl border p-4 dark:border-zinc-800">
      <h2 className="text-lg font-semibold mb-3">Progreso</h2>
      <div className="flex gap-2 mb-3">
        <input type="date" className="rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" value={fecha} onChange={e=>setFecha(e.target.value)}/>
        <input type="number" placeholder="Peso (kg)" className="rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" value={peso} onChange={e=>setPeso(e.target.value)}/>
        <button className="px-3 py-2 rounded-xl text-sm border dark:border-zinc-700" onClick={()=>{ if(!fecha||!peso) return; onAdd({fecha, peso:Number(peso)}); setFecha(''); setPeso(''); }}>Agregar</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="text-left border-b dark:border-zinc-800"><th className="py-2 pr-2">Fecha</th><th className="py-2 pr-2">Peso (kg)</th></tr></thead>
          <tbody>
            {list.map((r,i)=>(<tr key={i} className="border-b last:border-0 dark:border-zinc-800"><td className="py-2 pr-2">{r.fecha}</td><td className="py-2 pr-2">{r.peso}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
