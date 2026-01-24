import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface TestimonialItem {
  name: string
  text: string
}

interface TestimonialsSectionProps {
  title: string
  items: TestimonialItem[]
  toneClassName?: string
}

export function TestimonialsSection({
  title,
  items,
  toneClassName = 'from-pink-50 via-white to-orange-50 border-pink-100',
}: TestimonialsSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div
          className={`rounded-3xl border bg-gradient-to-br ${toneClassName} p-8 md:p-12 shadow-xl`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
            {title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((item) => (
              <Card key={item.name} className="border-0 bg-white/90 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">“{item.text}”</p>
                  <p className="mt-4 text-sm font-semibold text-gray-900">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
