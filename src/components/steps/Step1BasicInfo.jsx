// Step1：サイトの基本情報（カテゴリ1・カテゴリ2）
import PillButton from '../ui/PillButton';
import ToggleSwitch from '../ui/ToggleSwitch';
import Slider from '../ui/Slider';
import GroupCard from '../ui/GroupCard';
import styles from './Step1BasicInfo.module.css';

const SITE_TYPES = [
  { value: 'corporate', label: 'コーポレート' },
  { value: 'lp', label: 'LP' },
  { value: 'ec', label: 'EC' },
  { value: 'blog', label: 'ブログ' },
];

const BUILD_METHODS = [
  { value: 'wordpress', label: 'WordPress' },
  { value: 'html', label: 'HTML・CSS' },
];

export default function Step1BasicInfo({ estimate, updateField, onNext }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>サイトの基本情報</h2>
      <p className={styles.sectionDesc}>サイトの種類や構成を選択してください</p>

      {/* サイトの種類 */}
      <GroupCard label="サイトの種類">
        <div style={{ padding: '14px 16px' }}>
          <div className={styles.pillGroup}>
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
          <div className={styles.pillGroup}>
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
        />
        <ToggleSwitch
          label="アーカイブテンプレート"
          description="投稿一覧・カテゴリー一覧"
          checked={estimate.tplArchive}
          onChange={(v) => updateField('tplArchive', v)}
        />
        <ToggleSwitch
          label="404ページ"
          description="エラーページのデザイン"
          checked={estimate.page404}
          onChange={(v) => updateField('page404', v)}
        />
      </GroupCard>

      {/* その他オプション */}
      <GroupCard label="その他">
        <ToggleSwitch
          label="レスポンシブ対応"
          description="スマホ・タブレット対応"
          checked={estimate.responsive}
          onChange={(v) => updateField('responsive', v)}
        />
        <ToggleSwitch
          label="既存サイトからのデータ移行"
          description="リニューアル案件の場合"
          checked={estimate.dataMigration}
          onChange={(v) => updateField('dataMigration', v)}
        />
      </GroupCard>

      {/* ナビゲーションボタン */}
      <div className={styles.buttons}>
        <button className={styles.backButton} disabled>
          戻る
        </button>
        <button className={styles.nextButton} onClick={onNext}>
          次へ進む
        </button>
      </div>
    </div>
  );
}
