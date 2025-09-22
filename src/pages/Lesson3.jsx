// CircleBresenhamApp.jsx
import React, { useEffect, useRef, useState } from "react";
import { GLController } from "../webGL/gl.js";

export default function CircleBresenhamApp() {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const controllerRef = useRef(null);
  const shapesRef = useRef([]); // buffers + metadata
  const [, setTick] = useState(0); // para forçar re-render visual se precisar

  // estado do UI
  const [radius, setRadius] = useState(40); // CSS pixels
  const [pointSize, setPointSize] = useState(2);
  const [color, setColor] = useState([1, 1, 1, 1]); // rgba (0..1)

  // refs para valores atuais (evita fechamento com valores antigos)
  const radiusRef = useRef(radius);
  const pointSizeRef = useRef(pointSize);
  const colorRef = useRef(color);

  useEffect(() => { radiusRef.current = radius; }, [radius]);
  useEffect(() => { pointSizeRef.current = pointSize; }, [pointSize]);
  useEffect(() => { colorRef.current = color; }, [color]);

  // shaders
  const vsSrc = `
    attribute vec2 a_position;
    uniform float u_pointSize;
    void main() {
      gl_PointSize = u_pointSize;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;
  const fsSrc = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = u_color;
    }
  `;

  // redimensiona canvas para DPR (devicePixelRatio)
  function resizeCanvasToDisplaySize(canvas, gl) {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, canvas.width, canvas.height);
      return true;
    }
    return false;
  }

  // Bresenham (inteiro) para circunferência
  function bresenhamCircleInts(cx, cy, r) {
    const set = new Set();
    let x = 0;
    let y = r;
    let d = 3 - 2 * r;

    const push = (px, py) => set.add(`${px},${py}`);

    while (x <= y) {
      push(cx + x, cy + y);
      push(cx - x, cy + y);
      push(cx + x, cy - y);
      push(cx - x, cy - y);
      push(cx + y, cy + x);
      push(cx - y, cy + x);
      push(cx + y, cy - x);
      push(cx - y, cy - x);

      if (d <= 0) {
        d = d + 4 * x + 6;
      } else {
        d = d + 4 * (x - y) + 10;
        y--;
      }
      x++;
    }

    const points = [];
    for (const s of set) {
      const [px, py] = s.split(",").map(Number);
      points.push([px, py]);
    }
    return points;
  }

  // converte pixels (buffer coords) -> NDC [-1,1]
  function pixelToNDC(px, py, canvas) {
    const ndcX = (px / canvas.width) * 2 - 1;
    const ndcY = -((py / canvas.height) * 2 - 1);
    return [ndcX, ndcY];
  }

  // inicialização GL e listener (registrado 1 vez)
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      alert("WebGL não suportado.");
      return;
    }
    glRef.current = gl;

    // garante tamanho inicial
    resizeCanvasToDisplaySize(canvas, gl);

    // controller (sua classe)
    const controller = new GLController(gl);
    controllerRef.current = controller;

    // compila/linka shaders
    const vs = controller.createVertexShader(vsSrc);
    const fs = controller.createFragmentShader(fsSrc);
    const program = controller.createProgram(vs, fs);
    programRef.current = program;
    gl.useProgram(program);

    // clear inicial
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // resize listener
    const onResize = () => {
      resizeCanvasToDisplaySize(canvas, gl);
      drawAll(); // redesenha com novo viewport
    };
    window.addEventListener("resize", onResize);

    // click: usa sempre valores atuais via refs
    const onClick = (e) => {
      resizeCanvasToDisplaySize(canvas, gl); // garante buffer coords atualizados
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // client coords -> buffer pixel coords (inteiros)
      const px = Math.round((e.clientX - rect.left) * dpr);
      const py = Math.round((e.clientY - rect.top) * dpr);

      // radius input é em CSS px — convertemos para buffer pixels multiplicando DPR
      const r = Math.max(1, Math.round(radiusRef.current * dpr));

      const pts = bresenhamCircleInts(px, py, r); // pontos em pixel buffer coords (inteiros)

      // converte pontos para NDC e cria Float32Array
      const ndcArr = new Float32Array(pts.length * 2);
      for (let i = 0; i < pts.length; i++) {
        const [x, y] = pts[i];
        const [nx, ny] = pixelToNDC(x, y, canvas);
        ndcArr[i * 2] = nx;
        ndcArr[i * 2 + 1] = ny;
      }

      // cria buffer e salva metadata (copia color atual)
      const controllerInstance = controllerRef.current;
      const buf = controllerInstance.createBuffer(ndcArr);

      shapesRef.current.push({
        buffer: buf,
        count: ndcArr.length / 2,
        color: colorRef.current.slice(),
        pointSize: Math.max(1, pointSizeRef.current)
      });

      // redesenha
      drawAll();
      setTick(t => t + 1);
    };

    canvas.addEventListener("click", onClick);

    return () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
    // rodar apenas uma vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // função que desenha todos os círculos salvos
  function drawAll() {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    // garante viewport
    resizeCanvasToDisplaySize(canvas, gl);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const aPos = gl.getAttribLocation(program, "a_position");
    const uColorLoc = gl.getUniformLocation(program, "u_color");
    const uPointSize = gl.getUniformLocation(program, "u_pointSize");

    for (const s of shapesRef.current) {
      gl.bindBuffer(gl.ARRAY_BUFFER, s.buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform4fv(uColorLoc, s.color);
      gl.uniform1f(uPointSize, s.pointSize);

      gl.drawArrays(gl.POINTS, 0, s.count);
    }
  }

  // redesenha quando mudar ponto/cor/raio (para refletir nova configuração em caso de querer ver efeito)
  useEffect(() => {
    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, pointSize, radius]);

  return (
    <div style={{ display: "flex", gap: 12, padding: 12 }}>
      <div style={{ width: 260, color: "#eee", background: "#111", padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Bresenham - Circunferências</h3>
        <p>Clique no canvas para desenhar uma circunferência centrada no clique.</p>

        <label>
          Raio (px):{" "}
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Math.max(1, parseInt(e.target.value || "1", 10)))}
            style={{ width: 80 }}
          />
        </label>
        <br />
        <label>
          Tamanho do ponto:{" "}
          <input
            type="number"
            value={pointSize}
            onChange={(e) => setPointSize(Math.max(1, parseInt(e.target.value || "1", 10)))}
            style={{ width: 80 }}
          />
        </label>
        <br />
        <label>
          Cor:{" "}
          <input
            type="color"
            value="#FFFFFF"
            onChange={(ev) => {
              const hex = ev.target.value;
              const r = parseInt(hex.slice(1, 3), 16) / 255;
              const g = parseInt(hex.slice(3, 5), 16) / 255;
              const b = parseInt(hex.slice(5, 7), 16) / 255;
              setColor([r, g, b, 1]);
            }}
          />
        </label>

        <hr />
        <div>Circles desenhados: {shapesRef.current.length}</div>
      </div>

      <div style={{ flex: 1, height: "80vh", background: "#222" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </div>
  );
}


