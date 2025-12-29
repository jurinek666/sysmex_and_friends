export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ngg-footer">
      {/* Signature line */}
      <div className="ngg-footer__glow" aria-hidden="true" />

      <div className="ngg-footer__inner">
        {/* Pixel watermark (subtle) */}
        <div className="ngg-footer__pixel" aria-hidden="true" />

        <div className="ngg-footer__content">
          <div className="ngg-footer__brand">SYSMEX &amp; Friends</div>
          <div className="ngg-footer__meta">&copy; {currentYear} • Všechna práva vyhrazena.</div>
        </div>
      </div>
    </footer>
  );
}
