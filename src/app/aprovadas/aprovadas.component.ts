import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image/image-service';
import { Image } from '../../typings/imagem';
import { browser } from 'protractor';


@Component({
  selector: 'app-aprovadas',
  templateUrl: './aprovadas.component.html',
  styleUrls: ['./aprovadas.component.scss']
})
export class AprovadasComponent implements OnInit {

  constructor(private imageService: ImageService,) { }

  imagens: Image[] = [];

  usuario : string;

  ngOnInit() {
    this.usuario = localStorage.getItem('user');
    this.carregaImagens();    
  }

  async carregaImagens(){
    await this.imageService.getFinalImagesByRequester(this.usuario).subscribe(response => {
      response.map(item => {
        this.imagens.push(item);
      })
    })
  }

  downloadImage(url){
  
  }

}
