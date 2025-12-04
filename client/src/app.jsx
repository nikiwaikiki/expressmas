import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardEditor from "./CardEditor";
import CardView from "./CardView";


export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<CardEditor />} />
<Route path="/view/:id" element={<CardView />} />
</Routes>
</BrowserRouter>
);
}
