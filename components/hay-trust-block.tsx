import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  HAY_TRUST_BRAND_COLOR,
  HAY_TRUST_CTA_HREF,
  HAY_TRUST_CTA_LABEL,
  HAY_TRUST_TEXT,
  HAY_TRUST_TITLE,
} from '@/lib/hay-trust'
import Image from 'next/image'

export function HayTrustBlock() {
  return (
    <div className="mb-16">
      <Card className="overflow-hidden border border-[#D7CBBE] bg-[#E3D8CB]/90 shadow-lg">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0 items-stretch">
            <div className="relative min-h-[220px] md:min-h-[320px]">
              <Image
                src="/merisead-featured.png"
                alt="Papagoi Keskuse merisead heina sees"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <h2
                className="text-2xl md:text-3xl font-bold mb-4 leading-snug"
                style={{ color: HAY_TRUST_BRAND_COLOR }}
              >
                {HAY_TRUST_TITLE}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">{HAY_TRUST_TEXT}</p>
              <a
                href={HAY_TRUST_CTA_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#2F6F4E] to-[#C8A93E] hover:from-[#245a3e] hover:to-[#B39133] text-white border border-[#C8A93E]/80 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 whitespace-normal text-center h-auto"
                >
                  {HAY_TRUST_CTA_LABEL}
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
