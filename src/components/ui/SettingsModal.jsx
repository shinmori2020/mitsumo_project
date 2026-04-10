// 自社情報設定モーダル
import { useState } from 'react';
import { getCompanyInfo, saveCompanyInfo } from '../../utils/companyInfo';
import { toast } from './Toast';
import styles from './SettingsModal.module.css';

export default function SettingsModal({ onClose }) {
  const [info, setInfo] = useState(getCompanyInfo);

  const update = (field, value) => setInfo(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    saveCompanyInfo(info);
    toast('自社情報を保存しました');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>自社情報設定</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <p className={styles.desc}>PDF・Excelの見積書ヘッダーに表示されます</p>
          <label className={styles.label}>会社名・屋号</label>
          <input className={styles.input} value={info.name} onChange={(e) => update('name', e.target.value)} placeholder="例：株式会社サンプル" />
          <label className={styles.label}>住所</label>
          <input className={styles.input} value={info.address} onChange={(e) => update('address', e.target.value)} placeholder="例：東京都渋谷区..." />
          <label className={styles.label}>電話番号</label>
          <input className={styles.input} value={info.tel} onChange={(e) => update('tel', e.target.value)} placeholder="例：03-1234-5678" />
          <label className={styles.label}>メールアドレス</label>
          <input className={styles.input} value={info.email} onChange={(e) => update('email', e.target.value)} placeholder="例：info@example.com" />
          <label className={styles.label}>WebサイトURL</label>
          <input className={styles.input} value={info.url} onChange={(e) => update('url', e.target.value)} placeholder="例：https://example.com" />
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>キャンセル</button>
          <button className={styles.saveBtn} onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
}
