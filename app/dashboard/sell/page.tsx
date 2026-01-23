"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Car, DollarSign, Gauge, FileText, Image, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SellLeadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        mileage: "",
        description: "",
        imageUrl: "",
        brand: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get user email from localStorage
            const userEmail = localStorage.getItem('user_email');

            // Insert the lead with pending status
            const { error } = await supabase
                .from('leads')
                .insert([{
                    title: formData.title,
                    brand: formData.brand || extractBrand(formData.title),
                    price_standard: parseFloat(formData.price) * 0.2, // 20% of exclusive price
                    price_exclusive: parseFloat(formData.price),
                    mileage: parseInt(formData.mileage),
                    registration_date: new Date().toISOString().split('T')[0],
                    moderation_status: 'pending',
                    image_url: formData.imageUrl || '/placeholder-car.jpg',
                    // Note: user_id would be set if using Supabase auth
                }]);

            if (error) {
                console.error('Error submitting lead:', error);
                alert('Error submitting listing. Please try again.');
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to extract brand from title
    const extractBrand = (title: string): string => {
        const brands = ['Aston Martin', 'Audi', 'Bentley', 'BMW', 'Ferrari', 'Lamborghini', 'McLaren', 'Mercedes', 'Porsche', 'Range Rover', 'Land Rover', 'Rolls-Royce'];
        for (const brand of brands) {
            if (title.toLowerCase().includes(brand.toLowerCase())) {
                return brand;
            }
        }
        return 'Other';
    };

    if (success) {
        return (
            <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-2xl mx-auto flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass rounded-2xl p-8 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Listing Submitted!</h2>
                    <p className="text-muted-foreground">Your listing has been submitted for review. You'll be notified once it's approved.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Post a Lead</h1>
                <p className="text-muted-foreground mt-2">Submit your vehicle listing for review. Once approved, it will appear in the marketplace.</p>
            </div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-6 md:p-8 space-y-6"
            >
                {/* Car Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Car className="w-4 h-4 text-primary" />
                        Car Name *
                    </label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., 2023 Porsche 911 GT3 RS"
                        required
                        className="bg-white/5 border-white/10"
                    />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Brand
                    </label>
                    <Input
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g., Porsche (auto-detected if left blank)"
                        className="bg-white/5 border-white/10"
                    />
                </div>

                {/* Price & Mileage Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            Price (Exclusive) *
                        </label>
                        <Input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g., 35000"
                            required
                            min="0"
                            className="bg-white/5 border-white/10"
                        />
                        <p className="text-xs text-muted-foreground">Standard price will be set to 20% of exclusive price.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-blue-500" />
                            Mileage *
                        </label>
                        <Input
                            name="mileage"
                            type="number"
                            value={formData.mileage}
                            onChange={handleChange}
                            placeholder="e.g., 5000"
                            required
                            min="0"
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-500" />
                        Description
                    </label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the vehicle condition, features, and any relevant details..."
                        rows={4}
                    />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Image className="w-4 h-4 text-orange-500" />
                        Image URL
                    </label>
                    <Input
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/car-image.jpg"
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to use a placeholder image.</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 text-base"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit for Review'
                        )}
                    </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to our terms of service. All listings are subject to review before being published.
                </p>
            </motion.form>
        </div>
    );
}
