import { useState } from "react";

const links = [
    { label: "Inicio", href: "#inicio" },
    { label: "Sobre mí", href: "#sobre-mi" },
    { label: "Stack", href: "#stack" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <a href="#inicio" className="navbar-logo mono">
                    <span className="navbar-logo-bracket">{"{"}</span>
                    JC
                    <span className="navbar-logo-bracket">{"}"}</span>
                </a>

                <button
                    className="navbar-toggle"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-label="Abrir menú de navegación"
                >
                    <span className="navbar-toggle-bar" />
                    <span className="navbar-toggle-bar" />
                    <span className="navbar-toggle-bar" />
                </button>

                <nav className={`navbar-menu ${open ? "navbar-menu--open" : ""}`} aria-label="Navegación principal">
                    <ul className="navbar-list">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="navbar-link"
                                    onClick={() => setOpen(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
