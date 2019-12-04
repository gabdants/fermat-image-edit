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

  constructor(
    private categoryService: CategoryService, 
    private router: Router, 
    private imageService: ImageService) { }

  ngOnInit() {
    this.carregaImagens();
  }

  async carregaImagens(){
    await this.imageService.getFinalImages().subscribe(response => {
      console.log(response);
      response.map(item => {
        this.imagens.push(item);
      })
      console.log(this.imagens)
    })
  }

}
