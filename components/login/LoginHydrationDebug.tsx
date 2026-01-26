"use client";

import { useEffect } from "react";

const INGEST =
  "http://127.0.0.1:7242/ingest/3a03f1e8-5044-4fd7-a566-9802511bf37d";

function log(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string
) {
  fetch(INGEST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location,
      message,
      data,
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId,
    }),
  }).catch(() => {});
}

export function LoginHydrationDebug() {
  useEffect(() => {
    // #region agent log
    const keeperLock = document.querySelectorAll("keeper-lock");
    const keeperById = document.querySelectorAll("[id^='k-']");
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const form = document.querySelector("form");
    const emailDiv = document.getElementById("email")?.parentElement;
    const passwordDiv = document.getElementById("password")?.parentElement;
    const emailDivChildren = emailDiv
      ? Array.from(emailDiv.children).map((c) => c.tagName.toLowerCase())
      : [];
    const passwordDivChildren = passwordDiv
      ? Array.from(passwordDiv.children).map((c) => c.tagName.toLowerCase())
      : [];
    log(
      "LoginHydrationDebug.tsx:useEffect",
      "Client mount – keeper-lock and structure",
      {
        keeperLockCount: keeperLock.length,
        keeperByIdCount: keeperById.length,
        pathname,
        emailDivChildTags: emailDivChildren,
        passwordDivChildTags: passwordDivChildren,
        hasForm: !!form,
      },
      "A"
    );
    if (keeperLock.length > 0) {
      const locations: string[] = [];
      keeperLock.forEach((el, i) => {
        const parent = el.parentElement;
        const inEmail = emailDiv?.contains(el);
        const inPassword = passwordDiv?.contains(el);
        locations.push(`#${i}: inEmail=${inEmail} inPassword=${inPassword} parent=${parent?.tagName ?? "?"}`);
      });
      log(
        "LoginHydrationDebug.tsx:useEffect",
        "keeper-lock placement (H2/H5)",
        { keeperLocations: locations },
        "B"
      );
    }
    // #endregion
  }, []);

  return null;
}
