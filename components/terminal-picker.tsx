'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Search, ChevronDown, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PickupPoint {
  id: string // SmartPost ID
  uuid: string // Montonio UUID for shipment creation
  name: string
  city: string
  address?: string
  postalCode?: string
}

interface TerminalPickerProps {
  value: string
  onChange: (terminalName: string, terminalUuid: string) => void
  required?: boolean
}

export function TerminalPicker({ value, onChange, required = false }: TerminalPickerProps) {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTerminal, setSelectedTerminal] = useState<PickupPoint | null>(null)

  // Fetch pickup points on mount
  useEffect(() => {
    async function fetchPickupPoints() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/montonio/pickup-points')
        const data = await response.json()
        
        if (data.terminals && data.terminals.length > 0) {
          setPickupPoints(data.terminals)
        } else if (data.error) {
          setError(data.error)
        } else {
          setError('Pakiautomaatide laadimine ebaõnnestus')
        }
      } catch (err) {
        console.error('Error fetching pickup points:', err)
        setError('Pakiautomaatide laadimine ebaõnnestus')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPickupPoints()
  }, [])

  // Filter pickup points based on search term
  const filteredPoints = useMemo(() => {
    if (!searchTerm) return pickupPoints
    
    const search = searchTerm.toLowerCase()
    return pickupPoints.filter(point => 
      point.name.toLowerCase().includes(search) ||
      point.city.toLowerCase().includes(search) ||
      (point.address && point.address.toLowerCase().includes(search))
    )
  }, [pickupPoints, searchTerm])

  // Group by city
  const groupedPoints = useMemo(() => {
    const groups: Record<string, PickupPoint[]> = {}
    for (const point of filteredPoints) {
      const key = point.city || 'Muu'
      if (!groups[key]) groups[key] = []
      groups[key].push(point)
    }
    // Sort groups alphabetically
    const sorted: Record<string, PickupPoint[]> = {}
    Object.keys(groups).sort().forEach(key => {
      sorted[key] = groups[key]
    })
    return sorted
  }, [filteredPoints])

  const handleSelect = (point: PickupPoint) => {
    setSelectedTerminal(point)
    onChange(point.name, point.uuid)
    setIsOpen(false)
    setSearchTerm('')
  }

  if (error) {
    // Fallback to text input if API fails
    return (
      <div className="space-y-2">
        <Label htmlFor="terminal" className="text-gray-900 font-semibold flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-600" />
          Smartpost Pakiautomaat *
        </Label>
        <Input
          id="terminal"
          value={value}
          onChange={(e) => onChange(e.target.value, '')}
          placeholder="Nt. Tartu Lõunakeskus Smartpost pakiautomaat"
          required={required}
          className="pl-4 text-gray-900 placeholder:text-gray-500"
        />
        <p className="text-xs text-amber-600">Pakiautomaatide loend pole saadaval, sisesta manuaalselt</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="terminal-picker" className="text-gray-900 font-semibold flex items-center">
        <MapPin className="w-4 h-4 mr-2 text-gray-600" />
        Smartpost Pakiautomaat *
      </Label>
      
      <div className="relative">
        {/* Selected value or search input */}
        <div
          className={cn(
            "flex items-center w-full border rounded-md bg-white cursor-pointer transition-colors",
            isOpen ? "ring-2 ring-orange-400 border-orange-400" : "border-input hover:border-gray-400"
          )}
          onClick={() => !isLoading && setIsOpen(!isOpen)}
        >
          {isLoading ? (
            <div className="flex items-center px-4 py-2 text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Laadin pakiautomaate...
            </div>
          ) : isOpen ? (
            <div className="flex items-center w-full px-3 py-1">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Otsi linna või terminali nime järgi..."
                className="flex-1 py-1 outline-none text-gray-900 placeholder:text-gray-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-4 py-2">
              <span className={selectedTerminal ? "text-gray-900" : "text-gray-500"}>
                {selectedTerminal ? selectedTerminal.name : "Vali pakiautomaat..."}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )} />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-auto">
            {Object.keys(groupedPoints).length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                Pakiautomaate ei leitud
              </div>
            ) : (
              Object.entries(groupedPoints).map(([locality, points]) => (
                <div key={locality}>
                  <div className="sticky top-0 px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 border-b">
                    {locality}
                  </div>
                  {points.map((point) => (
                    <div
                      key={point.uuid}
                      className={cn(
                        "px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-orange-50 transition-colors",
                        selectedTerminal?.uuid === point.uuid && "bg-orange-100"
                      )}
                      onClick={() => handleSelect(point)}
                    >
                      <div>
                        <div className="text-gray-900">{point.name}</div>
                        {point.address && (
                          <div className="text-xs text-gray-500">{point.address}</div>
                        )}
                      </div>
                      {selectedTerminal?.uuid === point.uuid && (
                        <Check className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}

        {/* Hidden input for form validation */}
        <input
          type="hidden"
          id="terminal-picker"
          name="terminal"
          value={value}
          required={required}
        />
      </div>

      {selectedTerminal && (
        <p className="text-xs text-green-600 flex items-center">
          <Check className="w-3 h-3 mr-1" />
          Valitud: {selectedTerminal.city}
        </p>
      )}
    </div>
  )
}
