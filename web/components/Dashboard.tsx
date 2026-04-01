"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Plus,
  LayoutGrid,
  Calendar,
  Trash2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import axios from "axios";
import { socket } from "@/lib/socket";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Toaster, toast } from "sonner";

// --- SOUS-COMPOSANT : CARDE ---
function ObjectCard({
  obj,
  onDelete,
}: {
  obj: any;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative overflow-hidden rounded-[3px] border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-500"
    >
      <div className="aspect-video overflow-hidden bg-zinc-800">
        <img
          src={obj.imageUrl}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white tracking-tight">
          {obj.title}
        </h3>
        <p className="text-xs text-zinc-500 mt-2 line-clamp-2 font-light leading-relaxed">
          {obj.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
            <Calendar size={12} />{" "}
            {new Date(obj.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={() => onDelete(obj._id)}
            className="p-2 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- SOUS-COMPOSANT : MODAL ---
function AddModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/objects`, formData);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      toast.success("Enregistrement réussi");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement");
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-zinc-950 border border-white/10 p-10 rounded-[3px] w-full max-w-lg"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-white">
              Nouvelle Entité
            </h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1 font-bold">
              Protocole S3 Cloud
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="title"
            placeholder="Nom de l'objet"
            required
            className="w-full bg-zinc-900 border border-white/5 rounded-[3px] p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
          <Textarea
            name="description"
            placeholder="Description technique..."
            required
            className="w-full bg-zinc-900 border border-white/5 rounded-[3px] p-4 text-white min-h-[120px] focus:outline-none focus:ring-1 focus:ring-white/20"
          />
          <div
            className={`relative border-2 border-dashed border-white/5 rounded-[3px] p-8 flex flex-col items-center transition-colors ${!previewUrl ? "hover:bg-white/5 cursor-pointer" : "bg-white/[0.02]"}`}
          >
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[3px] overflow-hidden border border-white/10 shadow-xl">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-3 -right-3 p-1.5 bg-zinc-900 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all z-10 shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-500 mt-4">
                  Image prête
                </span>
              </div>
            ) : (
              <>
                <Upload className="text-zinc-700 mb-2" />
                <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-600">
                  Sélectionner Image
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              required={!previewUrl}
              onChange={handleFileChange}
              className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${previewUrl ? "hidden" : ""}`}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black h-14 rounded-[3px] font-bold uppercase text-[11px] tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Enregistrer"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL DASHBOARD ---
export default function Dashboard() {
  const [objects, setObjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/objects`)
      .then((res) => setObjects(res.data));
    socket.on("objectCreated", (newObj) =>
      setObjects((prev) => [newObj, ...prev]),
    );
    socket.on("objectDeleted", (id) =>
      setObjects((prev) => prev.filter((o) => o._id !== id)),
    );
    return () => {
      socket.off("objectCreated");
      socket.off("objectDeleted");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-tighter text-xl">Heyama</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-8 py-4 rounded-[3px] hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl"
          >
            <Plus size={16} /> Ajouter un objet
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-16">
        <header className="mb-16">
          <h2 className="text-5xl font-bold tracking-tighter text-white italic">
            Flux{" "}
            <span className="font-light text-zinc-700 underline decoration-zinc-800 underline-offset-8">
              Live
            </span>
          </h2>
          <p className="text-zinc-500 mt-4 text-sm font-light">
            Gestion centralisée des entités MongoDB avec stockage S3.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {objects.map((obj) => (
              <ObjectCard
                key={obj._id}
                obj={obj}
                onDelete={(id) => {
                  const deletePromise = axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/objects/${id}`);
                  toast.promise(deletePromise, {
                    loading: "Suppression encours...",
                    success: "Suppression reussit",
                    error: "Erreur lors de la suppression",
                  });
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {objects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/5 rounded-[3px]">
            <LayoutGrid className="text-zinc-800 mb-4" size={48} />
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-700 font-bold">
              Synchronisation en attente...
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && <AddModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
      <Toaster theme="dark" />
    </div>
  );
}
