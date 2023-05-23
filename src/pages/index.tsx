import CardEvento from "@/components/card-evento";
import { SkeletonContainer } from "@/components/skeleton-container";
import { TabButton } from "@/components/tab-button";
import { AuthContext } from "@/contexts/auth.context";
import { Evento } from "@/entities/evento";
import { api } from "@/services/api";
import { HOST_API } from "@/utils/api-config";
import { IdentificationBadge } from "@phosphor-icons/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosInscritos, setEventosIncritos] = useState<Evento[]>([]);

  const [pageSelected, setPageSelected] = useState<"explorar" | "inscritos">(
    "explorar"
  );

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    loadScreen();
  }, [isAuthenticated]);

  async function loadScreen() {
    try {
      setIsLoading(true);

      if (isAuthenticated) {
        await Promise.all([getEventos(), getEventosInscritos()]);
      } else {
        await getEventos();
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function getEventos() {
    try {
      const response = await api.get(HOST_API + "/eventos");
      const responseData = await response.data;

      setEventos(responseData["data"]);
    } catch {}
  }

  async function getEventosInscritos() {
    try {
      const response = await api.get(HOST_API + "/eventos/inscritos");
      const responseData = response.data;

      setEventosIncritos(responseData["data"]);
    } catch {}
  }

  return (
    <main className="h-screen w-screen bg-white flex flex-col">
      <header className="w-full px-6 pt-4 flex items-center justify-between max-md:max-w-full max-w-screen-md mx-auto">
        <h1 className="text-2xl font-bold">Eventos</h1>

        {!isAuthenticated && (
          <Link
            href="/login"
            className="text-orange-400 flex items-center gap-x-2"
          >
            <IdentificationBadge size={32} />

            <p className="max-md:hidden">Acessar conta</p>
          </Link>
        )}

        {isAuthenticated && (
          <Link
            href="/meu-perfil"
            className="text-orange-400 flex items-center gap-x-2"
          >
            <IdentificationBadge size={32} />

            <p className="max-md:hidden">Meu perfil</p>
          </Link>
        )}
      </header>
      <div className="h-16 w-full flex items-center mt-6 max-md:max-w-full max-w-screen-md mx-auto">
        <TabButton
          isActive={pageSelected == "explorar"}
          onClick={() => setPageSelected("explorar")}
          text="Explorar"
        />
        {isAuthenticated && (
          <TabButton
            isActive={pageSelected == "inscritos"}
            onClick={() => setPageSelected("inscritos")}
            text="Inscritos"
          />
        )}
      </div>

      <div className="flex-1 w-full h-full flex flex-col p-6 gap-y-3 overflow-scroll">
        <div className="flex-1 w-full max-md:max-w-full max-w-screen-md mx-auto">
          {!isLoading &&
            pageSelected == "explorar" &&
            eventos?.map((evento) => (
              <CardEvento key={evento.id} evento={evento} />
            ))}

          {!isLoading &&
            pageSelected == "inscritos" &&
            eventosInscritos?.map((evento) => (
              <CardEvento key={evento.id} evento={evento} />
            ))}

          {eventos.length == 0 && !isLoading && (
            <div className="w-full text-center py-6">
              <p>Nenhum evento encontrado!</p>
            </div>
          )}

          {isLoading &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="mb-4">
                <SkeletonContainer />
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
