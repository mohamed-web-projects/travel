"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import {
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { CONTACT_INFO } from "@/data/travelData";

const socials = [
  { label: "Facebook", icon: FacebookIcon },
  { label: "Twitter", icon: XIcon },
  { label: "LinkedIn", icon: LinkedinIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "TikTok", icon: TikTokIcon },
];

const inputClass =
  "h-13 w-full border-b-2 border-slate-300 bg-transparent px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-600 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500";

export function ContactSection() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3500);
    }, 900);
  };

  return (
    <section
      id="contact"
      className="cvi relative scroll-mt-20 overflow-hidden border-t border-slate-200 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Plan your escape with us"
          description="Tell us where the world should take you next — our advisors reply within a few hours."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6"
          >
            {[
              { icon: User, label: "Name", value: CONTACT_INFO.name },
              { icon: Mail, label: "Email", value: CONTACT_INFO.email },
              { icon: MapPin, label: "Address", value: CONTACT_INFO.address },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-base font-semibold text-foreground">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              {socials.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-hairline text-muted-foreground transition-all duration-500 hover:rotate-180 hover:border-primary hover:text-primary hover:shadow-glow"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <input required className={inputClass} type="text" placeholder="Name" aria-label="Name" />
              <input required className={inputClass} type="email" placeholder="Email" aria-label="Email" />
            </div>
            <input className={inputClass} type="text" placeholder="Subject" aria-label="Subject" />
            <textarea
              required
              className="h-32 w-full resize-none border-b-2 border-slate-300 bg-transparent px-3 py-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-600 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500"
              placeholder="Tell us about your dream trip…"
              aria-label="Message"
            />
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : sent ? (
                  "Message sent ✓"
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}