"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddLeadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        brand: "",
        mileage: "",
        registration_date: "",
        price_standard: "",
        price_exclusive: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('leads').insert([{
                title: formData.title,
                brand: formData.brand,
                mileage: parseInt(formData.mileage),
                registration_date: formData.registration_date,
                price_standard: parseFloat(formData.price_standard),
                price_exclusive: parseFloat(formData.price_exclusive),
                status: 'available'
            }]);

            if (error) throw error;

            alert("Lead added successfully!");
            router.push('/admin');
        } catch (error) {
            console.error(error);
            alert("Error adding lead");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Lead</h1>

            <div className="glass p-8 rounded-xl border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Car Title</label>
                        <Input name="title" placeholder="e.g. Audi RS6 Avant" required onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Brand</label>
                            <Input name="brand" placeholder="Audi" required onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mileage (km)</label>
                            <Input name="mileage" type="number" placeholder="12000" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Registration Date</label>
                        <Input name="registration_date" type="date" required onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Standard Price (₹)</label>
                            <Input name="price_standard" type="number" placeholder="500000" required onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-primary">Exclusive Price (₹)</label>
                            <Input name="price_exclusive" type="number" placeholder="5000000" required onChange={handleChange} />
                        </div>
                    </div>

                    <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                        {loading ? "Adding Lead..." : "Create Lead"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
