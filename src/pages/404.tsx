import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Ops...</h1>
      <p>Nada encontrado por aqui!</p>

      <Link href={"/"} className="text-red-500 underline">
        Voltar
      </Link>
    </div>
  );
}
