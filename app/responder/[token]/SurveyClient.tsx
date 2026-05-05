"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchEncuesta, submitEncuesta } from "@/lib/api";
import type { EncuestaResponse, RespuestaState } from "@/lib/types";
import { StarRating } from "@/app/components/StarRating";
import { NumericRating } from "@/app/components/NumericRating";
import { YesNoRating } from "@/app/components/YesNoRating";
import { CommentField } from "@/app/components/CommentField";
import { ProgressBar } from "@/app/components/ProgressBar";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface SurveyClientProps {
  token: string;
}

type ScreenState = "loading" | "error" | "already_completed" | "survey" | "success";

export function SurveyClient({ token }: SurveyClientProps) {
  const [screen, setScreen] = useState<ScreenState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<EncuestaResponse | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaState>({});
  const [comentarioGeneral, setComentarioGeneral] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token === "demo") {
      setTimeout(() => {
        setData(getMockData());
        setScreen("survey");
      }, 800);
      return;
    }

    fetchEncuesta(token)
      .then((res) => {
        setData(res);
        setScreen("survey");
      })
      .catch((err) => {
        if (err.type === "not_found") {
          setErrorMsg(err.message);
          setScreen("error");
        } else if (err.type === "already_completed") {
          setErrorMsg(err.message);
          setScreen("already_completed");
        } else {
          setErrorMsg(err.message || "Error al cargar la encuesta.");
          setScreen("error");
        }
      });
  }, [token]);

  const handleAnswer = (preguntaId: number, value: number) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: { ...prev[preguntaId], puntuacion: value, comentario: prev[preguntaId]?.comentario || "" },
    }));
  };

  const handleComment = (preguntaId: number, text: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: { ...prev[preguntaId], puntuacion: prev[preguntaId]?.puntuacion ?? null, comentario: text },
    }));
  };

  const secciones = data?.encuesta.secciones || [];
  const isFinalStep = currentStep === secciones.length;
  const currentSection = isFinalStep ? null : secciones[currentStep];

  const canGoNext = () => {
    if (isFinalStep) return true;
    if (!currentSection) return false;
    return currentSection.preguntas.every((q) => {
      if (!q.is_required) return true;
      const ans = respuestas[q.id];
      return ans && ans.puntuacion !== null;
    });
  };

  const handleNext = () => {
    if (canGoNext()) {
      if (isFinalStep) {
        handleSubmit();
      } else {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = {
      comentario_general: comentarioGeneral,
      respuestas: Object.entries(respuestas)
        .filter(([_, ans]) => ans.puntuacion !== null)
        .map(([id, ans]) => ({
          pregunta_id: Number(id),
          puntuacion: ans.puntuacion as number,
          comentario: ans.comentario || null,
        })),
    };

    if (token === "demo") {
      setTimeout(() => {
        setSubmitting(false);
        setScreen("success");
        triggerConfetti();
      }, 1000);
      return;
    }

    try {
      await submitEncuesta(token, payload);
      setScreen("success");
      triggerConfetti();
    } catch (err: any) {
      alert(err.message || "Error al enviar la encuesta");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#4c8b95', '#5fa3ad', '#d4a853', '#ffffff'];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  /* ─── Loading Screen ─── */
  if (screen === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 relative">
        {/* Ambient orb */}
        <div className="ambient-orb w-64 h-64 bg-[var(--color-brand-accent)]/20 top-1/3 left-1/2 -translate-x-1/2" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="relative z-10"
        >
          <Loader2 className="w-12 h-12 text-[var(--color-brand-accent)]" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-medium text-[var(--color-brand-muted)] tracking-widest uppercase relative z-10"
        >
          Cargando encuesta…
        </motion.p>
      </div>
    );
  }

  /* ─── Error / Already Completed ─── */
  if (screen === "error" || screen === "already_completed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="ambient-orb w-96 h-96 bg-[var(--color-brand-accent)]/10 top-1/4 left-1/2 -translate-x-1/2" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="card-elegant max-w-md w-full text-center relative z-10"
        >
          <div className="mx-auto w-16 h-16 mb-6 rounded-full flex items-center justify-center" style={{ background: "var(--color-brand-accent-subtle)" }}>
            <CheckCircle2 className="w-8 h-8 text-[var(--color-brand-accent)]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {screen === "already_completed" ? "Encuesta Completada" : "Enlace Inválido"}
          </h2>
          <p className="text-[var(--color-brand-muted)] leading-relaxed">
            {errorMsg}
          </p>
        </motion.div>
      </div>
    );
  }

  /* ─── Success Screen ─── */
  if (screen === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        {/* Multiple ambient orbs */}
        <div className="ambient-orb w-80 h-80 bg-[var(--color-brand-accent)]/15 top-1/4 left-1/3" />
        <div className="ambient-orb w-60 h-60 bg-[var(--color-brand-gold)]/10 bottom-1/4 right-1/4" style={{ animationDelay: "2s" }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="card-elegant max-w-lg w-full text-center p-12 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-8"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-accent-glow), transparent)",
              border: "2px solid var(--color-brand-accent)",
            }}
          >
            <CheckCircle2 className="w-12 h-12 text-[var(--color-brand-accent)]" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">¡Gracias por tu opinión!</h1>
          <p className="text-lg text-[var(--color-brand-muted)] leading-relaxed">
            Valoramos profundamente el tiempo que has tomado para compartir tu experiencia con nosotros.
          </p>

          {/* Decorative line */}
          <div className="mt-8 mx-auto w-24 h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)" }} />
        </motion.div>
      </div>
    );
  }

  /* ─── Main Survey ─── */
  return (
    <div className="min-h-screen flex flex-col pt-10 pb-40 px-4 md:px-8 relative overflow-hidden">
      {/* Ambient glowing background orbs — teal palette */}
      <div className="ambient-orb w-[500px] h-[500px] bg-[var(--color-brand-accent)]/8 top-[-10%] left-[-5%]" />
      <div className="ambient-orb w-[600px] h-[600px] bg-[var(--color-brand-accent)]/5 bottom-[-15%] right-[-10%]" style={{ animationDelay: "3s" }} />
      <div className="ambient-orb w-[300px] h-[300px] bg-[var(--color-brand-gold)]/5 top-[40%] right-[-5%]" style={{ animationDelay: "5s" }} />

      {/* Header Info */}
      <header className="w-full max-w-3xl mx-auto mb-16 mt-8 relative z-10 flex flex-col items-center">

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-light tracking-[0.2em] text-white mb-10 uppercase opacity-90"
        >
          AFORO
        </motion.h1>
        <div className="w-full max-w-md">
          <ProgressBar current={currentStep + 1} total={secciones.length + 1} />
        </div>
      </header>

      {/* Main Form */}
      <main className="w-full max-w-3xl mx-auto flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {!isFinalStep && currentSection ? (
            <motion.div
              key={`section-${currentSection.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                {currentSection.servicio && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="chip mb-6 inline-block"
                  >
                    {currentSection.servicio}
                  </motion.span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {currentSection.nombre}
                </h2>
                <p className="text-[var(--color-brand-muted)] max-w-xl mx-auto leading-relaxed">
                  {currentSection.descripcion}
                </p>
              </div>

              <div className="space-y-8">
                {currentSection.preguntas.map((pregunta, idx) => (
                  <motion.div
                    key={pregunta.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="card-elegant"
                  >
                    <h3 className="text-xl font-medium text-white mb-8 text-center leading-relaxed">
                      {pregunta.texto}
                      {pregunta.is_required && <span className="text-[var(--color-brand-accent)] ml-2 text-glow">*</span>}
                    </h3>

                    <div className="mb-2">
                      {pregunta.tipo_respuesta === "estrellas" && (
                        <StarRating maxValue={pregunta.valor_max} value={respuestas[pregunta.id]?.puntuacion ?? null} onChange={(val) => handleAnswer(pregunta.id, val)} />
                      )}
                      {pregunta.tipo_respuesta === "numerico" && (
                        <NumericRating min={pregunta.valor_min} max={pregunta.valor_max} value={respuestas[pregunta.id]?.puntuacion ?? null} onChange={(val) => handleAnswer(pregunta.id, val)} />
                      )}
                      {pregunta.tipo_respuesta === "si_no" && (
                        <YesNoRating value={respuestas[pregunta.id]?.puntuacion ?? null} onChange={(val) => handleAnswer(pregunta.id, val)} />
                      )}
                    </div>

                    <CommentField value={respuestas[pregunta.id]?.comentario || ""} onChange={(text) => handleComment(pregunta.id, text)} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Comentarios Finales
                </h2>
                <p className="text-[var(--color-brand-muted)] leading-relaxed">
                  Un último espacio para compartir cualquier otro detalle sobre tu visita.
                </p>
              </div>

              <div className="card-elegant text-left">
                <label className="block text-sm font-semibold text-[var(--color-brand-accent)] mb-4 uppercase tracking-widest">
                  Observaciones Generales (Opcional)
                </label>
                <textarea
                  value={comentarioGeneral}
                  onChange={(e) => setComentarioGeneral(e.target.value)}
                  className="w-full bg-[var(--color-brand-bg)] border border-[var(--color-brand-border)] p-6 rounded-2xl text-white placeholder-[var(--color-brand-muted)] min-h-[200px] resize-y focus:border-[var(--color-brand-accent)] focus:outline-none transition-colors"
                  style={{ boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)" }}
                  placeholder="Nos encantaría saber más..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─── Floating Pill Navigation ─── */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center z-40 pointer-events-none px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="pointer-events-auto p-2 rounded-full flex gap-2"
          style={{
            background: "rgba(13, 61, 69, 0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid var(--color-brand-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(76, 139, 149, 0.1)",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all disabled:opacity-30 text-[var(--color-brand-muted)] hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Atrás</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext() || submitting}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 relative overflow-hidden",
              canGoNext() && !submitting
                ? "text-white"
                : "bg-[var(--color-brand-bg)] text-[var(--color-brand-muted)] cursor-not-allowed border border-[var(--color-brand-border)]"
            )}
            style={
              canGoNext() && !submitting
                ? {
                  background: "linear-gradient(135deg, var(--color-brand-accent), var(--color-brand-accent-hover))",
                  boxShadow: "0 4px 20px var(--color-brand-accent-glow)",
                }
                : undefined
            }
          >
            {/* Shimmer overlay on active button */}
            {canGoNext() && !submitting && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
            )}
            <span className="relative z-10">{submitting ? "Enviando..." : isFinalStep ? "Finalizar" : "Siguiente"}</span>
            {!submitting && (isFinalStep ? <CheckCircle2 className="w-4 h-4 relative z-10" /> : <ArrowRight className="w-4 h-4 relative z-10" />)}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function getMockData(): EncuestaResponse {
  return {
    status: true,
    encuesta: {
      id: 1,
      nombre: "Experiencia Culinaria",
      descripcion: "Tu percepción sobre nuestra atención y ambiente.",
      secciones: [
        {
          id: 1,
          nombre: "Servicio Humano",
          descripcion: "Evalúa la interacción directa con nuestro personal.",
          servicio: null,
          preguntas: [
            { id: 1, texto: "¿Cómo calificarías la amabilidad del personal?", tipo_respuesta: "estrellas", valor_min: 1, valor_max: 5, is_required: true },
            { id: 2, texto: "¿El tiempo de espera fue el adecuado?", tipo_respuesta: "estrellas", valor_min: 1, valor_max: 5, is_required: true },
          ]
        },
        {
          id: 2,
          nombre: "Experiencia Exclusiva",
          descripcion: "Detalles sobre el área restringida.",
          servicio: "Terraza Botánica",
          preguntas: [
            { id: 3, texto: "Valoración global de la estancia", tipo_respuesta: "numerico", valor_min: 1, valor_max: 10, is_required: true },
            { id: 4, texto: "¿Recomendarías esta zona a un amigo?", tipo_respuesta: "si_no", valor_min: 0, valor_max: 1, is_required: false },
          ]
        }
      ]
    },
    reserva: { id: 89312, fecha: "2026-04-28", hora: "20:00:00", servicio: "Terraza Botánica" }
  };
}
