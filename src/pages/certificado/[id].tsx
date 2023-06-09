import { AuthContext } from "@/contexts/auth.context";
import { Certificado } from "@/entities/certificado";
import { api } from "@/services/api";
import { formatarData, formatarDataParaCertificado } from "@/utils/formater";
import { CaretLeft } from "@phosphor-icons/react";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
import React, { LegacyRef, useContext, useEffect, useState } from "react";

export default function InfoCertificadoPage() {
  const [certificado, setCertificado] = useState<Certificado>(
    {} as Certificado
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { query } = router;

  function voltarPaginaAnterior() {
    router.back();
  }

  const printRef: LegacyRef<HTMLDivElement> = React.useRef(null);

  const handleDownloadCertificado = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element!);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `certificado_${certificado.id}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  useEffect(() => {
    if (query.id) {
      loadScreen();
    }
  }, [query.id]);

  async function loadScreen() {
    try {
      setIsLoading(true);
      const response = await api.get(`/certificados/${query["id"]}`, {
        params: {
          usuarioId: user?.id,
        },
      });

      setCertificado(response.data["data"]);
      setIsLoading(false);
    } catch (_) {
      router.push("/");
    }
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-sm text-center">Carregando certificado</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-white items-center justify-center flex flex-col max-md:max-w-full max-w-screen-md mx-auto">
      <header className="w-full p-6">
        <div className="flex items-center gap-x-2">
          <button onClick={voltarPaginaAnterior} className="text-orange-400">
            <CaretLeft size={24} weight={"bold"} />
          </button>
          <h1 className="text-2xl font-bold">Certificados</h1>
        </div>
      </header>
      <div className="flex-1 w-full px-6 py-2 h-full">
        <section className="max-sm:max-w-sm mx-auto w-full h-full flex-1">
          <div
            ref={printRef}
            className="p-4 rounded-md border flex flex-col gap-y-4"
          >
            <div className="flex items-center gap-x-2">
              <img src="/einstein.png" alt="Einstein logo" />
              <div className="flex flex-col">
                <h1 className="text-md font-bold">Certificado</h1>
                <p className="text-sm">
                  Promovido por{" "}
                  <span className="font-bold">{certificado.usuario.nome}</span>{" "}
                </p>
              </div>
            </div>
            <div className="max-sm:text-xs text-sm flex flex-col gap-y-10">
              <section>
                <p>
                  {user?.nome}, participou do evento de{" "}
                  <span className="font-bold text-orange-500">
                    {certificado.evento.titulo}
                  </span>{" "}
                  {formatarDataParaCertificado(
                    certificado.evento.dataHoraInicio,
                    certificado.evento.dataHoraTermino
                  )}
                </p>
                <hr className="my-4" />
                <p>
                  <span className="font-bold">Data hora emissão: </span>{" "}
                  {formatarData(certificado.dataEmissao)}
                </p>
              </section>

              <p>
                Identificador:{" "}
                <span className="font-bold">{certificado.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCertificado}
            className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
          >
            Baixar certificado
          </button>
        </section>
      </div>
    </main>
  );
}
