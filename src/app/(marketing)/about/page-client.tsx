"use client";

import { Target, Eye, CheckCircle } from "lucide-react";
import { useI18n } from "@/components/shared/i18n-provider";

const team = [
  { name: "Kattabek Norbayev", initial: "K", telegram: "https://t.me/NorbayevKattabek", handle: "@NorbayevKattabek" },
  { name: "Javohir Matniyazov", initial: "J", telegram: "https://t.me/javohir_matniyazov", handle: "@javohir_matniyazov" },
];

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

// Structure only; titles + items come from i18n (t.about.roadmapPhases), zipped by index.
const roadmapMeta = [
  { quarter: "Q1 2025", completed: true },
  { quarter: "Q2 2025", completed: true },
  { quarter: "Q3 2025", completed: false },
  { quarter: "Q4 2025", completed: false },
  { quarter: "Q1 2026", completed: false },
];

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <main id="main" className="pt-14">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p className="text-eyebrow mb-4">{t.about.eyebrow}</p>
            <h1 className="text-heading-1 text-ink-strong">{t.about.title}</h1>
            <p className="mt-4 text-body text-muted-foreground max-w-xl mx-auto">{t.about.subtitle}</p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card-lift rounded-xl border border-border bg-card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Target className="h-4 w-4" />
                </div>
                <h2 className="mt-3 text-heading-3 text-ink">{t.about.mission}</h2>
                <p className="mt-2 text-body-sm text-muted-foreground leading-relaxed">{t.about.missionText}</p>
              </div>
              <div className="card-lift rounded-xl border border-border bg-card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/10 text-gold">
                  <Eye className="h-4 w-4" />
                </div>
                <h2 className="mt-3 text-heading-3 text-ink">{t.about.vision}</h2>
                <p className="mt-2 text-body-sm text-muted-foreground leading-relaxed">{t.about.visionText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p className="text-eyebrow mb-4">{t.about.problemEyebrow}</p>
            <h2 className="text-heading-1 text-ink-strong">{t.about.problem}</h2>
            <p className="mt-4 text-body text-muted-foreground max-w-xl mx-auto">{t.about.problemText}</p>
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.about.teamEyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.about.team}</h2>
              <p className="mt-3 text-body text-muted-foreground max-w-lg mx-auto">{t.about.teamSubtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
              {team.map((member, i) => (
                <div key={member.name} className="card-lift flex flex-col rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">{member.initial}</div>
                    <div>
                      <div className="text-body font-semibold text-ink">{member.name}</div>
                      <div className="text-caption text-primary">{t.about.coFounder}</div>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-body-sm text-muted-foreground leading-relaxed">{t.about.founderBios[i]}</p>
                  <a
                    href={member.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-caption font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <TelegramIcon className="h-3.5 w-3.5" />
                    {member.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="border-t border-border py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center mb-10">
              <p className="text-eyebrow mb-3">{t.about.roadmapEyebrow}</p>
              <h2 className="text-heading-1 text-ink-strong">{t.about.roadmap}</h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />
              {roadmapMeta.map((phase, i) => {
                const content = t.about.roadmapPhases[i];
                return (
                  <div key={phase.quarter} className={`relative mb-6 flex items-start gap-6 md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-4 top-2 -translate-x-1/2 md:left-1/2">
                      <div className={`h-3 w-3 rounded-full border-2 ${phase.completed ? "border-primary bg-primary" : "border-border bg-card"}`} />
                    </div>
                    <div className="ml-10 md:ml-0 md:w-1/2">
                      <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-body-sm font-semibold text-primary">{phase.quarter}</span>
                          {phase.completed && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <h3 className="mt-1 text-body-sm font-semibold text-ink">{content.title}</h3>
                        <ul className="mt-2 space-y-0.5">
                          {content.items.map((item) => (
                            <li key={item} className="text-caption text-muted-foreground">&middot; {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
