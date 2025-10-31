export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiryDate: string;
  csrfToken: string;
  userName: string;
  email: string;
  companyId: string;
  isFirstTimeLogin: boolean;
  roles: string[];
  rolePermissions: RolePermission[];
}

export interface RolePermission {
  roleId: string;
  roleName: string;
  permissions: Permission[];
}

export interface Permission {
  pageId: string;
  pageName: string;
  sortBy: number;
  isRead: number;
  isWrite: number;
  isModify: number;
  isDownload: number;
  isDelete: number;
}
