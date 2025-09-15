import RobotCanvas from "../webGL/lesson1/Robot";
import FlowerCanvas from "../webGL/lesson1/Flower";
import CarCanvas from "../webGL/lesson1/Car";
import PinwheelCanvas from "../webGL/lesson1/Pinwheel";

function Lesson1() {
	return (
		<div>
			<h1>Atividade 1</h1>

			<h2>Robô</h2>
			<RobotCanvas/>

			<h2>Flor</h2>
			<FlowerCanvas/>

			<h2>Carro</h2>
			<CarCanvas/>

			<h2>Catavento</h2>
			<PinwheelCanvas/>
		</div>
	);
}

export default Lesson1;
