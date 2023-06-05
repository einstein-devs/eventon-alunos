import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z
  .object({
    senha: z.string().min(8, {
      message: "A senha deve conter 8 caracteres!",
    }),
    confirmarSenha: z.string().min(8, {
      message: "A senha deve conter 8 caracteres!",
    }),
  })
  .superRefine(({ senha, confirmarSenha }, ctx) => {
    if (senha != confirmarSenha) {
      ctx.addIssue({
        path: ["confirmarSenha"],
        code: "custom",
        message: "A confirmação de senha deve ser igual a senha!",
      });
    }
  });

type RecuperarSenhaFormData = z.infer<typeof schema>;

type RecuperarSenhaPageProps = {
  codigoError: boolean;
};

export default function RecuperarSenhaPage({
  codigoError,
}: RecuperarSenhaPageProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RecuperarSenhaFormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  function voltarInicio() {
    router.replace("/");
  }

  async function onSubmit(data: RecuperarSenhaFormData) {
    try {
      setIsLoading(true);

      let dataToSend: any = {
        novaSenha: data.senha,
        confirmacaoNovaSenha: data.confirmarSenha,
        redefinicaoId: router.query["id"],
      };

      await api.post("/usuarios/redefinir-senha", dataToSend);
      await router.replace("/sucesso-redefinicao");
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

  if (codigoError) {
    return (
      <main className="h-screen w-screen bg-white flex flex-col max-w-screen-sm mx-auto items-center justify-center">
        <h1 className="font-bold text-2xl">Ocorreu um erro!</h1>
        <p>Data limite para redefinição de senha excedida!</p>

        <button
          onClick={voltarInicio}
          className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
        >
          Voltar
        </button>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[400px] flex flex-1 flex-col p-6 gap-y-3">
        <div className="flex items-center gap-x-2">
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-2 w-full text-center"
        >
          <div className="w-full flex flex-col items-start">
            <p>Nova senha</p>
            <input
              type="password"
              placeholder="Nova senha"
              className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
              {...register("senha")}
            />
            {errors.senha && (
              <span className="text-sm text-red-500">
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col items-start mt-4">
            <p>Confirmação de senha</p>
            <input
              type="password"
              placeholder="Confirmação de senha"
              className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
              {...register("confirmarSenha")}
            />
            {errors.confirmarSenha && (
              <span className="text-sm text-red-500">
                {errors.confirmarSenha.message}
              </span>
            )}
          </div>

          <button
            disabled={isLoading}
            className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
          >
            {isLoading ? "Carregando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<
  RecuperarSenhaPageProps
> = async (ctx) => {
  try {
    await api.post(`/usuarios/redefinir-senha/validar/${ctx.query["id"]}`);

    return {
      props: {
        codigoError: false,
      },
    };
  } catch (_) {
    console.log(_);
    return {
      props: {
        codigoError: true,
      },
    };
  }
};
