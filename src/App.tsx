import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyles from "./Styles/GlobalStyle";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import ProtectRoute from "./pages/ProtectRoute";
import FullPageSpinner from "./ui/FullPageSpinner";

// Lazy load components
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const Applayout = lazy(() => import("./ui/Applayout"));
const MessagePage = lazy(() => import("./pages/MessagePage"));
const Settings = lazy(() => import("./pages/Settings"));
const EditProfile = lazy(() => import("./components/EditProfile"));
const NewMessage = lazy(() => import("./components/NewMessage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <GlobalStyles />
          <Suspense fallback={<FullPageSpinner />}>
            <Routes>
              <Route path="/" index element={<GetStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />

              <Route
                path="/app"
                element={
                  <ProtectRoute>
                    <Applayout />
                  </ProtectRoute>
                }
              >
                <Route
                  path="chat"
                  element={
                    <ProtectRoute>
                      <MessagePage />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectRoute>
                      <Settings />
                    </ProtectRoute>
                  }
                />
                <Route
                  path="editProfile"
                  element={
                    <ProtectRoute>
                      <EditProfile />
                    </ProtectRoute>
                  }
                />
              </Route>
              <Route
                path="newMessage"
                element={
                  <ProtectRoute>
                    <NewMessage />
                  </ProtectRoute>
                }
              />
              <Route
                path="/chatpage/:chatid/:messageid"
                element={
                  <ProtectRoute>
                    <ChatPage />
                  </ProtectRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/support"
                element={
                  <ProtectRoute>
                    <SupportPage />
                  </ProtectRoute>
                }
              />
              <Route
                path="/newMessage/profile/:userId"
                element={
                  <ProtectRoute>
                    <ProfilePage />
                  </ProtectRoute>
                }
              />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
