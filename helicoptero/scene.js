class Scene {

    constructor(gl, program) {

        this.renderer = new Renderer(gl, program);

        this.helicopterBody = new HelicopterBody();
        this.helicopterTopShaft = new HelicopterTopShaft();
        this.helicopterTail = new HelicopterTail();
        this.helicopterPropellers = new HelicopterPropellers();
        this.helicopterTailPropeller = new HelicopterTailPropeller();

        this.posicaoX = 0.0;
        this.posicaoY = 0.0;

        this.velocidade = 0.01;

        this.rotacaoHeliceSuperior = 0.0;
        this.rotacaoHeliceCauda = 0.0;

        this.teclas = {};
    }

    iniciarTeclado() {

        window.addEventListener("keydown", (event) => {

            this.teclas[event.key] = true;

            if (
                event.key === "ArrowUp" ||
                event.key === "ArrowDown" ||
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight"
            ) {
                event.preventDefault();
            }
        });

        window.addEventListener("keyup", (event) => {
            this.teclas[event.key] = false;
        });
    }

    movimentar() {

        if (this.teclas["ArrowUp"]) {
            this.posicaoY += this.velocidade;
        }

        if (this.teclas["ArrowDown"]) {
            this.posicaoY -= this.velocidade;
        }

        if (this.teclas["ArrowLeft"]) {
            this.posicaoX -= this.velocidade;
        }

        if (this.teclas["ArrowRight"]) {
            this.posicaoX += this.velocidade;
        }
    }

    update() {

        this.movimentar();

        this.rotacaoHeliceSuperior += 0.25;
        this.rotacaoHeliceCauda += 0.30;

        const translacaoHelicoptero =
            m4.translation(
                this.posicaoX,
                this.posicaoY,
                0
            );

        this.helicopterBody.update(
            translacaoHelicoptero
        );

        this.helicopterTopShaft.update(
            translacaoHelicoptero
        );

        this.helicopterTail.update(
            translacaoHelicoptero
        );

        const rotacaoHeliceSuperior =
            m4.yRotation(
                this.rotacaoHeliceSuperior
            );

        const transformacaoHeliceSuperior =
            m4.multiply(
                translacaoHelicoptero,
                rotacaoHeliceSuperior
            );

        this.helicopterPropellers.update(
            transformacaoHeliceSuperior
        );

        const centroHeliceCauda =
            m4.translation(
                0.70,
                0.0,
                0.06
            );

        const rotacaoHeliceCauda =
            m4.zRotation(
                this.rotacaoHeliceCauda
            );

        const centroHeliceCaudaInverso =
            m4.translation(
                -0.70,
                0.0,
                -0.06
            );

        let transformacaoHeliceCauda =
            m4.multiply(
                centroHeliceCauda,
                rotacaoHeliceCauda
            );

        transformacaoHeliceCauda =
            m4.multiply(
                transformacaoHeliceCauda,
                centroHeliceCaudaInverso
            );

        transformacaoHeliceCauda =
            m4.multiply(
                translacaoHelicoptero,
                transformacaoHeliceCauda
            );

        this.helicopterTailPropeller.update(
            transformacaoHeliceCauda
        );
    }

    draw() {

        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT
        );

        gl.useProgram(program);

        this.helicopterBody.draw(
            this.renderer
        );

        this.helicopterTopShaft.draw(
            this.renderer
        );

        this.helicopterTail.draw(
            this.renderer
        );

        this.helicopterPropellers.draw(
            this.renderer
        );

        this.helicopterTailPropeller.draw(
            this.renderer
        );
    }

    execute() {

        this.update();

        this.draw();

        requestAnimationFrame(
            () => this.execute()
        );
    }

    init() {

        this.iniciarTeclado();

        requestAnimationFrame(
            () => this.execute()
        );
    }
}