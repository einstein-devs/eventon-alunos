import CardCertificado from "@/components/card-certificado";
import { SkeletonContainer } from "@/components/skeleton-container";
import { AuthContext } from "@/contexts/auth.context";
import { Certificado } from "@/entities/certificado";
import { api } from "@/services/api";
import { HOST_API } from "@/utils/api-config";
import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function CertificadosPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [certificados, setCertificados] = useState<Certificado[]>([]);

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    loadScreen();
  }, [isAuthenticated]);

  async function loadScreen() {
    try {
      setIsLoading(true);

      await getCertificados();
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  async function getCertificados() {
    try {
      const response = await api.get(HOST_API + "/certificados/me");
      const responseData = await response.data;

      setCertificados(responseData["data"]);
    } catch {}
  }

  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
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

      <div className="flex-1 w-full h-full flex flex-col p-6 gap-y-3 overflow-y-auto">
        <div className="flex-1 w-full max-md:max-w-full  max-w-screen-md mx-auto">
          {!isLoading &&
            certificados?.map((certificado) => (
              <CardCertificado key={certificado.id} certificado={certificado} />
            ))}

          {certificados.length == 0 && !isLoading && (
            <div className="w-full text-center py-6">
              <p>Nenhum certificado encontrado!</p>
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
