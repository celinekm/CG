const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");


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
    [1, 0, 0, 1],       // 0 vermelho
    [0, 1, 0, 1],       // 1 verde
    [0, 0, 1, 1],       // 2 azul
    [1, 1, 0, 1],       // 3 amarelo
    [1, 0, 1, 1],       // 4 magenta
    [0, 1, 1, 1],       // 5 ciano
    [1, 0.5, 0, 1],     // 6 laranja
    [0.5, 0, 1, 1],     // 7 roxo
    [0, 0.5, 0, 1],     // 8 verde escuro
    [0, 0, 0, 1]        // 9 preto
];

let corAtual = 2;


let modo = "reta";

let pontos = [];


function converterCoordenadas(event) {

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xWebGL =
        (x / canvas.width) * 2 - 1;

    const yWebGL =
        1 - (y / canvas.height) * 2;

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

function desenharLinha(p1, p2) {

    const x0 = Math.round(
        (p1[0] + 1) * canvas.width / 2
    );

    const y0 = Math.round(
        (p1[1] + 1) * canvas.height / 2
    );

    const x1 = Math.round(
        (p2[0] + 1) * canvas.width / 2
    );

    const y1 = Math.round(
        (p2[1] + 1) * canvas.height / 2
    );

    return bresenham(x0, y0, x1, y1);
}


function desenharReta(p1, p2) {

    const pontosLinha = desenharLinha(p1, p2);

    const vertices = [];

    for (let ponto of pontosLinha) {

        const x = ponto[0];
        const y = ponto[1];

        const xWebGL =
            (x / canvas.width) * 2 - 1;

        const yWebGL =
            (y / canvas.height) * 2 - 1;

        vertices.push(xWebGL);
        vertices.push(yWebGL);
    }

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
        pontosLinha.length
    );
}

function desenharTriangulo(p1, p2, p3) {

    const linha1 = desenharLinha(p1, p2);
    const linha2 = desenharLinha(p2, p3);
    const linha3 = desenharLinha(p3, p1);

    const todasAsLinhas = [
        ...linha1,
        ...linha2,
        ...linha3
    ];

    const vertices = [];

    for (let ponto of todasAsLinhas) {

        const x = ponto[0];
        const y = ponto[1];

        const xWebGL =
            (x / canvas.width) * 2 - 1;

        const yWebGL =
            (y / canvas.height) * 2 - 1;

        vertices.push(xWebGL);
        vertices.push(yWebGL);
    }

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
        todasAsLinhas.length
    );
}

function limparTela() {

    gl.clearColor(1, 1, 1, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

function desenharFigura() {

    limparTela();

    if (modo === "reta" && pontos.length === 2) {

        desenharReta(
            pontos[0],
            pontos[1]
        );
    }

    if (modo === "triangulo" && pontos.length === 3) {

        desenharTriangulo(
            pontos[0],
            pontos[1],
            pontos[2]
        );
    }
}

canvas.addEventListener("click", function(event) {

    const ponto = converterCoordenadas(event);

    pontos.push(ponto);

    if (modo === "reta" && pontos.length === 2) {

        desenharFigura();

        pontos = [];
    }

    if (modo === "triangulo" && pontos.length === 3) {

        desenharFigura();

        pontos = [];
    }
});

document.addEventListener("keydown", function(event) {

    if (event.key === "r" || event.key === "R") {

        modo = "reta";
        pontos = [];

        limparTela();
    }

    if (event.key === "t" || event.key === "T") {

        modo = "triangulo";
        pontos = [];

        limparTela();
    }


    if (event.key >= "0" && event.key <= "9") {

        corAtual = Number(event.key);

        if (modo === "reta" && pontos.length === 2) {

            desenharFigura();
        }

        if (modo === "triangulo" && pontos.length === 3) {

            desenharFigura();
        }
    }
});


gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

desenharReta(
    [0, 0],
    [0, 0]
);
