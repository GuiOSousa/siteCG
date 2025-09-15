import { Link } from "react-router-dom";
import './NavBar.css'

export default function NavBar() {
    return <>
        <nav>
			<Link className="Link" to="/">Home</Link>
			<Link className="Link" to="/lesson1">Atividade 1</Link>
		</nav>
    </>
}