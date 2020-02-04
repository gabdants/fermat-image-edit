  export class ImageVariables{
    editable: boolean;
    approval: boolean;
    requester: any;
    approved: boolean;
    finalDetails: string;
    category: string;
    openFormat: string;
    closedFormat: string;
    height: number;
    width: number;
    field: any[];
    s3UrlThumb: string;
    obsPublic: string;
    obsPrint: string;

    constructor(editable: boolean,
        approval: boolean,
        requester: any,
        approved: boolean,
        finalDetails: string,
        category: string,
        openFormat: string,
        closedFormat: string,
        height: number,
        width: number,
        field: any[],
        s3UrlThumb: string,
        obsPublic: string = '',
        obsPrint: string = ''
    ){

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
        this.s3UrlThumb = s3UrlThumb;
        this.obsPublic = obsPublic;
        this.obsPrint = obsPrint;
    }
}