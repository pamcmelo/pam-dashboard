import { useState } from "react";

const data = {
  baseline: "31/03/2026",
  revisoes: [
    { label: "1ª revisão", data: "30/04/2026", dias: 30, desc: "Análise de composição + adesão" },
    { label: "2ª revisão", data: "31/05/2026", dias: 60, desc: "Ajuste de metas de macro" },
    { label: "3ª revisão", data: "30/06/2026", dias: 90, desc: "Avaliação de recomposição" },
  ],
  composicao: {
    peso: "55,66 kg",
    gordura: "29,5%",
    metaGordura: "22–26%",
    musculo: "37,5%",
    vfat: "4,0",
    agua: "50,7%",
    bmi: "22,6",
    tmb: "1.185 kcal",
  },
  treino: { calorias: 1725, proteina: 120, carbo: 190, gordura: 54, prot_pct: 28, carbo_pct: 44, fat_pct: 28 },
  descanso: { calorias: 1325, proteina: 120, carbo: 100, gordura: 50, prot_pct: 36, carbo_pct: 30, fat_pct: 34 },
  limites: { acucar: 40, fibra: 25, media: 1553 },
};

const COLORS = {
  protein: "#E8A838",
  carb: "#3BBFA0",
  fat: "#8B7FD4",
  accent: "#3BBFA0",
  danger: "#E2635A",
  muted: "#9B9B9B",
};

// ─── TREINO COM ACADEMIA ─────────────────────────────────────────────────────

const TREINO_DATA = {
  semana: [
    { dia: "Segunda", tipo: "B", cardio: "Esteira 20min", cor: "#3BBFA0" },
    { dia: "Terça", tipo: "A", cardio: "Elíptico 20min", cor: "#E2635A" },
    { dia: "Quarta", tipo: "descanso", cardio: null, cor: null },
    { dia: "Quinta", tipo: "B", cardio: "Esteira 20min", cor: "#3BBFA0" },
    { dia: "Sexta", tipo: "A", cardio: "Elíptico 20min", cor: "#E2635A" },
    { dia: "Sáb/Dom", tipo: "descanso", cardio: null, cor: null },
  ],
  treinoA: {
    label: "Treino A — Membros Superiores",
    tag: "Braços",
    dias: "Ter / Sex",
    exercicios: [
      {
        nome: "Supino com Halteres", volume: "4×10", obs: "Peito · Tríceps · Deltóide anterior",
        musculo: "Peitoral maior (primário) · Tríceps · Deltóide anterior",
        passos: [
          "Deite no banco com os pés apoiados no chão. Segure um halter em cada mão na altura do peito, cotovelos a ~45° do corpo.",
          "Inspire e empurre os halteres para cima até os braços ficarem quase estendidos — não trave o cotovelo.",
          "Expire na subida. Desça controlado de volta à posição inicial, sentindo o alongamento no peito.",
          "Mantenha as escápulas retraídas (ombros 'para baixo e para trás') durante todo o movimento.",
        ],
        dica: "Se os halteres oscilarem muito para os lados, reduza o peso. Estabilidade antes de carga.",
      },
      {
        nome: "Rosca Direta", volume: "4×12", obs: "Bíceps · Braquial",
        musculo: "Bíceps braquial (primário) · Braquial · Braquiorradial",
        passos: [
          "Em pé, pés na largura dos ombros. Segure a barra ou halteres com pegada supinada (palmas para cima), braços estendidos.",
          "Mantenha os cotovelos fixos ao lado do corpo — eles não devem se mover para frente.",
          "Contraia o bíceps e suba o peso até a altura dos ombros. Expire na subida.",
          "Desça lentamente (2–3 segundos) sem deixar o peso cair.",
        ],
        dica: "Cotovelo parado é o erro mais comum. Se ele avança, o ombro está assumindo o movimento.",
      },
      {
        nome: "Tríceps Pulley (Corda)", volume: "4×15", obs: "Porção longa — foco flacidez",
        musculo: "Tríceps braquial — porção longa (primário) · Porção lateral",
        passos: [
          "Em pé de frente para o cabo alto. Segure as pontas da corda com as palmas voltadas uma para a outra.",
          "Incline levemente o tronco à frente. Cotovelos fixos ao lado do corpo, dobrados a ~90°.",
          "Empurre a corda para baixo abrindo as pontas para os lados no final do movimento.",
          "Suba controlado sem deixar os cotovelos abrirem para fora.",
        ],
        dica: "A abertura das pontas no final ativa a porção longa — exatamente a região que causa flacidez no braço.",
      },
      {
        nome: "Desenvolvimento com Halteres", volume: "3×12", obs: "Deltóide · Trapézio",
        musculo: "Deltóide medial e anterior (primário) · Trapézio superior · Tríceps",
        passos: [
          "Sentada ou em pé, segure os halteres na altura dos ombros com cotovelos a ~90°, palmas para frente.",
          "Empurre os halteres para cima até os braços ficarem quase estendidos acima da cabeça.",
          "Não eleve os ombros em direção às orelhas.",
          "Desça controlado de volta à altura dos ombros.",
        ],
        dica: "Prefira sentar com encosto para evitar compensação com a lombar quando o peso aumentar.",
      },
      {
        nome: "Puxador Frontal", volume: "3×12", obs: "Dorsal · Equilíbrio push/pull",
        musculo: "Latíssimo do dorso (primário) · Romboides · Bíceps · Infraespinhal",
        passos: [
          "Sentada na máquina com as coxas fixas sob o apoio. Segure a barra com pegada larga, palmas para frente.",
          "Incline o tronco levemente para trás (~15°). Puxe a barra em direção à parte superior do peito.",
          "Pense em 'trazer os cotovelos para baixo e para dentro'. As escápulas devem se retrair e descer.",
          "Suba controlado sem deixar os ombros subirem junto.",
        ],
        dica: "Não se incline demais para trás — isso tira o trabalho do dorsal.",
      },
      {
        nome: "Elevação Lateral", volume: "3×15", obs: "Deltóide medial · Definição de ombro",
        musculo: "Deltóide medial (primário) · Supraspinhal",
        passos: [
          "Em pé, halteres ao lado do corpo com leve flexão nos cotovelos. Palmas voltadas para o corpo.",
          "Eleve os braços lateralmente até a altura dos ombros — não acima.",
          "O mindinho deve ficar levemente mais alto que o polegar no ponto mais alto.",
          "Desça controlado.",
        ],
        dica: "Use peso leve. Com carga errada, o trapézio assume e o deltóide medial sai do exercício.",
      },
    ],
    core: {
      label: "Core A — Abdômen + Oblíquos",
      exercicios: [
        {
          nome: "Elevação de Pernas na Barra", volume: "3×12", obs: "Reto abdominal inferior",
          passos: ["Suspensa na barra, braços estendidos. Mantenha o core contraído.", "Eleve as pernas juntas até 90°.", "Desça lentamente sem balançar o corpo."],
          dica: "Se balançar, reduza a amplitude até ter mais controle.",
        },
        {
          nome: "Crunch com Rotação", volume: "3×12", obs: "Oblíquos · Cintura",
          passos: ["Deitada, joelhos dobrados, mãos atrás da cabeça.", "Suba o tronco e leve o cotovelo direito em direção ao joelho esquerdo. Alterne.", "O movimento vem da rotação do tronco, não da cabeça."],
          dica: "Não puxe o pescoço com as mãos.",
        },
        {
          nome: "Prancha Lateral + Elevação de Quadril", volume: "3×30s", obs: "Cada lado · Oblíquo profundo",
          passos: ["Apoie-se no antebraço e no pé, corpo em linha reta lateral.", "Deixe o quadril cair levemente e então eleve de volta, contraindo o oblíquo.", "Mantenha o pescoço alinhado com a coluna."],
          dica: "A elevação de quadril é o que transforma a prancha estática em exercício dinâmico.",
        },
      ],
    },
  },
  treinoB: {
    label: "Treino B — Inferior · Coxa & Quadril",
    tag: "Anti-flacidez",
    dias: "Seg / Qui",
    foco: "Coxa interna (adutores) + lateral do quadril (glúteo médio). São os dois grupos que mais sustentam a pele e combatem a flacidez na região da coxa.",
    exercicios: [
      {
        nome: "Agachamento Sumo com Halter", volume: "4×12", obs: "Adutores · Glúteo · Quadríceps",
        musculo: "Adutores (primário) · Glúteo máximo · Quadríceps · Isquiotibiais",
        passos: [
          "Pés bem afastados, dedos apontados para fora ~45°. Segure um halter com as duas mãos à frente do corpo.",
          "Desça mantendo o tronco ereto e os joelhos alinhados com a ponta dos pés.",
          "Desça até as coxas ficarem paralelas ao chão ou um pouco abaixo.",
          "Suba empurrando o chão, contraindo glúteo e adutores no topo.",
        ],
        dica: "Quanto mais afastados os pés, mais recrutamento de adutores.",
      },
      {
        nome: "Hip Thrust com Barra", volume: "4×15", obs: "Glúteo máximo — ativação máxima",
        musculo: "Glúteo máximo (primário) · Isquiotibiais · Core",
        passos: [
          "Apoie o ombro no banco. Coloque a barra sobre os quadris. Pés na largura dos ombros.",
          "Desça o quadril em direção ao chão mantendo o core contraído.",
          "Empurre o quadril para cima até o corpo formar uma linha do ombro ao joelho.",
          "Contraia o glúteo com força no ponto mais alto e segure 1 segundo.",
        ],
        dica: "Não hiperextenda a lombar no topo. O movimento vem do glúteo, não das costas.",
      },
      {
        nome: "Cadeira Adutora", volume: "4×15", obs: "Coxa interna — foco principal flacidez",
        musculo: "Adutores — grácil, pectíneo, adutor longo/curto/magno",
        passos: [
          "Sentada na máquina com as costas apoiadas. Nas semanas 1–2: amplitude parcial.",
          "Feche as pernas de forma controlada.",
          "Abra devagar — a fase excêntrica é onde o músculo mais trabalha.",
        ],
        dica: "Semana 5+: adicione pausa de 2s com as pernas fechadas antes de abrir.",
      },
      {
        nome: "Cadeira Abdutora", volume: "4×20", obs: "Glúteo médio · Lateral do quadril",
        musculo: "Glúteo médio (primário) · Glúteo mínimo · Tensor da fáscia lata",
        passos: [
          "Sentada com as costas apoiadas. Almofadas do lado externo das coxas.",
          "Abra as pernas empurrando os apoios para fora, contra a resistência.",
          "Feche controlado sem deixar o peso 'cair' de volta.",
        ],
        dica: "Inclinar levemente o tronco para frente aumenta o recrutamento do glúteo médio.",
      },
      {
        nome: "Leg Press — Pés Juntos", volume: "3×12", obs: "Quadríceps · Adutores",
        musculo: "Quadríceps (primário) · Adutores · Glúteo",
        passos: [
          "Pés próximos no centro da plataforma.",
          "Desça até os joelhos formarem ângulo de ~90°.",
          "Empurre de volta sem travar o joelho no topo.",
        ],
        dica: "Não tire a lombar do encosto ao descer.",
      },
      {
        nome: "Mesa Flexora", volume: "3×15", obs: "Isquiotibiais · Posterior da coxa",
        musculo: "Isquiotibiais — bíceps femoral, semitendíneo, semimembranoso",
        passos: [
          "Deitada de bruços, joelhos alinhados com o eixo da máquina.",
          "Flexione os joelhos puxando o rolo em direção ao glúteo. Expire na subida.",
          "Desça lentamente.",
        ],
        dica: "Não levante o quadril da mesa ao subir.",
      },
      {
        nome: "Abdução no Cabo", volume: "3×15", obs: "Glúteo médio · Isolamento lateral",
        musculo: "Glúteo médio (primário) · Glúteo mínimo",
        passos: [
          "Fixe o cabo no tornozelo. Segure a máquina do lado oposto para equilíbrio.",
          "Eleve a perna lateralmente até ~30–40° do chão.",
          "Mantenha o tronco ereto — não incline para o lado.",
          "Desça controlado sem pousar o pé entre as repetições.",
        ],
        dica: "Amplitude menor com controle vale mais do que amplitude grande com oscilação.",
      },
      {
        nome: "Stiff com Halteres", volume: "3×12", obs: "Isquiotibiais · Glúteo · Lombar",
        musculo: "Isquiotibiais (primário) · Glúteo máximo · Eretores da coluna",
        passos: [
          "Em pé, halteres à frente das coxas, palmas voltadas para o corpo.",
          "Incline o tronco para frente empurrando o quadril para trás.",
          "Desça os halteres até sentir alongamento nos isquiotibiais.",
          "Suba empurrando o quadril para frente, contraindo glúteo no topo.",
        ],
        dica: "A coluna deve permanecer neutra. Costas arredondadas = risco de lombar.",
      },
    ],
    progressao: [
      { sem: "Sem 1–2", desc: "Amplitude parcial, peso leve. Foco na técnica." },
      { sem: "Sem 3–4", desc: "Amplitude total. Aumente o peso 2–5% se não sentir dor." },
      { sem: "Sem 5+", desc: "Adicione pausa de 2s com pernas fechadas em cada rep." },
    ],
    core: {
      label: "Core B — Lombar + Costas",
      exercicios: [
        {
          nome: "Banco Romano — Extensão Lombar", volume: "3×15", obs: "Lombar · Glúteo · Cadeia posterior",
          passos: ["Coxas no apoio, tornozelos fixos. Tronco dobrado para baixo.", "Suba o tronco até ficar alinhado com as pernas — não hiperextenda.", "Desça controlado."],
          dica: "Braços cruzados no peito para iniciante. Atrás da cabeça aumenta a dificuldade.",
        },
        {
          nome: "Superman com Pulso", volume: "3×12", obs: "+2s pausa · Lombar · Trapézio inferior",
          passos: ["Deitada de bruços, braços estendidos à frente.", "Eleve simultaneamente braços e pernas. Segure 2 segundos.", "Desça controlado sem pousar completamente entre as reps."],
          dica: "O 'pulso' é o gesto de puxar os braços levemente para baixo no ponto alto — ativa o trapézio inferior.",
        },
        {
          nome: "Prancha com Alcance Alternado", volume: "3×10", obs: "Cada lado · Core profundo",
          passos: ["Em posição de prancha alta. Core e glúteo contraídos.", "Estenda um braço à frente sem rotacionar o quadril.", "Retorne e alterne os lados."],
          dica: "Quanto menos o quadril oscilar, mais o core profundo está trabalhando.",
        },
      ],
    },
  },
  comandos: [
    { cmd: "/check-treino", desc: "Analisar aderência da semana", color: COLORS.carb, example: "/check-treino — fiz seg, ter, qui. Na sexta não consegui ir.", tip: "Use toda segunda com o resumo da semana anterior." },
    { cmd: "/check-carga", desc: "Verificar progressão de carga vs semanas anteriores", color: COLORS.protein, example: "/check-carga — supino estava em 8kg, subi para 10kg.", tip: "Anote os pesos usados em cada sessão." },
    { cmd: "/ajuste-treino", desc: "Avaliar necessidade de alteração no protocolo", color: COLORS.fat, example: "/ajuste-treino — semana 6, Treino B está levando 90min.", tip: "Use quando sentir estagnação por 3+ semanas." },
    { cmd: "/dor [músculo]", desc: "Orientar sobre dor ou desconforto em região específica", color: COLORS.danger, example: "/dor ombro direito — dói ao fazer desenvolvimento.", tip: "Diferencie tensão muscular (normal) de dor articular (sinal de parar)." },
    { cmd: "/revisao-treino-30", desc: "Análise completa de 30 dias: aderência e progressão", color: COLORS.fat, example: "/revisao-treino-30 [descreva como foram as 4 semanas]", tip: "Primeira revisão programada para 30/04/2026." },
    { cmd: "/semana [descrição]", desc: "Registrar semana de treino para histórico", color: COLORS.muted, example: "/semana semana 2 concluída. Adutora ainda leve.", tip: "Use para registrar semanas atípicas antes da revisão." },
  ],
};

// ─── TREINO SEM ACADEMIA ─────────────────────────────────────────────────────

const TREINO_SEM_ACADEMIA = {
  semana: [
    { dia: "Segunda", tipo: "B", cardio: "Natação 20min / Bicicleta 20min", cor: "#3BBFA0" },
    { dia: "Terça", tipo: "A", cardio: "Caminhada leve 20min", cor: "#E2635A" },
    { dia: "Quarta", tipo: "descanso", cardio: null, cor: null },
    { dia: "Quinta", tipo: "B", cardio: "Natação 20min / Bicicleta 20min", cor: "#3BBFA0" },
    { dia: "Sexta", tipo: "A", cardio: "Caminhada leve 20min", cor: "#E2635A" },
    { dia: "Sáb/Dom", tipo: "descanso", cardio: null, cor: null },
  ],
  treinoA: {
    label: "Treino A — Membros Superiores",
    tag: "Braços",
    dias: "Ter / Sex",
    exercicios: [
      {
        nome: "Flexão de Braço", volume: "4×10", obs: "Peito · Tríceps · Deltóide anterior",
        tipo: "corpo", substitui: "Supino com Halteres",
        musculo: "Peitoral maior (primário) · Tríceps · Deltóide anterior",
        passos: [
          "Mãos no chão, um pouco mais abertas que a largura dos ombros. Corpo em linha reta da cabeça ao calcanhar.",
          "Desça o peito em direção ao chão mantendo os cotovelos a ~45° do corpo — não abrindo totalmente para os lados.",
          "Empurre de volta sem travar os cotovelos no topo. Expire na subida.",
          "Se não conseguir completar as 10 reps em posição completa, apoie os joelhos para reduzir a carga.",
        ],
        dica: "Mãos na largura dos ombros ativa mais o tríceps. Mãos mais abertas ativa mais o peito. Para este protocolo, prefira mais fechada.",
      },
      {
        nome: "Rosca com Banda", volume: "4×12", obs: "Bíceps · Braquial",
        tipo: "banda", substitui: "Rosca Direta",
        musculo: "Bíceps braquial (primário) · Braquial · Braquiorradial",
        passos: [
          "Pise no centro da banda com os dois pés. Segure as alças com pegada supinada (palmas para cima).",
          "Mantenha os cotovelos fixos ao lado do corpo — o mesmo princípio do halter.",
          "Contraia o bíceps e suba até a altura dos ombros. Expire na subida.",
          "Desça lentamente (2–3 segundos). Esse controle na descida é onde o músculo cresce.",
        ],
        dica: "Progrida trocando para bandas mais pesadas quando as repetições finais ficarem fáceis. O mecanismo de progressão é idêntico ao halter.",
      },
      {
        nome: "Tríceps com Banda (âncora de porta)", volume: "4×15", obs: "Porção longa — foco flacidez",
        tipo: "banda", substitui: "Tríceps Pulley (Corda)",
        musculo: "Tríceps braquial — porção longa (primário) · Porção lateral",
        passos: [
          "Prenda a banda no topo da porta (feche a porta com a banda passando pelo batente).",
          "De costas para a porta. Segure as alças com as palmas voltadas uma para a outra, cotovelos dobrados a ~90°.",
          "Incline levemente o tronco para frente. Empurre as alças para baixo estendendo os cotovelos.",
          "No ponto mais baixo, abra levemente as mãos para os lados — mesmo gesto da corda no pulley.",
        ],
        dica: "Este é o exercício que mais se aproxima do pulley de academia. A ativação da porção longa do tríceps é equivalente se a âncora estiver alta o suficiente.",
      },
      {
        nome: "Desenvolvimento com Banda", volume: "3×12", obs: "Deltóide · Trapézio",
        tipo: "banda", substitui: "Desenvolvimento com Halteres",
        musculo: "Deltóide medial e anterior (primário) · Trapézio superior · Tríceps",
        passos: [
          "Pise no centro da banda com os dois pés. Segure as alças na altura dos ombros, cotovelos a ~90°.",
          "Empurre as alças para cima até os braços ficarem quase estendidos acima da cabeça.",
          "Não eleve os ombros em direção às orelhas durante o movimento.",
          "Desça controlado de volta à altura dos ombros.",
        ],
        dica: "Se a resistência for irregular entre os dois lados, ajuste a posição do pé sobre a banda. Pé centralizado garante tensão simétrica.",
      },
      {
        nome: "Remada com Banda (âncora de porta)", volume: "3×12", obs: "Dorsal · Romboides · Equilíbrio push/pull",
        tipo: "banda", substitui: "Puxador Frontal",
        musculo: "Latíssimo do dorso (primário) · Romboides · Bíceps",
        passos: [
          "Prenda a banda na parte alta da porta. Sente-se no chão de frente para a porta.",
          "Segure as alças com os braços estendidos à frente, palmas para baixo.",
          "Puxe as alças em direção ao peito pensando em 'trazer os cotovelos para baixo e para o lado do corpo'.",
          "As escápulas devem se retrair e descer no ponto final. Volte controlado.",
        ],
        dica: "Não é idêntico ao puxador, mas ativa dorsal e romboides de forma eficaz. O que importa é o padrão de movimento: puxada vertical com cotovelos descendo.",
      },
      {
        nome: "Elevação Lateral com Banda", volume: "3×15", obs: "Deltóide medial · Definição de ombro",
        tipo: "banda", substitui: "Elevação Lateral",
        musculo: "Deltóide medial (primário) · Supraspinhal",
        passos: [
          "Pise no centro da banda com os dois pés, afastados na largura dos quadris. Segure as alças com leve flexão nos cotovelos.",
          "Eleve os braços lateralmente até a altura dos ombros — não acima.",
          "A resistência da banda aumenta conforme você sobe — ao contrário do halter. Isso é normal.",
          "Desça controlado.",
        ],
        dica: "Use a banda mais leve disponível. Com banda pesada, o trapézio assume o movimento e o deltóide medial perde o trabalho.",
      },
    ],
    core: {
      label: "Core A — Abdômen + Oblíquos",
      exercicios: [
        {
          nome: "Elevação de Pernas (no chão)", volume: "3×12", obs: "Reto abdominal inferior",
          passos: ["Deitada de costas, mãos sob os glúteos para suporte lombar.", "Eleve as pernas juntas até 90°, mantendo o core contraído.", "Desça lentamente sem encostar os pés no chão entre as reps."],
          dica: "Se sentir compensação na lombar, reduza a amplitude — desça somente até onde o core aguentar.",
        },
        {
          nome: "Crunch com Rotação", volume: "3×12", obs: "Oblíquos · Cintura",
          passos: ["Deitada, joelhos dobrados, mãos atrás da cabeça.", "Suba o tronco e leve o cotovelo direito em direção ao joelho esquerdo. Alterne.", "O movimento vem da rotação do tronco, não da cabeça."],
          dica: "Não puxe o pescoço com as mãos.",
        },
        {
          nome: "Prancha Lateral + Elevação de Quadril", volume: "3×30s", obs: "Cada lado · Oblíquo profundo",
          passos: ["Apoie-se no antebraço e no pé, corpo em linha reta lateral.", "Deixe o quadril cair levemente e então eleve de volta, contraindo o oblíquo.", "Mantenha o pescoço alinhado com a coluna."],
          dica: "Sem mudança em relação ao protocolo de academia.",
        },
      ],
    },
  },
  treinoB: {
    label: "Treino B — Inferior · Coxa & Quadril",
    tag: "Anti-flacidez",
    dias: "Seg / Qui",
    foco: "Coxa interna + lateral do quadril. A adutora de academia não tem substituto direto com banda — compense com maior foco na contração e pausa de 2s desde a semana 1.",
    exercicios: [
      {
        nome: "Agachamento Sumo com Banda", volume: "4×12", obs: "Adutores · Glúteo · Quadríceps",
        tipo: "banda", substitui: "Agachamento Sumo com Halter",
        musculo: "Adutores (primário) · Glúteo máximo · Quadríceps",
        passos: [
          "Pise na banda com os dois pés bem afastados, dedos apontados para fora ~45°. Segure as alças à frente do corpo.",
          "A banda cria tensão desde o início — isso é o que adiciona carga ao movimento.",
          "Desça mantendo o tronco ereto e os joelhos alinhados com a ponta dos pés.",
          "Suba contraindo glúteo e adutores no topo.",
        ],
        dica: "Posicione os pés com distância suficiente para a banda ter tensão desde o início do movimento, não só no topo.",
      },
      {
        nome: "Hip Thrust com Banda", volume: "4×15", obs: "Glúteo máximo",
        tipo: "banda", substitui: "Hip Thrust com Barra",
        musculo: "Glúteo máximo (primário) · Isquiotibiais · Core",
        passos: [
          "Apoie o ombro no sofá ou cadeira resistente. Passe a banda sobre os quadris e ancore as pontas com as mãos ou sob os pés.",
          "Pés na largura dos ombros, joelhos dobrados a ~90°.",
          "Empurre o quadril para cima até o corpo formar uma linha do ombro ao joelho.",
          "A carga é menor que a barra — compense adicionando pausa de 2s no topo desde a semana 1.",
        ],
        dica: "Se a banda escorregar do quadril, dobre um pano ou use uma almofada fina como proteção e base.",
      },
      {
        nome: "Adução Deitada com Banda", volume: "4×15", obs: "Coxa interna — foco principal flacidez",
        tipo: "banda", substitui: "Cadeira Adutora (aproximação limitada)",
        musculo: "Adutores — grácil, pectíneo, adutor longo/curto/magno",
        passos: [
          "Prenda a tornozeira no tornozelo da perna que vai trabalhar. Âncora da banda na parte baixa da porta ou pé de móvel, lateral ao corpo.",
          "Deite de lado com a perna de trabalho embaixo. A banda cria resistência para fechar a perna.",
          "Feche a perna de baixo em direção à de cima contra a resistência da banda.",
          "Pause 2 segundos com a perna fechada. Esse detalhe é essencial para compensar a carga menor.",
        ],
        dica: "Este é o substituto mais limitado do protocolo — a cadeira adutora permite progressão de carga precisa que a banda não replica. Compense com a pausa de 2s em toda rep e foco máximo na contração.",
      },
      {
        nome: "Abdução com Banda Loop", volume: "4×20", obs: "Glúteo médio · Lateral do quadril",
        tipo: "banda", substitui: "Cadeira Abdutora",
        musculo: "Glúteo médio (primário) · Glúteo mínimo · Tensor da fáscia lata",
        passos: [
          "Posicione a banda loop acima dos joelhos.",
          "Sentada numa cadeira com a banda resistindo à abertura, abra as pernas contra a resistência.",
          "Abra até sentir contração lateral no glúteo. Feche controlado.",
          "Alternativa: deitada de costas, joelhos dobrados, abrir os joelhos contra a banda.",
        ],
        dica: "Sentada é o padrão mais próximo da abdutora. A banda loop replica bem este movimento.",
      },
      {
        nome: "Agachamento Búlgaro", volume: "3×10 cada lado", obs: "Quadríceps · Glúteo — sobrecarga unilateral",
        tipo: "corpo", substitui: "Leg Press — Pés Juntos",
        musculo: "Quadríceps (primário) · Glúteo máximo · Isquiotibiais",
        passos: [
          "Coloque o pé traseiro elevado em uma cadeira ou sofá. Pé da frente à frente do corpo.",
          "Desça até a coxa da frente ficar paralela ao chão. O joelho traseiro aponta para baixo.",
          "Empurre pelo calcanhar da frente para subir. O corpo fica levemente inclinado para frente — isso é normal.",
          "Nas primeiras sessões, use amplitude reduzida até ganhar equilíbrio.",
        ],
        dica: "Mais difícil do que parece na primeira vez. Segure levemente em algo para equilíbrio nas primeiras sessões. Quando estabilizar, você pode adicionar a banda pisada sob o pé para carga extra.",
      },
      {
        nome: "Curl de Isquio com Banda (em pé)", volume: "3×15", obs: "Isquiotibiais · Posterior da coxa",
        tipo: "banda", substitui: "Mesa Flexora",
        musculo: "Isquiotibiais — bíceps femoral, semitendíneo, semimembranoso",
        passos: [
          "Prenda a tornozeira no tornozelo e ancore a banda na parte baixa da porta.",
          "Em pé, de frente para a porta. Segure levemente para equilíbrio.",
          "Flexione o joelho puxando o calcanhar em direção ao glúteo contra a resistência da banda.",
          "Desça lentamente (3 segundos) — a fase excêntrica é onde o isquiotibial mais trabalha.",
        ],
        dica: "A amplitude e carga são menores que a mesa flexora. Compense com a fase excêntrica lenta de 3s em cada repetição.",
      },
      {
        nome: "Abdução com Tornozeira + Banda", volume: "3×15", obs: "Glúteo médio · Isolamento lateral",
        tipo: "banda", substitui: "Abdução no Cabo",
        musculo: "Glúteo médio (primário) · Glúteo mínimo",
        passos: [
          "Prenda a tornozeira no tornozelo e ancore a banda na parte baixa da porta. Fique de lado para a porta.",
          "Com leve flexão no joelho de apoio, eleve a perna com a tornozeira lateralmente até ~30–40°.",
          "Mantenha o tronco ereto — não incline para compensar.",
          "Desça controlado sem pousar o pé entre as repetições.",
        ],
        dica: "Este é o substituto mais direto do protocolo — o padrão de movimento é quase idêntico ao cabo de academia.",
      },
      {
        nome: "Stiff com Banda", volume: "3×12", obs: "Isquiotibiais · Glúteo · Lombar",
        tipo: "banda", substitui: "Stiff com Halteres",
        musculo: "Isquiotibiais (primário) · Glúteo máximo · Eretores da coluna",
        passos: [
          "Pise na banda com os dois pés na largura dos quadris. Segure as alças à frente das coxas.",
          "Incline o tronco para frente empurrando o quadril para trás — joelhos ligeiramente flexionados.",
          "Desça as alças próximas às pernas até sentir o alongamento nos isquiotibiais.",
          "Suba empurrando o quadril para frente, contraindo glúteo no topo.",
        ],
        dica: "A banda oferece mais resistência no topo (posição ereta) do que no fundo — inverso do halter. Desça mais devagar para compensar.",
      },
    ],
    core: {
      label: "Core B — Lombar + Costas",
      exercicios: [
        {
          nome: "Superman com Pulso", volume: "3×15", obs: "Lombar · Glúteo · Cadeia posterior",
          passos: ["Deitada de bruços, braços estendidos à frente.", "Eleve simultaneamente braços e pernas. Segure 2 segundos.", "Desça controlado sem pousar completamente entre as reps."],
          dica: "Substitui o Banco Romano (que requer equipamento). O padrão de ativação da cadeia posterior é equivalente.",
        },
        {
          nome: "Superman com Pulso — Variação", volume: "3×12", obs: "+2s pausa · Trapézio inferior",
          passos: ["Mesma posição. No ponto alto, puxe os braços levemente para baixo e para trás — o 'pulso'.", "Segure 2 segundos antes de descer."],
          dica: "O gesto de puxar os braços para baixo no topo ativa o trapézio inferior.",
        },
        {
          nome: "Prancha com Alcance Alternado", volume: "3×10", obs: "Cada lado · Core profundo",
          passos: ["Em posição de prancha alta. Core e glúteo contraídos.", "Estenda um braço à frente sem rotacionar o quadril.", "Retorne e alterne os lados."],
          dica: "Sem mudança em relação ao protocolo de academia.",
        },
      ],
    },
  },
  comandos: [
    { cmd: "/check-treino", desc: "Analisar aderência da semana", color: COLORS.carb, example: "/check-treino — fiz seg, ter, qui. Búlgaro ainda com equilíbrio travado.", tip: "Descreva também como se sentiu com os elásticos." },
    { cmd: "/check-carga", desc: "Verificar progressão de banda vs semanas anteriores", color: COLORS.protein, example: "/check-carga — rosca com banda verde ficou fácil na semana 3.", tip: "Registre qual banda está usando em cada exercício." },
    { cmd: "/ajuste-treino", desc: "Adaptar protocolo se precisar de variação", color: COLORS.fat, example: "/ajuste-treino — não tenho tornozeira, como faço o curl?", tip: "Use quando algum exercício não estiver funcionando com o equipamento disponível." },
    { cmd: "/dor [músculo]", desc: "Orientar sobre dor ou desconforto", color: COLORS.danger, example: "/dor joelho — búlgaro está dando pontada no joelho da frente.", tip: "O Búlgaro é o exercício que mais gera compensações no joelho nas primeiras sessões." },
    { cmd: "/semana [descrição]", desc: "Registrar semana para histórico", color: COLORS.muted, example: "/semana semana maio 1 concluída. Adução deitada ficou difícil de executar.", tip: "Fundamental para retomar a progressão quando voltar à academia em junho." },
  ],
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function MacroBar({ prot, carb, fat }) {
  return (
    <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 2, marginTop: 8 }}>
      <div style={{ width: `${prot}%`, background: COLORS.protein, borderRadius: 3 }} />
      <div style={{ width: `${carb}%`, background: COLORS.carb, borderRadius: 3 }} />
      <div style={{ width: `${fat}%`, background: COLORS.fat, borderRadius: 3 }} />
    </div>
  );
}

function MacroRow({ label, value, unit, pct, color, current, meta }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{label}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{value}{unit}</span>
          {pct && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 6 }}>{pct}%</span>}
        </div>
      </div>
      {current !== undefined && (
        <div style={{ height: 4, background: "var(--color-background-tertiary)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, background: color, width: `${Math.min((current / meta) * 100, 100)}%`, transition: "width 0.6s cubic-bezier(.4,0,.2,1)" }} />
        </div>
      )}
    </div>
  );
}

function DayCard({ type, d, isActive, onClick }) {
  const isTreino = type === "treino";
  return (
    <div onClick={onClick} style={{ flex: 1, background: isActive ? "var(--color-background-primary)" : "var(--color-background-secondary)", border: isActive ? `1.5px solid ${isTreino ? COLORS.carb : "#378ADD"}` : "1.5px solid transparent", borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: isTreino ? COLORS.carb : "#378ADD", display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.05em" }}>{isTreino ? "DIA DE TREINO" : "DIA DE DESCANSO"}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1 }}>
        {d.calorias.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 400, color: "var(--color-text-tertiary)", marginLeft: 4 }}>kcal</span>
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 3 }}>{isTreino ? "4× por semana" : "3× por semana"}</div>
      <MacroBar prot={d.prot_pct} carb={d.carbo_pct} fat={d.fat_pct} />
    </div>
  );
}

// ─── NUTRIÇÃO ────────────────────────────────────────────────────────────────

function NutricaoTab() {
  const [activeDay, setActiveDay] = useState("treino");
  const d = activeDay === "treino" ? data.treino : data.descanso;

  function diasRestantes(dataStr) {
    const [dia, mes, ano] = dataStr.split("/").map(Number);
    const target = new Date(ano, mes - 1, dia);
    const hoje = new Date(2026, 2, 31);
    return Math.max(0, Math.round((target - hoje) / 86400000));
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <DayCard type="treino" d={data.treino} isActive={activeDay === "treino"} onClick={() => setActiveDay("treino")} />
        <DayCard type="descanso" d={data.descanso} isActive={activeDay === "descanso"} onClick={() => setActiveDay("descanso")} />
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 16 }}>MACROS — {activeDay === "treino" ? "DIA DE TREINO" : "DIA DE DESCANSO"}</div>
        <MacroRow label="Proteína" value={d.proteina} unit="g" pct={d.prot_pct} color={COLORS.protein} current={d.proteina} meta={d.proteina} />
        <MacroRow label="Carboidrato" value={d.carbo} unit="g" pct={d.carbo_pct} color={COLORS.carb} current={d.carbo} meta={activeDay === "treino" ? 190 : 100} />
        <MacroRow label="Gordura" value={d.gordura} unit="g" pct={d.fat_pct} color={COLORS.fat} current={d.gordura} meta={activeDay === "treino" ? 54 : 50} />
        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 6, paddingTop: 14, display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Açúcar máx/dia</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)" }}>≤ 40g</div>
            <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 2 }}>você estava em 65g</div>
          </div>
          <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Fibra mín/dia</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)" }}>25g</div>
            <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 2 }}>você estava em 19g</div>
          </div>
          <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Média semanal</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)" }}>1.553</div>
            <div style={{ fontSize: 11, color: COLORS.accent, marginTop: 2 }}>kcal/dia</div>
          </div>
        </div>
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>PROTEÍNA — 4 REFEIÇÕES DE 30G</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {["Refeição 1", "Refeição 2", "Pré-treino", "Pós-treino"].map((r, i) => (
            <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{r}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.protein }}>30</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>g</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderLeft: `2px solid ${COLORS.carb}`, borderRadius: "0 6px 6px 0", padding: "8px 12px", lineHeight: 1.6 }}>
          Nos dias de treino, pré e pós-treino devem acontecer dentro de 2h antes e depois da sessão.
        </div>
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>PRÓXIMAS REVISÕES</div>
        {data.revisoes.map((r, i) => {
          const restantes = diasRestantes(r.data);
          const pct = Math.max(0, Math.min(100, ((90 - restantes) / 90) * 100));
          return (
            <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 8 }}>{r.desc}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{r.data}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 6 }}>{restantes > 0 ? `${restantes}d` : "hoje"}</span>
                </div>
              </div>
              <div style={{ height: 3, background: "var(--color-background-tertiary)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: i === 0 ? COLORS.carb : i === 1 ? "#378ADD" : COLORS.fat, width: `${pct}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMMANDS PANEL ───────────────────────────────────────────────────────────

const COMMANDS = [
  { cmd: "/check-semana", desc: "Analisar nutrição da semana vs metas", color: COLORS.carb, example: "/check-semana [anexe o screenshot do app de nutrição]", tip: "Use toda segunda-feira com o resumo da semana anterior." },
  { cmd: "/check-corpo", desc: "Analisar balança vs baseline 31/03/2026", color: COLORS.protein, example: "/check-corpo [anexe o screenshot da balança OKOK]", tip: "Pese sempre em jejum, pela manhã, antes do treino." },
  { cmd: "/dia-treino", desc: "Exemplo de refeições para dia de treino", color: COLORS.carb, example: "/dia-treino — me mostre uma sugestão de cardápio para hoje", tip: "Pode pedir variações: /dia-treino sem glúten, /dia-treino com o que tenho na geladeira." },
  { cmd: "/dia-descanso", desc: "Exemplo de refeições para dia de descanso", color: "#378ADD", example: "/dia-descanso — preciso de uma sugestão para hoje", tip: "Lembre que carboidrato cai para 100g." },
  { cmd: "/revisao-30", desc: "Análise completa com comparativo de 30 dias", color: COLORS.fat, example: "/revisao-30 [anexe screenshot da balança e do app de nutrição]", tip: "Primeira revisão programada para 30/04/2026. Use nessa data." },
  { cmd: "/duvida [alimento]", desc: "Nutrição e timing ideal de um alimento", color: COLORS.protein, example: "/duvida abacate — posso comer no dia de descanso?", tip: "Funciona com alimentos, refeições prontas ou suplementos." },
  { cmd: "/log-semana [descrição]", desc: "Registrar intercorrências para histórico", color: COLORS.muted, example: "/log-semana comi fora 3x, não bati proteína quarta e quinta", tip: "Use para registrar semanas atípicas antes da revisão mensal." },
];

function GenericCommandsPanel({ commands, title }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "16px", marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>{title}</div>
      {commands.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderBottom: i < commands.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", paddingBottom: 10, marginBottom: 10 }}>
            <div onClick={() => setOpenIndex(isOpen ? null : i)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: item.color, background: "var(--color-background-secondary)", borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>{item.cmd}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.4, flex: 1 }}>{item.desc}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", flexShrink: 0 }}>▾</span>
            </div>
            {isOpen && (
              <div style={{ marginTop: 10, marginLeft: 4 }}>
                <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", marginBottom: 5 }}>EXEMPLO DE USO</div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: item.color, lineHeight: 1.6 }}>{item.example}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "0 2px" }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0, marginTop: 1 }}>→</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>{item.tip}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── COMPOSIÇÃO ───────────────────────────────────────────────────────────────

function ComposicaoTab() {
  const items = [
    { label: "Peso atual", value: data.composicao.peso, sub: "baseline 31/03/2026", color: COLORS.accent },
    { label: "% Gordura", value: data.composicao.gordura, sub: `meta: ${data.composicao.metaGordura}`, color: COLORS.danger },
    { label: "Massa muscular", value: data.composicao.musculo, sub: "Perfect", color: COLORS.protein },
    { label: "V-fat", value: data.composicao.vfat, sub: "Healthy", color: COLORS.carb },
    { label: "Água corporal", value: data.composicao.agua, sub: "limite inferior", color: "#378ADD" },
    { label: "IMC", value: data.composicao.bmi, sub: "Healthy", color: COLORS.carb },
    { label: "Metabolismo basal", value: data.composicao.tmb, sub: "kcal/dia", color: COLORS.fat },
  ];
  return (
    <div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, borderLeft: `2px solid ${COLORS.danger}` }}>
        Meta principal: reduzir gordura de 29,5% para 22–26% preservando massa muscular. O peso é consequência — não é o indicador de acompanhamento.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "14px 16px", gridColumn: i === 6 ? "1 / -1" : "auto" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 3 }}>{item.sub}</div>
          </div>
        ))}
      </div>
      <GenericCommandsPanel commands={COMMANDS} title="COMANDOS DA SKILL — NUTRIÇÃO" />
    </div>
  );
}

// ─── TREINO COMPONENTS ────────────────────────────────────────────────────────

function TipoBadge({ tipo }) {
  if (!tipo) return null;
  const isBanda = tipo === "banda";
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, letterSpacing: "0.04em",
      color: isBanda ? COLORS.carb : COLORS.muted,
      background: isBanda ? `${COLORS.carb}18` : "var(--color-background-tertiary)",
      borderRadius: 4, padding: "2px 5px", flexShrink: 0,
    }}>
      {isBanda ? "ELÁSTICO" : "CORPO"}
    </span>
  );
}

function ExercicioRow({ nome, volume, obs, musculo, passos, dica, tipo, substitui, checked, onCheck, accentColor }) {
  const [openInstrucoes, setOpenInstrucoes] = useState(false);
  const cor = accentColor || COLORS.carb;
  return (
    <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: checked ? `${cor}08` : "transparent", transition: "background 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", padding: "10px 0", gap: 10 }}>
        <div onClick={(e) => { e.stopPropagation(); onCheck(); }} style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1, border: `1.5px solid ${checked ? cor : "var(--color-border-tertiary)"}`, background: checked ? cor : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
          {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: checked ? "var(--color-text-tertiary)" : "var(--color-text-primary)", textDecoration: checked ? "line-through" : "none", transition: "all 0.2s ease" }}>{nome}</span>
            {tipo && <TipoBadge tipo={tipo} />}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{obs}</div>
          {substitui && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2, fontStyle: "italic" }}>substitui: {substitui}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: checked ? "var(--color-text-tertiary)" : COLORS.protein, background: "var(--color-background-secondary)", borderRadius: 6, padding: "3px 7px" }}>{volume}</div>
          {passos && <div onClick={() => setOpenInstrucoes(!openInstrucoes)} style={{ fontSize: 10, color: "var(--color-text-tertiary)", cursor: "pointer", transform: openInstrucoes ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▾</div>}
        </div>
      </div>
      {openInstrucoes && passos && (
        <div style={{ margin: "0 0 12px 28px", background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px", borderLeft: `2px solid ${cor}` }}>
          {musculo && <div style={{ fontSize: 10, color: cor, fontWeight: 500, letterSpacing: "0.05em", marginBottom: 10 }}>{musculo.toUpperCase()}</div>}
          <div style={{ marginBottom: 10 }}>
            {passos.map((passo, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < passos.length - 1 ? 8 : 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: cor, minWidth: 18, height: 18, borderRadius: "50%", background: `${cor}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                <span style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{passo}</span>
              </div>
            ))}
          </div>
          {dica && (
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 8, display: "flex", gap: 6 }}>
              <span style={{ color: cor, flexShrink: 0 }}>→</span>
              <span>{dica}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CoreBlock({ core, accentColor, checked, onCheck }) {
  return (
    <div style={{ marginTop: 16, background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px", borderLeft: `2px solid ${accentColor}` }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: accentColor, letterSpacing: "0.06em", marginBottom: 10 }}>{core.label.toUpperCase()} · 8–10 MIN</div>
      {core.exercicios.map((ex, i) => (
        <ExercicioRow key={i} {...ex} accentColor={accentColor} checked={!!checked[ex.nome]} onCheck={() => onCheck(ex.nome)} />
      ))}
    </div>
  );
}

function TreinoBlock({ treino, accentColor }) {
  const [open, setOpen] = useState(false);
  const allExs = [...(treino.exercicios || []), ...(treino.core?.exercicios || [])];
  const initialChecked = allExs.reduce((acc, ex) => ({ ...acc, [ex.nome]: false }), {});
  const [checked, setChecked] = useState(initialChecked);
  const toggleCheck = (nome) => setChecked(prev => ({ ...prev, [nome]: !prev[nome] }));
  const done = Object.values(checked).filter(Boolean).length;
  const total = allExs.length;

  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{treino.label}</span>
            <span style={{ fontSize: 10, fontWeight: 500, color: accentColor, background: `${accentColor}18`, borderRadius: 4, padding: "2px 6px" }}>{treino.tag}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{treino.dias}</span>
            {open && <span style={{ fontSize: 11, color: done === total ? accentColor : "var(--color-text-tertiary)" }}>· {done}/{total} concluídos</span>}
          </div>
        </div>
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {treino.foco && (
            <div style={{ fontSize: 11, color: accentColor, lineHeight: 1.6, background: `${accentColor}12`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>{treino.foco}</div>
          )}
          {treino.exercicios.map((ex, i) => (
            <ExercicioRow key={i} {...ex} accentColor={accentColor} checked={!!checked[ex.nome]} onCheck={() => toggleCheck(ex.nome)} />
          ))}
          {treino.progressao && (
            <div style={{ marginTop: 14, background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 10 }}>PROTOCOLO DE PROGRESSÃO — ADUTORA</div>
              {treino.progressao.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < treino.progressao.length - 1 ? 8 : 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: accentColor, background: `${accentColor}18`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", flexShrink: 0 }}>{p.sem}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{p.desc}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 11, color: COLORS.danger, display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>⚠</span>
                <span>Se sentir dor (não tensão): pare e consulte um fisioterapeuta.</span>
              </div>
            </div>
          )}
          <CoreBlock core={treino.core} accentColor={accentColor} checked={checked} onCheck={toggleCheck} />
        </div>
      )}
    </div>
  );
}

function SemanaGrid({ semana }) {
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 12 }}>DIVISÃO SEMANAL</div>
      {semana.map((d, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < semana.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.cor || "var(--color-border-tertiary)", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{d.dia}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            {d.tipo === "descanso" ? (
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Descanso{d.dia === "Quarta" ? " ativo" : ""}</span>
            ) : (
              <div>
                <span style={{ fontSize: 11, fontWeight: 500, color: d.cor, background: `${d.cor}18`, borderRadius: 4, padding: "2px 6px", marginRight: 6 }}>Treino {d.tipo}</span>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>+ {d.cardio}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TREINO TAB ───────────────────────────────────────────────────────────────

function TreinoTab() {
  const [modo, setModo] = useState("academia");
  const isAcademia = modo === "academia";
  const treinoData = isAcademia ? TREINO_DATA : TREINO_SEM_ACADEMIA;

  return (
    <div>
      {/* Toggle */}
      <div style={{ display: "flex", gap: 4, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4, marginBottom: 20 }}>
        {[{ id: "academia", label: "Com Academia" }, { id: "semacademia", label: "Sem Academia" }].map(opt => (
          <button key={opt.id} onClick={() => setModo(opt.id)} style={{ flex: 1, padding: "7px 0", border: "none", cursor: "pointer", borderRadius: 7, fontSize: 12, fontWeight: 500, background: modo === opt.id ? "var(--color-background-primary)" : "transparent", color: modo === opt.id ? "var(--color-text-primary)" : "var(--color-text-tertiary)", boxShadow: modo === opt.id ? "0 1px 3px rgba(0,0,0,0.3)" : "none", transition: "all 0.2s ease" }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Aviso modo sem academia */}
      {!isAcademia && (
        <div style={{ background: `${COLORS.carb}12`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.carb}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          <span style={{ color: COLORS.carb, fontWeight: 600 }}>Maio 2026 — protocolo adaptado.</span> Exercícios marcados como <span style={{ color: COLORS.carb, fontWeight: 600 }}>ELÁSTICO</span> usam as bandas de resistência. <span style={{ color: COLORS.muted, fontWeight: 600 }}>CORPO</span> usam apenas peso corporal. Em junho, retome o protocolo Com Academia de onde parou.
        </div>
      )}

      <SemanaGrid semana={treinoData.semana} />
      <TreinoBlock treino={treinoData.treinoA} accentColor="#E2635A" />
      <TreinoBlock treino={treinoData.treinoB} accentColor="#3BBFA0" />

      <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.muted}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
        {isAcademia
          ? "Cardio pós-treino em zona 2 — intensidade leve, conversa possível durante. Cardio intenso após Treino B compromete síntese proteica."
          : "Natação e bicicleta contam como cardio de zona 2. Caminhada leve é suficiente nos dias de Treino A. Evite intensidade alta após Treino B."}
      </div>

      <GenericCommandsPanel commands={treinoData.comandos} title={`COMANDOS DA SKILL — TREINO${!isAcademia ? " (SEM ACADEMIA)" : ""}`} />
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "nutricao", label: "Nutrição" },
  { id: "composicao", label: "Composição" },
  { id: "treino", label: "Treino" },
];

const dark = {
  "--color-background-primary": "#18181C",
  "--color-background-secondary": "#222228",
  "--color-background-tertiary": "#2C2C34",
  "--color-border-tertiary": "#35353F",
  "--color-border-secondary": "#2C2C34",
  "--color-text-primary": "#EFEFEF",
  "--color-text-secondary": "#A0A0AF",
  "--color-text-tertiary": "#55555F",
  "--font-mono": "'Courier New', monospace",
  "--font-sans": "sans-serif",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("nutricao");
  return (
    <div style={{ ...dark, background: "#18181C", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px", fontFamily: "'DM Sans', var(--font-sans), sans-serif" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.08em", marginBottom: 4 }}>PLANO ATIVO DESDE {data.baseline}</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)" }}>Dashboard da Pam</div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 500, background: activeTab === tab.id ? "var(--color-background-primary)" : "transparent", color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-tertiary)", boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.4)" : "none", transition: "all 0.2s ease" }}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "nutricao" && <NutricaoTab />}
        {activeTab === "composicao" && <ComposicaoTab />}
        {activeTab === "treino" && <TreinoTab />}
      </div>
    </div>
  );
}
