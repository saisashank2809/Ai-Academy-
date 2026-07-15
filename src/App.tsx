import logo from './assets/logo.png';
import { AcademyAssessmentFlow } from './pages/Academy/AcademyAssessmentFlow';

function App() {
  return (
    <div className="app">
      <div style={{ 
        position: 'absolute', 
        top: '1.5rem', 
        left: '2rem', 
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem'
      }}>
        <img src={logo} alt="Ottobon Logo" style={{ height: '50px', width: 'auto', borderRadius: '50%' }} />
        <span style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          Ottobon Academy
        </span>
      </div>
      <AcademyAssessmentFlow />
    </div>
  );
}

export default App;
