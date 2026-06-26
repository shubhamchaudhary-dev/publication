'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ShieldCheck, Shield, Eye, X } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { UserRole, useAuthStore } from '@/store/authStore';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    institution?: string;
    phone?: string;
    dob?: string;
    gender?: string;
    department?: string;
    designation?: string;
    fieldOfResearch?: string;
    researchInterests?: string;
    highestQualification?: string;
    orcid?: string;
    googleScholar?: string;
    linkedin?: string;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    isRootAdmin?: boolean;
    hasMembership?: boolean;
    certificates?: {
        fileUrl: string;
        fileName: string;
        note?: string;
        uploadedAt: string;
    }[];
    createdAt: string;
}

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const { user: me } = useAuthStore();
    const amIRootAdmin = !!me?.isRootAdmin;
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [certFile, setCertFile] = useState<File | null>(null);
    const [certNote, setCertNote] = useState('');

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

    const toggleMembershipMutation = useMutation({
        mutationFn: async ({ id, hasMembership }: { id: string; hasMembership: boolean }) => {
            await api.put(`/api/admin/users/${id}/membership`, { hasMembership });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });

    const uploadCertMutation = useMutation({
        mutationFn: async ({ id, file, note }: { id: string, file: File, note: string }) => {
            const toBase64 = (f: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
            const base64 = await toBase64(file);
            const res = await api.post(`/api/admin/users/${id}/certificates`, {
                pdfBase64: base64,
                fileName: file.name,
                note
            });
            return res.data.data;
        },
        onSuccess: (updatedUser) => {
            setSelectedUser(updatedUser);
            setCertFile(null);
            setCertNote('');
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            alert('Certificate uploaded successfully!');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || err.message || 'Upload failed');
        }
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">Manage Users</h1>
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
                                <th className="px-6 py-4 font-semibold">Membership</th>
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
                                        <td className="px-6 py-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={!!u.hasMembership}
                                                    onChange={(e) => toggleMembershipMutation.mutate({ id: u._id, hasMembership: e.target.checked })}
                                                    disabled={toggleMembershipMutation.isPending}
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0D7C66]/30 dark:peer-focus:ring-[#0D7C66]/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#0D7C66] relative"></div>
                                            </label>
                                        </td>
                                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedUser(u)}
                                                className="p-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                title="View Profile"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
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

            {/* User Profile Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200 relative">
                        <div className="sticky top-0 bg-white dark:bg-[#1E293B] px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">User Profile Details</h2>
                            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-8 text-sm">
                            
                            {/* Personal & Academic Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-[#64748B] uppercase tracking-wider mb-3 text-xs">Personal Info</h3>
                                    <div className="space-y-3 text-[#0F172A] dark:text-[#F1F5F9]">
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Name:</span> <span>{selectedUser.name}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Email:</span> <span>{selectedUser.email}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Phone:</span> <span>{selectedUser.phone || '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">DOB:</span> <span>{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Gender:</span> <span>{selectedUser.gender || '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Location:</span> <span>{[selectedUser.city, selectedUser.state, selectedUser.country].filter(Boolean).join(', ') || '—'}</span></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#64748B] uppercase tracking-wider mb-3 text-xs">Academic Info</h3>
                                    <div className="space-y-3 text-[#0F172A] dark:text-[#F1F5F9]">
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Institution:</span> <span>{selectedUser.institution || '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Department:</span> <span>{selectedUser.department || '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Designation:</span> <span>{selectedUser.designation || '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Field:</span> <span>{selectedUser.fieldOfResearch || '—'}</span></div>
                                        <div className="flex gap-2"><span className="font-semibold text-gray-500 min-w-[100px]">Qualification:</span> <span>{selectedUser.highestQualification || '—'}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Research Interests */}
                            <div>
                                <h3 className="font-bold text-[#64748B] uppercase tracking-wider mb-3 text-xs">Research Interests</h3>
                                <div className="text-[#0F172A] dark:text-[#F1F5F9] bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                                    {selectedUser.researchInterests || 'No research interests listed.'}
                                </div>
                            </div>

                            {/* Short Bio */}
                            <div>
                                <h3 className="font-bold text-[#64748B] uppercase tracking-wider mb-3 text-xs">Biography</h3>
                                <div className="text-[#0F172A] dark:text-[#F1F5F9] bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 whitespace-pre-wrap">
                                    {selectedUser.bio || 'No biography provided.'}
                                </div>
                            </div>

                            {/* Professional Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0 font-bold text-xs">iD</div>
                                    <div className="flex-1 truncate text-xs">
                                        <div className="font-bold text-gray-500">ORCID</div>
                                        <div className="text-[#0EA5A4] truncate">{selectedUser.orcid || '—'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">G</div>
                                    <div className="flex-1 truncate text-xs">
                                        <div className="font-bold text-gray-500">Scholar</div>
                                        <div className="text-[#0EA5A4] truncate">{selectedUser.googleScholar || '—'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs">in</div>
                                    <div className="flex-1 truncate text-xs">
                                        <div className="font-bold text-gray-500">LinkedIn</div>
                                        <div className="text-[#0EA5A4] truncate">{selectedUser.linkedin || '—'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Certificates Section */}
                            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                <h3 className="font-bold text-[#64748B] uppercase tracking-wider mb-4 text-xs">Certificates</h3>
                                
                                {/* Upload New Certificate */}
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 mb-6">
                                    <h4 className="font-semibold text-sm mb-3 text-[#0F172A] dark:text-white">Upload New Certificate</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <input 
                                                type="file" 
                                                accept=".pdf"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#0EA5A4] file:text-white hover:file:bg-[#0d8c8b] dark:file:bg-[#0D7C66] dark:hover:file:bg-[#0a5c4d]"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setCertFile(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <textarea 
                                                value={certNote}
                                                onChange={(e) => setCertNote(e.target.value)}
                                                placeholder="Add an optional note (e.g., 'Certificate for completing peer review 2024')"
                                                className="w-full text-sm p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0EA5A4] outline-none"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button 
                                                size="sm" 
                                                onClick={() => {
                                                    if (!certFile) {
                                                        alert("Please select a PDF file first.");
                                                        return;
                                                    }
                                                    uploadCertMutation.mutate({ id: selectedUser._id, file: certFile, note: certNote });
                                                }}
                                                disabled={uploadCertMutation.isPending || !certFile}
                                                className="bg-[#0EA5A4] hover:bg-[#0d8c8b] text-white"
                                            >
                                                {uploadCertMutation.isPending ? 'Uploading...' : 'Upload Certificate'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* List existing certificates */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-3 text-[#0F172A] dark:text-white">Existing Certificates</h4>
                                    {selectedUser.certificates && selectedUser.certificates.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedUser.certificates.map((cert, idx) => (
                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-lg gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0EA5A4] hover:underline truncate block">
                                                            {cert.fileName}
                                                        </a>
                                                        {cert.note && <p className="text-xs text-gray-500 mt-1 italic break-words">{cert.note}</p>}
                                                        <p className="text-[10px] text-gray-400 mt-1">Uploaded: {new Date(cert.uploadedAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No certificates uploaded yet.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
