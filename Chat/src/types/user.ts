export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  role: "customer" | "admin";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}