import {useEffect, useState} from "react";
import { FiPieChart, FiUsers, FiX } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { RiShoppingBag3Line } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import "../Sidebar/Sidebar.scss"


const itens = [
    { icon: FiPieChart, label: "Visão geral" },
    { icon: FiUsers, label: "Clientes" },
    { icon: RiShoppingBag3Line, label: "Lojas" },
    { icon: HiOutlineLocationMarker, label: "Região" },
]


const Sidebar = () =>{
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    }, [])
    const toggleMobile = () => setMobileOpen((v) => !v)
    const closeMobile = () => setMobileOpen(false)

    return(
        <>
            <button
            className="sidebar-hamburger"
            onClick={toggleMobile}
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            aria-controls="sidebar-nav"
            >
                <IoMenu size={20}/>
            </button>
            <aside className={`sidebar ${mobileOpen ? "open" : ""}`} role="navigation" id="sidebar-nav">
                <div className="brand">
                    <button className="close-btn" onClick={closeMobile} aria-label="Fechar menu">
                        <FiX size={32}/>
                    </button>
                    <h1 className="titulo-menu">PicBoard</h1>
                </div>
                <nav>
                    <ul className="lista-menu">
                    {itens.map(({icon: Icon, label}) =>
                        <li className="menu-item-container" key={label} onClick={closeMobile}>
                            <Icon size={32}/>
                            <h2 className="menu-item-titulo">{label}</h2>
                        </li>
                    )}
                    </ul>
                </nav>
            </aside>
            {mobileOpen && <div className="sidebar-backdrop" onClick={closeMobile} />}
        </>
    )
}

export default Sidebar