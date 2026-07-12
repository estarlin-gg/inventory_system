-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, adjust policies as needed)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can manage suppliers"
  ON suppliers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add cost column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost NUMERIC NOT NULL DEFAULT 0;

-- Add cost column to sale_products table (for tracking investment per sale)
ALTER TABLE sale_products ADD COLUMN IF NOT EXISTS cost NUMERIC NOT NULL DEFAULT 0;
