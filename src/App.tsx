import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Layout} from "./components/Layout.tsx";
import {Home} from "./pages/Home.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";

function App() {
  return (
    <Router>
      <TooltipProvider>
        <Routes>
          <Route element={<Layout/>}>
            <Route index element={<Home/>}/>
          </Route>
        </Routes>
      </TooltipProvider>
    </Router>
  );
}

export default App
