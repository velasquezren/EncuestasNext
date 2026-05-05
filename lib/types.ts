/* ─── Survey Domain Types ─── */

export type TipoRespuesta = "estrellas" | "numerico" | "si_no";

export interface Pregunta {
  id: number;
  texto: string;
  tipo_respuesta: TipoRespuesta;
  valor_min: number;
  valor_max: number;
  is_required: boolean;
}

export interface Seccion {
  id: number;
  nombre: string;
  descripcion: string;
  servicio: string | null;
  preguntas: Pregunta[];
}

export interface Encuesta {
  id: number;
  nombre: string;
  descripcion: string;
  secciones: Seccion[];
}

export interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  servicio: string;
}

export interface EncuestaResponse {
  status: boolean;
  encuesta: Encuesta;
  reserva: Reserva;
}

export interface RespuestaItem {
  pregunta_id: number;
  puntuacion: number;
  comentario: string | null;
}

export interface SubmitPayload {
  comentario_general: string;
  respuestas: RespuestaItem[];
}

export interface SubmitResponse {
  status: boolean;
  message: string;
  completada_at: string;
}

/* ─── UI State Types ─── */

export interface RespuestaState {
  [preguntaId: number]: {
    puntuacion: number | null;
    comentario: string;
  };
}
