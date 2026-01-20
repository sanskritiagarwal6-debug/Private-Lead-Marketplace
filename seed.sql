-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    registration_date DATE NOT NULL,
    price_standard DECIMAL NOT NULL,
    price_exclusive DECIMAL NOT NULL,
    status TEXT DEFAULT 'available',
    image_url TEXT
);

-- Insert data
INSERT INTO public.leads (title, brand, mileage, registration_date, price_standard, price_exclusive, status, image_url)
VALUES
    ('2023 Aston Martin Vantage V8', 'Aston Martin', 1200, '2023-01-15', 5000, 25000, 'available', '/aston-martin.jpg'),
    ('2022 Audi R8 V10 Performance', 'Audi', 4500, '2022-06-20', 4500, 22000, 'available', '/audi-r8.jpg'),
    ('2024 Audi RS6 Avant', 'Audi', 500, '2024-02-10', 5500, 28000, 'available', '/audi-rs6.jpg'),
    ('2023 Bentley Continental GT Speed', 'Bentley', 2100, '2023-11-05', 6000, 30000, 'available', '/bentley-continental.jpg'),
    ('2022 Lamborghini Huracán EVO RWD', 'Lamborghini', 3200, '2022-08-30', 7000, 35000, 'available', '/lamborghini-huracan.jpg'),
    ('2021 McLaren 720S Spider', 'McLaren', 5500, '2021-04-12', 6500, 32000, 'available', '/mclaren-720s.jpg'),
    ('2023 Porsche 911 GT3 RS', 'Porsche', 800, '2023-09-18', 7500, 38000, 'available', '/porsche-911.jpg'),
    ('2023 Range Rover Autobiography LWB', 'Land Rover', 1500, '2023-03-25', 4000, 20000, 'available', '/range-rover.jpg');
