"use client";
import React, { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import axios from "axios";
import { ObjectCard } from "@/components/ObjectCard";
import { ObjectForm } from "@/components/ObjectForm";
import { Cpu, LayoutGrid } from "lucide-react";

export default function Dashboard() {
  const [objects, setObjects] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch initial
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/objects`)
      .then((res) => setObjects(res.data));

    // 2. Écoute temps réel
    socket.on("objectCreated", (newObj) => {
      setObjects((prev) => [newObj, ...prev]);
    });

    socket.on("objectDeleted", (id) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    });

    return () => {
      socket.off("objectCreated");
      socket.off("objectDeleted");
    };
  }, []);

  const deleteObj = (id: string) =>
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/objects/${id}`);

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <Cpu size={22} className="text-black" />
            </div>
            <span className="font-bold tracking-tighter text-xl">
              HEYAMA <span className="font-light text-zinc-500">LABS</span>
            </span>
          </div>
          <ObjectForm />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Flux de données</h2>
          <p className="text-zinc-500 mt-2">
            Synchronisation S3 & MongoDB en temps réel active.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {objects.map((obj) => (
            <ObjectCard key={obj._id} obj={obj} onDelete={deleteObj} />
          ))}
        </div>

        {objects.length === 0 && (
          <div className="text-center py-40 border border-dashed border-zinc-800 rounded-3xl">
            <LayoutGrid className="mx-auto text-zinc-800 mb-4" size={48} />
            <p className="text-zinc-600 uppercase tracking-widest text-[10px]">
              En attente de données entrantes...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
