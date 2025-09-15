import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lesson1 from "./pages/Lesson1";
import NavBar from "./modules/NavBar";

function App() {
	return (
		<Router>
			<NavBar/>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/lesson1" element={<Lesson1 />} />
			</Routes>
		</Router>
	);
}

export default App;
