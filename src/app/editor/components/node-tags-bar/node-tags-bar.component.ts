import { Component, OnInit } from '@angular/core';
import { Input, ChangeDetectorRef, ContentChild, ViewChild } from '@angular/core';
import { MeshNode } from '../../../common/models/node.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Tag } from '../../../common/models/tag.model';
import { DropdownList, InputField } from 'gentics-ui-core';
import { Observable } from 'rxjs/Observable';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { TagReferenceFromServer } from '../../../common/models/server-models';

@Component({
  selector: 'app-node-tags-bar',
  templateUrl: './node-tags-bar.component.html',
  styleUrls: ['./node-tags-bar.component.scss']
})
export class NodeTagsBarComponent implements OnChanges {

  //@ContentChild(DropdownList) dropDown: DropdownList;
  @ViewChild('DropdownList') dropDown: DropdownList;
  @ViewChild('InputField') inputField: InputField;
  @Input() node: MeshNode;
  isDirty = false;
  nodeTags: TagReferenceFromServer[] = [];

  filteredTags: Tag[] = null;
  constructor(private changeDetector: ChangeDetectorRef,
    private state: ApplicationStateService,
    private editorEffects: EditorEffectsService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.node && changes.node.currentValue) {
      const node = changes.node.currentValue as MeshNode;
      this.nodeTags = node.tags ? [...node.tags] : [];
      this.isDirty = false;
      this.inputField.writeValue('');
    }
  }

  onFilterChange(term: string) {
    const tags = Object.values<Tag>(this.state.now.entities.tag);
    this.filteredTags = tags.filter(tag => this.selectTagByFilter(tag, term));
    this.dropDown.resize();
  }

  onTagSelected(tag: Tag) {
    const { name, tagFamily, uuid } = tag;
    this.nodeTags.push({ name, tagFamily: tagFamily.name, uuid });
    this.filteredTags = [];
    this.inputField.writeValue('');
    this.checkIfDirty();
  }

  onTagDeleted(deletedTag: Tag) {
    const tagIndex = this.nodeTags.findIndex(tag => tag.uuid === deletedTag.uuid);
    this.nodeTags.splice(tagIndex, 1);
    this.checkIfDirty();
  }

  public getChanges() {
    const deletedTags = (this.node.tags ||  []).reduce((deletedTags, tag, index) => {
      if (this.nodeTags.findIndex(existingTag => existingTag.uuid === tag.uuid) === -1) {
        deletedTags.push(tag.name)
      }
      return deletedTags;
    }, []);


    const newTags = this.nodeTags.reduce((newTags, tag, index) => {
      if(!this.node.tags
      || this.node.tags.findIndex(oldTag => oldTag.uuid === tag.uuid) === -1) {
        newTags.push(tag.name);
      }
      return newTags;
    }, []);

    return { deletedTags, newTags };
  }

  private checkIfDirty() {
    const oldUuids = (this.node.tags ||  []).map(tag => tag.uuid).sort().join(',');
    const newUuids = this.nodeTags.map(tag => tag.uuid).sort().join(',');
    this.isDirty = newUuids !== oldUuids;
  }

  private selectTagByFilter = (tag: Tag, term: string): boolean => {
    if (this.nodeTags.findIndex(existingTag => existingTag.uuid === tag.uuid) !== -1) {
      return false;
    }

    const matches: string[] = fuzzyMatch(term, tag.name);
    return matches && matches.length > 0;
  }
}
