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

  listaVariaveis: Variavel[] = [];
  imgPreview: HTMLImageElement;
  name: string;
  imgX: string;
  imgY: string;

  flagPreview: boolean = true;

  savedImageURL: string;

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.imageService.getImageById(id).subscribe((response:any) => {
      console.log(response)
      this.imgX = response.width; 
      this.imgY = response.height;
      this.name = response.name;
      this.imgPreview = new Image();

      //também precisa pegar o array de variaveis e colocar no this.listaVariaveis

      this.imageService.getFields(id).subscribe(fields => {
        console.log(fields);
        fields.forEach(item => {
          this.listaVariaveis.push(new Variavel(item.name, item.modelText, item.obs, item.fontFamily, item.fontSize, item.color, item.allign, item.required, item.cordX, item.cordY))
        })
      })

      setTimeout(() => {
        this.imgPreview.src = response.s3Url;  
        this.imgPreview.crossOrigin = 'anonymous';
      }, 400); 
      
      this.imgPreview.onload = function() {
        this.constroiCanvasPreview();
      }.bind(this)
      
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
    //EXEMPLO DE COMO ABAIXAR A QUALIDADE DA IMAGEM
    //console.log(this.canvasPreview.nativeElement.toDataURL('image/jpeg', 0.4));
    
    //Cria um canvas na memória
    let cvWaterMark = document.createElement('canvas');
    //Seta width e height
    cvWaterMark.width = +this.imgX;
    cvWaterMark.height = +this.imgY;
    //Pega o contexto
    let ctxWaterMark = cvWaterMark.getContext('2d');

    //Inicia a marca d'agua
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.canvasPreview.nativeElement.toDataURL();

    img.onload = function () {
      ctxWaterMark.drawImage(img,0,0);
        
          let tamanhoFonte:number = cvWaterMark.width * 0.07;

          ctxWaterMark.font=`${tamanhoFonte}pt verdana`;
          ctxWaterMark.globalAlpha=.30;
          ctxWaterMark.fillStyle='white'

          let metrics = ctxWaterMark.measureText("WaterMark Demo");
          let width = metrics.width/2;
          
          ctxWaterMark.translate(cvWaterMark.width/3, cvWaterMark.height/2);
          ctxWaterMark.rotate(-Math.atan(cvWaterMark.height/cvWaterMark.width));
          ctxWaterMark.fillText("Aguarde aprovação", -width/2, tamanhoFonte/2);
          ctxWaterMark.fillStyle='black'
          ctxWaterMark.fillText("Aguarde aprovação", -width/2 + 3, tamanhoFonte/2);

          
          let imagePreview = new Image();
          imagePreview.src = cvWaterMark.toDataURL('image/jpeg', 0.8);

          imagePreview.onload = function() {
            let w = window.open('');
            w.document.write(imagePreview.outerHTML)
          }

    }.bind(this)
    
    //chave demais isso aqui....
    //cvWaterMark.requestFullscreen();
  } 

  salvarImage(){
    this.canvasPreview.nativeElement.toBlob(function(blob) {
      let file: any = blob;
      //O new date é apenas para o cast dar certo.
      file.lastModifiedDate = new Date();
      file.name = this.name;

      this.imageService.postImage(<File>file, file.name).subscribe(res => {
        this.imageService.setImageRequester(res, localStorage.getItem('user')).subscribe(response => {
          console.log(response)
        })
        this.imageService.setFinalImageToTrue(res).subscribe(res => {
          alert('Imagem salva');
          console.log(res);
        }, err => {
          alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
        console.log(err)
        })
        
      }, err => {
        alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
        console.log(err)
      })
    }.bind(this))
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
    console.log(this.listaVariaveis)
     this.listaVariaveis.forEach(variavel => {
      //escreve o texto na imagem base
      this.ctxPreview.font = `${variavel.tamanho}pt ${variavel.fonte}`;

      if(variavel.cor == '' || variavel.cor == null){
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
      
      //habilita botão de preview
      this.flagPreview = false;
    });
  }

  limpaCamposCanvas(){
    //Limpa tudo
    this.ctxPreview.clearRect(0, 0, +this.imgX, +this.imgY);
  }

}
