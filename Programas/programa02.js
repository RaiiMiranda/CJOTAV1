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
var nome = "IFSP";


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

// Apresentado as mensagens
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

// Apresentado o resultado
console.log(resultado);