import { Usuario } from "@/entities/usuario";
import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeft } from "@phosphor-icons/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z
  .object({
    email: z.string().nonempty("O RA é obrigatório"),
    senhaAtual: z.string().nonempty("A senha é obrigatória"),
    novaSenha: z
      .string()
      .min(8, "A senha deve ter no minimo 8 caracteres!")
      .optional(),
    confirmacaoNovaSenha: z.string().optional(),
  })
  .superRefine(({ novaSenha, confirmacaoNovaSenha }, ctx) => {
    if (novaSenha != confirmacaoNovaSenha) {
      ctx.addIssue({
        path: ["confirmacaoNovaSenha"],
        code: "custom",
        message: "As senhas não correspondem!",
      });
    }
  });

type EditarPerfilFormData = z.infer<typeof schema>;

type EditarPerfilProps = {
  user: Usuario;
};

export default function EditarPerfilPage({ user }: EditarPerfilProps) {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<EditarPerfilFormData>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue("email", user?.email ?? "");
  }, []);

  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
  }

  async function onSubmit(data: EditarPerfilFormData) {
    try {
      setIsLoading(true);

      let dataToSend: any = {};

      dataToSend["senha"] = data.senhaAtual;
      dataToSend["email"] = data.email;

      if (data.novaSenha) {
        dataToSend["novaSenha"] = data.novaSenha;
        dataToSend["confirmacaoNovaSenha"] = data.confirmacaoNovaSenha;
      }

      await api.put(`/usuarios/${user?.codigo}/update`, dataToSend);
      router.replace("/meu-perfil");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Ocorreu um erro ao realizar login!",
        {
          closeButton: true,
          closeOnClick: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <main className="h-screen w-screen bg-white flex flex-col">
      <header className="w-full p-6 max-md:max-w-full max-w-screen-md mx-auto flex items-center gap-x-2">
        <button onClick={voltarPaginaAnterior} className="text-orange-400">
          <CaretLeft size={24} weight={"bold"} />
        </button>
        <h1 className="text-2xl font-bold">Editar perfil</h1>
      </header>
      <div className="w-full flex-1 overflow-y-auto py-4 px-6 flex flex-col max-md:max-w-full max-w-screen-md mx-auto">
        <section className="w-full flex-1 flex flex-col">
          <div className="flex w-full flex-col gap-y-2">
            <p>Nome</p>
            <input
              type="text"
              disabled
              value={user?.nome}
              className="h-[42px] px-4 w-full text-md bg-gray-100 border border-gray-100 rounded-lg"
            />
            <p>Código</p>
            <input
              type="text"
              disabled
              value={user?.codigo}
              className="h-[42px] px-4 w-full text-md bg-gray-100 border border-gray-100 rounded-lg"
            />
            <p>Curso</p>
            <input
              type="text"
              disabled
              value={user?.curso?.nome}
              className="h-[42px] px-4 w-full text-md bg-gray-100 border border-gray-100 rounded-lg"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2 mt-8">
              <div>
                <p>E-mail</p>
                <input
                  type="email"
                  className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <p>Senha atual</p>
                <input
                  type="password"
                  placeholder="Senha Atual"
                  className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
                  {...register("senhaAtual")}
                />
                {errors.senhaAtual && (
                  <span className="text-sm text-red-500">
                    {errors.senhaAtual.message}
                  </span>
                )}
              </div>
              <div>
                <p>Nova senha</p>
                <input
                  type="password"
                  placeholder="Nova senha"
                  className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
                  {...register("novaSenha")}
                />
                {errors.novaSenha && (
                  <span className="text-sm text-red-500">
                    {errors.novaSenha.message}
                  </span>
                )}
              </div>
              <div>
                <p>Confirmação nova senha</p>
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
                  {...register("confirmacaoNovaSenha")}
                />
                {errors.confirmacaoNovaSenha && (
                  <span className="text-sm text-red-500">
                    {errors.confirmacaoNovaSenha.message}
                  </span>
                )}
              </div>
            </div>

            <button
              disabled={isLoading}
              className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg"
            >
              {isLoading ? "Carregando..." : "Alterar informações"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<EditarPerfilProps> = async (
  context
) => {
  const { "@eventon.token": token } = parseCookies(context);

  if (!token) {
    return {
      redirect: {
        destination: "/meu-perfil",
        permanent: false,
      },
    };
  }

  try {
    const response = await api.get(`/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data["data"];

    return {
      props: {
        user: data,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/meu-perfil",
        permanent: false,
      },
      props: {},
    };
  }
};
