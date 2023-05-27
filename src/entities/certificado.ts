export class Certificado {
  id: string;
  evento: {
    titulo: string;
    dataHoraInicio: Date;
    dataHoraTermino: Date;
  };
  usuario: {
    nome: string;
  };
  dataEmissao: Date;

  constructor({ id, evento, usuario, dataEmissao }: Certificado) {
    this.id = id;
    this.evento = evento;
    this.usuario = usuario;
    this.dataEmissao = dataEmissao;
  }
}
