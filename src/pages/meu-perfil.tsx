import Link from "next/link";

export default function MeuPerfilPage() {
  return (
    <main className="h-screen w-screen bg-white flex flex-col">
      <header className="w-full p-6">
        <h1 className="text-2xl font-bold">
          <Link href={"/login"} className="text-orange-400 mr-3">
            {"<"}
          </Link>{" "}
          Perfil
        </h1>
      </header>
      <div className="flex-1 overflow-scroll py-4 px-6 flex flex-col">
        <div className="text-gray-500 w-full text-center leading-normal">
          <h2 className="font-bold text-xl">Joao Mateus G Coelho</h2>
          <p className="text-md font-semibold">0299221</p>
          <p className="text-sm text-gray-400">
            Analise e desenvolvimento de sistemas
          </p>
        </div>

        <div className="w-10 h-[1px] m-auto my-4 bg-gray-400"></div>

        <section className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-y-2">
            <button className="h-[42px] flex items-center justify-center bg-orange-100 text-orange-400 border border-orange-400 font-bold w-full rounded-lg">
              Editar perfil
            </button>

            <button className="h-[42px] flex items-center justify-center bg-orange-100 text-orange-400 border border-orange-400 font-bold w-full rounded-lg">
              Meus certificados
            </button>
          </div>

          <button className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg">
            Sair
          </button>
        </section>
      </div>
    </main>
  );
}
