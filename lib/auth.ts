import NextAuth from "next-auth";
import { authOptions } from "./auth-credentials";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions as any);