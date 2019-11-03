import { Variavel } from './variavel';

export class NewImage{
    name: string;
    obsPublico: string;
    fmtFechado: string;
    fmtAberto: string;
    acabamento: string;
    obsPrint: string;
    categoria: string;
    editavel: boolean;
    aprovacao: boolean;
    variaveis: Variavel[];

    constructor(name: string,
                obsPublico: string,
                fmtFechado: string,
                fmtAberto: string,
                acabamento: string,
                obsPrint: string,
                categoria: string,
                editavel: boolean,
                aprovacao: boolean,
                variaveis: Variavel[]){

        this.name = name;
        this.obsPublico = obsPublico;
        this.fmtFechado = fmtFechado;
        this.fmtAberto = fmtAberto;
        this.acabamento = acabamento;
        this.obsPrint = obsPrint;
        this.categoria = categoria;
        this.editavel = editavel;
        this.aprovacao = aprovacao;
        this.variaveis = variaveis;
    }
}