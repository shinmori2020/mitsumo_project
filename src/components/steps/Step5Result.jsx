// Step5：見積もり結果（集約・表示・出力画面）
import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';
import { toast } from '../ui/Toast';
// 出力モジュールはdynamic importで必要時に読み込み（コード分割）
import { encodeEstimateToUrl } from '../../hooks/useEstimate';
import { saveToHistory } from '../../utils/estimateHistory';
import CompareModal from './CompareModal';
import { ExcelIcon, PdfIcon, CopyIcon, MailIcon, LinkIcon, SaveIcon, CompareIcon } from '../ui/ExportIcons';
import { DEADLINE_LABELS, SUPPORT_LABELS_WITH_PRICE as SUPPORT_LABELS, SUPPORT_PRICES } from '../../data/labels';
import styles from './Step5Result.module.css';

export default function Step5Result({ estimate, price, onReset, onGoToStep }) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const items = buildBreakdown(estimate);

  // 有効期限の算出
  const today = new Date();
  const expiryDate = new Date(today);
  expiryDate.setDate(expiryDate.getDate() + (estimate.validityDays || 30));
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
            {(() => {
              let rowIndex = 0;
              let lastCategory = '';
              return items.map((item, i) => {
                const rows = [];
                if (item.category !== lastCategory) {
                  lastCategory = item.category;
                  rows.push(
                    <tr key={`cat-${item.category}`} className={styles.categoryRow}>
                      <td colSpan="4">{item.category}</td>
                    </tr>
                  );
                }
                rows.push(
                  <tr key={i} className={`${styles.tableRow} ${rowIndex % 2 === 1 ? styles.tableRowEven : ''}`}>
                    <td>{item.label}</td>
                    <td>{item.qty}</td>
                    <td>¥{formatCurrency(item.unit)}</td>
                    <td>¥{formatCurrency(item.qty * item.unit)}</td>
                  </tr>
                );
                rowIndex++;
                return rows;
              });
            })()}
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
        <button className={styles.exportButton} onClick={async () => {
          const { exportExcel } = await import('../export/ExcelExport');
          exportExcel(estimate, price);
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#0F6E56' }}><ExcelIcon /></span>
          Excel出力
        </button>
        <button className={styles.exportButton} disabled={pdfLoading} onClick={async () => {
          setPdfLoading(true);
          try {
            const { exportPdf } = await import('../export/PdfExport');
            await exportPdf(estimate, price);
          } catch (e) { alert('PDF生成中にエラーが発生しました'); }
          finally { setPdfLoading(false); }
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#C00000' }}><PdfIcon /></span>
          {pdfLoading ? 'PDF生成中...' : 'PDF出力'}
        </button>
        <button className={styles.exportButton} onClick={async () => {
          const { copyText } = await import('../export/TextCopy');
          const ok = await copyText(estimate, price);
          if (ok) toast('クリップボードにコピーしました');
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#085041' }}><CopyIcon /></span>
          テキストコピー
        </button>
        <button className={styles.exportButton} onClick={async () => {
          const { sendMail } = await import('../export/MailSend');
          sendMail(estimate, price);
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#2B4C7E' }}><MailIcon /></span>
          メール送信
        </button>
        <button className={styles.exportButton} onClick={async () => {
          const url = encodeEstimateToUrl(estimate, 5);
          try {
            await navigator.clipboard.writeText(url);
            toast('共有URLをコピーしました');
          } catch {
            prompt('以下のURLをコピーしてください:', url);
          }
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#1D9E75' }}><LinkIcon /></span>
          URLを共有
        </button>
        <button className={styles.exportButton} onClick={() => {
          saveToHistory(estimate, price);
          toast('見積もりを履歴に保存しました');
        }}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#5DCAA5' }}><SaveIcon /></span>
          履歴に保存
        </button>
        <button className={styles.exportButton} onClick={() => setShowCompare(true)}>
          <span className={styles.exportIcon} style={{ backgroundColor: '#085041' }}><CompareIcon /></span>
          見積もり比較
        </button>
      </div>

      {showCompare && (
        <CompareModal
          currentEstimate={estimate}
          currentPrice={price}
          onClose={() => setShowCompare(false)}
        />
      )}

      {/* 修正ナビゲーション */}
      <div className={styles.editNav}>
        <div className={styles.editLabel}>内容を修正する</div>
        <div className={styles.editSteps}>
          <button className={styles.editStepButton} onClick={() => onGoToStep(1)}>Step1 基本情報</button>
          <button className={styles.editStepButton} onClick={() => onGoToStep(2)}>Step2 機能選択</button>
          <button className={styles.editStepButton} onClick={() => onGoToStep(3)}>Step3 デザイン</button>
          <button className={styles.editStepButton} onClick={() => onGoToStep(4)}>Step4 オプション</button>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className={styles.buttons}>
        <button className={styles.resetButton} onClick={handleReset}>
          新しい見積もりを作成
        </button>
      </div>
    </div>
  );
}
