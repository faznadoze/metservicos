export type ServiceInterest = 'instalacao' | 'limpeza' | 'duvida';

export interface ServiceItem {
  id: 'instalacao' | 'limpeza';
  indexNumber: string;
  tagLabel: string;
  title: string;
  headline: string;
  description: string;
  bullets: string[];
  ctaText: string;
  whatsappPreset: ServiceInterest;
  technicalHighlights: {
    label: string;
    value: string;
  }[];
}

export interface BenefitItem {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export interface ProcessStepItem {
  stepNumber: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface FAQItem {
  id: string;
  category: 'instalacao' | 'limpeza' | 'atendimento';
  question: string;
  answer: string;
}

export interface CommitmentItem {
  code: string;
  title: string;
  description: string;
  verificationPoint: string;
}

export const COMPANY_CONFIG = {
  brandName: 'MeT Serviços',
  legalDescriptor: 'Energia Solar e Reformas',
  essence: 'Energia solar instalada, cuidada e explicada por quem entende.',
  whatsappNumber: '5511999990000',
  phoneDisplay: '(11) 99999-0000',
  email: 'contato@metservicos.com.br',
  serviceArea: 'Atendimento em toda a região metropolitana e interior sob consulta',
  serviceHours: 'Segunda a Sexta, das 08h às 18h · Sábado, das 08h às 12h',
  logoPath: '/assets/aistudio/icon-met_15dca95c.svg',
};

export const HERO_CONTENT = {
  kicker: 'Instalação Fotovoltaica · Limpeza Técnica · Manutenção Preventiva',
  headline: 'Mais controle sobre sua energia, do projeto ao cuidado do seu sistema.',
  subheadline:
    'Instalação de painéis solares e limpeza de sistemas fotovoltaicos para residências e empresas que querem produzir melhor e cuidar do investimento.',
  primaryCta: 'Solicitar orçamento pelo WhatsApp',
  secondaryCta: 'Conhecer os serviços',
  trustMarkers: [
    'Atendimento regional sob consulta',
    'Avaliação personalizada por imóvel',
    'Equipe técnica especializada',
    'Orientação clara sem promessas irreais',
  ],
};

export const TRUST_BAR_ITEMS = [
  {
    index: '01',
    title: 'Projeto sob medida',
    detail: 'Dimensionado segundo o seu perfil real de consumo e área de telhado.',
  },
  {
    index: '02',
    title: 'Instalação com orientação clara',
    detail: 'Explicamos cada etapa, equipamentos e prazos sem jargão confuso.',
  },
  {
    index: '03',
    title: 'Limpeza para preservar o desempenho',
    detail: 'Remoção segura de fuligem, poeira e resíduos que bloqueiam a luz solar.',
  },
  {
    index: '04',
    title: 'Atendimento próximo',
    detail: 'Contato direto com quem avalia e executa o serviço no seu imóvel.',
  },
];

export const SERVICES_CONTENT: ServiceItem[] = [
  {
    id: 'instalacao',
    indexNumber: '01',
    tagLabel: 'Novos Projetos Fotovoltaicos',
    title: 'Instalação de painéis solares',
    headline: 'Comece a gerar sua própria energia com um projeto pensado para o seu imóvel.',
    description:
      'Avaliamos o local, entendemos o seu consumo e orientamos a solução mais adequada para transformar a incidência solar em geração de energia. Do planejamento à instalação, você recebe um processo explicado sem complicação e com foco em segurança, desempenho e confiabilidade.',
    bullets: [
      'Avaliação do imóvel e do perfil de consumo.',
      'Dimensionamento conforme a necessidade do cliente.',
      'Orientação sobre equipamentos e etapas.',
      'Instalação organizada e acompanhamento do processo.',
    ],
    ctaText: 'Quero avaliar meu projeto solar',
    whatsappPreset: 'instalacao',
    technicalHighlights: [
      { label: 'Público atendido', value: 'Residencial · Comercial · Rural' },
      { label: 'Etapa inicial', value: 'Análise de fatura e estrutura de telhado' },
      { label: 'Execução', value: 'Fixação segura, cabeamento protegido e testes' },
    ],
  },
  {
    id: 'limpeza',
    indexNumber: '02',
    tagLabel: 'Conservação e Inspeção Visual',
    title: 'Limpeza de sistemas fotovoltaicos',
    headline: 'Seu sistema trabalha com o sol. Mantenha a superfície pronta para recebê-lo.',
    description:
      'Poeira, folhas, poluição e resíduos podem se acumular sobre os módulos. A limpeza periódica ajuda a manter o sistema em boas condições e permite identificar visualmente sinais que merecem atenção. Cuidar dos painéis é cuidar do investimento que já está no seu telhado.',
    bullets: [
      'Remoção cuidadosa de sujeira e resíduos.',
      'Mais atenção à conservação dos módulos.',
      'Identificação visual de possíveis anormalidades.',
      'Serviço indicado para residências, comércios e propriedades rurais, conforme área de atendimento.',
    ],
    ctaText: 'Agendar limpeza do meu sistema',
    whatsappPreset: 'limpeza',
    technicalHighlights: [
      { label: 'Método utilizado', value: 'Escovação macia própria para vidro solar' },
      { label: 'Segurança de superfície', value: 'Sem abrasivos ou choque térmico nos módulos' },
      { label: 'Entrega adicional', value: 'Registro visual antes e depois do atendimento' },
    ],
  },
];

export const WHY_CARE_ITEMS: BenefitItem[] = [
  {
    number: '01',
    title: 'Preserve seu investimento',
    description: 'O sistema fotovoltaico merece manutenção compatível com sua importância.',
    detail:
      'Módulos expostos ao tempo acumulam partículas aderentes que a chuva comum não remove por completo, especialmente nas bordas inferiores do quadro de alumínio.',
  },
  {
    number: '02',
    title: 'Acompanhe a condição dos módulos',
    description: 'Sujeira e resíduos ficam mais fáceis de identificar e tratar.',
    detail:
      'Durante a limpeza, observamos visualmente o estado dos vidros, possíveis sombreamentos novos por vegetação, acúmulo de folhas sob as placas e integridade aparente das fixações.',
  },
  {
    number: '03',
    title: 'Evite decisões no escuro',
    description: 'Uma avaliação ajuda a entender o que realmente precisa ser feito.',
    detail:
      'Antes de executar qualquer intervenção, verificamos se a necessidade do imóvel é limpeza óptica, revisão de estrutura ou adequação de um novo projeto.',
  },
  {
    number: '04',
    title: 'Tenha orientação de verdade',
    description: 'O cliente sabe qual é a próxima etapa antes de contratar.',
    detail:
      'Trabalhamos com transparência técnica: explicamos o que está incluso no serviço, como o acesso ao telhado será realizado e quais cuidados tomamos com o seu imóvel.',
  },
];

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    stepNumber: '01',
    title: 'Você chama',
    description: 'Entre em contato pelo WhatsApp ou preencha o formulário curto de avaliação.',
    deliverable: 'Atendimento humano direto, sem robôs intermináveis.',
  },
  {
    stepNumber: '02',
    title: 'Entendemos o cenário',
    description: 'Avaliamos as características do seu imóvel, telhado e necessidade atual do sistema.',
    deliverable: 'Levantamento técnico de consumo ou estado de conservação.',
  },
  {
    stepNumber: '03',
    title: 'Indicamos o serviço',
    description: 'Apresentamos a proposta adequada e explicamos cada etapa do trabalho com clareza.',
    deliverable: 'Escopo transparente com condições e cronograma definidos.',
  },
  {
    stepNumber: '04',
    title: 'Executamos com cuidado',
    description: 'Realizamos a instalação ou limpeza técnica mantendo você informado do início ao fim.',
    deliverable: 'Serviço concluído com organização, segurança e registro visual.',
  },
];

export const COMMITMENT_ITEMS: CommitmentItem[] = [
  {
    code: 'COMP-01',
    title: 'Sem promessas irreais de geração fixa',
    description:
      'A geração solar depende da irradiação local, inclinação, orientação do telhado e hábitos de consumo. Explicamos o potencial real do seu cenário com responsabilidade técnica.',
    verificationPoint: 'Avaliação individualizada por endereço e perfil de uso',
  },
  {
    code: 'COMP-02',
    title: 'Cuidado com o telhado e patrimônio',
    description:
      'Subir em telhados exige método e equipamento correto. Priorizamos a integridade das telhas, calhas, impermeabilização e limpeza da área após o serviço.',
    verificationPoint: 'Procedimento seguro de movimentação e vedação',
  },
  {
    code: 'COMP-03',
    title: 'Registro visual antes e depois',
    description:
      'Em serviços de limpeza e manutenção visual, documentamos como encontramos os módulos e o resultado final da superfície limpa para sua total tranquilidade.',
    verificationPoint: 'Fotos reais do próprio atendimento enviadas ao cliente',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'custo-instalacao',
    category: 'instalacao',
    question: 'Quanto custa instalar painéis solares?',
    answer:
      'O valor de um sistema fotovoltaico varia conforme a sua média de consumo mensal, o tipo de telhado (cerâmico, metálico, fibrocimento ou laje), as condições da rede elétrica local e a quantidade de módulos necessária. Por isso, realizamos uma avaliação personalizada do seu imóvel para apresentar um orçamento preciso e coerente com a sua realidade.',
  },
  {
    id: 'imovel-compativel',
    category: 'instalacao',
    question: 'Minha casa ou empresa pode receber um sistema solar?',
    answer:
      'Na grande maioria dos casos, sim. Avaliamos a área útil disponível no telhado ou solo, a orientação em relação ao sol, a presença de sombreamentos (árvores ou prédios vizinhos) e as condições estruturais e elétricas do imóvel antes de recomendar a instalação.',
  },
  {
    id: 'frequencia-limpeza',
    category: 'limpeza',
    question: 'Com que frequência os painéis precisam ser limpos?',
    answer:
      'A frequência ideal depende do ambiente onde o imóvel está inserido. Locais próximos a vias de grande movimento, áreas industriais, árvores, obras ou estradas de terra acumulam poeira e resíduos mais rapidamente. Em média, recomenda-se uma avaliação a cada 6 meses ou sempre que notar sujeira visível sobre os módulos.',
  },
  {
    id: 'tipos-telhado-limpeza',
    category: 'limpeza',
    question: 'A limpeza pode ser feita em qualquer tipo de telhado?',
    answer:
      'Atendemos diferentes tipos de cobertura — residencial, comercial e rural — desde que ofereçam condições seguras de acesso e ancoragem. No primeiro contato, solicitamos informações básicas ou fotos do local para planejar o atendimento com os equipamentos adequados.',
  },
  {
    id: 'limpeza-vs-manutencao-eletrica',
    category: 'limpeza',
    question: 'A limpeza substitui a manutenção elétrica do sistema?',
    answer:
      'Não. A limpeza fotovoltaica cuida da superfície óptica dos módulos para que recebam a luz solar sem barreiras de sujeira e inclui uma observação visual externa. Já a manutenção elétrica envolve testes em inversores, string box, conexões e cabeamento. Os dois cuidados são complementares.',
  },
  {
    id: 'cidades-atendidas',
    category: 'atendimento',
    question: 'Vocês atendem quais cidades?',
    answer:
      'Atendemos residências, comércios e propriedades rurais na região. Informe sua cidade ou bairro pelo WhatsApp ou no formulário abaixo para confirmarmos a disponibilidade e o agendamento para o seu endereço.',
  },
  {
    id: 'como-funciona-orcamento',
    category: 'atendimento',
    question: 'Como funciona o orçamento?',
    answer:
      'É simples e rápido: você nos informa se precisa de instalação de um novo sistema ou limpeza/avaliação de painéis já instalados, juntamente com sua localização. Nossa equipe analisa as informações iniciais, tira suas dúvidas e apresenta a orientação técnica e comercial adequada.',
  },
];
