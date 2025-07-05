"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail, 
  Calendar,
  Search,
  Edit,
  Trash2,
  Ban,
  Unlock,
  Eye,
  EyeOff,
  Crown,
  Store,
  User,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  getUsers, 
  updateUserRole, 
  banUser, 
  unbanUser, 
  deleteUser, 
  getUserStats,
  updateUserData,
  updateUserPassword,
  User as UserType 
} from "@/app/actions/user-management-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserType> | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      try {
        console.log('Banning user:', userId);
        await banUser(userId);
        console.log('User banned successfully');
        await loadUsers();
        await loadStats();
      } catch (error) {
        console.error('Error banning user:', error);
        alert(`Failed to ban user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      console.log('Unbanning user:', userId);
      await unbanUser(userId);
      console.log('User unbanned successfully');
      await loadUsers();
      await loadStats();
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert(`Failed to unban user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        await loadUsers();
        await loadStats();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleViewEditUser = (user: UserType) => {
    setSelectedUser(user);
    // Only include updatable fields, exclude _count and other computed fields
    const { _count, ...updatableFields } = user;
    setEditForm(updatableFields);
    setShowUserModal(true);
  };

  const handleEditFormChange = (field: keyof UserType, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !editForm) return;
    setSaving(true);
    try {
      await updateUserData(selectedUser.id, editForm);
      
      if (newPassword.trim()) {
        await updateUserPassword(selectedUser.id, newPassword);
      }
      
      setShowUserModal(false);
      setSelectedUser(null);
      setEditForm(null);
      setNewPassword('');
      await loadUsers();
    } catch (error) {
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'RETAILER':
        return <Store className="h-4 w-4 text-blue-600" />;
      case 'BANNED':
        return <Ban className="h-4 w-4 text-red-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'RETAILER':
        return 'bg-blue-100 text-blue-800';
      case 'BANNED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+{stats.newUsersThisMonth} this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Crown className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bannedUsers}</div>
              <p className="text-xs text-muted-foreground">Restricted accounts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User List</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                  <SelectItem value="RETAILER">Retailers</SelectItem>
                  <SelectItem value="USER">Users</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <h3 className="font-semibold text-lg">
                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User'}
                        </h3>
                      </div>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      {user.emailVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{user._count?.orders || 0} orders</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{user._count?.sessions || 0} sessions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateRole(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="RETAILER">Retailer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="BANNED">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {user.role === 'BANNED' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnbanUser(user.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Unlock className="h-4 w-4 mr-1" />
                        Unban
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBanUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Ban
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEditUser(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View/Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* User Edit Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editForm && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSaveUser(); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <Input value={editForm.firstName || ''} onChange={e => handleEditFormChange('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <Input value={editForm.lastName || ''} onChange={e => handleEditFormChange('lastName', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Email</label>
                  <Input value={editForm.email || ''} onChange={e => handleEditFormChange('email', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">New Password (leave blank to keep current)</label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Address 1</label>
                  <Input value={editForm.address1 || ''} onChange={e => handleEditFormChange('address1', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Address 2</label>
                  <Input value={editForm.address2 || ''} onChange={e => handleEditFormChange('address2', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">City</label>
                  <Input value={editForm.city || ''} onChange={e => handleEditFormChange('city', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <Input value={editForm.state || ''} onChange={e => handleEditFormChange('state', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Postal Code</label>
                  <Input value={editForm.postalCode || ''} onChange={e => handleEditFormChange('postalCode', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Country</label>
                  <Input value={editForm.country || ''} onChange={e => handleEditFormChange('country', e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 