import { useCountUp } from "../hooks/useCountUp";

export default function About() {
    const [yearsValue, yearsRef] = useCountUp({ end: 2, suffix: "+" });
    const [projectsValue, projectsRef] = useCountUp({ end: 10, suffix: "+" });
    const [coffeeValue, coffeeRef] = useCountUp({ end: 1200, suffix: "+" });

    return (
        <section className="about section" id="sobre-mi">
            <div className="container">
                <p className="section-title">// sobre mí</p>
                <h2 className="section-heading">El que hay detrás del servidor</h2>

                <div className="about-grid">
                    <div className="about-text">
                        <p>
                            Soy desarrollador backend y, sobre todo, una persona a la que le gusta
                            <strong> entender cómo funcionan las cosas</strong>. Disfruto enfrentándome
                            a problemas nuevos, pensar cómo encajan las piezas y convertir una idea
                            en algo que realmente funcione.
                        </p>
                        <p>
                            Me gusta especialmente diseñar un <strong>flujo completo</strong> antes de ponerme a picar código:
                            entender el problema, explorar diferentes opciones y encontrar una solución que tenga sentido.
                            Si hay una tecnología que no conozco, no me frena; investigo, pruebo y aprendo hasta entender cómo puedo aprovecharla.
                        </p>
                        <p>
                            También disfruto compartiendo ideas y contrastando puntos de vista.
                            No creo que siempre haya una única forma correcta de hacer las cosas,
                            así que me gusta escuchar, cuestionar lo necesario y construir soluciones en equipo.
                            Para mí, aprender de los demás es tan importante como seguir descubriendo cosas por mi cuenta.
                        </p>
                    </div>

                    <div className="about-stats">
                        <div className="stat-card">
                            <span className="stat-number" ref={yearsRef}>{yearsValue}</span>
                            <span className="stat-label">Años de experiencia</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number" ref={projectsRef}>{projectsValue}</span>
                            <span className="stat-label">Proyectos completados</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number" ref={coffeeRef}>{coffeeValue}</span>
                            <span className="stat-label">Cafés consumidos</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
