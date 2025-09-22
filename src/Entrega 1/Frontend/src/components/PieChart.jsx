import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, labelKey, valueKey, format, titulo }) => {
  const labels = data.map((d) => d[labelKey]);
  const valores = data.map((d) => Number(d[valueKey]) || 0)

  const colors = [
    "rgba(59,130,246,0.8)",  // azul
    "rgba(234,88,12,0.8)",   // laranja
    "rgba(34,197,94,0.8)",   // verde
    "rgba(244,63,94,0.8)",   // rosa/vermelho
    "rgba(168,85,247,0.8)",  // roxo
    "rgba(250,204,21,0.8)",  // amarelo
    "rgba(20,184,166,0.8)",  // teal
    "rgba(99,102,241,0.8)",  // índigo
  ].slice(0, labels.length)

  const chartData = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  }

  const fmtCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
  const fmtPercent  = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtNumber   = new Intl.NumberFormat("pt-BR")

  const formatValue = (v) => {
    if (format === "currency") return fmtCurrency.format(v)
    if (format === "percent")  return fmtPercent.format(v / 100)
    return fmtNumber.format(v)
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: titulo },
      tooltip: {
        callbacks: {
          label: (ctx) => formatValue(ctx.raw ?? 0),
        },
      },
    },
  }

  return (
    <div className="pie-chart">
      <Pie data={chartData} options={options} />
      <ul style={{ marginTop: 12, padding: 0, listStyle: "none" }}>
        {labels.map((label, i) => (
          <li
            key={`${label}-${i}`}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: colors[i],
                display: "inline-block",
              }}
            />
            <span>
              {label} — {formatValue(valores[i] || 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PieChart
