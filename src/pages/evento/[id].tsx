import { AuthContext } from "@/contexts/auth.context";
import { Evento } from "@/entities/evento";
import { api } from "@/services/api";
import { HOST_API } from "@/utils/api-config";
import { formatarData } from "@/utils/formater";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeft, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  codigo: z.string().nonempty("O código do evento é obrigatório"),
});

type ConfirmarPresencaFormData = z.infer<typeof schema>;

export default function InfoEventoPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ConfirmarPresencaFormData>({
    resolver: zodResolver(schema),
  });

  const [evento, setEvento] = useState<Evento>({} as Evento);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingInscricao, setIsLoadingInscricao] = useState<boolean>(false);
  const [isLoadingPresenca, setIsLoadingPresenca] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  function isDisponivel(): boolean {
    return (
      new Date(evento.dataHoraTermino).valueOf() > dataAtual.valueOf() &&
      new Date(evento.dataHoraInicio).valueOf() > dataAtual.valueOf()
    );
  }

  function isFinalizado(): boolean {
    return new Date(evento.dataHoraTermino).valueOf() <= dataAtual.valueOf();
  }

  async function confirmarInscricao() {
    try {
      setIsLoadingInscricao(true);

      await api.post(`/presencas/${query["id"]}`);

      evento.inscritos++;
      evento.estaInscrito = true;

      setEvento(evento);

      toast.success("Inscrição confirmada com sucesso!", {
        closeButton: true,
        closeOnClick: true,
      });
    } catch (_) {
      toast.error("Ocorreu um erro ao confirmar inscrição!", {
        closeButton: true,
        closeOnClick: true,
      });
    } finally {
      setIsLoadingInscricao(false);
    }
  }

  async function confirmarPresenca(data: any) {
    try {
      setIsLoadingPresenca(true);

      await api.post(`/presencas/${query["id"]}/confirmar/${data.codigo}`);

      evento.estaConfimado = true;
      evento.certificadoGerado = true;

      setEvento(evento);

      toast.success("Presença confirmada, certificado gerado com sucesso!", {
        closeButton: true,
        closeOnClick: true,
      });

      handleCloseModal();
    } catch (error: any) {
      toast.error(
        error?.response?.data.message ??
          "Ocorreu um erro ao confirmar presença!",
        {
          closeButton: true,
          closeOnClick: true,
        }
      );
    } finally {
      setIsLoadingPresenca(false);
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-sm text-center">Carregando evento</p>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-white items-center justify-center flex flex-col max-md:max-w-full max-w-screen-md mx-auto">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className={"modal"}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="overflow-hidden w-screen h-screen flex items-center justify-center">
          <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-md text-center">
            <div className="flex items-center w-full gap-x-2">
              <button onClick={handleCloseModal}>
                <X size={22} weight={"bold"} />
              </button>
              <p>Confirmação de segurança</p>
            </div>

            <form
              onSubmit={handleSubmit(confirmarPresenca)}
              className="mt-1 flex flex-col gap-y-6"
            >
              <input
                type="text"
                placeholder="Digite o código do evento"
                className="mt-4 h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
                {...register("codigo")}
              />
              {errors.codigo && (
                <span className="text-sm text-red-500">
                  {errors.codigo.message}
                </span>
              )}

              <button className="text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg">
                Confirmar
              </button>
            </form>
          </div>
        </div>
      </Modal>

      <header className="w-full p-6">
        <div className="flex items-center gap-x-2">
          <button onClick={voltarPaginaAnterior} className="text-orange-400">
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
                    "url('" + HOST_API + "/imagens/" + evento.urlImagem + "')",
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
          {evento.certificadoGerado && (
            <Link
              href={`/certificados`}
              className="text-md text-orange-400 underline"
            >
              Certificado gerado!
            </Link>
          )}
          {user &&
            evento.estaInscrito &&
            !evento.estaConfimado &&
            isIniciado() && (
              <button
                onClick={handleOpenModal}
                className="text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
              >
                {isLoadingPresenca
                  ? "Confirmando presença..."
                  : "Confirmar presença"}
              </button>
            )}

          {evento.estaInscrito && !evento.estaConfimado && !isIniciado() && (
            <p className="text-orange-400">Aguardando inicio...</p>
          )}

          {isDisponivel() && !evento.estaInscrito && user && (
            <button
              onClick={confirmarInscricao}
              className="text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
            >
              {isLoadingInscricao ? "Carregando..." : "Inscrever-se"}
            </button>
          )}

          <p className="text-sm mt-6 block text-center">
            <span className="font-bold">Inscritos: </span>
            {evento.inscritos}
          </p>
        </section>
      </div>
    </main>
  );
}
