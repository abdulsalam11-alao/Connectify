import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyles from "./Styles/GlobalStyle";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";

function App() {
  return (
    <>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          <Route path="/" index element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Create-account" element={<CreateAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
