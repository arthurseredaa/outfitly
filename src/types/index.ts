export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

export interface Clothing {
  id: string
  name: string
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'footwear' | 'accessory'
  color: string
  image?: string
  description?: string
  tags?: string[]
  createdAt: Date
}

export interface Outfit {
  id: string
  name: string
  description?: string
  items: Clothing[]
  image?: string
  occasions?: string[]
  weather?: 'warm' | 'cold' | 'mild'
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}
