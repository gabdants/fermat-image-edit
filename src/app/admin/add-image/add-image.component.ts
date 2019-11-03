import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NewImage } from 'src/typings/newImage';
import { Variavel } from 'src/typings/variavel';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})
export class AddImageComponent implements OnInit {

  //DOCUMENTAÇÃO
  /*
    Imagem Base = imagem sem nada, onde o usuário vai colocando os textos.
    Imagem Thumb = imagem já preenchida, onde o usuário se baseia.

    Para criar um canvas, é necessário ter um height e um width, sendo assim, primeiro é necessário saber 
    essas propriedades da imagem antes de criar o canvas. Por isso, quando o usuário seleciona a imagem que
    será a imagem base, essas propriedades são recuperadas utilizando new Image() e com isso o canvas
    é gerado.

    Validação entre tab 2 e 3:
      1- deve haver imagem base e thumb.
      2- imagem base e thumb devem ter as mesmas dimensões.

    A funcionalidade da adição de variável funcionará da seguinte maneira:
      1- A imagem base e a imagem thumb precisam ter o mesmo tamanho para funcionar.
      2- Quando clicar em adicionar imagem, a thumb vem para a frente e o usuário clica nela para posicionar a variável,
    após clicar:
        1- pegar a posição do clique.
        2- coletar as informações de fonte, cor e tamanho.
        3- adicionar a variável à lista de variáveis adicionadas.
        4- utilizar o .fillText() do canvas para adicionar o texto à imagem base
  */

  newImage: NewImage = new NewImage("", "", "", "", "", "", "", true, true, []);
  variavel: Variavel = new Variavel("", "", "", "", "", "", "", true, "", ""); 

  listaVariaveis: Variavel[] = [];

  //variáveis canvas
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  @ViewChild('canvasThumb') canvasThumb: ElementRef<HTMLCanvasElement>;
  ctxThumb: CanvasRenderingContext2D;
  

  disabled = false;

  flagEvents = true;

  constructor() { }

  ngOnInit() {
    
  }

  addVariavel(){
    //validações para criação da variável (título, texto modelo, observação...)
    if(this.variavel.titulo == ''){
      alert('Favor preencher o título da variável')
    }else if(this.variavel.textoModelo == ''){
      alert('Favor preencher o texto modelo da variável')
    }else if(this.variavel.fonte == ''){
      alert('Favor preencher a fonte da variável')
    }else if(this.variavel.tamanho == ''){
      alert('Favor preencher o tamanho da variável')
    }else{
      //thumb
      let cvThumb = document.getElementById('canvasThumb');
      //mostra thumb
      cvThumb.style.display = 'block';

      //base
      let cvBase = document.getElementById('canvasBase');
      //esconde base
      cvBase.style.display = 'none';

      //cria o texto flutuante no canvas
      let floatText = document.getElementById('floatText');
      let text = document.createTextNode(this.variavel.textoModelo);

      //Adiciona estilo no texto de acordo com inputs de usuário
      floatText.style.fontSize = this.variavel.tamanho + "px";
      floatText.style.color = this.variavel.cor;
      floatText.style.textAlign = this.variavel.alinhamento;

      //append do text no <p> e dps apend do <p> na div do canvas
      floatText.appendChild(text);

      //flag para só adicionar o evento de click uma vez
      if(this.flagEvents){
        //evento que deixa o texto em cima do mouse
        cvThumb.addEventListener('mousemove', function move(event) {
          floatText.style.top = event.offsetY + 3 + "px";
          floatText.style.left = event.offsetX + 3 + "px";
        })
        //evento que constroi o texto na imagem base
        cvThumb.addEventListener('click', (event) => {
          if(confirm('Deseja adicionar a variável?')){
            //Recupera as posições od click
            let posX = event.offsetX;
            let posY = event.offsetY;

            //volta com o canvas da imagem base e esconde o Thumb
            cvThumb.style.display = 'none';
            cvBase.style.display = 'block';

            //escreve o texto na imagem base
            this.ctx.font = `${this.variavel.tamanho}px ${this.variavel.fonte}`;
            this.ctx.fillStyle = this.variavel.cor;
            this.ctx.fillText(this.variavel.textoModelo, posX + 2, posY + 2 + +this.variavel.tamanho);

            //remove o floattext
            floatText.removeChild(floatText.childNodes[0]);

            this.listaVariaveis.push(this.variavel);
            this.variavel = new Variavel("", "", "", "", "", "", "", true, "", "");
          }
        })
        this.flagEvents = false;
      }
    }
    
  }

  salvarImage(){
    this.newImage.variaveis = this.listaVariaveis;
    console.log(this.newImage);
  }

  onClickNext(number){
    //validações
    if(number == 1){
      if(this.newImage.name == ''){
        alert('Por favor, insira o nome da peça');
        return false;
      }else if(this.newImage.categoria == ''){
        alert('Por favor, insira uma categoria para a peça');
        return false;
      }
    }else if(number == 2){
      if(this.imageFixed == undefined || this.imageThumbFixed == undefined){
        alert('Por favor, insira as imagens à serem adicionadas.')
        return false;
      }else if(this.img.width != this.imgThumb.width || this.img.height != this.imgThumb.height){
        alert('Ambas as imagens precisam ter o mesmo dimensionamento (altura e largura)')
        return false;
      }
    }
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

  //variáveis para receber o base64
  imageFixed: string;
  imageThumbFixed: string;

  //variáveis com a imagem e suas propriedades reais
  img: HTMLImageElement;
  imgThumb: HTMLImageElement;

  getImage(result){
    var reader = new FileReader();
    reader.onload = function (event) {
      //instancia a imagem com as propriedades reais
      this.img = new Image();
      //Quando a imagem (mesmo que apenas um objeto) é carregada, constroi o canvas
        this.img.onload = function () {
          this.constroiCanvas();
        }.bind(this)
      this.img.src = event.target.result;
      //preview com tamanho fixo
      this.imageFixed = event.target.result;
    }.bind(this);
    reader.readAsDataURL(result.target.files[0]);
  }
  getImageThumb(result){
    var reader = new FileReader();
    reader.onload = function (event) {
      //instancia a imagem com as propriedades reais
      this.imgThumb = new Image();
      //Quando a imagem (mesmo que apenas um objeto) é carregada, constroi o canvasThumb
      this.imgThumb.onload = function () {
        this.constroiCanvasThumb();
      }.bind(this)
      this.imgThumb.src = event.target.result;
      //preview com tamanho fixo
      this.imageThumbFixed = event.target.result;
    }.bind(this);
    reader.readAsDataURL(result.target.files[0]);
  }

  constroiCanvas(){
    //pega o contexto
    this.ctx = this.canvas.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvas.nativeElement.width = this.img.width;
    this.canvas.nativeElement.height = this.img.height;
    //constroi o canvas baseado na imagem BASE
    this.ctx.drawImage(this.img, 0, 0);
  }

  constroiCanvasThumb(){
    //pega o contexto
    this.ctxThumb = this.canvasThumb.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvasThumb.nativeElement.width = this.imgThumb.width;
    this.canvasThumb.nativeElement.height = this.imgThumb.height;
    //constroi o canvas baseado na imagem BASE
    this.ctxThumb.drawImage(this.imgThumb, 0, 0);
  }

}
