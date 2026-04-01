"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomePage from "@/components/WelcomePage";
import Dashboard from "@/components/Dashboard";

export default function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="min-h-screen w-full bg-black">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <WelcomePage onStart={() => setIsStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
