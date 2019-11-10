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

  ngOnInit() {
    // let id = this.route.snapshot.params.id;
    // this.imageService.getImageById(id).subscribe(response => {
    //   console.log(response);
    // })
 
    this.imageService.getImagensMock().subscribe((res) => {
      console.log(res);
      this.imgPreview = new Image();
      this.imgX = res[0].imageSizeX; 
      this.imgY = res[0].imageSizeY;

      this.imgPreview.src = res[0].imageUrl;

      this.imgPreview.onload = function() {
        this.constroiCanvasPreview();
      }.bind(this)
    })

    this.imageService.getVariaveisMock().subscribe((res) => {
      console.log(res);
      this.listaVariaveis = res;
    })

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

  }

  salvarImage(){
    
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
