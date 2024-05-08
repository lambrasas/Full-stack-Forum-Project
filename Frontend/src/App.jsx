import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ThreadsPage from "./pages/ThreadsPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import ViewThreadPage from "./pages/ViewThreadPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
        <Route path="/thread/:threadId" element={<ViewThreadPage />} />
      </Routes>
    </Router>
  );
};

export default App;
