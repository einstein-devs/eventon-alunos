import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SucessoRedefinicaoPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/");
    }, 1500);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Sucesso!</h1>
      <p>A senha do seu usúario foi alterada...</p>
    </div>
  );
}
