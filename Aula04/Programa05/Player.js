// -------------------------------------------------------------------------------------------------
// -- Implementação da classe Player
// -------------------------------------------------------------------------------------------------

// Definindo a classe Player
export default class Player 
{
    // Construtor
    constructor(name, weapon) 
    {
        this.name = name;     // Nome do player
        this.weapon = weapon; // Arma inicial
        this.health = 100;    // Total de vida
    }

    // Controla o ataque do player
    attack() {
        console.log(`- ${this.name} deferiu um poderoso ataque de ${this.weapon}!`);
    }

    // Controla o dano causado pelo player
    takedamage(amount) 
    {
        this.health -= amount;
        console.log(`- ${this.name} recebeu ${amount} de dano. Vida atual: ${this.health}.`);
    }
}

