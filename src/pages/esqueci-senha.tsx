import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type EsqueciSenhaFormData = z.infer<typeof schema>;

export default function EsqueciSenhaPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EsqueciSenhaFormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
  }

  async function onSubmit(data: EsqueciSenhaFormData) {
    try {
      setIsLoading(true);

      await api.post("/usuarios/esqueci-senha", data);
      voltarPaginaAnterior();
      toast.info(
        "Foi enviado um e-mail de confirmação, para alteração de senha!"
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data.message ?? "Ocorreu um erro ao redefinir senha!",
        {
          closeButton: true,
          closeOnClick: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="h-screen w-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[400px] flex flex-1 flex-col p-6 gap-y-3">
        <div className="flex items-center gap-x-2">
          <button onClick={voltarPaginaAnterior} className="text-orange-400">
            <CaretLeft size={24} weight={"bold"} />
          </button>
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-2 w-full text-center"
        >
          <input
            type="text"
            placeholder="E-mail"
            className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
            {...register("email")}
          />

          <button
            disabled={isLoading}
            className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
          >
            {isLoading ? "Carregando..." : "Enviar recuperação"}
          </button>
        </form>
      </div>
    </main>
  );
}
