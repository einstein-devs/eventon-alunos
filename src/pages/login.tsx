import { AuthContext } from "@/contexts/auth.context";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeft } from "@phosphor-icons/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  ra: z.string().nonempty("O RA é obrigatório"),
  senha: z.string().nonempty("A senha é obrigatória"),
});

export default function LoginPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { signIn } = useContext(AuthContext);

  async function onSubmit(data: any) {
    await signIn(data);
  }

  const router = useRouter();

  function voltarPaginaAnterior() {
    router.back();
  }

  return (
    <main className="h-screen w-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[400px] flex flex-1 flex-col p-6 gap-y-3">
        <div className="flex items-center gap-x-2">
          <button onClick={voltarPaginaAnterior} className="text-orange-400">
            <CaretLeft size={24} weight={"bold"} />
          </button>
          <h1 className="text-2xl font-bold">Entrar</h1>
        </div>

        <form
          className="mt-2 w-full text-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start w-full gap-y-1">
            <input
              type="text"
              placeholder="Digite seu RA"
              className="h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
              {...register("ra")}
            />
            {errors.ra && (
              <span className="text-sm text-red-500">{errors.ra.message}</span>
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-y-1">
            <input
              type="password"
              placeholder="Digite sua senha"
              className="mt-4 h-[42px] px-4 w-full text-md bg-gray-50 border border-gray-100 rounded-lg"
              {...register("senha")}
            />
            {errors.senha && (
              <span className="text-sm text-red-500">
                {errors.senha.message}
              </span>
            )}
          </div>

          <button className="mt-8 text-white h-[42px] flex items-center justify-center bg-orange-400 font-bold w-full rounded-lg">
            Acessar
          </button>

          <Link
            href="/recuperar-senha"
            className="text-orange-400 font-semibold text-center mt-6 block"
          >
            Esqueceu sua Senha?
          </Link>
        </form>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ["@eventon.token"]: token } = parseCookies(context);

  console.log("OIEEEE");
  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
