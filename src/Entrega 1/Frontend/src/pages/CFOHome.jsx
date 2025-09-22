import React, { useEffect, useState } from "react"
import "../pages/CFOHome.scss"
import Sidebar from "../components/Sidebar/Sidebar.jsx"
import BarChart from "../components/ChartBar/ChartBar.jsx";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import { fetchDadosPorCupom, fetchDadosPorDia, fetchParticipacaoDiaria } from "../services/cfoServices.js";
import CupomCard from "../components/CupomCard/CupomCard.jsx";
import KpiHelp from "../components/modal/KpiHelp.jsx";
import PieChart from "../components/PieChart.jsx";


const CfoHome = () => {
    const windowWidth = useMediaQuery("(max-width: 1024px)");
    const [cupons, setCupons] = useState([])
    const [dadosPorDia, setDadosPorDia] = useState([])
    const [dadosDia, setDadosDia] = useState([])
    
    useEffect(() => {
        fetchDadosPorCupom()
            .then(setCupons)
            .catch(console.error)
    }, [])
    
    useEffect(() => {
        fetchDadosPorDia()
            .then(setDadosPorDia)
            .catch(console.error)
    }, [])

    useEffect(() => {
        fetchParticipacaoDiaria()
            .then(setDadosDia)
            .catch(console.error)
    }, [])
    return(
        
        <div className="dashboard-container">
            <Sidebar/>
            <main className="content">
                <section className="section kpi-section">
                    <h1>Dashboard</h1>
                    <div className="kpis-container">
                        {cupons.map(({ tipo_cupom, quantidade, ticket_medio, participacao_percentual }) =>{
                          return (
                            <div className="card-container" key={tipo_cupom}>
                              <CupomCard
                                tipo={tipo_cupom}
                                quantidade={quantidade}
                                ticketMedio={ticket_medio}
                                participacao={participacao_percentual}
                              />
                            </div>
                          )
                        })}
                    </div>
                    <KpiHelp

                    />
                </section>
                <section className="section charts-section-cfo">
                    <h1 className="section-title">Visão Geral</h1>
                        <div className="chart-wrapper">
                            <div className="chart-content">
                                <PieChart
                                    data={cupons}
                                    labelKey="tipo_cupom"
                                    valueKey="participacao_percentual"
                                    format="percent"
                                    titulo="Participação por tipo de cupom"
                                />
                                <KpiHelp kpiKey="analise_cupons_por_tipo" variant={windowWidth ? "resumo" : "completo"}/>
                            </div>
                            <div className="chart-content">
                                <PieChart
                                    data={dadosPorDia}
                                    labelKey="periodo"
                                    valueKey="participacao_percentual"
                                    format="percent"
                                    titulo="Distribuição por período"
                                />
                                <KpiHelp kpiKey="analise_por_periodo_dia" variant={windowWidth ? "resumo": "completo"}/>
                            </div>
                        </div>
                        <h1 className="section-title">Análise Temporal</h1>
                            <div className="chart-wrapper-bar">
                                <div className="chart-content-bar">
                                    <BarChart
                                        data={dadosDia}
                                        labelKey="dia_semana"
                                        valueKey="participacao_percentual"
                                        format="percent"
                                        titulo="Participação Diária"
                                    />
                                    <KpiHelp
                                        kpiKey="analise_temporal_cupom" variant={windowWidth ?  "resumo" : "completo"}
                                    />
                                </div>
                                <div className="chart-content-bar">
                                    <BarChart
                                        data={dadosDia}
                                        labelKey="dia_semana"
                                        valueKey="ticket_medio"
                                        format="currency"
                                        titulo="Ticket Médio Diário"
                                    />
                                    <KpiHelp
                                        kpiKey="analise_temporal_ticket_medio" variant= {windowWidth ?  "resumo" : "completo"}
                                    />
                                </div>
                            </div>
                </section>
            </main>
        </div>
    )
}

export default CfoHome