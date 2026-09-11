import { useState } from "react";
import ContactFormModal from "./ContactFormModal";

export default function Contact() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className="contact section" id="contacto">
            <div className="container">
                <p className="section-title">// contacto</p>
                <h2 className="section-heading">Hablemos</h2>

                <div className="contact-content">
                    <p className="contact-text">
                        Si has llegado hasta aquí, ya tenemos algo en común.
                        Si quieres hablar de tecnología, compartir ideas o simplemente
                        saludar, escríbeme.
                    </p>

                    <div className="contact-links">
                        <a
                            href="mailto:jorgecuesta.90@gmail.com"
                            className="contact-card"
                        >
                            <span className="contact-card-icon">✉</span>
                            <span className="contact-card-label mono">email</span>
                            <span className="contact-card-value">jorgecuesta.90@gmail.com</span>
                        </a>

                        <a
                            href="https://github.com/JorgeCCuaresma"
                            className="contact-card"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="contact-card-icon">⑂</span>
                            <span className="contact-card-label mono">github</span>
                            <span className="contact-card-value">@JorgeCCuaresma</span>
                        </a>

                        <a
                            href="https://linkedin.com/in/jorge-cuesta-cuaresma"
                            className="contact-card"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="contact-card-icon">in</span>
                            <span className="contact-card-label mono">linkedin</span>
                            <span className="contact-card-value">/in/jorge-cuesta-cuaresma</span>
                        </a>
                    </div>

                    <button
                        className="contact-cta"
                        onClick={() => setModalOpen(true)}
                    >
                        Enviar mensaje directo
                    </button>
                </div>
            </div>

            <ContactFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </section>
    );
}
