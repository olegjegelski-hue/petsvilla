'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FaqItem } from '@/lib/faq'

type FaqSectionProps = {
  title?: string
  description?: string
  items: FaqItem[]
  className?: string
}

export function FaqSection({
  title = 'Korduma kippuvad küsimused',
  description,
  items,
  className = '',
}: FaqSectionProps) {
  if (!items.length) return null

  return (
    <section
      className={`py-12 md:py-16 ${className}`}
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-8">
          <h2
            id="faq-heading"
            className="section-title mb-3"
          >
            {title}
          </h2>
          {description ? (
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
              {description}
            </p>
          ) : null}
          <div className="w-16 h-1 bg-[#C9BCAA] mx-auto mt-4" />
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-xl border border-[#D7CBBE] bg-[#E3D8CB]/90 px-4 md:px-6 shadow-md"
        >
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="border-[#D7CBBE]"
            >
              <AccordionTrigger className="text-left text-green-900 hover:no-underline hover:text-[#1F6A4C] text-base md:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-sm md:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
