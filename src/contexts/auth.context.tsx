import { Usuario } from "@/entities/usuario";
import { api } from "@/services/api";
import { getUserInformation, LoginData, signInRequest } from "@/services/auth";
import Router, { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  isLoadingUser: boolean;
  user: Usuario | null;
  isAuthenticated: boolean;
  signIn: (data: LoginData) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const { "@eventon.token": token } = parseCookies();

      console.log("TRY LOAD USER");
      console.log(token);
      console.log(router.pathname);
      if (token) {
        setIsLoadingUser(true);

        const response = await getUserInformation();

        console.log(response);

        if (response) {
          setUser(response);
        } else {
          signOut();
        }
      }
    } catch {
      signOut();
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function signIn(data: LoginData) {
    const { user, token } = await signInRequest(data);

    setCookie(undefined, "@eventon.token", token, {
      maxAge: 60 * 60 * 1, // 1 hora
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;
    setUser(user);

    Router.push("/");
  }

  async function signOut() {
    destroyCookie(undefined, "@eventon.token");

    await Router.push("/");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoadingUser,
        user,
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {isLoadingUser ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <p className="text-sm text-center">Carregando usuario</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
