import { AuthContext } from "@/contexts/auth.context";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function MeuPerfilPage() {
  const { isLoadingUser, user, signOut } = useContext(AuthContext);

  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
  }

  if (isLoadingUser) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-white flex flex-col">
      <header className="w-full p-6 max-md:max-w-full max-w-screen-md mx-auto flex items-center gap-x-2">
        <button onClick={voltarPaginaAnterior} className="text-orange-400">
          <CaretLeft size={24} weight={"bold"} />
        </button>
        <h1 className="text-2xl font-bold">Perfil</h1>
      </header>
      <div className="w-full flex-1 overflow-y-auto py-4 px-6 flex flex-col max-md:max-w-full max-w-screen-md mx-auto">
        <div className="text-gray-500 w-full text-center leading-normal">
          <h2 className="font-bold text-xl">{user!.nome}</h2>
          <p className="text-md font-semibold">{user!.codigo}</p>
          {user!.curso != null && (
            <p className="text-sm text-gray-400">{user!.curso.nome}</p>
          )}
        </div>

        <div className="w-10 h-[1px] m-auto my-4 bg-gray-400"></div>

        <section className="w-full flex-1 flex flex-col justify-between">
          <div className="flex w-full flex-col gap-y-2">
            <button className="h-[42px] flex items-center justify-center bg-orange-100 text-orange-400 border border-orange-400 font-bold w-full rounded-lg">
              Editar perfil
            </button>

            <Link
              href="/certificados"
              className="h-[42px] flex items-center justify-center bg-orange-100 text-orange-400 border border-orange-400 font-bold w-full rounded-lg"
            >
              Meus certificados
            </Link>
          </div>

          <button
            onClick={signOut}
            className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
          >
            Sair
          </button>
        </section>
      </div>
    </main>
  );
}
