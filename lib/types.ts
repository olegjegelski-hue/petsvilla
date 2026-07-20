
export interface GuineaPig {
  id: string;
  name: string;
  code?: string;
  price: number;
  color: string;
  age: string;
  gender: string;
  breed?: string;
  birthDate?: string;
  available?: string;
  /** Notion toorstaatus */
  status?: string;
  /** UI märgend: Saadaval | Broneeritud */
  saleDisplay?: 'Saadaval' | 'Broneeritud';
  canBook?: boolean;
  description?: string;
  image: string;
}

export interface Budgie {
  id: string;
  name: string;
  code?: string;
  age: string;
  color: string;
  gender: string;
  price: number;
  personality?: string[];
  description?: string;
  image: string;
  status?: string;
  saleDisplay?: 'Saadaval' | 'Broneeritud';
  canBook?: boolean;
}

/** Petra Aqua e-poe toode (Notion). */
export interface ShopProduct {
  id: string;
  code: string;
  genus: string;
  species: string;
  commonName: string;
  scientificName: string;
  category: string;
  status: string;
  price: number;
  availability: string;
  image: string;
  slug: string;
}
