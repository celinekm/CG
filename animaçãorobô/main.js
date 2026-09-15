class ParteDoCorpo {
  constructor(x, y, largura, altura, corPreenchimento, corBorda) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.corPreenchimento = corPreenchimento;
    this.corBorda = corBorda;
  }

  desenhar(ctx) {
    ctx.save(); 
    ctx.translate(this.x, this.y);

    ctx.fillStyle = this.corPreenchimento;
    ctx.fillRect(0, 0, this.largura, this.altura);
    ctx.strokeStyle = this.corBorda;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.largura, this.altura);

    ctx.restore(); 
  }
}

class CabecaRobo extends ParteDoCorpo {
  constructor(x, y, largura, altura, corPreenchimento, corBorda) {
    super(x, y, largura, altura, corPreenchimento, corBorda);
  }

  desenhar(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.strokeStyle = this.corBorda;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.largura / 2, 0);
    ctx.lineTo(this.largura / 2, -12);
    ctx.stroke();

    ctx.fillStyle = '#e53e3e'; 
    ctx.beginPath();
    ctx.arc(this.largura / 2, -14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.corPreenchimento;
    ctx.fillRect(0, 0, this.largura, this.altura);
    ctx.strokeStyle = this.corBorda;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.largura, this.altura);

    ctx.fillStyle = '#00f5d4'; 
    ctx.fillRect(8, 12, this.largura - 16, 12);
    ctx.strokeStyle = '#2d3748';
    ctx.strokeRect(8, 12, this.largura - 16, 12);

    ctx.restore();
  }
}

class CorpoRobo extends ParteDoCorpo {
  constructor(x, y, largura, altura, corPreenchimento, corBorda) {
    super(x, y, largura, altura, corPreenchimento, corBorda);
  }

  desenhar(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.fillStyle = this.corPreenchimento;
    ctx.fillRect(0, 0, this.largura, this.altura);
    ctx.strokeStyle = this.corBorda;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.largura, this.altura);

    ctx.fillStyle = '#2d3748';
    ctx.fillRect(12, 15, this.largura - 24, 35);

    ctx.fillStyle = '#3182ce';
    ctx.fillRect(20, 25, 10, 10);
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(35, 25, 10, 10);
    ctx.fillStyle = '#48bb78';
    ctx.fillRect(50, 25, 10, 10);

    ctx.restore();
  }
}

class BracoAcenando extends ParteDoCorpo {
  constructor(x, y, largura, altura, corPreenchimento, corBorda) {
    super(x, y, largura, altura, corPreenchimento, corBorda);
    this.anguloRotacao = 0;
  }

  atualizar(tempo) {
    this.anguloRotacao = -2.2 + Math.sin(tempo * 5) * 0.4;
  }

  desenhar(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);

    ctx.fillStyle = '#a0aec0';
    ctx.beginPath();
    ctx.arc(this.largura / 2, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.rotate(this.anguloRotacao);

    ctx.fillStyle = this.corPreenchimento;
    ctx.fillRect(0, 0, this.largura, this.altura);
    ctx.strokeStyle = this.corBorda;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, this.largura, this.altura);

    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(-2, this.altura, this.largura + 4, 8);
    ctx.strokeRect(-2, this.altura, this.largura + 4, 8);

    ctx.restore();
  }
}

class Robo {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const cinzaMetal = '#718096';
    const cinzaEscuro = '#4a5568';
    const borda = '#1a202c';

    this.corpo = new CorpoRobo(-40, -40, 80, 100, cinzaMetal, borda);
    this.cabeca = new CabecaRobo(-25, -90, 50, 45, cinzaMetal, borda);
    this.bracoEsquerdo = new ParteDoCorpo(-55, -35, 12, 60, cinzaMetal, borda);
    this.bracoDireito = new BracoAcenando(40, -35, 12, 60, cinzaMetal, borda);
    this.pernaEsquerda = new ParteDoCorpo(-30, 60, 20, 60, cinzaEscuro, borda);
    this.pernaDireita = new ParteDoCorpo(10, 60, 20, 60, cinzaEscuro, borda);
  }

  atualizar(tempo) {
    this.bracoDireito.atualizar(tempo);
  }

  desenhar(ctx) {
    ctx.save();

    ctx.translate(this.x, this.y);

    this.pernaEsquerda.desenhar(ctx);
    this.pernaDireita.desenhar(ctx);
    this.bracoEsquerdo.desenhar(ctx);
    this.corpo.desenhar(ctx);
    this.cabeca.desenhar(ctx); 
    this.bracoDireito.desenhar(ctx);

    ctx.restore();
  }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const robo = new Robo(canvas.width / 2, canvas.height / 2);
let tempo = 0;

function loopAnimacao() {
  tempo += 0.03;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  robo.atualizar(tempo);
  robo.desenhar(ctx);

  requestAnimationFrame(loopAnimacao);
}

loopAnimacao();