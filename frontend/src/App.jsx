
import { Route, Routes, Navigate } from "react-router"

import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import { Toaster } from "react-hot-toast"
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser"
import Layout from "./components/Layout.jsx"
import { useThemeStore } from "./store/useThemeStore";

const App = () => {

    const {authUser, isLoading} = useAuthUser();
    const {theme} = useThemeStore();

    const isAuthenticated = Boolean(authUser);
    const isOnboarded = authUser?.isOnboarded;

    if(isLoading) return <PageLoader/>
    return (
        <div className="h-screen" data-theme={theme}>
            <Routes>
              <Route 
                    path="/" 
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={true}>
                                    <HomePage/>
                                </Layout>
                                ) : (
                            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                        )
                    }
                />

              <Route 
                    path="/login" 
                        element={
                            !isAuthenticated ? (
                                <LoginPage/>
                            ) : (
                            <Navigate to={(isOnboarded ? "/" : "/onboarding")}/> 
                        )
                    } 
                />

              <Route 
                    path="/signup" 
                        element={
                            !isAuthenticated ? (
                                <SignUpPage />
                            ) : (
                            <Navigate to="/" />
                        )
                    } 
                />

               <Route 
                    path="/onboarding" 
                        element={
                            isAuthenticated ? (
                                isOnboarded ? <Navigate to="/" /> : <OnboardingPage />
                            ) : (
                            <Navigate to="/login" />
                        )
                    }
               />

              <Route 
                    path="/notifications" 
                        element={
                            isAuthenticated && isOnboarded ? (
                                <Layout showSidebar={true}>
                                    <NotificationsPage/>
                                </Layout>
                                ) : (
                            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                        )
                    } 
                />

              <Route 
                    path="/call/:id" 
                        element={
                            isAuthenticated && isOnboarded ? (
                            <CallPage />
                            ) : (
                        <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                        )
                    } 
                />

              <Route 
                    path="/chat/:id" 
                        element={
                            isAuthenticated && isOnboarded ? (
                            <Layout showSidebar={false}>
                                <ChatPage/>
                            </Layout>
                            ) : (
                        <Navigate to="/login" />
                        )
                    } 
                />
            </Routes>

            <Toaster/>
        </div>
    )
}

export default App
