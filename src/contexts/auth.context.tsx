import { Usuario } from "@/entities/usuario";
import { LoginData, signInRequest } from "@/services/auth";
import Router from "next/router";
import { setCookie } from "nookies";
import { createContext, useState } from "react";

type AuthContextType = {
  user: Usuario;
  isAuthenticated: boolean;
  signIn: (data: LoginData) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<Usuario | null>(null);

  const isAuthenticated = !!user;

  async function signIn(data: LoginData) {
    const { user, token } = await signInRequest(data);

    setCookie(undefined, "@eventon.token", token, {
      maxAge: 60 * 60 * 1, // 1 hora
    });

    setUser(user);
    console.log(user);

    Router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user: user!, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
