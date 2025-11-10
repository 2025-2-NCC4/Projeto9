import streamlit as st
import pandas as pd
import plotly.express as px
import unicodedata

st.set_page_config(page_title="Análise Operacional PicMoney", layout="wide", page_icon="📊")

st.markdown("""
<style>
    .main { background-color: #0e1117; color: #fafafa; }
    h1, h2, h3, h4 { color: #f9f9f9; text-align: center; }
    section[data-testid="stSidebar"] { background-color: #11151c; color: #fafafa; }
    div[data-testid="metric-container"] {
        background-color: #1a1d24; padding: 20px; border-radius: 12px;
        box-shadow: 0 0 10px rgba(0,0,0,0.4); text-align: center;
    }
    .stButton>button {
        background-color: #005ce6; color: white; border-radius: 8px; border: none;
        padding: 0.5rem 1rem;
    }
    .stButton>button:hover { background-color: #0041b3; }
    footer {visibility: hidden;}
    .custom-footer {
        text-align: center; color: #777; font-size: 0.85rem; margin-top: 2rem;
    }
</style>
""", unsafe_allow_html=True)

@st.cache_data
def carregar_dados():
    df = pd.read_excel("PicMoneyDados.xlsx", sheet_name="PicMoney-Base-Simulada")
    return df

df = carregar_dados()

def normalize(text):
    text = str(text).strip().lower()
    text = ''.join(ch for ch in unicodedata.normalize('NFD', text) if unicodedata.category(ch) != 'Mn')
    return text.replace(" ", "").replace("_", "").replace("-", "")

def find_column(df, candidates):
    norm_map = {normalize(c): c for c in df.columns}
    for cand in candidates:
        if normalize(cand) in norm_map:
            return norm_map[normalize(cand)]
    return None

col_local = find_column(df, ["local", "regiao", "região", "estado", "uf", "cidade"])
col_genero = find_column(df, ["sexo", "genero", "gender"])
col_data = find_column(df, ["data_cadastro", "data", "criado_em", "registro"])
col_id = find_column(df, ["usuario", "user_id", "id_usuario", "cliente"])

st.sidebar.title("⚙️ Filtros da Análise Operacional")
st.sidebar.markdown("---")

if col_local:
    locais = st.sidebar.multiselect(
        "📍 Local / Região",
        options=sorted(df[col_local].dropna().unique()),
        default=sorted(df[col_local].dropna().unique())
    )
    df = df[df[col_local].isin(locais)]

st.sidebar.markdown("---")

if col_genero:
    generos = st.sidebar.multiselect(
        "🧬 Gênero",
        options=sorted(df[col_genero].dropna().unique()),
        default=sorted(df[col_genero].dropna().unique())
    )
    df = df[df[col_genero].isin(generos)]

st.sidebar.markdown("---")
st.sidebar.info(f"👤 Usuários filtrados: **{len(df):,}**".replace(",", "."))

st.markdown("## 📊 Análise do CEO")

col1, col2, col3 = st.columns(3)
col1.metric("👥 Total de Usuários", f"{len(df):,}".replace(",", "."))
col2.metric("🧍‍♂️ Tipos de Gênero", df[col_genero].nunique() if col_genero else "N/A")
col3.metric("📍 Locais Registrados", df[col_local].nunique() if col_local else "N/A")

st.divider()

aba1, aba2, aba3, aba4 = st.tabs([
    "🗺️ Usuários por Local",
    "💠 Perfil de Gênero",
    "🎂 Faixa Etária",
    "📋 Dados Brutos"
])

with aba1:
    st.subheader("🌍 Distribuição de Usuários por Local")

    if col_local:
        df_local = df[col_local].value_counts().reset_index()
        df_local.columns = ["Local", "Usuários"]

        graf1 = px.bar(
            df_local,
            x="Local",
            y="Usuários",
            color="Local",
            text_auto=True,
            color_discrete_sequence=px.colors.qualitative.Vivid
        )

        graf1.update_layout(
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa"),
            xaxis_title="Local",
            yaxis_title="Número de Usuários",
            showlegend=False
        )

        graf1.update_traces(hovertemplate="<b>%{x}</b><br>Usuários: %{y:,}<extra></extra>")

        st.plotly_chart(graf1, use_container_width=True)

        if df_local["Local"].str.len().mean() <= 15:
            st.subheader("🗺️ Mapa Interativo por Local")

            graf2 = px.choropleth(
                df_local,
                locations="Local",
                locationmode="country names",
                color="Usuários",
                color_continuous_scale="blues",
                title="Mapa Interativo de Distribuição"
            )

            graf2.update_layout(
                geo=dict(bgcolor="#0e1117"),
                paper_bgcolor="#0e1117",
                font=dict(color="#fafafa")
            )

            st.plotly_chart(graf2, use_container_width=True)
    else:
        st.warning("⚠️ Coluna 'local' não encontrada.")

with aba2:
    st.subheader("👤 Distribuição de Usuários por Gênero")

    if col_genero:
        df_genero = df[col_genero].value_counts().reset_index()
        df_genero.columns = ["Gênero", "Usuários"]

        graf3 = px.pie(
            df_genero,
            values="Usuários",
            names="Gênero",
            color_discrete_sequence=px.colors.qualitative.Pastel
        )

        graf3.update_traces(textinfo="percent+label", pull=[0.05]*len(df_genero))

        graf3.update_layout(
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa")
        )

        st.plotly_chart(graf3, use_container_width=True)
    else:
        st.warning("⚠️ Coluna de gênero não encontrada.")

with aba3:
    st.subheader("🎂 Distribuição de Usuários por Faixa Etária")

    col_idade = None
    for c in df.columns:
        if "idade" in c.lower():
            col_idade = c
            break

    if col_idade:
        df["faixa_etaria"] = pd.cut(
            df[col_idade],
            bins=[0, 17, 25, 35, 45, 60, 80, 120],
            labels=["<18", "18–25", "26–35", "36–45", "46–60", "61–80", "80+"],
            right=False
        )

        df_faixa = df["faixa_etaria"].value_counts().sort_index().reset_index()
        df_faixa.columns = ["Faixa Etária", "Usuários"]

        graf4 = px.bar(
            df_faixa,
            x="Usuários",
            y="Faixa Etária",
            orientation="h",
            color="Faixa Etária",
            text="Usuários",
            color_discrete_sequence=px.colors.qualitative.Bold
        )

        graf4.update_layout(
            xaxis_title="Número de Usuários",
            yaxis_title="Faixa Etária",
            plot_bgcolor="#0e1117",
            paper_bgcolor="#0e1117",
            font=dict(color="#fafafa"),
            showlegend=False
        )

        graf4.update_traces(
            textposition="outside",
            hovertemplate="🎂 Faixa: %{y}<br>👥 Usuários: %{x:,}<extra></extra>"
        )

        st.plotly_chart(graf4, use_container_width=True)
    else:
        st.warning("⚠️ Nenhuma coluna de idade encontrada.")

with aba4:
    st.subheader("📋 Visualização dos Dados Originais — Aba 'PicMoney-Base-Simulada'")
    st.dataframe(df, use_container_width=True, height=600)

st.markdown("<div class='custom-footer'>Desenvolvido por <b>JsonBond</b> — Streamlit Dashboard © 2025</div>", unsafe_allow_html=True)
