import { Link } from "react-router-dom";


export default function NavBar() {
    return <>
        <nav style={{ marginBottom: "20px" }}>
				<Link to="/" style={{ marginRight: "10px" }}>Home</Link>
				<Link to="/lesson1" style={{ marginRight: "10px" }}>Atividade 1</Link>
		</nav>
    </>
}