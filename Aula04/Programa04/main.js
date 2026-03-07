// Importa  a classe Player, como se fosse sua interface
import Player from './Player.js';

// Exibindo no console
console.log("\n=> Playing... The Calango's Hunter \n");

// Instanciamento do player
const player = new Player('Victoria Mrad', 'peixeira');

// Executa o ataque do player
player.attack();

// Exibindo no console
console.log();