
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, Clock, Tag, Loader2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  publishedDate: string
  category: string
  categories: string[]
  author: string
  animals: string[]
  readTime: number
  coverImage: string
}

export function BlogList() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [mounted, setMounted] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAnimal, setSelectedAnimal] = useState('all')
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
    
    // Fetch blog posts from Notion API
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await fetch('/api/blog-posts')
        
        if (!response.ok) {
          throw new Error('Andmete laadimine ebaõnnestus')
        }
        
        const data = await response.json()
        
        if (data.posts) {
          setPosts(data.posts)
        }
      } catch (err) {
        console.error('Viga andmete laadimisel:', err)
        setError('Ei õnnestunud blogi postitusi laadida.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    if (!posts.length) {
      return
    }
    const animalParam = searchParams.get('loom')
    const categoryParam = searchParams.get('kategooria')

    if (animalParam) {
      setSelectedAnimal(animalParam)
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [posts, searchParams])

  if (!mounted) {
    return <div className="py-20" />
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Laadin blogipostitusi...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const categoryOptions = Array.from(
    new Set(
      posts
        .flatMap((post) => post.categories || (post.category ? [post.category] : []))
        .filter(Boolean)
    )
  ).sort()
  const animalOptions = Array.from(
    new Set(posts.flatMap((post) => post.animals || []).filter(Boolean))
  ).sort()

  const filteredPosts = posts.filter((post) => {
    const postCategories = post.categories || (post.category ? [post.category] : [])
    const matchesCategory =
      selectedCategory === 'all' || postCategories.includes(selectedCategory)
    const matchesAnimal =
      selectedAnimal === 'all' || (post.animals || []).includes(selectedAnimal)
    return matchesCategory && matchesAnimal
  })

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            <BookOpen className="inline-block w-12 h-12 text-purple-500 mr-4" />
            Blogi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Avasta huvitavaid artikleid lemmikloomade hoolduse, toitmise ja tervise kohta.
          </p>
          
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold">Huvitavad artiklid</p>
                <p className="text-sm text-gray-600">Ekspertide nõuanded</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Tag className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold">Erinevad teemad</p>
                <p className="text-sm text-gray-600">Hooldus, toitmine, tervis</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold">Regulaarsed uuendused</p>
                <p className="text-sm text-gray-600">Uued postitused</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 text-center">{error}</p>
          </div>
        )}

        {/* Filters */}
        {posts.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 justify-center">
                <span className="text-sm font-semibold text-gray-700">Loom:</span>
                <Button
                  variant={selectedAnimal === 'all' ? 'default' : 'outline'}
                  className={selectedAnimal === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  size="sm"
                  onClick={() => setSelectedAnimal('all')}
                >
                  Kõik
                </Button>
                {animalOptions.map((animal) => (
                  <Button
                    key={animal}
                    variant={selectedAnimal === animal ? 'default' : 'outline'}
                    className={selectedAnimal === animal ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    size="sm"
                    onClick={() => setSelectedAnimal(animal)}
                  >
                    {animal}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center">
                <span className="text-sm font-semibold text-gray-700">Kategooria:</span>
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  className={selectedCategory === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Kõik
                </Button>
                {categoryOptions.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className={selectedCategory === category ? 'bg-purple-600 hover:bg-purple-700' : ''}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Posts Message */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Blogipostitusi ei leitud valitud filtritega.
            </p>
          </div>
        )}

        {/* Blog Post Cards */}
        {filteredPosts.length > 0 && (
          <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Link href={`/blogi/${post.slug}`}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden group cursor-pointer">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {(post.categories?.length ? post.categories : post.category ? [post.category] : [])
                          .slice(0, 2)
                          .map((category) => (
                            <Badge
                              key={category}
                              variant="default"
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {category}
                            </Badge>
                          ))}
                        {post.animals?.slice(0, 2).map((animal) => (
                          <Badge key={animal} variant="secondary" className="bg-white/90 text-gray-800">
                            {animal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-800 font-medium mb-4 line-clamp-3">
                        {post.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-700 font-semibold pt-4 border-t">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(post.publishedDate).toLocaleDateString('et-EE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} min</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button variant="ghost" className="w-full text-gray-900 font-semibold group-hover:bg-purple-50 group-hover:text-purple-600">
                          Loe edasi
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Soovid rohkem teada?</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Kui sul on küsimusi lemmikloomade hoolduse kohta, võta meiega julgelt ühendust!
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/kontakt">
                    <Button size="lg" className="bg-purple-500 hover:bg-purple-600">
                      Võta ühendust
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline">
                      Avaleht
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
