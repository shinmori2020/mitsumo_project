// MitsuMO - コーディング見積もりシミュレーター
import { useState, useRef, useEffect, useCallback } from 'react';
import { useEstimate } from './hooks/useEstimate';
import StepIndicator from './components/ui/StepIndicator';
import PriceBar from './components/ui/PriceBar';
import Sidebar from './components/ui/Sidebar';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2Features from './components/steps/Step2Features';
import Step3Design from './components/steps/Step3Design';
import Step4Options from './components/steps/Step4Options';
import Step5Result from './components/steps/Step5Result';
import SettingsModal from './components/ui/SettingsModal';
import ToastContainer from './components/ui/Toast';
import './App.css';

function App() {
  const { estimate, updateField, currentStep, setCurrentStep, price, resetEstimate, loadEstimate } = useEstimate();
  const [sidebarPosition, setSidebarPosition] = useState('left');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [fading, setFading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const mainRef = useRef(null);

  // フェードトランジション付きステップ切り替え
  const changeStep = (newStep) => {
    setFading(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      window.scrollTo({ top: 0 });
      setTimeout(() => setFading(false), 30);
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < 5) changeStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) changeStep(currentStep - 1);
  };

  const handleStepClick = (step) => {
    if (step < currentStep) changeStep(step);
  };

  const toggleSidebar = () => {
    setSidebarPosition(prev => prev === 'left' ? 'right' : 'left');
  };

  // キーボードショートカット
  const handleKeyDown = useCallback((e) => {
    // テキスト入力中は無効
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        if (currentStep === 5) {
          import('./utils/estimateHistory').then(({ saveToHistory }) => {
            saveToHistory(estimate, price);
            import('./components/ui/Toast').then(({ toast }) => toast('見積もりを履歴に保存しました'));
          });
        }
      }
      if (e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    }

    if (e.key === 'ArrowRight' && currentStep < 5) handleNext();
    if (e.key === 'ArrowLeft' && currentStep > 1) handleBack();
  }, [currentStep, estimate, price]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  return (
    <div className="app">
      {/* モバイル用ハンバーガーボタン（ルートレベルで最前面に配置） */}
      <button
        type="button"
        className={`mobile-hamburger ${mobileSidebarOpen ? 'mobile-hamburger-open' : ''}`}
        onClick={toggleMobileSidebar}
        aria-label={mobileSidebarOpen ? '閉じる' : '選択内容を表示'}
      >
        <span className="mobile-hamburger-line" />
        <span className="mobile-hamburger-line" />
        <span className="mobile-hamburger-line" />
      </button>

      <div className={`layout ${sidebarPosition === 'right' ? 'layout-right' : 'layout-left'}`}>
        <div className="sidebar-wrapper">
          <Sidebar estimate={estimate} price={price} position={sidebarPosition} />
        </div>

        <div className="main-column">
          <StepIndicator
            currentStep={currentStep}
            sidebarPosition={sidebarPosition}
            onToggleSidebar={toggleSidebar}
            onStepClick={handleStepClick}
            onOpenSettings={() => setShowSettings(true)}
          />

          <main ref={mainRef} className={`main-content ${fading ? 'main-fade-out' : 'main-fade-in'}`}>
            {currentStep === 1 && (
              <Step1BasicInfo
                estimate={estimate}
                updateField={updateField}
                onNext={handleNext}
                onLoadEstimate={loadEstimate}
                onReset={resetEstimate}
              />
            )}
            {currentStep === 2 && (
              <Step2Features
                estimate={estimate}
                updateField={updateField}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <Step3Design
                estimate={estimate}
                updateField={updateField}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <Step4Options
                estimate={estimate}
                updateField={updateField}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 5 && (
              <Step5Result
                estimate={estimate}
                price={price}
                onGoToStep={changeStep}
                onReset={resetEstimate}
              />
            )}
          </main>

          {currentStep !== 5 && <PriceBar price={price} />}
        </div>
      </div>

      {/* モバイル用オーバーレイサイドバー */}
      <div className={`mobile-overlay ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-backdrop" onClick={() => setMobileSidebarOpen(false)} />
        <div className="mobile-sidebar">
          <Sidebar estimate={estimate} price={price} position="left" />
        </div>
      </div>

      {/* 設定モーダル */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* トースト通知 */}
      <ToastContainer />
    </div>
  );
}

export default App;
