import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nás | SYSMEX & Friends",
  description:
    "Poznej kvízový tým SYSMEX & Friends. Infografika, statistiky a AI centrum pro přípravu na další kolo.",
};

export default function OnasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
