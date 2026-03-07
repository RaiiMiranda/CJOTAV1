// Não se faz mais usando protorype, agora é com class

// Função Construtora
function Enemy(type) {
    // Tipo do inimigo
    this.type = type;

    // Total de vida
    this.health = 100;
}

// Adiciona o método chamado attack() ao protótipo de Enemy
// Assim, todas as instância de Enemy compartilham esse método
Enemy.prototype.attack = function() {
    console.log(`O ${this.type} está atacando!`);
}

// Cria duas instâncias de Enemy
const raiane = new Enemy('Ogro');
const dias = new Enemy('Calango');

// Para cada instância, executa o método attack()
raiane.attack();
dias.attack();