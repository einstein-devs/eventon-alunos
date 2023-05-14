import { Evento } from "@/domain/entities/evento";
import { CaretLeft } from "@phosphor-icons/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type InfoEventoPageProps = {
  evento: Evento | null;
};

export default function InfoEventoPage({ evento }: InfoEventoPageProps) {
  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
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
              style={{
                backgroundImage: "url('')",
              }}
              className={"rounded-lg w-full h-32 animate-pulse bg-gray-200"}
            ></div>

            <section className="p-4">
              <div className="py-4">
                <p className="text-md">
                  <span className="font-semibold">Local: </span> Sala de
                  informatica 23
                </p>
                <p className="text-md">
                  <span className="font-semibold">Referência: </span> Ao lado do
                  bebedouro
                </p>
              </div>

              <div className="py-2">
                <p className="text-md">
                  <span className="font-semibold">Data e hora: </span>{" "}
                  28/01/2023 às 23:40
                </p>
              </div>
              <div className="py-2">
                <p className="text-md">
                  <span className="font-semibold">Sobre o evento: </span> O
                  evento faz referência a turma de TADS do 3º semestre e contará
                  com a presença..
                </p>
              </div>
            </section>

            <section className="mt-8">
              <button className="text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg">
                Confirmar presença
              </button>

              <p className="text-sm mt-6 block text-center">
                <span className="font-bold">Inscritos: </span>24
              </p>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

InfoEventoPage.getInitialProps = async ({
  query,
}: NextPageContext): Promise<InfoEventoPageProps> => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_HOST_API + "/eventos/" + query["id"]
    );
    const responseData = await response.json();

    return {
      evento: responseData["data"],
    };
  } catch {
    return {
      evento: null,
    };
  }
};
