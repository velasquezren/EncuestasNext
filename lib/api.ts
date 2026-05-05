import type { EncuestaResponse, SubmitPayload, SubmitResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Fetches survey data and reservation info for a given token.
 * Throws structured errors for 404 (not found) and 409 (already completed).
 */
export async function fetchEncuesta(token: string): Promise<EncuestaResponse> {
  const res = await fetch(`${API_BASE}/api/encuestas/responder/${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (res.status === 404) {
    const data = await res.json().catch(() => ({}));
    throw { type: "not_found" as const, message: data.message ?? "Encuesta no encontrada" };
  }

  if (res.status === 409) {
    const data = await res.json().catch(() => ({}));
    throw {
      type: "already_completed" as const,
      message: data.message ?? "Esta encuesta ya fue completada.",
      completada_at: data.completada_at ?? null,
    };
  }

  if (!res.ok) {
    throw { type: "server_error" as const, message: "Error del servidor" };
  }

  return res.json();
}

/**
 * Submits survey responses for a given token.
 */
export async function submitEncuesta(
  token: string,
  payload: SubmitPayload
): Promise<SubmitResponse> {
  const res = await fetch(`${API_BASE}/api/encuestas/responder/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 409) {
    const data = await res.json().catch(() => ({}));
    throw {
      type: "already_completed" as const,
      message: data.message ?? "Esta encuesta ya fue completada.",
      completada_at: data.completada_at ?? null,
    };
  }

  if (!res.ok) {
    throw { type: "server_error" as const, message: "Error al enviar la encuesta" };
  }

  return res.json();
}
