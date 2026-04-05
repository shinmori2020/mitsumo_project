import { useState } from 'react';
import { calculatePrice } from '../utils/calculatePrice';

// 見積もりの初期状態
const initialEstimate = {
  // Step1：サイトの基本情報
  siteType: 'corporate',
  buildMethod: 'wordpress',
  topPage: true,
  subPageCount: 5,
  lpPageCount: 0,
  tplBlog: true,
  tplArchive: true,
  page404: false,
  responsive: true,
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
  colorMain: '#1D9E75',
  colorSub: '#E1F5EE',
  colorAccent: '#F59E0B',
  fontStyle: 'soft',
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
};

// 見積もり状態管理カスタムフック
export function useEstimate() {
  const [estimate, setEstimate] = useState(initialEstimate);
  const [currentStep, setCurrentStep] = useState(1);

  // 個別フィールドの更新
  const updateField = (field, value) => {
    setEstimate(prev => ({ ...prev, [field]: value }));
  };

  // 金額計算
  const price = calculatePrice(estimate);

  // 全リセット
  const resetEstimate = () => {
    setEstimate(initialEstimate);
    setCurrentStep(1);
  };

  return {
    estimate,
    updateField,
    currentStep,
    setCurrentStep,
    price,
    resetEstimate,
  };
}
