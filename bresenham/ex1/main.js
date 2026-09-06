const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL não é suportado pelo navegador.");
}

const vertexShaderSource = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = 3.0;
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
    }
`;
function criarShader(tipo, codigo) {
    const shader = gl.createShader(tipo);

    gl.shaderSource(shader, codigo);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vertexShader = criarShader(
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = criarShader(
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);

const programa = gl.createProgram();

gl.attachShader(programa, vertexShader);
gl.attachShader(programa, fragmentShader);

gl.linkProgram(programa);

gl.useProgram(programa);

const positionLocation =
    gl.getAttribLocation(programa, "a_position");

const colorLocation =
    gl.getUniformLocation(programa, "u_color");


const buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

const cores = [
    [1.0, 0.0, 0.0, 1.0], // 0 - vermelho
    [0.0, 1.0, 0.0, 1.0], // 1 - verde
    [0.0, 0.0, 1.0, 1.0], // 2 - azul
    [1.0, 1.0, 0.0, 1.0], // 3 - amarelo
    [1.0, 0.0, 1.0, 1.0], // 4 - magenta
    [0.0, 1.0, 1.0, 1.0], // 5 - ciano
    [1.0, 0.5, 0.0, 1.0], // 6 - laranja
    [0.5, 0.0, 1.0, 1.0], // 7 - roxo
    [0.0, 0.5, 0.0, 1.0], // 8 - verde escuro
    [0.0, 0.0, 0.0, 1.0]  // 9 - preto
];

function converterCoordenadas(event) {

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xWebGL = (x / canvas.width) * 2 - 1;
    const yWebGL = 1 - (y / canvas.height) * 2;

    return [xWebGL, yWebGL];
}


function bresenham(x0, y0, x1, y1) {

    const pontos = [];

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;

    let erro = dx - dy;

    while (true) {

        pontos.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
            break;
        }

        let e2 = 2 * erro;

        if (e2 > -dy) {
            erro -= dy;
            x0 += sx;
        }

        if (e2 < dx) {
            erro += dx;
            y0 += sy;
        }
    }

    return pontos;
}


function desenharReta(pontoInicial, pontoFinal) {

    const x0 = Math.round(
        (pontoInicial[0] + 1) * canvas.width / 2
    );

    const y0 = Math.round(
        (pontoInicial[1] + 1) * canvas.height / 2
    );

    const x1 = Math.round(
        (pontoFinal[0] + 1) * canvas.width / 2
    );

    const y1 = Math.round(
        (pontoFinal[1] + 1) * canvas.height / 2
    );

    const pontos = bresenham(x0, y0, x1, y1);

    const vertices = [];

    for (let ponto of pontos) {

        const x = ponto[0];
        const y = ponto[1];

        const xWebGL =
            (x / canvas.width) * 2 - 1;

        const yWebGL =
            (y / canvas.height) * 2 - 1;

        vertices.push(xWebGL);
        vertices.push(yWebGL);
    }

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    gl.uniform4fv(
        colorLocation,
        cores[corAtual]
    );

    gl.drawArrays(
        gl.POINTS,
        0,
        pontos.length
    );
}


let pontoInicial = [0, 0];
let pontoFinal = [0, 0];

let primeiroClique = true;

let corAtual = 2;

desenharReta(pontoInicial, pontoFinal);


canvas.addEventListener("click", function(event) {

    const ponto = converterCoordenadas(event);

    if (primeiroClique) {

        pontoInicial = ponto;

        primeiroClique = false;

    } else {

        pontoFinal = ponto;

        desenharReta(
            pontoInicial,
            pontoFinal
        );

        primeiroClique = true;
    }
});


document.addEventListener("keydown", function(event) {

    if (event.key >= "0" && event.key <= "9") {

        corAtual = Number(event.key);

        desenharReta(
            pontoInicial,
            pontoFinal
        );
    }
});
