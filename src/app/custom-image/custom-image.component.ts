import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageService } from '../services/image/image-service';

@Component({
  selector: 'app-custom-image',
  templateUrl: './custom-image.component.html',
  styleUrls: ['./custom-image.component.scss']
})
export class CustomImageComponent implements OnInit {

  constructor(public route: ActivatedRoute, private imageService: ImageService) { }

  ngOnInit() {
    let id = this.route.snapshot.params.id;
    this.imageService.getImageById(id).subscribe(response => {
      console.log(response);
    })
  }
  chamaPreview(){
    
  }

}
