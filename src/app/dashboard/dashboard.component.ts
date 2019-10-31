import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { CategoryService } from '../services/category/category-service';
import { Router } from '@angular/router';



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

  constructor(private categoryService: CategoryService, private router: Router) {
    
   }
  isAdmin = true;
  semFotos = false;

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
        console.log(aux);
        TREE_DATA.push(aux);
        console.log(TREE_DATA)

      })
      this.dataSource.data = TREE_DATA;
    });
  }
  selecionaMenu(nome){
    console.log(nome)
  }
  callAddImage(){
    this.router.navigateByUrl('addImage');
  }
  chamaEdicao(){
    this.router.navigateByUrl('editImage/d914defb-fd4e-437e-bdf7-cf45e08d6f56')
  }

}
