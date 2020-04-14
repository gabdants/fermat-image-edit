import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image/image-service';
import { HistoryService } from '../services/history/history-service';
import { Variavel } from 'src/typings/variavel';

@Component({
  selector: 'app-custom-image',
  templateUrl: './custom-image.component.html',
  styleUrls: ['./custom-image.component.scss']
})
export class CustomImageComponent implements OnInit {

  constructor(public route: ActivatedRoute, 
    private imageService: ImageService,
    private historyService: HistoryService) { }
  titulo: string;

  //Variável de canvas
  @ViewChild('canvasPreview') canvasPreview: ElementRef<HTMLCanvasElement>;
  ctxPreview: CanvasRenderingContext2D;

  listaVariaveis: Variavel[] = [];
  imgPreview: HTMLImageElement;
  name: string;
  imgX: string;
  imgY: string;
  category: string;

  flagPreview: boolean = true;

  savedImageURL: string;

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.imageService.getImageById(id).subscribe((response:any) => {
      this.imgX = response.width; 
      this.imgY = response.height;
      this.name = response.name;
      this.imgPreview = new Image();
      this.category = response.category;
      console.log(this.category)

      //também precisa pegar o array de variaveis e colocar no this.listaVariaveis

      this.imageService.getFields(id).subscribe(fields => {
        fields.forEach(item => {
          this.listaVariaveis.push(new Variavel(item.name, item.modelText, item.obs, item.fontFamily, item.fontSize, item.color, item.allign, item.required, item.cordX, item.cordY))

          this.aplicaFonte(item.fontFamily, item.fontUrl)
        })
      })

      setTimeout(() => {
        // this.imgPreview.addEventListener("load", imageReceived, false);
        this.imgPreview.crossOrigin = 'anonymous';
        this.imgPreview.src = response.s3Url; 
      }, 400); 
      
      this.imgPreview.onload = function() {
        setTimeout(() => {
          this.constroiCanvasPreview();
        }, 400); 
      }.bind(this)
      
    },err => {
      alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
    })
 
  }

  AfterViewInit(){

  }

  constroiCanvasPreview(){

    //pega o contexto 
    this.ctxPreview = this.canvasPreview.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvasPreview.nativeElement.width = +this.imgX;
    this.canvasPreview.nativeElement.height = +this.imgY;
    //constroi o canvas baseado na imagem BASE
    this.ctxPreview.drawImage(this.imgPreview, 0, 0, +this.imgX, +this.imgY);

    this.escreveCampos();
  }

  chamaPreview(){
    //EXEMPLO DE COMO ABAIXAR A QUALIDADE DA IMAGEM
    
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
      ctxWaterMark.drawImage(img,0,0, +this.imgX, +this.imgY);
        
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
    let a = this.canvasPreview.nativeElement.toBlob(function(blob) {
      let file: any = blob;
      //O new date é apenas para o cast dar certo.
      file.lastModifiedDate = new Date();
      file.name = this.name;

      this.imageService.postImage(<File>file, file.name).subscribe(res => {
        this.imageService.setImageRequester(res, localStorage.getItem('user')).subscribe(response => {
        })
        this.imageService.setFinalImageToTrue(res).subscribe(res => {
          let history = {
            solicitor: localStorage.getItem('user'),
            piece: this.name,
            category: this.category
          }
          this.historyService.postHistory(history).subscribe(response => {
            alert('Imagem salva');
          }, err => {
            console.log(err)
          })
        }, err => {
          alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
        })
        
      }, err => {
        alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
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

  aplicaFonte(fontFamily: string, fontUrl: string){
    if(fontUrl){
  
      //cria o @fontface
      let style = `
      @font-face {
        font-family: '${fontFamily}';
        src: url(${fontUrl}) format('opentype');
      }
      
      `;


      //adiciona a fonte no DOM
      const node = document.createElement('style');
      node.innerHTML = style; 
      let font = `<link rel="stylesheet" href="https://petlandcss.s3-us-west-2.amazonaws.com/dynamic.css">`
      document.head.append(font);
      document.head.appendChild(node);

      setTimeout(() => {
        document.getElementById('boxImagePreview').style.fontFamily = fontFamily;
      }, 1000);
    }else{
      //cria o @fontface
      let style = `
      @font-face {
        font-family: '${fontFamily}';
        src: url(https://petlandfonts.s3-us-west-2.amazonaws.com/${fontFamily}.ttf) format('opentype');
      }

      `;


      //adiciona a fonte no DOM
      const node = document.createElement('style');
      node.innerHTML = style; 
      let font = `<link rel="stylesheet" href="https://petlandcss.s3-us-west-2.amazonaws.com/dynamic.css">`
      document.head.append(font);
      document.head.appendChild(node);

      setTimeout(() => {
        document.getElementById('boxImagePreview').style.fontFamily = fontFamily;
      }, 1000);
    }
    }

}
