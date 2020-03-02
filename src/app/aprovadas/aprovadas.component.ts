import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ImageService } from '../services/image/image-service';
import { Imagem } from '../../typings/imagem';
import { browser } from 'protractor';
import jsPDF from 'jspdf';


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

  deuCorsNaImagem: boolean
  downloadImage(url, number){
    this.deuCorsNaImagem = true;
    this.imageToDownload = new Image();
    this.imgPreviewBeforeAprove = url;

    document.getElementById(`wait-${number}`).style.display = 'block';

    
    setTimeout(() => {
      
      // this.width = document.getElementById('imageToCanvas')['width'];
      // this.height = document.getElementById('imageToCanvas')['height'];
      this.imageToDownload.crossOrigin = '';
      this.imageToDownload.src = url; 

      console.log(this.imageToDownload)

    }, 100);

    // this.imageToDownload.crossOrigin = 'anonymous';

    this.imageToDownload.onload = function() {
      this.deuCorsNaImagem = false;
      document.getElementById(`wait-${number}`).style.display = 'none';
      document.getElementById(`botoes-${number}`).style.display = 'block';      
      setTimeout(() => {
        this.width = this.imageToDownload.width;
        this.height = this.imageToDownload.height;
        this.constroiCanvas(this.width, this.height);
      },200); 
    }.bind(this)

    setTimeout(() => {
      
      if(this.deuCorsNaImagem){
        this.downloadImage(url, number);
      }

    }, 1000);
    
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
    let img = this.canvas.nativeElement.toDataURL("image/png");
    if(this.width > this.height){
      var pdf = new jsPDF('l');
    }else{
      var pdf = new jsPDF({
        orientation: 'p',
      });
    }
    const imgProps= pdf.getImageProperties(img);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${name}.pdf`);

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
