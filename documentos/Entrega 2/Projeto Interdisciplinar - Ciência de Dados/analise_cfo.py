import streamlit as st
import pandas as pd
import plotly.express as px


st.set_page_config(page_title="Análise Financeira PicMoney", layout="wide", page_icon="💰")


st.markdown("""
    <style>
        /* Tema escuro refinado */
        .main {
            background-color: #0e1117;
            color: #fafafa;
        }
        h1, h2, h3, h4 {
            color: #f9f9f9;
            text-align: center;
        }
        section[data-testid="stSidebar"] {
            background-color: #11151c;
            color: #fafafa;
        }
        .stSidebar [data-testid="stMarkdownContainer"] {
            text-align: center;
        }
        div[data-testid="metric-container"] {
            background-color: #1a1d24;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
            text-align: center;
        }
        .stButton>button {
            background-color: #005ce6;
            color: white;
            border-radius: 8px;
            border: none;
            padding: 0.5rem 1rem;
        }
        .stButton>button:hover {
            background-color: #0041b3;
        }
        footer {visibility: hidden;}
        .custom-footer {
            text-align: center;
            color: #777;
            font-size: 0.85rem;
            margin-top: 2rem;
        }
    </style>
""", unsafe_allow_html=True)


@st.cache_data
def carregar_dados():
    df = pd.read_excel("PicMoneyDados 2.xlsx", sheet_name="PicMoney-Unificada")
    return df

df = carregar_dados()


st.sidebar.title("⚙️ Filtros do Dashboard")
st.sidebar.markdown("---")


if "data_captura" in df.columns:
    df["data_captura"] = pd.to_datetime(df["data_captura"], errors="coerce")


if "data_captura" in df.columns:
    min_data, max_data = df["data_captura"].min(), df["data_captura"].max()
    data_filtro = st.sidebar.date_input("📅 Período de Captura", [min_data, max_data])

    if len(data_filtro) == 2:
        df = df[
            (df["data_captura"] >= pd.to_datetime(data_filtro[0])) &
            (df["data_captura"] <= pd.to_datetime(data_filtro[1]))
        ]


if "categoria_estabelecimento" in df.columns:
    categorias = st.sidebar.multiselect(
        "🏷️ Categoria do Estabelecimento",
        options=sorted(df["categoria_estabelecimento"].dropna().unique()),
        default=sorted(df["categoria_estabelecimento"].dropna().unique())
    )
    df = df[df["categoria_estabelecimento"].isin(categorias)]

st.sidebar.markdown("---")
st.sidebar.info(f"📊 Registros filtrados: **{len(df):,}**".replace(",", "."))


st.markdown("## 💰 **Análise do CFO**")

col1, col2, col3 = st.columns(3)
col1.metric("📄 Total de Registros", f"{len(df):,}".replace(",", "."))

if "valor_cupom" in df.columns:
    soma_valores = df["valor_cupom"].sum()
    media_valores = df["valor_cupom"].mean()

    col2.metric("💵 Soma dos Valores", f"R$ {soma_valores:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
    col3.metric("📈 Média por Registro", f"R$ {media_valores:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

st.divider()


# ABAS 
aba1, aba2, aba3, aba4, aba5 = st.tabs([
    "📊 Categoria", 
    "📈 Evolução", 
    "🥧 Proporção", 
    "🏷️ Tipo de Cupom", 
    "📋 Dados"
])

# Aba 1: Categoria
with aba1:
    st.subheader("📊 Comparação de Valor do Cupom x Valor da Compra por Categoria")

    if all(col in df.columns for col in ["categoria_estabelecimento", "valor_cupom", "valor_compra"]):
        
        df_cat = df.groupby("categoria_estabelecimento")[["valor_cupom", "valor_compra"]].sum().reset_index()

       
        df_long = df_cat.melt(
            id_vars="categoria_estabelecimento",
            value_vars=["valor_cupom", "valor_compra"],
            var_name="Tipo de Valor",
            value_name="Valor (R$)"
        )

        
        graf = px.bar(
            df_long,
            x="categoria_estabelecimento",
            y="Valor (R$)",
            color="Tipo de Valor",
            barmode="group",
            text_auto=".2s",
            color_discrete_sequence=["#00cc96", "#636efa"]
        )

        graf.update_layout(
            xaxis_title="Categoria do Estabelecimento",
            yaxis_title="Valor Total (R$)",
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa"),
            legend_title="Tipo de Valor"
        )

        graf.update_traces(
            hovertemplate="<b>%{x}</b><br>%{legendgroup}: R$ %{y:,.2f}<extra></extra>"
        )

        st.plotly_chart(graf, use_container_width=True)

    else:
        st.warning("⚠️ Colunas 'categoria_estabelecimento', 'valor_cupom' e 'valor_compra' não encontradas.")



# Aba 2: Evolução temporal
with aba2:
    st.subheader("📈 Evolução dos Valores ao Longo do Tempo")
    if "data_captura" in df.columns and "valor_cupom" in df.columns:
        df_data = df.groupby("data_captura")["valor_cupom"].sum().reset_index()
        graf2 = px.line(
            df_data,
            x="data_captura",
            y="valor_cupom",
            markers=True,
            title="Evolução Diária dos valores de cupom",
            color_discrete_sequence=["#00cc96"]
        )
        graf2.update_layout(
            xaxis_title="Data",
            yaxis_title="Total Diário (R$)",
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa")
        )
        graf2.update_traces(
            hovertemplate="📅 %{x|%d/%m/%Y}<br>💰 Valor: R$ %{y:,.2f}<extra></extra>"
        )
        st.plotly_chart(graf2, use_container_width=True)
    else:
        st.warning("⚠️ Colunas 'data_captura' e 'valor_cupom' não encontradas.")


# Aba 3: Proporção
with aba3:
    st.subheader("🥧 Proporção dos Valores por Categoria")
    if "categoria_estabelecimento" in df.columns and "valor_cupom" in df.columns:
        df_cat = df.groupby("categoria_estabelecimento")["valor_cupom"].sum().reset_index()
        graf3 = px.pie(
            df_cat,
            values="valor_cupom",
            names="categoria_estabelecimento",
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        graf3.update_traces(textinfo="percent+label", pull=[0.05]*len(df_cat))
        graf3.update_layout(
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa")
        )
        st.plotly_chart(graf3, use_container_width=True)
    else:
        st.warning("⚠️ Colunas 'categoria_estabelecimento' e 'valor_cupom' não encontradas.")


# Aba 4: Tipo de Cupom
with aba4:
    st.subheader("🏷️ Análise por Tipo de Cupom")

    if "tipo_cupom" in df.columns and "valor_cupom" in df.columns:
        df_tipo = df.groupby("tipo_cupom")["valor_cupom"].sum().reset_index().sort_values(by="valor_cupom", ascending=False)

        # Gráfico de barras
        graf4 = px.bar(
            df_tipo,
            x="tipo_cupom",
            y="valor_cupom",
            color="tipo_cupom",
            text_auto=".2s",
            title="Soma dos Valores por Tipo de Cupom",
            color_discrete_sequence=px.colors.qualitative.Safe
        )
        graf4.update_layout(
            xaxis_title="Tipo de Cupom",
            yaxis_title="Valor Total (R$)",
            showlegend=False,
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa")
        )
        graf4.update_traces(
            hovertemplate="<b>%{x}</b><br>Valor: R$ %{y:,.2f}<extra></extra>"
        )
        st.plotly_chart(graf4, use_container_width=True)

       
        graf5 = px.pie(
            df_tipo,
            values="valor_cupom",
            names="tipo_cupom",
            title="Proporção de Valores por Tipo de Cupom",
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        graf5.update_traces(textinfo="percent+label", pull=[0.05]*len(df_tipo))
        graf5.update_layout(
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa")
        )
        st.plotly_chart(graf5, use_container_width=True)

    else:
        st.warning("⚠️ Colunas 'tipo_cupom' e 'valor_cupom' não encontradas na base.")


# Aba 5: Dados
with aba5:
    st.subheader("📋 Dados Originais — Aba 'PicMoney-Unificada'")
    st.dataframe(df, use_container_width=True, height=600)


st.markdown("<div class='custom-footer'>💼 Desenvolvido por <b>Pedro Dimitry Zyrianoff</b> — Streamlit Dashboard © 2025</div>", unsafe_allow_html=True)
