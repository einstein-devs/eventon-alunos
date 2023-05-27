import { Evento } from "@/entities/evento";
import { HOST_API } from "@/utils/api-config";
import { formatarData } from "@/utils/formater";
import Link from "next/link";

type CardEventoProps = {
  evento: Evento;
};

export default function CardEvento(props: CardEventoProps) {
  return (
    <div className="bg-white rounded-md border-[1px] mb-4 max-sm:text-sm">
      {props.evento.urlImagem && (
        <img
          src={`${HOST_API}/imagens/${props.evento.urlImagem}`}
          alt="Imagem do evento"
          className="h-[7rem] w-full object-cover rounded-tl-md rounded-tr-md"
        />
      )}

      <section className="p-4">
        <div className="flex flex-col ">
          <h1 className="text-md font-bold">{props.evento.titulo}</h1>
          <p className="text-sm -mt-.2">
            {formatarData(props.evento.dataHoraInicio)}
          </p>
        </div>

        <div className="flex text-sm justify-between mt-3 max-sm:flex-col max-sm:gap-y-2">
          <p>
            Promovido por{" "}
            <span className="font-bold">{props.evento.usuario.nome}</span>
          </p>

          <Link
            href={`/evento/${props.evento.id}`}
            className="font-bold text-orange-400"
          >
            Ver mais {">"}
          </Link>
        </div>
      </section>
    </div>
  );
}
