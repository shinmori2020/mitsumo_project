// MitsuMO - コーディング見積もりシミュレーター
import { useState } from 'react';
import { useEstimate } from './hooks/useEstimate';
import StepIndicator from './components/ui/StepIndicator';
import PriceBar from './components/ui/PriceBar';
import Sidebar from './components/ui/Sidebar';
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import './App.css';

function App() {
  const { estimate, updateField, currentStep, setCurrentStep, price, resetEstimate } = useEstimate();
  const [sidebarPosition, setSidebarPosition] = useState('left');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleSidebar = () => {
    setSidebarPosition(prev => prev === 'left' ? 'right' : 'left');
  };

  return (
    <div className="app">
      <div className={`layout ${sidebarPosition === 'right' ? 'layout-right' : 'layout-left'}`}>
        <div className="sidebar-wrapper">
          <Sidebar estimate={estimate} price={price} position={sidebarPosition} />
        </div>

        <div className="main-column">
          <StepIndicator
            currentStep={currentStep}
            sidebarPosition={sidebarPosition}
            onToggleSidebar={toggleSidebar}
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          <main className="main-content">
            {currentStep === 1 && (
              <Step1BasicInfo
                estimate={estimate}
                updateField={updateField}
                onNext={handleNext}
              />
            )}
            {currentStep >= 2 && (
              <div style={{ padding: '24px', paddingBottom: '100px', textAlign: 'center', color: '#0F6E56' }}>
                <p>Step {currentStep} は今後実装予定です</p>
              </div>
            )}
          </main>

          <PriceBar price={price} />
        </div>
      </div>

      {/* モバイル用オーバーレイサイドバー */}
      <div className={`mobile-overlay ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-backdrop" onClick={() => setMobileSidebarOpen(false)} />
        <div className="mobile-sidebar">
          <button
            className="mobile-close"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="閉じる"
          >
            ✕
          </button>
          <Sidebar estimate={estimate} price={price} position="left" />
        </div>
      </div>
    </div>
  );
}

export default App;
