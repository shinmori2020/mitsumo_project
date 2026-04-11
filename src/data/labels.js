// 共通ラベル定数（Single Source of Truth）

export const SITE_TYPE_LABELS = {
  corporate: 'コーポレート',
  lp: 'LP',
  ec: 'EC',
  blog: 'ブログ',
};

export const BUILD_METHOD_LABELS = {
  wordpress: 'WordPress',
  html: 'HTML/CSS',
};

export const FONT_LABELS = {
  soft: 'やわらかい',
  sharp: 'シャープ',
  formal: 'フォーマル',
  casual: 'カジュアル',
};

export const LAYOUT_LABELS = {
  A: 'パターンA',
  B: 'パターンB',
  C: 'パターンC',
  D: 'パターンD',
};

// 説明付きレイアウトラベル（Excel等の出力用）
export const LAYOUT_LABELS_DETAIL = {
  A: 'パターンA（ヘッダー大・写真メイン）',
  B: 'パターンB（サイドバー付・情報整理型）',
  C: 'パターンC（1カラム・スクロール型）',
  D: 'パターンD（グリッド・ギャラリー型）',
};

export const ANIM_LABELS = {
  none: 'なし',
  simple: 'シンプル',
  rich: 'リッチ',
};

export const SUPPORT_LABELS = {
  none: 'なし',
  light: 'ライト',
  standard: 'スタンダード',
};

// 金額付きサポートラベル（表示用）
export const SUPPORT_LABELS_WITH_PRICE = {
  none: 'なし',
  light: 'ライト（5,000円/月）',
  standard: 'スタンダード（15,000円/月）',
};

export const SUPPORT_PRICES = {
  none: 0,
  light: 5000,
  standard: 15000,
};

export const DEADLINE_LABELS = {
  1.0: '通常',
  1.3: '急ぎ（×1.3）',
  1.5: '特急（×1.5）',
};
