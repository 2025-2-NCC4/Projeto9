import React, { useEffect, useState } from "react";
import { KPI_INFO } from "../../content/kpisInfo";
import "./KpiHelp.scss";

const KpiHelp = ({ kpiKey, variant }) => {
    const info = KPI_INFO[kpiKey]
    if (!info) return null

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (variant === "completo") {
        return (
            <div className="kpi-help kpi-help--painel">
                <h3 className="kpi-help__titulo">{info.titulo}</h3>
                <p className="kpi-help__body">{info.long}</p>
                <div className="kpi-help__formula">
                  <span>Fórmula:</span> <code>{info.formula}</code>
                </div>
            </div>
        );
    }

  return (
      <div className="kpi-help">
          <button
            className="kpi-help__preview"
            onClick={() => setOpen(true)}
            aria-label={`Ver explicação de ${info.titulo}`}
          >
              <strong>{info.titulo}:</strong> {info.short}
          </button>

      {open && (
          <div
            className="kpi-help__modal"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
          <div
            className="kpi-help__modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="kpi-help__close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
            <h3 className="kpi-help__titulo">{info.titulo}</h3>
            <p className="kpi-help__body">{info.long}</p>
              <div className="kpi-help__formula">
                  <span>Fórmula:</span> <code>{info.formula}</code>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KpiHelp
