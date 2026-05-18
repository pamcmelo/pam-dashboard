import { useState } from "react";

const data = {
  baseline: "31/03/2026",
  revisoes: [
    { label: "1ª revisão", data: "30/04/2026", dias: 30, desc: "Análise de composição + adesão" },
    { label: "2ª revisão", data: "31/05/2026", dias: 60, desc: "Ajuste de metas de macro" },
    { label: "3ª revisão", data: "30/06/2026", dias: 90, desc: "Avaliação de recomposição" },
  ],
  composicao: {
    metaGordura: "22–26%",
    leituras: [
      { data: "31/03/2026", label: "Baseline", peso: "55,66 kg", gordura: "29,5%", smm: "37,5%", vfat: "4,0", agua: "50,7%", bmi: "22,6", tmb: "1.185 kcal" },
      { data: "30/04/2026", label: "Abril",    peso: "55,16 kg", gordura: "29,1%", smm: "37,7%", vfat: "4,0", agua: "50,9%", bmi: "22,4", tmb: "1.180 kcal" },
    ],
  },
  treino:  { calorias: 1725, proteina: 120, carbo: 190, gordura: 54, prot_pct: 28, carbo_pct: 44, fat_pct: 28 },
  descanso:{ calorias: 1325, proteina: 120, carbo: 100, gordura: 50, prot_pct: 36, carbo_pct: 30, fat_pct: 34 },
  limites: { acucar: 40, fibra: 25, mediaAcademia: 1553, mediaSemAcademia: 1611 },
};

const COLORS = {
  protein: "#E8A838", carb: "#3BBFA0", fat: "#8B7FD4",
  accent: "#3BBFA0", danger: "#E2635A", muted: "#9B9B9B",
};

const TUBOS = [
  { cor: "Amarelo",  kg: "4,6kg",  hex: "#E8C84A" },
  { cor: "Azul",     kg: "9,1kg",  hex: "#378ADD" },
  { cor: "Verde",    kg: "13,7kg", hex: "#3BBFA0" },
  { cor: "Preto",    kg: "18,2kg", hex: "#AAAAAA" },
  { cor: "Vermelho", kg: "22,8kg", hex: "#E2635A" },
];

const TREINO_DATA = {
  semana: [
    { dia: "Segunda", tipo: "B", cardio: "Esteira 20min",  cor: "#3BBFA0" },
    { dia: "Terça",   tipo: "A", cardio: "Elíptico 20min", cor: "#E2635A" },
    { dia: "Quarta",  tipo: "descanso", cardio: null, cor: null },
    { dia: "Quinta",  tipo: "B", cardio: "Esteira 20min",  cor: "#3BBFA0" },
    { dia: "Sexta",   tipo: "A", cardio: "Elíptico 20min", cor: "#E2635A" },
    { dia: "Sáb/Dom", tipo: "descanso", cardio: null, cor: null },
  ],
  treinoA: {
    label: "Treino A — Membros Superiores", tag: "Braços", dias: "Ter / Sex",
    exercicios: [
      { nome: "Supino com Halteres", volume: "4×10", obs: "Peito, tríceps, deltóide anterior" },
      { nome: "Rosca Direta", volume: "4×12", obs: "Bíceps" },
      { nome: "Tríceps Pulley (Corda)", volume: "4×15", obs: "Porção longa — foco flacidez" },
      { nome: "Desenvolvimento com Halteres", volume: "3×12", obs: "Deltóide, trapézio" },
      { nome: "Puxador Frontal", volume: "3×12", obs: "Dorsal · Equilíbrio push/pull" },
      { nome: "Elevação Lateral", volume: "3×15", obs: "Deltóide medial" },
    ],
    core: { label: "Core A — Abdômen + Oblíquos", exercicios: [
      { nome: "Elevação de Pernas na Barra", volume: "3×12", obs: "Reto abdominal inferior" },
      { nome: "Crunch com Rotação", volume: "3×12", obs: "Oblíquos · Cintura" },
      { nome: "Prancha Lateral + Elevação de Quadril", volume: "3×30s", obs: "Cada lado · Oblíquo profundo" },
    ]},
  },
  treinoB: {
    label: "Treino B — Inferior · Coxa & Quadril", tag: "Anti-flacidez", dias: "Seg / Qui",
    foco: "Coxa interna (adutores) + lateral do quadril (glúteo médio).",
    exercicios: [
      { nome: "Agachamento Sumo com Halter", volume: "4×12", obs: "Adutores · Glúteo · Quadríceps" },
      { nome: "Hip Thrust com Barra", volume: "4×15", obs: "Glúteo máximo — ativação máxima" },
      { nome: "Cadeira Adutora", volume: "4×15", obs: "Coxa interna — foco principal" },
      { nome: "Cadeira Abdutora", volume: "4×20", obs: "Glúteo médio · Lateral do quadril" },
      { nome: "Leg Press — Pés Juntos", volume: "3×12", obs: "Quadríceps · Adutores" },
      { nome: "Mesa Flexora", volume: "3×15", obs: "Isquiotibiais · Posterior da coxa" },
      { nome: "Abdução no Cabo", volume: "3×15", obs: "Glúteo médio · Isolamento lateral" },
      { nome: "Stiff com Halteres", volume: "3×12", obs: "Isquiotibiais · Glúteo · Lombar" },
    ],
    progressao: [
      { sem: "Sem 1–2", desc: "Amplitude parcial, peso leve. Foco na técnica." },
      { sem: "Sem 3–4", desc: "Amplitude total. +2–5% de carga se sem dor." },
      { sem: "Sem 5+",  desc: "Pausa de 2s com pernas fechadas em cada rep." },
    ],
    core: { label: "Core B — Lombar + Costas", exercicios: [
      { nome: "Banco Romano — Extensão Lombar", volume: "3×15", obs: "Lombar · Glúteo" },
      { nome: "Superman com Pulso", volume: "3×12", obs: "+2s pausa · Lombar · Trapézio inferior" },
      { nome: "Prancha com Alcance Alternado", volume: "3×10", obs: "Cada lado · Core profundo" },
    ]},
  },
  comandos: [
    { cmd: "/check-treino", desc: "Analisar aderência ao protocolo da semana: dias cumpridos, exercícios executados, falhas relatadas", color: COLORS.carb, example: "/check-treino — fiz seg, ter, qui. Sexta não consegui.", tip: "Use toda segunda com o resumo da semana anterior." },
    { cmd: "/check-carga", desc: "Verificar progressão de carga nos exercícios principais vs semanas anteriores", color: COLORS.protein, example: "/check-carga — supino foi de 8kg para 10kg.", tip: "Anote os pesos em cada sessão." },
    { cmd: "/ajuste-treino", desc: "Avaliar necessidade de alteração no protocolo com base nos dados atuais", color: COLORS.fat, example: "/ajuste-treino — Treino B está levando 90min.", tip: "Use quando sentir estagnação por 3+ semanas." },
    { cmd: "/dor [músculo]", desc: "Orientar sobre dor ou desconforto", color: COLORS.danger, example: "/dor ombro direito — dói ao fazer desenvolvimento.", tip: "Diferencie tensão muscular (normal) de dor articular (parar)." },
    { cmd: "/revisao-treino-30", desc: "Análise completa de 30 dias", color: COLORS.fat, example: "/revisao-treino-30 [descreva as 4 semanas]", tip: "Primeira revisão: 30/04/2026." },
    { cmd: "/semana [descrição]", desc: "Registrar semana para histórico", color: COLORS.muted, example: "/semana sem 2 concluída. Adutora ainda leve.", tip: "Use para semanas atípicas antes da revisão." },
  ],
};

const TREINO_SEM_ACADEMIA = {
  semana: [
    { dia: "Segunda",    tipo: "B",        cardio: null,                    cor: "#3BBFA0" },
    { dia: "Terça",      tipo: "A",        cardio: "Cardio pós · 15–20min", cor: "#E2635A" },
    { dia: "Quarta",     tipo: "descanso", cardio: null,                    cor: null },
    { dia: "Quinta",     tipo: "B",        cardio: null,                    cor: "#3BBFA0" },
    { dia: "Sexta",      tipo: "A",        cardio: "Cardio pós · 15–20min", cor: "#E2635A" },
    { dia: "Sáb ou Dom", tipo: "natacao",  cardio: "Natação Peito",         cor: "#378ADD" },
    { dia: "O outro dia",tipo: "descanso", cardio: null,                    cor: null },
  ],
  natacaoProgressao: [
    { sem: "Sem 1–2",  vol: "10×30 ciclos · descanso 45–60s" },
    { sem: "Sem 3–4",  vol: "10×35 ciclos · descanso 45–60s" },
    { sem: "Sem 5–6",  vol: "8×40 ciclos · descanso 60s" },
    { sem: "Sem 7–8",  vol: "6×100 ciclos · descanso 60s" },
    { sem: "Sem 9–10", vol: "7×100 ciclos · descanso 60s" },
    { sem: "Sem 11–12",vol: "8×100 ciclos · descanso 60s" },
  ],
  progressaoRegra: "2 sessões consecutivas no topo do intervalo com boa técnica → avança para o próximo tubo. Se não completar o mínimo com o próximo → mantém o atual e adiciona 1 série.",
  treinoA: {
    label: "Treino A — Superior · Elásticos", tag: "Braços", dias: "Ter / Sex",
    foco: "Tempo 3-1-2 em todos os exercícios. Âncora de porta para exercícios indicados. Cardio pós-treino: corda ou crawl · 15–20min · zona 2.",
    exercicios: [
      { nome: "Flexão", volume: "4×10–12", obs: "Peito · Tríceps · Deltóide anterior", tipo: "corpo",
        substitui: "Supino com Halteres",
        musculo: "Peitoral maior (primário) · Tríceps · Deltóide anterior",
        passos: ["Mãos na largura dos ombros, corpo em linha reta. Cotovelos a ~45° do corpo.", "Desça controlado até o peito quase tocar o chão. Tempo 3-1-2.", "Suba sem travar o cotovelo.", "Com mochila para progredir: adicione peso gradualmente."],
        dica: "Se ficar fácil demais, coloque a mochila com peso. Mesma lógica de progressão do supino." },
      { nome: "Rosca Direta", volume: "4×12", obs: "Bíceps · Braquial",
        ancora: "Pisar no meio", tuboAtual: "Vermelho · 22,8kg", tuboNext: null,
        substitui: "Rosca Direta",
        musculo: "Bíceps braquial (primário) · Braquial",
        passos: ["Pise no centro. Pegada supinada.", "Cotovelos fixos ao lado. Tempo 3-1-2.", "Desça totalmente — o alongamento completo é onde o músculo cresce."],
        dica: "Cotovelo parado. Se avança, o ombro assumiu." },
      { nome: "Extensão Overhead", volume: "3×15", obs: "Tríceps porção longa — foco flacidez",
        ancora: "Pisar no meio", tuboAtual: "Azul · 9,1kg", tuboNext: "Verde · 13,7kg",
        substitui: "Tríceps Pulley (Corda)",
        musculo: "Tríceps braquial — porção longa (primário)",
        passos: ["Pise no centro do elástico. De costas, alças atrás da cabeça com cotovelos para cima.", "Estenda os braços até quase travar. Tempo 3-1-2.", "Não encurte a amplitude — o alongamento máximo é o que diferencia este exercício."],
        dica: "Único exercício que alonga completamente a porção longa. Essencial contra flacidez do braço." },
      { nome: "Desenvolvimento", volume: "3×12", obs: "Deltóide · Trapézio",
        ancora: "Pisar no meio", tuboAtual: "Verde · 13,7kg", tuboNext: "Preto · 18,2kg",
        substitui: "Desenvolvimento com Halteres",
        musculo: "Deltóide medial e anterior (primário) · Trapézio superior",
        passos: ["Pise no centro. Alças na altura dos ombros, cotovelos a ~90°.", "Empurre para cima sem elevar os ombros. Tempo 3-1-2."],
        dica: "Pé centralizado garante tensão simétrica." },
      { nome: "Remada", volume: "3×12", obs: "Dorsal · Romboides",
        ancora: "Porta média", tuboAtual: "Vermelho · 22,8kg", tuboNext: null,
        substitui: "Puxador Frontal",
        musculo: "Latíssimo do dorso (primário) · Romboides · Bíceps",
        passos: ["Âncora média. Sente-se no chão de frente, braços estendidos.", "Puxe com cotovelos para o lado do corpo. Tempo 3-1-2."],
        dica: "Escápulas se retraem e descem no ponto final." },
      { nome: "Elevação Lateral", volume: "3×15", obs: "Deltóide medial · Definição de ombro",
        ancora: "Pisar no meio", tuboAtual: "Azul · 9,1kg", tuboNext: "Verde · 13,7kg",
        substitui: "Elevação Lateral",
        musculo: "Deltóide medial (primário)",
        passos: ["Pise no centro. Eleve lateralmente até a altura dos ombros.", "Mindinho levemente mais alto. Tempo 3-1-2."],
        dica: "Use a banda mais leve. Com carga excessiva, o trapézio assume." },
      { nome: "Face Pull", volume: "3×15", obs: "Deltóide posterior · Manguito rotador",
        ancora: "Porta alta", tuboAtual: "Verde · 13,7kg", tuboNext: "Preto · 18,2kg",
        substitui: "Novo",
        musculo: "Deltóide posterior (primário) · Manguito rotador",
        passos: ["Âncora na altura do rosto. Puxe em direção ao rosto, cotovelos para fora e acima.", "No ponto final, abra as mãos para os lados. Pausa 1s."],
        dica: "Preventivo — protege o ombro do volume acumulado." },
    ],
    core: { label: "Core A — Abdômen + Oblíquos", exercicios: [
      { nome: "Elevação de Pernas (no chão)", volume: "3×12", obs: "Reto abdominal inferior", passos: ["Deitada, mãos sob os glúteos.", "Eleve as pernas até 90° sem encostar entre as reps."], dica: "Se compensar na lombar, reduza a amplitude." },
      { nome: "Crunch com Rotação", volume: "3×12", obs: "Oblíquos · Cintura", passos: ["Joelhos dobrados, mãos atrás da cabeça.", "Cotovelo ao joelho oposto. Alterne."], dica: "Não puxe o pescoço." },
      { nome: "Prancha Lateral + Elevação de Quadril", volume: "3×30s", obs: "Cada lado", passos: ["Antebraco e pé. Quadril cai e sobe contraindo o oblíquo."], dica: "A elevação transforma a prancha estática em dinâmica." },
    ]},
  },
  treinoB: {
    label: "Treino B — Inferior · Elásticos + Corpo", tag: "Anti-flacidez", dias: "Seg / Qui",
    foco: "Tempo 3-1-2. Mochila carregada progride semana a semana — registre o peso. Sem cardio pós-treino neste dia.",
    exercicios: [
      { nome: "Agachamento Sumo", volume: "3×12", obs: "Adutores · Glúteo · Quadríceps",
        ancora: "Pisar no meio", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Agachamento Sumo com Halter",
        musculo: "Adutores (primário) · Glúteo máximo · Quadríceps",
        passos: ["Pés bem afastados, dedos a ~45°. Pise na banda.", "Desça com tronco ereto. Tempo 3-1-2."],
        dica: "Quanto mais afastados os pés, mais recrutamento de adutores." },
      { nome: "Agachamento Búlgaro", volume: "3×10 cada perna", obs: "Quadríceps · Glúteo — unilateral",
        ancora: "Pisar no meio", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Leg Press — Pés Juntos",
        musculo: "Quadríceps (primário) · Glúteo máximo",
        passos: ["Pé traseiro elevado em cadeira. Pise na banda com o pé da frente.", "Desça até coxa paralela. Tempo 3-1-2."],
        dica: "Segure levemente algo para equilíbrio nas primeiras sessões." },
      { nome: "Hip Thrust", volume: "4×15", obs: "Glúteo máximo — ativação máxima",
        ancora: "Pisar no meio", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Hip Thrust com Barra",
        musculo: "Glúteo máximo (primário) · Isquiotibiais",
        passos: ["Ombro no sofá. Banda sobre os quadris, ancorada sob os pés.", "Quadril sobe formando linha ombro–joelho. Pausa 2s no topo.", "Desça em 3s — excêntrico lento compensa carga menor vs barra."],
        dica: "Se a banda escorregar, use um pano dobrado no quadril." },
      { nome: "Adução Deitada", volume: "4×15", obs: "Coxa interna — foco principal",
        ancora: "Porta baixa", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Cadeira Adutora",
        musculo: "Adutores — grácil, pectíneo, adutor longo/curto/magno",
        passos: ["Tornozeira no tornozelo, banda na porta baixa. Deite de lado.", "Feche a perna de baixo contra a resistência.", "Pausa de 2s com a perna fechada — obrigatório desde a sem 1."],
        dica: "A pausa de 2s compensa a carga menor vs cadeira adutora." },
      { nome: "Abdução Lateral Deitada", volume: "4×20", obs: "Glúteo médio · Lateral do quadril",
        ancora: "Elástico nos tornozelos", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Cadeira Abdutora",
        musculo: "Glúteo médio (primário) · Glúteo mínimo",
        passos: ["Elástico em volta dos tornozelos. Deite de lado, corpo em linha reta.", "Eleve a perna de cima lateralmente. Tempo 3-1-2.", "Desça controlado — não deixe bater."],
        dica: "Não incline o quadril para trás ao elevar. O movimento é lateral puro." },
      { nome: "Abdução em Pé", volume: "3×15", obs: "Glúteo médio · Isolamento lateral",
        ancora: "Porta baixa", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Abdução no Cabo",
        musculo: "Glúteo médio (primário) · Glúteo mínimo",
        passos: ["Âncora baixa no tornozelo. De lado para a porta.", "Eleve a perna lateralmente até ~30–40°. Tronco ereto. Tempo 3-1-2.", "Desça controlado sem pousar entre as reps."],
        dica: "Amplitude menor com controle vale mais que grande com oscilação do tronco." },
      { nome: "Hamstring Curl", volume: "3×15", obs: "Isquiotibiais · Posterior da coxa",
        ancora: "Porta baixa", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Mesa Flexora",
        musculo: "Isquiotibiais — bíceps femoral, semitendíneo, semimembranoso",
        passos: ["Tornozeira no tornozelo, banda na porta baixa. Em pé de frente.", "Flexione o joelho puxando o calcanhar em direção ao glúteo. Tempo 3-1-2."],
        dica: "A descida lenta de 3s é onde o isquiotibial mais trabalha." },
      { nome: "Stiff", volume: "3×12", obs: "Isquiotibiais · Glúteo · Lombar",
        ancora: "Pisar no meio", tuboAtual: "Preto · 18,2kg", tuboNext: "Vermelho · 22,8kg",
        substitui: "Stiff com Halteres",
        musculo: "Isquiotibiais (primário) · Glúteo máximo · Eretores",
        passos: ["Pise na banda. Incline o tronco empurrando o quadril para trás.", "Desça até sentir o alongamento. Tempo 3-1-2."],
        dica: "Coluna neutra. Costas arredondadas = risco de lombar." },
    ],
    core: { label: "Core B — Lombar + Costas", exercicios: [
      { nome: "Superman com Pulso", volume: "3×15", obs: "Lombar · Cadeia posterior", passos: ["De bruços, braços estendidos. Eleve braços e pernas.", "Segure 2s. Desça sem pousar entre as reps."], dica: "Substitui o Banco Romano. No topo, puxar os braços levemente para baixo ativa o trapézio inferior." },
      { nome: "Superman — Variação Pulso", volume: "3×12", obs: "+2s pausa · Trapézio inferior", passos: ["Mesma posição. No ponto alto, puxe os braços levemente para trás. Segure 2s."], dica: "O 'pulso' é o diferencial que ativa o trapézio inferior." },
      { nome: "Prancha com Alcance Alternado", volume: "3×10", obs: "Cada lado · Core profundo", passos: ["Prancha alta. Estenda um braço sem rotacionar o quadril. Alterne."], dica: "Quanto menos o quadril oscilar, mais o core profundo trabalha." },
    ]},
  },
  comandos: [
    { cmd: "/check-treino", desc: "Analisar aderência + tubos usados na semana", color: COLORS.carb, example: "/check-treino — fiz seg, ter, qui, sex. Rosca subiu para o vermelho.", tip: "Inclua qual tubo usou em cada exercício." },
    { cmd: "/check-carga", desc: "Verificar progressão de tubo vs semanas anteriores", color: COLORS.protein, example: "/check-carga — hip thrust no preto, tentei o vermelho, não completei.", tip: "Se não completar o mínimo com o próximo tubo, volta ao atual e adiciona 1 série." },
    { cmd: "/ajuste-treino", desc: "Adaptar exercício se tiver dificuldade", color: COLORS.fat, example: "/ajuste-treino — não tenho tornozeira, como faço a adução?", tip: "Sempre há adaptação possível." },
    { cmd: "/dor [músculo]", desc: "Orientar sobre dor ou desconforto", color: COLORS.danger, example: "/dor ombro — dói na remada, não no pushdown.", tip: "DOMS é normal. Dor articular ou pontada = parar." },
    { cmd: "/semana [descrição]", desc: "Registrar semana para histórico", color: COLORS.muted, example: "/semana sem 7. Avancei todos os tubos no B. Natação 6×100.", tip: "Fundamental para rastrear progressão semana a semana." },
  ],
};

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

function DayCard({ type, d, isActive, onClick, freqText }) {
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
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 3 }}>{freqText}</div>
      <MacroBar prot={d.prot_pct} carb={d.carbo_pct} fat={d.fat_pct} />
    </div>
  );
}

function NutricaoTab({ mode }) {
  const [activeDay, setActiveDay] = useState("treino");
  const d = activeDay === "treino" ? data.treino : data.descanso;
  const isSemAcademia = mode === "semacademia";
  const media = isSemAcademia ? data.limites.mediaSemAcademia : data.limites.mediaAcademia;
  const treinoFreq  = isSemAcademia ? "5× treino + 1× natação" : "4× por semana";
  const descansoFreq = isSemAcademia ? "1× por semana" : "3× por semana";
  function diasRestantes(dataStr) {
    const [dia, mes, ano] = dataStr.split("/").map(Number);
    const target = new Date(ano, mes - 1, dia);
    const hoje = new Date(2026, 2, 31);
    return Math.max(0, Math.round((target - hoje) / 86400000));
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <DayCard type="treino" d={data.treino} isActive={activeDay === "treino"} onClick={() => setActiveDay("treino")} freqText={treinoFreq} />
        <DayCard type="descanso" d={data.descanso} isActive={activeDay === "descanso"} onClick={() => setActiveDay("descanso")} freqText={descansoFreq} />
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
            <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 2 }}>prioridade ativa</div>
          </div>
          <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Fibra mín/dia</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)" }}>25g</div>
            <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 2 }}>prioridade ativa</div>
          </div>
          <div style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>Média semanal</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)" }}>{media.toLocaleString()}</div>
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
          {isSemAcademia ? "Nos dias com natação: tome o Whey antes de entrar na água. Pós-treino de força conta como pré-natação." : "Nos dias de treino, pré e pós-treino devem acontecer dentro de 2h antes e depois da sessão."}
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

const COMMANDS_NUTRICAO = [
  { cmd: "/check-semana", desc: "Analisar nutrição da semana vs metas", color: COLORS.carb, example: "/check-semana [anexe o screenshot do app]", tip: "Use toda segunda-feira com o resumo da semana anterior." },
  { cmd: "/check-corpo", desc: "Analisar balança vs baseline 31/03/2026", color: COLORS.protein, example: "/check-corpo [anexe o screenshot da balança OKOK]", tip: "Pese sempre em jejum, pela manhã, antes do treino." },
  { cmd: "/dia-treino", desc: "Exemplo de refeições para dia de treino", color: COLORS.carb, example: "/dia-treino — me mostre uma sugestão de cardápio para hoje", tip: "Pode pedir variações: /dia-treino sem glútem." },
  { cmd: "/dia-descanso", desc: "Exemplo de refeições para dia de descanso", color: "#378ADD", example: "/dia-descanso — preciso de uma sugestão para hoje", tip: "Carboidrato cai para 100g." },
  { cmd: "/revisao-30", desc: "Análise completa com comparativo de 30 dias", color: COLORS.fat, example: "/revisao-30 [anexe screenshot da balança e do app]", tip: "Primeira revisão: 30/04/2026." },
  { cmd: "/duvida [alimento]", desc: "Nutrição e timing ideal de um alimento", color: COLORS.protein, example: "/duvida abacate — posso comer no dia de descanso?", tip: "Funciona com alimentos, refeições prontas ou suplementos." },
  { cmd: "/log-semana [desc]", desc: "Registrar intercôrrências para histórico", color: COLORS.muted, example: "/log-semana comi fora 3x, não bati proteína quarta e quinta", tip: "Use para semanas atípicas antes da revisão mensal." },
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

function ComposicaoTab() {
  const { metaGordura, leituras } = data.composicao;
  const baseline = leituras[0];
  const latest = leituras[leituras.length - 1];
  const isMulti = leituras.length > 1;

  const metricas = [
    { key: "gordura", label: "Gordura",      color: COLORS.danger,  better: "less", goal: metaGordura },
    { key: "smm",     label: "Músculo SMM%", color: COLORS.protein, better: "more" },
    { key: "vfat",    label: "V-fat",        color: COLORS.carb,    better: "less" },
    { key: "agua",    label: "Água",         color: "#378ADD",      better: "more" },
    { key: "peso",    label: "Peso",         color: COLORS.accent,  better: "neutral" },
    { key: "bmi",     label: "IMC",          color: COLORS.carb,    better: "neutral" },
    { key: "tmb",     label: "TMB",          color: COLORS.fat,     better: "neutral" },
  ];

  function parseNum(str) {
    return parseFloat(str.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, ""));
  }

  function getDelta(key) {
    return parseNum(latest[key]) - parseNum(baseline[key]);
  }

  function getDeltaColor(diff, better) {
    if (better === "neutral") return "var(--color-text-tertiary)";
    if (better === "less")    return diff < 0 ? COLORS.carb : diff > 0 ? COLORS.danger : "var(--color-text-tertiary)";
    if (better === "more")    return diff > 0 ? COLORS.carb : diff < 0 ? COLORS.danger : "var(--color-text-tertiary)";
  }

  function formatDelta(key, diff) {
    const sign = diff > 0 ? "+" : "";
    if (key === "peso") return `${sign}${diff.toFixed(2).replace(".", ",")} kg`;
    if (key === "tmb")  return `${sign}${Math.round(diff)} kcal`;
    if (["gordura","smm","agua"].includes(key)) return `${sign}${diff.toFixed(1).replace(".", ",")}pp`;
    return `${sign}${diff.toFixed(1).replace(".", ",")}`;
  }

  return (
    <div>
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, borderLeft: `2px solid ${COLORS.danger}` }}>
        Meta principal: reduzir gordura de {baseline.gordura} para {metaGordura} preservando massa muscular. O peso é consequência — não é o indicador de acompanhamento.
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: isMulti ? "1.3fr 0.8fr 0.8fr 0.5fr" : "1.3fr 0.8fr", padding: "10px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500, letterSpacing: "0.05em" }}>MÉTRICA</div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500, textAlign: "right" }}>
            BASELINE<br /><span style={{ fontSize: 9, fontWeight: 400 }}>{baseline.data}</span>
          </div>
          {isMulti && (
            <div style={{ fontSize: 10, color: COLORS.carb, fontWeight: 500, textAlign: "right" }}>
              {latest.label.toUpperCase()}<br /><span style={{ fontSize: 9, fontWeight: 400, color: "var(--color-text-tertiary)" }}>{latest.data}</span>
            </div>
          )}
          {isMulti && (
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500, textAlign: "right", letterSpacing: "0.05em" }}>Δ</div>
          )}
        </div>

        {/* Rows */}
        {metricas.map((m, i) => {
          const diff = isMulti ? getDelta(m.key) : null;
          const deltaColor = isMulti ? getDeltaColor(diff, m.better) : null;
          const deltaStr = isMulti ? formatDelta(m.key, diff) : null;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: isMulti ? "1.3fr 0.8fr 0.8fr 0.5fr" : "1.3fr 0.8fr", padding: "12px 16px", borderBottom: i < metricas.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{m.label}</span>
                {m.goal && <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)", borderRadius: 3, padding: "1px 4px" }}>meta: {m.goal}</span>}
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 13, fontWeight: 400, color: "var(--color-text-tertiary)" }}>{baseline[m.key]}</span>
              </div>
              {isMulti && (
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{latest[m.key]}</span>
                </div>
              )}
              {isMulti && (
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: deltaColor }}>{diff === 0 ? "—" : deltaStr}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GenericCommandsPanel commands={COMMANDS_NUTRICAO} title="COMANDOS DA SKILL — NUTRIÇÃO" />
    </div>
  );
}

function TipoBadge({ tipo }) {
  if (!tipo) return null;
  const isBanda = tipo === "banda";
  return <span style={{ fontSize: 9, fontWeight: 600, color: isBanda ? COLORS.carb : COLORS.muted, background: isBanda ? `${COLORS.carb}18` : "var(--color-background-tertiary)", borderRadius: 4, padding: "2px 5px", flexShrink: 0 }}>{isBanda ? "ELÁSTICO" : "CORPO"}</span>;
}

function TuboInfo({ ancora, tuboAtual, tuboNext }) {
  if (!tuboAtual) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
      {ancora && <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", background: "var(--color-background-tertiary)", borderRadius: 3, padding: "1px 5px" }}>{ancora}</span>}
      <span style={{ fontSize: 9, fontWeight: 600, color: COLORS.accent, background: `${COLORS.accent}18`, borderRadius: 3, padding: "1px 5px" }}>Atual: {tuboAtual}</span>
      {tuboNext && <span style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>→ {tuboNext}</span>}
    </div>
  );
}

function ExercicioRow({ nome, volume, obs, musculo, passos, dica, tipo, substitui, ancora, tuboAtual, tuboNext, checked, onCheck, accentColor }) {
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
          {(tuboAtual || ancora) && <TuboInfo ancora={ancora} tuboAtual={tuboAtual} tuboNext={tuboNext} />}
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
          {dica && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 8, display: "flex", gap: 6 }}><span style={{ color: cor, flexShrink: 0 }}>→</span><span>{dica}</span></div>}
        </div>
      )}
    </div>
  );
}

function CoreBlock({ core, accentColor, checked, onCheck }) {
  return (
    <div style={{ marginTop: 16, background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px", borderLeft: `2px solid ${accentColor}` }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: accentColor, letterSpacing: "0.06em", marginBottom: 10 }}>{core.label.toUpperCase()} · 8–10 MIN</div>
      {core.exercicios.map((ex, i) => <ExercicioRow key={i} {...ex} accentColor={accentColor} checked={!!checked[ex.nome]} onCheck={() => onCheck(ex.nome)} />)}
    </div>
  );
}

function TreinoBlock({ treino, accentColor }) {
  const [open, setOpen] = useState(false);
  const allExs = [...(treino.exercicios || []), ...(treino.core?.exercicios || [])];
  const [checked, setChecked] = useState(allExs.reduce((acc, ex) => ({ ...acc, [ex.nome]: false }), {}));
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
          {treino.foco && <div style={{ fontSize: 11, color: accentColor, lineHeight: 1.6, background: `${accentColor}12`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>{treino.foco}</div>}
          {treino.exercicios.map((ex, i) => <ExercicioRow key={i} {...ex} accentColor={accentColor} checked={!!checked[ex.nome]} onCheck={() => toggleCheck(ex.nome)} />)}
          {treino.progressao && (
            <div style={{ marginTop: 14, background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 10 }}>PROTOCOLO DE PROGRESSÃO — ADUTORA</div>
              {treino.progressao.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < treino.progressao.length - 1 ? 8 : 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: accentColor, background: `${accentColor}18`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", flexShrink: 0 }}>{p.sem}</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{p.desc}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 11, color: COLORS.danger, display: "flex", gap: 6 }}><span>⚠</span><span>Se sentir dor (não tensão): pare e consulte um fisioterapeuta.</span></div>
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
            {d.tipo === "descanso" ? <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Descanso</span>
            : d.tipo === "natacao" ? <span style={{ fontSize: 11, fontWeight: 500, color: d.cor, background: `${d.cor}18`, borderRadius: 4, padding: "2px 6px" }}>{d.cardio}</span>
            : <div><span style={{ fontSize: 11, fontWeight: 500, color: d.cor, background: `${d.cor}18`, borderRadius: 4, padding: "2px 6px", marginRight: 6 }}>Treino {d.tipo}</span>{d.cardio && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>+ {d.cardio}</span>}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TuboLegenda() {
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 12 }}>TUBOS DISPONÍVEIS — CADEIA DE PROGRESSÃO</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {TUBOS.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--color-background-secondary)", borderRadius: 8, padding: "8px 10px", minWidth: 52 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: t.hex, display: "block", marginBottom: 4, border: t.cor === "Preto" ? "1px solid var(--color-border-tertiary)" : "none" }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: t.hex }}>{t.cor}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{t.kg}</span>
            </div>
            {i < TUBOS.length - 1 && <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6, background: "var(--color-background-secondary)", borderRadius: 8, padding: "8px 12px" }}>{TREINO_SEM_ACADEMIA.progressaoRegra}</div>
    </div>
  );
}

function CardioPostTreinoABlock() {
  const opcoes = [
    { nome: "Pular Corda", series: "5 séries", reps: "200 pulos", pausa: "30s entre séries", total: "~15 min", progressao: "5 × 250 pulos", obs: "Ritmo ~90 pulos/min. Pernas descansadas pós-treino A." },
    { nome: "Crawl", series: "6 séries", reps: "50 ciclos", pausa: "30s entre séries", total: "~15–18 min", progressao: "6 × 60 ciclos", obs: "Ritmo moderado contínuo. Monitorar ombro — treino A já tem volume em deltóide e tríceps." },
  ];
  return (
    <div style={{ background: "#378ADD10", border: "0.5px solid #378ADD30", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "#378ADD", letterSpacing: "0.06em", marginBottom: 4 }}>CARDIO PÓS-TREINO A — TER / SEX</div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 12 }}>15–20 min · Zona 2 · Escolha uma opção por sessão</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {opcoes.map((op, i) => (
          <div key={i} style={{ flex: 1, background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 8 }}>{op.nome}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#378ADD", background: "#378ADD18", borderRadius: 4, padding: "2px 7px" }}>{op.series}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.protein, background: `${COLORS.protein}18`, borderRadius: 4, padding: "2px 7px" }}>{op.reps}</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Pausa: {op.pausa} · {op.total}</div>
            <div style={{ fontSize: 10, color: COLORS.carb, marginBottom: 6 }}>Próximo: {op.progressao}</div>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>{op.obs}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6 }}><span style={{ color: "#378ADD" }}>Zona 2:</span> consegue falar frases curtas durante. Quando 2 sessões seguidas ficarem fáceis → sobe o número.</div>
    </div>
  );
}

function NatacaoProgressaoBlock() {
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 12 }}>NATAÇÃO PEITO — PROGRESSÃO 12 SEMANAS</div>
      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>Sáb ou Dom · Foco no chute: fechar as pernas com força sentindo a contração na coxa interna. Descanso controlado 45–60s entre séries.</div>
      {TREINO_SEM_ACADEMIA.natacaoProgressao.map((n, i) => {
        const isCurrent = i === 3;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < TREINO_SEM_ACADEMIA.natacaoProgressao.length - 1 ? 8 : 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: isCurrent ? COLORS.carb : "#378ADD", background: isCurrent ? `${COLORS.carb}20` : "#378ADD18", borderRadius: 4, padding: "2px 8px", whiteSpace: "nowrap", minWidth: 62, textAlign: "center" }}>{n.sem}</span>
            <span style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{n.vol}</span>
            {isCurrent && <span style={{ fontSize: 9, color: COLORS.carb, fontWeight: 600, background: `${COLORS.carb}15`, borderRadius: 3, padding: "1px 5px", flexShrink: 0 }}>atual</span>}
          </div>
        );
      })}
    </div>
  );
}

function TreinoTab({ mode }) {
  const isAcademia = mode === "academia";
  const treinoData = isAcademia ? TREINO_DATA : TREINO_SEM_ACADEMIA;
  return (
    <div>
      {!isAcademia && (
        <div style={{ background: `${COLORS.carb}12`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.carb}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          <span style={{ color: COLORS.carb, fontWeight: 600 }}>Maio–Jun 2026 · Sem academia.</span> Tubos de resistência + peso corporal. Tempo <span style={{ color: COLORS.carb, fontWeight: 600 }}>3-1-2</span> — principal mecanismo de progressão.
        </div>
      )}
      <SemanaGrid semana={treinoData.semana} />
      {!isAcademia && <TuboLegenda />}
      <TreinoBlock treino={treinoData.treinoA} accentColor="#E2635A" />
      {!isAcademia && <CardioPostTreinoABlock />}
      <TreinoBlock treino={treinoData.treinoB} accentColor="#3BBFA0" />
      {!isAcademia && <NatacaoProgressaoBlock />}
      <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.muted}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
        {isAcademia ? "Cardio pós-treino em zona 2 — intensidade leve, conversa possível. Cardio intenso após Treino B compromete síntese proteíca." : "Cardio sempre depois da musculação. Natação como sessão independente — nunca no mesmo dia que força. Zona 2: consegue conversar durante."}
      </div>
      {!isAcademia && (
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 12 }}>MARCOS DE PROGRESSÃO — MAIO E JUNHO</div>
          {[
            { sem: "Sem 1–2", desc: "Adaptação ao tempo 3-1-2. Foco em técnica. Registrar tubo e reps.", cor: "#E2635A" },
            { sem: "Sem 3–4", desc: "Primeira progressão de tubo nos exercícios mais fáceis.", cor: COLORS.protein },
            { sem: "Sem 5–6", desc: "Revisão geral de tubos. Natação em 8×40 ciclos.", cor: COLORS.carb },
            { sem: "Sem 7–8", desc: "Todos os tubos avançados. Natação recalibrada para séries de 100 ciclos.", cor: "#378ADD" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 3 ? 10 : 0 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: m.cor, background: `${m.cor}18`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap", flexShrink: 0 }}>{m.sem}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{m.desc}</span>
            </div>
          ))}
        </div>
      )}
      <GenericCommandsPanel commands={treinoData.comandos} title={`COMANDOS DA SKILL — TREINO${!isAcademia ? " (SEM ACADEMIA)" : ""}`} />
    </div>
  );
}

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
  const [mode, setMode] = useState("academia");
  return (
    <div style={{ ...dark, background: "#18181C", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px", fontFamily: "'DM Sans', var(--font-sans), sans-serif" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.08em", marginBottom: 4 }}>PLANO ATIVO DESDE {data.baseline}</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)" }}>Dashboard da Pam</div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4, marginBottom: 16 }}>
          {[{ id: "academia", label: "🏗️ Com Academia" }, { id: "semacademia", label: "🏠 Sem Academia" }].map(opt => (
            <button key={opt.id} onClick={() => setMode(opt.id)} style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 12, fontWeight: 500, background: mode === opt.id ? (opt.id === "semacademia" ? `${COLORS.carb}22` : "var(--color-background-primary)") : "transparent", color: mode === opt.id ? (opt.id === "semacademia" ? COLORS.carb : "var(--color-text-primary)") : "var(--color-text-tertiary)", boxShadow: mode === opt.id ? "0 1px 3px rgba(0,0,0,0.3)" : "none", transition: "all 0.2s ease" }}>
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 500, background: activeTab === tab.id ? "var(--color-background-primary)" : "transparent", color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-tertiary)", boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.4)" : "none", transition: "all 0.2s ease" }}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "nutricao" && <NutricaoTab mode={mode} />}
        {activeTab === "composicao" && <ComposicaoTab />}
        {activeTab === "treino" && <TreinoTab mode={mode} />}
      </div>
    </div>
  );
}
