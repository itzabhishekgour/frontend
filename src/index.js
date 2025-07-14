import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './pages/ErrorBoundary';
// import { ThemeProvider } from './components/context/ThemeContext'; // ✅ make sure path is correct

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <ErrorBoundary>
      {/* <ThemeProvider> ✅ Wrap your app with ThemeProvider */}
          <App />
      {/* </ThemeProvider> */}
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
