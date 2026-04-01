"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Loader } from "lucide-react";
import axios from "axios";

export function ObjectForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/objects`, formData);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 shadow-lg hover:shadow-primary/20 transition-all gap-2">
          <Plus size={18} />{" "}
          <span className="hidden sm:inline">Nouvel Objet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tighter">
            Déployer un Objet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Information
            </label>
            <Input
              name="title"
              placeholder="Titre de l'entité"
              required
              className="bg-muted/50"
            />
            <Textarea
              name="description"
              placeholder="Description technique..."
              required
              className="bg-muted/50 min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              Fichier Source (S3)
            </label>
            <div className="relative group">
              <input
                type="file"
                name="image"
                required
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center group-hover:bg-accent transition-colors">
                <Upload className="text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">
                  Cliquez pour téléverser
                </span>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              "Initialiser le stockage"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
