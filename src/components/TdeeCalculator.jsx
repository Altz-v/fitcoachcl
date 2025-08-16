import React from 'react'

export default function TdeeCalculator({ store, update }) {
  const s = store.tdee;
  const set = (k,v)=>update(`tdee.${k}`, v);

  const calcBMR = (sexo, edad, peso, estatura, formula) => {
    if (formula === "mifflin") {
      const sign = sexo === "hombre" ? 5 : -161;
      return Math.round(10*peso + 6.25*estatura - 5*edad + sign);
    }
    if (sexo==="hombre") return Math.round(88.362 + 13.397*peso + 4.799*estatura - 5.677*edad);
    return Math.round(447.593 + 9.247*peso + 3.098*estatura - 4.330*edad);
  };
  const BMR = calcBMR(s.sexo, s.edad, s.peso, s.estatura, s.formula);
  const TDEE = Math.round(BMR * s.factor);
  const objetivo = s.deficit>0 ? Math.round(TDEE*(1 - s.deficit/100)) : (s.superavit>0 ? Math.round(TDEE*(1 + s.superavit/100)) : TDEE);

  return (
    <div className="rounded-2xl border p-4 dark:border-zinc-800">
      <h2 className="text-lg font-semibold mb-3">Gasto Energético (TDEE)</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm">Sexo
          <select className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" value={s.sexo} onChange={e=>set('sexo', e.target.value)}>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        </label>
        <label className="text-sm">Edad
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" type="number" value={s.edad} onChange={e=>set('edad', Number(e.target.value))}/>
        </label>
        <label className="text-sm">Peso (kg)
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" type="number" value={s.peso} onChange={e=>set('peso', Number(e.target.value))}/>
        </label>
        <label className="text-sm">Estatura (cm)
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" type="number" value={s.estatura} onChange={e=>set('estatura', Number(e.target.value))}/>
        </label>
        <label className="text-sm">Fórmula
          <select className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" value={s.formula} onChange={e=>set('formula', e.target.value)}>
            <option value="mifflin">Mifflin-St Jeor</option>
            <option value="harris">Harris-Benedict</option>
          </select>
        </label>
        <label className="text-sm">Actividad
          <select className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" value={s.factor} onChange={e=>set('factor', Number(e.target.value))}>
            <option value="1.2">Sedentario</option>
            <option value="1.375">Ligero</option>
            <option value="1.55">Moderado</option>
            <option value="1.725">Activo</option>
            <option value="1.9">Muy activo</option>
          </select>
        </label>
        <label className="text-sm">Déficit %
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" type="number" value={s.deficit} onChange={e=>set('deficit', Number(e.target.value))}/>
        </label>
        <label className="text-sm">Superávit %
          <input className="w-full rounded-xl border px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700" type="number" value={s.superavit} onChange={e=>set('superavit', Number(e.target.value))}/>
        </label>
      </div>
      <div className="mt-3 text-sm text-gray-600 dark:text-zinc-400">BMR: <b>{BMR} kcal</b> • TDEE: <b>{TDEE} kcal</b> • Objetivo: <b>{objetivo} kcal</b></div>
      <button className="mt-3 px-3 py-2 rounded-xl text-sm border dark:border-zinc-700" onClick={()=>update('inta.kcalObjetivo', objetivo)}>Usar como objetivo INTA</button>
    </div>
  )
}
