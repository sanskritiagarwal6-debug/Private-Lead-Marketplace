"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type FilterType = 'text' | 'checkbox-group' | 'number' | 'select';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterConfig {
    id: string;
    label: string;
    type: FilterType;
    placeholder?: string;
    options?: FilterOption[]; // For select or checkbox-group
}

const BRANDS = ["Audi", "BMW", "Mercedes", "Porsche", "Lamborghini", "Ferrari", "McLaren", "Rolls-Royce"];
const YEARS = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

const filterConfig: FilterConfig[] = [
    {
        id: 'q',
        label: 'Search',
        type: 'text',
        placeholder: 'Model, Brand...'
    },
    {
        id: 'brands',
        label: 'Make',
        type: 'checkbox-group',
        options: BRANDS.map(b => ({ label: b, value: b }))
    },
    {
        id: 'mileage',
        label: 'Max Mileage',
        type: 'number',
        placeholder: 'e.g. 50000'
    },
    {
        id: 'year',
        label: 'Registration Year',
        type: 'select',
        placeholder: 'Select Year',
        options: YEARS.map(y => ({ label: y, value: y }))
    }
];

export default function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State to hold all filter values
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});
    const [isCleared, setIsCleared] = useState(false);

    // Sync state with URL params on mount & when params change (e.g. back button)
    useEffect(() => {
        const newValues: Record<string, any> = {};

        filterConfig.forEach(config => {
            const paramValue = searchParams.get(config.id);
            if (paramValue) {
                if (config.type === 'checkbox-group') {
                    newValues[config.id] = paramValue.split(',');
                } else {
                    newValues[config.id] = paramValue;
                }
            }
        });

        setFilterValues(newValues);
    }, [searchParams]);

    const updateURL = (newValues: Record<string, any>) => {
        const params = new URLSearchParams();

        Object.entries(newValues).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                params.set(key, value.join(','));
            } else if (value && !Array.isArray(value)) {
                params.set(key, value.toString());
            }
        });

        router.push(`/dashboard?${params.toString()}`);
    };

    const handleFilterChange = (id: string, value: any) => {
        const newValues = { ...filterValues, [id]: value };

        // Clean up empty values
        if (!value || (Array.isArray(value) && value.length === 0)) {
            delete newValues[id];
        }

        setFilterValues(newValues);
        // Debounce text inputs could be added here, currently instant update as requested
        updateURL(newValues);
    };

    const toggleCheckbox = (id: string, optionValue: string) => {
        const currentValues = (filterValues[id] as string[]) || [];
        let newValues;

        if (currentValues.includes(optionValue)) {
            newValues = currentValues.filter(v => v !== optionValue);
        } else {
            newValues = [...currentValues, optionValue];
        }

        handleFilterChange(id, newValues);
    };

    const clearFilters = () => {
        setFilterValues({});
        setIsCleared(true);
        router.push('/dashboard');
        // Reset local clearing state after a tick to allow re-selection if needed
        setTimeout(() => setIsCleared(false), 100);
    };

    const [isExpanded, setIsExpanded] = useState(false);
    const hasActiveFilters = Object.keys(filterValues).length > 0;

    return (
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="glass p-6 rounded-xl space-y-6">
                <div className="flex items-center justify-between text-primary font-semibold">
                    <div
                        className="flex items-center gap-2 cursor-pointer lg:cursor-default"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown className={`w-4 h-4 lg:hidden transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-white flex items-center gap-1">
                            Clear <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
                    {filterConfig.map((filter) => (
                        <div key={filter.id} className="space-y-3">
                            <label className="text-xs uppercase text-muted-foreground font-medium tracking-wider">
                                {filter.label}
                            </label>

                            {/* Text Input */}
                            {filter.type === 'text' && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder={filter.placeholder}
                                        className="pl-9"
                                        value={filterValues[filter.id] || ''}
                                        onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                                    />
                                </div>
                            )}

                            {/* Number Input */}
                            {filter.type === 'number' && (
                                <Input
                                    type="number"
                                    placeholder={filter.placeholder}
                                    value={filterValues[filter.id] || ''}
                                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                                />
                            )}

                            {/* Select Input */}
                            {filter.type === 'select' && (
                                <Select
                                    value={filterValues[filter.id] || undefined}
                                    onValueChange={(val: string) => handleFilterChange(filter.id, val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={filter.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filter.options?.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {/* Checkbox Group */}
                            {filter.type === 'checkbox-group' && (
                                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filter.options?.map((opt) => {
                                        const isSelected = (filterValues[filter.id] as string[])?.includes(opt.value);
                                        return (
                                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                                <div
                                                    onClick={() => toggleCheckbox(filter.id, opt.value)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'
                                                        }`}
                                                >
                                                    {isSelected && <div className="w-2 h-2 bg-black rounded-sm" />}
                                                </div>
                                                <span className={`text-sm transition-colors ${isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                                    {opt.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
