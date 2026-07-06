"use client";

import { useChatStore } from "@/stores/chat-store";
import { ChevronDown, Zap, Cpu, Code2 } from "lucide-react";
import type { ModelType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  const model = useChatStore((s) => s.model);
  const setModel = useChatStore((s) => s.setModel);
  const current = models.find((m) => m.id === model) || models[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Model: ${current.name}`}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted data-popup-open:bg-muted"
      >
        <span className="font-medium text-[13px]">{current.name}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform duration-150" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {models.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onClick={() => setModel(m.id)}
            className="items-start gap-2.5 px-3 py-2"
          >
            <m.icon className="mt-0.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div className="flex-1">
              <div className="text-[13px] font-medium">{m.name}</div>
              <div className="text-[11px] text-muted-foreground">{m.desc}</div>
            </div>
            {model === m.id && (
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
