import { api } from '@/lib/api';

export interface KPIResponse {
  mes_atual?: number;
  mes_anterior?: number;
  variacao_percent?: number;
  trend?: 'up' | 'down';
}

export interface ReceitaTotalResponse extends KPIResponse {
  total_valor_cupom: number;
}

export interface ReceitaLiquidaResponse extends KPIResponse {
  receita_liquida: number;
}

export interface UsuariosResponse extends KPIResponse {
  total_usuarios: number;
}

export interface TicketMedioResponse {
  ticket_medio: number;
}

export interface SegmentoItem {
  categoria_estabelecimento: string;
  total_ocorrencias: number;
  total_valor_cupom: number;
  media_valor_cupom: number;
}

export interface SegmentosResponse {
  filtros: any;
  seguimentos: SegmentoItem[];
}

export interface ParceiroItem {
  nome_estabelecimento: string;
  total_ocorrencias: number;
  total_valor_cupom: number;
  media_valor_cupom: number;
}

export interface ParceirosResponse {
  filtros: any;
  parceiros: ParceiroItem[];
}

export interface CategoriaItem {
  categoria_frequentada: string;
  total_usuarios: number;
  total_pegou_cupom: number;
  percentual_cupom: number;
}

export interface RetencaoResponse {
  usuarios_prev: number;
  usuarios_cur: number;
  usuarios_retidos: number;
  retencao_percentual: number;
}

export interface InativosPorMesItem {
  mes: string;
  inativos_qnt: number;
}

export interface CupomDadosItem {
  tipo_cupom: string;
  quantidade: number;
  total_valor_cupom: number;
  ticket_medio: number;
  total_repasse: number;
  receita_liquida: number;
  participacao_percentual: number;
}

export interface ParticipacaoPeriodoItem {
  periodo: string;
  quantidade: number;
  total_valor_cupom: number;
  ticket_medio: number;
  participacao_percentual: number;
}

export interface ParticipacaoDiariaItem {
  dow: number;
  dia_semana: string;
  ticket_medio: number;
  total_por_dia: number;
  participacao_percentual: number;
}

export interface AtivosPorSemanaItem {
  dia_semana: string;
  ordem_semana: number;
  usuarios_ativos_mes: number;
  media_diaria_no_mes: number;
}

export interface UsuariosUltimos30dItem {
  dia: string;
  usuarios: number;
}

export interface TempoSessaoItem {
  faixa: string;
  qtd: number;
  percentual: number;
}

export interface SessoesPorUsuarioItem {
  id_usuario: string;
  sessoes: number;
}

export interface ZonaItem {
  zona: string;
  total_usuarios: number;
  percentual: number;
}

export interface UsuariosPorZonaResponse {
  periodo: {
    start?: string;
    end?: string;
  };
  total_zonas: number;
  data: ZonaItem[];
}

export interface BairroItem {
  bairro: string;
  total_usuarios: number;
  percentual: number;
}

export interface UsuariosPorBairroResponse {
  periodo: {
    start?: string;
    end?: string;
  };
  tipo: string;
  total_bairros: number;
  data: BairroItem[];
}

export interface DiarioMensalItem {
  dia: string;
  total_valor_cupom: number;
  total_valor_compra: number;
  total_repasse_picmoney: number;
  total_cupons: number;
  total_campanhas: number;
}

export interface DiarioMensalResponse {
  month: string;
  days: DiarioMensalItem[];
}

export interface Receita30DiasItem {
  dia: string;
  receita: number;
}

export interface Receita30DiasResponse {
  dados: Receita30DiasItem[];
}

export interface FilterParams {
  start?: string;
  end?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  tipo?: 'bairro_residencial' | 'bairro_trabalho' | 'bairro_escola';
  meses?: number;
}

export const kpisService = {
  // CEO KPIs
  getReceitaTotal: async () => {
    const { data } = await api.get<ReceitaTotalResponse>('/api/kpis/receita-total');
    return data;
  },

  getReceitaLiquida: async () => {
    const { data } = await api.get<ReceitaLiquidaResponse>('/api/kpis/receita-liquida');
    return data;
  },

  getTotalSegmentos: async (params?: FilterParams) => {
    const { data } = await api.get<SegmentosResponse>('/api/kpis/total-segmentos', { params });
    return data;
  },

  getTotalParceiros: async (params?: FilterParams) => {
    const { data } = await api.get<ParceirosResponse>('/api/kpis/total-parceiros', { params });
    return data;
  },

  getUsuarios: async () => {
    const { data } = await api.get<UsuariosResponse>('/api/kpis/usuarios');
    return data;
  },

  getPrincipaisCategorias: async () => {
    const { data } = await api.get<{ principais_categorias: CategoriaItem[] }>('/api/kpis/principais-categorias');
    return data;
  },

  getRetencao: async () => {
    const { data } = await api.get<RetencaoResponse>('/api/kpis/retencao');
    return data;
  },

  getInativosPorMes: async (meses: number = 6) => {
    const { data } = await api.get<{ inativos_14_por_mes: InativosPorMesItem[]; meses: number }>('/api/kpis/inativos-14/por-mes', {
      params: { meses },
    });
    return data;
  },

  // CFO KPIs
  getTicketMedio: async () => {
    const { data } = await api.get<TicketMedioResponse>('/api/kpis/ticket-medio');
    return data;
  },

  getReceitaPorCupom: async () => {
    const { data } = await api.get<{ dados_cupons: CupomDadosItem[] }>('/api/kpis/receita-por-cupom');
    return data;
  },

  getParticipacaoPorPeriodo: async () => {
    const { data } = await api.get<ParticipacaoPeriodoItem[]>('/api/kpis/participacao-por-periodo');
    return data;
  },

  getParticipacaoDiaria: async () => {
    const { data } = await api.get<ParticipacaoDiariaItem[]>('/api/kpis/participacao-diaria');
    return data;
  },

  // Cliente - Localização
  getAtivosPorSemana: async () => {
    const { data } = await api.get<AtivosPorSemanaItem[]>('/api/kpis/ativos-por-semana');
    return data;
  },

  getUsuariosUltimos30d: async () => {
    const { data } = await api.get<UsuariosUltimos30dItem[]>('/api/kpis/usuarios-ultimos-30d');
    return data;
  },

  getTempoSessao: async (params?: FilterParams) => {
    const { data } = await api.get<TempoSessaoItem[]>('/api/kpis/tempo-sessao/time', { params });
    return data;
  },

  getSessoesPorUsuario: async (params?: FilterParams) => {
    const { data } = await api.get<SessoesPorUsuarioItem[]>('/api/kpis/sessoes-por-usuario', { params });
    return data;
  },

  getUsuariosPorZona: async (params?: FilterParams) => {
    const { data } = await api.get<UsuariosPorZonaResponse>('/api/kpis/usuarios-por-zona', { params });
    return data;
  },

  getUsuariosPorBairro: async (params?: FilterParams) => {
    const { data } = await api.get<UsuariosPorBairroResponse>('/api/kpis/usuarios-por-bairro', { params });
    return data;
  },

  getDiarioMensal: async (month?: string) => {
    const { data } = await api.get<DiarioMensalResponse>('/api/kpis/diario-mensal', {
      params: month ? { month } : undefined,
    });
    return data;
  },

  getReceita30Dias: async (): Promise<Receita30DiasResponse> => {
    const { data } = await api.get<Receita30DiasResponse>('/api/kpis/receita-ultimos-30-dias');
    return data;
  },
};
