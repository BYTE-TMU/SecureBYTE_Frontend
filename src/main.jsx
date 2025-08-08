import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.jsx';
import Dashboard from './components/pages/Dashboard';
import CodeEditorPage from './components/pages/CodeEditorPage';
import CoreLayout from './components/layouts/CoreLayout';
import { SidebarProvider } from './components/ui/sidebar';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <SidebarProvider defaultOpen={false}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<CoreLayout />}>
          <Route path="/code-editor" element={<CodeEditorPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        //TODO: change it to be a dashboard page with the logic pulled out into
        individual components
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
    ,
  </SidebarProvider>,
  // </StrictMode>,
);
