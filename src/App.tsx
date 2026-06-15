import {HashRouter, Routes, Route} from 'react-router-dom';
import {Layout} from "./components/Layout.tsx";
import {Home} from "./pages/Home.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";

function App() {
  return (
    <HashRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<Layout/>}>
            <Route index element={<Home/>}/>
          </Route>
        </Routes>
      </TooltipProvider>
    </HashRouter>
  );
}

export default App
