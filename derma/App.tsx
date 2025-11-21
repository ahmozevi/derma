import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { History } from './pages/History';
import { FindHelp } from './pages/FindHelp';
import { CaseProvider } from './context/CaseContext';

const App: React.FC = () => {
  return (
    <HashRouter>
      <CaseProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="analyze" element={<Analysis />} />
            <Route path="history" element={<History />} />
            <Route path="find-help" element={<FindHelp />} />
          </Route>
        </Routes>
      </CaseProvider>
    </HashRouter>
  );
};

export default App;
