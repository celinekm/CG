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


function createRectangle(
    centerX,
    centerY,
    width,
    height
) {

    const x1 = centerX - width / 2;
    const x2 = centerX + width / 2;

    const y1 = centerY - height / 2;
    const y2 = centerY + height / 2;

    return [

        x1, y1,
        x2, y1,
        x2, y2,

        x1, y1,
        x2, y2,
        x1, y2

    ];
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


function createTriangle(
    x1,
    y1,
    x2,
    y2,
    x3,
    y3
) {

    return [

        x1, y1,

        x2, y2,

        x3, y3

    ];
}


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


function drawObject(
    vertices,
    primitive,
    color
) {

    const buffer =
        createBuffer(vertices);

    setupPosition(buffer);

    setColor(
        color[0],
        color[1],
        color[2],
        color[3]
    );

    gl.drawArrays(
        primitive,
        0,
        vertices.length / 2
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



drawObject(

    createRectangle(
        -0.15,
        0.82,
        0.025,
        0.16
    ),

    gl.TRIANGLES,

    [0.45, 0.48, 0.55, 1.0]

);


drawObject(

    createRectangle(
        0.15,
        0.82,
        0.025,
        0.16
    ),

    gl.TRIANGLES,

    [0.45, 0.48, 0.55, 1.0]

);


drawObject(

    createCircle(
        -0.15,
        0.91,
        0.045,
        30
    ),

    gl.TRIANGLE_FAN,

    [1.0, 0.25, 0.30, 1.0]

);


drawObject(

    createCircle(
        0.15,
        0.91,
        0.045,
        30
    ),

    gl.TRIANGLE_FAN,

    [0.20, 0.85, 1.0, 1.0]

);



drawObject(

    createRectangle(
        0.0,
        0.57,
        0.65,
        0.42
    ),

    gl.TRIANGLES,

    [0.55, 0.60, 0.68, 1.0]

);



drawObject(

    createRectangle(
        0.0,
        0.57,
        0.55,
        0.31
    ),

    gl.TRIANGLES,

    [0.08, 0.11, 0.17, 1.0]

);



drawObject(

    createCircle(
        -0.14,
        0.59,
        0.065,
        30
    ),

    gl.TRIANGLE_FAN,

    [0.20, 0.85, 1.0, 1.0]

);



drawObject(

    createCircle(
        0.14,
        0.59,
        0.065,
        30
    ),

    gl.TRIANGLE_FAN,

    [0.20, 0.85, 1.0, 1.0]

);


drawObject(

    createRectangle(
        0.0,
        0.45,
        0.22,
        0.035
    ),

    gl.TRIANGLES,

    [0.20, 0.85, 1.0, 1.0]

);



drawObject(

    createRectangle(
        0.0,
        0.29,
        0.18,
        0.12
    ),

    gl.TRIANGLES,

    [0.35, 0.39, 0.45, 1.0]

);


drawObject(

    createRectangle(
        0.0,
        -0.02,
        0.62,
        0.58
    ),

    gl.TRIANGLES,

    [0.45, 0.50, 0.58, 1.0]

);



drawObject(

    createRectangle(
        0.0,
        0.03,
        0.40,
        0.30
    ),

    gl.TRIANGLES,

    [0.08, 0.11, 0.17, 1.0]

);


drawObject(

    createCircle(
        0.0,
        0.07,
        0.075,
        30
    ),

    gl.TRIANGLE_FAN,

    [0.20, 0.85, 1.0, 1.0]

);



drawObject(

    createCircle(
        -0.14,
        0.07,
        0.025,
        20
    ),

    gl.TRIANGLE_FAN,

    [1.0, 0.25, 0.30, 1.0]

);


drawObject(

    createCircle(
        0.14,
        0.07,
        0.025,
        20
    ),

    gl.TRIANGLE_FAN,

    [0.30, 1.0, 0.45, 1.0]

);


drawObject(

    createRectangle(
        -0.43,
        0.00,
        0.16,
        0.48
    ),

    gl.TRIANGLES,

    [0.35, 0.40, 0.48, 1.0]

);


drawObject(

    createCircle(
        -0.43,
        -0.29,
        0.10,
        30
    ),

    gl.TRIANGLE_FAN,

    [0.55, 0.60, 0.68, 1.0]

);



drawObject(

    createRectangle(
        0.43,
        0.00,
        0.16,
        0.48
    ),

    gl.TRIANGLES,

    [0.35, 0.40, 0.48, 1.0]

);


drawObject(

    createCircle(
        0.43,
        -0.29,
        0.10,
        30
    ),

    gl.TRIANGLE_FAN,

    [0.55, 0.60, 0.68, 1.0]

);


drawObject(

    createRectangle(
        0.0,
        -0.37,
        0.42,
        0.12
    ),

    gl.TRIANGLES,

    [0.20, 0.24, 0.30, 1.0]

);


drawObject(

    createRectangle(
        -0.17,
        -0.60,
        0.19,
        0.40
    ),

    gl.TRIANGLES,

    [0.40, 0.45, 0.54, 1.0]

);


drawObject(

    createRectangle(
        0.17,
        -0.60,
        0.19,
        0.40
    ),

    gl.TRIANGLES,

    [0.40, 0.45, 0.54, 1.0]

);



drawObject(

    createRectangle(
        -0.17,
        -0.84,
        0.25,
        0.12
    ),

    gl.TRIANGLES,

    [0.25, 0.29, 0.36, 1.0]

);


drawObject(

    createRectangle(
        0.17,
        -0.84,
        0.25,
        0.12
    ),

    gl.TRIANGLES,

    [0.25, 0.29, 0.36, 1.0]

);