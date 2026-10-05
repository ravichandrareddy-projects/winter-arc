"use client";

/**
 * global-error.tsx — catches errors at the root layout level.
 * This replaces the default Vercel/Next.js "This page couldn't load" screen.
 * It must include its own <html> and <body> tags.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Winter Arc — Something went wrong</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#0B0F14;color:#F4F6F8;font-family:system-ui,sans-serif;min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:1.5rem;text-align:center}
          .card{max-width:380px;width:100%}
          .icon{width:64px;height:64px;border-radius:16px;border:1px solid rgba(239,68,68,.3);background:rgba(239,68,68,.1);color:#f87171;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin:0 auto 1rem}
          h1{font-size:1.5rem;font-weight:800;letter-spacing:-.03em}
          p{margin-top:.5rem;font-size:.875rem;color:#8b9ab0;max-width:320px;line-height:1.5}
          .btns{display:flex;gap:.75rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap}
          button{height:44px;border-radius:999px;font-size:.75rem;font-weight:700;cursor:pointer;padding:0 1.5rem;transition:opacity .15s}
          .primary{background:#F4F6F8;color:#0B0F14;border:none}
          .secondary{background:transparent;color:#F4F6F8;border:1px solid rgba(244,246,248,.2)}
          .primary:hover,.secondary:hover{opacity:.8}
          .digest{margin-top:1rem;font-size:.65rem;color:#4a5568;word-break:break-all}
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="icon">!</div>
          <h1>Winter Arc</h1>
          <p>A temporary error occurred. Your progress data is safely preserved — tap Try Again to reload.</p>
          <div className="btns">
            <button className="primary" onClick={() => reset()}>Try Again</button>
            <button className="secondary" onClick={() => { window.location.href = "/"; }}>Reload Page</button>
          </div>
          {error?.digest && (
            <p className="digest">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
