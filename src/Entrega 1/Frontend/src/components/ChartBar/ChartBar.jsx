import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({data, labelKey, valueKey, titulo, format }) => {

    const fmtCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const fmtNumber = new Intl.NumberFormat("pt-BR");
    const fmtPercent = new Intl.NumberFormat("pt-BR", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    const formatValue = (v) => {
    const n = Number(v) || 0
    if (format === "currency") return fmtCurrency.format(n);
    if (format === "percent") return fmtPercent.format(n > 1 ? n / 100 : n)
    return fmtNumber.format(n);
    }
    const labels = data.map(d => d[labelKey])
    const valores = data.map(d => d[valueKey])

    const chartData = {
        labels,
        datasets: [
            {
                label: "Total por cupom",
                data: valores,
                backgroundColor: "rgba(59, 130, 246, 0.7)"
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {display: false},
            title:{
                display: true,
                text: titulo
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ${formatValue(ctx.raw ?? 0)}`,
                }
            }
        }
    }


    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Bar data={chartData} options={options} />
        </div>
    )
    
}

export default BarChart