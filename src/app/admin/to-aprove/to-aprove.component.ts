import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { CategoryService } from '../../services/category/category-service';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image/image-service';
import { Image } from '../../../typings/imagem';

@Component({
  selector: 'app-to-aprove',
  templateUrl: './to-aprove.component.html',
  styleUrls: ['./to-aprove.component.scss']
})
export class ToAproveComponent implements OnInit {

  imagens: Image[] = [];

  imgPreviewBeforeAprove: string;
  showPrev: boolean;

  constructor(
    private categoryService: CategoryService, 
    private router: Router, 
    private imageService: ImageService) { }

  ngOnInit() {
    this.carregaImagens();
    this.showPrev = false;
  }

  async carregaImagens(){
    await this.imageService.getFinalImages().subscribe(response => {
      console.log(response);
      response.map(item => {
        if(!item.approved){
          this.imagens.push(item);
        }
      })
      console.log(this.imagens)
    })
  }
  aprovarImagem(id){
    this.imageService.approveImage(id).subscribe(response => {
      alert('Imagem Aprovada!')
    }, err => {
      alert('Não foi possível aprovar a imagem, tente novamente');
    })
  }

  ampliaImage(url){
    this.imgPreviewBeforeAprove = url;
    this.showPrev = true;
  }
  fecharPrev(){
    this.showPrev = false;
  }

}
