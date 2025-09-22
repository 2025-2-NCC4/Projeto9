import React from "react";
import "./CupomCard.scss";
import { formatDisplay, formatPercent } from "../../utils/formatters";

const CupomCard = ({ tipo, quantidade, ticketMedio, participacao }) => {
    const ticketFmt = formatDisplay(Number(ticketMedio) || 0, { currency: true })
    const partFmt = formatPercent((Number(participacao) || 0) / 100)

     const partNum = Math.max(0, Math.min(100, Number(participacao) || 0))

    return (
      <div className="cupom-card">
        <h3 className="cupom-titulo">{tipo}</h3>

        <div className="cupom-metrica">
            <div className="metrica">
                <span className="label">Quantidade</span>
                <span className="value">{Number(quantidade) || 0}</span>
            </div>
            <div className="metrica">
                <span className="label">Ticket médio</span>
                <span className="value">{ticketFmt}</span>
            </div>
            <div className="metrica">
                <span className="label">Participação</span>
                <span className="value">{partFmt}</span>
            </div>
        </div>

        <div className="cupom-progresso">
            <div className="bar" style={{ width: `${partNum}%` }} />
        </div>
      </div>
    )
}

export default CupomCard
