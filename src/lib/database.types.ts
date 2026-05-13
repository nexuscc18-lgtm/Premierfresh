export interface Database {
  public: {
    Tables: {
      departments: {
        Row: Department;
        Insert: Omit<Department, 'id' | 'created_at'>;
        Update: Partial<Omit<Department, 'id' | 'created_at'>>;
      };
      stores: {
        Row: Store;
        Insert: Omit<Store, 'id' | 'created_at'>;
        Update: Partial<Omit<Store, 'id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      promotions: {
        Row: Promotion;
        Insert: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Promotion, 'id' | 'created_at'>>;
      };
      promotion_items: {
        Row: PromotionItem;
        Insert: Omit<PromotionItem, 'id' | 'created_at'>;
        Update: Partial<Omit<PromotionItem, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  suburb: string;
  phone: string;
  trading_hours: string;
  maps_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  department_id: string | null;
  price: number;
  unit: string;
  weight: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionItem {
  id: string;
  promotion_id: string;
  product_id: string;
  special_price: number;
  display_order: number;
  created_at: string;
}

export interface PromotionItemWithProduct extends PromotionItem {
  products: Product & { departments: Department | null };
}

export interface PromotionWithItems extends Promotion {
  promotion_items: PromotionItemWithProduct[];
}
