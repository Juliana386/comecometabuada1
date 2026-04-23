let pac;
let ghosts = []; 
let foods = [];
let num1, num2, correct;
let score = 0;
let level = 1;
let maxScore = 350; // 7 fases

let estadoJogo = 0; 
let inputNome, btnIniciar;
let nomeAluno = "";
let ranking = []; 
let poolPerguntas = []; 

const resultadosReais = [4,6,8,9,10,12,14,15,16,18,20,21,24,25,27,28,30,32,35,36,40,42,45,48,49,54,56,63,64,72,81];
const coresFantasmas = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852']; 

function setup() {
  createCanvas(600, 600);
  
  carregarRanking(); 
  
  inputNome = createInput('');
  inputNome.position(230, 300); 
  inputNome.size(140, 30);
  inputNome.style('font-size', '16px');
  inputNome.style('text-align', 'center');
  
  btnIniciar = createButton('START GAME');
  btnIniciar.position(230, 350);
  btnIniciar.size(140, 40);
  btnIniciar.style('background-color', '#FF00FF');
  btnIniciar.style('color', 'white');
  btnIniciar.style('font-weight', 'bold');
  btnIniciar.style('border', 'none');
  btnIniciar.style('border-radius', '8px');
  btnIniciar.style('cursor', 'pointer');
  btnIniciar.mousePressed(prepararJogo);
}

function prepararJogo() {
  if (inputNome.value() !== "") {
    nomeAluno = inputNome.value();
  } else {
    nomeAluno = "Estudante";
  }
  
  inputNome.hide();
  btnIniciar.hide();
  
  poolPerguntas = [];
  for (let i = 2; i <= 9; i++) {
    for (let j = 2; j <= 9; j++) {
      poolPerguntas.push({n1: i, n2: j});
    }
  }
  poolPerguntas.sort(() => random() - 0.5);
  
  score = 0;
  level = 1;
  estadoJogo = 1;
  
  pac = new Pacman();
  ghosts = [];
  // Começa com apenas 1 monstrinho
  ghosts.push(new Ghost(level)); 
  
  novaPergunta();
}

function draw() {
  desenharFundoArcade();

  if (estadoJogo === 0) {
    fill(0, 255, 255);
    textSize(48);
    textAlign(CENTER);
    text("COME-COME DA", width / 2, 130);
    fill(255, 255, 0);
    textSize(40);
    text("TABUADA", width / 2, 180);
    
    fill(255);
    textSize(18);
    text("IDENTIFIQUE-SE PARA JOGAR:", width / 2, 280);

  } else if (estadoJogo === 1) {
    fill(10, 10, 20, 200);
    rect(0, 0, width, 70);
    
    fill(255, 255, 0);
    textSize(36);
    textAlign(CENTER, CENTER);
    text(num1 + " x " + num2 + " = ?", width / 2, 35);

    textSize(18);
    textAlign(LEFT, CENTER);
    fill(0, 255, 255); 
    text("FASE " + level, 20, 35);
    
    textAlign(RIGHT, CENTER);
    fill(255, 0, 255);
    text(score + " PTS", width - 20, 35);

    stroke(0, 255, 255);
    strokeWeight(3);
    line(0, 70, width, 70);
    noStroke();

    pac.update();
    pac.show();

    for (let g of ghosts) {
      g.update();
      g.show();
      if (pac.hits(g)) {
        estadoJogo = 2; 
        salvarRanking();
      }
    }

    let acertou = false;
    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
      
      if (!acertou && pac.eats(foods[i])) {
        if (foods[i].valor === correct) {
          score += 10;
          acertou = true; 
        } else {
          estadoJogo = 2; 
          salvarRanking();
        }
      }
    }
    
    if (acertou) {
      if (score >= maxScore) {
        estadoJogo = 3; 
        salvarRanking();
      } else {
        if (score >= level * 50) {
          level++;
          
          // LÓGICA DE ENTRADA DOS MONSTRINHOS
          if (level === 3) ghosts.push(new Ghost(level)); // Entra o 2º na Fase 3
          if (level === 5) ghosts.push(new Ghost(level)); // Entra o 3º na Fase 5

          // Atualiza a velocidade de TODOS os fantasmas vivos para a nova fase
          for (let g of ghosts) {
            g.atualizarVelocidade(level);
          }
        }
        novaPergunta();
      }
    }

  } else if (estadoJogo === 2 || estadoJogo === 3) {
    if (estadoJogo === 3) {
      fill(0, 255, 0); 
      textSize(48);
      textAlign(CENTER);
      text("Z E R O U ! 🏆", width / 2, 100);
      
      fill(255);
      textSize(20);
      text("Você destruiu a tabuada, " + nomeAluno + "!", width / 2, 140);
    } else {
      fill(255, 0, 0);
      textSize(50);
      textAlign(CENTER);
      text("GAME OVER", width / 2, 100);
    }
    
    fill(255, 255, 0);
    textSize(28);
    text("SCORE: " + score, width / 2, 180);
    
    desenharRanking();
    
    fill(0, 255, 255);
    textSize(18);
    if (frameCount % 60 < 30) {
      text("PRESSIONE [ ESPAÇO ] PARA REINICIAR", width / 2, height - 30);
    }
  }
}

function desenharFundoArcade() {
  let r = map(level, 1, 7, 10, 40);
  let g = map(level, 1, 7, 10, 10);
  let b = map(level, 1, 7, 30, 60);
  background(r, g, b); 
  
  stroke(255, 255, 255, 15); 
  strokeWeight(2);
  for(let i = 0; i < width; i += 40) {
    line(i, 0, i, height);
    line(0, i, width, i);
  }
  noStroke();
}

function desenharRanking() {
  fill(0, 0, 0, 150);
  stroke(0, 255, 255);
  strokeWeight(2);
  rect(150, 220, 300, 300, 10); 
  noStroke();
  
  fill(0, 255, 255);
  textSize(24);
  textAlign(CENTER);
  text("HIGH SCORES", width / 2, 260);
  
  textSize(20);
  textAlign(LEFT);
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].nome === nomeAluno && ranking[i].score === score) {
      fill(255, 255, 0); 
    } else {
      fill(255);
    }
    
    let texto = (i + 1) + ". " + ranking[i].nome;
    let textoPontos = ranking[i].score;
    
    text(texto, 180, 310 + (i * 40));
    textAlign(RIGHT);
    text(textoPontos, 420, 310 + (i * 40));
    textAlign(LEFT);
  }
}

function salvarRanking() {
  ranking.push({nome: nomeAluno, score: score});
  ranking.sort((a, b) => b.score - a.score);
  if (ranking.length > 5) {
    ranking = ranking.slice(0, 5);
  }
  try {
    localStorage.setItem('tabuadaRankingV2', JSON.stringify(ranking));
  } catch(e) { }
}

function carregarRanking() {
  try {
    let salvo = localStorage.getItem('tabuadaRankingV2');
    if (salvo) ranking = JSON.parse(salvo);
  } catch(e) { }
}

function keyPressed() {
  if (estadoJogo === 1) {
    if (keyCode === UP_ARROW) pac.setDir(0, -1);
    else if (keyCode === DOWN_ARROW) pac.setDir(0, 1);
    else if (keyCode === LEFT_ARROW) pac.setDir(-1, 0);
    else if (keyCode === RIGHT_ARROW) pac.setDir(1, 0);
  } else if (key === ' ' && (estadoJogo === 2 || estadoJogo === 3)) {
    estadoJogo = 0;
    inputNome.show();
    inputNome.value(''); 
    btnIniciar.show();
  }
}

function novaPergunta() {
  if (poolPerguntas.length > 0) {
    let pergunta = poolPerguntas.pop();
    num1 = pergunta.n1;
    num2 = pergunta.n2;
  } else {
    num1 = floor(random(2, 10));
    num2 = floor(random(2, 10));
  }
  
  correct = num1 * num2;
  foods = [];

  let posicoes = [];
  
  while (posicoes.length < 4) {
    let rx = random(70, width - 70);
    let ry = random(140, height - 70);
    
    if (dist(rx, ry, width / 2, height / 2 + 30) < 110) continue;
    
    let sobreposto = false;
    for (let p of posicoes) {
      if (dist(rx, ry, p.x, p.y) < 90) {
        sobreposto = true;
        break;
      }
    }
    
    if (!sobreposto) {
      posicoes.push(createVector(rx, ry));
    }
  }
  
  let indiceCerta = floor(random(0, 4));
  let alternativasErradas = []; 

  for (let i = 0; i < 4; i++) {
    if (i === indiceCerta) {
      foods.push(new Food(posicoes[i].x, posicoes[i].y, correct, true)); 
    } else {
      let errada = random(resultadosReais);
      while (errada === correct || alternativasErradas.includes(errada)) {
        errada = random(resultadosReais); 
      }
      alternativasErradas.push(errada);
      foods.push(new Food(posicoes[i].x, posicoes[i].y, errada, false));
    }
  }
  
  pac.x = width / 2;
  pac.y = height / 2 + 30;
  pac.vx = 0;
  pac.vy = 0;
}

class Pacman {
  constructor() {
    this.x = width / 2;
    this.y = height / 2 + 30;
    this.vx = 0;
    this.vy = 0;
    this.raio = 22; 
    this.speed = 4.5; 
  }
  setDir(x, y) {
    this.vx = x * this.speed;
    this.vy = y * this.speed;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.x = constrain(this.x, this.raio, width - this.raio);
    this.y = constrain(this.y, 70 + this.raio, height - this.raio);
  }
  show() {
    fill(0, 50);
    ellipse(this.x + 4, this.y + 4, this.raio * 2);
    
    fill(255, 255, 0);
    let mouthAngle = abs(sin(frameCount * 0.3)) * 0.7; 
    
    push();
    translate(this.x, this.y);
    if (this.vx > 0) rotate(0); 
    else if (this.vx < 0) rotate(PI); 
    else if (this.vy > 0) rotate(HALF_PI); 
    else if (this.vy < 0) rotate(-HALF_PI); 
    
    arc(0, 0, this.raio * 2, this.raio * 2, mouthAngle, PI * 2 - mouthAngle, PIE);
    
    fill(0); 
    ellipse(-this.raio/4, -this.raio/2, this.raio/2.5); 
    pop();
  }
  eats(food) {
    let d = dist(this.x, this.y, food.x, food.y);
    return d < this.raio + food.raio; 
  }
  hits(ghost) {
    let d = dist(this.x, this.y, ghost.x, ghost.y);
    return d < this.raio + ghost.raio - 8; 
  }
}

class Ghost {
  constructor(faseAtual) {
    this.x = random([50, width-50]); 
    this.y = random(120, height-100);
    this.raio = 20; 
    this.cor = random(coresFantasmas);
    
    // Define a velocidade inicial baseada na fase em que ele nasceu
    this.vx = 0;
    this.vy = 0;
    this.atualizarVelocidade(faseAtual);
  }
  
  atualizarVelocidade(faseAtual) {
    // FÓRMULA MAIS LENTA PARA O COMEÇO
    // Fase 1: Vel = 1.65 (Bem devagar)
    // Fase 7: Vel = 3.15 (Rápido e desafiador)
    let novaVelBase = 1.4 + (faseAtual * 0.25);
    
    // Mantém a direção que ele já estava indo, só altera a força
    if (this.vx === 0 && this.vy === 0) {
      // Primeira vez que recebe velocidade
      this.vx = random([-novaVelBase, novaVelBase]);
      this.vy = random([-novaVelBase, novaVelBase]);
    } else {
      // Acelera mantendo a direção
      this.vx = (this.vx > 0) ? novaVelBase : -novaVelBase;
      this.vy = (this.vy > 0) ? novaVelBase : -novaVelBase;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < this.raio || this.x > width - this.raio) this.vx *= -1;
    if (this.y < 70 + this.raio || this.y > height - this.raio) this.vy *= -1;
  }
  
  show() {
    fill(0, 50);
    ellipse(this.x + 4, this.y + 4, this.raio * 2);
    
    fill(this.cor); 
    
    beginShape();
    vertex(this.x - this.raio, this.y); 
    vertex(this.x - this.raio, this.y + this.raio); 
    vertex(this.x - this.raio/2, this.y + this.raio - 5); 
    vertex(this.x, this.y + this.raio); 
    vertex(this.x + this.raio/2, this.y + this.raio - 5); 
    vertex(this.x + this.raio, this.y + this.raio); 
    vertex(this.x + this.raio, this.y); 
    
    for (let a = 0; a <= PI; a += 0.1) {
      let sx = this.x + cos(a) * this.raio;
      let sy = this.y - sin(a) * this.raio;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    
    fill(255);
    ellipse(this.x - 7, this.y - 4, 12, 12);
    ellipse(this.x + 7, this.y - 4, 12, 12);
    fill(0, 0, 255);
    
    let pX = (this.vx > 0) ? 2 : -2;
    ellipse(this.x - 7 + pX, this.y - 4, 6, 6);
    ellipse(this.x + 7 + pX, this.y - 4, 6, 6);
  }
}

class Food {
  constructor(x, y, valor, isCorrect) {
    this.x = x;
    this.y = y;
    this.valor = valor;
    this.raio = 22; 
    this.offset = random(100); 
  }
  show() {
    let pulse = sin((frameCount + this.offset) * 0.1) * 3;
    let rAtual = this.raio + pulse;
    
    fill(0, 255, 0, 50); 
    ellipse(this.x, this.y, rAtual * 2.2);
    
    stroke(0, 200, 0);
    strokeWeight(2);
    fill(10, 40, 10);
    ellipse(this.x, this.y, rAtual * 1.8);
    noStroke();
    
    fill(0, 255, 0); 
    textSize(20); 
    textAlign(CENTER, CENTER);
    text(this.valor, this.x, this.y);
  }
}
