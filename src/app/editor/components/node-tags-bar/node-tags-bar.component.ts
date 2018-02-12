import { Component, OnInit } from '@angular/core';
import { Input, ChangeDetectorRef, ContentChild, ViewChild } from '@angular/core';
import { MeshNode } from '../../../common/models/node.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Tag } from '../../../common/models/tag.model';
import { DropdownList } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { EditorEffectsService } from '../../providers/editor-effects.service';

@Component({
  selector: 'app-node-tags-bar',
  templateUrl: './node-tags-bar.component.html',
  styleUrls: ['./node-tags-bar.component.scss']
})
export class NodeTagsBarComponent implements OnInit {

  //@ContentChild(DropdownList) dropDown: DropdownList;
  @ViewChild('DropdownList') dropDown: DropdownList;
  @Input() node: MeshNode;
  searchQuery: string;


  filteredTags: Tag[] = null;

  constructor(private changeDetector: ChangeDetectorRef,
              private state: ApplicationStateService,
              private editorEffects: EditorEffectsService) { }

  ngOnInit() {
  }

  onChange(term: string) {
    const tags = Object.values<Tag>(this.state.now.entities.tag);
    this.filteredTags = tags.filter(tag => this.selectTagByFilter(tag, term));
    this.dropDown.resize();
  }

  onTagSelected(tag: Tag) {
    this.editorEffects.saveNodeTag(this.state.now.editor.openNode.projectName, this.node.uuid, tag.uuid);
    this.searchQuery = '';
    this.filteredTags = [];
  }

  onTagDeleted(tag: Tag) {
    this.editorEffects.deleteNodeTag(this.state.now.editor.openNode.projectName, this.node.uuid, tag.uuid);
  }

  private selectTagByFilter = (tag: Tag, term: string): boolean => {
    const matches: string[] = fuzzyMatch (term, tag.name);
    return matches && matches.length > 0;
  }
}
