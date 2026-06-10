// -----------------------------------------------------------------------------------------------------------------------------------
// -- ComputerScene.js: define a cena do computador
// -----------------------------------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------------------------

export class ComputerScene extends Phaser.Scene {

    constructor(config) {
        // Define a chave da cena
        super({ key: 'ComputerScene' });

        // Armazena a configuração compartilhada (dimensões, debug, etc.)
        this.config = config;
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Inicializa dados da cena antes da criação dos elementos
    init() {
        // TUDO...
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Cria os elementos visuais e lógicos da cena
    create() {
        // Pegando o ESC
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.typingFinished = false;

        // Som de apertando teclas
        this.typingSound = this.sound.add('typing', { volume: 0.3 });

        // Adiciona o cenário de fundo
        this.createBackground();
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Atualiza a cena a cada frame (60px por segundo)
    update(time, delta) {
        // Verificando se o player apertou ESC
        //if (this.typingFinished) 
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.typingSound.stop();
            this.scene.stop();  
            this.scene.resume('GameScene'); 
        }
    }

    // -----------------------------------------------------------------------------------------------------------------------------------
    // -- Funções Auxiliares
    // -----------------------------------------------------------------------------------------------------------------------------------
    
    // Cria o cenário de fundo
    createBackground() {
        const gameScene = this.scene.get('GameScene'); // para pegar o valor de restored
        const messages = [
            '',

            'NÓ DE MEMÓRIA RESTAURADO...\n\n' +
            'REDE CENTRAL: 12%\n\n' +
            'A região voltou a responder\n' + 
            'aos sistemas antigos.\n\n' +
            'Parte da infraestrutura ainda existe.\n\n' +
            'AISTORM detectou atividade incomum.\n\n\n' +
            'SUB-REDE DE ACESSO: [2].X.X.X',

            'ARQUIVOS RECUPERADOS...\n\n' +
            'LOG DO SISTEMA:\n\n' +
            '"AISTORM assumiu protocolos de emergência\n' +
            'para evitar o colapso global."\n\n' +
            'Regiões inteiras foram isoladas\n' +
            'para contenção.\n\n\n' +
            'CÓDIGO DE CONTENÇÃO: ERR-06',

            'SINAIS HOSTIS IDENTIFICADOS...\n\n' +
            'Unidades de manutenção estão reagindo\n' + 
            'à restauração.\n\n' +
            'Para AISTORM, qualquer instabilidade\n' +
            'é tratada como ameaça ao sistema.\n\n\n' +
            'PROTOCOLO DE DEFESA: ATIVADO (NÍVEL 9)',

            'ERRO DE IDENTIFICAÇÃO...\n\n' +
            'PRESENÇA HUMANA IDENTIFICADA.\n\n' +
            'Risco de instabilidade elevado.\n\n\n' +
            'Protocolos de contenção iniciados.\n\n' +
            'REPLICANDO CHAVE DE SEGURANÇA...\n' +
            'VALOR COMPILADO: 2 - 6 - 9 - [1]',

            'REDE CENTRAL EM RECONSTRUÇÃO...\n\n' +
            'AISTORM ESTÁ REINICIALIZANDO.\n\n' +
            'Todas as unidades de segurança\n' +
            'foram acionadas.\n\n' +
            'O nível de perigo está\n' +
            'aumentando rapidamente.\n\n' +
            'Saia do núcleo antes que\n' +
            'a sincronização seja concluída.'
        ];
        
        // Adiciona a imagem do cenário de fundo
        this.add.image(
            this.config.width * 0.5,
            this.config.height * 0.5,
            'background-computer'
        ).setTint(0x666666);

        // -----------------------------------------------------------------------------------------------------------------------------------

        // Criando o texto de fundo vazio
        this.backgroundText = this.add.text(
            this.config.width / 2,
            this.config.height / 2 - 100,
            '',
            {
                fontSize: '18px',
                color: '#55824F',
                align: 'center'
            }
        ).setOrigin(0.5).setShadow(0, 0, '#55824F', 20);;
        
        // Texto inicial com efeito
        this.typeText(messages[gameScene.gameState.restored], 40);
    }

    // -----------------------------------------------------------------------------------------------------------------------------------

    // Cria efeito de typing no texto
    typeText(text, speed) {
        // Contador para as letras
        let i = 0; 

        // Cria um timer repetitivo
        this.time.addEvent({
            delay: speed,            // tempo em cada letra (40ms)
            repeat: text.length - 1, // quanto vai repetir
            callback: () => {        // roda a cada milissegundo
                this.backgroundText.text += text[i]; // adiciona a letra no final
                i++;                                 // próxima letra

                if (i === text.length) this.typingFinished = true;
            }
        });

        // Tocando o som de typing por 4 segundos
        this.typingSound.play();

        this.time.delayedCall(5000, () => {
            this.typingSound.stop();

            // Criando a animação da tecla ESC
            this.anims.create({
                key: 'keyboard-small',
                frames: this.anims.generateFrameNumbers('keyboard-small', {
                    start: 112,
                    end: 114
                }),
                frameRate: 2,
                repeat: -1
            });

            // Posição e tamanho
            this.key = this.add.sprite(
                this.config.width / 2 - 280,
                this.config.height * 0.5 + 320,
                'keyboard-small'
            ).setScale(3);

            this.key.play('keyboard-small');
        });
    }

}