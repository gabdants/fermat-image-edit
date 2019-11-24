import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image/image-service';
import { Variavel } from 'src/typings/variavel';

@Component({
  selector: 'app-custom-image',
  templateUrl: './custom-image.component.html',
  styleUrls: ['./custom-image.component.scss']
})
export class CustomImageComponent implements OnInit {

  constructor(public route: ActivatedRoute, private imageService: ImageService) { }
  titulo: string;

  //Variável de canvas
  @ViewChild('canvasPreview') canvasPreview: ElementRef<HTMLCanvasElement>;
  ctxPreview: CanvasRenderingContext2D;

  listaVariaveis: Variavel[];
  imgPreview: HTMLImageElement;
  imgX: string;
  imgY: string;

  savedImageURL: string;

  ngOnInit() {
     let id = this.route.snapshot.params.id;
    this.imageService.getImageById(id).subscribe((response:any) => {
      this.imgX = response.width; 
      this.imgY = response.height;
      this.imgPreview = new Image();

      //também precisa pegar o array de variaveis e colocar no this.listaVariaveis

      this.imgPreview.src = response.s3Url;

      this.imgPreview.onload = function() {
        this.constroiCanvasPreview();
      }.bind(this)

      console.log(response);
     },err => {
       console.log(err);
     })
 
    // this.imageService.getImagensMock().subscribe((res) => {
    //   console.log(res);
    //   this.imgPreview = new Image();
    //   this.imgX = res[0].imageSizeX; 
    //   this.imgY = res[0].imageSizeY;

    //   this.imgPreview.src = res[0].imageUrl;

    //   this.imgPreview.onload = function() {
    //     this.constroiCanvasPreview();
    //   }.bind(this)
    // })
    

    // this.imageService.getVariaveisMock().subscribe((res) => {
    //   console.log(res);
    //   this.listaVariaveis = res;
    // })

  }

  constroiCanvasPreview(){
    //pega o contexto 
    this.ctxPreview = this.canvasPreview.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvasPreview.nativeElement.width = this.imgPreview.width;
    this.canvasPreview.nativeElement.height = this.imgPreview.height;
    //constroi o canvas baseado na imagem BASE
    this.ctxPreview.drawImage(this.imgPreview, 0, 0);

    this.escreveCampos();
  }

  chamaPreview(){
    //Guarda o base64 do canvas atual
    this.savedImageURL = this.canvasPreview.nativeElement.toDataURL();


    //Cria um canvas na memória
    let cvWaterMark = document.createElement('canvas');
    //Seta width e height
    cvWaterMark.width = +this.imgX;
    cvWaterMark.height = +this.imgY;
    //Pega o contexto
    let ctxWaterMark = cvWaterMark.getContext('2d');

    //Inicia a marca d'agua
    let img=new Image();
    img.crossOrigin='anonymous';
    img.onload = function () {
      ctxWaterMark.drawImage(img,0,0);
        
          ctxWaterMark.font="240px verdana";
          ctxWaterMark.globalAlpha=.50;
          ctxWaterMark.fillStyle='white'

          let metrics = ctxWaterMark.measureText("WaterMark Demo");
          let width = metrics.width;
          
          ctxWaterMark.translate(cvWaterMark.width/2, cvWaterMark.height/2);
          ctxWaterMark.rotate(-Math.atan(cvWaterMark.height/cvWaterMark.width));
          ctxWaterMark.fillText("Aguarde aprovação", -width/2, 240/2);

          console.log(cvWaterMark.toDataURL('image/jpeg', 0.5));
        //console.log(cvWaterMark.toDataURL())
    }.bind(this)
    img.src = this.savedImageURL;
    


    // //chave demais isso aqui....
    // cvWaterMark.requestFullscreen();
  } 

  salvarImage(){
    this.savedImageURL = this.canvasPreview.nativeElement.toDataURL();
  }

  changeInput(event){
    //Recupera o id para alterar no array
    let id = event.target.id;
    //recupera o que foi escrito
    let valor = event.target.value;
    //Altera o array
    this.listaVariaveis.forEach(variavel => {
      if(variavel.titulo == id){
        if(variavel.obrigatorio && valor == ''){
          alert('Esse campo é obrigatório')
          return false;
        }else{
          variavel.textoModelo = valor;
        }
      } 
    });
    this.limpaCamposCanvas();
    this.constroiCanvasPreview();
  }

  escreveCampos(){
     this.listaVariaveis.forEach(variavel => {
      //escreve o texto na imagem base
      this.ctxPreview.font = `${variavel.tamanho}px ${variavel.fonte}`; 
      if(variavel.cor == ''){
        this.ctxPreview.fillStyle = 'black';
      }else{
        this.ctxPreview.fillStyle = variavel.cor;
      }
 
      //Case para alinhamento
      switch (variavel.alinhamento) {
          case 'center':
            this.ctxPreview.textAlign = "center";
          break;
          case 'right':
            this.ctxPreview.textAlign = "right";
          break;
          case 'left':
            this.ctxPreview.textAlign = "left";
          break;
          case 'start':
            this.ctxPreview.textAlign = "start";
          break;
          case 'end':
            this.ctxPreview.textAlign = "end";
          break;
      }
      
      this.ctxPreview.fillText(variavel.textoModelo, +variavel.cordX, +variavel.cordY);
    });
  }

  limpaCamposCanvas(){
    //Limpa tudo
    this.ctxPreview.clearRect(0, 0, +this.imgX, +this.imgY);
  }

}
