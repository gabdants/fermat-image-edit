export class Variables{
    name: string;
    cordX: string;
    cordY: string;
    obs: string;
    fontFamily: string;
    fontSize: string;
    allign: string;
    color: string;
    required: boolean;
    modelText: string;
    title: string;
    fontUrl: string;

    constructor(name: string,
                cordX: string,
                cordY: string,
                obs: string,
                fontFamily: string,
                fontSize: string,
                allign: string,
                color: string,
                required: boolean,
                modelText: string,
                title: string,
                fontUrl: string = ''){

        this.name = name;
        this.cordX = cordX;
        this.cordY = cordY;
        this.obs = obs;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.allign = allign;
        this.color = color;            
        this.required = required;            
        this.modelText = modelText;            
        this.title = title;  
        this.fontUrl = fontUrl;          
    }
}