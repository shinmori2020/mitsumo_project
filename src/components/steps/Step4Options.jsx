// Step4：その他オプション（カテゴリ6・7・8 + 割引・備考・ヘッダー情報）
import ToggleSwitch from '../ui/ToggleSwitch';
import DropdownSelect from '../ui/DropdownSelect';
import PillButton from '../ui/PillButton';
import GroupCard from '../ui/GroupCard';
import styles from './Step4Options.module.css';
import common from './StepCommon.module.css';
import { PRICING } from '../../data/pricing';

const SUPPORT_OPTIONS = [
  { value: 'none', label: 'なし' },
  { value: 'light', label: 'ライト（月額5,000円）' },
  { value: 'standard', label: 'スタンダード（月額15,000円）' },
];

const DEADLINE_OPTIONS = [
  { value: 1.0, label: '通常' },
  { value: 1.3, label: '急ぎ（×1.3）' },
  { value: 1.5, label: '特急（×1.5）' },
];

const DISCOUNT_TYPES = [
  { value: 'none', label: 'なし' },
  { value: 'amount', label: '値引き額' },
  { value: 'rate', label: '割引率' },
];

const STEP4_TOGGLE_FIELDS = [
  'optSsl', 'optSeo', 'optSpeed', 'optBrowser', 'optGa', 'optFavicon',
  'delExport', 'delTest', 'delManual', 'delFix',
];

export default function Step4Options({ estimate, updateField, onNext, onBack }) {
  const handleAllOn = () => STEP4_TOGGLE_FIELDS.forEach(f => updateField(f, true));
  const handleAllOff = () => STEP4_TOGGLE_FIELDS.forEach(f => updateField(f, false));

  return (
    <div className={common.container}>
      <div className={common.titleRow}>
        <div>
          <h2 className={common.sectionTitle}>その他オプション</h2>
          <p className={common.sectionDesc}>最適化や納品、料金に関する設定を行います</p>
        </div>
        <div className={common.bulkButtons}>
          <button className={common.bulkButton} onClick={handleAllOn}>すべてON</button>
          <button className={common.bulkButton} onClick={handleAllOff}>すべてOFF</button>
        </div>
      </div>

      {/* 最適化・設定グループ */}
      <GroupCard label="最適化・設定" count={[estimate.optSsl, estimate.optSeo, estimate.optSpeed, estimate.optBrowser, estimate.optGa, estimate.optFavicon].filter(Boolean).length} total={6}>
        <ToggleSwitch
          label="SSL対応"
          checked={estimate.optSsl}
          onChange={(v) => updateField('optSsl', v)}
          price={PRICING.opt_ssl}
        />
        <ToggleSwitch
          label="SEO基本設定"
          description="メタタグ・構造化データ・sitemap"
          checked={estimate.optSeo}
          onChange={(v) => updateField('optSeo', v)}
          price={PRICING.opt_seo}
        />
        <ToggleSwitch
          label="ページ表示速度最適化"
          checked={estimate.optSpeed}
          onChange={(v) => updateField('optSpeed', v)}
          price={PRICING.opt_speed}
        />
        <ToggleSwitch
          label="クロスブラウザ対応"
          checked={estimate.optBrowser}
          onChange={(v) => updateField('optBrowser', v)}
          price={PRICING.opt_browser}
        />
        <ToggleSwitch
          label="GA・サーチコンソール設置"
          checked={estimate.optGa}
          onChange={(v) => updateField('optGa', v)}
          price={PRICING.opt_ga}
        />
        <ToggleSwitch
          label="ファビコン・OGP画像設定"
          checked={estimate.optFavicon}
          onChange={(v) => updateField('optFavicon', v)}
          price={PRICING.opt_favicon}
        />
      </GroupCard>

      {/* 納品関連グループ */}
      <GroupCard label="納品関連" count={[estimate.delExport, estimate.delTest, estimate.delManual, estimate.delFix].filter(Boolean).length} total={4}>
        <ToggleSwitch
          label="デザインデータからの画像書き出し"
          checked={estimate.delExport}
          onChange={(v) => updateField('delExport', v)}
          price={PRICING.del_export}
        />
        <ToggleSwitch
          label="テストサーバーでの検証・納品"
          checked={estimate.delTest}
          onChange={(v) => updateField('delTest', v)}
          price={PRICING.del_test}
        />
        <ToggleSwitch
          label="更新マニュアル作成"
          checked={estimate.delManual}
          onChange={(v) => updateField('delManual', v)}
          price={PRICING.del_manual}
        />
        <ToggleSwitch
          label="公開後の修正対応"
          description="回数制限あり"
          checked={estimate.delFix}
          onChange={(v) => updateField('delFix', v)}
          price={PRICING.del_fix}
        />
      </GroupCard>

      {/* 保守・運用サポート */}
      <GroupCard label="保守・運用サポート">
        <DropdownSelect
          label="保守プラン"
          value={estimate.supportPlan}
          options={SUPPORT_OPTIONS}
          onChange={(v) => updateField('supportPlan', v)}
        />
      </GroupCard>

      {/* 納期・料金調整 */}
      <GroupCard label="納期・料金調整">
        <DropdownSelect
          label="納期"
          description="急ぎ・特急は追加料金が発生します"
          value={estimate.deadlineRate}
          options={DEADLINE_OPTIONS}
          onChange={(v) => updateField('deadlineRate', Number(v))}
        />
      </GroupCard>

      {/* 割引 */}
      <GroupCard label="割引">
        <div className={common.inputGroup}>
          <div className={common.pillGroup}>
            {DISCOUNT_TYPES.map((type) => (
              <PillButton
                key={type.value}
                label={type.label}
                selected={estimate.discountType === type.value}
                onClick={() => {
                  updateField('discountType', type.value);
                  updateField('discountValue', 0);
                }}
              />
            ))}
          </div>
          {estimate.discountType === 'amount' && (
            <div className={styles.discountInput}>
              <input
                type="number"
                className={styles.numberInput}
                min="0"
                value={estimate.discountValue || ''}
                placeholder="0"
                onChange={(e) => {
                  const v = Math.max(0, Number(e.target.value) || 0);
                  updateField('discountValue', v);
                }}
                aria-label="値引き額"
              />
              <span className={styles.inputUnit}>円</span>
            </div>
          )}
          {estimate.discountType === 'rate' && (
            <div className={styles.discountInput}>
              <input
                type="number"
                className={styles.numberInput}
                min="0"
                max="100"
                value={estimate.discountValue || ''}
                placeholder="0"
                onChange={(e) => {
                  const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                  updateField('discountValue', v);
                }}
                aria-label="割引率"
              />
              <span className={styles.inputUnit}>%</span>
            </div>
          )}
        </div>
      </GroupCard>

      {/* 見積もりヘッダー情報 */}
      <GroupCard label="見積もりヘッダー情報">
        <div className={common.inputGroup}>
          <div className={common.inputLabel}>お客様名</div>
          <input
            type="text"
            className={common.textInput}
            placeholder="お客様名（例：サンプル株式会社）"
            value={estimate.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            aria-label="お客様名"
          />
          <div className={common.inputLabel}>納期の希望</div>
          <input
            type="text"
            className={common.textInput}
            placeholder="納期の希望（例：2026年6月末まで）"
            value={estimate.desiredDeadline}
            onChange={(e) => updateField('desiredDeadline', e.target.value)}
            aria-label="納期の希望"
          />
          <div className={common.inputLabel}>見積もり有効期限</div>
          <div className={styles.discountInput}>
            <input
              type="number"
              className={styles.numberInput}
              min="1"
              max="365"
              value={estimate.validityDays}
              onChange={(e) => updateField('validityDays', Math.max(1, Math.min(365, Number(e.target.value) || 30)))}
              aria-label="有効期限日数"
            />
            <span className={styles.inputUnit}>日間</span>
          </div>
        </div>
      </GroupCard>

      {/* 備考情報 */}
      <GroupCard label="備考">
        <div className={common.inputGroup}>
          <div className={common.inputLabel}>デザイン修正の無料回数</div>
          <input
            type="text"
            className={common.textInput}
            placeholder="例：2回まで無料"
            value={estimate.freeRevisions}
            onChange={(e) => updateField('freeRevisions', e.target.value)}
            aria-label="デザイン修正の無料回数"
          />
          <div className={common.inputLabel}>支払いタイミング</div>
          <input
            type="text"
            className={common.textInput}
            placeholder="例：着手時50% 納品時50%"
            value={estimate.paymentTiming}
            onChange={(e) => updateField('paymentTiming', e.target.value)}
            aria-label="支払いタイミング"
          />
          <div className={common.inputLabel}>支払い方法</div>
          <input
            type="text"
            className={common.textInput}
            placeholder="例：銀行振込"
            value={estimate.paymentMethod}
            onChange={(e) => updateField('paymentMethod', e.target.value)}
            aria-label="支払い方法"
          />
          <div className={common.inputLabel}>その他備考</div>
          <textarea
            className={common.textArea}
            placeholder="その他クライアントへの補足事項"
            value={estimate.otherNote}
            onChange={(e) => updateField('otherNote', e.target.value)}
            aria-label="その他備考"
          />
        </div>
      </GroupCard>

      {/* ナビゲーションボタン */}
      <div className={common.buttons}>
        <button className={common.backButton} onClick={onBack}>
          戻る
        </button>
        <button className={common.nextButton} onClick={() => {
          if (!estimate.clientName.trim()) {
            if (!window.confirm('お客様名が未入力です。このまま結果を表示しますか？')) return;
          }
          onNext();
        }}>
          結果を見る
        </button>
      </div>
    </div>
  );
}
