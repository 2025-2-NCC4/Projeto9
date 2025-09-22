import React from "react";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartDuplo = ({data, labelKey, valueKey1, valueKey2, label1, label2, format, titulo }) => {
    const labels = data.map((d) => d[labelKey])
    const serie1 = data.map((d) => Number(d[valueKey1]) || 0)
    const serie2 = data.map((d) => Number(d[valueKey2]) || 0)

    const palette = [
      "rgba(59,130,246,0.7)", 
      "rgba(234,88,12,0.7)",   
    ]

    const fmtCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    const fmtNumber   = new Intl.NumberFormat("pt-BR");
    const fmtPercent  = new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const formatValue = (v) => {
      const n = Number(v) || 0;
      if (format === "currency") return fmtCurrency.format(n)
      if (format === "percent")  return fmtPercent.format(n / 100)
      return fmtNumber.format(n);
    }

    const dataChart = {
      labels,
      datasets: [
        {
          label: label1,
          data: serie1,
          backgroundColor: palette[0],
          borderWidth: 0,
        },
        {
          label: label2,
          data: serie2,
          backgroundColor: palette[1],
          borderWidth: 0,
        },
      ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true },
            title: { 
                    display: true,
                     text: titulo 
                    },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${ctx.dataset.label}: ${formatValue(ctx.raw)}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (val) => formatValue(val),
          },
        },
      },
    }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Bar data={dataChart} options={options} />
    </div>
  )
}

export default BarChartDuplo
