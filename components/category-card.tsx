'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CategoryCardProps {
  title: string
  description: string
  slug: string
  icon: string
  productCount: number
  gradient: string
  index: number
}

export function CategoryCard({
  title,
  description,
  slug,
  icon,
  productCount,
  gradient,
  index,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/pood/${slug}`}>
        <Card className="group h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer border-2">
          <CardContent className={`p-6 h-full ${gradient}`}>
            <div className="flex flex-col h-full">
              <div className="text-6xl mb-4">{icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">{description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {productCount}+ toodet
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:text-green-700 group-hover:translate-x-1 transition-all"
                >
                  Vaata
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
