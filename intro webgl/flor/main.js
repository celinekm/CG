const canvas = document.getElementById("glCanvas");

const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado neste navegador.");
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

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}

const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);

gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}

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

function setupPosition(buffer) {

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
}

function createCircle(
    centerX,
    centerY,
    radius,
    segments
) {

    const vertices = [];

    vertices.push(
        centerX,
        centerY
    );

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            i * 2 * Math.PI / segments;

        const x =
            centerX +
            radius * Math.cos(angle);

        const y =
            centerY +
            radius * Math.sin(angle);

        vertices.push(
            x,
            y
        );
    }

    return vertices;
}

function createPetal(
    centerX,
    centerY,
    radiusX,
    radiusY,
    rotation,
    segments
) {

    const vertices = [];

    vertices.push(
        centerX,
        centerY
    );

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const angle =
            i * 2 * Math.PI / segments;

        const x =
            radiusX * Math.cos(angle);

        const y =
            radiusY * Math.sin(angle);

        const rotatedX =
            x * Math.cos(rotation)
            -
            y * Math.sin(rotation);

        const rotatedY =
            x * Math.sin(rotation)
            +
            y * Math.cos(rotation);

        vertices.push(
            centerX + rotatedX,
            centerY + rotatedY
        );
    }

    return vertices;
}

const flowerX = 0.0;

const flowerY = 0.0;

const numberOfPetals = 8;

const petalDistance = 0.27;

const petalRadiusX = 0.32;

const petalRadiusY = 0.17;

const petalSegments = 40;

const petals = [];

for (
    let i = 0;
    i < numberOfPetals;
    i++
) {

    const angle =
        i * 2 * Math.PI / numberOfPetals;

    const centerX =
        flowerX +
        petalDistance *
        Math.cos(angle);

    const centerY =
        flowerY +
        petalDistance *
        Math.sin(angle);

    const petal = createPetal(
        centerX,
        centerY,
        petalRadiusX,
        petalRadiusY,
        angle,
        petalSegments
    );

    petals.push(petal);
}

const center = createCircle(
    flowerX,
    flowerY,
    0.21,
    40
);

const petalBuffers = [];

for (const petal of petals) {

    const buffer =
        createBuffer(petal);

    petalBuffers.push(buffer);
}

const centerBuffer =
    createBuffer(center);

function setColor(
    r,
    g,
    b,
    a = 1.0
) {

    gl.uniform4f(
        colorLocation,
        r,
        g,
        b,
        a
    );
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

gl.useProgram(program);

for (
    let i = 0;
    i < petalBuffers.length;
    i++
) {

    setupPosition(
        petalBuffers[i]
    );

    if (i % 2 === 0) {

        setColor(
            1.0,
            0.30,
            0.55,
            1.0
        );

    } else {

        setColor(
            1.0,
            0.45,
            0.68,
            1.0
        );
    }

    gl.drawArrays(
        gl.TRIANGLE_FAN,
        0,
        petalSegments + 2
    );
}

setupPosition(
    centerBuffer
);

setColor(
    1.0,
    0.70,
    0.05,
    1.0
);

gl.drawArrays(
    gl.TRIANGLE_FAN,
    0,
    42
);
