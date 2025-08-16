import React, { useMemo } from 'react'

export default function IntaPlanner({ store, update, objetivoKcal, INTA_KCAL_PDF }) {
  const p = store.inta.porciones;
  const totalKcal = useMemo(()=>Object.values(p).reduce((s,it)=>s + it.kcal*(it.porciones||0),0), [p]);

  const diff = objetivoKcal>0 ? (totalKcal - objetivoKcal) / objetivoKcal : 0;
  const status = Math.abs(diff) <= 0.05 ? 'ok' : (Math.abs(diff) <= 0.10 ? 'warn' : 'bad');
  const bg = status==='ok' ? 'bg-green-100 text-green-800 border-green-300' : status==='warn' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300';

  const applyKcalPdf = () => {
    const next = {};
    Object.keys(p).forEach(k => next[k] = { ...p[k], kcal: INTA_KCAL_PDF[k] ?? p[k].kcal });
    update('inta.porciones', next);
  };

  const migrate = () => {
    // simple migrate: rehydrate any missing category with PDF kcal
    const keysPdf = Object.keys(INTA_KCAL_PDF);
    const next = {};
    keysPdf.forEach(k => { next[k] = p[k] ?? { kcal: INTA_KCAL_PDF[k], porciones: 0 }; });
    update('inta.porciones', next);
  };

  const scaleToObjective = () => {
    if (!objetivoKcal || totalKcal===0) return;
    const factor = objetivoKcal / totalKcal;
    const next = {};
    Object.keys(p).forEach(k => next[k] = { ...p[k], porciones: Math.round((p[k].porciones||0)*factor) });
    update('inta.porciones', next);
  };

  const setKcalObjFromTdee = () => update('inta.kcalObjetivo', objetivoKcal);

  return (
    <div className="rounded-2xl border p-4 dark:border-zinc-800">
      <div className={`mb-3 rounded-xl border px-3 py-2 text-sm ${bg}`}>
        Total plan: <b>{totalKcal} kcal</b> • Objetivo: <b>{store.inta.kcalObjetivo || objetivoKcal || 0} kcal</b>
        {status==='ok' ? ' ✓ Dentro del rango (±5%)' : status==='warn' ? ' • Revisa (±5–10%)' : ' • ⚠️ Fuera de rango (>±10%)'}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <button className="px-3 py-2 rounded-xl text-sm border dark:border-zinc-700" onClick={applyKcalPdf}>Aplicar kcal del PDF</button>
        <button className="px-3 py-2 rounded-xl text-sm border dark:border-zinc-700" onClick={migrate}>Migrar categorías del PDF</button>
        <button className="px-3 py-2 rounded-xl text-sm border dark:border-zinc-700" onClick={scaleToObjective}>Sugerir porciones (lineal)</button>
        <button className="px-3 py-2 rounded-xl text-sm border dark:border-zinc-700" onClick={setKcalObjFromTdee}>Usar TDEE actual</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b dark:border-zinc-800">
              <th className="py-2 pr-2">Grupo</th>
              <th className="py-2 pr-2">kcal/porción</th>
              <th className="py-2 pr-2">Porciones</th>
              <th className="py-2 pr-2">kcal totales</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(p).map((k)=>{
              const row = p[k];
              const kcal = row.kcal || 0;
              const porc = row.porciones || 0;
              return (
                <tr key={k} className="border-b last:border-0 dark:border-zinc-800">
                  <td className="py-2 pr-2">{k}</td>
                  <td className="py-2 pr-2">
                    <input type="number" className="w-28 rounded-xl border px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700"
                      value={kcal} onChange={(e)=>update(`inta.porciones.${k}`, { ...row, kcal: Number(e.target.value) })}/>
                  </td>
                  <td className="py-2 pr-2">
                    <input type="number" className="w-20 rounded-xl border px-2 py-1 dark:bg-zinc-900 dark:border-zinc-700"
                      value={porc} onChange={(e)=>update(`inta.porciones.${k}`, { ...row, porciones: Number(e.target.value) })}/>
                  </td>
                  <td className="py-2 pr-2">{porc * kcal}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
