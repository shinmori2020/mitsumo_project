// Step5：見積もり結果（集約・表示・出力画面）
import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';
import { exportExcel } from '../export/ExcelExport';
import { exportPdf } from '../export/PdfExport';
import { copyText } from '../export/TextCopy';
import { sendMail } from '../export/MailSend';
import styles from './Step5Result.module.css';

const DEADLINE_LABELS = { 1.0: '通常', 1.3: '急ぎ ×1.3', 1.5: '特急 ×1.5' };
const SUPPORT_LABELS = { none: 'なし', light: 'ライト（5,000円/月）', standard: 'スタンダード（15,000円/月）' };
const SUPPORT_PRICES = { light: 5000, standard: 15000 };

export default function Step5Result({ estimate, price, onBack, onReset }) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const items = buildBreakdown(estimate);

  // 有効期限の算出
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formatDate = (d) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

  const handleReset = () => {
    if (window.confirm('入力内容をすべてリセットして新しい見積もりを作成しますか？')) {
      onReset();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>見積もり結果</h2>

      {/* 合計金額カード */}
      <div className={styles.priceCard}>
        <div className={styles.priceLabel}>お見積り金額</div>
        {estimate.clientName && (
          <div className={styles.clientName}>{estimate.clientName} 様</div>
        )}
        <div className={styles.totalRow}>
          <span className={styles.totalAmount}>{formatCurrency(price.total)}</span>
          <span className={styles.totalYen}>円</span>
          <span className={styles.totalTaxInc}>(税込)</span>
        </div>
        <hr className={styles.divider} />
        <div className={styles.subRow}>
          <span className={styles.subItem}>
            <span className={styles.subLabel}>税抜</span>
            {formatCurrency(price.afterDiscount)}円
          </span>
          <span className={styles.subItem}>
            <span className={styles.subLabel}>消費税</span>
            {formatCurrency(price.tax)}円
          </span>
        </div>
        {price.discount > 0 && (
          <div className={styles.discountRow}>
            割引 −{formatCurrency(price.discount)}円
          </div>
        )}
      </div>

      {/* 保守プラン */}
      {estimate.supportPlan !== 'none' && (
        <div className={styles.noteText}>
          ※ 別途、月額保守料金：{formatCurrency(SUPPORT_PRICES[estimate.supportPlan])}円/月（{SUPPORT_LABELS[estimate.supportPlan]}）
        </div>
      )}

      {/* 有効期限 */}
      <div className={styles.noteText}>
        見積もり有効期限：{formatDate(today)} 〜 {formatDate(expiryDate)}
      </div>

      {/* 内訳テーブル */}
      <div className={styles.breakdownHeader}>
        <span className={styles.breakdownTitle}>内訳</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#0F6E56', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showBreakdown}
            onChange={() => setShowBreakdown(!showBreakdown)}
          />
          表示
        </label>
      </div>

      {showBreakdown && (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              <th>項目</th>
              <th>数量</th>
              <th>単価</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className={`${styles.tableRow} ${i % 2 === 1 ? styles.tableRowEven : ''}`}>
                <td>{item.label}</td>
                <td>{item.qty}</td>
                <td>¥{formatCurrency(item.unit)}</td>
                <td>¥{formatCurrency(item.qty * item.unit)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.summaryRow}>
              <td colSpan="3">小計（税抜）</td>
              <td style={{ textAlign: 'right' }}>¥{formatCurrency(price.subtotal)}</td>
            </tr>
            {price.deadlineAdjustment > 0 && (
              <tr className={styles.summaryRow}>
                <td colSpan="3">納期調整（{DEADLINE_LABELS[estimate.deadlineRate]}）</td>
                <td style={{ textAlign: 'right' }}>+¥{formatCurrency(price.deadlineAdjustment)}</td>
              </tr>
            )}
            {price.discount > 0 && (
              <tr className={styles.summaryRow}>
                <td colSpan="3">
                  {estimate.discountType === 'amount'
                    ? `値引き`
                    : `${estimate.discountValue}%割引`
                  }
                </td>
                <td style={{ textAlign: 'right' }}>−¥{formatCurrency(price.discount)}</td>
              </tr>
            )}
            <tr className={styles.summaryRow}>
              <td colSpan="3">消費税（10%）</td>
              <td style={{ textAlign: 'right' }}>¥{formatCurrency(price.tax)}</td>
            </tr>
            <tr className={`${styles.summaryRow} ${styles.totalSummaryRow}`}>
              <td colSpan="3">合計（税込）</td>
              <td style={{ textAlign: 'right' }}>¥{formatCurrency(price.total)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      {/* 出力ボタン */}
      <div className={styles.exportGrid}>
        <button className={styles.exportButton} onClick={() => exportExcel(estimate, price)}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#0F6E56' }}>XL</span>
          Excel出力
        </button>
        <button className={styles.exportButton} onClick={async () => {
          try { await exportPdf(estimate, price); }
          catch (e) { alert('PDF生成中にエラーが発生しました'); }
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#C00000' }}>PDF</span>
          PDF出力
        </button>
        <button className={styles.exportButton} onClick={async () => {
          const ok = await copyText(estimate, price);
          if (ok) alert('クリップボードにコピーしました');
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#085041' }}>Cp</span>
          テキストコピー
        </button>
        <button className={styles.exportButton} onClick={() => sendMail(estimate, price)}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#2B4C7E' }}>Mail</span>
          メール送信
        </button>
      </div>

      {/* 下部ボタン */}
      <div className={styles.buttons}>
        <button className={styles.backButton} onClick={onBack}>
          内容を修正する
        </button>
        <button className={styles.resetButton} onClick={handleReset}>
          新しい見積もりを作成
        </button>
      </div>
    </div>
  );
}
