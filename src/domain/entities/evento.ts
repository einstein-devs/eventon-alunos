export class Evento {
  id: string;
  titulo: string;
  descricao?: string;
  codigo: string;
  urlImagem?: string;
  usuario: {
    nome: string;
  };
  dataHoraInicio: Date;

  constructor({
    id,
    titulo,
    descricao,
    codigo,
    urlImagem,
    usuario,
    dataHoraInicio,
  }: Evento) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.codigo = codigo;
    this.urlImagem = urlImagem;
    this.usuario = usuario;
    this.dataHoraInicio = dataHoraInicio;
  }
}
