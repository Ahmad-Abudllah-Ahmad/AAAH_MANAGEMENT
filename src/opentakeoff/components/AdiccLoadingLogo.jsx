// Loading mark: reveals the AAAH logo from left to right, loops until unmounted.
import React from "react";

export default function AdiccLoadingLogo() {
  return (
    <>
      <style>{`
        @keyframes aaah-logo-reveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; }
          10% { opacity: 1; }
          50% { clip-path: inset(0 0 0 0); opacity: 1; }
          80% { clip-path: inset(0 0 0 0); opacity: 1; }
          90% { opacity: 0; }
          100% { clip-path: inset(0 100% 0 0); opacity: 0; }
        }
        .aaah-logo-reveal-img {
          animation: aaah-logo-reveal 2.5s cubic-bezier(0.4, 0.05, 0.45, 0.95) infinite;
          object-fit: contain;
          display: block;
          height: 36px;
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: "148px", height: "36px" }}>
        <img 
          src="/AAAH-Icon-Light-Off-White.webp" 
          alt="AAAH Loading" 
          className="aaah-logo-reveal-img" 
        />
      </div>
    </>
  );
}
