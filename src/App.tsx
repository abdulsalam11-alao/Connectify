import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyles from "./Styles/GlobalStyle";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Applayout from "./ui/Applayout";
import MessagePage from "./pages/MessagePage";
import Settings from "./pages/Settings";
import EditProfile from "./components/EditProfile";
import NewMessage from "./components/NewMessage";
import ChatPage from "./pages/ChatPage";
import SupportPage from "./pages/SupportPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { ThemeProvider } from "./context/ThemeContext";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./context/UserContext";
import ProtectRoute from "./pages/ProtectRoute";

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <GlobalStyles />
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
              path="/chatpage"
              element={
                <ProtectRoute>
                  <ChatPage />
                </ProtectRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ProtectRoute>
                  <ForgotPasswordPage />
                </ProtectRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectRoute>
                  <SupportPage />
                </ProtectRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectRoute>
                  <ProfilePage />
                </ProtectRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
