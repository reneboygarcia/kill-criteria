import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Disclosure } from "./routes/Disclosure";
import { Flow } from "./routes/Flow";
import { Hub } from "./routes/Hub";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/disclosure" element={<Disclosure />} />
        <Route path="/flow/:flowId" element={<Flow />} />
      </Routes>
    </BrowserRouter>
  );
}
