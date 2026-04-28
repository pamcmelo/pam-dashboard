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
  treino: {
    calorias: 1725,
    proteina: 120,
    carbo: 190,
    gordura: 54,
    prot_pct: 28,
    carbo_pct: 44,
    fat_pct: 28,
  },
  descanso: {
    calorias: 1325,
    proteina: 120,
    carbo: 100,
    gordura: 50,
    prot_pct: 36,
    carbo_pct: 30,
    fat_pct: 34,
  },
  limites: { acucar: 40, fibra: 25, media: 1553 },
};

const COLORS = {
  protein: "#E8A838",
  carb: "#3BBFA0",
  fat: "#8B7FD4",
  accent: "#3BBFA0",
  danger: "#E2635A",
  muted: "#9B9B9B",
  agua: "#378ADD",
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
          <div style={{
            height: "100%", borderRadius: 2, background: color,
            width: `${Math.min((current / meta) * 100, 100)}%`,
            transition: "width 0.6s cubic-bezier(.4,0,.2,1)"
          }} />
        </div>
      )}
    </div>
  );
}

function DayCard({ type, d, isActive, onClick }) {
  const isTreino = type === "treino";
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        background: isActive ? "var(--color-background-primary)" : "var(--color-background-secondary)",
        border: isActive ? `1.5px solid ${isTreino ? COLORS.carb : COLORS.agua}` : "1.5px solid transparent",
        borderRadius: 12,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: isTreino ? COLORS.carb : COLORS.agua, display: "inline-block" }} />
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.05em" }}>
          {isTreino ? "DIA DE TREINO" : "DIA DE DESCANSO"}
        </span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1 }}>
        {d.calorias.toLocaleString()}
        <span style={{ fontSize: 13, fontWeight: 400, color: "var(--color-text-tertiary)", marginLeft: 4 }}>kcal</span>
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 3 }}>
        {isTreino ? "4× por semana" : "3× por semana"}
      </div>
      <MacroBar prot={d.prot_pct} carb={d.carbo_pct} fat={d.fat_pct} />
    </div>
  );
}

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
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 16 }}>
          MACROS — {activeDay === "treino" ? "DIA DE TREINO" : "DIA DE DESCANSO"}
        </div>
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
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>
          PROTEÍNA — 4 REFEIÇÕES DE 30G
        </div>
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
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>
          PRÓXIMAS REVISÕES
        </div>
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
                <div style={{ height: "100%", borderRadius: 2, background: i === 0 ? COLORS.carb : i === 1 ? COLORS.agua : COLORS.fat, width: `${pct}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COMMANDS = [
  { cmd: "/check-semana", desc: "Analisar nutrição da semana vs metas", color: COLORS.carb, example: "/check-semana [anexe o screenshot do app de nutrição]", tip: "Use toda segunda-feira com o resumo da semana anterior." },
  { cmd: "/check-corpo", desc: "Analisar balança vs baseline 31/03/2026", color: COLORS.protein, example: "/check-corpo [anexe o screenshot da balança OKOK]", tip: "Pese sempre em jejum, pela manhã, antes do treino." },
  { cmd: "/dia-treino", desc: "Exemplo de refeições para dia de treino", color: COLORS.carb, example: "/dia-treino — me mostre uma sugestão de cardápio para hoje", tip: "Pode pedir variações: /dia-treino sem glúten, /dia-treino com o que tenho na geladeira." },
  { cmd: "/dia-descanso", desc: "Exemplo de refeições para dia de descanso", color: COLORS.agua, example: "/dia-descanso — preciso de uma sugestão para hoje", tip: "Lembre que carboidrato cai para 100g. O comando já considera isso." },
  { cmd: "/revisao-30", desc: "Análise completa com comparativo de 30 dias", color: COLORS.fat, example: "/revisao-30 [anexe screenshot da balança e do app de nutrição]", tip: "Primeira revisão programada para 30/04/2026. Use nessa data." },
  { cmd: "/duvida [alimento]", desc: "Nutrição e timing ideal de um alimento", color: COLORS.protein, example: "/duvida abacate — posso comer no dia de descanso?", tip: "Funciona com alimentos, refeições prontas ou suplementos." },
  { cmd: "/log-semana [descrição]", desc: "Registrar intercorrências para histórico", color: COLORS.muted, example: "/log-semana comi fora 3x, não bati proteína quarta e quinta", tip: "Use para registrar semanas atípicas antes da revisão mensal." },
];

function CommandsPanel() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "18px 20px", marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>COMANDOS DA SKILL — NUTRIÇÃO</div>
      {COMMANDS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderBottom: i < COMMANDS.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", paddingBottom: 10, marginBottom: 10 }}>
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
  const items = [
    { label: "Peso atual", value: data.composicao.peso, sub: "baseline 31/03/2026", color: COLORS.accent },
    { label: "% Gordura", value: data.composicao.gordura, sub: `meta: ${data.composicao.metaGordura}`, color: COLORS.danger },
    { label: "Massa muscular", value: data.composicao.musculo, sub: "Perfect", color: COLORS.protein },
    { label: "V-fat", value: data.composicao.vfat, sub: "Healthy", color: COLORS.carb },
    { label: "Água corporal", value: data.composicao.agua, sub: "limite inferior", color: COLORS.agua },
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
      <CommandsPanel />
    </div>
  );
}

// ─── TREINO COM ACADEMIA ──────────────────────────────────────────────────────

const TREINO_DATA = {
  semana: [
    { dia: "Segunda", tipo: "A", cardio: "Elíptico 20min", cor: "#E2635A" },
    { dia: "Terça", tipo: "B", cardio: "Esteira 20min", cor: "#3BBFA0" },
    { dia: "Quarta", tipo: "descanso", cardio: null, cor: null },
    { dia: "Quinta", tipo: "A", cardio: "Elíptico 20min", cor: "#E2635A" },
    { dia: "Sexta", tipo: "B", cardio: "Esteira 20min", cor: "#3BBFA0" },
    { dia: "Sáb/Dom", tipo: "descanso", cardio: null, cor: null },
  ],
  treinoA: {
    label: "Treino A — Membros Superiores",
    tag: "Braços",
    dias: "Seg / Qui",
    exercicios: [
      { nome: "Supino com Halteres", volume: "4×10", obs: "Peito · Tríceps · Deltóide anterior", musculo: "Peitoral maior (primário) · Tríceps · Deltóide anterior", passos: ["Deite no banco com os pés apoiados no chão. Segure um halter em cada mão na altura do peito, cotovelos a ~45° do corpo.", "Inspire e empurre os halteres para cima até os braços ficarem quase estendidos — não trave o cotovelo.", "Expire na subida. Desça controlado de volta à posição inicial, sentindo o alongamento no peito.", "Mantenha as escápulas retraídas (ombros 'para baixo e para trás') durante todo o movimento."], dica: "Se os halteres oscilarem muito para os lados, reduza o peso. Estabilidade antes de carga." },
      { nome: "Rosca Direta", volume: "4×12", obs: "Bíceps · Braquial", musculo: "Bíceps braquial (primário) · Braquial · Braquiorradial", passos: ["Em pé, pés na largura dos ombros. Segure a barra ou halteres com pegada supinada (palmas para cima), braços estendidos.", "Mantenha os cotovelos fixos ao lado do corpo — eles não devem se mover para frente.", "Contraia o bíceps e suba o peso até a altura dos ombros. Expire na subida.", "Desça lentamente (2–3 segundos) sem deixar o peso cair. Esse controle na descida é onde o músculo cresce."], dica: "Cotovelo parado é o erro mais comum. Se ele avança, o ombro está assumindo o movimento." },
      { nome: "Tríceps Pulley (Corda)", volume: "4×15", obs: "Porção longa — foco flacidez", musculo: "Tríceps braquial — porção longa (primário) · Porção lateral", passos: ["Em pé de frente para o cabo alto. Segure as pontas da corda com as palmas voltadas uma para a outra.", "Incline levemente o tronco à frente. Cotovelos fixos ao lado do corpo, dobrados a ~90°.", "Empurre a corda para baixo abrindo as pontas para os lados no final do movimento — isso maximiza o alongamento da porção longa.", "Suba controlado sem deixar os cotovelos abrirem para fora."], dica: "A abertura das pontas no final é o detalhe que ativa a porção longa — exatamente a região que causa flacidez no braço. Não pule esse gesto." },
      { nome: "Desenvolvimento com Halteres", volume: "3×12", obs: "Deltóide · Trapézio", musculo: "Deltóide medial e anterior (primário) · Trapézio superior · Tríceps", passos: ["Sentada ou em pé, segure os halteres na altura dos ombros com cotovelos a ~90°, palmas para frente.", "Empurre os halteres para cima até os braços ficarem quase estendidos acima da cabeça.", "Não eleve os ombros em direção às orelhas — mantenha-os 'encaixados' para baixo.", "Desça controlado de volta à altura dos ombros."], dica: "Prefira sentar com encosto para evitar compensação com a lombar quando o peso aumentar." },
      { nome: "Puxador Frontal", volume: "3×12", obs: "Dorsal · Equilíbrio push/pull", musculo: "Latíssimo do dorso (primário) · Romboides · Bíceps · Infraespinhal", passos: ["Sentada na máquina com as coxas fixas sob o apoio. Segure a barra com pegada larga, palmas para frente.", "Incline o tronco levemente para trás (~15°). Puxe a barra em direção à parte superior do peito.", "Pense em 'trazer os cotovelos para baixo e para dentro' — não para trás. As escápulas devem se retrair e descer.", "Suba controlado sem deixar os ombros subirem junto."], dica: "Não se incline demais para trás — isso tira o trabalho do dorsal. O movimento vem do ombro, não da lombar." },
      { nome: "Elevação Lateral", volume: "3×15", obs: "Deltóide medial · Definição de ombro", musculo: "Deltóide medial (primário) · Supraspinhal", passos: ["Em pé, halteres ao lado do corpo com leve flexão nos cotovelos. Palmas voltadas para o corpo.", "Eleve os braços lateralmente até a altura dos ombros — não acima. Imagine derramar água de um copo no alto.", "O mindinho deve ficar levemente mais alto que o polegar no ponto mais alto.", "Desça controlado — a descida lenta é onde o deltóide medial realmente trabalha."], dica: "Use peso leve. Com carga errada, o trapézio assume e o deltóide medial sai do exercício." },
    ],
    core: {
      label: "Core A — Abdômen + Oblíquos",
      exercicios: [
        { nome: "Elevação de Pernas na Barra", volume: "3×12", obs: "Reto abdominal inferior", passos: ["Suspensa na barra, braços estendidos. Mantenha o core contraído.", "Eleve as pernas juntas até 90° (ou o máximo sem compensar com o quadril).", "Desça lentamente sem balançar o corpo."], dica: "Se balançar, reduza a amplitude até ter mais controle." },
        { nome: "Crunch com Rotação", volume: "3×12", obs: "Oblíquos · Cintura", passos: ["Deitada, joelhos dobrados, mãos atrás da cabeça.", "Suba o tronco e leve o cotovelo direito em direção ao joelho esquerdo. Alterne.", "O movimento vem da rotação do tronco, não da cabeça."], dica: "Não puxe o pescoço com as mãos. Os dedos ficam leves na nuca." },
        { nome: "Prancha Lateral + Elevação de Quadril", volume: "3×30s", obs: "Cada lado · Oblíquo profundo", passos: ["Apoie-se no antebraço e no pé, corpo em linha reta lateral.", "Deixe o quadril cair levemente e então eleve de volta, contraindo o oblíquo.", "Mantenha o pescoço alinhado com a coluna durante toda a duração."], dica: "A elevação de quadril é o que transforma a prancha estática em exercício dinâmico." },
      ],
    },
  },
  treinoB: {
    label: "Treino B — Inferior · Coxa & Quadril",
    tag: "Anti-flacidez",
    dias: "Ter / Sex",
    foco: "Coxa interna (adutores) + lateral do quadril (glúteo médio). São os dois grupos que mais sustentam a pele e combatem a flacidez na região da coxa.",
    exercicios: [
      { nome: "Agachamento Sumo com Halter", volume: "4×12", obs: "Adutores · Glúteo · Quadríceps", musculo: "Adutores (primário) · Glúteo máximo · Quadríceps · Isquiotibiais", passos: ["Pés bem afastados (acima da largura dos ombros), dedos apontados para fora ~45°. Segure um halter com as duas mãos à frente do corpo.", "Desça mantendo o tronco ereto e os joelhos alinhados com a ponta dos pés — eles não devem cair para dentro.", "Desça até as coxas ficarem paralelas ao chão ou um pouco abaixo.", "Suba empurrando o chão, contraindo glúteo e adutores no topo."], dica: "Quanto mais afastados os pés, mais recrutamento de adutores. Ajuste gradualmente." },
      { nome: "Hip Thrust com Barra", volume: "4×15", obs: "Glúteo máximo — ativação máxima", musculo: "Glúteo máximo (primário) · Isquiotibiais · Core", passos: ["Apoie o ombro no banco. Coloque a barra sobre os quadris (use almofada de proteção). Pés na largura dos ombros, joelhos dobrados a ~90°.", "Desça o quadril em direção ao chão mantendo o core contraído.", "Empurre o quadril para cima até o corpo formar uma linha do ombro ao joelho.", "Contraia o glúteo com força no ponto mais alto e segure 1 segundo antes de descer."], dica: "Não hiperextenda a lombar no topo. O movimento vem do glúteo, não das costas." },
      { nome: "Cadeira Adutora", volume: "4×15", obs: "Coxa interna — foco principal flacidez", musculo: "Adutores (primário) — grácil, pectíneo, adutor longo/curto/magno", passos: ["Sentada na máquina com as costas apoiadas. Posicione as coxas nos apoios com as pernas abertas.", "Nas semanas 1–2: não abra até o limite máximo da máquina. Use amplitude parcial.", "Feche as pernas de forma controlada até os apoios se tocarem ou quase.", "Abra devagar — a fase excêntrica (abertura) é onde o músculo mais trabalha."], dica: "Semana 5+: adicione pausa de 2s com as pernas fechadas antes de abrir." },
      { nome: "Cadeira Abdutora", volume: "4×20", obs: "Glúteo médio · Lateral do quadril", musculo: "Glúteo médio (primário) · Glúteo mínimo · Tensor da fáscia lata", passos: ["Sentada com as costas apoiadas a 90°. As almofadas ficam do lado externo das coxas.", "Abra as pernas empurrando os apoios para fora, contra a resistência.", "Abra até sentir contração lateral no glúteo — não force além da amplitude confortável.", "Feche controlado sem deixar o peso 'cair' de volta."], dica: "Inclinar levemente o tronco para frente aumenta o recrutamento do glúteo médio." },
      { nome: "Leg Press — Pés Juntos", volume: "3×12", obs: "Quadríceps · Adutores", musculo: "Quadríceps (primário) · Adutores · Glúteo", passos: ["Sentada no leg press, pés próximos no centro da plataforma (largura dos quadris ou menor).", "Desça a plataforma até os joelhos formarem ângulo de ~90°. Não deixe os joelhos ultrapassar muito os pés.", "Empurre de volta sem travar o joelho no topo — mantenha leve tensão.", "Pés juntos aumenta o trabalho interno do quadríceps (vasto medial) e adutores."], dica: "Não tire a lombar do encosto ao descer. Se isso acontecer, reduza a amplitude." },
      { nome: "Mesa Flexora", volume: "3×15", obs: "Isquiotibiais · Posterior da coxa", musculo: "Isquiotibiais (primário) — bíceps femoral, semitendíneo, semimembranoso", passos: ["Deitada de bruços na mesa, joelhos alinhados com o eixo da máquina. Apoio nas coxas, tornozelos abaixo do rolo.", "Flexione os joelhos puxando o rolo em direção ao glúteo. Expire na subida.", "Contraia os isquiotibiais no ponto máximo de flexão.", "Desça lentamente — essa fase excêntrica é fundamental para o desenvolvimento da parte posterior da coxa."], dica: "Não levante o quadril da mesa ao subir. Se isso acontecer, o peso está alto demais." },
      { nome: "Abdução no Cabo", volume: "3×15", obs: "Glúteo médio · Isolamento lateral", musculo: "Glúteo médio (primário) · Glúteo mínimo", passos: ["Fixe o cabo no tornozelo (perna trabalhada). Segure a máquina do lado oposto para equilíbrio.", "Com leve flexão no joelho de apoio, eleve a perna com o cabo lateralmente até ~30–40° do chão.", "Mantenha o tronco ereto — não incline para o lado como compensação.", "Desça controlado sem pousar o pé entre as repetições."], dica: "Amplitude menor com controle vale mais do que amplitude grande com oscilação do tronco." },
      { nome: "Stiff com Halteres", volume: "3×12", obs: "Isquiotibiais · Glúteo · Lombar", musculo: "Isquiotibiais (primário) · Glúteo máximo · Eretores da coluna", passos: ["Em pé, halteres à frente das coxas, palmas voltadas para o corpo. Pés na largura dos quadris.", "Incline o tronco para frente empurrando o quadril para trás — não dobrar os joelhos como no agachamento.", "Desça os halteres próximos às pernas até sentir o alongamento nos isquiotibiais (geralmente até abaixo do joelho).", "Suba empurrando o quadril para frente, contraindo glúteo no topo."], dica: "A coluna deve permanecer neutra durante todo o movimento. Costas arredondadas = risco de lombar." },
    ],
    progressao: [
      { sem: "Sem 1–2", desc: "Amplitude parcial, peso leve. Foco na técnica." },
      { sem: "Sem 3–4", desc: "Amplitude total. Aumente o peso 2–5% se não sentir dor." },
      { sem: "Sem 5+", desc: "Adicione pausa de 2s com pernas fechadas em cada rep." },
    ],
    core: {
      label: "Core B — Lombar + Costas",
      exercicios: [
        { nome: "Banco Romano — Extensão Lombar", volume: "3×15", obs: "Lombar · Glúteo · Cadeia posterior", passos: ["Posicione as coxas no apoio, tornozelos fixos. Tronco dobrado para baixo.", "Suba o tronco até ficar alinhado com as pernas — não hiperextenda.", "Desça controlado sentindo o alongamento na cadeia posterior."], dica: "Braços cruzados no peito para iniciante. Atrás da cabeça aumenta a dificuldade." },
        { nome: "Superman com Pulso", volume: "3×12", obs: "+2s pausa · Lombar · Trapézio inferior", passos: ["Deitada de bruços, braços estendidos à frente.", "Eleve simultaneamente braços e pernas do chão. Segure 2 segundos.", "Desça controlado sem pousar completamente entre as reps."], dica: "O 'pulso' é o gesto de puxar os braços levemente para baixo no ponto alto — ativa o trapézio inferior." },
        { nome: "Prancha com Alcance Alternado", volume: "3×10", obs: "Cada lado · Core profundo", passos: ["Em posição de prancha alta (mãos no chão). Core e glúteo contraídos.", "Estenda um braço à frente sem rotacionar o quadril. Mantenha o corpo estável.", "Retorne e alterne os lados. Cada alcance = 1 repetição."], dica: "Quanto menos o quadril oscilar, mais o core profundo (transverso abdominal) está trabalhando." },
      ],
    },
  },
  comandos: [
    { cmd: "/check-treino", desc: "Analisar aderência da semana: dias, exercícios e falhas", color: COLORS.carb, example: "/check-treino — fiz seg, ter, qui. Na sexta não consegui ir.", tip: "Use toda segunda com o resumo da semana anterior." },
    { cmd: "/check-carga", desc: "Verificar progressão de carga vs semanas anteriores", color: COLORS.protein, example: "/check-carga — supino estava em 8kg, subi para 10kg essa semana.", tip: "Anote os pesos usados em cada sessão. Sem esse registro, a progressão fica invisível." },
    { cmd: "/ajuste-treino", desc: "Avaliar necessidade de alteração no protocolo", color: COLORS.fat, example: "/ajuste-treino — semana 6, estou me sentindo bem mas o Treino B está levando 90min.", tip: "Use quando sentir estagnação por 3+ semanas ou quando a rotina precisar se adaptar à sua agenda." },
    { cmd: "/dor [músculo]", desc: "Orientar sobre dor ou desconforto em região específica", color: COLORS.danger, example: "/dor ombro direito — dói ao fazer desenvolvimento, mas não no pulley.", tip: "Diferencie tensão muscular (normal) de dor articular ou pontada (sinal de parar)." },
    { cmd: "/revisao-treino-30", desc: "Análise completa de 30 dias: aderência e progressão", color: COLORS.fat, example: "/revisao-treino-30 [descreva como foram as 4 semanas]", tip: "Primeira revisão programada para 30/04/2026. Traga registro de cargas e dias cumpridos." },
    { cmd: "/semana [descrição]", desc: "Registrar semana de treino para histórico", color: COLORS.muted, example: "/semana semana 2 concluída. Adutora ainda leve, mas senti mais ativação.", tip: "Use para registrar semanas atípicas, progressões ou dificuldades antes da revisão mensal." },
  ],
};

// ─── TREINO SEM ACADEMIA (MAIO 2026) ─────────────────────────────────────────

const TREINO_SEM_ACADEMIA = {
  periodo: "Maio 2026",
  nota: "Protocolo adaptado: natação na lagoa + peso corporal + improviso. Metas nutricionais inalteradas.",
  semana: [
    { dia: "Segunda", tipo: "A", cardio: "Natação + Bodyweight Superior", cor: "#378ADD" },
    { dia: "Terça", tipo: "B", cardio: "Bodyweight Inferior + Bike 20min", cor: "#3BBFA0" },
    { dia: "Quarta", tipo: "descanso", cardio: "Bike leve 20–30min", cor: null },
    { dia: "Quinta", tipo: "A", cardio: "Natação + Bodyweight Superior", cor: "#378ADD" },
    { dia: "Sexta", tipo: "B", cardio: "Bodyweight Inferior + Bike 20min", cor: "#3BBFA0" },
    { dia: "Sáb/Dom", tipo: "descanso", cardio: null, cor: null },
  ],
  treinoA: {
    label: "Treino A — Natação + Superior",
    tag: "Lagoa",
    dias: "Seg / Qui",
    foco: "Natação como treino principal de upper body. Contagem por ciclos de braçada — 1 ciclo = os dois braços completam um movimento completo cada.",
    blocoNatacao: {
      label: "Bloco Natação — ~25–30 min",
      nota: "Descanso de 20–30s entre séries. Nado com intenção — não é recreativo.",
      series: [
        { series: "4 séries", ciclos: "40 ciclos", nado: "Crawl", foco: "Pull — dorsais e tríceps", emoji: "🔵" },
        { series: "2 séries", ciclos: "20 ciclos", nado: "Borboleta", foco: "Peito · Tríceps · Core", emoji: "🟣" },
        { series: "4 séries", ciclos: "40 ciclos", nado: "Costas", foco: "Bíceps · Ombro posterior", emoji: "🟡" },
        { series: "4 séries", ciclos: "20 ciclos", nado: "Peito", foco: "Adutores no kick · Peitoral", emoji: "🟢" },
        { series: "1 série", ciclos: "150 ciclos", nado: "Crawl leve", foco: "Recuperação ativa", emoji: "⚪" },
      ],
    },
    exercicios: [
      { nome: "Flexão com Mochila", volume: "4×10", obs: "Peito · Tríceps · Deltóide anterior", passos: ["Mochila nas costas com peso gradual (livros, garrafas cheias).", "Posição de prancha alta, mãos na largura dos ombros.", "Desça o peito até quase tocar o chão. Cotovelos a ~45° do corpo.", "Suba completamente contraindo o peito. A mochila adiciona sobrecarga progressiva."], dica: "Comece com mochila leve (~2–3kg). Aumente quando conseguir 4×10 sem perder forma." },
      { nome: "Pike Push-up", volume: "3×12", obs: "Deltóide · Trapézio superior", passos: ["Em posição de V invertido — quadril alto, mãos e pés no chão.", "Dobre os cotovelos baixando a cabeça em direção ao chão.", "Empurre de volta à posição inicial.", "Quanto mais vertical o tronco, mais deltóide. Ajuste o ângulo com a posição dos pés."], dica: "Substitui o desenvolvimento com halteres. O ângulo do tronco é o que define a dificuldade." },
      { nome: "Tríceps Inverso no Chão", volume: "4×15", obs: "Tríceps porção longa — foco flacidez", passos: ["Sentada no chão, mãos atrás do corpo com dedos apontados para frente.", "Eleve o quadril do chão (posição de mesa invertida). Pés afastados na largura dos quadris.", "Dobre os cotovelos abaixando o quadril em direção ao chão.", "Estenda os braços voltando à posição alta. O movimento vem só dos tríceps."], dica: "Pés mais próximos ao corpo = mais dificuldade. Se for fácil, eleve os pés numa superfície." },
      { nome: "Rosca com Garrafas", volume: "4×12", obs: "Bíceps · Braquial", passos: ["Segure garrafas de 1,5–2L cheias em cada mão (peso ~1,5–2kg cada).", "Em pé, cotovelos fixos ao lado do corpo.", "Suba as garrafas até os ombros contraindo os bíceps.", "Desça lentamente — 2–3 segundos na descida."], dica: "Para aumentar dificuldade, encha garrafas maiores ou use mochila com alça longa como barra improvisada." },
      { nome: "Elevação Lateral com Garrafas", volume: "3×15", obs: "Deltóide medial", passos: ["Garrafas de ~1kg em cada mão. Em pé, braços ao lado do corpo.", "Eleve lateralmente até a altura dos ombros.", "Mindinho levemente mais alto que o polegar no topo.", "Desça controlado — 2s na descida."], dica: "Peso leve é suficiente aqui. Técnica e velocidade de descida são mais importantes que carga." },
      { nome: "Remada com Mochila", volume: "3×12", obs: "Dorsal · Romboides · Bíceps", passos: ["Apoie uma mão e joelho no chão (ou numa cadeira). Segure a mochila com a outra mão.", "Puxe a mochila em direção ao quadril, cotovelo subindo para cima.", "Escápula se retrai no topo — segure 1s.", "Desça controlado até o braço ficar estendido."], dica: "Substitui o puxador frontal. Mochila de 4–6kg é suficiente para recrutamento de dorsal." },
    ],
    core: {
      label: "Core A — Abdômen + Oblíquos",
      exercicios: [
        { nome: "Elevação de Pernas no Chão", volume: "3×12", obs: "Reto abdominal inferior", passos: ["Deitada de costas, mãos sob o glúteo para suporte lombar.", "Pernas estendidas, eleve até 90° mantendo o core contraído.", "Desça lentamente sem deixar os pés tocarem o chão entre as reps."], dica: "Substitui a elevação na barra. Controlar a lombar é o desafio aqui." },
        { nome: "Crunch com Rotação", volume: "3×12", obs: "Oblíquos · Cintura", passos: ["Deitada, joelhos dobrados, mãos atrás da cabeça.", "Suba o tronco e leve o cotovelo direito em direção ao joelho esquerdo. Alterne.", "O movimento vem da rotação do tronco, não da cabeça."], dica: "Não puxe o pescoço. Os dedos ficam leves na nuca." },
        { nome: "Prancha Lateral + Elevação de Quadril", volume: "3×30s", obs: "Cada lado · Oblíquo profundo", passos: ["Apoie-se no antebraço e no pé, corpo em linha reta lateral.", "Deixe o quadril cair levemente e então eleve, contraindo o oblíquo.", "Mantenha o pescoço alinhado com a coluna."], dica: "Igual ao protocolo de academia — sem adaptação necessária." },
      ],
    },
  },
  treinoB: {
    label: "Treino B — Bodyweight Inferior + Bike",
    tag: "Colchonete",
    dias: "Ter / Sex",
    foco: "Sem cadeira adutora/abdutora disponível — substitutos aproximados com resistência corporal e improvisação. Adutora e abdutora mantêm, mas não progridem esse mês.",
    exercicios: [
      { nome: "Agachamento Sumo com Mochila", volume: "4×12", obs: "Adutores · Glúteo · Quadríceps", passos: ["Mochila no peito ou nas costas (6–10kg de livros/garrafas).", "Pés bem afastados, dedos para fora ~45°.", "Desça até as coxas paralelas ao chão, joelhos alinhados com os pés.", "Suba contraindo glúteo e adutores no topo."], dica: "Peso na frente do peito (goblet) recruta mais adutores. Prefira essa variação." },
      { nome: "Hip Thrust no Chão com Mochila", volume: "4×15", obs: "Glúteo máximo", passos: ["Deitada de costas, joelhos dobrados, pés no chão. Mochila sobre os quadris.", "Core contraído. Empurre o quadril para cima até o corpo formar linha reta.", "Contraia o glúteo com força no topo — segure 2s.", "Desça sem deixar o glúteo tocar o chão entre as reps."], dica: "Pausa de 2s é mais importante que a carga aqui. Ativação máxima vem do controle, não do peso." },
      { nome: "Adução com Garrafa entre Joelhos", volume: "4×15", obs: "Coxa interna — aproximação da cadeira adutora", passos: ["Deitada de costas, joelhos dobrados e levantados, garrafa de 1,5L entre os joelhos.", "Pressione a garrafa com força usando as coxas. Segure 3s.", "Relaxe levemente — sem soltar — e repita.", "Combine com o hip thrust: sobe o quadril + aperta a garrafa simultaneamente."], dica: "Não é equivalente à cadeira adutora — é uma aproximação. O objetivo esse mês é manutenção, não progressão." },
      { nome: "Abdução Deitada Lateral", volume: "4×20", obs: "Glúteo médio · Lateral do quadril", passos: ["Deitada de lado, quadril empilhado. Perna de cima estendida.", "Eleve a perna de cima até ~40–45° do chão.", "Contraia o glúteo lateral no ponto mais alto — segure 1s.", "Desça controlado sem pousar entre as reps."], dica: "Para aumentar dificuldade: adicione elástico acima dos joelhos (se tiver) ou segure garrafa no quadril." },
      { nome: "Afundo Alternado com Mochila", volume: "3×12 cada", obs: "Quadríceps · Glúteo · Isquiotibiais", passos: ["Mochila nas costas (4–8kg). Em pé, pés juntos.", "Dê um passo à frente, joelho traseiro desce em direção ao chão.", "Joelho da frente não ultrapassa o pé. Tronco ereto.", "Empurre o pé da frente de volta à posição inicial e alterne."], dica: "Substitui o leg press. Mais funcional e maior amplitude de movimento." },
      { nome: "Stiff com Mochila", volume: "3×12", obs: "Isquiotibiais · Glúteo · Lombar", passos: ["Mochila nas mãos à frente das coxas ou nas costas.", "Incline o tronco para frente empurrando o quadril para trás.", "Desça até sentir alongamento nos isquiotibiais.", "Suba empurrando o quadril para frente, contraindo glúteo no topo."], dica: "Mesma técnica do stiff com halteres — só a carga muda." },
    ],
    core: {
      label: "Core B — Lombar + Costas",
      exercicios: [
        { nome: "Extensão Lombar no Chão", volume: "3×15", obs: "Lombar · Glúteo · Cadeia posterior", passos: ["Deitada de bruços, braços estendidos à frente ou cruzados no peito.", "Eleve o tronco do chão usando a lombar — não as mãos.", "Segure 1s no topo. Desça controlado."], dica: "Substitui o banco romano. Efetividade semelhante para manutenção." },
        { nome: "Superman com Pulso", volume: "3×12", obs: "+2s pausa · Lombar · Trapézio inferior", passos: ["Deitada de bruços, braços estendidos à frente.", "Eleve simultaneamente braços e pernas do chão. Segure 2 segundos.", "Desça controlado sem pousar completamente entre as reps."], dica: "Sem adaptação necessária — já é exercício de chão." },
        { nome: "Prancha com Alcance Alternado", volume: "3×10", obs: "Cada lado · Core profundo", passos: ["Em posição de prancha alta (mãos no chão). Core e glúteo contraídos.", "Estenda um braço à frente sem rotacionar o quadril.", "Retorne e alterne os lados."], dica: "Sem adaptação necessária." },
      ],
    },
  },
};

// ─── COMPONENTES COMPARTILHADOS ───────────────────────────────────────────────

function ExercicioRow({ nome, volume, obs, musculo, passos, dica, checked, onCheck, accentColor }) {
  const [openInstrucoes, setOpenInstrucoes] = useState(false);
  const cor = accentColor || COLORS.carb;
  return (
    <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: checked ? `${cor}08` : "transparent", transition: "background 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "flex-start", padding: "10px 0", gap: 10 }}>
        <div onClick={(e) => { e.stopPropagation(); onCheck(); }} style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1, border: `1.5px solid ${checked ? cor : "var(--color-border-tertiary)"}`, background: checked ? cor : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
          {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: checked ? "var(--color-text-tertiary)" : "var(--color-text-primary)", marginBottom: 2, textDecoration: checked ? "line-through" : "none", transition: "all 0.2s ease" }}>{nome}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{obs}</div>
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
  const allExs = [...(treino.exercicios || []), ...(treino.core?.exercicios || [])];
  const initialChecked = allExs.reduce((acc, ex) => ({ ...acc, [ex.nome]: false }), {});
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(initialChecked);
  const toggleCheck = (nome) => setChecked(prev => ({ ...prev, [nome]: !prev[nome] }));
  const done = Object.values(checked).filter(Boolean).length;
  const total = allExs.length;

  return (
    <div style={{ background: "var(--color-background-primary)", border: `0.5px solid var(--color-border-tertiary)`, borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
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

          {/* Bloco de natação (só treino sem academia) */}
          {treino.blocoNatacao && (
            <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px", marginBottom: 14, borderLeft: `2px solid ${COLORS.agua}` }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: COLORS.agua, letterSpacing: "0.06em", marginBottom: 4 }}>{treino.blocoNatacao.label.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 12 }}>{treino.blocoNatacao.nota}</div>
              {treino.blocoNatacao.series.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: i < treino.blocoNatacao.series.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)" }}>{s.series}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.agua, background: `${COLORS.agua}18`, borderRadius: 4, padding: "1px 6px" }}>{s.ciclos}</span>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{s.nado}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{s.foco}</div>
                  </div>
                </div>
              ))}
            </div>
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

function MarcosTreinoPanel() {
  const baseline = new Date(2026, 2, 31);
  const marcos = [
    { label: "Aumentar carga — Adutora", data: "14/04/2026", sem: "Sem 3–4", desc: "Amplitude total liberada + +2–5% de carga se sem dor", color: "#3BBFA0" },
    { label: "Revisão de carga geral", data: "28/04/2026", sem: "Sem 4", desc: "Checar progressão em todos os exercícios principais do A e B", color: "#E8A838" },
    { label: "Pausa adutora + volume", data: "05/05/2026", sem: "Sem 5+", desc: "Adicionar pausa 2s + avaliar se volume do Treino B ainda é adequado", color: "#3BBFA0" },
    { label: "Revisão completa de treino", data: "30/04/2026", sem: "30 dias", desc: "Análise de aderência, progressão e próximos ajustes de protocolo", color: "#8B7FD4" },
  ].sort((a, b) => { const p = s => { const [d,m,y] = s.split("/").map(Number); return new Date(y,m-1,d); }; return p(a.data) - p(b.data); });

  function diasRestantes(dataStr) {
    const [d, m, y] = dataStr.split("/").map(Number);
    return Math.max(0, Math.round((new Date(y, m - 1, d) - baseline) / 86400000));
  }

  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>MARCOS DE PROGRESSÃO</div>
      {marcos.map((m, i) => {
        const restantes = diasRestantes(m.data);
        const pct = Math.max(2, Math.min(100, ((91 - restantes) / 91) * 100));
        return (
          <div key={i} style={{ marginBottom: i < marcos.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.color, background: `${m.color}18`, borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>{m.sem}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{m.label}</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>{m.desc}</span>
              </div>
              <div style={{ textAlign: "right", marginLeft: 12, flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{m.data}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{restantes > 0 ? `${restantes}d` : "hoje"}</div>
              </div>
            </div>
            <div style={{ height: 3, background: "var(--color-background-tertiary)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: m.color, width: `${pct}%`, transition: "width 0.6s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TreinoCommandsPanel({ comandos }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "16px" }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>COMANDOS DA SKILL — TREINO</div>
      {comandos.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderBottom: i < comandos.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none", paddingBottom: 10, marginBottom: 10 }}>
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

// ─── ABA DE TREINO ────────────────────────────────────────────────────────────

function TreinoTab() {
  const [modo, setModo] = useState("academia");
  const isAcademia = modo === "academia";

  const semanaAtual = isAcademia ? TREINO_DATA.semana : TREINO_SEM_ACADEMIA.semana;

  return (
    <div>
      {/* Toggle academia / sem academia */}
      <div style={{ display: "flex", gap: 4, background: "var(--color-background-secondary)", borderRadius: 10, padding: 4, marginBottom: 20 }}>
        {[{ id: "academia", label: "Com Academia" }, { id: "semAcademia", label: "Sem Academia" }].map(opt => (
          <button key={opt.id} onClick={() => setModo(opt.id)} style={{ flex: 1, padding: "7px 0", border: "none", cursor: "pointer", borderRadius: 7, fontSize: 12, fontWeight: 500, background: modo === opt.id ? "var(--color-background-primary)" : "transparent", color: modo === opt.id ? "var(--color-text-primary)" : "var(--color-text-tertiary)", boxShadow: modo === opt.id ? "0 1px 3px rgba(0,0,0,0.4)" : "none", transition: "all 0.2s ease" }}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Banner sem academia */}
      {!isAcademia && (
        <div style={{ background: `${COLORS.agua}12`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.agua}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600, color: COLORS.agua }}>Maio 2026 · </span>{TREINO_SEM_ACADEMIA.nota}
        </div>
      )}

      {/* Divisão semanal */}
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 12 }}>DIVISÃO SEMANAL</div>
        {semanaAtual.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < semanaAtual.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.cor || "var(--color-border-tertiary)", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{d.dia}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              {d.tipo === "descanso" ? (
                <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                  {d.cardio ? d.cardio : (d.dia === "Quarta" ? "Descanso ativo" : "Descanso")}
                </span>
              ) : (
                <div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: d.cor, background: `${d.cor}18`, borderRadius: 4, padding: "2px 6px", marginRight: 6 }}>
                    {isAcademia ? `Treino ${d.tipo}` : `Treino ${d.tipo}`}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>+ {d.cardio}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Blocos de treino */}
      {isAcademia ? (
        <>
          <TreinoBlock treino={TREINO_DATA.treinoA} accentColor="#E2635A" />
          <TreinoBlock treino={TREINO_DATA.treinoB} accentColor="#3BBFA0" />
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.muted}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Cardio pós-treino em zona 2 — intensidade leve, conversa possível durante. Cardio intenso após Treino B compromete síntese proteica.
          </div>
          <MarcosTreinoPanel />
          <TreinoCommandsPanel comandos={TREINO_DATA.comandos} />
        </>
      ) : (
        <>
          <TreinoBlock treino={TREINO_SEM_ACADEMIA.treinoA} accentColor={COLORS.agua} />
          <TreinoBlock treino={TREINO_SEM_ACADEMIA.treinoB} accentColor="#3BBFA0" />
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, borderLeft: `2px solid ${COLORS.agua}`, fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            <strong style={{ color: COLORS.agua }}>Hidratação:</strong> nos dias de natação, mantenha 2,5–3L de água. Você transpira dentro d'água sem sentir. Macros inalteradas — dias de natação + bodyweight continuam como dias de treino (1.725 kcal).
          </div>
          <TreinoCommandsPanel comandos={TREINO_DATA.comandos} />
        </>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "nutricao", label: "Nutrição" },
  { id: "composicao", label: "Composição" },
  { id: "treino", label: "Treino" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("nutricao");

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
