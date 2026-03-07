// -------------------------------------------------------------------------------------------------
// -- Implementação da classe Cangaceiro
// -------------------------------------------------------------------------------------------------

// Importa a classe Player
import Player from './Player.js';

// Cangaceiro é uma classe derivada de Player
export default class Cangaceiro extends Player 
{
    // Construtor
    constructor(name, weapon, petName, petType) 
    {
        // Construtor da classe Player
        super(name, weapon); 

        this.petName = petName;
        this.petType = petType;
    }

    // Método exclusivo do Cangaceiro
    callPet() {
        console.log(`- ${this.name} chama seu ${this.petType} ${this.petName} para auxiliar na batalha...`);
    }

    // Sobrescrevendo o método attack()
    attack() {
        console.log(`- ${this.name} faz um ataque duplo de ${this.weapon} e ${this.petType}!`);
    }
}