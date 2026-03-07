// ---------------------------------------------------
// -- Implementação da classe Player
// ---------------------------------------------------

export default class Player 
{
    constructor(name, weapon) 
    {
        this.name = name;     // Nome do player
        this.weapon = weapon; // Arma inicial
        this.health = 100;    // Total de vida
    }

    attack() {
        console.log(`- ${this.name} deferiu um poderoso ataque de ${this.weapon}!`);
    }
}

