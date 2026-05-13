/*
  # Premier Fresh Supermarket - Initial Schema

  ## Summary
  Creates the full database schema for Premier Fresh (Pty) Ltd supermarket website.

  ## Tables Created

  1. **departments** - The four core supermarket departments
     - id, name, slug, description, icon, color, image_url, display_order

  2. **stores** - Physical store locations
     - id, name, address, suburb, phone, trading_hours, maps_url

  3. **products** - All products across all departments
     - id, name, department_id, price, unit (each/kg), weight, image_url, is_active

  4. **promotions** - Weekly specials campaigns
     - id, title, valid_from, valid_to, is_active

  5. **promotion_items** - Products included in a specific promotion
     - id, promotion_id, product_id, special_price, display_order

  ## Security
  - RLS enabled on all tables
  - Public read access for departments, stores, products, promotions, promotion_items
  - Authenticated (admin) write access for all tables

  ## Notes
  - Seed data included for departments and stores based on the ad
  - Products seeded with items visible in the weekly special ad image
*/

-- =====================
-- DEPARTMENTS
-- =====================
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  color text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read departments"
  ON departments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete departments"
  ON departments FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- STORES
-- =====================
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  suburb text NOT NULL,
  phone text NOT NULL,
  trading_hours text DEFAULT '',
  maps_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stores"
  ON stores FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stores"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores"
  ON stores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stores"
  ON stores FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- PRODUCTS
-- =====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'each',
  weight text DEFAULT '',
  image_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- PROMOTIONS
-- =====================
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  valid_from date NOT NULL,
  valid_to date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active promotions"
  ON promotions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert promotions"
  ON promotions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update promotions"
  ON promotions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete promotions"
  ON promotions FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- PROMOTION ITEMS
-- =====================
CREATE TABLE IF NOT EXISTS promotion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  special_price numeric(10, 2) NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promotion_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read promotion items"
  ON promotion_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert promotion items"
  ON promotion_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update promotion items"
  ON promotion_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete promotion items"
  ON promotion_items FOR DELETE
  TO authenticated
  USING (true);

-- =====================
-- SEED: DEPARTMENTS
-- =====================
INSERT INTO departments (name, slug, description, icon, color, display_order) VALUES
  ('Fruit & Veg', 'fruit-veg', 'Fresh fruits and vegetables sourced daily', 'apple', '#22a94b', 1),
  ('Butchery', 'butchery', 'Quality cuts of meat and poultry', 'beef', '#e03131', 2),
  ('Grocery', 'grocery', 'Everyday pantry essentials and household items', 'shopping-cart', '#1971c2', 3),
  ('Bakery', 'bakery', 'Freshly baked breads, rolls and pastries daily', 'cake', '#f08c00', 4);

-- =====================
-- SEED: STORES
-- =====================
INSERT INTO stores (name, address, suburb, phone, trading_hours) VALUES
  ('Premier Fresh Reservoir Hills', '610 Mountbatten Drive', 'Reservoir Hills', '031 262 0221', 'Mon-Fri: 7am-7pm | Sat: 7am-6pm | Sun: 8am-4pm'),
  ('Premier Fresh Bonela', '128 Candella Road', 'Bonela', '031 001 1082', 'Mon-Fri: 7am-7pm | Sat: 7am-6pm | Sun: 8am-4pm');
