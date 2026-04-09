// MitsuMO - コーディング見積もりシミュレーター
import { useState, useRef } from 'react';
import { useEstimate } from './hooks/useEstimate';
import StepIndicator from './components/ui/StepIndicator';
import PriceBar from './components/ui/PriceBar';
import Sidebar from './components/ui/Sidebar';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2Features from './components/steps/Step2Features';
import Step3Design from './components/steps/Step3Design';
import Step4Options from './components/steps/Step4Options';
import Step5Result from './components/steps/Step5Result';
import './App.css';

function App() {
  const { estimate, updateField, currentStep, setCurrentStep, price, resetEstimate } = useEstimate();
  const [sidebarPosition, setSidebarPosition] = useState('left');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [fading, setFading] = useState(false);
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
          />

          <main ref={mainRef} className={`main-content ${fading ? 'main-fade-out' : 'main-fade-in'}`}>
            {currentStep === 1 && (
              <Step1BasicInfo
                estimate={estimate}
                updateField={updateField}
                onNext={handleNext}
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
                onBack={handleBack}
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
    </div>
  );
}

export default App;
