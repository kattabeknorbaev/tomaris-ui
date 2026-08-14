"use client";

import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export function WelcomeScreen() {
  const { data: session } = authClient.useSession();

  // First name from the account (Google name, else the email's local part).
  const rawName = session?.user?.name || session?.user?.email?.split("@")[0] || "";
  const firstName = rawName
    ? rawName.split(/[\s.]+/)[0].replace(/^\w/, (c) => c.toUpperCase())
    : "";

  const greeting = firstName ? `What's on your mind, ${firstName}?` : "What's on your mind?";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-xl"
      >
        <motion.h1
          variants={item}
          className="text-center font-serif text-3xl font-medium tracking-tight text-ink-strong sm:text-[2.5rem] sm:leading-[1.1]"
        >
          {greeting}
        </motion.h1>
      </motion.div>
    </div>
  );
}
