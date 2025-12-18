# Backend API Endpoints TODO

## ⚠️ CRITICAL: Missing Admin User Management Endpoint

### Required Endpoint

```javascript
PUT /api/v1/admin/users/:userId
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "companyName": "string",
  "organizationType": "string",
  "designation": "string",
  "themes": ["string"],
  "role": "admin|moderator|user",
  "isActive": boolean,
  "isEmailVerified": boolean,
  "isApproved": boolean,
  "hasAutoApprovePrivilege": boolean
}

Response:
{
  "success": true,
  "data": {
    "user": { /* updated user object */ }
  },
  "message": "User updated successfully"
}
```

### Current Limitation

**Admin panel CANNOT update user data** because:
- ❌ Backend only has `/users/profile` (updates own profile only)
- ❌ No `/admin/users/:id` endpoint exists
- ❌ Cannot update other users' data as admin

### Impact

- Admin can view users ✅
- Admin CANNOT edit users ❌
- Changes are local-only (not saved to database) ❌
- Page refresh loses all changes ❌

### Priority

**🔴 HIGH PRIORITY** - Core admin functionality missing

### Implementation Guide

Create in: `routes/admin/users.js`

```javascript
router.put('/admin/users/:userId',
  protect,           // Require authentication
  authorize('admin'), // Require admin role
  async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Find and update user
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
            companyName: updateData.companyName,
            organizationType: updateData.organizationType,
            designation: updateData.designation,
            themes: updateData.themes,
            role: updateData.role,
            isActive: updateData.isActive,
            isEmailVerified: updateData.isEmailVerified,
            isApproved: updateData.isApproved,
            hasAutoApprovePrivilege: updateData.hasAutoApprovePrivilege,
            updatedAt: Date.now()
          }
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: { user },
        message: 'User updated successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);
```

### Testing

```bash
curl -X PUT https://leader.techwithjoshi.in/api/v1/admin/users/6920c8d784bd044a9cde4204 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name",
    "isActive": true
  }'
```

### Related Files

Frontend files already prepared:
- `/api/admin/users/[id]/route.js` - Next.js proxy route ✅
- `src/services/usersService.js` - Service layer ✅
- `src/app/dashboard/users/page.jsx` - UI component ✅
- `src/components/impact-leaders/users/EditUserModal.jsx` - Edit modal ✅

**Once this endpoint is added, admin user management will work immediately!**

---

## Other Missing Endpoints

1. `DELETE /api/v1/admin/users/:userId` - Delete user (admin)
2. `PATCH /api/v1/admin/users/:userId/role` - Change user role
3. `PATCH /api/v1/admin/users/:userId/status` - Activate/deactivate user
4. `POST /api/v1/admin/users/:userId/privileges` - Grant/revoke privileges

---

**Created**: 2025-12-19
**Status**: PENDING
**Assigned**: Backend Team
