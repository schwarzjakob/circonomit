import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import GoalScreen from './screens/GoalScreen';
import TaskScreen from './screens/TaskScreen';
import ModelScreen from './screens/ModelScreen';
import InsightsScreen from './screens/InsightsScreen';
import LibraryScreen from './screens/LibraryScreen';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/library" replace />} />
            
            {/* Library Routes */}
            <Route path="/library" element={<LibraryScreen />} />
            
            {/* Simulation Routes */}
            <Route path="/simulation/goal" element={<GoalScreen />} />
            <Route path="/simulation/task" element={<TaskScreen />} />
            <Route path="/simulation/model" element={<ModelScreen />} />
            <Route path="/simulation/insights" element={<InsightsScreen />} />
            
            {/* Legacy redirects for backward compatibility */}
            <Route path="/goal" element={<Navigate to="/simulation/goal" replace />} />
            <Route path="/task" element={<Navigate to="/simulation/task" replace />} />
            <Route path="/model" element={<Navigate to="/simulation/model" replace />} />
            <Route path="/insights" element={<Navigate to="/simulation/insights" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
