import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { CategoryService } from '../services/category/category-service';
import { Router } from '@angular/router';
import { ImageService } from '../services/image/image-service';
import { Image } from '../../typings/imagem';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

var TREE_DATA: FoodNode[] = [
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor(
    private categoryService: CategoryService, 
    private router: Router, 
    private imageService: ImageService) {
    
   }
  isAdmin: boolean;
  semFotos = true;
  selectCategorias: string[] = [];
  categorias: any;
  newCategory = {
    title: '',
    subCategoryOff: '0',
  }


  // imagem: Image = new Image(false, false, "", "", false, [], "", "", "", "", "", "", "", "", ""); 
  imagens: Image[] = [];


  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    let admin = localStorage.getItem('admin');
    if(admin == 'true'){
      this.isAdmin = true;
    }else {
      this.isAdmin = false;
    }
    this.carregaMenu();
    this.carregaImagens();
  }

  async carregaMenu(){
    TREE_DATA = []
    await this.categoryService.getCategory().subscribe(response => {
      
      response.map(item => {
        let aux = {
          id: '',
          name: '',
          children: [{
            name: '',
            id: '',
            children: [{
              name: '',
              id: '',
            }],
          }]
        } 
        aux.name = '';
        aux.children = []
        // aux.children[0].children = []
        aux.id = '';
        aux.name = item.name;
        aux.id = item.idCategory;
        this.selectCategorias.push(item.name);
        if(item.subCategories){
          item.subCategories.map(subItem => {
            let auxChildren = {
              name: '',
              id: '',
              children: []
            }
            auxChildren.name = '';
            auxChildren.id = '';
            auxChildren.name = subItem.name
            auxChildren.id = subItem.idSubCategory
            aux.children.push(auxChildren);
            this.selectCategorias.push(`${item.name} > ${subItem.name}`);
            if(subItem.finalCategory){
              subItem.finalCategory.map(finalItem => {
                let auxFinal = {
                  name: '',
                  id: '',
                }
                auxFinal.name = '';
                auxFinal.id = '';
                auxFinal.name = finalItem.name
                auxFinal.id = finalItem.idFinalCategory
                aux.children[0].children.push(auxFinal);
                this.selectCategorias.push(`${item.name} > ${subItem.name} > ${finalItem.name}`);
              })
            }
          });
        }
        
        TREE_DATA.push(aux);

      })
      this.dataSource.data = TREE_DATA;
    });
  }

  saveCategory(){
    if(this.newCategory.subCategoryOff == '0'){
      alert('Preencha o campo "Subcategoria de: "');
      return;
    }else if(this.newCategory.subCategoryOff == '1'){
      this.categoryService.addCategory(this.newCategory.title).subscribe(response => {
        alert('Categoria adicionada com sucesso!');
      })
    }else{
      if(this.newCategory.subCategoryOff.includes('>')){
        let auxCategorias = this.newCategory.subCategoryOff.split('>');
        this.categoryService.addFinalCategory(auxCategorias[0].trim(), auxCategorias[1].trim(), this.newCategory.title).subscribe(response => {
        })
      }else{
        this.categoryService.addSubCategory(this.newCategory.subCategoryOff, this.newCategory.title).subscribe(response => {
          alert('Subcategoria adicionada com sucesso')
        });
      }
    }
  }

  addCategory(){
    document.getElementsByClassName('formAddCategory')[0].setAttribute("style", "display:flex;");
  }

  async carregaImagens(){
    await this.imageService.getAllImages().subscribe(response => {
      response.map(item => {
        if(!item.finalImage){
          this.imagens.push(item);
        }
      })
    })
  }
  carregaCategoria(categoria){
    this.imagens = [];
    this.imageService.getByCategory(categoria).subscribe(response => {
      if(response.length > 0){
        response.map(item => {
          this.imagens.push(item);
        })
        this.semFotos = false;
      }else{
        this.semFotos = true;
      }

    })
  }
  selecionaMenu(nome){
  }
  callAddImage(){
    this.router.navigateByUrl('addImage');
  }
  chamaEdicao(id){
    this.router.navigateByUrl(`editImage/${id}`)
  }

  duplicaImagem(id){
    this.router.navigateByUrl(`addImage/${id}`);
  }

  continuarEditando(id){
    this.router.navigateByUrl(`continueEdit/${id}`);
  }


}
