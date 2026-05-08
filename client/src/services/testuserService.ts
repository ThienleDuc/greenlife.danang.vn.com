import api from "./api";
import type { TestUser } from "../types/testuser";

export const getTestUsers = async (): Promise<TestUser[]> => {
  const res = await api.get("/users"); // 🔥 vẫn là users

  // map từ SQL Server (PascalCase) → camelCase
  return res.data.map((u: any) => ({
    id: u.Id,
    username: u.Username,
    email: u.Email,
    role: u.Role,
    createdAt: u.CreatedAt,
  }));
};