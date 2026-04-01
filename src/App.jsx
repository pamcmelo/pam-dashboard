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
        border: isActive ? `1.5px solid ${isTreino ? COLORS.carb : "#378ADD"}` : "1.5px solid transparent",
        borderRadius: 12,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: isTreino ? COLORS.carb : "#378ADD",
          display: "inline-block"
        }} />
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

      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12, padding: "18px 20px", marginBottom: 16
      }}>
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

      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12, padding: "18px 20px", marginBottom: 16
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>
          PROTEÍNA — 4 REFEIÇÕES DE 30G
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {["Refeição 1", "Refeição 2", "Pré-treino", "Pós-treino"].map((r, i) => (
            <div key={i} style={{
              background: "var(--color-background-secondary)",
              borderRadius: 8, padding: "10px 8px", textAlign: "center"
            }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{r}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.protein }}>30</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>g</div>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 12, fontSize: 11, color: "var(--color-text-secondary)",
          background: "var(--color-background-secondary)",
          borderLeft: `2px solid ${COLORS.carb}`, borderRadius: "0 6px 6px 0",
          padding: "8px 12px", lineHeight: 1.6
        }}>
          Nos dias de treino, pré e pós-treino devem acontecer dentro de 2h antes e depois da sessão.
        </div>
      </div>

      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12, padding: "18px 20px"
      }}>
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
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 6 }}>
                    {restantes > 0 ? `${restantes}d` : "hoje"}
                  </span>
                </div>
              </div>
              <div style={{ height: 3, background: "var(--color-background-tertiary)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  background: i === 0 ? COLORS.carb : i === 1 ? "#378ADD" : COLORS.fat,
                  width: `${pct}%`, transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const COMMANDS = [
  {
    cmd: "/check-semana",
    desc: "Analisar nutrição da semana vs metas",
    color: COLORS.carb,
    example: "/check-semana [anexe o screenshot do app de nutrição]",
    tip: "Use toda segunda-feira com o resumo da semana anterior.",
  },
  {
    cmd: "/check-corpo",
    desc: "Analisar balança vs baseline 31/03/2026",
    color: COLORS.protein,
    example: "/check-corpo [anexe o screenshot da balança OKOK]",
    tip: "Pese sempre em jejum, pela manhã, antes do treino.",
  },
  {
    cmd: "/dia-treino",
    desc: "Exemplo de refeições para dia de treino",
    color: COLORS.carb,
    example: "/dia-treino — me mostre uma sugestão de cardápio para hoje",
    tip: "Pode pedir variações: /dia-treino sem glúten, /dia-treino com o que tenho na geladeira.",
  },
  {
    cmd: "/dia-descanso",
    desc: "Exemplo de refeições para dia de descanso",
    color: "#378ADD",
    example: "/dia-descanso — preciso de uma sugestão para hoje",
    tip: "Lembre que carboidrato cai para 100g. O comando já considera isso.",
  },
  {
    cmd: "/revisao-30",
    desc: "Análise completa com comparativo de 30 dias",
    color: COLORS.fat,
    example: "/revisao-30 [anexe screenshot da balança e do app de nutrição]",
    tip: "Primeira revisão programada para 30/04/2026. Use nessa data.",
  },
  {
    cmd: "/duvida [alimento]",
    desc: "Nutrição e timing ideal de um alimento",
    color: COLORS.protein,
    example: "/duvida abacate — posso comer no dia de descanso?",
    tip: "Funciona com alimentos, refeições prontas ou suplementos.",
  },
  {
    cmd: "/log-semana [descrição]",
    desc: "Registrar intercorrências para histórico",
    color: COLORS.muted,
    example: "/log-semana comi fora 3x, não bati proteína quarta e quinta",
    tip: "Use para registrar semanas atípicas antes da revisão mensal.",
  },
];

function CommandsPanel() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12, padding: "18px 20px", marginTop: 16
    }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 14 }}>
        COMANDOS DA SKILL — NUTRIÇÃO
      </div>
      {COMMANDS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{
            borderBottom: i < COMMANDS.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
            paddingBottom: 10, marginBottom: 10,
          }}>
            <div
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            >
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
                color: item.color,
                background: "var(--color-background-secondary)",
                borderRadius: 6, padding: "3px 8px",
                whiteSpace: "nowrap", flexShrink: 0
              }}>
                {item.cmd}
              </span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.4, flex: 1 }}>
                {item.desc}
              </span>
              <span style={{
                fontSize: 10, color: "var(--color-text-tertiary)",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease", flexShrink: 0
              }}>▾</span>
            </div>

            {isOpen && (
              <div style={{ marginTop: 10, marginLeft: 4 }}>
                <div style={{
                  background: "var(--color-background-secondary)",
                  borderRadius: 8, padding: "10px 12px", marginBottom: 8
                }}>
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", letterSpacing: "0.05em", marginBottom: 5 }}>
                    EXEMPLO DE USO
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    color: item.color, lineHeight: 1.6
                  }}>
                    {item.example}
                  </span>
                </div>
                <div style={{
                  display: "flex", gap: 8, alignItems: "flex-start",
                  padding: "0 2px"
                }}>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0, marginTop: 1 }}>→</span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
                    {item.tip}
                  </span>
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
    { label: "Água corporal", value: data.composicao.agua, sub: "limite inferior", color: "#378ADD" },
    { label: "IMC", value: data.composicao.bmi, sub: "Healthy", color: COLORS.carb },
    { label: "Metabolismo basal", value: data.composicao.tmb, sub: "kcal/dia", color: COLORS.fat },
  ];

  return (
    <div>
      <div style={{
        background: "var(--color-background-secondary)",
        borderRadius: 10, padding: "10px 16px", marginBottom: 16,
        fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6,
        borderLeft: `2px solid ${COLORS.danger}`
      }}>
        Meta principal: reduzir gordura de 29,5% para 22–26% preservando massa muscular.
        O peso é consequência — não é o indicador de acompanhamento.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 10, padding: "14px 16px",
            gridColumn: i === 6 ? "1 / -1" : "auto"
          }}>
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

function TreinoTab() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", textAlign: "center",
      background: "var(--color-background-primary)",
      border: "0.5px dashed var(--color-border-secondary)",
      borderRadius: 12
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: "var(--color-background-secondary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5">
          <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>
        Seção de treino
      </div>
      <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", maxWidth: 260, lineHeight: 1.6 }}>
        Em breve. Esta seção vai incluir protocolo de treino, progressão de cargas, foco muscular e histórico.
      </div>
    </div>
  );
}

const TABS = [
  { id: "nutricao", label: "Nutrição" },
  { id: "composicao", label: "Composição" },
  { id: "treino", label: "Treino" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("nutricao");

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px", fontFamily: "'DM Sans', var(--font-sans), sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.08em", marginBottom: 4 }}>
          PLANO ATIVO DESDE {data.baseline}
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--color-text-primary)" }}>
          Dashboard da Pam
        </div>
      </div>

      <div style={{
        display: "flex", gap: 4,
        background: "var(--color-background-secondary)",
        borderRadius: 10, padding: 4, marginBottom: 24
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
              borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: activeTab === tab.id ? "var(--color-background-primary)" : "transparent",
              color: activeTab === tab.id ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "nutricao" && <NutricaoTab />}
      {activeTab === "composicao" && <ComposicaoTab />}
      {activeTab === "treino" && <TreinoTab />}
    </div>
  );
}
