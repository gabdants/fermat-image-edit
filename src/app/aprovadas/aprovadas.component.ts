import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ImageService } from '../services/image/image-service';
import { Imagem } from '../../typings/imagem';
import { browser } from 'protractor';


@Component({
  selector: 'app-aprovadas',
  templateUrl: './aprovadas.component.html',
  styleUrls: ['./aprovadas.component.scss']
})
export class AprovadasComponent implements OnInit {

  constructor(private imageService: ImageService,) { }

  imagens: Imagem[] = [];

  usuario : string;
  imgPreviewBeforeAprove: string;
  imageToDownload: HTMLImageElement;
  width: any;
  height: any;

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.usuario = localStorage.getItem('user');
    this.carregaImagens();    
  }

  async carregaImagens(){
    await this.imageService.getFinalImagesByRequester(this.usuario).subscribe(response => {
      response.map(item => {
        this.imagens.push(item);
      })
      console.log(response)
    })
  }

  downloadImage(url, number){
    this.imageToDownload = new Image();
    this.imgPreviewBeforeAprove = url;

    document.getElementById(`botoes-${number}`).style.display = 'block';

    
    setTimeout(() => {
      
      // this.width = document.getElementById('imageToCanvas')['width'];
      // this.height = document.getElementById('imageToCanvas')['height'];
      this.imageToDownload.crossOrigin = 'anonymous';
      this.imageToDownload.src = url; 

    }, 100);

    // this.imageToDownload.crossOrigin = 'anonymous';

    this.imageToDownload.onload = function() {
      setTimeout(() => {
        this.width = this.imageToDownload.width;
        this.height = this.imageToDownload.height;
        this.constroiCanvas(this.width, this.height);
      },200); 
    }.bind(this)
    
  }

  constroiCanvas(width, height){
    //pega o contexto
    this.ctx = this.canvas.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
    //constroi o canvas baseado na imagem BASE
    this.ctx.drawImage(this.imageToDownload, 0, 0);
  }

  downloadPDF(name){

  }
  downloadPNG(name){
    var link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = this.canvas.nativeElement.toDataURL("image/png");
    link.click();
  }
  downloadJPEG(name){
    var link = document.createElement('a');
    link.download = `${name}.jpg`;
    link.href = this.canvas.nativeElement.toDataURL("image/jpeg");
    link.click();
  }

}
