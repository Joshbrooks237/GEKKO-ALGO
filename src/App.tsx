import { useState } from 'react'

/* ─── tiny design system ─────────────────────────────────────────── */
const css = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '0 0 80px',
  } as React.CSSProperties,

  header: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border-subtle)',
    padding: '28px 48px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  } as React.CSSProperties,

  main: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '40px 48px 0',
  } as React.CSSProperties,
}

/* ─── small primitives ───────────────────────────────────────────── */
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '36px 0' }} />
}

function Tag({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'high' | 'medium' | 'low' }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    high:    { bg: 'var(--danger-dim)',   color: 'var(--danger)',   border: 'rgba(224,92,106,0.3)' },
    medium:  { bg: 'var(--warning-dim)',  color: 'var(--warning)',  border: 'rgba(229,168,74,0.3)' },
    low:     { bg: 'var(--success-dim)',  color: 'var(--success)',  border: 'rgba(76,175,130,0.3)' },
    neutral: { bg: 'var(--surface-raised)', color: 'var(--text-secondary)', border: 'var(--border)' },
  }
  const c = colors[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 4,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{children}</span>
  )
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: 'danger' | 'success' | 'warning' | 'info' }) {
  const toneColor: Record<string, string> = {
    danger: 'var(--danger)', success: 'var(--success)', warning: 'var(--warning)', info: 'var(--accent)',
  }
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: tone ? toneColor[tone] : 'var(--text-primary)', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 500, letterSpacing: '0.02em' }}>{label}</div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>
      {children}
    </div>
  )
}

function Callout({ title, children, tone = 'info' }: { title: string; children: React.ReactNode; tone?: 'info' | 'warning' }) {
  const cfg = {
    info:    { bg: 'var(--info-dim)',    border: 'rgba(91,141,239,0.3)',  bar: 'var(--accent)' },
    warning: { bg: 'var(--warning-dim)', border: 'rgba(229,168,74,0.3)', bar: 'var(--warning)' },
  }[tone]
  return (
    <div style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 8,
      padding: '14px 16px 14px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: cfg.bar, borderRadius: '8px 0 0 8px' }} />
      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, fontSize: 13 }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

/* ─── signal layers table ────────────────────────────────────────── */
const signals = [
  {
    layer: 'IP Intelligence',
    signals: 'Geolocation, ASN, hosting provider, Tor/VPN/proxy detection, IP reputation score, datacenter flag',
    indicators: 'Data-center IPs, Tor exit nodes, known fraud IP ranges, IP–billing address mismatch',
    weight: 'high' as const,
  },
  {
    layer: 'Device Fingerprinting',
    signals: 'Browser fingerprint, OS, screen resolution, installed fonts, WebGL hash, cookie state, hardware concurrency',
    indicators: 'Headless browsers, fingerprint rotation, emulated devices, missing expected browser attributes',
    weight: 'high' as const,
  },
  {
    layer: 'Geolocation & Velocity',
    signals: 'GPS coordinates, IP-derived location, distance and time delta since last transaction (travel velocity)',
    indicators: 'Impossible travel (200 km in 10 min), first foreign transaction, location vs. billing address mismatch',
    weight: 'high' as const,
  },
  {
    layer: 'Behavioral Biometrics',
    signals: 'Typing cadence, keystroke intervals, mouse dynamics, touch pressure, session dwell time, scroll behavior',
    indicators: 'Bot-like uniformity, missing natural variance, scripted form fill, no mouse movement before submit',
    weight: 'medium' as const,
  },
  {
    layer: 'Transaction History',
    signals: 'Spending averages by category, merchant history, time-of-day patterns, frequency, amount distribution',
    indicators: 'Amount 3× 90-day average, new high-risk merchant category, transaction at 3 AM, sudden spend spike',
    weight: 'high' as const,
  },
  {
    layer: 'Merchant & Channel',
    signals: 'Merchant category code (MCC), merchant chargeback rate, card-not-present vs. POS vs. ATM channel',
    indicators: 'High-risk MCC (crypto, gambling, wire transfers), high-chargeback merchant, card-not-present',
    weight: 'medium' as const,
  },
  {
    layer: 'Card & Account State',
    signals: 'Card age, recent credential change, contact info update recency, account tenure, prior disputes',
    indicators: 'Card used within 24h of issue, password/address changed same day, account < 30 days old',
    weight: 'medium' as const,
  },
  {
    layer: 'Network Graph',
    signals: 'Shared device across accounts, shared IP with fraud accounts, link analysis across cardholder graph',
    indicators: 'Device previously used by confirmed fraudster, IP cluster linked to an active fraud ring',
    weight: 'high' as const,
  },
]

/* ─── decision thresholds ────────────────────────────────────────── */
const thresholds = [
  { score: '0 – 25',   level: 'Low',      action: 'Auto-approve',         ux: 'Transaction proceeds immediately — no friction', tone: 'success' as const },
  { score: '26 – 50',  level: 'Moderate', action: 'Approve + monitor',    ux: 'Approved; flagged for post-transaction review', tone: 'neutral' as const },
  { score: '51 – 70',  level: 'Elevated', action: 'Step-up auth',         ux: 'Triggers 3DS challenge, SMS OTP, or biometric', tone: 'medium' as const },
  { score: '71 – 85',  level: 'High',     action: 'Decline or hold',      ux: 'Declined; customer prompted to call the bank', tone: 'high' as const },
  { score: '86 – 100', level: 'Critical', action: 'Hard decline + alert', ux: 'Immediate decline; account flagged; possible freeze', tone: 'high' as const },
]

/* ─── ML models ──────────────────────────────────────────────────── */
const models = [
  {
    name: 'Gradient Boosted Trees',
    subtitle: 'XGBoost / LightGBM',
    desc: 'Fast, handles tabular signals well. Primary workhorse for amount, MCC, location, and velocity features. Low latency makes it ideal for real-time decisions.',
  },
  {
    name: 'Neural Networks',
    subtitle: 'LSTM / Transformer',
    desc: 'Models sequential transaction history and time-series behavioral patterns. Detects subtle drift over days or weeks that rule engines miss entirely.',
  },
  {
    name: 'Graph Neural Networks',
    subtitle: 'Node classification',
    desc: 'Traverses account–device–IP relationship graphs to surface fraud rings that appear completely normal in isolation but reveal patterns at the network level.',
  },
  {
    name: 'Rules Engine',
    subtitle: 'Hard + learned rules',
    desc: 'Deterministic rules layered on top of ML scores. Hard rules (CVV mismatch, blacklisted BIN ranges) always override model output regardless of score.',
  },
]

const features = [
  {
    name: 'Rolling aggregates',
    desc: 'Spend in last 1h, 24h, 7d, 30d; transaction count per merchant category; unique merchants per day.',
  },
  {
    name: 'Deviation scores',
    desc: 'Standard deviations from the cardholder\'s historical distribution for a given merchant category and amount.',
  },
  {
    name: 'Velocity features',
    desc: 'Transactions per hour, geographic distance since last transaction, unique IPs per session, device switches.',
  },
  {
    name: 'Entity embeddings',
    desc: 'Merchant, device, and user IDs encoded as dense vectors capturing behavioral similarity across the population.',
  },
]

const contextCards = [
  {
    title: 'Card-Present vs. Not-Present',
    body: 'Card-not-present (e-commerce) transactions carry 4–7× higher fraud rates than EMV chip card-present. Counterfeit card fraud is near-zero at POS; the attack surface has shifted almost entirely to CNP.',
  },
  {
    title: '3D Secure 2 (EMV 3DS)',
    body: 'Passes 100+ data elements to the card network in real time. Low-risk flows frictionlessly; elevated-risk triggers a challenge. Liability for authenticated transactions shifts from merchant to issuing bank.',
  },
  {
    title: 'Consortium Intelligence',
    body: 'Banks and card networks share anonymized fraud signals across all member institutions. A compromised card spotted at one issuer propagates across the full network (VisaNet, Mastercard Network) within minutes.',
  },
]

const standards = [
  'ISO 8583', 'EMV 3DS2', 'PCI-DSS', 'FIDO2 / WebAuthn',
  'NIST SP 800-63', 'Mastercard Decision Intelligence', 'Visa Advanced Authorization',
]

/* ─── tabs ───────────────────────────────────────────────────────── */
type Tab = 'signals' | 'models' | 'decision' | 'context' | 'threats'
const TABS: { id: Tab; label: string }[] = [
  { id: 'signals',  label: 'Signal Layers' },
  { id: 'models',   label: 'ML Pipeline' },
  { id: 'decision', label: 'Decision Framework' },
  { id: 'context',  label: 'Contextual Factors' },
  { id: 'threats',  label: 'Threat Vectors' },
]

/* ─── App ────────────────────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState<Tab>('signals')

  return (
    <div style={css.page}>
      {/* ── sticky header ── */}
      <header style={css.header}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
                Bank & AI Security Systems
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, margin: 0 }}>
                Transaction Risk Analysis
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, maxWidth: 560 }}>
                How AI and bank security systems evaluate every transaction — from signal ingestion to approve or decline — in under 300ms.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, minWidth: 380 }}>
              <Stat value="200+" label="Signals per txn" />
              <Stat value="~150ms" label="Decision latency" />
              <Stat value="0.1%" label="Fraud rate (avg)" tone="danger" />
              <Stat value="$33B" label="Prevented (US/yr)" tone="success" />
            </div>
          </div>

          {/* tab bar */}
          <div style={{ display: 'flex', gap: 2, marginTop: 24, borderBottom: '1px solid var(--border-subtle)' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 16px', fontSize: 13, fontWeight: 500,
                  color: tab === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                  marginBottom: -1,
                  fontFamily: 'var(--sans)',
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </header>

      {/* ── main content ── */}
      <main style={css.main}>
        {tab === 'signals'  && <SignalsTab />}
        {tab === 'models'   && <ModelsTab />}
        {tab === 'decision' && <DecisionTab />}
        {tab === 'context'  && <ContextTab />}
        {tab === 'threats'  && <ThreatsTab />}
      </main>
    </div>
  )
}

/* ─── Signal Layers tab ──────────────────────────────────────────── */
function SignalsTab() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>8 concurrent signal layers</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24, maxWidth: 680 }}>
        Every transaction is simultaneously scored across all layers below. Each layer contributes features to the upstream risk model — no single signal is dispositive on its own.
      </p>

      {/* table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Signal Layer', 'Key Signals Captured', 'Risk Indicators', 'ML Weight'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 3 ? 'center' : 'left',
                  padding: '10px 14px', fontWeight: 600, fontSize: 11,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {signals.map((s, i) => (
              <tr
                key={s.layer}
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: expanded === i ? 'var(--surface)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (expanded !== i) (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-raised)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = expanded === i ? 'var(--surface)' : 'transparent' }}
              >
                <td style={{ padding: '12px 14px', fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{s.layer}</td>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', maxWidth: 280 }}>
                  {expanded === i ? s.signals : s.signals.length > 70 ? s.signals.slice(0, 70) + '…' : s.signals}
                </td>
                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', maxWidth: 240 }}>
                  {expanded === i ? s.indicators : s.indicators.length > 60 ? s.indicators.slice(0, 60) + '…' : s.indicators}
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <Tag tone={s.weight}>{s.weight}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 10 }}>Click any row to expand details.</p>
    </div>
  )
}

/* ─── ML Pipeline tab ────────────────────────────────────────────── */
function ModelsTab() {
  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <SectionLabel>Ensemble model architecture</SectionLabel>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
            Modern fraud systems combine multiple model types — each capturing a different class of patterns — whose outputs are blended into a single risk score.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {models.map(m => (
              <div key={m.name} style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 8, padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{m.name}</span>
                  <span style={{
                    fontSize: 11, color: 'var(--accent)', background: 'var(--accent-dim)',
                    padding: '1px 7px', borderRadius: 4, fontFamily: 'var(--mono)',
                  }}>{m.subtitle}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Feature engineering</SectionLabel>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
            Raw signals are transformed into model-ready features before scoring. The quality of feature engineering matters more than model architecture.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {features.map(f => (
              <div key={f.name} style={{
                borderLeft: '2px solid var(--border)', paddingLeft: 16,
              }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>{f.name}</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <Callout title="Continuous Feedback Loop">
              Models retrain on a rolling basis — often daily. Every confirmed fraud case and every false positive becomes a labeled training example. Concept drift monitoring fires automated retraining when score distributions shift beyond a set threshold.
            </Callout>
          </div>
        </div>
      </div>

      {/* pipeline diagram */}
      <Divider />
      <SectionLabel>Scoring pipeline</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Signal ingestion', sub: '~10ms' },
          { label: 'Feature extraction', sub: '~20ms' },
          { label: 'Ensemble scoring', sub: '~80ms' },
          { label: 'Rules engine', sub: '~10ms' },
          { label: 'Threshold eval', sub: '~5ms' },
          { label: 'Approve / Decline', sub: '< 150ms total' },
        ].map((step, i, arr) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: i === arr.length - 1 ? 'var(--accent-dim)' : 'var(--surface)',
              border: `1px solid ${i === arr.length - 1 ? 'rgba(91,141,239,0.35)' : 'var(--border-subtle)'}`,
              borderRadius: 8, padding: '10px 14px', minWidth: 120, textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: i === arr.length - 1 ? 'var(--accent)' : 'var(--text-primary)' }}>{step.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, fontFamily: 'var(--mono)' }}>{step.sub}</div>
            </div>
            {i < arr.length - 1 && (
              <div style={{ color: 'var(--text-tertiary)', fontSize: 16, padding: '0 6px', userSelect: 'none' }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Decision Framework tab ─────────────────────────────────────── */
const BANDS = [
  {
    min: 0,   max: 25,  label: 'Low',      action: 'Auto-approve',         color: 'var(--success)',  dim: 'rgba(76,175,130,0.15)',
    icon: '✓',
    ux: 'Transaction proceeds with no friction. The customer sees a normal approval in < 1s.',
    triggers: ['Score below threshold', 'No hard-rule violations', 'Device and location consistent'],
    falseNeg: 'Low — most legitimate spend is here. ~0.02% of these are fraudulent.',
  },
  {
    min: 26,  max: 50,  label: 'Moderate', action: 'Approve + monitor',    color: '#6bbfa0',         dim: 'rgba(107,191,160,0.12)',
    icon: '◎',
    ux: 'Approved immediately. Transaction enters a post-auth review queue for a human analyst.',
    triggers: ['Slightly unusual merchant category', 'Moderate amount deviation', 'New device, known location'],
    falseNeg: 'Moderate — ~0.3% of transactions here turn out to be fraud.',
  },
  {
    min: 51,  max: 70,  label: 'Elevated', action: 'Step-up authentication', color: 'var(--warning)', dim: 'rgba(229,168,74,0.13)',
    icon: '⚠',
    ux: 'Payment paused. Customer receives a 3DS challenge, SMS OTP, or in-app biometric prompt.',
    triggers: ['New device + new location', 'Amount > 2× 90-day avg', 'CNP transaction with high-risk MCC'],
    falseNeg: 'Elevated — ~4% of these are genuine fraud caught by step-up auth.',
  },
  {
    min: 71,  max: 85,  label: 'High',     action: 'Decline + hold',        color: 'var(--danger)',   dim: 'rgba(224,92,106,0.12)',
    icon: '✕',
    ux: 'Transaction declined. Customer receives a push notification with a callback number.',
    triggers: ['Impossible travel velocity', 'Known fraud device/IP', 'Multiple failed attempts'],
    falseNeg: 'High — ~20% false positives; bank absorbs friction cost to prevent larger fraud losses.',
  },
  {
    min: 86,  max: 100, label: 'Critical', action: 'Hard decline + alert',  color: '#d94f5c',         dim: 'rgba(217,79,92,0.12)',
    icon: '⊗',
    ux: 'Hard decline. Fraud ops team alerted. Possible card suspension pending cardholder contact.',
    triggers: ['Blacklisted device or IP', 'Confirmed fraud pattern match', 'Linked to known fraud ring'],
    falseNeg: 'Very high confidence — < 5% false positives at this band.',
  },
]

const DIST = [
  { pct: 78, band: 0 },
  { pct: 14, band: 1 },
  { pct:  5, band: 2 },
  { pct:  2, band: 3 },
  { pct:  1, band: 4 },
]

function getBandIdx(score: number) {
  if (score <= 25) return 0
  if (score <= 50) return 1
  if (score <= 70) return 2
  if (score <= 85) return 3
  return 4
}

function DecisionTab() {
  const [score, setScore] = useState(18)
  const activeBand = BANDS[getBandIdx(score)]

  return (
    <div style={{ marginTop: 32 }}>

      {/* ── score simulator ── */}
      <SectionLabel>Interactive score simulator</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20, maxWidth: 640 }}>
        Drag the slider to any risk score and see the exact action the system takes, what the customer experiences, and what signals drove the score into that band.
      </p>

      {/* gradient bar */}
      <div style={{ position: 'relative', marginBottom: 8 }}>
        <div style={{
          height: 10, borderRadius: 6, overflow: 'hidden',
          display: 'flex',
        }}>
          {BANDS.map(b => (
            <div key={b.label} style={{ flex: b.max - b.min, background: b.color, opacity: 0.7 }} />
          ))}
        </div>
        {/* tick marks */}
        {[0, 25, 50, 70, 85, 100].map(v => (
          <div key={v} style={{
            position: 'absolute', top: 14, left: `${v}%`,
            transform: 'translateX(-50%)', fontSize: 10,
            color: 'var(--text-tertiary)', fontFamily: 'var(--mono)',
          }}>{v}</div>
        ))}
      </div>

      {/* slider */}
      <div style={{ marginTop: 22, marginBottom: 24 }}>
        <style>{`
          input[type=range].risk-slider { -webkit-appearance: none; width: 100%; height: 4px;
            background: transparent; outline: none; }
          input[type=range].risk-slider::-webkit-slider-runnable-track {
            height: 4px; border-radius: 2px; background: var(--border); }
          input[type=range].risk-slider::-webkit-slider-thumb {
            -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
            background: var(--text-primary); border: 3px solid var(--bg);
            margin-top: -8px; cursor: pointer; transition: transform 0.1s; }
          input[type=range].risk-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        `}</style>
        <input
          type="range" min={0} max={100} value={score}
          className="risk-slider"
          onChange={e => setScore(Number(e.target.value))}
        />
      </div>

      {/* active band detail */}
      <div style={{
        background: activeBand.dim,
        border: `1px solid ${activeBand.color}40`,
        borderRadius: 10, padding: '20px 24px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 24, marginBottom: 36,
        transition: 'background 0.25s, border-color 0.25s',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 700,
              color: activeBand.color, lineHeight: 1,
            }}>{score}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: activeBand.color }}>{activeBand.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>{activeBand.min}–{activeBand.max} band</div>
            </div>
          </div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>{activeBand.action}</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{activeBand.ux}</p>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>Typical triggers</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {activeBand.triggers.map(t => (
              <li key={t} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: activeBand.color, fontSize: 12, lineHeight: '18px', flexShrink: 0 }}>—</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>False positive exposure</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{activeBand.falseNeg}</p>
        </div>
      </div>

      <Divider />

      {/* ── two-column lower section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

        {/* all bands summary table */}
        <div>
          <SectionLabel>All risk bands at a glance</SectionLabel>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Score', 'Level', 'System action'].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i === 0 ? 'center' : 'left', padding: '8px 10px',
                    fontWeight: 600, fontSize: 11, letterSpacing: '0.07em',
                    textTransform: 'uppercase', color: 'var(--text-tertiary)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BANDS.map((b, i) => {
                const isActive = getBandIdx(score) === i
                return (
                  <tr
                    key={b.label}
                    onClick={() => setScore(Math.round((b.min + b.max) / 2))}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isActive ? b.dim : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '10px 10px', textAlign: 'center', fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, color: b.color }}>{b.min}–{b.max}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: b.color }}>
                        <span style={{ fontSize: 10 }}>{b.icon}</span> {b.label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 10px', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 500 : 400 }}>{b.action}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>Click a row to jump the simulator to that band.</p>
        </div>

        {/* distribution + tradeoff */}
        <div>
          <SectionLabel>Score distribution across portfolio</SectionLabel>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
            Approximate breakdown of transactions by risk band for a typical consumer card portfolio.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {DIST.map(d => {
              const b = BANDS[d.band]
              return (
                <div key={b.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{b.min}–{b.max} <span style={{ color: 'var(--text-tertiary)' }}>({b.label})</span></span>
                    <span style={{ fontFamily: 'var(--mono)', color: b.color, fontWeight: 600 }}>{d.pct}%</span>
                  </div>
                  <div style={{ background: 'var(--surface)', borderRadius: 3, height: 7, overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: b.color, borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </div>

          <Callout title="The Threshold Tuning Problem" tone="warning">
            Banks don't minimize fraud alone — they minimize <em>total loss</em>: fraud losses + friction-induced revenue loss. Tightening thresholds reduces fraud but causes false positives that drive customers to competitors. Every threshold is a business decision, not just a technical one.
          </Callout>
        </div>
      </div>

      <Divider />

      {/* ── decision flow ── */}
      <SectionLabel>Decision logic flow</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
        The ML score is one input. Hard rules can override the score at any point before a final decision is issued.
      </p>
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap' }}>
        {[
          { step: '1', label: 'Hard rule check', desc: 'Blacklisted BIN, CVV mismatch, velocity limit exceeded → instant decline regardless of score', critical: true },
          { step: '2', label: 'ML score eval', desc: 'Ensemble score compared against configured band thresholds', critical: false },
          { step: '3', label: 'Step-up gate', desc: 'Score 51–70: pause transaction and challenge the cardholder via 3DS or OTP', critical: false },
          { step: '4', label: 'Final action', desc: 'Approve, monitor, decline, or freeze based on combined rules + score outcome', critical: false },
        ].map((s, i, arr) => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
            <div style={{
              flex: 1, background: s.critical ? 'rgba(224,92,106,0.06)' : 'var(--surface)',
              border: `1px solid ${s.critical ? 'rgba(224,92,106,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: 8, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s.critical ? 'var(--danger)' : 'var(--accent)', color: '#fff',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{s.step}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
            {i < arr.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: 'var(--text-tertiary)', fontSize: 16, flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Contextual Factors tab ─────────────────────────────────────── */
function ContextTab() {
  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>Factors beyond the model score</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24, maxWidth: 680 }}>
        The ML score is one input. Several structural and ecosystem factors shape the final decision independent of what any individual model computes.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {contextCards.map(c => (
          <div key={c.title} style={{
            background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '18px 18px',
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 10 }}>{c.title}</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{c.body}</p>
          </div>
        ))}
      </div>

      <Divider />

      <SectionLabel>Underlying standards & infrastructure</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
        These standards and proprietary systems underpin real-world transaction risk infrastructure globally.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {standards.map(s => (
          <span key={s} style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '5px 12px', borderRadius: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
            fontFamily: 'var(--mono)',
          }}>{s}</span>
        ))}
      </div>

      <Divider />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Callout title="Regulatory Constraints">
          Fraud systems must balance detection with compliance obligations. GDPR, CCPA, and similar laws constrain how behavioral data is collected and retained. Banks cannot store raw biometric data indefinitely — signals must be aggregated or hashed.
        </Callout>
        <Callout title="Adversarial Adaptation">
          Fraudsters continuously probe and adapt to detection systems. Professional fraud rings run transactions to map bank decision boundaries, then specifically craft attacks to stay below detection thresholds — making model retraining frequency critical.
        </Callout>
      </div>
    </div>
  )
}

/* ─── Threat Vectors tab ─────────────────────────────────────────── */
const ATTACK_CATEGORIES = [
  {
    name: 'Synthetic Identity Fraud',
    severity: 'high' as const,
    prevalence: 'Most common',
    summary: 'Attackers combine a real SSN (often stolen from a child or deceased person) with fabricated name, DOB, and address to build a new "synthetic" identity. They spend months building credit history before busting out — maxing out all credit lines and disappearing.',
    howItBypassesAI: 'No prior fraud history exists for the synthetic identity. Behavioral signals look normal because the fraudster spends time acting like a legitimate customer. ML models trained on historical fraud patterns have no signal to latch onto.',
    countermeasures: [
      'SSN issuance date verification — SSN should postdate the applicant\'s date of birth',
      'Graph analysis linking synthetic identities by shared address, phone, or device',
      'Bust-out velocity detection: sudden spike in utilization across all products simultaneously',
      'Third-party identity verification against credit bureau thin-file and synthetic-ID flags',
    ],
  },
  {
    name: 'Account Takeover (ATO)',
    severity: 'high' as const,
    prevalence: 'Growing rapidly',
    summary: 'Criminals obtain valid credentials via phishing, credential stuffing (reusing leaked username/password pairs from data breaches), or purchasing them on darkweb markets. They log in as the real customer to make fraudulent transactions.',
    howItBypassesAI: 'Login comes from the victim\'s device or a trusted browser fingerprint. Behavioral biometrics may pass if the attacker has studied normal patterns. The account history is legitimate, so transaction patterns look familiar to the model.',
    countermeasures: [
      'Credential stuffing detection: rate-limiting and login velocity monitoring per IP',
      'Impossible travel detection on session login vs. last known device location',
      'Behavioral biometric mismatch scoring on typing and mouse patterns post-login',
      'Step-up re-authentication triggered when high-value actions occur after login',
    ],
  },
  {
    name: 'SIM Swapping',
    severity: 'high' as const,
    prevalence: 'Targeted attacks',
    summary: 'Attacker social-engineers a mobile carrier into porting the victim\'s phone number to a new SIM they control. This intercepts all SMS-based OTPs and 2FA codes, allowing them to bypass step-up authentication and password resets entirely.',
    howItBypassesAI: 'Once the SIM swap succeeds, the attacker receives the legitimate OTP the fraud system sends. The step-up auth challenge is completed correctly, so the system sees a passed challenge and approves — it cannot distinguish attacker from owner.',
    countermeasures: [
      'Real-time SIM swap alerts via carrier API (T-Mobile, AT&T, and others expose these)',
      'Block high-risk actions for 24–48h after any SIM change is detected on the account',
      'Push to app-based TOTP or FIDO2 passkeys as primary 2FA instead of SMS OTP',
      'Flag logins or high-value actions that arrive immediately after a SIM swap event',
    ],
  },
  {
    name: 'Device & Fingerprint Spoofing',
    severity: 'medium' as const,
    prevalence: 'Technically sophisticated',
    summary: 'Fraudsters use tools like FraudFox, Antidetect, or custom browser builds to spoof device fingerprints — fabricating realistic screen resolutions, font sets, WebGL hashes, and hardware concurrency values — to impersonate a trusted device profile.',
    howItBypassesAI: 'A well-crafted spoofed fingerprint passes device fingerprinting checks. Combined with a residential proxy IP (not a datacenter range) the session looks identical to a legitimate returning customer from the model\'s perspective.',
    countermeasures: [
      'Behavioral consistency scoring across sessions — does the device behave identically over time?',
      'Canvas fingerprinting and WebGL noise analysis to detect anti-fingerprint tooling',
      'Client-side integrity attestation and browser API consistency checks',
      'Statistical anomaly detection on fingerprint attribute distributions at the population level',
    ],
  },
  {
    name: 'Card Testing / BIN Attacks',
    severity: 'medium' as const,
    prevalence: 'Very common',
    summary: 'Fraudsters acquire stolen card numbers in bulk and run small automated transactions (often $0.00–$1.00 at low-friction merchants) to determine which cards are still active, before selling or using them for larger fraud.',
    howItBypassesAI: 'Tiny transactions fall below amount-deviation thresholds. Low-value merchants are not flagged as high-risk. When distributed across thousands of IPs, velocity looks normal per-source. Individual transactions appear completely benign in isolation.',
    countermeasures: [
      'Micro-transaction velocity: detect unusual clusters of sub-$1 authorizations per BIN range',
      'Merchant-level anomaly detection: sudden spike in declines or micro-transactions at one merchant',
      'CAPTCHA and advanced bot detection on card entry and checkout forms',
      'Network-wide BIN-level velocity signal sharing across all member issuers',
    ],
  },
  {
    name: 'Authorized Push Payment Fraud',
    severity: 'high' as const,
    prevalence: 'Fastest growing',
    summary: 'Fraudsters impersonate bank staff, government officials, or tech support to convince victims to willingly transfer funds. Because the real customer initiates the transaction, it looks fully authorized — all signals are genuine.',
    howItBypassesAI: 'The transaction is technically authorized by the real account holder. Device, location, and behavioral biometrics are all genuine. No transactional signal distinguishes a coerced payment from an intentional one — the deception happened entirely outside the bank\'s visibility.',
    countermeasures: [
      'Confirmation of Payee (CoP): verify recipient account name matches before completing transfer',
      'First-time recipient detection combined with high amount and scripted urgency patterns',
      'In-app friction: deliberate cooling-off delay with explicit "are you being pressured?" prompt',
      'Mandatory reimbursement liability rules (e.g. UK PSR) create financial incentive to detect APP fraud',
    ],
  },
  {
    name: 'Adversarial ML Probing',
    severity: 'medium' as const,
    prevalence: 'Emerging / advanced',
    summary: 'Sophisticated fraud rings probe the bank\'s ML model by running carefully crafted test transactions to map decision boundaries. They then design fraud patterns that deliberately stay just below detection thresholds — exploiting the model\'s learned weaknesses against it.',
    howItBypassesAI: 'By treating the fraud model as a black box and running thousands of small probing transactions, attackers can reconstruct approximate decision boundaries. They then craft transactions that consistently score just below the step-up threshold — repeating this at scale.',
    countermeasures: [
      'Score output perturbation: add calibrated noise to responses to prevent accurate boundary mapping',
      'Probing pattern detection: unusual cluster of near-threshold micro-transactions from new accounts',
      'High-frequency model retraining to shift decision boundaries before mapping completes',
      'Ensemble diversity: multiple heterogeneous models are significantly harder to simultaneously map',
    ],
  },
  {
    name: 'Insider Threats',
    severity: 'medium' as const,
    prevalence: 'Low volume, high impact',
    summary: 'Bank employees with access to fraud systems, customer data, or manual override capabilities abuse their position — selling customer data, approving fraudulent transactions, or suppressing alerts in exchange for payment.',
    howItBypassesAI: 'Insiders operate with legitimate credentials from a trusted internal network. No external signal is anomalous. They can directly manipulate data, suppress alerts, or access systems in ways that leave no external trace unless internal audit logging is robust.',
    countermeasures: [
      'Privileged access monitoring: log every override and suppression with full immutable audit trail',
      'Four-eyes principle on all high-value manual approvals — no single person can approve alone',
      'User and Entity Behavior Analytics (UEBA) on employee data access patterns',
      'Principle of least privilege: segment access so no single employee can both approve and suppress an alert',
    ],
  },
]

function ThreatsTab() {
  const [selected, setSelected] = useState<number>(0)
  const active = ATTACK_CATEGORIES[selected]

  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>How attackers circumvent fraud detection</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12, maxWidth: 700 }}>
        Understanding attack techniques is prerequisite to defending against them. Each method below exploits a specific gap in the signal layer or model architecture — and each has targeted countermeasures actively deployed by security teams.
      </p>
      <Callout tone="info" title="Defensive intent">
        This section exists to support security awareness and system hardening. Knowing how detection is bypassed is how defenders close the gaps. Fraud prevention is an adversarial discipline — the system is only as strong as its understanding of the attacker's playbook.
      </Callout>

      <div style={{ display: 'grid', gridTemplateColumns: '256px 1fr', gap: 24, marginTop: 28 }}>

        {/* left nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {ATTACK_CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setSelected(i)}
              style={{
                background: selected === i ? 'var(--surface)' : 'transparent',
                border: `1px solid ${selected === i ? 'var(--border)' : 'transparent'}`,
                borderRadius: 7, padding: '10px 14px', cursor: 'pointer',
                textAlign: 'left', fontFamily: 'var(--sans)',
                transition: 'background 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => { if (selected !== i) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-raised)' }}
              onMouseLeave={e => { if (selected !== i) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: selected === i ? 600 : 400, color: selected === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cat.name}</span>
                <Tag tone={cat.severity}>{cat.severity}</Tag>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{cat.prevalence}</div>
            </button>
          ))}
        </div>

        {/* right detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{active.name}</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Tag tone={active.severity}>{active.severity} severity</Tag>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{active.prevalence}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>How it works</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{active.summary}</p>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)' }} />

          <div style={{
            background: 'rgba(224,92,106,0.06)', border: '1px solid rgba(224,92,106,0.22)',
            borderRadius: 8, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--danger)', marginBottom: 8 }}>
              Why the fraud system misses it
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{active.howItBypassesAI}</p>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>
              Countermeasures & defenses
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {active.countermeasures.map((cm, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 7, padding: '10px 14px',
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'var(--success-dim)',
                    color: 'var(--success)', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <SectionLabel>Attack lifecycle — from recon to cashout</SectionLabel>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, maxWidth: 680 }}>
        Most large-scale fraud follows a recognizable lifecycle. Detecting at an early stage — before cashout — limits losses dramatically.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Stage', 'Attacker activity', 'Detection opportunity', 'Window'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '8px 12px', fontWeight: 600, fontSize: 11,
                letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['1. Reconnaissance', 'Purchase stolen card data or credentials; identify target banks and their friction levels', 'Dark web monitoring, BIN block lists, credential breach alerts', 'Days–weeks'],
            ['2. Probing',        'Run micro-transactions to test which cards are live and map model decision boundaries', 'Micro-transaction velocity per BIN; bot detection on card entry forms', 'Hours–days'],
            ['3. Positioning',    'Build synthetic identity credit history; warm up accounts; avoid triggering alerts', 'Thin-file checks; behavioral drift signals; graph link analysis over time', 'Weeks–months'],
            ['4. Exploitation',   'Execute high-value fraud: large purchases, cash advances, account transfers', 'Amount deviation; impossible travel; device anomaly; step-up auth challenge', 'Minutes–hours'],
            ['5. Cashout',        'Convert funds to gift cards, crypto, wire transfers, or mule accounts', 'Mule account detection; irreversible payment flags; Confirmation of Payee', 'Minutes'],
            ['6. Evasion',        'Rotate devices, IPs, and identities; probe for detection signals and adapt tactics', 'Adversarial probing detection; model drift monitoring; consortium signals', 'Ongoing'],
          ].map(([stage, activity, detection, window], i) => (
            <tr key={stage} style={{ borderBottom: '1px solid var(--border-subtle)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-raised)' }}>
              <td style={{ padding: '11px 12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{stage}</td>
              <td style={{ padding: '11px 12px', color: 'var(--text-secondary)' }}>{activity}</td>
              <td style={{ padding: '11px 12px', color: 'var(--success)', fontSize: 12 }}>{detection}</td>
              <td style={{ padding: '11px 12px', color: 'var(--text-tertiary)', fontFamily: 'var(--mono)', fontSize: 12, whiteSpace: 'nowrap' }}>{window}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Callout title="Shift Left: Detect Early, Lose Less" tone="info">
          Stopping fraud at Stage 2 (probing) costs almost nothing. Stopping it at Stage 5 (cashout) often means the funds are already gone — wire transfers and crypto conversions are frequently irreversible. Every hour earlier the detection fires, the lower the loss.
        </Callout>
        <Callout title="No System Is Perfect" tone="warning">
          Every countermeasure raises the attacker's cost and effort — but none are insurmountable. The goal is to make most targets not worth pursuing, not to achieve zero fraud. Fraud prevention is a continuous arms race requiring constant adaptation on both sides.
        </Callout>
      </div>
    </div>
  )
}
