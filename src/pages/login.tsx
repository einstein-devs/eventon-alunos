import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
  }

  return (
    <main className="h-screen w-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[400px] flex flex-1 flex-col p-6 gap-y-3">
        <div className="flex items-center gap-x-2">
          <button onClick={voltarPaginaAnterior} className="text-orange-400">
            <CaretLeft size={24} weight={"bold"} />
          </button>
          <h1 className="text-2xl font-bold">Entrar</h1>
        </div>

        <form className="mt-2 w-full text-center">
          <input
            type="text"
            placeholder="Digite seu RA"
            className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            className="mt-4 h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
          />

          <button className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg">
            Acessar
          </button>

          <Link
            href="/recuperar-senha"
            className="text-orange-400 font-semibold text-center mt-6 block"
          >
            Esqueceu sua Senha?
          </Link>
        </form>
      </div>
    </main>
  );
}
