
import { Variavel } from './variavel';
    
export class Imagem{
    approval: boolean;
    approved: boolean;
    category: string;
    closedFormat: string;
    editable: boolean;
    field: Variavel[];
    finalDetails: string;
    height: string;
    idImage: string;
    name: string;
    openFormat: string;
    requestDate: string;
    requester: string;
    s3Url: string;
    width: string;

    constructor(approval: boolean,
                approved: boolean,
                category: string,
                closedFormat: string,
                editable: boolean,
                field: Variavel[],
                finalDetails: string,
                height: string,
                idImage: string,
                name: string,
                openFormat: string,
                requestDate: string,
                requester: string,
                s3Url: string,
                width: string){

        this.approval = approval,
        this.approved= approved,
        this.category= category,
        this.closedFormat= closedFormat,
        this.editable= editable,
        this.field= field,
        this.finalDetails= finalDetails,
        this.height= height,
        this.idImage= idImage,
        this.name= name,
        this.openFormat= openFormat,
        this.requestDate= requestDate,
        this.requester= requester,
        this.s3Url= s3Url,
        this.width= width
    }
}