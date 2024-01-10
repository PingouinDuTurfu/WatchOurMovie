import { BrowserRouter } from "react-router-dom";
import "../css/App.css";
import AppFooter from "./AppFooter";
import AppMenu from "./AppMenu";
import AppRouter from "./AppRouter";
import { useState } from "react";

function App() {
  const [footerNavValue, setFooterNavValue] = useState<number | undefined>(0);

  return (
    <>
      <BrowserRouter>
      <AppMenu setFooterNavValue={setFooterNavValue} />
        <AppRouter/>
        <AppFooter footerNavValue={footerNavValue} setFooterNavValue={setFooterNavValue} />
      </BrowserRouter>
    </>
  );
}

export default App;
