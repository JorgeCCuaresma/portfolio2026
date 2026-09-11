import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

interface ContactFormModalProps {
    open: boolean;
    onClose: () => void;
}

type SendStatus = "idle" | "sent" | "error";

interface FormFields {
    user_name: string;
    user_email: string;
    message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactFormModal({ open, onClose }: ContactFormModalProps) {
    const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
    const [isClosing, setIsClosing] = useState(false);
    const [confirmDiscard, setConfirmDiscard] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid, isSubmitting },
    } = useForm<FormFields>({ mode: "onTouched" });

    if (!open && !isClosing) return null;

    const triggerClose = () => {
        setConfirmDiscard(false);
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            reset();
            setSendStatus("idle");
            onClose();
        }, 300);
    };

    const handleCloseRequest = () => {
        if (isDirty && sendStatus === "idle") {
            setConfirmDiscard(true);
            return;
        }
        triggerClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleCloseRequest();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") handleCloseRequest();
    };

    const onSubmit = async (data: FormFields) => {
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                data as unknown as Record<string, unknown>,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            );
            setSendStatus("sent");
            setTimeout(() => triggerClose(), 2500);
        } catch {
            setSendStatus("error");
        }
    };

    return (
        <div
            className={`sheet-backdrop${isClosing ? " sheet-backdrop--closing" : ""}`}
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Formulario de contacto"
        >
            <div
                className={`sheet-content${isClosing ? " sheet-content--closing" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sheet-handle" aria-hidden="true" />

                <div className="sheet-header">
                    <h3 className="sheet-title mono">
                        <span className="sheet-title-accent">{">"}</span> Envíame un mensaje
                    </h3>
                    <button
                        className="sheet-close"
                        onClick={handleCloseRequest}
                        aria-label="Cerrar formulario"
                    >
                        ✕
                    </button>
                </div>

                {confirmDiscard && (
                    <div className="sheet-discard-bar" role="alert">
                        <span>¿Descartar los cambios?</span>
                        <div className="sheet-discard-actions">
                            <button className="sheet-discard-btn sheet-discard-btn--cancel" onClick={() => setConfirmDiscard(false)}>
                                Seguir editando
                            </button>
                            <button className="sheet-discard-btn sheet-discard-btn--confirm" onClick={triggerClose}>
                                Descartar
                            </button>
                        </div>
                    </div>
                )}

                {sendStatus === "sent" ? (
                    <div className="modal-success">
                        <span className="modal-success-icon">✓</span>
                        <p>Mensaje enviado correctamente.</p>
                        <p className="modal-success-sub">Te responderé lo antes posible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="modal-form" noValidate>
                        <div className="form-field">
                            <label htmlFor="contact-name" className="form-label mono">nombre</label>
                            <input
                                id="contact-name"
                                type="text"
                                className={`form-input${errors.user_name ? " form-input--error" : ""}`}
                                placeholder="Tu nombre"
                                autoComplete="name"
                                aria-invalid={!!errors.user_name}
                                aria-describedby={errors.user_name ? "err-name" : undefined}
                                {...register("user_name", { required: "El nombre es obligatorio" })}
                            />
                            {errors.user_name && (
                                <p className="form-field-error" id="err-name" role="alert">{errors.user_name.message}</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="contact-email" className="form-label mono">email</label>
                            <input
                                id="contact-email"
                                type="email"
                                className={`form-input${errors.user_email ? " form-input--error" : ""}`}
                                placeholder="tu@email.com"
                                autoComplete="email"
                                aria-invalid={!!errors.user_email}
                                aria-describedby={errors.user_email ? "err-email" : undefined}
                                {...register("user_email", {
                                    required: "El email es obligatorio",
                                    pattern: { value: EMAIL_RE, message: "Introduce un email válido" },
                                })}
                            />
                            {errors.user_email && (
                                <p className="form-field-error" id="err-email" role="alert">{errors.user_email.message}</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="contact-message" className="form-label mono">mensaje</label>
                            <textarea
                                id="contact-message"
                                className={`form-input form-textarea${errors.message ? " form-input--error" : ""}`}
                                placeholder="Cuéntame cómo puedo ayudarte..."
                                rows={4}
                                aria-invalid={!!errors.message}
                                aria-describedby={errors.message ? "err-message" : undefined}
                                {...register("message", { required: "El mensaje es obligatorio" })}
                            />
                            {errors.message && (
                                <p className="form-field-error" id="err-message" role="alert">{errors.message.message}</p>
                            )}
                        </div>

                        {sendStatus === "error" && (
                            <p className="form-error">
                                No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme directamente por email.
                            </p>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary form-submit"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    Enviando
                                    <span className="form-spinner" aria-hidden="true" />
                                </>
                            ) : (
                                "Enviar mensaje"
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
