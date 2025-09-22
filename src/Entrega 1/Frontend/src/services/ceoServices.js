import { API_URL } from "./APIService"

export const fetchTotalMovimentado = async () =>{
    const {data} = await API_URL.get("/kpis/receita-total")
    return Number(data?.total_valor_cupom ?? 0)
}

export const fetchReceitaLiquida = async () =>{
    const {data} = await API_URL.get("/kpis/receita-liquida")
    return Number(data?.receita_liquida?? 0)
}

export const fetchMargemOperacionalMedia = async () => {
  const [total, receitaLiquida] = await Promise.all([
    fetchTotalMovimentado(),
    fetchReceitaLiquida(),
  ]);
  if (!Number.isFinite(total) || total <= 0) return 0;
  return receitaLiquida / total
};

export const fetchTotalPorSeguimento = async () =>{
    const {data} = await API_URL.get("/kpis/total-seguimentos") 
    return data.seguimentos
}

export const fetchTotalPorParceiros = async () =>{
    const {data} = await API_URL.get("/kpis/total-parceiros")
    return data.parceiros
}

export const fetchTotalPorRegiao = async () =>{
    const { data } = await API_URL.get("/kpis/total-regiao")
    return data
}