import { AuthContext } from "@/contexts/auth.context";
import { Evento } from "@/entities/evento";
import { api } from "@/services/api";
import { HOST_API } from "@/utils/api-config";
import { formatarData } from "@/utils/formater";
import { CaretLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function InfoEventoPage() {
  const [evento, setEvento] = useState<Evento>({} as Evento);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { query } = router;

  function voltarPaginaAnterior() {
    router.back();
  }

  useEffect(() => {
    if (query.id) {
      loadScreen();
    }
  }, [query.id]);

  async function loadScreen() {
    try {
      const response = await api.get(`/eventos/${query["id"]}`, {
        params: {
          usuarioId: user?.id,
        },
      });
      console.log(response.data);

      setEvento(response.data["data"]);
      setIsLoading(false);
    } catch (_) {
      router.push("/");
    }
  }

  const dataAtual = new Date();

  function isIniciado(): boolean {
    return (
      new Date(evento.dataHoraTermino).valueOf() > dataAtual.valueOf() &&
      new Date(evento.dataHoraInicio).valueOf() <= dataAtual.valueOf()
    );
  }

  function isFinalizado(): boolean {
    return new Date(evento.dataHoraTermino).valueOf() <= dataAtual.valueOf();
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-sm text-center">Carregando evento</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-white items-center justify-center flex flex-col max-md:max-w-full max-w-screen-md mx-auto">
      {!evento && (
        <div className="flex flex-col gap-y-8">
          <div className="text-center">
            <h1 className="text-xl font-bold">Ops! Ocorreu um erro</h1>
            <p>Não foi possível encontrar o evento em questão!</p>
          </div>

          <Link
            href={"/"}
            className="text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
          >
            Ver eventos
          </Link>
        </div>
      )}

      {evento && (
        <>
          <header className="w-full p-6">
            <div className="flex items-center gap-x-2">
              <button
                onClick={voltarPaginaAnterior}
                className="text-orange-400"
              >
                <CaretLeft size={24} weight={"bold"} />
              </button>
              <h1 className="text-2xl font-bold">{evento?.titulo}</h1>
            </div>
          </header>
          <div className="flex-1 w-full px-6 py-2">
            <div
              style={
                evento.urlImagem
                  ? {
                      backgroundImage:
                        "url('" +
                        HOST_API +
                        "/imagens/" +
                        evento.urlImagem +
                        "')",
                    }
                  : {}
              }
              className={
                "rounded-lg bg-no-repeat bg-cover bg-center w-full h-40 bg-gray-200"
              }
            ></div>

            <section className="p-4">
              <div className="py-4 text-md">
                <p>
                  <span className="font-semibold">Local: </span>{" "}
                  {evento.local.titulo}
                </p>

                {evento.local.descricao && (
                  <p>
                    {" "}
                    <span className="font-semibold">Referência: </span>{" "}
                    {evento.local.descricao}
                  </p>
                )}
              </div>

              <div className="py-2 flex justify-between max-sm:flex-col">
                <p className="text-md">
                  <span className="font-semibold">Data início: </span>{" "}
                  {formatarData(evento.dataHoraInicio)}
                </p>
                <p className="text-md">
                  <span className="font-semibold">Data termino: </span>{" "}
                  {formatarData(evento.dataHoraTermino)}
                </p>
              </div>
              <div className="py-2">
                {isIniciado() && (
                  <p className="text-md font-bold text-green-400">
                    Evento em curso...
                  </p>
                )}

                {isFinalizado() && (
                  <p className="text-md font-bold text-red-400">
                    Evento finalizado
                  </p>
                )}
              </div>
              {evento.descricao && (
                <div className="py-2">
                  <p className="text-md">
                    <span className="font-semibold">Sobre o evento: </span>{" "}
                    {evento.descricao}
                  </p>
                </div>
              )}
            </section>

            <section className="mt-8 w-full flex flex-col items-center justify-center">
              {!isFinalizado() && (
                <button className="text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg">
                  {isIniciado() && evento.estaInscrito
                    ? "Confirmar presença"
                    : "Inscrever-se"}
                </button>
              )}

              <p className="text-sm mt-6 block text-center">
                <span className="font-bold">Inscritos: </span>
                {evento.inscritos}
              </p>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
