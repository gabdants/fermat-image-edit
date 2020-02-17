import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { HistoryService } from '../../services/history/history-service';
import { Router } from '@angular/router';
import { FonteService } from '../../services/fonte/fonte.service';
import { Image } from '../../../typings/imagem';

export interface History {
  solicitor: string;
  piece: string;
  category: string;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  displayedColumns: string[] = ['solicitor', 'piece', 'category'];
  dataSource: History[];

  font: File;
  exibeImgPlaceholder = true;
  exibeFontConfirm = false;

  constructor(
    private historyService: HistoryService, 
    private router: Router, 
    private fonteService: FonteService) { }

  ngOnInit() {
    this.historyService.getHistory().subscribe(response => {
      this.dataSource = response;
    })
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
    this.font = event.target.files[0];
  }
  
}
