import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit {

  newImage: NewImage = {
    name: "",
    obsPublico: "",
    fmtFechado: "",
    fmtAberto: "",
    acabamento: "",
    obsPrint: "",
    categoria: "",
    editavel: true,
    aprovacao: true,
    variaveis: [] = [],
  };
  variavel: Variavel = {
    titulo: "",
    textoModelo: "",
    obs: "",
    fonte: "",
    tamanho: "",
    cor: "",
    alinhamento: "",
    obrigatorio: true,
    cordX: "",
    cordY: "",
  }
  disabled = false;

  constructor() { }

  ngOnInit() {
  }

  addVariavel(){

  }
  salvarImage(){
    
  }

  onClickNext(number){
    let i = 0
    let continua = true;
    while(continua){
      let tab = document.getElementById(`mat-tab-label-${i}-${number}`);
      if(tab){
        tab.click();
        continua = false;
      }else{
        i++
      }
    }
  }
  image: string;
  imageThumb: string;

  getImage(result){
    var reader = new FileReader();
    reader.onload = function (event) {
      this.image = event.target.result;
    }.bind(this);
    reader.readAsDataURL(result.target.files[0]);
  }
  getImageThumb(result){
    var reader = new FileReader();
    reader.onload = function (event) {
      this.imageThumb = event.target.result;
    }.bind(this);
    reader.readAsDataURL(result.target.files[0]);
  }

}
