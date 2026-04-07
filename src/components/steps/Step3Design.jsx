// Step3：デザイン仕様（金額に影響しない情報入力画面）
import { useRef } from 'react';
import PillButton from '../ui/PillButton';
import GroupCard from '../ui/GroupCard';
import styles from './Step3Design.module.css';

const FONT_STYLES = [
  { value: 'soft', label: 'やわらかい' },
  { value: 'sharp', label: 'シャープ' },
  { value: 'formal', label: 'フォーマル' },
  { value: 'casual', label: 'カジュアル' },
];

const LAYOUTS = [
  { value: 'A', name: 'パターンA', desc: 'ヘッダー大・写真メイン', color: '#E1F5EE' },
  { value: 'B', name: 'パターンB', desc: 'サイドバー付・情報整理型', color: '#D4EDDA' },
  { value: 'C', name: 'パターンC', desc: '1カラム・スクロール型', color: '#CCE5FF' },
  { value: 'D', name: 'パターンD', desc: 'グリッド・ギャラリー型', color: '#FFF3CD' },
];

function ColorSwatchCard({ label, color, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className={styles.swatchCard} onClick={() => inputRef.current?.click()}>
      <div className={styles.swatchPreview} style={{ backgroundColor: color }} />
      <div className={styles.swatchLabel}>{label}</div>
      <div className={styles.swatchCode}>{color.toUpperCase()}</div>
      <input
        ref={inputRef}
        type="color"
        className={styles.colorInput}
        value={color}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label}の色を選択`}
      />
    </div>
  );
}

function LayoutCard({ layout, selected, onClick }) {
  return (
    <div
      className={`${styles.layoutCard} ${selected ? styles.layoutCardSelected : ''}`}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
    >
      <div className={styles.layoutPreview} style={{ backgroundColor: layout.color }}>
        <LayoutPreviewSvg pattern={layout.value} />
      </div>
      <div className={styles.layoutName}>{layout.name}</div>
      <div className={styles.layoutDesc}>{layout.desc}</div>
    </div>
  );
}

// レイアウトパターンの簡易プレビュー
function LayoutPreviewSvg({ pattern }) {
  const base = { fill: '#fff', opacity: 0.7 };
  const accent = { fill: '#1D9E75', opacity: 0.3 };

  if (pattern === 'A') {
    return (
      <svg width="100" height="60" viewBox="0 0 100 60">
        <rect x="0" y="0" width="100" height="25" rx="3" {...accent} />
        <rect x="5" y="30" width="42" height="25" rx="3" {...base} />
        <rect x="53" y="30" width="42" height="25" rx="3" {...base} />
      </svg>
    );
  }
  if (pattern === 'B') {
    return (
      <svg width="100" height="60" viewBox="0 0 100 60">
        <rect x="0" y="0" width="100" height="10" rx="3" {...accent} />
        <rect x="0" y="14" width="28" height="46" rx="3" {...accent} />
        <rect x="32" y="14" width="68" height="46" rx="3" {...base} />
      </svg>
    );
  }
  if (pattern === 'C') {
    return (
      <svg width="100" height="60" viewBox="0 0 100 60">
        <rect x="0" y="0" width="100" height="10" rx="3" {...accent} />
        <rect x="15" y="14" width="70" height="12" rx="3" {...base} />
        <rect x="15" y="30" width="70" height="12" rx="3" {...base} />
        <rect x="15" y="46" width="70" height="12" rx="3" {...base} />
      </svg>
    );
  }
  // D
  return (
    <svg width="100" height="60" viewBox="0 0 100 60">
      <rect x="0" y="0" width="100" height="10" rx="3" {...accent} />
      <rect x="2" y="14" width="30" height="20" rx="3" {...base} />
      <rect x="35" y="14" width="30" height="20" rx="3" {...base} />
      <rect x="68" y="14" width="30" height="20" rx="3" {...base} />
      <rect x="2" y="38" width="30" height="20" rx="3" {...base} />
      <rect x="35" y="38" width="30" height="20" rx="3" {...base} />
      <rect x="68" y="38" width="30" height="20" rx="3" {...base} />
    </svg>
  );
}

export default function Step3Design({ estimate, updateField, onNext, onBack }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>デザイン仕様</h2>
      <p className={styles.sectionDesc}>デザインの方向性を選択してください（金額には影響しません）</p>

      {/* 配色テーマ */}
      <GroupCard label="配色テーマ">
        <div style={{ padding: '16px 20px' }}>
          <div className={styles.swatchRow}>
            <ColorSwatchCard
              label="メインカラー"
              color={estimate.colorMain}
              onChange={(v) => updateField('colorMain', v)}
            />
            <ColorSwatchCard
              label="サブカラー"
              color={estimate.colorSub}
              onChange={(v) => updateField('colorSub', v)}
            />
            <ColorSwatchCard
              label="アクセントカラー"
              color={estimate.colorAccent}
              onChange={(v) => updateField('colorAccent', v)}
            />
          </div>
        </div>
      </GroupCard>

      {/* フォントの雰囲気 */}
      <GroupCard label="フォントの雰囲気">
        <div style={{ padding: '16px 20px' }}>
          <div className={styles.pillGroup}>
            {FONT_STYLES.map((font) => (
              <PillButton
                key={font.value}
                label={font.label}
                selected={estimate.fontStyle === font.value}
                onClick={() => updateField('fontStyle', font.value)}
              />
            ))}
          </div>
        </div>
      </GroupCard>

      {/* レイアウトイメージ */}
      <GroupCard label="レイアウトイメージ">
        <div style={{ padding: '16px 20px' }}>
          <div className={styles.layoutGrid}>
            {LAYOUTS.map((layout) => (
              <LayoutCard
                key={layout.value}
                layout={layout}
                selected={estimate.layoutPattern === layout.value}
                onClick={() => updateField('layoutPattern', layout.value)}
              />
            ))}
          </div>
        </div>
      </GroupCard>

      {/* 参考サイトURL */}
      <GroupCard label="参考サイト">
        <div style={{ padding: '16px 20px' }}>
          <input
            type="url"
            className={styles.textInput}
            placeholder="https://example.com"
            value={estimate.referenceUrl1}
            onChange={(e) => updateField('referenceUrl1', e.target.value)}
            aria-label="参考サイトURL 1"
          />
          <input
            type="url"
            className={styles.textInput}
            placeholder="2つ目の参考サイト（任意）"
            value={estimate.referenceUrl2}
            onChange={(e) => updateField('referenceUrl2', e.target.value)}
            aria-label="参考サイトURL 2"
          />
        </div>
      </GroupCard>

      {/* その他の要望 */}
      <GroupCard label="その他の要望">
        <div style={{ padding: '16px 20px' }}>
          <textarea
            className={styles.textArea}
            placeholder="デザインに関する補足やイメージがあれば自由にご記入ください"
            value={estimate.designNote}
            onChange={(e) => updateField('designNote', e.target.value)}
            aria-label="その他の要望"
          />
        </div>
      </GroupCard>

      {/* ナビゲーションボタン */}
      <div className={styles.buttons}>
        <button className={styles.backButton} onClick={onBack}>
          戻る
        </button>
        <button className={styles.nextButton} onClick={onNext}>
          次へ進む
        </button>
      </div>
    </div>
  );
}
