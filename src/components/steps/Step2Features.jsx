// Step2：機能選択（カテゴリ3・カテゴリ4・カテゴリ5）
import ToggleSwitch from '../ui/ToggleSwitch';
import DropdownSelect from '../ui/DropdownSelect';
import GroupCard from '../ui/GroupCard';
import styles from './Step2Features.module.css';

const ANIM_OPTIONS = [
  { value: 'none', label: 'なし' },
  { value: 'simple', label: 'シンプル（15,000円）' },
  { value: 'rich', label: 'リッチ（40,000円）' },
];

export default function Step2Features({ estimate, updateField, onNext, onBack }) {
  const isWordPress = estimate.buildMethod === 'wordpress';
  const isEC = estimate.siteType === 'ec';

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>機能選択</h2>
      <p className={styles.sectionDesc}>サイトに必要な機能を選択してください</p>

      {/* 基本機能グループ */}
      <GroupCard label="基本機能">
        <ToggleSwitch
          label="お問い合わせフォーム"
          description="確認画面・完了画面含む"
          checked={estimate.funcForm}
          onChange={(v) => updateField('funcForm', v)}
        />
        <ToggleSwitch
          label="ブログ・新着情報機能"
          description="カスタム投稿タイプ含む"
          checked={estimate.funcBlog}
          onChange={(v) => updateField('funcBlog', v)}
        />
        <ToggleSwitch
          label="検索機能"
          checked={estimate.funcSearch}
          onChange={(v) => updateField('funcSearch', v)}
        />
        <ToggleSwitch
          label="カテゴリー・タグ絞り込み"
          checked={estimate.funcFilter}
          onChange={(v) => updateField('funcFilter', v)}
        />
        <ToggleSwitch
          label="ページネーション"
          checked={estimate.funcPagination}
          onChange={(v) => updateField('funcPagination', v)}
        />
        <ToggleSwitch
          label="パンくずリスト"
          checked={estimate.funcBreadcrumb}
          onChange={(v) => updateField('funcBreadcrumb', v)}
        />
      </GroupCard>

      {/* UIパーツグループ */}
      <GroupCard label="UIパーツ">
        <ToggleSwitch
          label="スライダー・カルーセル"
          checked={estimate.funcSlider}
          onChange={(v) => updateField('funcSlider', v)}
        />
        <ToggleSwitch
          label="アコーディオン・タブ切り替え"
          checked={estimate.funcAccordion}
          onChange={(v) => updateField('funcAccordion', v)}
        />
        <ToggleSwitch
          label="モーダル（ポップアップ）"
          checked={estimate.funcModal}
          onChange={(v) => updateField('funcModal', v)}
        />
        <DropdownSelect
          label="アニメーション"
          description="フェードイン、パララックス等"
          value={estimate.animLevel}
          options={ANIM_OPTIONS}
          onChange={(v) => updateField('animLevel', v)}
        />
      </GroupCard>

      {/* 外部連携グループ */}
      <GroupCard label="外部連携">
        <ToggleSwitch
          label="SNS連携"
          description="OGP設定・シェアボタン"
          checked={estimate.funcSns}
          onChange={(v) => updateField('funcSns', v)}
        />
        <ToggleSwitch
          label="Googleマップ埋め込み"
          checked={estimate.funcMap}
          onChange={(v) => updateField('funcMap', v)}
        />
      </GroupCard>

      {/* WordPress固有グループ */}
      {isWordPress && (
        <GroupCard label="WordPress固有">
          <ToggleSwitch
            label="カスタムフィールド構築"
            description="ACF等を使った入力欄の作成"
            checked={estimate.wpAcf}
            onChange={(v) => updateField('wpAcf', v)}
          />
          <ToggleSwitch
            label="WP管理画面カスタマイズ"
            description="投稿画面の使いやすさ調整"
            checked={estimate.wpAdmin}
            onChange={(v) => updateField('wpAdmin', v)}
          />
          <ToggleSwitch
            label="プラグイン選定・セットアップ"
            checked={estimate.wpPlugin}
            onChange={(v) => updateField('wpPlugin', v)}
          />
        </GroupCard>
      )}

      {/* EC関連グループ */}
      {isEC ? (
        <GroupCard label="EC関連">
          <ToggleSwitch
            label="EC基本構築"
            description="WooCommerce等"
            checked={estimate.ecBase}
            onChange={(v) => updateField('ecBase', v)}
          />
          <ToggleSwitch
            label="商品ページテンプレート"
            checked={estimate.ecProduct}
            onChange={(v) => updateField('ecProduct', v)}
          />
          <ToggleSwitch
            label="カート・決済連携"
            checked={estimate.ecCart}
            onChange={(v) => updateField('ecCart', v)}
          />
        </GroupCard>
      ) : (
        <GroupCard label="EC関連">
          <div className={styles.disabledNote}>
            Step1 で「EC」を選択した場合のみ表示されます
          </div>
        </GroupCard>
      )}

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
