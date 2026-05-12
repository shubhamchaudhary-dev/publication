'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ShieldCheck, Shield } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { UserRole, useAuthStore } from '@/store/authStore';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    institution?: string;
    isRootAdmin?: boolean;
    createdAt: string;
}

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const { user: me } = useAuthStore();
    const amIRootAdmin = !!me?.isRootAdmin;

    const { data: usersData, isLoading } = useQuery<{ data: AdminUser[] }>({
        queryKey: ['admin', 'users'],
        queryFn: async () => (await api.get('/api/admin/users')).data,
    });

    const changeRoleMutation = useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            await api.put(`/api/admin/users/${id}/role`, { role });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/api/admin/users/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });

    // Can the current logged-in admin change this user's role?
    const canChangeRole = (u: AdminUser) => {
        if (u._id === me?.id) return false;        // can't change own role
        if (u.isRootAdmin) return false;            // can't change root admin
        if (u.role === 'admin') return amIRootAdmin; // only root admin can demote admin
        return true;                                // reader/researcher — any admin can change
    };

    // Should the admin option be visible in the dropdown?
    const showAdminOption = amIRootAdmin;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-serif text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Manage Users</h1>
                {!amIRootAdmin && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-lg">
                        ⚠ Only the Root Admin can assign or remove admin roles
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#1F2937] rounded-xl border border-[#E2E8F0] dark:border-[#374151] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#F1F5F9] dark:bg-[#1e293b] text-[#475569] dark:text-[#CBD5E1] uppercase text-xs tracking-wider border-b border-[#E2E8F0] dark:border-[#334155]">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Joined</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#374151] text-[#0F172A] dark:text-[#F1F5F9]">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
                            ) : usersData?.data?.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-[#64748B] dark:text-[#94A3B8]">No users found.</td></tr>
                            ) : (
                                usersData?.data?.map(u => (
                                    <tr key={u._id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#111827] transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                {/* Role icon badge */}
                                                {u.isRootAdmin ? (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md flex-shrink-0" title="Root Admin">
                                                        <ShieldCheck className="w-5 h-5 text-white" />
                                                    </div>
                                                ) : u.role === 'admin' ? (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0" title="Admin">
                                                        <Shield className="w-5 h-5 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-[#E2E8F0] dark:bg-[#374151] flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-[#64748B] dark:text-[#94A3B8]">{u.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span>{u.name}</span>
                                                        {u.isRootAdmin && (
                                                            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Root Admin</span>
                                                        )}
                                                    </div>
                                                    {u.institution && <div className="text-xs text-[#64748B] font-normal">{u.institution}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">
                                            {u.isRootAdmin ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                    <ShieldCheck className="w-3 h-3" /> Root Admin
                                                </span>
                                            ) : canChangeRole(u) ? (
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => changeRoleMutation.mutate({ id: u._id, role: e.target.value })}
                                                    disabled={changeRoleMutation.isPending}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                >
                                                    <option value="reader">Reader</option>
                                                    <option value="researcher">Researcher</option>
                                                    {showAdminOption && <option value="admin">Admin</option>}
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold uppercase ${
                                                    u.role === 'admin' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    u.role === 'researcher' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                }`}>
                                                    {u.role === 'admin' && <Shield className="w-3 h-3" />}
                                                    {u.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            {!u.isRootAdmin && u._id !== me?.id && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => { if (confirm('Delete user permanently?')) deleteMutation.mutate(u._id); }}
                                                    className="p-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
