
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Heart,
  Bird,
  Wheat,
  Phone,
  Menu,
  Users,
  BookOpen,
  ShoppingBag,
  Facebook,
  Instagram,
  Youtube,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

type NavItem = {
  name: string
  href: string
  icon: typeof Heart
  match?: (pathname: string) => boolean
  external?: boolean
}

/** 3 fookust esil; e-pood diskreetne; blogi menüüs; papagoi.ee = ainult külastus */
const navigation: NavItem[] = [
  {
    name: 'Merisead',
    href: '/meriseabeebid',
    icon: Heart,
    match: (p) => p.startsWith('/meriseabeebid'),
  },
  {
    name: 'Viirpapagoid',
    href: '/viirpapagoid',
    icon: Bird,
    match: (p) => p.startsWith('/viirpapagoid') || p.startsWith('/papagoid'),
  },
  {
    name: 'Hein',
    href: '/hein',
    icon: Wheat,
    match: (p) => p === '/hein' || p.startsWith('/telli-hein'),
  },
  {
    name: 'Blogi',
    href: '/blogi',
    icon: BookOpen,
    match: (p) => p === '/blogi' || p.startsWith('/blogi/'),
  },
  {
    name: 'E-pood',
    href: '/pood',
    icon: ShoppingBag,
    match: (p) => p.startsWith('/pood'),
  },
  {
    name: 'Meist',
    href: '/meist',
    icon: Users,
    match: (p) => p === '/meist',
  },
  {
    name: 'Kontakt',
    href: '/kontakt',
    icon: Phone,
    match: (p) => p === '/kontakt',
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const linkClass = (isActive: boolean) =>
    `flex items-center space-x-2 px-3 py-2 font-semibold focus-visible:ring-yellow-500 ${
      isActive
        ? 'bg-yellow-300/40 text-green-900 hover:bg-yellow-300/50'
        : 'text-green-800 hover:bg-yellow-200/40 hover:text-green-900'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D7CBBE] bg-[#E3D8CB]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#E3D8CB]/80 relative">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex h-20 md:h-24 items-end pb-1 md:pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-center gap-1.5 pb-1">
              <a
                href="https://www.facebook.com/profile.php?id=100092538633994"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetsVilla Facebook"
                className="text-muted-foreground hover:text-green-800 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/petsvilla_lemmikloomadekodu/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetsVilla Instagram"
                className="text-muted-foreground hover:text-green-800 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@PetsVillaTartu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetsVilla YouTube"
                className="text-muted-foreground hover:text-green-800 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-52 md:h-20 md:w-64 overflow-hidden">
                <Image
                  src="/petsvilla-logo.png"
                  alt="PetsVilla logo"
                  fill
                  sizes="(max-width: 768px) 208px, 256px"
                  className="object-cover object-left mix-blend-multiply scale-115"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navigation.map((item) => {
              const isActive = item.match ? item.match(pathname) : pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button variant="ghost" className={linkClass(isActive)}>
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
            <a
              href="https://papagoi.ee"
              target="_blank"
              rel="noopener noreferrer"
              title="Papagoi Keskus — külastuselamus (papagoi.ee)"
            >
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 font-semibold text-green-800 hover:bg-yellow-200/40 hover:text-green-900"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Külastus</span>
              </Button>
            </a>
          </nav>

          <div className="flex items-center self-start pt-1 md:pt-2">
            {/* Tablet: compact menu trigger when desktop nav hidden */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ava menüü</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-3 mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6A6F68] px-1">
                    Müük · PetsVilla
                  </p>
                  {navigation.map((item) => {
                    const isActive = item.match ? item.match(pathname) : pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start space-x-2 font-semibold focus-visible:ring-yellow-500 ${
                            isActive
                              ? 'bg-yellow-300/40 text-green-900 hover:bg-yellow-300/50'
                              : 'text-green-800 hover:bg-yellow-200/40 hover:text-green-900'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                  <div className="border-t border-[#D7CBBE] pt-3 mt-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6A6F68] px-1 mb-2">
                      Külastuselamus
                    </p>
                    <a
                      href="https://papagoi.ee"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full justify-start space-x-2 font-semibold bg-[#E3D8CB] text-green-900 hover:bg-[#DCCFBE] border border-[#D7CBBE]">
                        <ExternalLink className="h-4 w-4" />
                        <span>Papagoi Keskus (papagoi.ee)</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
