interface Skill {
    name: string;
    icon: string;
    category: "backend" | "storage" | "cloud" | "tools" | "messaging";
}

const skills: Skill[] = [
    // Backend
    { name: "TypeScript", icon: "TS", category: "backend" },
    { name: "Node.js", icon: "⬢", category: "backend" },
    { name: "Express", icon: "⚡", category: "backend" },
    { name: "REST APIs", icon: "◈", category: "backend" },
    { name: "SSE", icon: "⇄", category: "backend" },

    // Bases de datos
    { name: "PostgreSQL", icon: "🐘", category: "storage" },
    { name: "TypeORM", icon: "◇", category: "storage" },
    { name: "MongoDB", icon: "🍃", category: "storage" },
    { name: "Azure Table Storage", icon: "◆", category: "storage" },
    { name: "Azure Blob Storage", icon: "▣", category: "storage" },
    { name: "Azure Managed Redis", icon: "◉", category: "storage" },

    // Messaging
    { name: "MQTT", icon: "◌", category: "messaging" },
    { name: "Azure Service Bus", icon: "⇢", category: "messaging" },
    { name: "Redis Pub/Sub", icon: "◉", category: "messaging" },

    // Cloud
    { name: "Azure", icon: "☁", category: "cloud" },
    { name: "Azure Kubernetes Service", icon: "◇", category: "cloud" },
    { name: "Azure CLI", icon: ">", category: "cloud" },
    { name: "Azure Pipelines", icon: "⟳", category: "cloud" },
    { name: "Docker", icon: "🐳", category: "cloud" },

    // Herramientas
    { name: "Visual Studio Code", icon: "▢", category: "tools" },
    { name: "Git", icon: "⑂", category: "tools" },
    { name: "Postman", icon: "▶", category: "tools" },
    { name: "Redis Insight", icon: "◉", category: "tools" },
    { name: "Dbeaver", icon: "◐", category: "tools" },
    { name: "Jest / Vitest", icon: "✓", category: "tools" },
];

const categoryLabels: Record<Skill["category"], string> = {
    backend: "Backend",
    storage: "Datos y almacenamiento",
    messaging: "Mensajería",
    cloud: "Cloud (Azure)",
    tools: "Herramientas",
};

const categoryColors: Record<Skill["category"], string> = {
    backend: "var(--color-primary)",
    storage: "var(--color-secondary)",
    messaging: "var(--color-accent)",
    cloud: "var(--color-accent)",
    tools: "var(--color-warning)",
};

export default function Stack() {
    const categories = Object.keys(categoryLabels) as Skill["category"][];

    return (
        <section className="stack section" id="stack">
            <div className="container">
                <p className="section-title">// stack técnico</p>
                <h2 className="section-heading">Mi stack</h2>

                <div className="stack-grid">
                    {categories.map((cat) => (
                        <div key={cat} className="stack-category">
                            <h3
                                className="stack-category-title mono"
                                style={{ color: categoryColors[cat] }}
                            >
                                {categoryLabels[cat]}
                            </h3>
                            <div className="stack-pills">
                                {skills
                                    .filter((s) => s.category === cat)
                                    .map((skill) => (
                                        <span
                                            key={skill.name}
                                            className="stack-pill"
                                            style={{
                                                borderColor: categoryColors[cat],
                                            }}
                                        >
                                            <span className="stack-pill-icon">{skill.icon}</span>
                                            {skill.name}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
