import React, { useEffect, useRef, useState } from "react";
import { GLController } from "../webGL/gl.js";

const COLORS = [
  [1, 1, 1, 1], [1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], [1, 1, 0, 1],
  [1, 0, 1, 1], [0, 1, 1, 1], [0.5, 0.5, 0.5, 1], [1, 0.5, 0, 1], [0, 0, 0, 1]
];

export default function WebGLDrawApp() {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const controllerRef = useRef(null);

  const [mode, setMode] = useState("line");
  const [colorIndex, setColorIndex] = useState(0);
  const [thickness, setThickness] = useState(1);
  const [shapes, setShapes] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [inputMode, setInputMode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    glRef.current = gl;

    const controller = new GLController(gl);
    controllerRef.current = controller;

    const vsSource = `
      attribute vec2 a_position;
      uniform vec4 u_color;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;

    const vs = controller.createVertexShader(vsSource);
    const fs = controller.createFragmentShader(fsSource);
    const program = controller.createProgram(vs, fs);
    programRef.current = program;
    gl.useProgram(program);

    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const handleKey = (e) => {
      if (e.key === "k" || e.key === "K") setInputMode("color");
      else if (e.key === "e" || e.key === "E") setInputMode("thickness");
      else if (inputMode === "color" && /[0-9]/.test(e.key)) setColorIndex(parseInt(e.key));
      else if (inputMode === "thickness" && /[1-9]/.test(e.key)) setThickness(parseInt(e.key));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inputMode]);

  useEffect(() => {
    drawScene();
  }, [shapes, colorIndex, thickness]);

  function addPoint(x, y) {
    const rect = canvasRef.current.getBoundingClientRect();
    const nx = (x - rect.left) / rect.width * 2 - 1;
    const ny = -((y - rect.top) / rect.height * 2 - 1);

    const newPoints = [...currentPoints, [nx, ny]];
    setCurrentPoints(newPoints);

    if (mode === "line" && newPoints.length === 2) {
      setShapes([...shapes, { type: "line", points: newPoints, colorIndex, thickness }]);
      setCurrentPoints([]);
    } else if (mode === "triangle" && newPoints.length === 3) {
      setShapes([...shapes, { type: "triangle", points: newPoints, colorIndex, thickness }]);
      setCurrentPoints([]);
    }
  }

  function drawScene() {
    const gl = glRef.current;
    const controller = controllerRef.current;
    gl.clear(gl.COLOR_BUFFER_BIT);

    shapes.forEach((shape) => {
      const color = COLORS[shape.colorIndex];
      const uColor = gl.getUniformLocation(programRef.current, "u_color");
      gl.uniform4fv(uColor, color);

      const vertices = new Float32Array(shape.points.flat());
      controller.createBuffer(vertices);

      const aPos = gl.getAttribLocation(programRef.current, "a_position");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      if (shape.type === "line") {
        gl.lineWidth(shape.thickness); // ainda limitado a 1 no Chrome/Firefox
        gl.drawArrays(gl.LINES, 0, 2);
      } else if (shape.type === "triangle") {
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
    });
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "300px", background: "#111", color: "#eee", padding: "12px" }}>
        <h3>Desenho WebGL (React)</h3>
        <div>
          <button onClick={() => setMode("line")} style={{ background: mode === "line" ? "#4caf50" : "#2a2a2a", color: "#fff", margin: "4px" }}>Linha</button>
          <button onClick={() => setMode("triangle")} style={{ background: mode === "triangle" ? "#4caf50" : "#2a2a2a", color: "#fff", margin: "4px" }}>Triângulo</button>
          <button onClick={() => setShapes([])} style={{ background: "#c62828", color: "#fff", margin: "4px" }}>Limpar</button>
        </div>

        <p>Pressione <b>K</b> para modo cor (0-9). Pressione <b>E</b> para espessura (1-9).</p>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {COLORS.map((c, idx) => (
            <div
              key={idx}
              onClick={() => setColorIndex(idx)}
              style={{
                width: "28px", height: "24px", background: `rgba(${c[0]*255},${c[1]*255},${c[2]*255},1)`,
                border: idx === colorIndex ? "3px solid #4caf50" : "2px solid #333", cursor: "pointer"
              }}
            />
          ))}
        </div>

        <p>Espessura atual: {thickness}</p>
        <p>Cor atual: {colorIndex}</p>
        <p>Pontos em espera: {currentPoints.length}</p>
      </div>

      <div style={{ flex: 1 }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ width: "100%", height: "100%", background: "#222" }}
          onClick={(e) => addPoint(e.clientX, e.clientY)}
        />
      </div>
    </div>
  );
}
