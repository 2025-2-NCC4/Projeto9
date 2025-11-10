import streamlit as st
import pandas as pd
import plotly.express as px
from datetime import date

st.set_page_config(page_title="Análise Financeira PicMoney", layout="wide", page_icon="💰")

st.markdown("""
    <style>
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
        div[data-testid="metric-container"] {
            background-color: #1a1d24;
            padding: 18px;
            border-radius: 12px;
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

if "data_captura" in df.columns:
    df["data_captura"] = pd.to_datetime(df["data_captura"], errors="coerce")

# ----------------------------- SIDEBAR -----------------------------
st.sidebar.title("⚙️ Filtros do Dashboard")
st.sidebar.markdown("---")

# Filtro por categoria
if "categoria_estabelecimento" in df.columns:
    categorias = st.sidebar.multiselect(
        "🏷️ Categoria do Estabelecimento",
        options=sorted(df["categoria_estabelecimento"].dropna().unique()),
        default=sorted(df["categoria_estabelecimento"].dropna().unique())
    )
    df = df[df["categoria_estabelecimento"].isin(categorias)]

# Filtro por tipo de cupom
if "tipo_cupom" in df.columns:
    tipos = st.sidebar.multiselect(
        "🏷️ Tipo de Cupom",
        options=sorted(df["tipo_cupom"].dropna().unique()),
        default=sorted(df["tipo_cupom"].dropna().unique())
    )
    df = df[df["tipo_cupom"].isin(tipos)]

st.sidebar.markdown("---")
st.sidebar.info(f"📊 Registros filtrados: **{len(df):,}**".replace(",", "."))

# ---------------------------- MÉTRICAS -----------------------------

st.markdown("## 💰 **Análise do CFO**")

col1, col2, col3 = st.columns(3)

col1.metric("📄 Total de Registros", f"{len(df):,}".replace(",", "."))

if "valor_cupom" in df.columns:
    soma_valores = df["valor_cupom"].sum()
    media_valores = df["valor_cupom"].mean()

    col2.metric("💵 Soma dos Valores",
        f"R$ {soma_valores:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

    col3.metric("📈 Média por Registro",
        f"R$ {media_valores:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

st.divider()

# ------------------------------- ABAS --------------------------------

aba1, aba2, aba3, aba4, aba5 = st.tabs([
    "📊 Categoria",
    "📈 Evolução",
    "🥧 Proporção",
    "🏷️ Tipo de Cupom",
    "📋 Dados"
])

# ABA 1: Categoria
with aba1:
    st.subheader("📊 Cupom x Compra por Categoria")

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
            template="plotly_dark"
        )

        graf.update_layout(
            xaxis_title="Categoria",
            yaxis_title="Valor Total (R$)",
            font=dict(size=14)
        )

        st.plotly_chart(graf, use_container_width=True)
    else:
        st.warning("⚠️ Colunas necessárias não encontradas.")

# ABA 2: Evolução
with aba2:
    st.subheader("📈 Evolução Diária dos Valores")

    if "data_captura" in df.columns and "valor_cupom" in df.columns:
        df_data = (
            df.dropna(subset=["data_captura"])
              .assign(dia=lambda x: x["data_captura"].dt.date)
              .groupby("dia", as_index=False)["valor_cupom"]
              .sum()
        )

        df_data = df_data.sort_values("dia")
        df_data["dia"] = pd.to_datetime(df_data["dia"])

        graf2 = px.line(
            df_data,
            x="dia",
            y="valor_cupom",
            markers=True,
            template="plotly_dark"
        )

        graf2.update_layout(
            xaxis_title="Data",
            yaxis_title="Total de Valores (R$)",
            font=dict(size=30)
        )

        graf2.update_xaxes(tickformat="%d/%m/%Y", tickangle= -45, nticks=12)
        graf2.update_traces(hovertemplate="Data: %{x|%d/%m/%Y}<br>Total: R$ %{y:,.2f}")

        st.plotly_chart(graf2, use_container_width=True)

    else:
        st.warning("⚠️ Colunas 'data_captura' e 'valor_cupom' ausentes.")

# ✅ ABA 3: Proporção (agora corretamente dentro da aba)
with aba3:
    st.subheader("🥧 Proporção por Categoria")

    if "categoria_estabelecimento" in df.columns:
        proporcao = df["categoria_estabelecimento"].value_counts().reset_index()
        proporcao.columns = ["Categoria", "Quantidade"]

        fig_prop = px.pie(
            proporcao,
            names="Categoria",
            values="Quantidade",
            hole=0.45,
            title="Distribuição de Categorias"
        )

        fig_prop.update_traces(
            textposition="inside",
            textinfo="percent+label",
            pull=[0.03]*len(proporcao),
            insidetextorientation='radial'
        )

        fig_prop.update_layout(
            showlegend=True,
            legend_title_text="Categorias",
            title_x=0.5,
            margin=dict(l=10, r=10, t=60, b=10),
            font=dict(size=14),
        )

        st.plotly_chart(fig_prop, use_container_width=True)

    else:
        st.warning("⚠️ Coluna 'categoria_estabelecimento' não encontrada.")

# ABA 4: Tipo de Cupom
with aba4:
    st.subheader("🏷️ Análise por Tipo de Cupom")

    if "tipo_cupom" in df.columns and "valor_cupom" in df.columns:
        df_tipo = df.groupby("tipo_cupom")["valor_cupom"].sum().reset_index()

        graf4 = px.bar(
            df_tipo,
            x="tipo_cupom",
            y="valor_cupom",
            text_auto=".2s",
            template="plotly_dark"
        )
        graf4.update_layout(
            xaxis_title="Tipo de Cupom",
            yaxis_title="Valor Total (R$)",
            font=dict(size=14)
        )

        st.plotly_chart(graf4, use_container_width=True)

        graf5 = px.pie(
            df_tipo,
            values="valor_cupom",
            names="tipo_cupom",
            hole=0.35,
            template="plotly_dark"
        )
        graf5.update_traces(textinfo="percent+label")
        st.plotly_chart(graf5, use_container_width=True)

    else:
        st.warning("⚠️ Colunas necessárias não encontradas.")

# ABA 5: Dados Originais
with aba5:
    st.subheader("📋 Dados Originais")
    st.dataframe(df, use_container_width=True, height=600)

st.markdown("<div class='custom-footer'>💼 Desenvolvido por <b>JsonBond</b> — Streamlit Dashboard © 2025</div>", unsafe_allow_html=True)
