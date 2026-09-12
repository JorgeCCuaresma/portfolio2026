export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <p className="footer-text mono">
                    <span className="footer-prompt">{">"}</span> Diseñado y desarrollado por{" "}
                    <strong>Jorge Cuesta</strong> — {new Date().getFullYear()}
                </p>
                <p className="footer-subtext">
                    Construido con React + TypeScript + Vite.
                    El código fuente está en{" "}
                    <a
                        href="https://github.com/JorgeCCuaresma/portfolio2026"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
}
