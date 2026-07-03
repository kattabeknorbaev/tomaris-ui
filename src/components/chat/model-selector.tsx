"use client";

import { useState } from "react";
import { useChatStore } from "@/stores/chat-store";
import { cn } from "@/lib/utils";
import { ChevronDown, Zap, Cpu, Code2 } from "lucide-react";
import type { ModelType } from "@/types";

const models: {
  id: ModelType;
  name: string;
  desc: string;
  icon: typeof Zap;
}[] = [
  {
    id: "tomaris-27b",
    name: "Tomaris 27B",
    desc: "Most capable",
    icon: Cpu,
  },
  {
    id: "tomaris-fast",
    name: "Tomaris Fast",
    desc: "Optimized for speed",
    icon: Zap,
  },
  {
    id: "tomaris-code",
    name: "Tomaris Code",
    desc: "Best for coding",
    icon: Code2,
  },
];

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const { model, setModel } = useChatStore();
  const current = models.find((m) => m.id === model) || models[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
      >
        <span className="font-medium text-[13px]">{current.name}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-muted-foreground transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <div className="p-1">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setModel(m.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted",
                    model === m.id && "bg-muted"
                  )}
                >
                  <m.icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {m.desc}
                    </div>
                  </div>
                  {model === m.id && (
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
