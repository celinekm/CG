const canvas = document.getElementById("glCanvas");

const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


const vertexShaderSource = `#version 300 es

in vec2 aPosition;

void main() {

    gl_Position = vec4(aPosition, 0.0, 1.0);

}

`;


const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 uColor;

out vec4 outColor;

void main() {

    outColor = uColor;

}

`;


function createShader(type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    return shader;
}


const vertexShader = createShader(
    gl.VERTEX_SHADER,
    vertexShaderSource
);


const fragmentShader = createShader(
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


const program = gl.createProgram();

gl.attachShader(program, vertexShader);

gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);


const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );


const colorLocation =
    gl.getUniformLocation(
        program,
        "uColor"
    );


function createBuffer(vertices) {

    const buffer = gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    return buffer;
}


function draw(vertices, color, primitive) {

    const buffer = createBuffer(vertices);

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.enableVertexAttribArray(
        positionLocation
    );

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform4f(
        colorLocation,
        color[0],
        color[1],
        color[2],
        1.0
    );

    gl.drawArrays(
        primitive,
        0,
        vertices.length / 2
    );
}


function rectangle(x1, y1, x2, y2) {

    return [

        x1, y1,
        x2, y1,
        x2, y2,

        x1, y1,
        x2, y2,
        x1, y2

    ];
}


function circle(x, y, radius) {

    const vertices = [];

    vertices.push(x, y);

    for (
        let i = 0;
        i <= 30;
        i++
    ) {

        const angle =
            i * 2 * Math.PI / 30;

        vertices.push(
            x + radius * Math.cos(angle),
            y + radius * Math.sin(angle)
        );
    }

    return vertices;
}


gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);


gl.clearColor(
    0.07,
    0.09,
    0.14,
    1.0
);


gl.clear(
    gl.COLOR_BUFFER_BIT
);


draw(

    rectangle(
        -0.70,
        -0.25,
         0.70,
         0.15
    ),

    [0.9, 0.1, 0.15],

    gl.TRIANGLES

);


draw(

    [
        -0.45, 0.15,
        -0.25, 0.45,
         0.25, 0.45,

        -0.45, 0.15,
         0.25, 0.45,
         0.45, 0.15
    ],

    [0.9, 0.1, 0.15],

    gl.TRIANGLES

);


draw(

    [
        -0.38, 0.19,
        -0.22, 0.39,
         0.0, 0.39,

        -0.38, 0.19,
         0.0, 0.39,
         0.0, 0.19
    ],

    [0.15, 0.25, 0.35],

    gl.TRIANGLES

);


draw(

    [
         0.02, 0.19,
         0.02, 0.39,
         0.22, 0.39,

         0.02, 0.19,
         0.22, 0.39,
         0.38, 0.19
    ],

    [0.15, 0.25, 0.35],

    gl.TRIANGLES

);


draw(

    circle(
        -0.42,
        -0.27,
        0.17
    ),

    [0.03, 0.03, 0.03],

    gl.TRIANGLE_FAN

);


draw(

    circle(
         0.42,
        -0.27,
         0.17
    ),

    [0.03, 0.03, 0.03],

    gl.TRIANGLE_FAN

);