// Forma moderna de se fazer classes

// Define uma classe chamada Enemy
class Enemy {
    constructor(type) {
        this.type = type;

        this.health = 100;
    }

    attack() {
        console.log(`O ${this.type} está atacando!`);
    }
}

// Cria duas instâncias de Enemy
const raiane = new Enemy('Ogro');
const dias = new Enemy('Calango');

// Para cada instância, executa o método attack()
raiane.attack();
dias.attack();