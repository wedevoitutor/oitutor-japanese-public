import { useEffect, useMemo, useState } from 'react';
import { toHiragana, toKatakana } from 'wanakana';
import useSpeech from '../../hooks/useSpeech';
import { sumiTokens as t } from '../../lib/sumiTheme';
import { playCorrect, playWrong } from '../../lib/sounds';

const JP_CHAR = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
const KATAKANA_CHAR = /[\u30a0-\u30ff]/;
const LATIN_ONLY = /^[a-zA-Z\s-]+$/;
const SLOT = '[SLOT]';

const HANKO_GREEN = '#1f5f3a';
const HANKO_GREEN_DEEP = '#16452b';
const DEFAULT_SUMI_ACCENT = {
  light: t.lavender,
  mid: t.lavenderMid,
  accent: t.violet,
  deep: t.violetDeep,
  ink: t.violetInk,
};

function normalizeAnswer(value) {
  return value.trim().toLowerCase().replace(/[-_\s]+/g, '');
}

function detectScript(value) {
  if (!value) return 'empty';
  if (JP_CHAR.test(value)) return 'jp';
  if (LATIN_ONLY.test(value)) return 'latin';
  return 'mixed';
}

function convertRomajiPreview(value, expectedJapanese = '') {
  const cleaned = value.trim().replace(/[-_]+/g, '');
  if (!cleaned) return '';
  if (JP_CHAR.test(cleaned)) return cleaned;

  const compact = cleaned.replace(/\s+/g, ' ');
  const expectsKatakana = KATAKANA_CHAR.test(expectedJapanese) && !/[\u3040-\u309f]/.test(expectedJapanese);
  return expectsKatakana ? toKatakana(compact) : toHiragana(compact);
}

function HighlightedJapanese({ text }) {
  return (
    <span>
      {[...text].map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{
            display: char.trim() ? 'inline-block' : 'inline',
            background: char.trim() ? t.lavender : 'transparent',
            color: char.trim() ? t.violetDeep : t.ink,
            borderBottom: char.trim() ? `2px solid ${t.violet}` : 'none',
            padding: char.trim() ? '0 4px' : 0,
            margin: char.trim() ? '0 1px' : 0,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

function RomajiConversionBar({ input, expectedJapanese, correct }) {
  const converted = convertRomajiPreview(input, expectedJapanese);
  const label = KATAKANA_CHAR.test(expectedJapanese) && !/[\u3040-\u309f]/.test(expectedJapanese)
    ? 'katakana'
    : 'hiragana';

  return (
    <div style={{ display: 'grid', gap: 6, marginTop: 18 }}>
      {correct && expectedJapanese && (
        <div
          style={{
            border: `1px solid ${t.violet}`,
            background: t.cardCream,
            padding: '10px 14px',
            fontFamily: t.fontJP,
            fontSize: 18,
            color: t.ink,
            textAlign: 'center',
          }}
        >
          <HighlightedJapanese text={expectedJapanese} />
        </div>
      )}
      <div
        style={{
          border: `1px solid ${t.lavenderMid}`,
          background: t.lavender,
          padding: '9px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.violetInk, letterSpacing: '0.18em', textTransform: 'uppercase', minWidth: 78 }}>
          {label}
        </span>
        <span style={{ flex: 1, fontFamily: t.fontJP, fontSize: 18, color: converted ? t.violetDeep : t.inkFaint }}>
          {converted || 'Romaji conversion appears here'}
        </span>
      </div>
    </div>
  );
}

function extractSpeakable(cell) {
  if (typeof cell !== 'string' || !JP_CHAR.test(cell)) return null;
  const afterArrow = cell.includes('→') ? cell.split('→').pop() : cell;
  const beforeParen = afterArrow.split('(')[0].trim();
  const stripped = beforeParen.replace(/^["'\u201C\u2018]+|["'\u201D\u2019]+$/g, '').trim();
  return stripped && JP_CHAR.test(stripped) ? stripped : null;
}

function getKanjiMark(exercise) {
  if (exercise.type === 'reference-chart' || exercise.type === 'reading-practice') return '読';
  if (exercise.type === 'kanji-card') return exercise.kanji || '漢';
  if (exercise.type === 'flashcard') return '札';
  if (exercise.type === 'reading-explanation') return '訓';
  if (exercise.type === 'dialogue-scene') return '会';
  if (exercise.type === 'shadowing') return '声';
  if (exercise.type === 'response-selection') return '応';
  if (exercise.type === 'multiple-choice' && exercise.speakText) return '聴';
  if (exercise.type === 'multiple-choice' || exercise.type === 'comparison-cards' || exercise.type === 'matching') return '選';
  if (exercise.type === 'type-the-answer') return '書';
  return '問';
}

function WaveBg({ opacity = 0.22, stroke = t.violet }) {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }} aria-hidden>
      <defs>
        <pattern id="sumi-murasaki-wave" x="0" y="0" width="36" height="18" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={stroke} strokeWidth="0.6">
            <circle cx="0" cy="18" r="16" /><circle cx="0" cy="18" r="11" /><circle cx="0" cy="18" r="6" />
            <circle cx="36" cy="18" r="16" /><circle cx="36" cy="18" r="11" /><circle cx="36" cy="18" r="6" />
            <circle cx="18" cy="0" r="16" /><circle cx="18" cy="0" r="11" /><circle cx="18" cy="0" r="6" />
            <circle cx="18" cy="36" r="16" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sumi-murasaki-wave)" />
    </svg>
  );
}

function VerticalLabel({ children, color = t.violetInk, size = 10 }) {
  return (
    <div
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontFamily: t.fontMono,
        fontSize: size,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function Chev({ dir, disabled, onClick, accent = DEFAULT_SUMI_ACCENT }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        background: accent.deep,
        color: '#fff',
        border: `1px solid ${accent.deep}`,
        fontFamily: t.fontJP,
        fontSize: 16,
        lineHeight: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 1px 2px ${accent.shadow || 'rgba(109,40,217,0.35)'}, inset 0 1px 0 rgba(255,255,255,0.18)`,
        opacity: disabled ? 0.38 : 1,
        padding: 0,
      }}
      aria-label={dir === 'left' ? 'Previous exercise' : 'Next exercise'}
    >
      {dir === 'left' ? '‹' : '›'}
    </button>
  );
}

function Shell({
  current,
  total,
  kanjiMark,
  lessonLabel = 'Bunpō · Lesson 01',
  headerKanji = '文法',
  headerMeta = 'Grammar 01 · Pronouns & Demonstratives',
  accent = DEFAULT_SUMI_ACCENT,
  onBack,
  onForward,
  canBack,
  canForward,
  children,
}) {
  const progress = (current / total) * 100;
  const a = { ...DEFAULT_SUMI_ACCENT, ...accent };

  return (
    <div
      style={{
        minHeight: 680,
        background: t.paper,
        color: t.ink,
        fontFamily: t.fontUI,
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '52px 1fr',
        border: `1px solid ${t.rule}`,
        boxShadow: '0 18px 45px rgba(26,22,19,0.12)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 0,
          backgroundImage:
            'radial-gradient(rgba(120,90,60,0.05) 1px, transparent 1px), radial-gradient(rgba(120,90,60,0.04) 1px, transparent 1px)',
          backgroundSize: '3px 3px, 7px 7px',
          backgroundPosition: '0 0, 1px 2px',
        }}
      />

      <aside
        style={{
          position: 'relative',
          background: a.light,
          borderRight: `1px solid ${a.mid}`,
          boxShadow: 'inset -1px 0 0 rgba(124,58,237,0.08)',
          zIndex: 1,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><WaveBg stroke={a.accent} /></div>
        <div style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: t.fontJP, fontSize: 26, color: a.deep, writingMode: 'vertical-rl', fontWeight: 600, letterSpacing: '0.05em' }}>
            {kanjiMark}
          </div>
        </div>
        <div style={{ position: 'absolute', top: 78, left: '50%', transform: 'translateX(-50%)', width: 14, height: 1, background: a.accent, opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 94, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <VerticalLabel>{lessonLabel}</VerticalLabel>
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <VerticalLabel color={a.deep}>{String(current).padStart(2, '0')} / {total}</VerticalLabel>
        </div>
      </aside>

      <main style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 4, background: t.ink }} />
        <header style={{ padding: '16px 30px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${t.rule}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: t.fontJP, fontSize: 22, fontWeight: 500, letterSpacing: '0.04em' }}>{headerKanji}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: t.inkFaint }}>
              {headerMeta}
            </span>
          </div>
          <span style={{ fontFamily: t.fontMono, fontSize: 11, color: a.deep, letterSpacing: '0.1em', fontWeight: 600 }}>
            {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </header>

        <div style={{ padding: '14px 30px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Chev dir="left" onClick={onBack} disabled={!canBack} accent={a} />
            <div style={{ flex: 1, position: 'relative', height: 12 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 5, height: 1, background: t.rule }} />
              <div style={{ position: 'absolute', left: 0, top: 5, height: 1, background: a.accent, width: `${progress}%` }} />
              {Array.from({ length: Math.floor(total / 5) + 1 }).map((_, i) => {
                const step = i * 5;
                return (
                  <div
                    key={step}
                    style={{
                      position: 'absolute',
                      left: `${(step / total) * 100}%`,
                      top: 0,
                      width: 1,
                      height: 11,
                      background: step <= current ? a.accent : t.rule,
                    }}
                  />
                );
              })}
              <div
                style={{
                  position: 'absolute',
                  left: `${progress}%`,
                  top: -2,
                  transform: 'translateX(-50%)',
                  width: 12,
                  height: 12,
                  borderRadius: 0,
                  background: a.accent,
                  border: `1px solid ${a.deep}`,
                  boxShadow: `0 1px 2px ${a.shadow || 'rgba(109,40,217,0.35)'}`,
                }}
              />
            </div>
            <Chev dir="right" onClick={onForward} disabled={!canForward} accent={a} />
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: a.deep, minWidth: 52, textAlign: 'right', fontWeight: 600 }}>
              {current} / {total}
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', padding: '14px 30px 26px' }}>{children}</div>
      </main>
    </div>
  );
}

function Button({ children, variant = 'primary', onClick, disabled = false }) {
  const primary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: t.fontUI,
        fontSize: 13,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '11px 22px',
        border: `1.5px solid ${t.ink}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        background: primary ? t.ink : 'transparent',
        color: primary ? t.paper : t.ink,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Prompt({ kanji = '問', children }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', margin: '6px 0 18px' }}>
      <span style={{ fontFamily: t.fontJP, fontSize: 18, color: t.vermilion, lineHeight: 1.2, marginTop: 2 }}>{kanji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: t.inkFaint, textTransform: 'uppercase', marginBottom: 4 }}>Question</div>
        <div style={{ fontFamily: t.fontUI, fontSize: 16, fontWeight: 500, color: t.ink, lineHeight: 1.4 }}>{children}</div>
      </div>
    </div>
  );
}

function Hanko({ size = 34 }) {
  return (
    <div
      style={{
        width: size,
        height: size + 2,
        borderRadius: '50%',
        background: HANKO_GREEN,
        color: '#fdf3d9',
        border: `2px solid ${HANKO_GREEN_DEEP}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: t.fontJP,
        fontWeight: 600,
        fontSize: size * 0.55,
        transform: 'rotate(-4deg)',
        boxShadow: 'inset 0 0 0 2px rgba(253,243,217,0.24), 0 2px 5px rgba(22,69,43,0.24)',
      }}
    >
      正
    </div>
  );
}

function CorrectStamp() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
      <Hanko />
      <div>
        <div style={{ fontFamily: t.fontJP, fontSize: 18, color: HANKO_GREEN, fontWeight: 600 }}>正解</div>
        <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.inkFaint, textTransform: 'uppercase' }}>Correct · seikai</div>
      </div>
    </div>
  );
}

function SpeakButton({ text, size = 28 }) {
  const { speak, supported } = useSpeech();
  if (!supported || !text) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `1px solid ${t.ink}`,
        background: t.paper,
        color: t.ink,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        flex: '0 0 auto',
      }}
      aria-label="Play audio"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor" />
        <path d="M16 8c1.5 1 2.5 2.5 2.5 4s-1 3-2.5 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function AudioCluster({ text, autoPlay = true }) {
  const { speak, supported, ready } = useSpeech();
  const [pressed, setPressed] = useState(false);
  const [slowPressed, setSlowPressed] = useState(false);
  const [slowHover, setSlowHover] = useState(false);

  useEffect(() => {
    if (autoPlay && supported && ready && text) speak(text);
  }, [autoPlay, ready, speak, supported, text]);

  if (!supported || !text) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', margin: '14px 0 24px' }}>
      <button
        type="button"
        onClick={() => speak(text)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          width: 112,
          height: 112,
          background: pressed ? t.violetDeep : '#7d5fd8',
          border: `3px solid ${t.violetDeep}`,
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          position: 'relative',
          color: t.cardCream,
          boxShadow: pressed ? `1px 1px 0 0 ${t.lavenderMid}` : `4px 4px 0 0 ${t.lavenderMid}`,
          transform: pressed ? 'translate(3px, 3px)' : 'translate(0, 0)',
          transition: 'transform .12s ease, box-shadow .12s ease, background .12s ease',
        }}
        aria-label="Play audio"
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 4,
            border: '1px dashed rgba(255,255,255,0.35)',
            borderRadius: 3,
            pointerEvents: 'none',
          }}
        />
        <span style={{ fontFamily: t.fontJP, fontSize: 28, fontWeight: 700, lineHeight: 1, letterSpacing: '0.02em', position: 'relative' }}>聴</span>
        <span style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.85, position: 'relative' }}>Play</span>
      </button>
      <div style={{ width: 1, height: 54, background: t.rule }} />
      <button
        type="button"
        onClick={() => speak(text, { rate: 0.6 })}
        onMouseDown={() => setSlowPressed(true)}
        onMouseUp={() => setSlowPressed(false)}
        onMouseLeave={() => {
          setSlowPressed(false);
          setSlowHover(false);
        }}
        onMouseEnter={() => setSlowHover(true)}
        style={{
          width: 104,
          height: 104,
          borderRadius: '50%',
          background: slowPressed ? t.violetDeep : '#7d5fd8',
          border: `3px solid ${t.violetDeep}`,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          color: t.cardCream,
          position: 'relative',
          boxShadow: slowPressed ? `1px 1px 0 0 ${t.lavenderMid}` : `4px 4px 0 0 ${t.lavenderMid}`,
          transform: slowPressed ? 'translate(3px, 3px)' : slowHover ? 'translate(-1px, -1px)' : 'translate(0, 0)',
          transition: 'transform .12s ease, box-shadow .12s ease, background .12s ease',
        }}
        aria-label="Play slower"
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 5,
            border: '1px dashed rgba(255,255,255,0.4)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <span style={{ fontFamily: t.fontJP, fontSize: 24, fontWeight: 700, lineHeight: 1, position: 'relative' }}>遅</span>
        <span style={{ fontFamily: t.fontMono, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.85, position: 'relative' }}>Slower</span>
      </button>
    </div>
  );
}

function optionStyle(selected, checked, correct) {
  let border = t.rule;
  let background = t.lavender;
  if (selected && !checked) border = t.violet;
  if (checked && correct) {
    border = t.correct;
    background = '#edf7ed';
  } else if (checked && selected && !correct) {
    border = t.vermilion;
    background = '#fff0ee';
  }
  return {
    border: `1px solid ${border}`,
    background,
    textAlign: 'left',
    padding: '15px 20px',
    cursor: checked ? 'default' : 'pointer',
    fontFamily: t.fontUI,
    fontSize: 15,
    color: t.ink,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'border-color .15s, background .15s',
  };
}

function optionLabel(option) {
  if (typeof option === 'string') return option;
  return option?.text || option?.jp || option?.kana || '';
}

function correctIndexForOptions(options = [], fallback) {
  const objectIndex = options.findIndex((option) => typeof option === 'object' && option?.correct);
  return objectIndex >= 0 ? objectIndex : fallback;
}

function wrongHintText(option) {
  return option?.wrongExplanation || option?.distractorReason || '';
}

function WrongHint({ option }) {
  const hint = wrongHintText(option);
  if (!hint) return null;
  return (
    <div style={{ marginTop: 12, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13, lineHeight: 1.45 }}>
      {hint}
    </div>
  );
}

function ReferenceChart({ exercise, onComplete }) {
  const [header, ...body] = exercise.rows || [];
  const isKanjiOrientation = header?.[0] === 'Kanji' && header?.includes('On-yomi');
  const isDialogueRegisterChart = header?.[0] === 'Register' && header?.includes('Typical Response');
  const [activeRegister, setActiveRegister] = useState('FORMAL');
  const [activeDialogueRow, setActiveDialogueRow] = useState(0);
  const registerGroups = isDialogueRegisterChart
    ? body.reduce((groups, row) => {
        const key = row[0] || 'OTHER';
        return { ...groups, [key]: [...(groups[key] || []), row] };
      }, {})
    : {};
  const registerColors = {
    FORMAL: { border: '#4f46e5', bg: '#eef2ff', ink: '#3730a3' },
    CASUAL: { border: '#14b8a6', bg: '#f0fdfa', ink: '#0f766e' },
    SLANG: { border: '#db2777', bg: '#fdf2f8', ink: '#be185d' },
  };

  return (
    <div>
      <div style={{ textAlign: 'left', margin: '4px 0 22px' }}>
        <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: t.vermilion, textTransform: 'uppercase', marginBottom: 6 }}>Lesson</div>
        <div style={{ fontFamily: t.fontJP, fontSize: 34, fontWeight: 600, lineHeight: 1.1, color: t.ink }}>{exercise.title}</div>
      </div>
      {exercise.intro && <p style={{ fontSize: 13.5, color: t.inkSoft, lineHeight: 1.65, maxWidth: 540, marginBottom: 18 }}>{exercise.intro}</p>}

      {isDialogueRegisterChart ? (
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {['FORMAL', 'CASUAL', 'SLANG'].map((register) => {
              const color = registerColors.CASUAL;
              const active = activeRegister === register;
              return (
                <button
                  key={register}
                  type="button"
                  onClick={() => {
                    setActiveRegister(register);
                    setActiveDialogueRow(0);
                  }}
                  style={{
                    border: `1.5px solid ${active ? color.border : t.rule}`,
                    background: active ? color.bg : 'transparent',
                    color: active ? color.ink : t.inkSoft,
                    padding: '10px 8px',
                    fontFamily: t.fontMono,
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: active ? `3px 3px 0 ${t.rule}` : 'none',
                  }}
                >
                  {register}
                </button>
              );
            })}
          </div>

          {Object.entries(registerGroups).filter(([register]) => register === activeRegister).map(([register, rows]) => {
            const color = registerColors.CASUAL;
            const cardColor = registerColors.CASUAL;
            const safeIdx = Math.min(activeDialogueRow, rows.length - 1);
            const row = rows[safeIdx] || rows[0];
            const prevPair = () => setActiveDialogueRow((idx) => Math.max(0, idx - 1));
            const nextPair = () => setActiveDialogueRow((idx) => Math.min(rows.length - 1, idx + 1));
            return (
              <section key={register} style={{ border: `1px solid ${color.border}`, background: t.cardCream }}>
                <div style={{ padding: '10px 14px', borderBottom: `1px solid ${t.rule}`, background: cardColor.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: cardColor.ink, textTransform: 'uppercase', fontWeight: 700 }}>{register}</span>
                  <span style={{ fontFamily: t.fontMono, fontSize: 11, color: cardColor.ink, fontWeight: 700 }}>{safeIdx + 1} / {rows.length}</span>
                </div>
                {row && (
                  <div style={{ padding: '16px 16px 14px', display: 'grid', gap: 14 }}>
                    <div style={{ display: 'grid', gap: 10 }}>
                      <div style={{ border: `1px solid ${t.ink}`, background: t.paper, padding: '14px 16px' }}>
                        <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.inkFaint, textTransform: 'uppercase', marginBottom: 8 }}>They say</div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                          <div>
                            <div style={{ fontFamily: t.fontJP, fontSize: 26, color: t.ink, fontWeight: 700, lineHeight: 1.35 }}>{row[1]}</div>
                            <div style={{ fontFamily: t.fontMono, fontSize: 12, color: t.inkFaint, marginTop: 5 }}>{row[2]}</div>
                          </div>
                          <SpeakButton text={row[1]} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                        <span style={{ height: 1, flex: 1, background: t.rule }} />
                        <span style={{ fontFamily: t.fontJP, color: cardColor.ink, fontSize: 18, fontWeight: 700 }}>返</span>
                        <span style={{ height: 1, flex: 1, background: t.rule }} />
                      </div>

                      <div style={{ border: `1px solid ${cardColor.border}`, background: cardColor.bg, padding: '14px 16px' }}>
                        <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: cardColor.ink, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>You answer</div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                          <div>
                            <div style={{ fontFamily: t.fontJP, fontSize: 22, color: t.ink, fontWeight: 700, lineHeight: 1.4 }}>{row[3]}</div>
                            <div style={{ fontSize: 12.5, color: t.inkSoft, marginTop: 8, lineHeight: 1.55 }}>{row[4]}</div>
                          </div>
                          <SpeakButton text={row[3]} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <Chev dir="left" onClick={prevPair} disabled={safeIdx === 0} accent={{ accent: cardColor.border, deep: cardColor.ink, shadow: 'rgba(20,184,166,0.28)' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {rows.map((item, i) => (
                          <button
                            key={`${item[1]}-${i}`}
                            type="button"
                            onClick={() => setActiveDialogueRow(i)}
                            aria-label={`${register} expression ${i + 1}`}
                            style={{
                              width: i === safeIdx ? 22 : 8,
                              height: 8,
                              border: 0,
                              borderRadius: 0,
                              background: i === safeIdx ? cardColor.border : t.rule,
                              cursor: 'pointer',
                              transition: 'width .15s ease, background .15s ease',
                            }}
                          />
                        ))}
                      </div>
                      <Chev dir="right" onClick={nextPair} disabled={safeIdx === rows.length - 1} accent={{ accent: cardColor.border, deep: cardColor.ink, shadow: 'rgba(20,184,166,0.28)' }} />
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : isKanjiOrientation ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {body.map((row) => (
            <div key={row[0]} style={{ border: `1px solid ${t.ink}`, background: t.cardCream, padding: '14px 16px', display: 'grid', gridTemplateColumns: '74px 1fr', gap: 14, alignItems: 'center' }}>
              <div style={{ display: 'grid', placeItems: 'center', borderRight: `1px solid ${t.rule}`, paddingRight: 12 }}>
                <div style={{ fontFamily: t.fontJP, fontSize: 42, lineHeight: 1, color: t.ink, fontWeight: 700 }}>{row[0]}</div>
                <SpeakButton text={row[0]} size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>{row[1]}</div>
                  <div style={{ fontSize: 12, color: t.violetDeep, fontStyle: 'italic' }}>{row[4]}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 10 }}>
                  <div style={{ borderTop: `1px dashed ${t.rule}`, paddingTop: 8 }}>
                    <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: '0.18em', color: t.inkFaint, textTransform: 'uppercase' }}>On-yomi</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <span style={{ fontFamily: t.fontJP, fontSize: 18, color: t.ink }}>{row[2]}</span>
                      {extractSpeakable(row[2]) && <SpeakButton text={extractSpeakable(row[2])} size={18} />}
                    </div>
                  </div>
                  <div style={{ borderTop: `1px dashed ${t.rule}`, paddingTop: 8 }}>
                    <div style={{ fontFamily: t.fontMono, fontSize: 9, letterSpacing: '0.18em', color: t.inkFaint, textTransform: 'uppercase' }}>Kun-yomi</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <span style={{ fontFamily: t.fontJP, fontSize: 18, color: t.ink }}>{row[3]}</span>
                      {extractSpeakable(row[3]) && <SpeakButton text={extractSpeakable(row[3])} size={18} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ border: `1px solid ${t.ink}`, background: t.cardCream, overflowX: 'auto' }}>
          {header && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${header.length}, minmax(120px, 1fr))`, fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.inkFaint, padding: '10px 16px', borderBottom: `1px solid ${t.rule}`, minWidth: header.length * 130 }}>
              {header.map((cell, i) => <span key={i}>{cell}</span>)}
            </div>
          )}
          {body.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${row.length}, minmax(120px, 1fr))`, alignItems: 'center', padding: '9px 16px', borderBottom: i < body.length - 1 ? `1px dashed ${t.rule}` : 'none', fontSize: 13, minWidth: row.length * 130 }}>
              {row.map((cell, j) => (
                <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, color: t.ink }}>
                  <span style={{ fontFamily: j === 0 && JP_CHAR.test(cell) ? t.fontJP : j === 1 ? t.fontMono : t.fontUI, fontSize: j === 0 && JP_CHAR.test(cell) ? 16 : 13, color: j === 1 ? t.inkSoft : t.ink }}>{cell}</span>
                  {extractSpeakable(cell) && <SpeakButton text={extractSpeakable(cell)} size={20} />}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {exercise.takeaway && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, margin: '18px 0 0', padding: '10px 14px', borderLeft: `3px solid ${t.vermilion}`, background: 'transparent' }}>
          <span style={{ fontFamily: t.fontJP, fontSize: 13, color: t.vermilion, fontWeight: 600, letterSpacing: '0.1em' }}>要点</span>
          <span style={{ fontSize: 13, color: t.inkSoft, lineHeight: 1.5 }}>{exercise.takeaway}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>
      </div>
    </div>
  );
}

function renderPattern(parts, value, slotStyle) {
  return parts.map((piece, i) => (piece === SLOT ? <span key={i} style={slotStyle}>{value || '＿＿＿'}</span> : <span key={i}>{piece}</span>));
}

function FormulaFill({ exercise, onComplete }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { slot = {} } = exercise;
  const isTapSet = exercise.inputMode === 'kanji-tap-set' || exercise.strictness === 'kanji-select';
  const tapOptions = slot.options || [];
  const tapCorrectIndex = correctIndexForOptions(tapOptions, slot.correctIndex);

  const accepts = [slot.answer, slot.answerRomaji, ...(slot.acceptAlternatives || [])].filter(Boolean).map(normalizeAnswer);
  const trimmed = input.trim();
  const isTypedMatch = trimmed.length > 0 && accepts.includes(normalizeAnswer(trimmed));
  const isTapMatch = selectedOption !== null && selectedOption === tapCorrectIndex;
  const isMatch = isTapSet ? isTapMatch : isTypedMatch;
  const script = detectScript(trimmed);
  const selectedTapLabel = selectedOption !== null ? optionLabel(tapOptions[selectedOption]) : '';
  const jpValue = isTapSet ? selectedTapLabel : script === 'jp' ? trimmed : isMatch ? slot.answer : '';
  const romValue = isTapSet ? '' : script === 'latin' ? trimmed : isMatch ? slot.answerRomaji : '';

  const check = () => {
    setFeedback(isMatch ? 'correct' : 'incorrect');
    if (isMatch) playCorrect();
    else playWrong();
  };

  return (
    <div>
      <Prompt>{exercise.prompt}</Prompt>
      <div style={{ border: `1px solid ${t.ink}`, padding: '26px 28px', background: t.cardCream, position: 'relative' }}>
        {exercise.speakText && feedback === 'correct' && <div style={{ position: 'absolute', top: 10, right: 12 }}><SpeakButton text={exercise.speakText} /></div>}
        <div style={{ fontFamily: t.fontJP, fontSize: 28, letterSpacing: '0.04em', textAlign: 'center', marginBottom: 8 }}>
          {renderPattern(exercise.patternJp || [], jpValue, { display: 'inline-block', borderBottom: `2px solid ${t.violet}`, background: t.lavender, minWidth: 80, color: t.violetDeep, textAlign: 'center', padding: '0 8px', margin: '0 4px' })}
        </div>
        <div style={{ fontFamily: t.fontMono, fontSize: 12, color: t.inkFaint, textAlign: 'center' }}>
          {renderPattern(exercise.patternRom || [], romValue, { display: 'inline-block', borderBottom: `1px solid ${t.violet}`, minWidth: 60, color: t.violetDeep, textAlign: 'center', padding: '0 4px', margin: '0 3px' })}
        </div>
        {exercise.translation && <div style={{ borderTop: `1px dashed ${t.rule}`, marginTop: 14, paddingTop: 10, fontSize: 12, color: t.inkSoft, textAlign: 'center', fontStyle: 'italic' }}>→ {exercise.translation}</div>}
      </div>

      {isTapSet ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 9, marginTop: 18 }}>
          {tapOptions.map((option, i) => {
            const label = optionLabel(option);
            return (
              <button
                key={`${label}-${i}`}
                type="button"
                onClick={() => {
                  if (!feedback || feedback === 'incorrect') {
                    setSelectedOption(i);
                    setFeedback(null);
                  }
                }}
                style={{ ...optionStyle(selectedOption === i, !!feedback, feedback === 'correct' && i === tapCorrectIndex), justifyContent: 'center', fontFamily: t.fontJP, fontSize: 28, fontWeight: 700 }}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <RomajiConversionBar
            input={input}
            expectedJapanese={slot.answer || ''}
            correct={isMatch}
          />

          <div style={{ marginTop: 18, border: `1.5px solid ${t.ink}`, background: t.paper, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.2em', textTransform: 'uppercase' }}>答</span>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setFeedback(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && check()}
              placeholder="Type your answer..."
              autoFocus
              style={{ flex: 1, fontFamily: t.fontJP, fontSize: 16, color: t.ink, background: 'transparent', border: 0, outline: 'none' }}
            />
            <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.1em' }}>A ↵</span>
          </div>
        </>
      )}

      {showTip && slot.hint && <div style={{ margin: '12px auto 0', maxWidth: 480, fontSize: 12, color: t.inkSoft, borderLeft: `3px solid ${t.vermilion}`, padding: '8px 12px' }}>{slot.hint}</div>}
      {feedback === 'correct' && <CorrectStamp />}
      {feedback === 'incorrect' && <div style={{ marginTop: 14, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13 }}>Try again.</div>}
      {feedback === 'incorrect' && isTapSet && <WrongHint option={tapOptions[selectedOption]} />}

      {feedback === 'correct' ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
          <Button onClick={check} disabled={isTapSet && selectedOption === null}>{feedback === 'incorrect' ? 'Try Again' : 'Check'}</Button>
          {!showTip && slot.hint && <Button variant="ghost" onClick={() => setShowTip(true)}>Show Tip</Button>}
        </div>
      )}
    </div>
  );
}

function MultipleChoice({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const correctIndex = correctIndexForOptions(exercise.options, exercise.correctIndex);
  const selectedOption = selected !== null ? exercise.options?.[selected] : null;
  const isCorrect = selected === correctIndex;
  const check = () => {
    setChecked(true);
    if (isCorrect) playCorrect();
    else playWrong();
  };

  return (
    <div>
      <Prompt kanji={exercise.speakText ? '聴' : '選'}>{exercise.prompt}</Prompt>
      {exercise.speakText && <AudioCluster text={exercise.speakText} />}
      <div style={{ display: 'grid', gap: 9 }}>
        {(exercise.options || []).map((option, i) => {
          const label = optionLabel(option);
          const isKanjiOption = JP_CHAR.test(label) && label.length <= 3;
          return (
            <button
              key={`${label}-${i}`}
              type="button"
              onClick={() => !checked && setSelected(i)}
              onMouseEnter={(e) => {
                if (!checked) e.currentTarget.style.borderColor = t.violet;
              }}
              onMouseLeave={(e) => {
                if (!checked && selected !== i) e.currentTarget.style.borderColor = t.rule;
              }}
              style={optionStyle(selected === i, checked, checked && isCorrect && i === correctIndex)}
            >
              <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, letterSpacing: '0.1em', width: 20, fontWeight: 600 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1, fontFamily: isKanjiOption ? t.fontJP : t.fontUI, fontSize: isKanjiOption ? 24 : 15, fontWeight: isKanjiOption ? 700 : 400 }}>{label}</span>
            </button>
          );
        })}
      </div>
      {checked && isCorrect && <CorrectStamp />}
      {checked && !isCorrect && <div style={{ marginTop: 14, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13 }}>Try again.</div>}
      {checked && !isCorrect && <WrongHint option={selectedOption} />}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        {!checked && selected !== null && <Button onClick={check}>Check</Button>}
        {checked && !isCorrect && <Button onClick={() => { setSelected(null); setChecked(false); }}>Try Again</Button>}
        {checked && isCorrect && <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>}
      </div>
    </div>
  );
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ComparisonCards({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const variants = useMemo(() => shuffle(exercise.variants || []), [exercise.variants]);
  const revealed = checked && selected !== null && variants[selected]?.correct;
  const wrong = checked && selected !== null && !variants[selected]?.correct;
  const check = () => {
    const correct = !!variants[selected]?.correct;
    setChecked(true);
    if (correct) playCorrect();
    else playWrong();
  };

  return (
    <div>
      {exercise.title && <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: t.vermilion, textTransform: 'uppercase', marginBottom: 10 }}>{exercise.title}</div>}
      <Prompt kanji="選">{exercise.prompt}</Prompt>
      <div style={{ display: 'grid', gap: 10 }}>
        {variants.map((variant, i) => {
          const isSelected = selected === i;
          const isCorrectVariant = !!variant.correct;
          return (
            <button
              key={`${variant.jp}-${i}`}
              type="button"
              disabled={revealed}
              onClick={() => {
                if (!revealed) {
                  setSelected(i);
                  setChecked(false);
                }
              }}
              style={{ ...optionStyle(isSelected, revealed || wrong, isCorrectVariant), alignItems: 'flex-start' }}
            >
              <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, letterSpacing: '0.1em', width: 20, fontWeight: 600 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontFamily: t.fontJP, fontSize: 20, color: t.ink }}>{variant.jp}</span>
                <span style={{ display: 'block', fontFamily: t.fontMono, fontSize: 12, color: t.inkSoft, marginTop: 3 }}>{variant.romaji}</span>
                {revealed && <span style={{ display: 'block', fontSize: 12, color: t.inkSoft, marginTop: 4 }}>{variant.en}</span>}
                {(revealed || (wrong && isSelected)) && variant.note && <span style={{ display: 'block', fontSize: 12, color: t.inkSoft, marginTop: 8, borderLeft: `3px solid ${variant.correct ? t.correct : t.rule}`, paddingLeft: 10 }}>{variant.note}</span>}
                {wrong && isSelected && wrongHintText(variant) && <span style={{ display: 'block', fontSize: 12, color: t.vermilion, marginTop: 8, borderLeft: `3px solid ${t.vermilion}`, paddingLeft: 10 }}>{wrongHintText(variant)}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {wrong && <div style={{ marginTop: 14, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13 }}>Try again.</div>}
      {revealed && (
        <>
          <CorrectStamp />
          {exercise.takeaway && <div style={{ margin: '16px 0 0', padding: '10px 14px', borderLeft: `3px solid ${t.vermilion}`, fontSize: 13, color: t.inkSoft }}>{exercise.takeaway}</div>}
          {exercise.speakText && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}><SpeakButton text={exercise.speakText} /></div>}
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        {!checked && selected !== null && <Button onClick={check}>Check</Button>}
        {wrong && <Button onClick={() => { setSelected(null); setChecked(false); }}>Try Again</Button>}
        {revealed && <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>}
      </div>
    </div>
  );
}

function TypeAnswer({ exercise, onComplete }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const accepts = useMemo(() => [exercise.answer, ...(exercise.acceptAlternatives || []), exercise.speakText].filter(Boolean).map(normalizeAnswer), [exercise.acceptAlternatives, exercise.answer, exercise.speakText]);
  const correct = input.trim().length > 0 && accepts.includes(normalizeAnswer(input));
  const expectedJapanese = JP_CHAR.test(exercise.answer || '') ? exercise.answer : exercise.speakText || '';
  const showConversion = !!expectedJapanese;
  const placeholder = showConversion ? 'Type kana or romaji...' : 'Type the meaning...';
  const check = () => {
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) playCorrect();
    else playWrong();
  };

  return (
    <div>
      <Prompt kanji="書">{exercise.prompt}</Prompt>
      {exercise.speakText && <AudioCluster text={exercise.speakText} />}
      {exercise.question && (
        <div style={{ textAlign: 'center', margin: '4px 0 18px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 132, minHeight: 116, border: `1px solid ${t.ink}`, background: t.cardCream, fontFamily: t.fontJP, fontSize: 64, fontWeight: 600, color: t.ink, boxShadow: `4px 4px 0 ${t.lavenderMid}` }}>
            {exercise.question}
          </div>
        </div>
      )}
      {showConversion ? (
        <RomajiConversionBar
          input={input}
          expectedJapanese={expectedJapanese}
          correct={correct}
        />
      ) : (
        <div style={{ marginTop: 12, border: `1px solid ${t.lavenderMid}`, background: t.lavender, padding: '9px 14px', fontFamily: t.fontMono, fontSize: 10, color: t.violetInk, letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center' }}>
          Meaning recall
        </div>
      )}
      <div style={{ marginTop: 18, border: `1.5px solid ${t.ink}`, background: t.paper, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.2em', textTransform: 'uppercase' }}>答</span>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          placeholder={placeholder}
          autoFocus
          style={{ flex: 1, fontFamily: t.fontUI, fontSize: 16, color: t.ink, background: 'transparent', border: 0, outline: 'none' }}
        />
        <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.1em' }}>A ↵</span>
      </div>
      {showTip && exercise.hint && <div style={{ margin: '12px auto 0', maxWidth: 480, fontSize: 12, color: t.inkSoft, borderLeft: `3px solid ${t.vermilion}`, padding: '8px 12px' }}>{exercise.hint}</div>}
      {feedback === 'correct' && <CorrectStamp />}
      {feedback === 'incorrect' && <div style={{ marginTop: 14, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13 }}>Try again.</div>}
      {feedback === 'correct' && exercise.reveal && (
        <div style={{ margin: '14px auto 0', maxWidth: 420, border: `1px solid ${t.correct}`, background: '#edf7ed', padding: '11px 14px', textAlign: 'center', color: t.ink, fontSize: 13, fontWeight: 600 }}>
          {exercise.reveal}
        </div>
      )}
      {feedback === 'correct' ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}><Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button></div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
          <Button onClick={check}>{feedback === 'incorrect' ? 'Try Again' : 'Check'}</Button>
          {!showTip && exercise.hint && <Button variant="ghost" onClick={() => setShowTip(true)}>Show Tip</Button>}
        </div>
      )}
    </div>
  );
}

function Matching({ exercise, onComplete }) {
  const pairs = useMemo(() => exercise.pairs || [], [exercise.pairs]);
  const shuffledRight = useMemo(() => shuffle(pairs.map((pair) => pair.right)), [pairs]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const allDone = matched.size === pairs.length && pairs.length > 0;
  const displayLeft = useMemo(() => {
    const indices = pairs.map((_, i) => i);
    return [
      ...indices.filter((i) => !matched.has(i)),
      ...indices.filter((i) => matched.has(i)),
    ];
  }, [matched, pairs]);
  const displayRight = useMemo(() => {
    const matchedRights = new Set([...matched].map((i) => pairs[i]?.right).filter(Boolean));
    return [
      ...shuffledRight.filter((right) => !matchedRights.has(right)),
      ...shuffledRight.filter((right) => matchedRights.has(right)),
    ];
  }, [matched, pairs, shuffledRight]);

  const handleRight = (right) => {
    if (selectedLeft === null) return;
    const pair = pairs[selectedLeft];
    if (pair.right === right) {
      const next = new Set(matched);
      next.add(selectedLeft);
      setMatched(next);
      if (next.size === pairs.length) playCorrect();
    }
    setSelectedLeft(null);
  };

  return (
    <div>
      <Prompt kanji="選">{exercise.prompt}</Prompt>
      <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, textAlign: 'center', fontWeight: 600, marginBottom: 14 }}>{matched.size} / {pairs.length}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {displayLeft.map((origIdx) => {
            const pair = pairs[origIdx];
            const done = matched.has(origIdx);
            return (
              <button key={pair.left} type="button" onClick={() => !done && setSelectedLeft(origIdx)} disabled={done} style={{ ...optionStyle(selectedLeft === origIdx, done, done), justifyContent: 'center', fontFamily: t.fontJP, fontSize: 18, opacity: done ? 0.62 : 1 }}>
                {pair.left}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {displayRight.map((right) => {
            const done = pairs.some((pair, i) => pair.right === right && matched.has(i));
            return (
              <button key={right} type="button" onClick={() => handleRight(right)} disabled={done} style={{ ...optionStyle(false, done, done), justifyContent: 'center', opacity: done ? 0.62 : 1 }}>
                {right}
              </button>
            );
          })}
        </div>
      </div>
      {allDone && <CorrectStamp />}
      {allDone && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}><Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button></div>}
    </div>
  );
}

function ReadingPractice({ exercise, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = exercise.cards?.[idx];
  if (!card) return null;

  const next = () => {
    setFlipped(false);
    if (idx + 1 < exercise.cards.length) setIdx(idx + 1);
    else onComplete?.({ correct: true });
  };

  return (
    <div>
      <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: t.vermilion, textTransform: 'uppercase', marginBottom: 10 }}>{exercise.title || 'Reading Practice'}</div>
      <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, textAlign: 'center', fontWeight: 600, marginBottom: 14 }}>{idx + 1} / {exercise.cards.length}</div>
      <button type="button" onClick={() => setFlipped(!flipped)} style={{ width: '100%', border: `1px solid ${t.ink}`, background: t.cardCream, padding: '30px 24px', textAlign: 'center', cursor: 'pointer' }}>
        <div style={{ fontFamily: t.fontJP, fontSize: 30, fontWeight: 600, color: t.ink }}>{card.jp}</div>
        {flipped && (
          <>
            <div style={{ fontFamily: t.fontMono, fontSize: 12, color: t.inkSoft, marginTop: 12 }}>{card.romaji}</div>
            <div style={{ fontSize: 13, color: t.inkSoft, marginTop: 4 }}>{card.en}</div>
            {card.comprehension && (
              <div style={{ margin: '12px auto 0', maxWidth: 460, borderLeft: `3px solid ${t.vermilion}`, paddingLeft: 10, textAlign: 'left', fontSize: 12, color: t.inkSoft, lineHeight: 1.5 }}>
                <strong>{card.comprehension.q}</strong><br />
                {card.comprehension.a}
              </div>
            )}
          </>
        )}
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', marginTop: 18 }}>
        <SpeakButton text={card.jp} />
        {flipped ? <Button onClick={next}>Continue →</Button> : <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Tap card to reveal</span>}
      </div>
    </div>
  );
}

function ReadingList({ label, entries = [] }) {
  if (!entries.length) return null;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 13 }}>
      <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.18em', textTransform: 'uppercase', width: 34 }}>{label}</span>
      <span style={{ color: t.ink }}>
        {entries.map((entry, i) => (
          <span key={`${entry.kana}-${i}`}>
            <span style={{ fontFamily: t.fontJP, fontWeight: 600 }}>{entry.kana}</span>
            <span style={{ color: t.inkFaint, fontSize: 11, marginLeft: 4 }}>({entry.romaji})</span>
            {i < entries.length - 1 && <span style={{ color: t.rule, margin: '0 7px' }}>·</span>}
          </span>
        ))}
      </span>
    </div>
  );
}

function HighlightText({ text, highlight }) {
  if (!text || !highlight || !text.includes(highlight)) return text;
  const parts = text.split(highlight);
  return parts.map((part, i) => (
    <span key={`${part}-${i}`}>
      {part}
      {i < parts.length - 1 && (
        <span style={{ background: t.lavender, color: t.violetDeep, borderBottom: `2px solid ${t.violet}`, padding: '0 3px' }}>
          {highlight}
        </span>
      )}
    </span>
  ));
}

function SumiKanjiCard({ exercise, onComplete }) {
  return (
    <div>
      <div style={{ border: `1px solid ${t.ink}`, background: t.cardCream, padding: '22px 24px', display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ width: 112, height: 112, display: 'grid', placeItems: 'center', border: `1px solid ${t.ink}`, background: t.paper, boxShadow: `4px 4px 0 ${t.lavenderMid}` }}>
            <div style={{ fontFamily: t.fontJP, fontSize: 78, lineHeight: 1, color: t.ink, fontWeight: 700 }}>{exercise.kanji}</div>
          </div>
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 10, color: t.vermilion, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{exercise.jlpt || 'N5'} Kanji</div>
            <h3 style={{ margin: '4px 0 6px', fontSize: 24, color: t.ink }}>{exercise.meaning}</h3>
            {exercise.memoryHook && <p style={{ margin: 0, fontSize: 13, color: t.violetDeep, fontStyle: 'italic' }}>{exercise.memoryHook}</p>}
          </div>
          <SpeakButton text={exercise.kanji} />
        </div>

        <div style={{ borderTop: `1px dashed ${t.rule}`, paddingTop: 12, display: 'grid', gap: 6 }}>
          <ReadingList label="On" entries={exercise.readings?.on} />
          <ReadingList label="Kun" entries={exercise.readings?.kun} />
        </div>

        <div style={{ display: 'grid', gap: 16, borderTop: `1px solid ${t.rule}`, paddingTop: 16 }}>
          {exercise.mnemonic && (
            <div style={{ borderLeft: `3px solid ${t.vermilion}`, paddingLeft: 12 }}>
              <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.vermilion, textTransform: 'uppercase', marginBottom: 4 }}>Memory</div>
              <p style={{ margin: 0, fontSize: 13, color: t.inkSoft, lineHeight: 1.7 }}>{exercise.mnemonic}</p>
            </div>
          )}
          {exercise.components?.length > 0 && (
            <div style={{ display: 'grid', gap: 7 }}>
              <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.inkFaint, textTransform: 'uppercase' }}>Components</div>
              {exercise.components.map((item, i) => (
                <div key={`${item.shape}-${i}`} style={{ border: `1px solid ${t.rule}`, background: t.paper, padding: '8px 10px', fontSize: 12.5, color: t.inkSoft }}>
                  <span style={{ fontFamily: t.fontJP, fontSize: 20, color: t.ink, fontWeight: 600 }}>{item.shape}</span>
                  <span> - {item.note}</span>
                </div>
              ))}
            </div>
          )}
          {exercise.confusables?.length > 0 && (
            <div style={{ display: 'grid', gap: 7 }}>
              <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.inkFaint, textTransform: 'uppercase' }}>Confusables</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {exercise.confusables.map((item) => (
                  <div key={item.kanji} style={{ border: `1px solid ${t.rule}`, background: t.paper, padding: '8px 10px', fontSize: 12.5, color: t.inkSoft }}>
                    <span style={{ fontFamily: t.fontJP, fontSize: 20, color: t.ink, fontWeight: 600 }}>{item.kanji}</span>
                    <span> ({item.meaning}) — {item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {exercise.compounds?.length > 0 && (
            <div style={{ display: 'grid', gap: 7 }}>
              <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.inkFaint, textTransform: 'uppercase' }}>Compounds</div>
              {exercise.compounds.map((item, i) => (
                <div key={item.word} style={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 88px) minmax(76px, 104px) minmax(0, 1fr) 24px', alignItems: 'center', gap: 10, borderBottom: i < exercise.compounds.length - 1 ? `1px dashed ${t.rule}` : 0, paddingBottom: 6 }}>
                  <span style={{ fontFamily: t.fontJP, fontSize: 18, color: t.ink, fontWeight: 600 }}>{item.word}</span>
                  <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.inkFaint }}>{item.reading}</span>
                  <span style={{ fontSize: 12.5, color: t.inkSoft, minWidth: 0 }}>{item.meaning}</span>
                  <SpeakButton text={item.word} size={18} />
                </div>
              ))}
            </div>
          )}
          {exercise.sentences?.length > 0 && (
            <div style={{ display: 'grid', gap: 9 }}>
              <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.2em', color: t.inkFaint, textTransform: 'uppercase' }}>Sentences</div>
              {exercise.sentences.map((item) => (
                <div key={item.jp} style={{ border: `1px solid ${t.rule}`, background: t.paper, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: t.fontJP, fontSize: 18, color: t.ink, fontWeight: 600, flex: 1 }}>
                      <HighlightText text={item.jp} highlight={item.highlight} />
                    </span>
                    <SpeakButton text={item.jp} size={18} />
                  </div>
                  <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.inkFaint, marginTop: 4 }}>{item.reading}</div>
                  {item.romaji && <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.inkSoft, marginTop: 2 }}>{item.romaji}</div>}
                  {item.gloss && <div style={{ fontSize: 11, color: t.inkFaint, marginTop: 4, fontStyle: 'italic' }}>{item.gloss}</div>}
                  <div style={{ fontSize: 12, color: t.inkSoft, marginTop: 3 }}>{item.en}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>
      </div>
    </div>
  );
}

function FlashcardReview({ exercise, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = exercise.cards?.[idx];
  if (!card) return null;
  const front = card.front ?? card.jp ?? card.kana ?? '';
  const back = card.back ?? [card.romaji, card.en].filter(Boolean).join(' — ');
  const speakText = card.speakText ?? card.jp ?? card.front;
  const next = () => {
    setFlipped(false);
    if (idx + 1 < exercise.cards.length) setIdx(idx + 1);
    else onComplete?.({ correct: true });
  };

  return (
    <div>
      <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, textAlign: 'center', fontWeight: 600, marginBottom: 14 }}>{idx + 1} / {exercise.cards.length}</div>
      <button type="button" onClick={() => setFlipped(!flipped)} style={{ width: '100%', minHeight: 240, border: `1px solid ${t.ink}`, background: t.cardCream, padding: '32px 24px', textAlign: 'center', cursor: 'pointer', boxShadow: `4px 4px 0 ${t.lavenderMid}` }}>
        <div style={{ fontFamily: flipped ? t.fontUI : t.fontJP, fontSize: flipped ? 26 : 76, fontWeight: 700, color: flipped ? t.violetDeep : t.ink }}>
          {flipped ? back : front}
        </div>
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <SpeakButton text={speakText || front} />
        {flipped ? <Button onClick={next}>Continue →</Button> : <span style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Tap card to reveal</span>}
      </div>
    </div>
  );
}

function ReadingExplanation({ exercise, onComplete }) {
  const options = useMemo(() => shuffle(exercise.options || []), [exercise.options]);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const revealed = checked && selected !== null && options[selected]?.correct;
  const wrong = checked && selected !== null && !options[selected]?.correct;
  const check = () => {
    const correct = !!options[selected]?.correct;
    setChecked(true);
    if (correct) playCorrect();
    else playWrong();
  };
  const renderWord = () => (
    <HighlightText text={exercise.word} highlight={exercise.targetKanji} />
  );

  return (
    <div>
      <Prompt kanji="訓">{exercise.prompt}</Prompt>
      {exercise.word && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ fontFamily: t.fontJP, fontSize: 42, fontWeight: 700, color: t.ink }}>{renderWord()}</div>
          {revealed && <SpeakButton text={exercise.word} />}
        </div>
      )}
      <div style={{ display: 'grid', gap: 10 }}>
        {options.map((option, i) => {
          const isSelected = selected === i;
          const checkedState = revealed || (wrong && isSelected);
          return (
            <button key={`${option.kana}-${i}`} type="button" disabled={revealed} onClick={() => { if (!revealed) { setSelected(i); setChecked(false); } }} style={{ ...optionStyle(isSelected, checkedState, option.correct), alignItems: 'flex-start' }}>
              <span style={{ fontFamily: t.fontMono, fontSize: 10, color: option.readingType === 'kun' ? HANKO_GREEN : t.violetDeep, letterSpacing: '0.14em', width: 34, fontWeight: 700, textTransform: 'uppercase' }}>{option.readingType}</span>
              <span style={{ flex: 1 }}>
                <span style={{ fontFamily: t.fontJP, fontSize: 22, color: t.ink, fontWeight: 600 }}>{option.kana}</span>
                {option.romaji && <span style={{ fontFamily: t.fontMono, fontSize: 12, color: t.inkFaint, marginLeft: 8 }}>({option.romaji})</span>}
                {(revealed || (wrong && isSelected)) && (option.explanation || wrongHintText(option)) && <span style={{ display: 'block', fontSize: 12, color: option.correct ? t.inkSoft : t.vermilion, marginTop: 8, borderLeft: `3px solid ${option.correct ? t.correct : t.vermilion}`, paddingLeft: 10 }}>{option.correct ? option.explanation : wrongHintText(option) || option.explanation}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {wrong && <div style={{ marginTop: 14, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13 }}>Try again.</div>}
      {revealed && <CorrectStamp />}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        {!checked && selected !== null && <Button onClick={check}>Check</Button>}
        {wrong && <Button onClick={() => { setSelected(null); setChecked(false); }}>Try Again</Button>}
        {revealed && <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>}
      </div>
    </div>
  );
}

const DIALOGUE_REGISTER = {
  formal: { label: 'FORMAL · 丁寧語', border: '#4f46e5', bg: '#eef2ff', ink: '#3730a3' },
  casual: { label: 'CASUAL · ため口', border: '#14b8a6', bg: '#f0fdfa', ink: '#0f766e' },
  slang: { label: 'SLANG · くだけた', border: '#db2777', bg: '#fdf2f8', ink: '#be185d' },
};

function DialogueScene({ exercise, onComplete }) {
  const theme = DIALOGUE_REGISTER[exercise.register] || DIALOGUE_REGISTER.formal;

  return (
    <div>
      <div style={{ textAlign: 'left', margin: '4px 0 18px' }}>
        <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: theme.ink, textTransform: 'uppercase', marginBottom: 6 }}>{theme.label}</div>
        <div style={{ fontFamily: t.fontJP, fontSize: 30, fontWeight: 600, lineHeight: 1.1, color: t.ink }}>{exercise.title}</div>
      </div>

      <div style={{ border: `1px solid ${theme.border}`, background: t.cardCream, padding: '16px 14px', display: 'grid', gap: 14 }}>
        {(exercise.lines || []).map((line, i) => {
          const isRight = i % 2 === 1;
          return (
            <div key={`${line.speaker}-${i}`} style={{ display: 'grid', gridTemplateColumns: isRight ? '1fr 42px' : '42px 1fr', gap: 10, alignItems: 'start' }}>
              {!isRight && (
                <div style={{ display: 'grid', justifyItems: 'center', gap: 4 }}>
                  <div style={{ width: 38, height: 38, border: `1px solid ${theme.border}`, background: theme.bg, display: 'grid', placeItems: 'center', fontFamily: t.fontJP, fontSize: 12, fontWeight: 700, color: theme.ink }}>{line.speaker?.slice(0, 2) || '?'}</div>
                  <span style={{ fontSize: 10, color: t.inkFaint }}>{line.speaker}</span>
                </div>
              )}
              <div style={{ border: `1px solid ${t.rule}`, background: isRight ? t.paper : theme.bg, padding: '12px 13px', textAlign: isRight ? 'right' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexDirection: isRight ? 'row-reverse' : 'row' }}>
                  <p style={{ margin: 0, flex: 1, fontFamily: t.fontJP, fontSize: 18, fontWeight: 600, color: t.ink, lineHeight: 1.55 }}>{line.jp}</p>
                  <SpeakButton text={line.jp} size={20} />
                </div>
                <p style={{ margin: '5px 0 0', fontFamily: t.fontMono, fontSize: 11, color: t.inkFaint }}>{line.romaji}</p>
                <p style={{ margin: '5px 0 0', fontSize: 12, color: t.inkSoft }}>{line.en}</p>
              </div>
              {isRight && (
                <div style={{ display: 'grid', justifyItems: 'center', gap: 4 }}>
                  <div style={{ width: 38, height: 38, border: `1px solid ${theme.border}`, background: theme.bg, display: 'grid', placeItems: 'center', fontFamily: t.fontJP, fontSize: 12, fontWeight: 700, color: theme.ink }}>{line.speaker?.slice(0, 2) || '?'}</div>
                  <span style={{ fontSize: 10, color: t.inkFaint }}>{line.speaker}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>
      </div>
    </div>
  );
}

function ResponseSelection({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const correctIndex = correctIndexForOptions(exercise.options, exercise.correctIndex);
  const selectedOption = selected !== null ? exercise.options?.[selected] : null;
  const isCorrect = selected === correctIndex;
  const check = () => {
    setChecked(true);
    if (isCorrect) playCorrect();
    else playWrong();
  };

  return (
    <div>
      <Prompt kanji="応">{exercise.prompt}</Prompt>
      {exercise.question?.speakText && <AudioCluster text={exercise.question.speakText} />}
      <div style={{ border: `1px solid ${t.ink}`, background: t.cardCream, padding: '16px 18px', textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontFamily: t.fontJP, fontSize: 26, color: t.ink, fontWeight: 600 }}>{exercise.question?.jp}</div>
        <div style={{ fontFamily: t.fontMono, fontSize: 12, color: t.inkFaint, marginTop: 6 }}>{exercise.question?.romaji}</div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {(exercise.options || []).map((option, i) => (
          <button
            key={`${option.jp}-${i}`}
            type="button"
            onClick={() => !checked && setSelected(i)}
            style={optionStyle(selected === i, checked, checked && isCorrect && i === correctIndex)}
          >
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, letterSpacing: '0.1em', width: 20, fontWeight: 600 }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontFamily: t.fontJP, fontSize: 19, color: t.ink }}>{option.jp}</span>
              <span style={{ display: 'block', fontFamily: t.fontMono, fontSize: 11, color: t.inkFaint, marginTop: 3 }}>{option.romaji}</span>
            </span>
          </button>
        ))}
      </div>
      {checked && isCorrect && <CorrectStamp />}
      {checked && !isCorrect && <div style={{ marginTop: 14, textAlign: 'center', color: t.vermilion, fontWeight: 600, fontSize: 13 }}>Try again.</div>}
      {checked && !isCorrect && <WrongHint option={selectedOption} />}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        {!checked && selected !== null && <Button onClick={check}>Check</Button>}
        {checked && !isCorrect && <Button onClick={() => { setSelected(null); setChecked(false); }}>Try Again</Button>}
        {checked && isCorrect && <Button onClick={() => onComplete?.({ correct: true })}>Continue →</Button>}
      </div>
    </div>
  );
}

function Shadowing({ exercise, onComplete }) {
  const [heard, setHeard] = useState(false);
  const [practised, setPractised] = useState(false);
  const theme = DIALOGUE_REGISTER[exercise.register] || DIALOGUE_REGISTER.formal;
  const { speak, supported, ready } = useSpeech();

  useEffect(() => {
    if (ready && exercise.speakText) {
      speak(exercise.speakText);
    }
  }, [exercise.speakText, ready, speak]);

  const play = (rate = 1) => {
    if (!exercise.speakText) return;
    speak(exercise.speakText, { rate });
    setHeard(true);
  };

  return (
    <div>
      <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: theme.ink, textTransform: 'uppercase', marginBottom: 10 }}>{exercise.dialogueContext || theme.label}</div>
      <Prompt kanji="声">{exercise.prompt}</Prompt>
      <div style={{ border: `1px solid ${theme.border}`, background: t.cardCream, padding: '20px 22px', display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontFamily: t.fontJP, fontSize: 16, color: theme.ink, fontWeight: 700 }}>{exercise.speaker}</span>
          <span style={{ fontFamily: t.fontMono, fontSize: 10, color: theme.ink, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{exercise.register}</span>
        </div>
        <p style={{ margin: 0, fontFamily: t.fontJP, fontSize: 26, lineHeight: 1.55, color: t.ink, fontWeight: 600 }}>{exercise.jp}</p>
        <p style={{ margin: 0, fontFamily: t.fontMono, fontSize: 12, color: t.inkFaint }}>{exercise.romaji}</p>
        <p style={{ margin: 0, borderTop: `1px dashed ${t.rule}`, paddingTop: 10, fontSize: 13, color: t.inkSoft }}>{exercise.en}</p>
      </div>
      {supported && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 18 }}>
          <Button onClick={() => play(1)}>Play</Button>
          <Button variant="ghost" onClick={() => play(0.6)}>Slower</Button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        <Button
          disabled={!heard}
          onClick={() => {
            setPractised(true);
            playCorrect();
            onComplete?.({ correct: true });
          }}
        >
          {practised ? 'Practised' : 'I Practised →'}
        </Button>
      </div>
    </div>
  );
}

function ExerciseBody({ exercise, onComplete }) {
  if (exercise.type === 'reference-chart') return <ReferenceChart exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'kanji-card') return <SumiKanjiCard exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'flashcard') return <FlashcardReview exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'reading-explanation') return <ReadingExplanation exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'dialogue-scene') return <DialogueScene exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'response-selection') return <ResponseSelection exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'shadowing') return <Shadowing exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'formula-fill') return <FormulaFill exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'multiple-choice') return <MultipleChoice exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'comparison-cards') return <ComparisonCards exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'type-the-answer') return <TypeAnswer exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'matching') return <Matching exercise={exercise} onComplete={onComplete} />;
  if (exercise.type === 'reading-practice') return <ReadingPractice exercise={exercise} onComplete={onComplete} />;
  return <div style={{ color: t.vermilion }}>Unsupported Sumi-Murasaki exercise type: {exercise.type}</div>;
}

function CompleteReferenceCarousel({ charts = [] }) {
  const [idx, setIdx] = useState(0);
  if (!charts.length) return null;

  const safe = Math.min(idx, charts.length - 1);
  const chart = charts[safe];
  const [header, ...body] = chart.rows || [];
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(charts.length - 1, i + 1));

  return (
    <div style={{ marginTop: 30, border: `1px solid ${t.ink}`, background: t.cardCream, textAlign: 'left' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${t.rule}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
        <div>
          <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', color: t.vermilion, textTransform: 'uppercase' }}>
            Reference table
          </div>
          <div style={{ fontFamily: t.fontJP, fontSize: 20, color: t.ink, fontWeight: 600, marginTop: 4 }}>
            {chart.title}
          </div>
        </div>
        <div style={{ fontFamily: t.fontMono, fontSize: 11, color: t.violetDeep, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {safe + 1} / {charts.length}
        </div>
      </div>

      {chart.intro && (
        <p style={{ margin: 0, padding: '12px 16px 0', fontSize: 12.5, color: t.inkSoft, lineHeight: 1.6 }}>
          {chart.intro}
        </p>
      )}

      <div style={{ overflowX: 'auto', padding: '14px 16px 0' }}>
        <div style={{ minWidth: header ? header.length * 130 : 390, border: `1px solid ${t.rule}` }}>
          {header && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${header.length}, minmax(120px, 1fr))`, fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.inkFaint, padding: '9px 12px', borderBottom: `1px solid ${t.rule}` }}>
              {header.map((cell, i) => <span key={i}>{cell}</span>)}
            </div>
          )}
          {body.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${row.length}, minmax(120px, 1fr))`, alignItems: 'center', padding: '8px 12px', borderBottom: i < body.length - 1 ? `1px dashed ${t.rule}` : 'none', fontSize: 12.5 }}>
              {row.map((cell, j) => (
                <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.ink }}>
                  <span style={{ fontFamily: j === 0 && JP_CHAR.test(cell) ? t.fontJP : j === 1 ? t.fontMono : t.fontUI, fontSize: j === 0 && JP_CHAR.test(cell) ? 15 : 12.5, color: j === 1 ? t.inkSoft : t.ink }}>
                    {cell}
                  </span>
                  {extractSpeakable(cell) && <SpeakButton text={extractSpeakable(cell)} size={18} />}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {chart.takeaway && (
        <div style={{ margin: '14px 16px 0', padding: '9px 12px', borderLeft: `3px solid ${t.vermilion}`, fontSize: 12.5, color: t.inkSoft, lineHeight: 1.5 }}>
          {chart.takeaway}
        </div>
      )}

      <div style={{ padding: '14px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
        <Chev dir="left" onClick={prev} disabled={safe === 0} />
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {charts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Reference table ${i + 1}`}
              style={{
                width: i === safe ? 22 : 8,
                height: 8,
                borderRadius: 0,
                border: 0,
                background: i === safe ? t.violet : t.rule,
                cursor: 'pointer',
                transition: 'width .15s ease, background .15s ease',
              }}
            />
          ))}
        </div>
        <Chev dir="right" onClick={next} disabled={safe === charts.length - 1} />
      </div>
    </div>
  );
}

export function SumiMurasakiLessonComplete({
  xpEarned,
  nextLessonPath,
  onNextLesson,
  onBackToCourse,
  total = 38,
  charts = [],
  lessonLabel = 'Bunpō · Lesson 01',
  headerKanji = '文法',
  headerMeta = 'Grammar 01 · Complete',
  completeText = 'Pronouns and demonstratives are sealed. Review the reference cards when needed, then continue to the next grammar step.',
  accent = DEFAULT_SUMI_ACCENT,
}) {
  const a = { ...DEFAULT_SUMI_ACCENT, ...accent };
  return (
    <div
      style={{
        minHeight: 620,
        background: t.paper,
        color: t.ink,
        fontFamily: t.fontUI,
        position: 'relative',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '52px 1fr',
        border: `1px solid ${t.rule}`,
        boxShadow: '0 18px 45px rgba(26,22,19,0.12)',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.5,
          backgroundImage:
            'radial-gradient(rgba(120,90,60,0.05) 1px, transparent 1px), radial-gradient(rgba(120,90,60,0.04) 1px, transparent 1px)',
          backgroundSize: '3px 3px, 7px 7px',
          backgroundPosition: '0 0, 1px 2px',
        }}
      />
      <aside style={{ position: 'relative', background: a.light, borderRight: `1px solid ${a.mid}`, boxShadow: 'inset -1px 0 0 rgba(124,58,237,0.08)', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}><WaveBg stroke={a.accent} /></div>
        <div style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ fontFamily: t.fontJP, fontSize: 26, color: a.deep, writingMode: 'vertical-rl', fontWeight: 600 }}>完</div>
        </div>
        <div style={{ position: 'absolute', top: 78, left: '50%', transform: 'translateX(-50%)', width: 14, height: 1, background: a.accent, opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: 94, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <VerticalLabel>{lessonLabel}</VerticalLabel>
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <VerticalLabel color={a.deep}>{total} / {total}</VerticalLabel>
        </div>
      </aside>
      <main style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 4, background: t.ink }} />
        <header style={{ padding: '16px 30px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${t.rule}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: t.fontJP, fontSize: 22, fontWeight: 500, letterSpacing: '0.04em' }}>{headerKanji}</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: t.inkFaint }}>
              {headerMeta}
            </span>
          </div>
          <span style={{ fontFamily: t.fontMono, fontSize: 11, color: a.deep, letterSpacing: '0.1em', fontWeight: 600 }}>
            {String(total).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </header>
        <section style={{ padding: '44px 34px 34px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Hanko size={54} />
          </div>
          <div style={{ fontFamily: t.fontMono, fontSize: 10, letterSpacing: '0.24em', color: t.vermilion, textTransform: 'uppercase', marginBottom: 8 }}>
            Lesson complete
          </div>
          <h2 style={{ fontFamily: t.fontJP, fontSize: 38, lineHeight: 1.1, fontWeight: 600, color: t.ink, margin: 0 }}>
            よくできました
          </h2>
          <p style={{ fontSize: 14, color: t.inkSoft, lineHeight: 1.7, maxWidth: 460, margin: '14px auto 0' }}>
            {completeText}
          </p>
          <div style={{ margin: '26px auto 0', border: `1px solid ${t.ink}`, background: t.cardCream, maxWidth: 360, padding: '16px 18px' }}>
            <div style={{ fontFamily: t.fontMono, fontSize: 10, color: t.inkFaint, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Earned</div>
            <div style={{ fontFamily: t.fontJP, fontSize: 30, color: a.deep, fontWeight: 600, marginTop: 4 }}>+{xpEarned} XP</div>
          </div>
          <CompleteReferenceCarousel charts={charts} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
            {nextLessonPath && <Button onClick={onNextLesson}>Next Lesson →</Button>}
            <Button variant="ghost" onClick={onBackToCourse}>Back to Course</Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function SumiMurasakiGrammarLesson({
  exercise,
  current,
  total,
  lessonLabel,
  headerKanji,
  headerMeta,
  accent,
  onComplete,
  onBack,
  onForward,
  canBack,
  canForward,
}) {
  return (
    <Shell
      current={current}
      total={total}
      kanjiMark={getKanjiMark(exercise)}
      lessonLabel={lessonLabel}
      headerKanji={headerKanji}
      headerMeta={headerMeta}
      accent={accent}
      onBack={onBack}
      onForward={onForward}
      canBack={canBack}
      canForward={canForward}
    >
      <ExerciseBody exercise={exercise} onComplete={onComplete} />
    </Shell>
  );
}
