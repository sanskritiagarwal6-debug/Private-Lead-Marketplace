"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
import { Trash2, RefreshCcw, Search, UserX, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";

interface User {
    id: string;
    email: string;
    created_at: string;
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
        open: false,
        user: null,
    });
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('authorized_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setUsers(data);
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteDialog.user) return;

        // Prevent deleting admin
        if (deleteDialog.user.email === 'admin@luxemarket.com') {
            alert("Cannot delete the admin account.");
            setDeleteDialog({ open: false, user: null });
            return;
        }

        setActionLoading(deleteDialog.user.id);
        const { error } = await supabase
            .from('authorized_users')
            .delete()
            .eq('id', deleteDialog.user.id);

        if (!error) {
            setUsers(prev => prev.filter(u => u.id !== deleteDialog.user!.id));
        }
        setDeleteDialog({ open: false, user: null });
        setActionLoading(null);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAdmin = (email: string) => email === 'admin@luxemarket.com';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage authorized users ({users.length} total)
                    </p>
                </div>
                <Button variant="ghost" onClick={fetchUsers} disabled={loading}>
                    <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10"
                />
            </div>

            {/* Table */}
            <div className="glass rounded-xl border border-white/10 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white/5 hover:bg-white/5">
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-48 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-8 bg-white/5 rounded animate-pulse ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {user.email}
                                            {isAdmin(user.email) && (
                                                <Shield className="w-4 h-4 text-primary" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAdmin(user.email)
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {isAdmin(user.email) ? 'Admin' : 'User'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!isAdmin(user.email) && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => setDeleteDialog({ open: true, user })}
                                                disabled={actionLoading === user.id}
                                            >
                                                <UserX className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
                <DialogContent onClose={() => setDeleteDialog({ open: false, user: null })}>
                    <DialogHeader>
                        <DialogTitle>Revoke User Access</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to revoke access for "{deleteDialog.user?.email}"?
                            They will be logged out immediately and won't be able to access the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteDialog({ open: false, user: null })}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            <UserX className="w-4 h-4 mr-2" />
                            Revoke Access
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
