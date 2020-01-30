import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { CategoryService } from '../../services/category/category-service';
import { Router } from '@angular/router';
import { FonteService } from '../../services/fonte/fonte.service';
import { Image } from '../../../typings/imagem';

@Component({
  selector: 'app-add-fonte',
  templateUrl: './add-fonte.component.html',
  styleUrls: ['./add-fonte.component.scss']
})
export class AddFonteComponent implements OnInit {

  font: File;
  exibeImgPlaceholder = true;
  exibeFontConfirm = false;

  constructor(
    private categoryService: CategoryService, 
    private router: Router, 
    private fonteService: FonteService) { }

  ngOnInit() {

  }


  carregaFonte(file: File){
    this.fonteService.postFonte(this.font).subscribe(response => {
      this.fonteService.updateFontFile();
      if(response == '"uploaded"'){
        alert('Fonte adicionada com sucesso!');
        this.router.navigateByUrl('dashboard');
      } else{
        alert('Houve algum erro ao gravar o arquivo');
      }
    })
  }
  getFonte(event){
    this.exibeImgPlaceholder = false;
    this.exibeFontConfirm = true;
    
    console.log(event)
    this.font = event.target.files[0];
  }
  

}
