export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  badge: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}
