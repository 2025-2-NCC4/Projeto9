import React from "react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import "./KpiCard.scss"
import { formatDisplay } from "../../utils/formatters"

const KpiCard = ({titulo, value, currency = false, trend = 0 }) =>{
    const display = formatDisplay(value, {currency})

    const isUp = trend > 0
    const isDown = trend < 0
    const TrendIcon = isUp ? FiTrendingUp : isDown ? FiTrendingDown : FiMinus
    const trendColor = isUp ? "green" : isDown ? "crimson" : "#666"
    const trendText = `${trend > 0 ? "+" : ""}${trend}%`

    return(
        <div className="card-container">
            <div className="card-header">
                
                <h1 className="card-title">{titulo}</h1>
            </div>
            <h1 className="card-info">{display}</h1>
            <div className="card-trend-wrap" style={{color: trendColor}}>
                <span className="card-trend">{trendText}</span>
                <TrendIcon/>
            </div>
        </div>
    )
}

export default KpiCard