import CardEvento from "@/components/card-evento";
import { SkeletonContainer } from "@/components/skeleton-container";
import { Evento } from "@/domain/entities/evento";
import { IdentificationBadge } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    getEventos();
  }, []);

  async function getEventos() {
    try {
      setIsLoading(true);

      const response = await fetch(
        process.env.NEXT_PUBLIC_HOST_API + "/eventos"
      );
      const responseData = await response.json();
      console.log(responseData);

      setEventos(responseData["data"]);
    } catch {
      console.log("Err");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="h-screen w-screen bg-white flex flex-col max-md:max-w-full max-w-screen-md mx-auto">
      <header className="w-full px-6 pt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Eventos</h1>

        <Link
          href="/login"
          className="text-orange-400 flex items-center gap-x-2"
        >
          <IdentificationBadge size={32} />

          <p className="max-md:hidden">Acessar conta</p>
        </Link>
      </header>
      <div className="h-16 w-full flex items-center mt-6">
        <button className="hover:bg-orange-50 transition-colors border-b-[1px] border-b-orange-400 h-full flex-1 flex items-center justify-center">
          <p className="text-md font-bold text-orange-400">Explorar</p>
        </button>
        <button className="hover:bg-orange-50 hover:text-orange-400 transition-colors border-b-[1px] h-full flex-1 flex items-center justify-center">
          <p className="text-md font-bold">Inscritos</p>
        </button>
      </div>

      <div className="flex-1 w-full h-full flex flex-col p-6 gap-y-3 overflow-scroll">
        {!isLoading &&
          eventos?.map((evento) => (
            <CardEvento key={evento.id} evento={evento} />
          ))}

        {isLoading &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <SkeletonContainer />
            </div>
          ))}
      </div>
    </main>
  );
}
