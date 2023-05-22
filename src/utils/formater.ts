export function formatarData(dataString: any) {
  const date = new Date(dataString);
  const dia = ("0" + date.getDate()).slice(-2);
  const mes = ("0" + (date.getMonth() + 1)).slice(-2);
  const ano = date.getFullYear();
  const horas = ("0" + date.getHours()).slice(-2);
  const minutos = ("0" + date.getMinutes()).slice(-2);
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}
