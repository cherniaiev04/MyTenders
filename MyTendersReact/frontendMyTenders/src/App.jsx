import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AddProject from './components/AddProject';
import CustomAppBar from './components/CustomAppBar';
import ProjectsList from './components/ProjectsList';
import ProjectView from './components/ProjectView';
import MaterialsList from './components/MaterialsList';
import AddMaterial from './components/AddMaterial';
import MaterialView from './components/MaterialView';
import ProvidersList from './components/ProvidersList';
import Admin from './components/Admin';
import LoginPage from './components/LoginPage';
import  AuthProvider  from './context/AuthContext';
import PrivateRoute from './PrivateRoute';

const AppContent = () => {
    const location = useLocation();
    const shouldShowAppBar = !['/login', '/admin'].includes(location.pathname);

    return (
        <>
            {shouldShowAppBar && <CustomAppBar />}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/projects" element={<ProjectsList />} />
                    <Route path="/projects/add" element={<AddProject />} />
                    <Route path="/projects/:id" element={<ProjectView />} />
                    <Route path="/materials" element={<MaterialsList />} />
                    <Route path="/materials/add" element={<AddMaterial />} />
                    <Route path="/materials/:id" element={<MaterialView />} />
                    <Route path="/providers" element={<ProvidersList />} />
                </Route>
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="App">
                    <AppContent />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
