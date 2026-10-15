// src/lib/api/authApi.ts
import { api } from "./api";

export const authApi = api.extend({
  prefix: "/api/proxy",
});