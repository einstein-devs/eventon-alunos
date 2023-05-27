import { Certificado } from "@/entities/certificado";
import { formatarData } from "@/utils/formater";
import Link from "next/link";

type CardCertificadoProps = {
  certificado: Certificado;
};

export default function CardCertificado(props: CardCertificadoProps) {
  return (
    <div className="bg-white rounded-md border-[1px] mb-4 max-sm:text-sm">
      <section className="p-4">
        <div className="flex flex-col ">
          <h1 className="text-md font-bold">
            {props.certificado.evento.titulo}
          </h1>
          <p className="text-sm -mt-.2">
            Gerado em {formatarData(props.certificado.dataEmissao)}
          </p>
        </div>

        <div className="flex text-sm justify-between mt-3 max-sm:flex-col max-sm:gap-y-2">
          <p>
            Promovido por{" "}
            <span className="font-bold">{props.certificado.usuario.nome}</span>
          </p>

          <Link
            href={`/certificado/${props.certificado.id}`}
            className="font-bold text-orange-400"
          >
            Ver certificado {">"}
          </Link>
        </div>
      </section>
    </div>
  );
}
