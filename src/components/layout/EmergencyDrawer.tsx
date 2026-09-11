"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  X,
  PhoneCall,
  Coins,
  FileBadge,
  ShieldAlert,
  Ambulance,
  Landmark,
} from "lucide-react";
import { EMERGENCY } from "@/data/mockData";
import { cn } from "@/lib/utils";

type Tab = "contacts" | "money" | "visa";

const TABS: { id: Tab; label: string; icon: typeof PhoneCall }[] = [
  { id: "contacts", label: "Contacts", icon: PhoneCall },
  { id: "money", label: "Money", icon: Coins },
  { id: "visa", label: "Visa", icon: FileBadge },
];

export function EmergencyDrawer() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("contacts");

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        aria-label="Emergency & local info"
        className="fixed bottom-5 left-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-primary/40 bg-primary/20 text-primary shadow-glow backdrop-blur-xl transition-colors hover:bg-primary/35 sm:left-6"
      >
        <LifeBuoy className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-sm flex-col border-l border-hairline bg-background/95 backdrop-blur-2xl"
              aria-label="Emergency & local information"
            >
              <div className="flex items-center justify-between border-b border-hairline p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <ShieldAlert className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Traveler safety</h3>
                    <p className="text-xs text-muted-foreground">24/7 assistance</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2 p-4">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    aria-pressed={tab === id}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors",
                      tab === id
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-hairline text-muted-foreground hover:border-foreground/25"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {tab === "contacts" && (
                      <>
                        <InfoRow icon={Ambulance} label="Universal emergency" value={EMERGENCY.international} highlight />
                        <InfoRow icon={PhoneCall} label="REAORI hotline" value={EMERGENCY.helpLine} highlight />
                        <InfoRow icon={Landmark} label="Police (local)" value={EMERGENCY.police} />
                        <InfoRow icon={Ambulance} label="Ambulance (local)" value={EMERGENCY.ambulance} />
                        <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
                          Dial the local number for each destination — the hotel front desk also
                          connects you instantly when you say “REAORI guest”.
                        </p>
                      </>
                    )}

                    {tab === "money" && (
                      <>
                        {EMERGENCY.tips.map((tip) => (
                          <div key={tip.title} className="rounded-xl border border-hairline bg-card p-4">
                            <h4 className="text-sm font-bold text-foreground">{tip.title}</h4>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
                          </div>
                        ))}
                      </>
                    )}

                    {tab === "visa" && (
                      <>
                        <p className="rounded-xl border border-primary/25 bg-primary/[0.07] p-4 text-xs leading-relaxed text-foreground">
                          {EMERGENCY.visaNote}
                        </p>
                        {EMERGENCY.embassies.map((e) => (
                          <InfoRow key={e.country} icon={Landmark} label={e.country} value={e.contact} />
                        ))}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof PhoneCall;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4",
        highlight ? "border-primary/30 bg-primary/[0.08]" : "border-hairline bg-card"
      )}
    >
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}