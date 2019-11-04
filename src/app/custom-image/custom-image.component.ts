import { Component, OnInit } from '@angular/core';
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

  listaVariaveis: Variavel[];

  ngOnInit() {
    // let id = this.route.snapshot.params.id;
    // this.imageService.getImageById(id).subscribe(response => {
    //   console.log(response);
    // })

    this.imageService.getImagensMock().subscribe((res) => {
      console.log(res);
    })

    this.imageService.getVariaveisMock().subscribe((res) => {
      this.listaVariaveis = res;
      
    })

  }
  chamaPreview(){

  }
  salvarImage(){
    
  }

}
