import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { CategoryService } from '../services/category/category-service'



interface FoodNode {
  name: string;
  children?: FoodNode[];
}

var TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussel sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
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

  constructor(private categoryService: CategoryService) {
    
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
    console.log("teste");
    await this.categoryService.getCategory().subscribe(response => {
      console.log(response);
      let aux = {
        name: '',
        children: []
      }
      response.map(item => {
        aux.name = '';
        aux.children = []
        aux.name = item.name;
        item.subCategories.map(subItem => {
          aux.children.push(subItem.name);
        });
        console.log(aux);
        TREE_DATA.push(aux);

      })
      this.dataSource.data = TREE_DATA;
    });
  }
  callAddImage(){
    
  }

}
