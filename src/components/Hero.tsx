import Terminal from "./Terminal";

export default function Hero() {
    return (
        <section className="hero section" id="inicio">
            <div className="container hero-grid">
                <div className="hero-content animate-in">
                    <p className="hero-greeting mono">
                        <span className="hero-arrow">{">"}</span> Hola, soy
                    </p>
                    <h1 className="hero-name">
                        Jorge Cuesta
                    </h1>
                    <p className="hero-role">
                        Backend Developer
                    </p>
                    <p className="hero-description">
                        Curioso por naturaleza, siempre buscando nuevos retos y cosas que aprender. Me gusta construir, experimentar y descubrir hasta dónde puedo llevar una idea.
                    </p>
                    <div className="hero-actions">
                        <a href="#proyectos" className="btn btn-primary">
                            Ver proyectos
                        </a>
                        <a href="#contacto" className="btn btn-outline">
                            Contacto
                        </a>
                    </div>
                </div>
                <div className="hero-terminal animate-in" style={{ animationDelay: "0.2s" }}>
                    <Terminal />
                </div>
            </div>
        </section>
    );
}
