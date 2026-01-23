"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Trash2, Clock, CheckCircle, XCircle, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Lead {
    id: string;
    title: string;
    brand: string;
    mileage: number;
    price_exclusive: number;
    status: string;
    moderation_status: string;
    created_at: string;
    image_url: string;
}

export default function ListingsManagementPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; lead: Lead | null }>({
        open: false,
        lead: null,
    });
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setLeads(data);
        setLoading(false);
    };

    const handleApprove = async (lead: Lead) => {
        setActionLoading(lead.id);
        const { error } = await supabase
            .from('leads')
            .update({ moderation_status: 'approved' })
            .eq('id', lead.id);

        if (!error) {
            setLeads(prev => prev.map(l =>
                l.id === lead.id ? { ...l, moderation_status: 'approved' } : l
            ));
        }
        setActionLoading(null);
    };

    const handleReject = async (lead: Lead) => {
        setActionLoading(lead.id);
        const { error } = await supabase
            .from('leads')
            .update({ moderation_status: 'rejected' })
            .eq('id', lead.id);

        if (!error) {
            setLeads(prev => prev.map(l =>
                l.id === lead.id ? { ...l, moderation_status: 'rejected' } : l
            ));
        }
        setActionLoading(null);
    };

    const handleDelete = async () => {
        if (!deleteDialog.lead) return;

        setActionLoading(deleteDialog.lead.id);
        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', deleteDialog.lead.id);

        if (!error) {
            setLeads(prev => prev.filter(l => l.id !== deleteDialog.lead!.id));
        }
        setDeleteDialog({ open: false, lead: null });
        setActionLoading(null);
    };

    const getStatusBadge = (status: string | null) => {
        const s = status || 'approved';
        switch (s) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                        <CheckCircle className="w-3 h-3" /> Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || (lead.moderation_status || 'approved') === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const pendingCount = leads.filter(l => l.moderation_status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Listing Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Moderate user submissions and manage all listings
                        {pendingCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                                {pendingCount} pending
                            </span>
                        )}
                    </p>
                </div>
                <Button variant="ghost" onClick={fetchLeads} disabled={loading}>
                    <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className={filterStatus === status ? '' : 'text-muted-foreground'}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white/5 hover:bg-white/5">
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-40 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-white/5 rounded animate-pulse ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    No listings found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium max-w-[250px] truncate">
                                        {lead.title}
                                    </TableCell>
                                    <TableCell>{lead.brand}</TableCell>
                                    <TableCell className="font-mono">
                                        {formatCurrency(lead.price_exclusive)}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(lead.moderation_status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {(lead.moderation_status !== 'approved' || !lead.moderation_status) && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                    onClick={() => handleApprove(lead)}
                                                    disabled={actionLoading === lead.id}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                            )}
                                            {lead.moderation_status !== 'rejected' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                                    onClick={() => handleReject(lead)}
                                                    disabled={actionLoading === lead.id}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => setDeleteDialog({ open: true, lead })}
                                                disabled={actionLoading === lead.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, lead: null })}>
                <DialogContent onClose={() => setDeleteDialog({ open: false, lead: null })}>
                    <DialogHeader>
                        <DialogTitle>Delete Listing</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteDialog.lead?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, lead: null })}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
