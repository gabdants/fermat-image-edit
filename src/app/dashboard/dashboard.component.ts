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
  isAdmin = true;
  semFotos = false;
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
    this.carregaMenu();
    this.carregaImagens();
  }

  async carregaMenu(){
    TREE_DATA = []
    await this.categoryService.getCategory().subscribe(response => {
      console.log(response);
      
      response.map(item => {
        let aux = {
          id: '',
          name: '',
          children: [{
            name: '',
            id: '',
          }]
        }
        aux.name = '';
        aux.children = []
        aux.id = ''
        aux.name = item.name;
        aux.id = item.idCategory;
        this.selectCategorias.push(item.name);
        if(item.subCategories){
          item.subCategories.map(subItem => {
            let auxChildren = {
              name: '',
              id: '',
            }
            auxChildren.name = '';
            auxChildren.id = '';
            auxChildren.name = subItem.name
            auxChildren.id = subItem.idSubCategory
            aux.children.push(auxChildren);
            this.selectCategorias.push(`${item.name} > ${subItem.name}`);
          });
        }
        
        console.log(aux);
        TREE_DATA.push(aux);
        console.log(TREE_DATA)

      })
      this.dataSource.data = TREE_DATA;
    });
  }

  saveCategory(){
    console.log(this.newCategory);
    if(this.newCategory.subCategoryOff == '0'){
      alert('Preencha o campo "Subcategoria de: "');
      return;
    }else if(this.newCategory.subCategoryOff == '1'){
      this.categoryService.addCategory(this.newCategory.title).subscribe(response => {
        console.log(response);
        alert('Categoria adicionada com sucesso!');
      })
    }else{
      this.categoryService.addSubCategory(this.newCategory.subCategoryOff, this.newCategory.title).subscribe(response => {
        console.log(response);
        alert('Subcategoria adicionada com sucesso')
      });
    }
  }

  addCategory(){
    document.getElementsByClassName('formAddCategory')[0].setAttribute("style", "display:flex;");
  }

  async carregaImagens(){
    await this.imageService.getAllImages().subscribe(response => {
      console.log(response);
      response.map(item => {
        this.imagens.push(item);
      })
      console.log(this.imagens)
    })
  }
  carregaCategoria(categoria){
    this.imagens = [];
    this.imageService.getByCategory(categoria).subscribe(response => {
      console.log(response);
      if(response){
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
    console.log(nome)
  }
  callAddImage(){
    this.router.navigateByUrl('addImage');
  }
  chamaEdicao(id){
    console.log(id)
    this.router.navigateByUrl(`editImage/${id}`)
  }

}
