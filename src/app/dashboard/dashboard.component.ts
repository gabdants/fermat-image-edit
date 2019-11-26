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

  constructor(private categoryService: CategoryService, private router: Router, private imageService: ImageService) {
    
   }
  isAdmin = true;
  semFotos = false;

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
          });
        }
        
        console.log(aux);
        TREE_DATA.push(aux);
        console.log(TREE_DATA)

      })
      this.dataSource.data = TREE_DATA;
    });
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
