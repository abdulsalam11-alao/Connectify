import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyles from "./Styles/GlobalStyle";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Applayout from "./ui/Applayout";
import MessagePage from "./pages/MessagePage";
import Settings from "./pages/Settings";
import EditProfile from "./components/EditProfile";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          <Route path="/" index element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          <Route path="/app" element={<Applayout />}>
            <Route path="chat" element={<MessagePage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="editProfile" element={<EditProfile />} />
          </Route>
          <Route path="/chatpage" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
