// Step2：機能選択（カテゴリ3・カテゴリ4・カテゴリ5）
import ToggleSwitch from '../ui/ToggleSwitch';
import DropdownSelect from '../ui/DropdownSelect';
import GroupCard from '../ui/GroupCard';
import styles from './Step2Features.module.css';
import common from './StepCommon.module.css';
import { PRICING } from '../../data/pricing';

const ANIM_OPTIONS = [
  { value: 'none', label: 'なし' },
  { value: 'simple', label: 'シンプル（15,000円）' },
  { value: 'rich', label: 'リッチ（40,000円）' },
];

const STEP2_TOGGLE_FIELDS = [
  'funcForm', 'funcBlog', 'funcSearch', 'funcFilter', 'funcPagination', 'funcBreadcrumb',
  'funcSlider', 'funcAccordion', 'funcModal', 'funcSns', 'funcMap',
  'wpAcf', 'wpAdmin', 'wpPlugin', 'ecBase', 'ecProduct', 'ecCart',
];

export default function Step2Features({ estimate, updateField, onNext, onBack }) {
  const isWordPress = estimate.buildMethod === 'wordpress';
  const isEC = estimate.siteType === 'ec';

  const handleAllOn = () => {
    STEP2_TOGGLE_FIELDS.forEach(f => updateField(f, true));
    updateField('animLevel', 'rich');
  };
  const handleAllOff = () => {
    STEP2_TOGGLE_FIELDS.forEach(f => updateField(f, false));
    updateField('animLevel', 'none');
  };

  return (
    <div className={common.container}>
      <div className={common.titleRow}>
        <div>
          <h2 className={common.sectionTitle}>機能選択</h2>
          <p className={common.sectionDesc}>サイトに必要な機能を選択してください</p>
        </div>
        <div className={common.bulkButtons}>
          <button className={common.bulkButton} onClick={handleAllOn}>すべてON</button>
          <button className={common.bulkButton} onClick={handleAllOff}>すべてOFF</button>
        </div>
      </div>

      {/* 基本機能グループ */}
      <GroupCard label="基本機能" count={[estimate.funcForm, estimate.funcBlog, estimate.funcSearch, estimate.funcFilter, estimate.funcPagination, estimate.funcBreadcrumb].filter(Boolean).length} total={6}>
        <ToggleSwitch
          label="お問い合わせフォーム"
          description="確認画面・完了画面含む"
          checked={estimate.funcForm}
          onChange={(v) => updateField('funcForm', v)}
          price={PRICING.func_form}
        />
        <ToggleSwitch
          label="ブログ・新着情報機能"
          description="カスタム投稿タイプ含む"
          checked={estimate.funcBlog}
          onChange={(v) => updateField('funcBlog', v)}
          price={PRICING.func_blog}
        />
        <ToggleSwitch
          label="検索機能"
          checked={estimate.funcSearch}
          onChange={(v) => updateField('funcSearch', v)}
          price={PRICING.func_search}
        />
        <ToggleSwitch
          label="カテゴリー・タグ絞り込み"
          checked={estimate.funcFilter}
          onChange={(v) => updateField('funcFilter', v)}
          price={PRICING.func_filter}
        />
        <ToggleSwitch
          label="ページネーション"
          checked={estimate.funcPagination}
          onChange={(v) => updateField('funcPagination', v)}
          price={PRICING.func_pagination}
        />
        <ToggleSwitch
          label="パンくずリスト"
          checked={estimate.funcBreadcrumb}
          onChange={(v) => updateField('funcBreadcrumb', v)}
          price={PRICING.func_breadcrumb}
        />
      </GroupCard>

      {/* UIパーツグループ */}
      <GroupCard label="UIパーツ" count={[estimate.funcSlider, estimate.funcAccordion, estimate.funcModal, estimate.animLevel !== 'none'].filter(Boolean).length} total={4}>
        <ToggleSwitch
          label="スライダー・カルーセル"
          checked={estimate.funcSlider}
          onChange={(v) => updateField('funcSlider', v)}
          price={PRICING.func_slider}
        />
        <ToggleSwitch
          label="アコーディオン・タブ切り替え"
          checked={estimate.funcAccordion}
          onChange={(v) => updateField('funcAccordion', v)}
          price={PRICING.func_accordion}
        />
        <ToggleSwitch
          label="モーダル（ポップアップ）"
          checked={estimate.funcModal}
          onChange={(v) => updateField('funcModal', v)}
          price={PRICING.func_modal}
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
      <GroupCard label="外部連携" count={[estimate.funcSns, estimate.funcMap].filter(Boolean).length} total={2}>
        <ToggleSwitch
          label="SNS連携"
          description="OGP設定・シェアボタン"
          checked={estimate.funcSns}
          onChange={(v) => updateField('funcSns', v)}
          price={PRICING.func_sns}
        />
        <ToggleSwitch
          label="Googleマップ埋め込み"
          checked={estimate.funcMap}
          onChange={(v) => updateField('funcMap', v)}
          price={PRICING.func_map}
        />
      </GroupCard>

      {/* WordPress固有グループ */}
      {isWordPress && (
        <GroupCard label="WordPress固有" count={[estimate.wpAcf, estimate.wpAdmin, estimate.wpPlugin].filter(Boolean).length} total={3}>
          <ToggleSwitch
            label="カスタムフィールド構築"
            description="ACF等を使った入力欄の作成"
            checked={estimate.wpAcf}
            onChange={(v) => updateField('wpAcf', v)}
            price={PRICING.wp_acf}
          />
          <ToggleSwitch
            label="WP管理画面カスタマイズ"
            description="投稿画面の使いやすさ調整"
            checked={estimate.wpAdmin}
            onChange={(v) => updateField('wpAdmin', v)}
            price={PRICING.wp_admin}
          />
          <ToggleSwitch
            label="プラグイン選定・セットアップ"
            checked={estimate.wpPlugin}
            onChange={(v) => updateField('wpPlugin', v)}
            price={PRICING.wp_plugin}
          />
        </GroupCard>
      )}

      {/* EC関連グループ */}
      {isEC ? (
        <GroupCard label="EC関連" count={[estimate.ecBase, estimate.ecProduct, estimate.ecCart].filter(Boolean).length} total={3}>
          <ToggleSwitch
            label="EC基本構築"
            description="WooCommerce等"
            checked={estimate.ecBase}
            onChange={(v) => updateField('ecBase', v)}
            price={PRICING.ec_base}
          />
          <ToggleSwitch
            label="商品ページテンプレート"
            checked={estimate.ecProduct}
            onChange={(v) => updateField('ecProduct', v)}
            price={PRICING.ec_product}
          />
          <ToggleSwitch
            label="カート・決済連携"
            checked={estimate.ecCart}
            onChange={(v) => updateField('ecCart', v)}
            price={PRICING.ec_cart}
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
      <div className={common.buttons}>
        <button className={common.backButton} onClick={onBack}>
          戻る
        </button>
        <button className={common.nextButton} onClick={onNext}>
          次へ進む
        </button>
      </div>
    </div>
  );
}
