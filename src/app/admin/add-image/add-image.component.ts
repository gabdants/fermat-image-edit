import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NewImage } from 'src/typings/newImage';
import { Variavel } from 'src/typings/variavel';
import { GoogleApiService } from 'src/app/services/commom/google-api.service';
import { ImageService } from 'src/app/services/image/image-service';
import { CategoryService } from '../../services/category/category-service';
import { Router } from '@angular/router';

interface Category {
  name: string;
  children?: Category[];
}

var TREE_DATA: Category[] = [
];

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.scss']
})

export class AddImageComponent implements OnInit {

  //DOCUMENTAÇÃO
  /*
    Imagem Base = imagem sem nada, onde o usuário vai colocando os textos.
    Imagem Thumb = imagem já preenchida, onde o usuário se baseia.

    Para criar um canvas, é necessário ter um height e um width, sendo assim, primeiro é necessário saber 
    essas propriedades da imagem antes de criar o canvas. Por isso, quando o usuário seleciona a imagem que
    será a imagem base, essas propriedades são recuperadas utilizando new Image() e com isso o canvas
    é gerado.

    Validação entre tab 2 e 3:
      1- deve haver imagem base e thumb.
      2- imagem base e thumb devem ter as mesmas dimensões.

    A funcionalidade da adição de variável funcionará da seguinte maneira:
      1- A imagem base e a imagem thumb precisam ter o mesmo tamanho para funcionar.
      1.1 - Não podem haver variáveis com o mesmo título na mesma imagem. (depois, o título servirá como ID).
      2- Quando clicar em adicionar imagem, a thumb vem para a frente e o usuário clica nela para posicionar a variável,
    após clicar:
        1- pegar a posição do clique.
        2- coletar as informações de fonte, cor e tamanho.
        3- adicionar a variável à lista de variáveis adicionadas.
        4- utilizar o .fillText() do canvas para adicionar o texto à imagem base
  */

  newImage: NewImage = new NewImage("", "", "", "", "", "", "", true, true, []);
  variavel: Variavel = new Variavel("", "", "", "", "", "", "", true, "", ""); 
  alinhamentos: any[] = ["center", "left", "right", "start", "end"];

  listaVariaveis: Variavel[] = [];

  categorias: Category[];
  selectCategorias: string[] = [];

  //variáveis canvas
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;

  @ViewChild('canvasThumb') canvasThumb: ElementRef<HTMLCanvasElement>;
  ctxThumb: CanvasRenderingContext2D;

  flagEvents = true;
  flagAdd = false;

  googleFontsList: any[] = [];
  selectedFont: any;

  //Variavel que recebe a imagem BASE no tipo file para mandar para o backend
  fileBase: File;

  constructor(private categoryService: CategoryService,
              private googleService: GoogleApiService,
              private imageservice: ImageService,
              private router: Router) { }

  ngOnInit() {
    this.googleService.getGoogleFonts().subscribe((res: any) => {
      console.log(res.items);
      this.googleFontsList = res.items;
    }, err => {
      console.log(err);
      alert('Impossível carregar fontes do google. Favor contatar um administrador do sistema.')
    });
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
      this.categorias = TREE_DATA
      
    });
  }

  addVariavel(){
  //validações para criação da variável (título, texto modelo, observação...)
    if(this.variavel.titulo == ''){
      alert('Favor preencher o título da variável')
    }else if(this.variavel.textoModelo == ''){
      alert('Favor preencher o texto modelo da variável')
    }else if(this.selectedFont == undefined){
      alert('Favor preencher a fonte da variável')
    }else if(this.variavel.tamanho == ''){
      alert('Favor preencher o tamanho da variável')
    }else if(this.variavel.alinhamento == ''){
      alert('Favor preencher o alinhamento da variável')
    }else{
        //Validação de titulo para ver se já não existe
        if(this.listaVariaveis.length > 0){
          this.listaVariaveis.forEach(variavel => {
            if(variavel.titulo == this.variavel.titulo){
              alert(`já existe uma variável com o título '${this.variavel.titulo}'.`);
              this.variavel.titulo = '';
            }
          });
        }  
        //Gambiarra para sair do metodo quando o títulojá existe
        if(this.variavel.titulo == ''){
          return false;
        }

        //flag para mostrar botão cancelar
        this.flagAdd = true;

      //thumb
      let cvThumb = document.getElementById('canvasThumb');
      //mostra thumb
      cvThumb.style.display = 'block';

      //base
      let cvBase = document.getElementById('canvasBase');
      //esconde base
      cvBase.style.display = 'none';

      //cria o texto flutuante no canvas
      let floatText = document.getElementById('floatText');
      let text = document.createTextNode(this.variavel.textoModelo);

      //Adiciona estilo no texto de acordo com inputs de usuário
      floatText.style.fontSize = this.variavel.tamanho + "px";
      floatText.style.color = this.variavel.cor;
      floatText.style.textAlign = this.variavel.alinhamento;

      //append do text no <p> e dps apend do <p> na div do canvas
      floatText.appendChild(text);

      //flag para só adicionar o evento de click uma vez
      if(this.flagEvents){
        //evento que deixa o texto em cima do mouse
        cvThumb.addEventListener('mousemove', (event) => {
          floatText.style.top = event.offsetY + "px";
          floatText.style.left = event.offsetX + "px";
        })
        //evento que constroi o texto na imagem base
        cvThumb.addEventListener('click', (event) => {
          if(confirm('Deseja adicionar a variável?')){
            //Recupera as posições od click
            let posX = event.offsetX;
            let posY = event.offsetY;
            console.log(this.variavel);
            console.log('x', posX)
            console.log('y', posY)

            //volta com o canvas da imagem base e esconde o Thumb
            cvThumb.style.display = 'none';
            cvBase.style.display = 'block';

            //escreve o texto na imagem base
            this.ctx.font = `${this.variavel.tamanho}px ${this.variavel.fonte}`; 
            if(this.variavel.cor == ''){
              this.ctx.fillStyle = 'black';
            }else{
              this.ctx.fillStyle = this.variavel.cor;
            }
            
            this.ctx.fillText(this.variavel.textoModelo, posX, posY + this.ctx.measureText(this.variavel.textoModelo).actualBoundingBoxAscent/2);

            //Setando coordenadas
            this.variavel.cordX = ''+posX;
            this.variavel.cordY = '' + (posY + +(this.ctx.measureText(this.variavel.textoModelo).actualBoundingBoxAscent/2)); 

            //remove o floattext
            floatText.removeChild(floatText.childNodes[0]);

            this.listaVariaveis.push(this.variavel);
            //instancia uma nova variavel
            this.variavel = new Variavel("", "", "", "", "", "", "", true, "", "");
            //limpa a fonte selecionada
            this.selectedFont = undefined;
              //flag para esconder botão cancelar
              this.flagAdd = false;
          }
        })
        this.flagEvents = false;
      }
    }
    
  }

  salvarImage(){
    this.newImage.variaveis = this.listaVariaveis;
    
    //endpoint que envia a imagemBase (file) para o S3, esse endpoint deve retornar o ID da imagem
    this.imageservice.adminPostImage(this.fileBase, this.newImage.name).subscribe(res => {
      console.log('Token: ' + res);
      //Ultima atualização do Dantas, o res já é o ID da imagem
      this.enviaVariaveis(res);
    }, err => {
      console.log(err);
    })
    
  }

  enviaVariaveis(id: string){
    //endpoint que utiliza o ID retornado para enviar os atributos da imagem (nome, tamanho, etc...)
    this.imageservice.adminPostImageVariables(this.newImage, id, this.img.width, this.img.height).subscribe(res => {
      console.log(res);
      this.router.navigateByUrl('dashboard')
    }, err => {
      console.log(err);
    })
  }

  onClickNext(number){
    //validações
    if(number == 1){
      if(this.newImage.name == ''){
        alert('Por favor, insira o nome da peça');
        return false;
      }else if(this.newImage.categoria == ''){
        alert('Por favor, insira uma categoria para a peça');
        return false;
      }
    }else if(number == 2){
      if(!this.newImage.editavel){
        if(this.imageFixed == undefined ){
          alert('Por favor, insira as imagens à serem adicionadas.')
          return false;
        }
      }else{
        if(this.imageFixed == undefined || this.imageThumbFixed == undefined){
          alert('Por favor, insira as imagens à serem adicionadas.')
          return false;
        }else if(this.img.width != this.imgThumb.width || this.img.height != this.imgThumb.height){
          alert('Ambas as imagens precisam ter o mesmo dimensionamento (altura e largura)')
          return false;
        }
      }
    }
      let i = 0
      let continua = true;
      while(continua){
        let tab = document.getElementById(`mat-tab-label-${i}-${number}`);
        if(tab){
          tab.click();
          continua = false;
        }else{
          i++
        }
      }
    
  }

  //variáveis para receber o base64
  imageFixed: string;
  imageThumbFixed: string;

  //variáveis com a imagem e suas propriedades reais
  img: HTMLImageElement;
  imgThumb: HTMLImageElement;

  getImage(result){
    var reader = new FileReader();
    reader.onload = function (event) {
      //instancia a imagem com as propriedades reais
      this.img = new Image();
      //Quando a imagem (mesmo que apenas um objeto) é carregada, constroi o canvas
        this.img.onload = function () {
          this.constroiCanvas();
        }.bind(this)
      this.img.src = event.target.result;
      //preview com tamanho fixo
      this.imageFixed = event.target.result;
    }.bind(this);
    reader.readAsDataURL(result.target.files[0]);
    this.fileBase = result.target.files[0];
  }
  getImageThumb(result){
    var reader = new FileReader();
    reader.onload = function (event) {
      //instancia a imagem com as propriedades reais
      this.imgThumb = new Image();
      //Quando a imagem (mesmo que apenas um objeto) é carregada, constroi o canvasThumb
      this.imgThumb.onload = function () {
        this.constroiCanvasThumb();
      }.bind(this)
      this.imgThumb.src = event.target.result;
      //preview com tamanho fixo
      this.imageThumbFixed = event.target.result;
    }.bind(this);
    reader.readAsDataURL(result.target.files[0]);
  }

  constroiCanvas(){
    //pega o contexto
    this.ctx = this.canvas.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvas.nativeElement.width = this.img.width;
    this.canvas.nativeElement.height = this.img.height;
    //constroi o canvas baseado na imagem BASE
    this.ctx.drawImage(this.img, 0, 0);
  }

  constroiCanvasThumb(){
    //pega o contexto
    this.ctxThumb = this.canvasThumb.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvasThumb.nativeElement.width = this.imgThumb.width;
    this.canvasThumb.nativeElement.height = this.imgThumb.height;
    //constroi o canvas baseado na imagem BASE
    this.ctxThumb.drawImage(this.imgThumb, 0, 0);
  }

  cancelVar(event){
    //Recupera o id para alterar no array
    let id = event.target.id;
    
    //Remove do array de variaveis
    this.listaVariaveis = this.listaVariaveis.filter(function (variavel) {
      return variavel.titulo !== id
    })

    //Redesenha o canvas
      //limpa o canvas inteiro
      this.limpaCamposCanvas();
      //reconstroi o canvas
      this.constroiCanvas();
      //coloca as variáveis novamente
      this.escreveCamposCanvas();
  }

  limpaCamposCanvas(){
    //Limpa tudo
    this.ctx.clearRect(0, 0, +this.img.width, +this.img.height);
  }

  escreveCamposCanvas(){
    this.listaVariaveis.forEach(variavel => {
      //escreve o texto na imagem base
      this.ctx.font = `${variavel.tamanho}px ${variavel.fonte}`; 
      if(variavel.cor == ''){
        this.ctx.fillStyle = 'black';
      }else{
        this.ctx.fillStyle = variavel.cor;
      }
      
      this.ctx.fillText(variavel.textoModelo, +variavel.cordX, +variavel.cordY);
    });
  }

  mudaFonte(){
    //assim que selecionar a fonte, seta na variavel
    this.variavel.fonte = this.selectedFont.family;
    //seleciona a url (mais para frente, implementar a opção de escolher ao usuário https://www.webcis.com.br/utilizando-font-face-tipografia-web.html)
    let src = '';
    //busca pelo regular
    if(this.selectedFont.files.regular){
      src = this.selectedFont.files.regular;
    }else{
      src = this.selectedFont.files[0];
    }
    //cria o @fontface
    let style = `
    @font-face {
      font-family: '${this.selectedFont.family}';
      src: url(${src}) format('opentype');
    }
    `;

    //adiciona a fonte no DOM
    const node = document.createElement('style');
    node.innerHTML = style; 
    document.head.appendChild(node);

    setTimeout(() => {
      document.getElementById('boxImagePreview').style.fontFamily = this.selectedFont.family;
    }, 1000);

    console.log(`Fonte adicionada: Nome: ${this.selectedFont.family}, url: ${src}`)
  }
}
