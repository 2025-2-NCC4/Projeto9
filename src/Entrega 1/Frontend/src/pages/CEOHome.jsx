import React, { useEffect, useState } from "react"
import "./CEOHome.scss"
import Sidebar from "../components/Sidebar/Sidebar.jsx"
import KpiCard from "../components/KpiCard/KpiCard.jsx"
import { FiDollarSign, FiUserPlus, FiPackage, FiSliders  } from "react-icons/fi";
import { fetchReceitaLiquida, fetchTotalMovimentado, fetchTotalPorParceiros, fetchTotalPorSeguimento, fetchMargemOperacionalMedia } from "../services/ceoServices.js";
import BarChart from "../components/ChartBar/ChartBar.jsx";
import { formatPercent } from "../utils/formatters.js";
import KpiHelp from "../components/modal/KpiHelp.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.js";


const CeoHome = () => {
    const [total, setTotal] = useState(0)
    const [receitaLiq, setReceitaLiq] = useState(0)
    const [loading, setLoading] = useState(true)
    const [dados, setDados] = useState([])
    const [dadosParceiros, setDadosParceiros] = useState([])
    const [margemOp, setMargemOp] = useState(0)
    const windowWidth = useMediaQuery("(max-width: 1024px)");

    useEffect(() => {
        (async () =>{
            try{
                const result = await fetchTotalMovimentado()
                setTotal(result)
            }finally{
                setLoading(false)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try{
                const result = await fetchReceitaLiquida()
                setReceitaLiq(result)
            }finally{
                setLoading(false)
            }
        })()
    }, [])

    useEffect(() => {
        fetchTotalPorSeguimento()
            .then(setDados)
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetchTotalPorParceiros()
            .then(setDadosParceiros)
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetchMargemOperacionalMedia()
            .then(setMargemOp)
            .catch(console.error)
    }, [])


    const data = {
    receita: { trend: 32 },
    usuarios: { total: 690, trend: -5 },
    compras: { total: 1896, trend: 6 },
    };

    return(
        
        <div className="dashboard-container">
            <Sidebar/>
            <main className="content">
                <section className="section kpi-section">
                    <h1>Dashboard</h1>
                    <div className="kpis-container">
                        <div className="card-container">
                            <KpiCard
                            titulo="Receita Total"
                            icon={<FiDollarSign size={43}/>}
                            value={loading ? 0 : total}
                            currency
                            trend={data.receita.trend}
                            />
                            <KpiHelp kpiKey="receita_total" variant="resumo"/>
                        </div>
                        <div className="card-container">
                            <KpiCard
                            titulo="Receita Líquida"
                            icon={<FiUserPlus size={43} />}
                            value={loading ? 0 : receitaLiq}
                            currency
                            trend={data.usuarios.trend}
                        />
                            <KpiHelp kpiKey="receita_liquida" variant="resumo"/>
                        </div>
                        <div className="card-container">
                            <KpiCard
                            titulo="Margem Operacional"
                            icon={<FiPackage size={43}/>}
                            value={formatPercent(margemOp)}
                            trend={data.compras.trend}
                        />
                            <KpiHelp kpiKey="margem_operacional" variant="resumo"/>
                        </div>
                    </div>
                </section>
                <section className="section charts-section">
                    <div className="charts-itens">
                        <h1>Visão geral</h1>
                        <div className="filtro-container"> 
                            <button className="filtro-btn">
                                <FiSliders />
                            </button>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <div className="chart-content">
                            <BarChart 
                                data={dados}
                                labelKey="categoria_estabelecimento"
                                valueKey="total_valor_cupom"
                                format="currency"
                                titulo="Receita de cupons por seguimento"/>
                            <KpiHelp kpiKey="top_categorias" variant={windowWidth ? "resumo" : "completo"}/>
                        </div>
                        <div className="chart-content">
                            <BarChart 
                                data={dadosParceiros} 
                                labelKey="nome_estabelecimento"
                                valueKey="total_valor_cupom"
                                format="currency"
                                titulo={"Receita por Lojas parceiras"}/>
                            <KpiHelp kpiKey="top_parceiros" variant={windowWidth ? "resumo" : "completo"}/>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default CeoHome