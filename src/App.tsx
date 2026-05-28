import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Layout} from "./components/Layout.tsx";
import {Home} from "./pages/Home.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
