// Step1：サイトの基本情報（カテゴリ1・カテゴリ2）
import { useState } from 'react';
import PillButton from '../ui/PillButton';
import ToggleSwitch from '../ui/ToggleSwitch';
import Slider from '../ui/Slider';
import GroupCard from '../ui/GroupCard';
import { PRICING } from '../../data/pricing';
import { getHistory, deleteFromHistory } from '../../utils/estimateHistory';
import { formatCurrency } from '../../utils/formatCurrency';
import { TEMPLATES } from '../../data/templates';
import styles from './Step1BasicInfo.module.css';
import common from './StepCommon.module.css';

const SITE_TYPES = [
  { value: 'corporate', label: 'コーポレート' },
  { value: 'lp', label: 'LP' },
  { value: 'ec', label: 'EC' },
  { value: 'blog', label: 'ブログ' },
];

const BUILD_METHODS = [
  { value: 'html', label: 'HTML・CSS' },
  { value: 'wordpress', label: 'WordPress' },
];

export default function Step1BasicInfo({ estimate, updateField, onNext, onLoadEstimate, onReset }) {
  const [history, setHistory] = useState(getHistory);
  const [showHistory, setShowHistory] = useState(false);

  const handleDelete = (id) => {
    const updated = deleteFromHistory(id);
    setHistory(updated);
  };

  const handleLoad = (entry) => {
    if (window.confirm(`「${entry.clientName}」の見積もりを読み込みますか？\n現在の入力内容は上書きされます。`)) {
      onLoadEstimate(entry.estimate);
    }
  };

  return (
    <div className={common.container}>
      <div className={common.titleRow}>
        <div>
          <h2 className={common.sectionTitle}>サイトの基本情報</h2>
          <p className={common.sectionDesc}>サイトの種類や構成を選択してください</p>
        </div>
        <button className={styles.resetButton} onClick={() => {
          if (window.confirm('入力内容をすべてリセットしますか？')) onReset();
        }}>リセット</button>
      </div>

      {/* 履歴パネル */}
      {history.length > 0 && (
        <div className={styles.historySection}>
          <button
            className={styles.historyToggle}
            onClick={() => setShowHistory(!showHistory)}
          >
            保存済みの見積もり（{history.length}件）{showHistory ? ' ▲' : ' ▼'}
          </button>
          {showHistory && (
            <div className={styles.historyList}>
              {history.map((entry) => (
                <div key={entry.id} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <span className={styles.historyName}>{entry.clientName}</span>
                    <span className={styles.historyMeta}>{entry.date}　¥{formatCurrency(entry.total)}</span>
                  </div>
                  <div className={styles.historyActions}>
                    <button className={styles.historyLoad} onClick={() => handleLoad(entry)}>読込</button>
                    <button className={styles.historyDelete} onClick={() => handleDelete(entry.id)}>削除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* テンプレート */}
      <div className={styles.templateSection}>
        <div className={styles.templateLabel}>テンプレートから始める</div>
        <div className={styles.templateGrid}>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              className={styles.templateCard}
              onClick={() => {
                if (window.confirm(`「${tpl.name}」テンプレートを適用しますか？\n現在の入力内容は上書きされます。`)) {
                  onLoadEstimate(tpl.fields);
                }
              }}
            >
              <span className={styles.templateName}>{tpl.name}</span>
              <span className={styles.templateDesc}>{tpl.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* サイトの種類 */}
      <GroupCard label="サイトの種類">
        <div style={{ padding: '14px 16px' }}>
          <div className={common.pillGroup}>
            {SITE_TYPES.map((type) => (
              <PillButton
                key={type.value}
                label={type.label}
                selected={estimate.siteType === type.value}
                onClick={() => updateField('siteType', type.value)}
              />
            ))}
          </div>
        </div>
      </GroupCard>

      {/* 制作方式 */}
      <GroupCard label="制作方式">
        <div style={{ padding: '14px 16px' }}>
          <div className={common.pillGroup}>
            {BUILD_METHODS.map((method) => (
              <PillButton
                key={method.value}
                label={method.label}
                selected={estimate.buildMethod === method.value}
                onClick={() => updateField('buildMethod', method.value)}
              />
            ))}
          </div>
        </div>
      </GroupCard>

      {/* ページ構成 */}
      <GroupCard label="ページ構成">
        <ToggleSwitch
          label="トップページ"
          checked={estimate.topPage}
          onChange={(v) => updateField('topPage', v)}
          price={PRICING.page_top}
        />
        <Slider
          label="下層ページ数"
          min={0}
          max={30}
          value={estimate.subPageCount}
          unit="page"
          onChange={(v) => updateField('subPageCount', v)}
        />
        <Slider
          label="LPページ数"
          min={0}
          max={10}
          value={estimate.lpPageCount}
          unit="page"
          onChange={(v) => updateField('lpPageCount', v)}
        />
      </GroupCard>

      {/* テンプレート */}
      <GroupCard label="テンプレートページ">
        <ToggleSwitch
          label="ブログ記事テンプレート"
          description="投稿詳細の共通レイアウト"
          checked={estimate.tplBlog}
          onChange={(v) => updateField('tplBlog', v)}
          price={PRICING.tpl_blog}
        />
        <ToggleSwitch
          label="アーカイブテンプレート"
          description="投稿一覧・カテゴリー一覧"
          checked={estimate.tplArchive}
          onChange={(v) => updateField('tplArchive', v)}
          price={PRICING.tpl_archive}
        />
        <ToggleSwitch
          label="404ページ"
          description="エラーページのデザイン"
          checked={estimate.page404}
          onChange={(v) => updateField('page404', v)}
          price={PRICING.page_404}
        />
      </GroupCard>

      {/* その他オプション */}
      <GroupCard label="その他">
        <ToggleSwitch
          label="レスポンシブ対応"
          description="スマホ・タブレット対応"
          checked={estimate.responsive}
          onChange={(v) => updateField('responsive', v)}
          price={PRICING.opt_responsive}
        />
        <ToggleSwitch
          label="既存サイトからのデータ移行"
          description="リニューアル案件の場合"
          checked={estimate.dataMigration}
          onChange={(v) => updateField('dataMigration', v)}
          price={PRICING.del_migration}
        />
      </GroupCard>

      {/* ナビゲーションボタン */}
      <div className={common.buttons}>
        <button className={common.backButtonDisabled} disabled>
          戻る
        </button>
        <button className={common.nextButton} onClick={onNext}>
          次へ進む
        </button>
      </div>
    </div>
  );
}
