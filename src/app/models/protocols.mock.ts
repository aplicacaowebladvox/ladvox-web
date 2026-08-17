import { ConvertUtils } from '../modules/shared/utils/convert.utils';
import { stringToDate } from '../modules/shared/utils/date.util';
import { AcceptedValueAnswerTypeProtocolModel } from './accepted-value-answer-type-protocol.model';
import { AnswerTypeProtocolModel } from './answer-type-protocol.model';
import { AnswerValueTypeEnum } from './enum/answer-value-type.enum';
import { ProtocolModel } from './protocol.model';
import { QuestionGroupProtocolModel } from './question-group-protocol.model';
import { QuestionProtocolModel } from './question-protocol.model';

export class ProtocolMock {
  static generateQVV(): ProtocolModel {
    const _qvv = {} as ProtocolModel;

    _qvv.key = '0190fb00-97a3-799e-a924-3410b4266298';
    _qvv.id = 1;
    _qvv.name = 'Protocolo de Qualidade de Vida em Voz';
    _qvv.abbreviation = 'QVV';
    _qvv.initialValidity = stringToDate('2024-01-01')!;
    _qvv.answersType = [
      {
        key: '0190fb00-bca6-799e-a924-399f06c83fec',
        sequence: 1,
        name: 'O quanto isto é um problema?',
        acceptableValues: [
          {
            key: '0190fb01-3b0c-799e-a924-436ce0ce8007',
            value: 1,
            presentation: '1',
          },
          {
            key: '0190fb01-478e-799e-a924-4d8edb6f4b2e',
            value: 2,
            presentation: '2',
          },
          {
            key: '0190fb01-52b3-799e-a924-5491bf83faed',
            value: 3,
            presentation: '3',
          },
          {
            key: '0190fb01-5d0b-799e-a924-5d1315c6ca10',
            value: 4,
            presentation: '4',
          },
          {
            key: '0190fb01-6bf0-799e-a924-669645024ba4',
            value: 5,
            presentation: '5',
          },
        ],
        useRangeAnswer: false,
        answerValueType: AnswerValueTypeEnum.NUMERIC,
      },
    ] as AnswerTypeProtocolModel[];
    _qvv.questions = [
      {
        key: '0190fb01-7b97-799e-a924-6beddaec58b5',
        sequence: 1,
        question: 'Tenho dificuldades em falar forte (alto) ou ser ouvido em ambientes ruidosos',
      },
      {
        key: '0190fb01-891b-799e-a924-70e22375a440',
        sequence: 2,
        question: 'O ar acaba rápido e preciso respirar muitas vezes enquanto eu falo',
      },
      {
        key: '0190fb01-9689-799e-a924-7ee10493acd9',
        sequence: 3,
        question: 'Não sei como a voz vai sair quando começo a falar',
      },
      {
        key: '0190fb01-a1c7-799e-a924-870cb5db0896',
        sequence: 4,
        question: 'Fico ansioso ou frustrado (por causa da minha voz)',
      },
      {
        key: '0190fb01-aef6-799e-a924-8e98a18db016',
        sequence: 5,
        question: 'Fico deprimido (por causa da minha voz)',
      },
      {
        key: '0190fb01-bf72-799e-a924-96dc0b0374e4',
        sequence: 6,
        question: 'Tenho dificuldades ao telefone (por causa da minha voz)',
      },
      {
        key: '0190fb01-ca97-799e-a924-9eca31a045c0',
        sequence: 7,
        question:
          'Tenho problemas para desenvolver o meu trabalho, minha profissão (pela minha voz)',
      },
      {
        key: '0190fb01-d452-799e-a924-a2cdcfac7b2e',
        sequence: 8,
        question: 'Evito sair socialmente (por causa da minha voz)',
      },
      {
        key: '0190fb01-dfa3-799e-a924-ae6ea3e32245',
        sequence: 9,
        question: 'Tenho que repetir o que falo para ser compreendido',
      },
      {
        key: '0190fb01-e903-799e-a924-b339b9d2e8b1',
        sequence: 10,
        question: 'Tenho me tornado menos expansivo (por causa da minha voz)',
      },
    ] as QuestionProtocolModel[];
    let groupEscoreTotalKey = '0190fb01-fb6c-799e-a924-b9a6f7c5be8a';
    let groupSocioEmocionalKey = '0190fb02-061a-799e-a924-c38c56d830da';
    let groupFuncionamentoFisicoKey = '0190fb02-10e2-799e-a924-cf6c244fae60';
    _qvv.groups = [
      {
        key: groupEscoreTotalKey,
        name: 'Escore total',
        questions: [..._qvv.questions],
        baseResults: [
          {
            key: '0190fb02-20b8-799e-a924-d7c21af91a60',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 98.0,
            finalValue: 98.0,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb02-2ba8-799e-a924-e643b943d7eb',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 65.9,
            finalValue: 65.9,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
        functions: [
          `(100-((@${ConvertUtils.uuidV7WithoutOpperators(groupEscoreTotalKey)}#groupSum-@${ConvertUtils.uuidV7WithoutOpperators(groupEscoreTotalKey)}#groupQuestionsLength)*100))/(@${ConvertUtils.uuidV7WithoutOpperators(groupEscoreTotalKey)}#groupMaxSum-@${ConvertUtils.uuidV7WithoutOpperators(groupEscoreTotalKey)}#groupQuestionsLength)`,
        ],
      },
      {
        key: groupSocioEmocionalKey,
        name: 'Sócio-Emocional',
        questions: [_qvv.questions[3], _qvv.questions[4], _qvv.questions[7], _qvv.questions[9]],
        baseResults: [
          {
            key: '0190fb02-37f5-799e-a924-edea97e888f9',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 99.4,
            finalValue: 99.4,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb02-4541-799e-a924-f7849fc9cb4d',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 70.6,
            finalValue: 70.6,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
        functions: [
          `(100-((@${ConvertUtils.uuidV7WithoutOpperators(groupSocioEmocionalKey)}#groupSum-@${ConvertUtils.uuidV7WithoutOpperators(groupSocioEmocionalKey)}#groupQuestionsLength)*100))/(@${ConvertUtils.uuidV7WithoutOpperators(groupSocioEmocionalKey)}#groupMaxSum-@${ConvertUtils.uuidV7WithoutOpperators(groupSocioEmocionalKey)}#groupQuestionsLength)`,
        ],
      },
      {
        key: groupFuncionamentoFisicoKey,
        name: 'Funcionamento Físico',
        questions: [
          _qvv.questions[0],
          _qvv.questions[1],
          _qvv.questions[2],
          _qvv.questions[5],
          _qvv.questions[6],
          _qvv.questions[8],
        ],
        baseResults: [
          {
            key: '0190fb02-51a4-799e-a924-f91d78353735',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 97.1,
            finalValue: 97.1,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb02-6ba8-799e-a925-0521f200d879',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 62.7,
            finalValue: 62.7,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
        functions: [
          `(100-((@${ConvertUtils.uuidV7WithoutOpperators(groupFuncionamentoFisicoKey)}#groupSum-@${ConvertUtils.uuidV7WithoutOpperators(groupFuncionamentoFisicoKey)}#groupQuestionsLength)*100))/(@${ConvertUtils.uuidV7WithoutOpperators(groupFuncionamentoFisicoKey)}#groupMaxSum-@${ConvertUtils.uuidV7WithoutOpperators(groupFuncionamentoFisicoKey)}#groupQuestionsLength)`,
          // `(100-({${groupFuncionamentoFisicoKey)}#groupSum}-{${groupFuncionamentoFisicoKey)}#groupQuestionsLength})*100)/({${groupFuncionamentoFisicoKey)}#groupMaxSum}-{${groupFuncionamentoFisicoKey)}#groupQuestionsLength})`,
        ],
      },
    ] as QuestionGroupProtocolModel[];

    return _qvv;
  }

  static generateESV(): ProtocolModel {
    const esv = {} as ProtocolModel;

    esv.key = '0190fb02-76c3-799e-a925-0858cf2013c7';
    esv.id = 2;
    esv.name = 'Escala de sintomas vocais';
    esv.abbreviation = 'ESV';
    esv.initialValidity = stringToDate('2024-01-01')!;
    esv.answersType = [
      {
        key: '0190fb02-836e-799e-a925-104ffb67d2be',
        sequence: 1,
        acceptableValues: [
          {
            key: '0190fb02-8e9c-799e-a925-186c6c465a41',
            value: 0,
            presentation: 'Nunca',
          },
          {
            key: '0190fb02-9c7b-799e-a925-23ae19ee5ba8',
            value: 1,
            presentation: 'Raramente',
          },
          {
            key: '0190fb02-b92d-799e-a925-2cc52353bfe6',
            value: 2,
            presentation: 'Às vezes',
          },
          {
            key: '0190fb02-c236-799e-a925-3b7d62cc1da7',
            value: 3,
            presentation: 'Quase Sempre',
          },
          {
            key: '0190fb02-ca37-799e-a925-44a91526e02a',
            value: 4,
            presentation: 'Sempre',
          },
        ] as AcceptedValueAnswerTypeProtocolModel[],
        useRangeAnswer: false,
        answerValueType: AnswerValueTypeEnum.NUMERIC,
      },
    ] as AnswerTypeProtocolModel[];
    esv.questions = [
      {
        key: '0190fb02-d266-799e-a925-483382d25733',
        sequence: 1,
        question: 'Você tem dificuldade de chamar a atenção das pessoas?',
      },
      {
        key: '0190fb02-db39-799e-a925-53c43d8958fe',
        sequence: 2,
        question: 'Você tem dificuldade para cantar?',
      },
      {
        key: '0190fb02-e2ed-799e-a925-5f829e5880d1',
        sequence: 3,
        question: 'Sua garganta dói?',
      },
      {
        key: '0190fb02-f429-799e-a925-6283e75e1ff7',
        sequence: 4,
        question: 'Sua voz é rouca?',
      },
      {
        key: '0190fb02-fa4c-799e-a925-6ffc5269ed5e',
        sequence: 5,
        question: 'Quando você conversa em grupo, as pessoas têm dificuldade para ouvi-lo?',
      },
      {
        key: '0190fb03-01b3-799e-a925-7686708d4324',
        sequence: 6,
        question: 'Você perde a voz?',
      },
      {
        key: '0190fb03-094a-799e-a925-7c7f7a3d8f7b',
        sequence: 7,
        question: 'Você tosse ou pigarreia?',
      },
      {
        key: '0190fb03-1229-799e-a925-80249fb75f5d',
        sequence: 8,
        question: 'Sua voz é fraca/baixa?',
      },
      {
        key: '0190fb03-1ae1-799e-a925-8b72d825a3d4',
        sequence: 9,
        question: 'Você tem dificuldade para falar ao telefone?',
      },
      {
        key: '0190fb03-23ce-799e-a925-9158831c3dc6',
        sequence: 10,
        question: 'Você se sente mal ou deprimido por causa do seu problema de voz?',
      },
      {
        key: '0190fb03-2e0e-799e-a925-9b2ff927c932',
        sequence: 11,
        question: 'Você sente alguma coisa parada na garganta?',
      },
      {
        key: '0190fb03-37bc-799e-a925-a43cdd843843',
        sequence: 12,
        question: 'Você tem nódulos inchados (ingua) no pescoço?',
      },
      {
        key: '0190fb03-4766-799e-a925-ad02c9016b8c',
        sequence: 13,
        question: 'Você se sente constrangido por causa do seu problema de voz?',
      },
      {
        key: '0190fb03-4f59-799e-a925-b540f42f7751',
        sequence: 14,
        question: 'Você se cansa de falar?',
      },
      {
        key: '0190fb03-57c7-799e-a925-bd34c765cac0',
        sequence: 15,
        question: 'Seu problema de voz deixa você estressado ou nervoso?',
      },
      {
        key: '0190fb03-5edc-799e-a925-c69560c1d246',
        sequence: 16,
        question: 'Você tem dificuldade para falar em locais barulhentos?',
      },
      {
        key: '0190fb03-6706-799e-a925-cd9f64238fd8',
        sequence: 17,
        question: 'É dificil falar forte (alto) ou gritar?',
      },
      {
        key: '0190fb03-720a-799e-a925-d7bd5516de57',
        sequence: 18,
        question: 'O seu problema de voz incomoda sua família ou amigos?',
      },
      {
        key: '0190fb03-7b0a-799e-a925-d8e97a08f787',
        sequence: 19,
        question: 'Você tem muita secreção ou pigarro na garganta?',
      },
      {
        key: '0190fb03-8483-799e-a925-e37626a90a4e',
        sequence: 20,
        question: 'O som da sua voz muda durante o dia?',
      },
      {
        key: '0190fb03-8fb0-799e-a925-ea1a9531dcdc',
        sequence: 21,
        question: 'As pessoas parecem se irritar com a sua voz?',
      },
      {
        key: '0190fb03-9a5f-799e-a925-f085b9f07158',
        sequence: 22,
        question: 'Você tem o nariz entupido?',
      },
      {
        key: '0190fb03-a4d9-799e-a925-f8787bf633b1',
        sequence: 23,
        question: 'As pessoas perguntam o que você tem na voz?',
      },
      {
        key: '0190fb03-bb9f-799e-a926-0b503454e1df',
        sequence: 24,
        question: 'Sua voz parece rouca e seca?',
      },
      {
        key: '0190fb03-c56f-799e-a926-1495f60665a2',
        sequence: 25,
        question: 'Você tem que fazer força para falar?',
      },
      {
        key: '0190fb03-cd0d-799e-a926-18b34e221b71',
        sequence: 26,
        question: 'Com que frequência você tem infecções na garganta?',
      },
      {
        key: '0190fb03-de02-799e-a926-204e1451ae9f',
        sequence: 27,
        question: 'Sua voz falha no meio das frases?',
      },
      {
        key: '0190fb03-e5a4-799e-a926-2ca7c2417ff5',
        sequence: 28,
        question: 'Sua voz faz você se sentir incompetente?',
      },
      {
        key: '0190fb03-ec97-799e-a926-302836dbd3da',
        sequence: 29,
        question: 'Você tem vergonha do seu problema de voz?',
      },
      {
        key: '0190fb03-f534-799e-a926-3dc37fa38db1',
        sequence: 30,
        question: 'Você se sente solitário por causa do seu problema de voz?',
      },
    ] as QuestionProtocolModel[];
    let totalEsvGroupKey = '0190fb03-ffae-799e-a926-43c9724c649c';
    let limitacaoGroupKey = '0190fb04-08b7-799e-a926-4ddcd586fa14';
    let emocionalGroupKey = '0190fb04-1127-799e-a926-57e084031266';
    let fisicoGroupKey = '0190fb04-1abf-799e-a926-58877b7d001d';
    esv.groups = [
      {
        key: totalEsvGroupKey,
        name: 'Total ESV',
        questions: [...esv.questions],
        functions: [`@${ConvertUtils.uuidV7WithoutOpperators(totalEsvGroupKey)}#groupSum`],
      },
      {
        key: limitacaoGroupKey,
        name: 'Limitação',
        questions: [
          esv.questions[0], // 1
          esv.questions[1], // 2
          esv.questions[3], // 4
          esv.questions[4], // 5
          esv.questions[5], // 6
          esv.questions[7], // 8
          esv.questions[8], // 9
          esv.questions[13], // 14
          esv.questions[15], // 16
          esv.questions[16], // 17
          esv.questions[19], // 20
          esv.questions[22], // 23
          esv.questions[23], // 24
          esv.questions[24], // 25
          esv.questions[26], // 27
        ],
        functions: [`@${ConvertUtils.uuidV7WithoutOpperators(limitacaoGroupKey)}#groupSum`],
      },
      {
        key: emocionalGroupKey,
        name: 'Emocional',
        questions: [
          esv.questions[9], // 10
          esv.questions[12], // 13
          esv.questions[14], // 15
          esv.questions[17], // 18
          esv.questions[20], // 21
          esv.questions[27], // 28
          esv.questions[28], // 29
          esv.questions[29], // 30
        ],
        functions: [`@${ConvertUtils.uuidV7WithoutOpperators(emocionalGroupKey)}#groupSum`],
      },
      {
        key: fisicoGroupKey,
        name: 'Fisico',
        questions: [
          esv.questions[2], // 3
          esv.questions[6], // 7
          esv.questions[10], // 11
          esv.questions[11], // 12
          esv.questions[18], // 19
          esv.questions[21], // 22
          esv.questions[25], // 26
        ],
        functions: [`@${ConvertUtils.uuidV7WithoutOpperators(fisicoGroupKey)}#groupSum`],
      },
    ] as QuestionGroupProtocolModel[];
    esv.functions = [] as string[];
    return esv;
  }

  static generateEDTV(): ProtocolModel {
    const edtv = {} as ProtocolModel;

    edtv.key = '0190fb04-3a70-799e-a926-663669eab3d7';
    edtv.id = 3;
    edtv.name = 'Escala de desconforto do trato vocal';
    edtv.abbreviation = 'EDTV';
    edtv.initialValidity = stringToDate('2024-01-01')!;
    edtv.answersType = [
      {
        key: '0190fb04-4353-799e-a926-6b72cef3a079',
        sequence: 1,
        name: 'Frequência de sensação/sintoma',
        acceptableValues: [
          {
            key: '0190fb04-4bb7-799e-a926-740ee9cd8179',
            value: 0,
            presentation: 'Nunca',
          },
          {
            key: '0190fb04-54a5-799e-a926-7997db5b12fd',
            value: 1,
            presentation: '',
          },
          {
            key: '0190fb04-5de1-799e-a926-8059d4d53631',
            value: 2,
            presentation: 'Às vezes',
          },
          {
            key: '0190fb04-65c6-799e-a926-895a8c60b4b7',
            value: 3,
            presentation: '',
          },
          {
            key: '0190fb04-7229-799e-a926-964c4358be00',
            value: 4,
            presentation: 'Muitas vezes',
          },
          {
            key: '0190fb04-7b18-799e-a926-9a0e7e497b13',
            value: 5,
            presentation: '',
          },
          {
            key: '0190fb04-8440-799e-a926-a47f0bb101e2',
            value: 6,
            presentation: 'Sempre',
          },
        ] as AcceptedValueAnswerTypeProtocolModel[],
        useRangeAnswer: false,
        answerValueType: AnswerValueTypeEnum.NUMERIC,
      },
      {
        key: '0190fb04-9266-799e-a926-a82fdf8c9e3c',
        sequence: 2,
        name: 'Intensidade da sensação/sintoma',
        acceptableValues: [
          {
            key: '0190fb04-a1d2-799e-a926-b564a75b562c',
            value: 0,
            presentation: 'Nenhuma',
          },
          {
            key: '0190fb04-b394-799e-a926-bfe024190c8e',
            value: 1,
            presentation: '',
          },
          {
            key: '0190fb04-bb7b-799e-a926-c57d188b0baf',
            value: 2,
            presentation: 'Leve',
          },
          {
            key: '0190fb04-c50d-799e-a926-c8a65c599952',
            value: 3,
            presentation: '',
          },
          {
            key: '0190fb04-ce04-799e-a926-d0668d11ce70',
            value: 4,
            presentation: 'Moderada',
          },
          {
            key: '0190fb04-d8ff-799e-a926-dc7670bd58e8',
            value: 5,
            presentation: '',
          },
          {
            key: '0190fb04-e937-799e-a926-e2e132424fce',
            value: 6,
            presentation: 'Extrema',
          },
        ] as AcceptedValueAnswerTypeProtocolModel[],
        useRangeAnswer: false,
        answerValueType: AnswerValueTypeEnum.NUMERIC,
      },
    ] as AnswerTypeProtocolModel[];
    edtv.questions = [
      {
        key: '0190fb04-fc0f-799e-a926-eac45b5900d4',
        sequence: 1,
        question: 'Queimação',
      },
      {
        key: '0190fb05-059c-799e-a926-f306775c9807',
        sequence: 2,
        question: 'Aperto',
      },
      {
        key: '0190fb05-0f69-799e-a926-fae60d35a776',
        sequence: 3,
        question: 'Secura',
      },
      {
        key: '0190fb05-18a5-799e-a927-0720bc0d1d5f',
        sequence: 4,
        question: 'Garganta dolorida',
      },
      {
        key: '0190fb05-213e-799e-a927-0fe77b793941',
        sequence: 5,
        question: 'Coceira',
      },
      {
        key: '0190fb05-2b75-799e-a927-14ca61cdd582',
        sequence: 6,
        question: 'Garganta sensível',
      },
      {
        key: '0190fb05-3c4a-799e-a927-1dfb51fea230',
        sequence: 7,
        question: 'Garganta irritada',
      },
      {
        key: '0190fb05-4617-799e-a927-2dde6821ac76',
        sequence: 8,
        question: 'Bola na garganta',
      },
    ] as QuestionProtocolModel[];
    let totalGroupKey = '0190fb05-519c-799e-a927-35725563d5cd';
    edtv.groups = [
      {
        key: totalGroupKey,
        name: 'Geral',
        questions: [...edtv.questions],
        functions: [`@${ConvertUtils.uuidV7WithoutOpperators(totalGroupKey)}#groupSum`] as string[],
      },
    ] as QuestionGroupProtocolModel[];
    edtv.functions = [] as string[];
    return edtv;
  }

  static generatePPAV(): ProtocolModel {
    const ppav = {} as ProtocolModel;

    ppav.key = '0190fb05-5968-799e-a927-3c28945c91fd';
    ppav.id = 4;
    ppav.name = 'Protocolo PAV';
    ppav.abbreviation = 'PPAV';
    ppav.initialValidity = stringToDate('2024-01-01')!;
    ppav.answersType = [
      {
        key: '0190fb05-6a46-799e-a927-46b3f4d3d6df',
        sequence: 1,
        acceptableValues: [
          {
            key: '0190fb05-7555-799e-a927-48675f6d1712',
            value: 0,
            presentation: 'Nunca',
          },
          {
            key: '0190fb05-7ec2-799e-a927-573bfd3ea949',
            value: 10,
            presentation: 'Sempre',
          },
        ] as AcceptedValueAnswerTypeProtocolModel[],
        useRangeAnswer: true,
        answerValueType: AnswerValueTypeEnum.NUMERIC,
      },
    ] as AnswerTypeProtocolModel[];
    ppav.questions = [
      {
        key: '0190fb05-8e0f-799e-a927-5d4aaf770d2b',
        sequence: 1,
        question: 'O quanto você considera seu problema de voz agora como Severo?',
      },
      {
        key: '0190fb05-98ba-799e-a927-60b77fc11556',
        sequence: 2,
        question: 'Seu trabalho é afetado pelo seu problema de voZ?',
      },
      {
        key: '0190fb05-a494-799e-a927-6f8787da04a7',
        sequence: 3,
        question:
          'Nos últimos 6 meses você tem pensado em mudar de trabalho devido ao seu problema de voz?',
      },
      {
        key: '0190fb05-ad16-799e-a927-7075b621b5e2',
        sequence: 4,
        question: 'O seu problema de voz criou alguma pressão em seu trabalho?',
      },
      {
        key: '0190fb05-b4f1-799e-a927-7f40ef1f5e1e',
        sequence: 5,
        question:
          'Nos últimos 6 meses, o seu problema de voz tem afetado suas decisões para o futuro de sua carreira?',
      },
      {
        key: '0190fb05-c17b-799e-a927-822ddaa02429',
        sequence: 6,
        question:
          'As pessoas pedem para você repetir o que acabou de dizer devido ao seu problema de voz?',
      },
      {
        key: '0190fb05-d043-799e-a927-8a2ab401f8f3',
        sequence: 7,
        question:
          'Nos últimos 6 meses você alguma vez evitou falar com as pessoas devido ao seu problema de voz?',
      },
      {
        key: '0190fb05-d887-799e-a927-973c2a7b3abf',
        sequence: 8,
        question:
          'As pessoas têm dificuldade em entender você no telefone devido ao seu problema de voz?',
      },
      {
        key: '0190fb05-e192-799e-a927-9adb5302c694',
        sequence: 9,
        question:
          'Nos últimos 6 meses você tem reduzido o uso do telefone devido ao seu problema de voz?',
      },
      {
        key: '0190fb05-eb7d-799e-a927-a0e72e42242f',
        sequence: 10,
        question: 'O seu problema de voz afeta sua comunicação em ambientes silenciosos?',
      },
      {
        key: '0190fb05-fe4b-799e-a927-ae52eb816808',
        sequence: 11,
        question:
          'Nos últimos 6 meses você tem evitado conversar em ambientes silenciosos devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-07cd-799e-a927-b558d7d852b1',
        sequence: 12,
        question: 'O seu problema de voz afeta sua comunicação em ambientes ruidosos?',
      },
      {
        key: '0190fb06-0e65-799e-a927-b849734aba41',
        sequence: 13,
        question:
          'Nos últimos 6 meses você alguma vez evitou conversar em ambientes ruidosos devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-16b8-799e-a927-c8178af0767e',
        sequence: 14,
        question:
          'O seu problema de voz afeta sua mensagem quando você está falando para um grupo de pessoas?',
      },
      {
        key: '0190fb06-209e-799e-a927-d108b1e84cc2',
        sequence: 15,
        question:
          'Nos últimos 6 meses você alguma vez evitou conversar em grupo devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-2ada-799e-a927-e3ad5c9776c5',
        sequence: 16,
        question: 'O seu problema de voz afeta a transmissão da sua mensagem?',
      },
      {
        key: '0190fb06-3496-799e-a927-eb7448f4f34f',
        sequence: 17,
        question: 'Nos últimos 6 meses você alguma vez evitou falar devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-490c-799e-a927-f574cca1e92c',
        sequence: 18,
        question: 'O seu problema de voz afeta você em atividades sociais?',
      },
      {
        key: '0190fb06-4f2e-799e-a927-fc1b09dbfeda',
        sequence: 19,
        question:
          'Nos últimos 6 meses você alguma vez evitou atividades sociais devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-59f2-799e-a928-0cb8e6820e57',
        sequence: 20,
        question:
          'Seus familiares, amigos e colegas de trabalho se incomodam com o seu problema de voz?',
      },
      {
        key: '0190fb06-6611-799e-a928-135e549eea7f',
        sequence: 21,
        question:
          'Nos últimos 6 meses você alguma vez evitou comunicar-se com sua família, amigos ou colegas de trabalho devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-70de-799e-a928-1fe3a40a5c48',
        sequence: 22,
        question: 'Você sente-se chateado com seu problema de voz?',
      },
      {
        key: '0190fb06-7b5c-799e-a928-234edcb454ed',
        sequence: 23,
        question: 'Você fica envergonhado com seu problema de voz?',
      },
      {
        key: '0190fb06-84e4-799e-a928-2e5406f2428e',
        sequence: 24,
        question: 'Você tem uma baixa auto-estima devido ao seu problema de voz?',
      },
      {
        key: '0190fb06-8ebb-799e-a928-304ed1f26e43',
        sequence: 25,
        question: 'Você está preocupado com seu problema de voz?',
      },
      {
        key: '0190fb06-9e62-799e-a928-3964b0eab68e',
        sequence: 26,
        question: 'Você se sente insatisfeito com seu problema de voz?',
      },
      {
        key: '0190fb06-a4e5-799e-a928-46dd66455581',
        sequence: 27,
        question: 'O seu problema de voz afeta sua personalidade?',
      },
      {
        key: '0190fb06-ad41-799e-a928-490b28723f0d',
        sequence: 28,
        question: 'O seu problema de voz afeta sua auto-imagem?',
      },
    ] as QuestionProtocolModel[];
    let totalGroupKey = '0190fb06-b6cf-799e-a928-53de3f931786';
    let autoPercepcaoDaSeveridadeDoProblemaDeVozGroupKey = '0190fb07-5d75-799e-a928-6507001a1c31';
    let efeitosNoTrabalhoGroupKey = '0190fb07-6d13-799e-a928-695ab31a2c82';
    let efeitosNaComunicacaoDiariaGroupKey = '0190fb07-ac7f-799e-a928-74184f10ab5b';
    let efeitosNaComunicacaoSocialGroupKey = '0190fb07-b63f-799e-a928-7e488e998e39';
    let efeitoNaSuaEmocaoGroupKey = '0190fb07-be0a-799e-a928-8135582a1278';
    ppav.groups = [
      {
        key: totalGroupKey,
        name: 'Total',
        questions: [...ppav.questions],
        baseResults: [
          {
            key: '0190fb07-c6f3-799e-a928-8ff3b71e630f',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 1.8,
            finalValue: 1.8,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb07-d169-799e-a928-95178d720182',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 98.8,
            finalValue: 98.8,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
        functions: [`@${ConvertUtils.uuidV7WithoutOpperators(totalGroupKey)}#groupSum`] as string[],
      },
      {
        key: autoPercepcaoDaSeveridadeDoProblemaDeVozGroupKey,
        name: 'Auto-percepção da severidade do problema de voz',
        questions: [ppav.questions[0]],
        baseResults: [
          {
            key: '0190fb07-db9b-799e-a928-9c79d51c4828',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 0.1,
            finalValue: 0.1,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb07-f1ce-799e-a928-a6553b917f1c',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 5.5,
            finalValue: 5.5,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
        functions: [
          `@${ConvertUtils.uuidV7WithoutOpperators(autoPercepcaoDaSeveridadeDoProblemaDeVozGroupKey)}#groupSum`,
        ] as string[],
      },
      {
        key: efeitosNoTrabalhoGroupKey,
        name: 'Efeitos no trabalho',
        questions: [ppav.questions[1], ppav.questions[2], ppav.questions[3], ppav.questions[4]],
        functions: [
          `@${ConvertUtils.uuidV7WithoutOpperators(efeitosNoTrabalhoGroupKey)}#groupSum`,
        ] as string[],
        baseResults: [
          {
            key: '0190fb07-fcd0-799e-a928-ac4a47b8e539',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 0.2,
            finalValue: 0.2,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb08-0855-799e-a928-b32a78a2f736',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 13.3,
            finalValue: 13.3,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
      },
      {
        key: efeitosNaComunicacaoDiariaGroupKey,
        name: 'Efeitos na comunicação diária',
        questions: [
          ppav.questions[5],
          ppav.questions[6],
          ppav.questions[7],
          ppav.questions[8],
          ppav.questions[9],
          ppav.questions[10],
          ppav.questions[11],
          ppav.questions[12],
          ppav.questions[13],
          ppav.questions[14],
          ppav.questions[15],
          ppav.questions[16],
        ],
        functions: [
          `@${ConvertUtils.uuidV7WithoutOpperators(efeitosNaComunicacaoDiariaGroupKey)}#groupSum`,
        ] as string[],
        baseResults: [
          {
            key: '0190fb08-0f37-799e-a928-bb138ff1d000',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 0.9,
            finalValue: 0.9,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb08-2326-799e-a928-c0909b4b8524',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 43.1,
            finalValue: 43.1,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
      },
      {
        key: efeitosNaComunicacaoSocialGroupKey,
        name: 'Efeitos na comunicação social',
        questions: [ppav.questions[17], ppav.questions[18], ppav.questions[19], ppav.questions[20]],
        functions: [
          `@${ConvertUtils.uuidV7WithoutOpperators(efeitosNaComunicacaoSocialGroupKey)}#groupSum`,
        ] as string[],
        baseResults: [
          {
            key: '0190fb08-2c2b-799e-a928-cbded132ed3e',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 0.2,
            finalValue: 0.2,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb08-3745-799e-a928-d6271f438b72',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 12.7,
            finalValue: 12.7,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
      },
      {
        key: efeitoNaSuaEmocaoGroupKey,
        name: 'Efeito na sua emoção',
        questions: [
          ppav.questions[21],
          ppav.questions[22],
          ppav.questions[23],
          ppav.questions[24],
          ppav.questions[25],
          ppav.questions[26],
          ppav.questions[27],
        ],
        functions: [
          `@${ConvertUtils.uuidV7WithoutOpperators(efeitoNaSuaEmocaoGroupKey)}#groupSum`,
        ] as string[],
        baseResults: [
          {
            key: '0190fb08-452b-799e-a928-d89be0449098',
            name: 'Vozes saudáveis',
            isRange: false,
            initialValue: 0.4,
            finalValue: 0.4,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
          {
            key: '0190fb08-4b7d-799e-a928-e0450265cffc',
            name: 'Disfônicos',
            isRange: false,
            initialValue: 24.2,
            finalValue: 24.2,
            answerType: AnswerValueTypeEnum.NUMERIC,
          },
        ],
      },
    ] as QuestionGroupProtocolModel[];
    ppav.functions = [] as string[];

    return ppav;
  }

  static getAll(): ProtocolModel[] {
    const ret = [
      ProtocolMock.generateQVV(),
      ProtocolMock.generateESV(),
      ProtocolMock.generateEDTV(),
      ProtocolMock.generatePPAV(),
    ];
    if (this._addingOne) {
      ret.push(this._addingOne);
    }
    return ret;
  }

  private static _addingOne: ProtocolModel;
  static add(p: ProtocolModel): ProtocolModel {
    this._addingOne = p;
    this._addingOne.id = this.getAll().length + 1;
    return this._addingOne;
  }

  static randomOne(): ProtocolModel {
    let index = Number.parseInt((Math.random() * ProtocolMock.getAll().length).toFixed(0));
    return ProtocolMock.getAll().at(index)!;
  }
}
