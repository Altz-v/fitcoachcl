import React, { useMemo, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const KCAL_PORCION_OFICIAL = {
  "Panes, cereales, tubérculos y leguminosas frescas": 140,
  "Leguminosas secas": 170,
  "Verduras (consumo general)": 30,
  "Verduras (libre consumo)": 10,
  "Frutas": 60,
  "Lácteos descremados": 70,
  "Lácteos semidescremados": 85,
  "Lácteos enteros": 110,
  "Carnes bajas en grasa": 65,
  "Carnes altas en grasa": 120,
  "Grasas / aceites": 180,
  "Alimentos ricos en lípidos (frutos secos/palta)": 175,
  "Azúcares": 20,
};

const DEFAULT_PLAN_ARRAY = [
  { grupo: "Panes, cereales, tubérculos y leguminosas frescas", porciones: 6, kcal: KCAL_PORCION_OFICIAL["Panes, cereales, tubérculos y leguminosas frescas"] },
  { grupo: "Frutas", porciones: 3, kcal: KCAL_PORCION_OFICIAL["Frutas"] },
  { grupo: "Verduras (consumo general)", porciones: 3, kcal: KCAL_PORCION_OFICIAL["Verduras (consumo general)"] },
  { grupo: "Lácteos descremados", porciones: 2, kcal: KCAL_PORCION_OFICIAL["Lácteos descremados"] },
  { grupo: "Carnes bajas en grasa", porciones: 3, kcal: KCAL_PORCION_OFICIAL["Carnes bajas en grasa"] },
  { grupo: "Leguminosas secas", porciones: 1, kcal: KCAL_PORCION_OFICIAL["Leguminosas secas"] },
  { grupo: "Grasas / aceites", porciones: 3, kcal: KCAL_PORCION_OFICIAL["Grasas / aceites"] },
  { grupo: "Alimentos ricos en lípidos (frutos secos/palta)", porciones: 1, kcal: KCAL_PORCION_OFICIAL["Alimentos ricos en lípidos (frutos secos/palta)"] },
  { grupo: "Azúcares", porciones: 2, kcal: KCAL_PORCION_OFICIAL["Azúcares"] },
];

function normalizePlan(plan) {
  if (!plan) return DEFAULT_PLAN_ARRAY;
  if (!Array.isArray(plan) && typeof plan === "object") {
    return Object.keys(plan).map((grupo) => ({
      grupo,
      porciones: Math.max(0, Number(plan[grupo]?.porciones ?? 0)),
      kcal: Math.max(0, Number(plan[grupo]?.kcal ?? KCAL_PORCION_OFICIAL[grupo] ?? 0)),
    }));
  }
  if (Array.isArray(plan)) {
    return plan.map((item) => ({
      grupo: String(item.grupo ?? item.name ?? "Grupo"),
      porciones: Math.max(0, Number(item.porciones ?? item.actual ?? 0)),
      kcal: Math.max(0, Number(item.kcal ?? KCAL_PORCION_OFICIAL[item.grupo] ?? 0)),
    }));
  }
  return DEFAULT_PLAN_ARRAY;
}

function runPreviewTests(rows) {
  console.assert(rows.every((r) => r.porciones >= 0), "[Test] Porciones no negativas");
  const names = rows.map((r) => r.grupo);
  const unique = new Set(names);
  console.assert(unique.size === names.length, "[Test] Nombres de grupo deben ser únicos");
  const calc = rows.reduce((s, r) => s + r.porciones * r.kcal, 0);
  const recompute = rows.map((r) => r.porciones * r.kcal).reduce((s, v) => s + v, 0);
  console.assert(calc === recompute, "[Test] Suma de kcal por grupo");
}

const AUTO_COLORS = new Array(20).fill(0).map((_, i) => `hsl(${(i * 47) % 360} 70% 55%)`);

export default function ReportePreview({ plan, objetivoKcal }) {
  const rows = useMemo(() => normalizePlan(plan), [plan]);
  useEffect(() => { runPreviewTests(rows); }, [rows]);

  const pieData = useMemo(() => rows.map((r) => ({ name: r.grupo, value: r.porciones * r.kcal })), [rows]);
  const totalKcal = useMemo(() => pieData.reduce((s, d) => s + d.value, 0), [pieData]);
  const barData = rows.map((r) => ({ name: r.grupo, porciones: r.porciones }));

  return (
    <div className="mx-auto max-w-6xl p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-1">Distribución de kcal por grupo</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
          Total: {Math.round(totalKcal)} kcal{typeof objetivoKcal === "number" ? ` / Objetivo: ${Math.round(objetivoKcal)} kcal` : ""}
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120}>
                {pieData.map((_, i) => (<Cell key={i} fill={AUTO_COLORS[i % AUTO_COLORS.length]} />))}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-1">Porciones actuales por grupo</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">Vista previa</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis />
              <Tooltip /><Legend />
              <Bar dataKey="porciones" name="Porciones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
