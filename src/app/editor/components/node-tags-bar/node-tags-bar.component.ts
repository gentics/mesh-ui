import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { MeshNode } from '../../../common/models/node.model';

@Component({
  selector: 'app-node-tags-bar',
  templateUrl: './node-tags-bar.component.html',
  styleUrls: ['./node-tags-bar.component.scss']
})
export class NodeTagsBarComponent implements OnInit {

  @Input() node: MeshNode;
  constructor() { }

  ngOnInit() {

  }

  onChange($event) {

  }

  search($event) {

  }
}
