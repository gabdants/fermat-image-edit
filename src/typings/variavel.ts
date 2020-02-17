export class Variavel{
    titulo: string;
    textoModelo: string;
    obs: string;
    fonte: string;
    tamanho: string;
    cor: string;
    alinhamento: string;
    obrigatorio: boolean;
    cordX: string;
    cordY: string;
    textWidth: number;
    fontUrl: string;
    initVar: boolean;
    
    constructor(titulo: string,
                textoModelo: string,
                obs: string,
                fonte: string,
                tamanho: string,
                cor: string,
                alinhamento: string,
                obrigatorio: boolean,
                cordX: string,
                cordY: string,
                textWidht: number = 0,
                fontUrl: string = '',
                initVar: boolean = false){
                    
        this.titulo = titulo;    
        this.textoModelo = textoModelo;    
        this.obs = obs;
        this.fonte = fonte;
        this.tamanho = tamanho;
        this.cor = cor;
        this.alinhamento = alinhamento;
        this.obrigatorio = obrigatorio;
        this.cordX = cordX;
        this.cordY = cordY;
        this.textWidth = textWidht; 
        this.fontUrl = fontUrl;
        this.initVar = initVar;
    }
    
}