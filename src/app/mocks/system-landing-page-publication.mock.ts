import { SystemLandingPagePublicationModel } from '../models/system-landing-page-publication.model';

export class SystemLandingPagePublicationMock {
  static Analise_perceptivoauditiva_da_estabilidade_vocal_de_adolescentes_em_diferentes_tarefas_fonatorias: SystemLandingPagePublicationModel =
    {
      id: 1,
      title:
        'Análise perceptivo-auditiva da estabilidade vocal de adolescentes em diferentes tarefas fonatórias',
      bibliographicReference: 'https://doi.org/10.1590/S0104-56872010000400016',
      publicationAbstract:
        '<p>TEMA: variabilidade de qualidade e frequência da voz de adolescentes, durante a puberdade, em diferentes tarefas fonatórias.</p><p>OBJETIVO: analisar, por meio da avaliação perceptivo-auditiva, a estabilidade vocal de adolescentes em três diferentes tarefas fonatórias.</p><p>MÉTODO: foram sujeitos do estudo 46 adolescentes do sexo masculino, com idade entre 13 e 15 anos, estudantes de uma escola estadual da cidade de Campinas - SP, onde foi realizada a coleta dos dados. As vozes foram gravadas em gravador digital, solicitou-se emissão sustentada da vogal /a/, contagem de 1 a 10 e leitura de parágrafo de um livro pré-estabelecido. A avaliação perceptivo-auditiva da estabilidade vocal foi realizada por três fonoaudiólogas especialistas em voz. Para vozes consideradas instáveis, utilizou-se uma Escala Visual Analógica de 10cm para marcação do grau de instabilidade, em que 0 significava estabilidade e 10 instabilidade máxima, podendo variar de 0 a 10.</p><p>RESULTADOS: na emissão da vogal sustentada 78,3% (n = 36) dos adolescentes apresentaram instabilidade vocal, em graus que variaram de 1 a 9. Apenas um adolescente apresentou voz instável, classificada como grau 1, durante a contagem de números e todos apresentaram voz estável durante a leitura. A ocorrência de estabilidade variou significativamente de acordo com a tarefa fonatória, havendo maior instabilidade na emissão de vogal sustentada (p <p 0,0001; g.l = 2).</p><p>CONCLUSÃO: as tarefas fonatórias de contagem de números e leitura não permitem inferir sobre a presença de instabilidade na emissão, o que deve ser avaliado na vogal sustentada.</p>',
    } as SystemLandingPagePublicationModel;

  static getAll(): SystemLandingPagePublicationModel[] {
    return [
      this
        .Analise_perceptivoauditiva_da_estabilidade_vocal_de_adolescentes_em_diferentes_tarefas_fonatorias,
    ];
  }
}
