// Affichage modal au lancement du site

/*
$(document).ready(function () {
  $("#myModal").modal("show");
});
*/

// Coding Jeu

//  ------ ATTRIBUTS ------ //
var that = this;
this.context_width = window.innerWidth; // récup la largeur de la fenêtre de l"user
this.context_height = window.innerHeight; // récup la hauteur de la fenêtre de l'user
this.fps = 60;
this.game = document.querySelector(".bloc-jeu");
this.score = 0;
this.life = 4;
this.targets = []; // Cibles généréss
this.targetsShot = []; // Cibles touchées

// ------ METHODS ------ //

// On lance le jeu dès que la modal disparaît
function startGame() {
  game.start();
}
// quand une cible atteint une certaine distance (ici y > 765 ), le jeu s'arrête (ou retira une vie)
function targetGone() {
  for (let i = 0; i < targets.length; i++) if (targets[i].y > 765) return true;
}
function clickHandler(event) {
  x = event.clientX - game.canvas.offsetLeft;
  y = event.clientY - game.canvas.offsetTop;
  checkTarget(x, y);
}
function checkTarget() {
  for (let i = 0; i < targets.length; i++) {
    if (
      x >= targets[i].x &&
      x <= targets[i].x + 20 &&
      y >= targets[i].y &&
      y <= targets[i].y + 20
    ) {
      targets[i].shot = true;
      targetsShot.push(targets[i]);
      targets.splice(i, 1);
      score++;
    }
  }
}

// C'est ici où on va créer l'espace de jeu
// Je vais créer un canvas et c'est à l'intérieur que je vais dessiner les blocs
var game = {
  canvas: document.getElementById("myCanvas"),
  start: function () {
    this.canvas.width = 843;
    this.canvas.height = 835;
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("click", clickHandler, event);
    requestAnimationFrame(game.update);

    game.update();
  },
  update: function () {
    game.context.clearRect(0, 0, 843, 835);
    // Affichage de la zone de défaite (si une target touche cette zone, la partie se termine)
    game.context.fillStyle = "#66ffff";
    game.context.fillRect(0, 780, 843, 50);
    // Affichage du score en direct
    document.querySelector(".affichage-score").innerHTML = score;
    // Si l'user atteint 50 points on arrête le jeu
    if (score == 50) {
      return game.stop(true);
    }
    // si la cible a atteint le bas du jeu
    if (targetGone()) {
      return game.stop(false);
    }
    // on ajoute des cibles au fur et à mesure
    if (targets.length == 0 || targets[targets.length - 1].y >= distance) {
      var t = new target();
      targets.push(t);
      distance = Math.floor(Math.random() * 120);
    }
    for (let i = 0; i < targets.length; i++) targets[i].draw();
    if (targetsShot.length > 0) {
      for (let i = 0; i < targetsShot.length; i++) targetsShot[i].draw();
      for (let j = 0; j < targetsShot.length; j++)
        if (targetsShot[j].shotCount == 15) targetsShot.splice(j, 1);
    }
    requestAnimationFrame(game.update);
  },
  // On gère la victoire ou la défaite de l'user ici
  stop: function (win) {
    game.canvas.removeEventListener("click", clickHandler, event);
    game.context.fillStyle = "white";
    game.context.globalAlpha = 0.5;
    game.context.fillRect(0, 0, 843, 835);
    game.context.globalAlpha = 1.0;
    game.context.fillRect(0, 100, 843, 835);
    game.context.font = "20px Consolas"; // texte qui s'affiche à la fin de la partie
    // si on gagne
    if (win) {
      game.context.fillStyle = "LawnGreen";
      game.context.fillText("Vous avez gagné!!", 40, 150);
    } else {
      game.context.fillStyle = "red";
      game.context.fillText(
        "Perdu!! Votre score est: " + score + " points",
        40,
        150
      );
    }
  },
};

// cibles
function target() {
  this.x = Math.floor(Math.random() * 290); // affiche sur l'axe x random
  this.y = 0; // pour que ça parte du haut de la page
  this.shot = false; // détecte si la cible a été touché
  this.shotCount = 0;
  this.draw = function () {
    game.context.fillStyle = "orange"; // couleur cible
    if (this.shot) {
      this.shotCount++; // à chaque fois qu'une cible est touchée on rajoute +1 au score
      game.context.fillRect(this.x, this.y, 4, 4);
      game.context.fillRect(this.x + 4, this.y + 4, 4, 4);
      game.context.fillRect(this.x + 12, this.y + 4, 4, 4);
      game.context.fillRect(this.x + 16, this.y, 4, 4);
      game.context.fillRect(this.x + 4, this.y + 12, 4, 4);
      game.context.fillRect(this.x, this.y + 16, 4, 4);
      game.context.fillRect(this.x + 12, this.y + 12, 4, 4);
      game.context.fillRect(this.x + 16, this.y + 16, 4, 4);
    } else {
      game.context.fillRect(this.x, this.y, 20, 20);
      this.y += 0.3;
    }
  };
}
