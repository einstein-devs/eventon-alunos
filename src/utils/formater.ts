import { differenceInHours, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(dataString: any) {
  const date = new Date(dataString);
  const dia = ("0" + date.getDate()).slice(-2);
  const mes = ("0" + (date.getMonth() + 1)).slice(-2);
  const ano = date.getFullYear();
  const horas = ("0" + date.getHours()).slice(-2);
  const minutos = ("0" + date.getMinutes()).slice(-2);
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

export function formatarDataParaCertificado(
  dataHoraInicio: Date,
  dataHoraTermino: Date
) {
  const startDate = new Date(dataHoraInicio.toString());
  const endDate = new Date(dataHoraTermino.toString());

  const duration = differenceInHours(endDate, startDate);

  if (getDataFormatada(startDate) == getDataFormatada(endDate)) {
    const formattedStart = format(startDate, "'no dia' d 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });

    return `com duração de ${duration}h ${formattedStart}`;
  }

  const formattedStart = format(startDate, "'do dia' d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const formattedEnd = format(endDate, "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return `com duração de ${duration}h ${formattedStart} até ${formattedEnd}`;
}

function getDataFormatada(dataString: any) {
  const date = new Date(dataString);
  const dia = ("0" + date.getDate()).slice(-2);
  const mes = ("0" + (date.getMonth() + 1)).slice(-2);
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
