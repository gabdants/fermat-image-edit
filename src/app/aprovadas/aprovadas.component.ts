import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image/image-service';
import { Image } from '../../typings/imagem';


@Component({
  selector: 'app-aprovadas',
  templateUrl: './aprovadas.component.html',
  styleUrls: ['./aprovadas.component.scss']
})
export class AprovadasComponent implements OnInit {

  constructor(private imageService: ImageService,) { }

  imagens: Image[] = [];

  ngOnInit() {
    this.imageService.getFinalImagesByRequester('admin').subscribe(response => {
      console.log(response);
    })
    this.carregaImagens();    
  }

  async carregaImagens(){
    await this.imageService.getFinalImagesByRequester('admin').subscribe(response => {
      console.log(response);
      response.map(item => {
        this.imagens.push(item);
      })
      console.log(this.imagens)
    })
  }

  downloadImage(url){
    var element = document.createElement('a');
    element.setAttribute('href', 'image:png' + url);
    element.setAttribute('download', 'filename');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
