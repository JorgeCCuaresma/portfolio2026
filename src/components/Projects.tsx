interface WorkItem {
    title: string;
    description: string;
    tech: string[];
    type: string;
}

const work: WorkItem[] = [
    {
        title: "Machine Backend",
        description:
            "Backend para software que se ejecuta directamente en máquinas. Desarrollo de APIs, validaciones de datos y comunicación entre la máquina, el cloud y el frontend.",
        tech: ["TypeScript", "Node.js", "Express", "PostgreSQL", "MQTT", "SSE"],
        type: "backend",
    },
    {
        title: "Microservices",
        description:
            "Participación en la evolución de un backend monolítico hacia una arquitectura basada en microservicios, trabajando con servicios, modelos de datos y comunicación entre componentes.",
        tech: ["TypeScript", "Node.js", "MongoDB", "Service Bus", "Redis"],
        type: "services",
    },
    {
        title: "Real-time Communication",
        description:
            "Desarrollo de flujos para llevar información desde las máquinas hasta el cliente, conectando mensajería, almacenamiento y comunicación en tiempo real.",
        tech: ["MQTT", "Service Bus", "Table Storage", "Redis", "SSE"],
        type: "real-time",
    },
    {
        title: "Internal Tool",
        description:
            "Aplicación interna desarrollada desde cero para resolver una necesidad concreta del equipo, participando en los flujos, modelo de datos y desarrollo de la aplicación.",
        tech: ["TypeScript", "Node.js", "Express", "PostgreSQL"],
        type: "internal",
    },
];

export default function Projects() {
    return (
        <section className="projects section" id="proyectos">
            <div className="container">
                <p className="section-title">// some work</p>
                <h2 className="section-heading">En lo que he trabajado</h2>

                <div className="projects-grid">
                    {work.map((project) => (
                        <article key={project.title} className="project-card">
                            <div className="project-card-header">
                                <span className="project-type mono">{project.type}</span>

                            </div>
                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <div className="project-tech">
                                {project.tech.map((t) => (
                                    <span key={t} className="project-tech-tag mono">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
