export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: ProductImage[];
  categories: Category[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
