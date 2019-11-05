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
  }

  chamaPreview(){

  }
  salvarImage(){
    
  }

}
