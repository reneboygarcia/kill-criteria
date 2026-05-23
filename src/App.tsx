import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Flow } from "./routes/Flow";
import { Hub } from "./routes/Hub";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/flow/:flowId" element={<Flow />} />
      </Routes>
    </BrowserRouter>
  );
}
