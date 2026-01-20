"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [brands, setBrands] = useState(["Audi", "BMW", "Mercedes", "Porsche", "Lamborghini", "Ferrari", "McLaren", "Rolls-Royce"]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Sync state with URL params on mount
    useEffect(() => {
        const brandParam = searchParams.get('brands');
        if (brandParam) setSelectedBrands(brandParam.split(','));

        const queryParam = searchParams.get('q');
        if (queryParam) setSearchTerm(queryParam);
    }, [searchParams]);

    const updateFilters = (newBrands: string[], newQuery: string) => {
        const params = new URLSearchParams();
        if (newBrands.length > 0) params.set('brands', newBrands.join(','));
        if (newQuery) params.set('q', newQuery);

        router.push(`/dashboard?${params.toString()}`);
    };

    const toggleBrand = (brand: string) => {
        let newBrands;
        if (selectedBrands.includes(brand)) {
            newBrands = selectedBrands.filter(b => b !== brand);
        } else {
            newBrands = [...selectedBrands, brand];
        }
        setSelectedBrands(newBrands);
        updateFilters(newBrands, searchTerm);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Debounce this in a real app
        updateFilters(selectedBrands, e.target.value);
    };

    const clearFilters = () => {
        setSelectedBrands([]);
        setSearchTerm("");
        router.push('/dashboard');
    };

    return (
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="glass p-6 rounded-xl space-y-6">
                <div className="flex items-center justify-between text-primary font-semibold">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </div>
                    {(selectedBrands.length > 0 || searchTerm) && (
                        <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-white flex items-center gap-1">
                            Clear <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="space-y-3">
                    <label className="text-xs uppercase text-muted-foreground font-medium tracking-wider">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Model, Brand..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {/* Brands */}
                <div className="space-y-3">
                    <label className="text-xs uppercase text-muted-foreground font-medium tracking-wider">Make</label>
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                <div
                                    onClick={() => toggleBrand(brand)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'
                                        }`}
                                >
                                    {selectedBrands.includes(brand) && <div className="w-2 h-2 bg-black rounded-sm" />}
                                </div>
                                <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                    {brand}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
