"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, UserCheck, UserX } from "lucide-react";


export default function AccessRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('access_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setRequests(data);
        setLoading(false);
    };

    const handleApprove = async (request: any) => {
        // 1. Add to authorized_users
        const { error: authError } = await supabase
            .from('authorized_users')
            .insert([{ email: request.email }]);

        if (authError) {
            alert(`Error authorizing user: ${authError.message}`);
            return;
        }

        // 2. Update request status
        const { error: updateError } = await supabase
            .from('access_requests')
            .update({ status: 'approved' })
            .eq('id', request.id);

        if (!updateError) {
            alert(`Approved access for ${request.email}`);
            fetchRequests();
        }
    };

    const handleReject = async (id: string) => {
        const { error } = await supabase
            .from('access_requests')
            .update({ status: 'rejected' })
            .eq('id', id);

        if (!error) {
            fetchRequests();
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Access Requests</h1>

            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Email</th>
                            <th className="p-4 font-medium text-muted-foreground">Status</th>
                            <th className="p-4 font-medium text-muted-foreground">Date</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading requests...</td></tr>
                        ) : requests.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No pending requests.</td></tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium">{req.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                req.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-red-500/10 text-red-500'}`}>
                                            {req.status === 'pending' && <Clock className="w-3 h-3" />}
                                            {req.status === 'approved' && <UserCheck className="w-3 h-3" />}
                                            {req.status === 'rejected' && <UserX className="w-3 h-3" />}
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground text-sm">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleReject(req.id)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10" onClick={() => handleApprove(req)}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
