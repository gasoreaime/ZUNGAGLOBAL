import { protect, authorize } from './auth.js';

// Admin only middleware
export const adminOnly = [protect, authorize('admin')];

// Admin and staff middleware
export const adminStaff = [protect, authorize('admin', 'staff')];