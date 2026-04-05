// 金額バー（下部固定）
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './PriceBar.module.css';

export default function PriceBar({ price }) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.barLabel}>現在の見積もり金額</span>
        <div className={styles.priceRow}>
          <span className={styles.taxLabel}>税抜</span>
          <span className={styles.price}>{formatCurrency(price.afterDiscount)}</span>
          <span className={styles.yen}>円</span>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.taxIncLabel}>税込</span>
        <span className={styles.taxIncPrice}>{formatCurrency(price.total)}円</span>
      </div>
    </div>
  );
}
