"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateQuestionAction() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GOOGLE_API_KEY");
    return "Omlouváme se, AI mozek nemá klíč (GOOGLE_API_KEY chybí).";
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Generuj 3 záludné kvízové otázky pro tým 'Sysmex & Friends'. Témata: Biologie, Popkultura, Brno, Sysmex. Odpovědi ať jsou vtipné a krátké. Formát: 1) Otázka A 2) Otázka B 3) Otázka C. Nepoužívej Markdown formátování, jen prostý text.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Omlouváme se, AI mozek si právě dává pivo. Zkuste to za chvíli.";
  }
}

export async function generateStrategyAction() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("Missing GOOGLE_API_KEY");
    return "Strategický počítač nemá klíč (GOOGLE_API_KEY chybí).";
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Generuj vtipnou a krátkou strategii pro hospodský kvízový tým 'Sysmex & Friends' na příští kolo. Zmiň pivo, soustředění a slabiny v popkultuře. Formát: krátký odstavec nebo 3 body. Nepoužívej Markdown formátování.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Strategický počítač se přehřál. Doporučujeme vsadit vše na náhodu.";
  }
}
