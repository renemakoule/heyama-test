"use client";

import { motion } from "framer-motion";
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export function ObjectCard({
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
      className="group relative overflow-hidden rounded-[3px] border-boder/50 bg-card hover:shadow-md transition-all"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={obj.imageUrl}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold tracking-tight">{obj.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 font-light">
          {obj.description}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {new Date(obj.createdAt).toLocaleDateString()}
          </span>
          <Button
            onClick={() => onDelete(obj._id)}
            variant="ghost"
            size="icon"
            className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
