// 見積もり比較モーダル
import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';
import { calculatePrice } from '../../utils/calculatePrice';
import { getHistory } from '../../utils/estimateHistory';
import styles from './CompareModal.module.css';

export default function CompareModal({ currentEstimate, currentPrice, onClose }) {
  const [history] = useState(getHistory);
  const [selectedId, setSelectedId] = useState(null);

  const selectedEntry = history.find(h => h.id === selectedId);
  const comparePrice = selectedEntry ? calculatePrice(selectedEntry.estimate) : null;
  const currentItems = buildBreakdown(currentEstimate);
  const compareItems = selectedEntry ? buildBreakdown(selectedEntry.estimate) : [];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>見積もり比較</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {!selectedEntry ? (
          <div className={styles.selectPanel}>
            <p className={styles.selectLabel}>比較する見積もりを選んでください</p>
            {history.length === 0 ? (
              <p className={styles.emptyNote}>保存済みの見積もりがありません。Step5で「履歴に保存」してください。</p>
            ) : (
              <div className={styles.historyList}>
                {history.map((entry) => (
                  <button
                    key={entry.id}
                    className={styles.historyItem}
                    onClick={() => setSelectedId(entry.id)}
                  >
                    <span className={styles.historyName}>{entry.clientName}</span>
                    <span className={styles.historyMeta}>{entry.date}　¥{formatCurrency(entry.total)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.compareContent}>
            {/* 金額比較 */}
            <div className={styles.priceCompare}>
              <div className={styles.priceCol}>
                <div className={styles.colLabel}>現在の見積もり</div>
                <div className={styles.colAmount}>¥{formatCurrency(currentPrice.total)}</div>
                <div className={styles.colSub}>税抜 ¥{formatCurrency(currentPrice.afterDiscount)}</div>
              </div>
              <div className={styles.diffCol}>
                <div className={styles.diffLabel}>差額</div>
                <div className={`${styles.diffAmount} ${currentPrice.total - comparePrice.total > 0 ? styles.diffPlus : styles.diffMinus}`}>
                  {currentPrice.total - comparePrice.total > 0 ? '+' : ''}
                  ¥{formatCurrency(currentPrice.total - comparePrice.total)}
                </div>
              </div>
              <div className={styles.priceCol}>
                <div className={styles.colLabel}>{selectedEntry.clientName}</div>
                <div className={styles.colAmount}>¥{formatCurrency(comparePrice.total)}</div>
                <div className={styles.colSub}>税抜 ¥{formatCurrency(comparePrice.afterDiscount)}</div>
              </div>
            </div>

            {/* 項目比較テーブル */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>現在</th>
                    <th>{selectedEntry.clientName}</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allLabels = new Set([
                      ...currentItems.map(i => i.label),
                      ...compareItems.map(i => i.label),
                    ]);
                    return [...allLabels].map((label) => {
                      const cur = currentItems.find(i => i.label === label);
                      const cmp = compareItems.find(i => i.label === label);
                      const curTotal = cur ? cur.qty * cur.unit : 0;
                      const cmpTotal = cmp ? cmp.qty * cmp.unit : 0;
                      const isDiff = curTotal !== cmpTotal;
                      return (
                        <tr key={label} className={isDiff ? styles.diffRow : ''}>
                          <td>{label}</td>
                          <td className={styles.amountCell}>
                            {cur ? `¥${formatCurrency(curTotal)}` : '—'}
                          </td>
                          <td className={styles.amountCell}>
                            {cmp ? `¥${formatCurrency(cmpTotal)}` : '—'}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            <button className={styles.backBtn} onClick={() => setSelectedId(null)}>
              別の見積もりを選ぶ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
