import { API_URL } from "./APIService"

export const fetchDadosPorCupom = async () =>{
    const {data} = await API_URL.get("/kpis/receita-por-cupom")
    return data.dados_cupons || []
}

export const fetchDadosPorDia = async () =>{
    const {data} = await API_URL.get("/kpis/participacao-por-periodo")
    return data || []
}

export const fetchParticipacaoDiaria = async () => {
    const {data} = await API_URL.get("/kpis/participacao-diaria")
    return data || []
}