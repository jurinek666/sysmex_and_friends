"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const MISSING_KEY_MSG =
  "AI nemá nastavený klíč. Přidej GOOGLE_API_KEY do souboru .env a restartuj server (viz .env.example).";

/** Z krátkého popisu chyby udělá bezpečný řetězec pro zobrazení uživateli. */
function safeErrorDetail(err: unknown): string {
  const msg =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";
  const sanitized = msg.replace(/[^\w\s.,:;-]/g, " ").trim().slice(0, 200);
  return sanitized ? ` (${sanitized})` : "";
}

function getTextSafe(response: { text: () => string }): string {
  try {
    const text = response.text();
    return typeof text === "string" && text.trim().length > 0
      ? text.trim()
      : "AI nic nevrátila. Zkus to znovu.";
  } catch {
    return "AI odpověděla v nečitelném formátu. Zkus to znovu.";
  }
}

export async function generateQuestionAction(): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    console.error("Missing GOOGLE_API_KEY");
    return MISSING_KEY_MSG;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt =
      "Generuj 3 záludné kvízové otázky pro tým 'Sysmex & Friends'. Témata: Biologie, Popkultura, Brno, Sysmex. Odpovědi ať jsou vtipné a krátké. Formát: 1) Otázka A 2) Otázka B 3) Otázka C. Nepoužívej Markdown formátování, jen prostý text.";

    const result = await model.generateContent(prompt);
    const response = result.response;
    return getTextSafe(response);
  } catch (error) {
    console.error("Gemini API Error:", error);
    const detail = safeErrorDetail(error);
    return `Omlouváme se, AI mozek si právě dává pivo. Zkontroluj GOOGLE_API_KEY a připojení.${detail}`;
  }
}

export async function generateStrategyAction(): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    console.error("Missing GOOGLE_API_KEY");
    return MISSING_KEY_MSG;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt =
      "Generuj vtipnou a krátkou strategii pro hospodský kvízový tým 'Sysmex & Friends' na příští kolo. Zmiň pivo, soustředění a slabiny v popkultuře. Formát: krátký odstavec nebo 3 body. Nepoužívej Markdown formátování.";

    const result = await model.generateContent(prompt);
    const response = result.response;
    return getTextSafe(response);
  } catch (error) {
    console.error("Gemini API Error:", error);
    const detail = safeErrorDetail(error);
    return `Strategický počítač se přehřál. Zkontroluj GOOGLE_API_KEY a připojení.${detail}`;
  }
}
