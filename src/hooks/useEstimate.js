import { useState, useEffect } from 'react';
import { calculatePrice } from '../utils/calculatePrice';

const STORAGE_KEY = 'mitsumo_estimate';
const STEP_KEY = 'mitsumo_step';

// 見積もりの初期状態
const initialEstimate = {
  // Step1：サイトの基本情報
  siteType: 'corporate',
  buildMethod: 'html',
  topPage: false,
  subPageCount: 0,
  lpPageCount: 0,
  tplBlog: false,
  tplArchive: false,
  page404: false,
  responsive: false,
  dataMigration: false,

  // Step2：機能選択
  funcForm: false,
  funcBlog: false,
  funcSearch: false,
  funcFilter: false,
  funcPagination: false,
  funcBreadcrumb: false,
  funcSlider: false,
  funcAccordion: false,
  funcModal: false,
  animLevel: 'none',
  funcSns: false,
  funcMap: false,
  wpAcf: false,
  wpAdmin: false,
  wpPlugin: false,
  ecBase: false,
  ecProduct: false,
  ecCart: false,

  // Step3：デザイン仕様（金額に影響しない）
  colorMain: '#2B4C7E',
  colorSub: '#4A90D9',
  colorAccent: '#E8913A',
  fontStyle: 'sharp',
  layoutPattern: 'A',
  referenceUrl1: '',
  referenceUrl2: '',
  designNote: '',

  // Step4：その他オプション
  optSsl: false,
  optSeo: false,
  optSpeed: false,
  optBrowser: false,
  optGa: false,
  optFavicon: false,
  delExport: false,
  delTest: false,
  delManual: false,
  delFix: false,
  supportPlan: 'none',
  deadlineRate: 1.0,
  discountType: 'none',
  discountValue: 0,
  clientName: '',
  desiredDeadline: '',
  freeRevisions: '',
  paymentTiming: '',
  paymentMethod: '',
  otherNote: '',
  validityDays: 30,
};

// URLパラメータから復元
function loadFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('d');
    if (data) {
      const decoded = JSON.parse(atob(data));
      // URL読み込み後、パラメータをクリア（ブックマーク汚染防止）
      window.history.replaceState({}, '', window.location.pathname);
      return { estimate: { ...initialEstimate, ...decoded.e }, step: decoded.s || 5 };
    }
  } catch {}
  return null;
}

// LocalStorageから復元
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialEstimate, ...parsed };
    }
  } catch {}
  return initialEstimate;
}

function loadStepFromStorage() {
  try {
    const saved = localStorage.getItem(STEP_KEY);
    if (saved) return Number(saved) || 1;
  } catch {}
  return 1;
}

// 見積もり状態をURLパラメータにエンコード
export function encodeEstimateToUrl(estimate, step) {
  const data = btoa(JSON.stringify({ e: estimate, s: step }));
  return `${window.location.origin}${window.location.pathname}?d=${data}`;
}

// 見積もり状態管理カスタムフック
export function useEstimate() {
  // URL > LocalStorage > 初期値 の優先順で復元
  const urlData = loadFromUrl();

  const [estimate, setEstimate] = useState(
    urlData ? urlData.estimate : loadFromStorage
  );
  const [currentStep, setCurrentStep] = useState(
    urlData ? urlData.step : loadStepFromStorage
  );

  // LocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estimate));
    } catch {}
  }, [estimate]);

  useEffect(() => {
    try {
      localStorage.setItem(STEP_KEY, String(currentStep));
    } catch {}
  }, [currentStep]);

  // 個別フィールドの更新（連動リセット付き）
  const updateField = (field, value) => {
    setEstimate(prev => {
      const next = { ...prev, [field]: value };

      // 制作方式がHTMLに変わったらWP固有項目をリセット
      if (field === 'buildMethod' && value === 'html') {
        next.wpAcf = false;
        next.wpAdmin = false;
        next.wpPlugin = false;
      }

      // サイト種類がEC以外に変わったらEC項目をリセット
      if (field === 'siteType' && value !== 'ec') {
        next.ecBase = false;
        next.ecProduct = false;
        next.ecCart = false;
      }

      return next;
    });
  };

  // 金額計算
  const price = calculatePrice(estimate);

  // 全リセット
  const resetEstimate = () => {
    setEstimate(initialEstimate);
    setCurrentStep(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
    } catch {}
  };

  // 履歴から読み込み
  const loadEstimate = (savedEstimate) => {
    setEstimate({ ...initialEstimate, ...savedEstimate });
    setCurrentStep(1);
  };

  return {
    estimate,
    updateField,
    currentStep,
    setCurrentStep,
    price,
    resetEstimate,
    loadEstimate,
  };
}
