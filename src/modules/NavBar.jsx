import { Link } from "react-router-dom";
import './NavBar.css'

export default function NavBar() {
    return <>
        <nav>
			<Link className="Link" to="/">Home</Link>
			<Link className="Link" to="/lesson1">Atividade 1</Link>
            <Link className="Link" to="/lesson2">Proposta de Exercício 1 (16/09)</Link>
            <Link className="Link" to="/lesson3">Proposta de Exercício 2 (16/09)</Link>
        </nav>
    </>
}