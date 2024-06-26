import { BrowserRouter } from "react-router-dom";
import AppFooter from "./AppFooter";
import AppMenu from "./AppMenu";
import AppRouter from "./AppRouter";
import { useState } from "react";
import styles from "../css/App.module.css"

function App() {
  const [footerNavValue, setFooterNavValue] = useState<number | undefined>(0);

  return (
    <>
      <BrowserRouter>
        <AppMenu setFooterNavValue={setFooterNavValue} />
        <div className={styles.MainContent}>
          <AppRouter/>
        </div>
        <AppFooter footerNavValue={footerNavValue} setFooterNavValue={setFooterNavValue} />
      </BrowserRouter>
    </>
  );
}

export default App;
