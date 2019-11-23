  export class ImageVariables{
    editable: boolean;
    approval: boolean;
    requester: any;
    approved: boolean;
    finalDetails: string;
    category: string;
    openFormat: string;
    closedFormat: string;
    height: string;
    width: string;
    field: any[]

    constructor(editable: boolean,
        approval: boolean,
        requester: any,
        approved: boolean,
        finalDetails: string,
        category: string,
        openFormat: string,
        closedFormat: string,
        height: string,
        width: string,
        field: any[]){

        this.editable = editable;
        this.approval = approval;
        this.requester = requester;
        this.approved = approved;
        this.finalDetails = finalDetails;
        this.category = category;
        this.openFormat = openFormat;
        this.closedFormat = closedFormat;
        this.height = height;
        this.width = width;
        this.field = field;
    }
}