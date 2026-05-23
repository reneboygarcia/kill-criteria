import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Hub } from "./routes/Hub";
import styles from "./App.module.css";

const Flow = lazy(() =>
  import("./routes/Flow").then((module) => ({ default: module.Flow })),
);
const Disclosure = lazy(() =>
  import("./routes/Disclosure").then((module) => ({
    default: module.Disclosure,
  })),
);

function RouteFallback() {
  return (
    <div className={styles.fallback} role="status" aria-live="polite">
      Loading…
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/disclosure" element={<Disclosure />} />
          <Route path="/flow/:flowId" element={<Flow />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
