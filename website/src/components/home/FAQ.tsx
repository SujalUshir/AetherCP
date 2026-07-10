"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/shared/Container";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";
import { GITHUB_ISSUES_URL } from "@/data/navigation";

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const accordionItems = FAQ_ITEMS.map((item) => ({
    id: item.id,
    trigger: item.question,
    content: item.answer,
  }));

  return (
    <section className="relative py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Container size="md">
        <div ref={ref} className="flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked"
              titleHighlight="questions"
              description="Detailed architectural and capability answers. If you require further technical support, feel free to open a diagnostics ticket on GitHub."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-2xl border border-border/60 bg-card px-6 sm:px-8"
          >
            <Accordion items={accordionItems} />
          </motion.div>

          {/* Still have questions? */}
          <motion.a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-indigo-400"
          >
            <MessageSquare className="h-4 w-4" />
            Still have questions? Open a GitHub issue
            <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
          </motion.a>
        </div>
      </Container>
    </section>
  );
}
