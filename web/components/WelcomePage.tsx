"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Globe } from "lucide-react";

export default function WelcomePage({ onStart }: { onStart: () => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="dark relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      {/* --- STRUCTURE --- */}
      <div className="absolute left-[5%] lg:left-[10%] top-0 h-full w-[1px] bg-border/40" />
      <div className="absolute right-[5%] lg:right-[10%] top-0 h-full w-[1px] bg-border/40" />
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border/40 -translate-y-1/2" />

      {/* --- DECOR --- */}
      <div className="hidden sm:flex absolute left-[5%] lg:left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background px-1 py-4 flex-col items-center gap-4">
        <div className="rotate-90 text-[8px] tracking-[0.2em] uppercase text-muted-foreground/50">
          System v1.0
        </div>
        <Cpu size={10} className="text-muted-foreground/30" />
      </div>

      <div className="hidden sm:flex absolute right-[5%] lg:left-[10%] top-1/2 -translate-y-1/2 translate-x-1/2 bg-background px-1 py-4 flex-col items-center gap-4">
        <Globe size={10} className="text-muted-foreground/30" />
        <div className="rotate-90 text-[8px] tracking-[0.2em] uppercase text-muted-foreground/50">
          Secure Protocol
        </div>
      </div>

      {/* --- CONTENT --- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground mb-6">
          Core Engine
        </span>
        <h1 className="text-4xl sm:text-6xl font-light tracking-tighter text-foreground mb-4 italic">
          Heyama{" "}
          <span className="font-bold text-muted-foreground/80 not-italic">
            Test
          </span>
        </h1>
        <p className="max-w-[320px] text-[11px] leading-relaxed text-muted-foreground mb-12 tracking-wide font-light">
          Test d'introduction pour l'integration de l'equipe Heyama.
        </p>

        {/* BOUTON CORRIGÉ */}
        <button
          onClick={onStart}
          className="group relative flex items-center gap-6 border border-border bg-accent/20 px-10 py-5 transition-all hover:bg-foreground hover:text-background active:scale-95 rounded-[3px] overflow-hidden"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
            Démarrer le système
          </span>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-2"
          />
        </button>
      </motion.div>

      <footer className="absolute bottom-10 left-0 w-full flex justify-center py-4 border-t border-border/10">
        <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground/40">
          {currentYear} | Powered By GAS
        </p>
      </footer>
    </div>
  );
}
