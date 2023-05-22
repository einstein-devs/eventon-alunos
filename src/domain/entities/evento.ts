export class Evento {
  id: string;
  titulo: string;
  descricao?: string;
  codigo: string;
  urlImagem?: string;
  usuario: {
    nome: string;
  };
  local: {
    titulo: string;
    descricao: string;
  };
  inscritos: number;
  dataHoraInicio: Date;
  dataHoraTermino: Date;

  constructor({
    id,
    titulo,
    descricao,
    codigo,
    urlImagem,
    usuario,
    dataHoraInicio,
    local,
    dataHoraTermino,
    inscritos,
  }: Evento) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.codigo = codigo;
    this.urlImagem = urlImagem;
    this.usuario = usuario;
    this.dataHoraInicio = dataHoraInicio;
    this.local = local;
    this.dataHoraTermino = dataHoraTermino;
    this.inscritos = inscritos;
  }
}
