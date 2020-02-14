import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewImage } from 'src/typings/newImage';
import { Variavel } from 'src/typings/variavel';
import { ImageService } from '../../services/image/image-service';
import { GoogleApiService } from 'src/app/services/commom/google-api.service';
import { FonteService } from 'src/app/services/fonte/fonte.service';



@Component({
  selector: 'app-continue-edit',
  templateUrl: './continue-edit.component.html',
  styleUrls: ['./continue-edit.component.scss']
})
export class ContinueEditComponent implements OnInit {

  constructor(public route: ActivatedRoute, 
    private imageService: ImageService,
    private googleService: GoogleApiService,
    private fonteService: FonteService,
    private router: Router,
    ) { }
  titulo: string;

  //Variável de canvas
  @ViewChild('canvasPreview') canvasPreview: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasThumb') canvasThumb: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  ctxPreview: CanvasRenderingContext2D;

  listaVariaveis: Variavel[] = [];
  imgPreview: HTMLImageElement;
  imgThumb: HTMLImageElement;
  name: string;
  imgX: string;
  imgY: string;
  googleFontsList: any[] = [];
  createdFontsList: any[] = [];

  selectedFont: any;
  img: HTMLImageElement;
  S3UrlThumb: string;

  flagEvents = true;
  flagAdd = false;

  ctxThumb: CanvasRenderingContext2D;

  fileBase: File;

  newImage: NewImage = new NewImage("", "", "", "", "", "", "", "", true, true, []);
  variavel: Variavel = new Variavel("", "", "", "", "", "", "", true, "", ""); 
  alinhamentos: any[] = ["center", "left", "right", "start", "end"];

  flagPreview: boolean = true;

  savedImageURL: string;

  ngOnInit() {

    //PEGANDO FONTES DO GOOGLE E FONTES INSERIDAS PELO USUARIO
    this.googleService.getGoogleFonts().subscribe((res: any) => {
      console.log(res.items);
      this.googleFontsList = res.items;
    }, err => {
      console.log(err);
      alert('Impossível carregar fontes do google. Favor contatar um administrador do sistema.')
    });
    this.fonteService.getFonts().subscribe(response => {
      this.createdFontsList = response
    })


    let id = this.route.snapshot.params.id;
    this.imageService.getImageById(id).subscribe((response:any) => {
      console.log(response)
      this.imgX = response.width; 
      this.imgY = response.height;
      this.name = response.name;
      this.imgPreview = new Image();
      this.imgThumb = new Image();


      this.newImage = response;
      //também precisa pegar o array de variaveis e colocar no this.listaVariaveis

      this.imageService.getFields(id).subscribe(fields => {
        console.log(fields);
        fields.forEach(item => {
          this.listaVariaveis.push(new Variavel(item.name, item.modelText, item.obs, item.fontFamily, item.fontSize, item.color, item.allign, item.required, item.cordX, item.cordY))
        })
      })

      setTimeout(() => {
        this.imgPreview.src = response.s3Url;  
        this.imgThumb.src = response.S3UrlThumb;
        this.imgPreview.crossOrigin = 'anonymous';
        this.imgThumb.crossOrigin = 'anonymous';

        
      }, 400); 
      
      this.imgPreview.onload = function() {
        this.constroiCanvasPreview();
      }.bind(this)

      //instancia a imagem com as propriedades reais
      this.imgThumb = new Image();
      //Quando a imagem (mesmo que apenas um objeto) é carregada, constroi o canvasThumb
      this.imgThumb.onload = function () {
        this.constroiCanvasThumb();
      }.bind(this)
      this.imgThumb.src = response.s3UrlThumb;
      
    },err => {
       console.log(err);
    })

  }

  salvarImage(){
    this.newImage.variaveis = this.listaVariaveis;
    
    //CORREÇÃO PARA ALINHAMENTO, QUANDO O ALINHAMENTO É PARA A DIREITA OU ESQUERDA, NA HORA DE EDITAR, A VARIÁVEL FICA METADE PARA O LADO OPOSTO DO ALINHAMENTO
    this.newImage.variaveis.forEach(variavel => {
      if(variavel.alinhamento == 'right'){
        //Gambiarra pois o cordX e cordY são strings e preciso somar com numero
        variavel.cordX = (+variavel.cordX + variavel.textWidth) + '';
      }else if(variavel.alinhamento == 'center'){
        //Gambiarra pois o cordX e cordY são strings e preciso somar com numero
        variavel.cordX = (+variavel.cordX + variavel.textWidth/2) + '';
      }
    });

    console.log('lista');
    console.log(this.listaVariaveis);

    //endpoint que envia a imagemBase (file) para o S3, esse endpoint deve retornar o ID da imagem
    console.log(this.newImage)
      //Ultima atualização do Dantas, o res já é o ID da imagem
    this.enviaVariaveis(this.newImage[`idImage`]);
    
  }

  enviaVariaveis(id: string){
    //endpoint que utiliza o ID retornado para enviar os atributos da imagem (nome, tamanho, etc...)
    this.imageService.updateFields(this.newImage, id).subscribe(res => {
      console.log(res);
      alert('Imagem editada com sucesso!');
      this.router.navigateByUrl('dashboard')
    }, err => {
      console.log(err);
    })
  }

  editVariavel(event){
    //Recupera o id para alterar no array
    let id = event.target.id;
    let toBeEdited: Variavel;

    //Pega a lista de variaveis
    this.listaVariaveis.forEach(element => {
      //encontra a clicada
      if(id == element.titulo){
        //atribui ao auxiliar
        toBeEdited = element;
        //Retira a clicada do array
        this.listaVariaveis.splice(this.listaVariaveis.indexOf(element), 1);
        //atribui a clicada a variavel que faz bind com os campos da tela, apenas para preenchê-los
        this.variavel = element;
        let a = parseFloat(this.variavel.tamanho) / 3.125;
        this.variavel.tamanho = a.toString(); 
      }
    });

    //encontra a fonte no array do google fonts
    this.selectedFont = this.googleFontsList.find(element => {
      //coloca a fonte no estilo do canvas
      document.getElementById('boxImagePreview').style.fontFamily = toBeEdited.fonte;
      //Retorna o objeto de fonte do google
      return element.family == toBeEdited.fonte;
    })

    //Redesenha o canvas
      //limpa o canvas inteiro
      this.limpaCamposCanvas();
      //reconstroi o canvas
      this.constroiCanvasPreview();
      //coloca as variáveis novamente
      this.escreveCamposCanvas();

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
  
  escreveCamposCanvas(){
    this.listaVariaveis.forEach(variavel => {
      //escreve o texto na imagem base
      this.ctxPreview.font = `${variavel.tamanho}pt ${variavel.fonte}`; 
      if(variavel.cor == ''){
        this.ctxPreview.fillStyle = 'black';
      }else{
        this.ctxPreview.fillStyle = variavel.cor;
      }
      
      this.ctxPreview.fillText(variavel.textoModelo, +variavel.cordX, +variavel.cordY);
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
          //Gambiarra para sair do metodo quando o título já existe
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
        floatText.style.fontSize = this.variavel.tamanho + "pt";
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
              this.ctxPreview.font = `${this.variavel.tamanho}pt ${this.variavel.fonte}`; 
              if(this.variavel.cor == ''){
                this.ctxPreview.fillStyle = 'black';
              }else{
                this.ctxPreview.fillStyle = this.variavel.cor;
              }
              
              this.ctxPreview.fillText(this.variavel.textoModelo, posX, posY + this.ctxPreview.measureText(this.variavel.textoModelo).actualBoundingBoxAscent/2);
  
              //Setando coordenadas
              this.variavel.cordX = ''+posX;
              this.variavel.cordY = '' + (posY + +(this.ctxPreview.measureText(this.variavel.textoModelo).actualBoundingBoxAscent/2)); 
  
              //Setando textWidth para ajuste de alinhamento
              this.variavel.textWidth = this.ctxPreview.measureText(this.variavel.textoModelo).width;
  
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
    mudaFonte(){
      if(this.selectedFont.family){
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
        let font = `<link rel="stylesheet" href="https://petlandcss.s3-us-west-2.amazonaws.com/dynamic.css">`
        document.head.append(font);
        document.head.appendChild(node);
    
        setTimeout(() => {
          document.getElementById('boxImagePreview').style.fontFamily = this.selectedFont.family;
        }, 1000);
    
        console.log(`Fonte adicionada: Nome: ${this.selectedFont.family}, url: ${src}`)
      }else{
        //assim que selecionar a fonte, seta na variavel
        this.variavel.fonte = this.selectedFont;
        
        //cria o @fontface
        let style = `
        @font-face {
          font-family: '${this.selectedFont}';
          src: url(https://petlandfonts.s3-us-west-2.amazonaws.com/${this.selectedFont}.ttf) format('opentype');
        }
        
        `;
    
        //adiciona a fonte no DOM
        const node = document.createElement('style');
        node.innerHTML = style; 
        let font = `<link rel="stylesheet" href="https://petlandcss.s3-us-west-2.amazonaws.com/dynamic.css">`
        document.head.append(font);
        document.head.appendChild(node);
    
        setTimeout(() => {
          document.getElementById('boxImagePreview').style.fontFamily = this.selectedFont.family;
        }, 1000);
    
        // console.log(`Fonte adicionada: Nome: ${this.selectedFont.family}, url: ${src}`)
      }
    }

  constroiCanvas(){
    //pega o contexto
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.img = new Image();

    //Seta o tamanho do canvas
    this.canvas.nativeElement.width = this.img.width;
    this.canvas.nativeElement.height = this.img.height;
    //constroi o canvas baseado na imagem BASE
    this.ctx.drawImage(this.img, 0, 0);
  }

  constroiCanvasPreview(){
    //pega o contexto 
    this.ctxPreview = this.canvas.nativeElement.getContext('2d');
    //Seta o tamanho do canvas
    this.canvas.nativeElement.width = this.newImage['width'];
    this.canvas.nativeElement.height = this.newImage['height'];
    //constroi o canvas baseado na imagem BASE
    this.ctxPreview.drawImage(this.imgPreview, 0, 0);

    this.escreveCampos();
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

  chamaPreview(){
    //EXEMPLO DE COMO ABAIXAR A QUALIDADE DA IMAGEM
    //console.log(this.canvasPreview.nativeElement.toDataURL('image/jpeg', 0.4));
    
    //Cria um canvas na memória
    let cvWaterMark = document.createElement('canvas');
    //Seta width e height
    cvWaterMark.width = +this.imgX;
    cvWaterMark.height = +this.imgY;
    //Pega o contexto
    let ctxWaterMark = cvWaterMark.getContext('2d');

    //Inicia a marca d'agua
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.canvasPreview.nativeElement.toDataURL();

    img.onload = function () {
      ctxWaterMark.drawImage(img,0,0);
        
          let tamanhoFonte:number = cvWaterMark.width * 0.07;

          ctxWaterMark.font=`${tamanhoFonte}pt verdana`;
          ctxWaterMark.globalAlpha=.30;
          ctxWaterMark.fillStyle='white'

          let metrics = ctxWaterMark.measureText("WaterMark Demo");
          let width = metrics.width/2;
          
          ctxWaterMark.translate(cvWaterMark.width/3, cvWaterMark.height/2);
          ctxWaterMark.rotate(-Math.atan(cvWaterMark.height/cvWaterMark.width));
          ctxWaterMark.fillText("Aguarde aprovação", -width/2, tamanhoFonte/2);
          ctxWaterMark.fillStyle='black'
          ctxWaterMark.fillText("Aguarde aprovação", -width/2 + 3, tamanhoFonte/2);

          
          let imagePreview = new Image();
          imagePreview.src = cvWaterMark.toDataURL('image/jpeg', 0.8);

          imagePreview.onload = function() {
            let w = window.open('');
            w.document.write(imagePreview.outerHTML)
          }

    }.bind(this)
    
    //chave demais isso aqui....
    //cvWaterMark.requestFullscreen();
  } 

  // salvarImage(){
  //   this.canvasPreview.nativeElement.toBlob(function(blob) {
  //     let file: any = blob;
  //     //O new date é apenas para o cast dar certo.
  //     file.lastModifiedDate = new Date();
  //     file.name = this.name;

  //     this.imageService.postImage(<File>file, file.name).subscribe(res => {
  //       this.imageService.setImageRequester(res, localStorage.getItem('user')).subscribe(response => {
  //         console.log(response)
  //       })
  //       this.imageService.setFinalImageToTrue(res).subscribe(res => {
  //         alert('Imagem salva');
  //         console.log(res);
  //       }, err => {
  //         alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
  //       console.log(err)
  //       })
        
  //     }, err => {
  //       alert('Erro ao salvar imagem. Entre em contato com um administrador do sistema.')
  //       console.log(err)
  //     })
  //   }.bind(this))
  // }

  changeInput(event){
    //Recupera o id para alterar no array
    let id = event.target.id;
    //recupera o que foi escrito
    let valor = event.target.value;
    //Altera o array
    this.listaVariaveis.forEach(variavel => {
      if(variavel.titulo == id){
        if(variavel.obrigatorio && valor == ''){
          alert('Esse campo é obrigatório')
          return false;
        }else{
          variavel.textoModelo = valor;
        }
      } 
    });
    this.limpaCamposCanvas();
    this.constroiCanvasPreview();
  }

  escreveCampos(){
    console.log(this.listaVariaveis)
     this.listaVariaveis.forEach(variavel => {
      //escreve o texto na imagem base
      this.ctxPreview.font = `${variavel.tamanho}pt ${variavel.fonte}`;

      if(variavel.cor == '' || variavel.cor == null){
        this.ctxPreview.fillStyle = 'black';
      }else{
        this.ctxPreview.fillStyle = variavel.cor;
      }

      //Case para alinhamento
      switch (variavel.alinhamento) {
          case 'center':
            this.ctxPreview.textAlign = "center";
          break;
          case 'right':
            this.ctxPreview.textAlign = "right";
          break;
          case 'left':
            this.ctxPreview.textAlign = "left";
          break;
          case 'start':
            this.ctxPreview.textAlign = "start";
          break;
          case 'end':
            this.ctxPreview.textAlign = "end";
          break;
      }

      this.ctxPreview.fillText(variavel.textoModelo, +variavel.cordX, +variavel.cordY);
      
      //habilita botão de preview
      this.flagPreview = false;
    });
  }

  limpaCamposCanvas(){
    //Limpa tudo
    this.ctxPreview.clearRect(0, 0, +this.imgX, +this.imgY);
  }
  
  previewImage(){
    this.canvasPreview.nativeElement.requestFullscreen();
  }
}
