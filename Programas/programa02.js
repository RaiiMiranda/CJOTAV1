// -----------------------------------------------------------------------------------
// Compilar o código
// -----------------------------------------------------------------------------------
// Abrir o console: ctrl + j
// Escrever: node nome_do_programa.js
// -----------------------------------------------------------------------------------

// Saída no console
console.log("Olá, mundo!");

// -----------------------------------------------------------------------------------
// Declaração de Variáveis e Escopos
// -----------------------------------------------------------------------------------

// Escopo de bloco: mutável (pode alterá-lo no decorrer do código)
let idade = 42;

// Escopo de bloco: imutável (constantes)
const PI = 3.14;

// Escopo de funçao ou global: desencorajado
var nome1 = "IFSP";


// -----------------------------------------------------------------------------------
// Tipos Primitivos
// -----------------------------------------------------------------------------------
let nome = "Raiane" // string
let energia = 100   // number
let podeVoar = true // boolean
let item = null     // null
let fraqueza;       // undefined


// -----------------------------------------------------------------------------------
// Operador typeof (descobrir o tipo da variável)
// -----------------------------------------------------------------------------------
console.log(typeof nome);      // string
console.log(typeof energia);   // number
console.log(typeof podeVoar);  // boolean
console.log(typeof item);      // object
console.log(typeof fraqueza);  // object
console.log(typeof null);      // object
console.log(typeof undefined); // undefined


// -----------------------------------------------------------------------------------
// Operadores Aritméticos
// -----------------------------------------------------------------------------------

// Declara 3 variáveis do tipo inteiro
let a = 10;
let b = 5;
let c = 3;

console.log(a + b)  // Adição
console.log(a - b)  // Subtração
console.log(a * b)  // Multiplicação
console.log(a / b)  // Divisão
console.log(a % b)  // Módulo
console.log(c ** 2) // Exponenciação

a++; // Incrementa
b--; // Decrementa


// -----------------------------------------------------------------------------------
// Operadores de Comparação
// -----------------------------------------------------------------------------------

// Compara valor e tipo, tem que os dois serem iguais
// Estritamente: === !==
// 10 '10' (valor é igual, mas o tipo não é)


// -----------------------------------------------------------------------------------
// Operador Ternário
// -----------------------------------------------------------------------------------

// Energia inicial
let health = 100;
let playerStatus = (health > 0) ? "Playing..." : "Game Over!";

// Playing...
console.log(playerStatus); 

// Zera a energia
health = 0;
playerStatus = (health > 0) ? "Playing..." : "Game Over!";

// Game Over!
console.log(playerStatus); 


// -----------------------------------------------------------------------------------
// Declaração de Função
// -----------------------------------------------------------------------------------

function saudacao(nome) {
    return `Olá, ${nome}`; // Concatenando o texto com a variável
    // Outra forma: return "Olá, " + nome;
}

// Utilizando a função
let mensagem = saudacao("Raiane");

// Olá, Raiane
console.log(mensagem);


// -----------------------------------------------------------------------------------
// Declaração de Função com Valor Padrão
// -----------------------------------------------------------------------------------

function saudacao(nome = "Visitante") {
    return `Olá, ${nome}`; 
}

// Utilizando a função
let mensagem1 = saudacao();
let mensagem2 = saudacao("Raiane");

// Apresentando as mensagens
console.log(mensagem1);
console.log(mensagem2);


// -----------------------------------------------------------------------------------
// Expressão de Função
// -----------------------------------------------------------------------------------

// Cria a função e atribui seu retorno à variável
const calcularDano = function(energia, dano) {
    return energia - dano;
}

// Utilizando a função
let resultado = calcularDano(100, 10);

// Apresentando o resultado
console.log(resultado);


// -----------------------------------------------------------------------------------
// Arrow Function
// -----------------------------------------------------------------------------------

// Soma dois valores passados como parãmetros
const somar = (a, b) => {
    return a + b;
};

// Utilizando a função
console.log(somar(10, 5));


// -----------------------------------------------------------------------------------
// Arrow Function (simplificada)
// -----------------------------------------------------------------------------------

// Se a função tem apenas uma instrução, ela pode ser simplificada
const subtrair = (a, b) => a - b;

// Utilizando a função
console.log(subtrair(10, 3));


// -----------------------------------------------------------------------------------
// Estrutura de Decisão: if ... else
// -----------------------------------------------------------------------------------

let health2 = 100;

// Verifica a saúde do player
if (health2 > 0) console.log(`Player health: ${health2}`);
else console.log("Game Over!");


// -----------------------------------------------------------------------------------
// Estrutura de Decisão Aninhada
// -----------------------------------------------------------------------------------

let health3 = 30;

// Verifica a saúde do player
if (health3 > 30) console.log(`Player is alive: ${health3}`);
else if (health3 > 0 && health3 <= 30) console.log(`Player is almost dying: ${health3}`);
else console.log(`Player died: ${health3}`);


// -----------------------------------------------------------------------------------
// Estrutura de Decisão: switch ... case
// -----------------------------------------------------------------------------------

const playerState = "idle";

// Verifica o estado do player
switch (playerState) {
    case "walk":
        console.log("Player is walking");
        break;
    case "jump":
        console.log("Player is jumping");
        break;
    default:
        console.log("Player is idle");
}


// -----------------------------------------------------------------------------------
// Arrays
// -----------------------------------------------------------------------------------

// Literal de Array
// Maneira mais comum
let frutas = ["Maçã", "Banana", "Laranja"];
let numeros = [1, 2, 3, 4, 5];
let misto = [10, "Texto", true, null];

// Construtor Array
// Utilizado para arrays mais complexos
let cores = new Array("vermelho", "verde", "azul");

// Acessando os elementos do array
console.log(frutas[0]);
console.log(frutas[2]);

// Modificando um elemento
frutas[1] = "Morango";

// Exibindo todo o array
console.log(frutas);


// -----------------------------------------------------------------------------------
// Funções em Arrays
// -----------------------------------------------------------------------------------

// length()  - retorna o tamanho
// push()    - insere um elemento no final
// pop()     - remove o último elemento
// unshift() - insere um elemento no início e retorna o tamanho do array
// shift()   - remove o primeiro elemento e retorna ele
// indexOf() - retorna o primeiro índice
// slice()   - retorna uma cópia de uma parte do array original, sem modificá-lo
// splice()  - altera o conteúdo do array original

// length() retorna o tamanho do array
// -----------------------------------------------------------------------------------
console.log(frutas.length);

// push() insere como último elemento
// -----------------------------------------------------------------------------------
frutas.push("Uva");
console.log(frutas);

// pop() remove o último elemento e o retorna
// -----------------------------------------------------------------------------------
let ultimaFruta = frutas.pop();
console.log(ultimaFruta);
console.log(frutas);

// unshift() adiciona "Pera" no início do array
// -----------------------------------------------------------------------------------
frutas.unshift("Pera");
console.log(frutas);

// shift() remove o primeiro elemento e o retorna
// -----------------------------------------------------------------------------------
let primeiraFruta = frutas.shift();
console.log(primeiraFruta);
console.log(frutas);

// indexOf() retorna o primeiro índice em que um
// elemento pode ser encontrado no array, ou -1 se o
// elemento não estiver presente
// -----------------------------------------------------------------------------------
console.log(frutas.indexOf("Laranja"));
console.log(frutas.indexOf("Abacaxi"));

// slice() retorna uma cópia superficial de uma 
// porção de um array em um novo array, sem 
// modificar o array original
// -----------------------------------------------------------------------------------

// gera um array com os elementos de índice 0 e 1
let algumasFrutas = frutas.slice(0, 2);
console.log(algumasFrutas);
console.log(frutas);

// splice() altera o conteúdo de um array removendo,
// substituindo ou adicionando elementos, modificando 
// o array original
// -----------------------------------------------------------------------------------

// remove 1 elemento a partir do índice 1
frutas.splice(1, 1);
console.log(frutas);

// adiciona kiwi e manga a partir do índice 1
frutas.splice(1, 0, "Kiwi", "Manga");
console.log(frutas);


// -----------------------------------------------------------------------------------
// Objetos
// -----------------------------------------------------------------------------------

// Literal de Objeto
// Maneira mais comum
let player = {
    name: "Shereke",
    health: 100,
    type: "Ogro",
    slogan: function() {
        return "Uga, Uga... Grrrrr!";
    }
}

// Apresentando o Shereke
console.log(`${player.name} says: ${player.slogan()}`);

// Construtor Object
// Utilizado para objetos mais complexos
let item2 = new Object();

item2.type = "Arma";
item2.points = 25;

// Apresentando com Notação de Ponto
console.log(player.name);

// Apresentando com Notação de Colchetes
let propriedade = "health";
//console.log(player[name]);
console.log(player[propriedade]);

// Modificando uma propriedade existente
player.health = 90;

// Adicionando uma nova propriedade
player.weapon = "Porrete";

// Exibe os valores
console.log(player.health);
console.log(player.weapon);

// Deleta uma propriedade
delete player.weapon;

// Saída: undefined
console.log(player.weapon);

// Altera o retorno do método slogan()
player.slogan = () => "Eu quero, eu posso";

// Adiciona um novo método
player.attack = (type) => `Uga, Uga... Toma uma ${type}! Grrrr...`;

// Uga, Uga... Toma uma porretada! Grrrr...
player.attack("porretada");
player.slogan();


// -----------------------------------------------------------------------------------
// Estrutura de Repetição
// -----------------------------------------------------------------------------------

// Laço: For
for (let i = 0; i < 5; i++) console.log(`O valor de i é: ${i}`);

let itens = ["moeda", "espada", "poção", "chave"];
for (let i = 0; i < itens.length; i++) console.log(`Item ${i+1}: ${itens[i]}`);

// Laço: While
let contador = 0;

while (contador < 11) {
    console.log(`Contador: ${contador}`);
    contador++;
}

// Laço: Do While
const valorEscolhido = 5; // valor escolhido
const faixa = [0, 10];    // limite de valroes
let tentativas = 0;       // qntd de tentativas
let numeroSorteado = null // numero a ser sorteado

do {
    // Incrementa as tentativas
    tentativas++;

    // Sorteia um valor aleatório, dentro da faixa de valores (inclusiva)
    numeroSorteado = Math.floor(Math.random() * (faixa[1] - faixa[0] + 1)) + faixa[0];

    // Exibe no console
    console.log(`Tentativas ${tentativas}: ${numeroSorteado}`);
}
while(numeroSorteado !== valorEscolhido);

// Exibe o total de tentativas que foram utilizadas
console.log(`Encontrou o número em ${tentativas} tentativas.`);


// -----------------------------------------------------------------------------------
// 
// -----------------------------------------------------------------------------------




// -----------------------------------------------------------------------------------
// 
// -----------------------------------------------------------------------------------
