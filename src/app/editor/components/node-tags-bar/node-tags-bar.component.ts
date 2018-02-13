import { Input, ChangeDetectorRef, ContentChild, ViewChild, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { DropdownList, InputField, ModalService} from 'gentics-ui-core';
import { MeshNode } from '../../../common/models/node.model';
import { fuzzyMatch } from '../../../common/util/fuzzy-search';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { Tag } from '../../../common/models/tag.model';
import { EditorEffectsService } from '../../providers/editor-effects.service';
import { TagReferenceFromServer } from '../../../common/models/server-models';
import { stringToColor } from '../../../common/util/util';
import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';


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
  newTagName = ''; // contains a name for a new tag
  nodeTags: TagReferenceFromServer[] = [];

  filteredTags: Tag[] = null;
  constructor(private changeDetector: ChangeDetectorRef,
    private state: ApplicationStateService,
    private editorEffects: EditorEffectsService,
    private sanitized: DomSanitizer,
    private modalService: ModalService ) { }

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

    // If the term does NOT perfectly match any of existing tags - we will show an option to create on
    if (!tags.some(tag => tag.name.toLowerCase() === term.toLowerCase())) {
        this.newTagName = term;
    } else {
        this.newTagName = '';
    }

    this.dropDown.resize();
  }

  onTagSelected(tag: Tag) {
    const { name, tagFamily, uuid } = tag;
    this.nodeTags.push({ name, tagFamily: tagFamily.name, uuid });
    this.filteredTags = [];
    this.inputField.writeValue('');
    this.newTagName = '';
    this.checkIfDirty();
  }

  onTagDeleted(deletedTag: Tag) {
    const tagIndex = this.nodeTags.findIndex(tag => tag.uuid === deletedTag.uuid);
    this.nodeTags.splice(tagIndex, 1);
    this.checkIfDirty();
  }

  onCreateNewTagClick(term): void {
    /*this.modalService.dialog({
        title: 'A Basic Dialog',
        body: 'Create a new Dialog',
        buttons: [
            { label: 'Cancel', type: 'secondary', flat: true, returnValue: false, shouldReject: true },
        ]
    })
    .then(dialog => dialog.open())
    .then(result => console.log('result:', result))
    .catch(reason => console.log('rejected', reason));*/

    const options = {
        closeOnOverlayClick: false
    };

    this.modalService.fromComponent(CreateTagDialogComponent, options)
                .then(modal => modal.open());
  }

  /**
   * Get the diff of the original tags and the modified ones
   * return and
   */
  changesSinceLastSave(): { deletedTags: string[], newTags: string[] } {
    let deletedTags: string[] = [];
    let newTags: string[] = [];

    if (this.node.tags) {

        deletedTags = this.node.tags
            .filter(tag => this.nodeTags.every(t => t.uuid !== tag.uuid))
            .map(tag => tag.name);

        newTags = this.nodeTags
        .filter(tag => this.node.tags.every(t => t.uuid !== tag.uuid))
        .map(tag => tag.name);
    }
    return { deletedTags, newTags };
  }

  getTagBackgroundColor(familyName: string) {
    return this.sanitized.bypassSecurityTrustStyle(stringToColor(familyName));
  }

  private checkIfDirty() {
    const oldUuids = (this.node.tags || []).map(tag => tag.uuid).sort().join(',');
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
