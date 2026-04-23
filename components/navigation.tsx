
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Heart, Bird, Wheat, Phone, Menu, Users, BookOpen, ShoppingBag, Facebook, Instagram, Youtube } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const navigation = [
  { name: 'Avaleht', href: '/', icon: Home },
  { name: 'Merisead', href: '/merisead', icon: Heart },
  { name: 'Papagoid', href: '/papagoid', icon: Bird },
  { name: 'Hein', href: '/hein', icon: Wheat },
  { name: 'E-pood', href: '/pood', icon: ShoppingBag },
  { name: 'Meist', href: '/meist', icon: Users },
  { name: 'Kontakt', href: '/kontakt', icon: Phone },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isBlogActive = pathname === '/blogi' || pathname.startsWith('/blogi/')

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
                  className="object-cover object-left mix-blend-multiply scale-115"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 px-4 py-2 font-semibold focus-visible:ring-yellow-500 ${
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
          </nav>

          <div className="flex items-center self-start pt-1 md:pt-2">
            <Link href="/blogi" className="hidden md:block">
              <div
                className={`flex h-[4.5rem] w-7 flex-col items-center justify-center gap-0.5 rounded-full border text-[11px] font-semibold leading-[1] tracking-wide transition-colors ${
                  isBlogActive
                    ? 'border-green-800 text-green-800 bg-transparent'
                    : 'border-muted-foreground/60 text-muted-foreground hover:border-green-800 hover:text-green-800'
                }`}
              >
                <span>B</span>
                <span>L</span>
                <span>O</span>
                <span>G</span>
              </div>
            </Link>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ava menüü</span>
                </Button>
              </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/blogi" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start space-x-2 font-semibold bg-yellow-300/50 text-green-900 hover:bg-yellow-300/70">
                    <BookOpen className="h-4 w-4" />
                    <span>BLOG</span>
                  </Button>
                </Link>
                {navigation.map((item) => {
                  const isActive = pathname === item.href
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
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
