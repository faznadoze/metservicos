# Plano de Landing Page — Energia Solar e Reformas

## 1. Objetivo do projeto

Criar uma landing page de alta conversão para a **Energia Solar e Reformas**, com foco em gerar contatos qualificados pelo WhatsApp e formulário de orçamento para dois serviços principais:

1. Instalação de painéis solares.
2. Limpeza e manutenção de sistemas fotovoltaicos.

A página deve transmitir confiança técnica, economia, cuidado com o patrimônio do cliente e agilidade no atendimento. O logotipo fornecido pelo cliente (`MTLOGO.png`) será a referência visual principal e deverá ser preservado sem alterações no símbolo, nas proporções ou nas cores institucionais.

### Objetivos de negócio

- Gerar pedidos de orçamento.
- Separar visitantes interessados em instalação daqueles que precisam de limpeza/manutenção.
- Explicar o valor do serviço sem depender de conhecimento técnico do visitante.
- Reduzir dúvidas e objeções antes do contato.
- Criar uma base de conteúdo preparada para SEO local e campanhas de tráfego pago.

### Conversão primária

Botão de WhatsApp com mensagem pré-preenchida conforme o serviço escolhido.

Exemplo de mensagem para instalação:

> Olá! Quero solicitar um orçamento para instalação de energia solar.

Exemplo de mensagem para limpeza:

> Olá! Quero agendar uma avaliação/limpeza do meu sistema fotovoltaico.

### Conversões secundárias

- Formulário curto de orçamento.
- Clique para ligação telefônica.
- Clique para abrir localização, caso exista atendimento presencial.
- Download ou acesso a uma apresentação comercial, caso a empresa possua esse material.

---

## 2. Direção estratégica de design e marca

### Movimento visual escolhido

**Tecnologia solar confiável**: uma estética limpa, energética e técnica, combinando o azul-marinho do logotipo com amarelo/laranja solar, superfícies claras e detalhes inspirados em raios de luz e linhas de telhado.

### Princípios visuais

- **Clareza antes da decoração:** cada seção deve responder a uma dúvida ou conduzir a uma ação.
- **Confiança local:** mostrar equipe, processo, áreas atendidas e provas reais sempre que possível.
- **Energia em movimento:** utilizar animações leves para sugerir fluxo, luz e geração de energia.
- **Contraste comercial:** CTAs em amarelo/laranja devem se destacar imediatamente do azul institucional.

### Paleta inicial

- Azul-marinho institucional: `#172D55` ou valor extraído do logotipo.
- Azul profundo para fundos: `#0B1933`.
- Amarelo solar: `#FFD21A`.
- Laranja de ação: `#F5A900`.
- Fundo claro: `#F7F9FC`.
- Texto escuro: `#17202F`.
- Verde de confirmação, apenas para estados de sucesso: `#1E9B68`.

Os valores finais devem ser ajustados após uma conferência visual do logotipo e testes de contraste WCAG.

### Tipografia

- Títulos: **Manrope** ou **Plus Jakarta Sans**, em pesos 700/800.
- Texto e interface: **Inter**, em pesos 400/500/600.
- Hierarquia: H1 curto e orientado ao benefício; H2 com promessa clara; parágrafos de no máximo 3–4 linhas em desktop.

### Elementos de assinatura

1. Raios de luz e gradientes radiais discretos atrás de títulos ou imagens.
2. Linhas diagonais inspiradas no telhado do símbolo da marca.
3. Pequenos indicadores de fluxo/energia animados com GSAP, usados com moderação.

### Essência da marca

**Energia solar instalada, cuidada e explicada por quem entende.**

Personalidade: **confiável, técnica e próxima**.

### Voz da marca

A comunicação deve ser direta, segura e comercial, sem prometer economia fixa ou resultados que dependam de variáveis não avaliadas.

Exemplos:

- “Transforme a luz do sol em mais controle sobre a sua conta de energia.”
- “Seu sistema fotovoltaico produz melhor quando também recebe o cuidado certo.”

Evitar termos vagos como “a melhor empresa” sem prova. Preferir benefícios verificáveis, processo claro e chamada para avaliação.

---

## 3. Estrutura recomendada da página

### 3.1 Tela inicial de loading do logotipo

**Objetivo:** criar uma entrada memorável sem atrasar o acesso ao conteúdo.

Comportamento recomendado:

- Fundo azul-marinho institucional.
- Logotipo centralizado usando `MTLOGO.png`.
- Revelação suave do símbolo e do nome da empresa.
- Barra ou linha de progresso curta em amarelo solar.
- Duração ideal: 900–1.500 ms; em visitas recorrentes, permitir redução ou remoção do loading.
- Respeitar `prefers-reduced-motion` e remover animações para usuários que solicitaram menos movimento.
- Nunca bloquear o conteúdo por uma animação longa ou sem fallback.

Implementação:

- Componente `LogoLoader`.
- Timeline GSAP com `autoAlpha`, `scale`, `clipPath` ou máscara simples.
- Pré-carregamento apenas dos ativos críticos.
- Após o carregamento, transição para o hero com `gsap.context()` para permitir limpeza correta no React.

### 3.2 Header fixo

Conteúdo:

- Logotipo reduzido.
- Links âncora: Serviços, Como funciona, Benefícios, Dúvidas.
- CTA: **“Pedir orçamento”**.
- No mobile, menu compacto e CTA de WhatsApp sempre acessível.

### 3.3 Hero principal

#### Headline recomendada

**Mais controle sobre sua energia, do projeto ao cuidado do seu sistema.**

#### Subheadline

**Instalação de painéis solares e limpeza de sistemas fotovoltaicos para residências e empresas que querem produzir melhor e cuidar do investimento.**

#### CTAs

Primário: **Solicitar orçamento pelo WhatsApp**

Secundário: **Conhecer os serviços**

#### Apoios de confiança

Usar apenas informações verdadeiras e confirmadas, por exemplo:

- Atendimento em `[cidade/região]`.
- Avaliação personalizada.
- Equipe especializada.
- Orçamento sem compromisso, se essa condição existir.

#### Visual

- Hero com composição assimétrica, não apenas duas colunas iguais.
- Logo e texto à esquerda; imagem ou composição solar à direita.
- Caso existam fotos reais, priorizá-las. Se ainda não existirem, gerar uma imagem conceitual de instalação residencial com área segura para texto, sem inserir texto dentro da imagem.
- Aplicar um brilho sutil acompanhando o movimento do ponteiro ou do scroll.

### 3.4 Barra de prova rápida

Três ou quatro indicadores curtos abaixo do hero:

- Projeto sob medida.
- Instalação com orientação clara.
- Limpeza para preservar o desempenho.
- Atendimento próximo.

Não usar números de instalações, anos de experiência ou avaliações sem comprovação.

### 3.5 Seção de serviços

#### Serviço 1 — Instalação de painéis solares

**Headline:**

**Comece a gerar sua própria energia com um projeto pensado para o seu imóvel.**

**Copy:**

> Avaliamos o local, entendemos o seu consumo e orientamos a solução mais adequada para transformar a incidência solar em geração de energia. Do planejamento à instalação, você recebe um processo explicado sem complicação e com foco em segurança, desempenho e confiabilidade.

**Bullets:**

- Avaliação do imóvel e do perfil de consumo.
- Dimensionamento conforme a necessidade do cliente.
- Orientação sobre equipamentos e etapas.
- Instalação organizada e acompanhamento do processo.

**CTA:** **Quero avaliar meu projeto solar**

#### Serviço 2 — Limpeza de sistemas fotovoltaicos

**Headline:**

**Seu sistema trabalha com o sol. Mantenha a superfície pronta para recebê-lo.**

**Copy:**

> Poeira, folhas, poluição e resíduos podem se acumular sobre os módulos. A limpeza periódica ajuda a manter o sistema em boas condições e permite identificar visualmente sinais que merecem atenção. Cuidar dos painéis é cuidar do investimento que já está no seu telhado.

**Bullets:**

- Remoção cuidadosa de sujeira e resíduos.
- Mais atenção à conservação dos módulos.
- Identificação visual de possíveis anormalidades.
- Serviço indicado para residências, comércios e propriedades rurais, conforme área de atendimento.

**CTA:** **Agendar limpeza do meu sistema**

Observação: evitar afirmar percentuais garantidos de aumento de geração sem medição antes/depois e sem metodologia definida.

### 3.6 Seção “Por que cuidar do sistema?”

Estrutura em cards ou narrativa com quatro pontos:

1. **Preserve seu investimento** — o sistema fotovoltaico merece manutenção compatível com sua importância.
2. **Acompanhe a condição dos módulos** — sujeira e resíduos ficam mais fáceis de identificar e tratar.
3. **Evite decisões no escuro** — uma avaliação ajuda a entender o que realmente precisa ser feito.
4. **Tenha orientação de verdade** — o cliente sabe qual é a próxima etapa antes de contratar.

### 3.7 Como funciona

Fluxo visual em quatro etapas:

1. **Você chama** pelo WhatsApp ou formulário.
2. **Entendemos o cenário** do imóvel e do sistema.
3. **Indicamos o serviço** e explicamos o processo.
4. **Executamos com cuidado** e mantemos você informado.

GSAP pode animar a linha de conexão entre etapas conforme o scroll.

### 3.8 Prova social e confiança

Priorizar materiais reais:

- Fotos próprias de instalações e limpezas.
- Depoimentos autorizados com nome, cidade e contexto.
- Antes e depois da limpeza, sem manipular a imagem.
- Certificados, registros ou marcas de parceiros, apenas quando aplicável.

Se ainda não houver provas disponíveis, substituir por uma seção “Nosso compromisso” em vez de inventar depoimentos.

### 3.9 FAQ para objeções

Perguntas iniciais:

- Quanto custa instalar painéis solares?
- Minha casa ou empresa pode receber um sistema solar?
- Com que frequência os painéis precisam ser limpos?
- A limpeza pode ser feita em qualquer tipo de telhado?
- A limpeza substitui a manutenção elétrica do sistema?
- Vocês atendem quais cidades?
- Como funciona o orçamento?

As respostas devem ser personalizadas conforme a operação real da empresa. A FAQ também será útil para SEO e para reduzir contatos pouco qualificados.

### 3.10 CTA final e formulário

#### Headline

**Pronto para dar o próximo passo com mais segurança?**

#### Texto

**Conte brevemente o que você precisa. A equipe da Energia Solar e Reformas entra em contato para entender o cenário e indicar o caminho mais adequado.**

#### Campos mínimos

- Nome.
- WhatsApp.
- Cidade/região.
- Interesse: Instalação / Limpeza / Ainda não sei.
- Mensagem opcional.

Não solicitar dados desnecessários. Incluir consentimento simples para contato e link para a política de privacidade.

#### CTA

**Quero receber orientação**

### 3.11 Rodapé

- Logotipo.
- Serviços.
- WhatsApp, telefone e e-mail reais.
- Cidade/região atendida.
- Redes sociais.
- CNPJ, se a empresa desejar exibir.
- Política de privacidade.
- Copyright.

---

## 4. Arquitetura técnica

### Stack

- React + TypeScript.
- Vite ou template React equivalente do ambiente escolhido.
- GSAP para timelines e animações de scroll.
- `@gsap/react` para integração segura com lifecycle do React.
- CSS Modules, Tailwind ou CSS organizado por componentes; escolher uma única abordagem para evitar mistura excessiva.
- React Hook Form ou formulário controlado simples.
- Ícones SVG acessíveis, preferencialmente inline ou via biblioteca leve.

### Componentes principais

```text
src/
  app/
    App.tsx
    routes.ts
    seo.ts
  components/
    LogoLoader/
    Header/
    Hero/
    TrustBar/
    ServiceCard/
    Benefits/
    ProcessSteps/
    SocialProof/
    FAQ/
    LeadForm/
    FinalCTA/
    Footer/
  hooks/
    useReducedMotion.ts
    useScrollReveal.ts
  lib/
    analytics.ts
    whatsapp.ts
    validation.ts
  styles/
    tokens.css
    globals.css
  assets/
    MTLOGO.png
    images/
  content/
    landingPage.ts
public/
  manus-routes.json
  robots.txt
  sitemap.xml
```

### Princípios de implementação

- Separar conteúdo comercial dos componentes para facilitar testes de copy.
- Usar dados estruturados para renderizar serviços, benefícios, FAQ e etapas.
- Centralizar URLs e mensagens do WhatsApp em configuração.
- Deixar telefones, cidades, horários e redes sociais como variáveis editáveis.
- Não colocar credenciais, tokens ou chaves diretamente no frontend.
- Comprimir imagens, usar `width`/`height`, `loading="lazy"` para imagens fora da primeira dobra e formatos modernos quando disponíveis.

### Formulário e WhatsApp

O caminho inicial pode ser um formulário que abre o WhatsApp com uma mensagem composta a partir dos dados preenchidos. Para uma operação mais robusta, integrar o formulário a um endpoint ou CRM depois de validar volume e qualidade dos leads.

Eventos a medir:

- `view_page`.
- `click_whatsapp_hero`.
- `click_service_installation`.
- `click_service_cleaning`.
- `start_form`.
- `submit_form`.
- `faq_open`.
- `click_phone`.

---

## 5. Estratégia de animação com GSAP

A animação deve reforçar a percepção de energia, cuidado e fluidez, sem prejudicar velocidade ou acessibilidade.

### Sequência de entrada

1. Fundo da tela de loading aparece.
2. Símbolo do logo ganha escala e opacidade.
3. Nome da empresa é revelado.
4. Linha solar completa o progresso.
5. Loader sai em uma transição curta e revela o hero.

### Animações de scroll

- Hero: entrada escalonada do título, texto, CTA e elemento visual.
- Seção de serviços: cards aparecem com pequeno deslocamento vertical e stagger.
- Processo: linha de conexão cresce conforme a seção entra na viewport.
- Benefícios: ícones fazem microanimação única, sem loop excessivo.
- CTA final: brilho ou gradiente se move lentamente, sem distrair do botão.

### Regras de performance

- Usar principalmente `transform` e `opacity`.
- Evitar animar layout, sombras pesadas e filtros em excesso.
- Usar `ScrollTrigger` com `once: true` em revelações que não precisam se repetir.
- Respeitar `prefers-reduced-motion`.
- Desabilitar efeitos complexos em dispositivos com pouca capacidade ou conexão lenta.
- Não deixar a animação do loading impedir leitura do conteúdo.

---

## 6. SEO local e conversão

### SEO on-page inicial

Título sugerido:

**Energia Solar e Limpeza Fotovoltaica em [Cidade] | Energia Solar e Reformas**

Descrição sugerida:

**Instalação de painéis solares e limpeza de sistemas fotovoltaicos em [região]. Solicite uma avaliação e receba orientação para cuidar melhor do seu investimento.**

Palavras-chave naturais:

- instalação de painéis solares em `[cidade]`;
- energia solar residencial e comercial em `[região]`;
- limpeza de placas solares;
- limpeza de sistema fotovoltaico;
- manutenção de painéis solares.

### Requisitos técnicos

- Conteúdo relevante disponível no HTML inicial, não apenas após o JavaScript.
- H1 único e alinhado à promessa principal.
- H2s descritivos para serviços, processo, benefícios e dúvidas.
- `title`, `meta description`, canonical e Open Graph.
- `sitemap.xml` e `robots.txt` coerentes com a URL pública.
- Schema.org, quando houver dados reais, para `LocalBusiness`, `Service` e `FAQPage`.
- Imagens com texto alternativo descritivo, por exemplo: “Técnico realizando limpeza em módulos fotovoltaicos”.

### CRO

- CTA visível na primeira dobra.
- WhatsApp repetido nos pontos de maior intenção, sem excesso.
- Formulário curto.
- CTA específico por serviço, em vez de “Saiba mais” genérico.
- Provas reais próximas das chamadas de ação.
- Linguagem de avaliação/orientação, evitando pressão artificial.
- FAQ direcionada às objeções reais coletadas no atendimento.

---

## 7. Responsividade e acessibilidade

### Breakpoints de referência

- Mobile: 320–767 px.
- Tablet: 768–1.023 px.
- Desktop: 1.024 px ou mais.

### Mobile first

- CTA de WhatsApp flutuante, sem cobrir o formulário.
- H1 com no máximo 3–4 linhas em telas comuns.
- Cards de serviço empilhados.
- Formulário com campos de largura total.
- Menu com foco visível e fechamento por Escape.

### Acessibilidade

- Contraste adequado.
- Foco visível no teclado.
- Labels reais nos campos.
- Mensagens de erro associadas aos campos.
- `alt` significativo no logo e nas imagens.
- Botões com nomes claros.
- Animações reduzidas quando solicitado pelo sistema.
- Não usar cor como único indicador de estado.

---

## 8. Fases de execução

### Fase 1 — Descoberta e definição

Confirmar cidade/região, canais de contato, público prioritário, tipos de imóvel, diferenciais, área de atendimento, disponibilidade de fotos reais, provas sociais e identidade da empresa.

**Entrega:** briefing consolidado e mapa de conversão.

### Fase 2 — Direção visual e conteúdo

Refinar paleta a partir do logotipo, definir tipografia, selecionar ou produzir imagens, validar wireframe e revisar a copy com a equipe comercial.

**Entrega:** sistema visual, wireframe e texto aprovado.

### Fase 3 — Implementação

Construir a estrutura React, componentes, conteúdo, loading do logo, GSAP, formulário, WhatsApp, responsividade e metadados.

**Entrega:** primeira versão funcional em ambiente de preview.

### Fase 4 — Refinamento orientado à conversão

Comparar hierarquia, clareza das ofertas, força dos CTAs, fricção do formulário, legibilidade mobile e presença das provas. Ajustar copy, espaçamento, contraste e animações.

**Entrega:** versão otimizada para lançamento.

### Fase 5 — Validação e publicação

Verificar erros de console, links, envio do formulário, mensagens de WhatsApp, desempenho, acessibilidade, SEO inicial e comportamento em telas reais.

**Entrega:** landing page publicada e instrumentada para medir conversões.

---

## 9. Skills e ferramentas a aplicar

- **Webdev:** inicialização do projeto, estrutura React, preview, configuração e publicação.
- **Imagegen/image-processing:** tratamento do logotipo, quando necessário, e criação de imagens conceituais ou apoio visual planejado; não substituir fotos reais por imagens genéricas quando houver material próprio.
- **Webdev SEO:** HTML indexável, metadados, canonical, sitemap, robots e dados estruturados.
- **Data analysis:** leitura posterior de eventos de conversão, origem dos leads, taxa de clique em WhatsApp e abandono do formulário.
- **Copywriting/CRO:** testes de headline, CTAs, ordem das seções, objeções e prova social.
- **Acessibilidade e performance:** auditoria de contraste, teclado, motion, peso de imagens e Core Web Vitals.

---

## 10. Critérios de sucesso

A landing page estará pronta para lançamento quando:

- O visitante entender em poucos segundos quais serviços são oferecidos.
- A primeira dobra apresentar uma promessa clara e um CTA acionável.
- O usuário conseguir escolher entre instalação e limpeza sem confusão.
- O loading do logo for curto, elegante e acessível.
- O conteúdo funcionar bem sem depender exclusivamente das animações.
- WhatsApp e formulário gerarem mensagens completas e rastreáveis.
- A página estiver legível e utilizável em mobile.
- Houver informações reais de atendimento, empresa e contato.
- SEO técnico básico e conteúdo local estiverem configurados.
- Nenhuma promessa, número ou depoimento sem comprovação estiver publicado.

---

## 11. Informações pendentes para a implementação

Antes de desenvolver a versão final, solicitar:

1. Cidade e raio de atendimento.
2. Número de WhatsApp, telefone e e-mail.
3. Horário de atendimento.
4. Público prioritário: residencial, comercial, rural ou todos.
5. Fotos próprias de instalações, equipe e limpezas.
6. Quantidade real de projetos/instalações e anos de experiência, se desejar exibir.
7. Depoimentos autorizados.
8. CNPJ, endereço e links de redes sociais, caso devam aparecer.
9. Se a empresa oferece orçamento gratuito, visita técnica ou condições específicas.
10. Tecnologia atualmente usada no site/domínio e necessidade de integração com CRM.

## Resultado esperado

Uma landing page rápida, visualmente marcante e comercialmente clara, que use o logotipo da Energia Solar e Reformas como ativo central, transforme a proposta técnica em benefícios compreensíveis e conduza o visitante para um próximo passo simples: conversar com a empresa sobre instalação ou limpeza do sistema fotovoltaico.
