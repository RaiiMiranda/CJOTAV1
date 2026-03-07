// -------------------------------------------------------------------------------------------------
// -- Programa Principal
// -------------------------------------------------------------------------------------------------

// Importa  a classe Cangaceiro, como se fosse sua interface
import Cangaceiro from './Cangaceiro.js';

// Exibindo no console
console.log("\n=> Playing... The Calango's Hunter \n");

// Instanciamento do player
const player = new Cangaceiro('Victoria Mrad', 'peixeira', 'Lampião', 'calango');

// Executa algumas ações
player.callPet();      // função exclusiva do cangaceiro
player.attack();       // sobrescreveu a função attack() do player
player.takedamage(30); // consegue acessar essa função por conta da herança

// Pulando linha
console.log();