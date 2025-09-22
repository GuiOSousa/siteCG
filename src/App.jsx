import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lesson1 from "./pages/Lesson1";
import Lesson2 from "./pages/Lesson2";
import Lesson3 from "./pages/Lesson3";
import NavBar from "./modules/NavBar";

function App() {
	return (
		<Router>
			<NavBar/>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/lesson1" element={<Lesson1 />} />
				<Route path="/lesson2" element={<Lesson2 />} />
				<Route path="/lesson3" element={<Lesson3 />} />
			</Routes>
		</Router>
	);
}

export default App;
