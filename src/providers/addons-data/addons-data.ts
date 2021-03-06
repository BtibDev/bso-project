// Angular
import { Injectable } from '@angular/core';

// Firestore
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

// Libraries
import { plainToClass } from "class-transformer";

// Models
import { Tag } from '../../model/tag-model';

// Providers
import { FirestoreProvider } from '../firestore/firestore';

// RxJs
import Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Relation } from '../../model/relation-model';

@Injectable()
export class AddonsDataProvider {

  constructor(
    public firestorePvd: FirestoreProvider
  ) { }

  public tags$: Observable<Tag[]> = Rx.Observable.empty();
  public relations$: Observable<Relation[]> = Rx.Observable.empty();

  ////////////////////////////////////////////////////////////////
  // Public methods
  ////////////////////////////////////////////////////////////////

  /**
   * Start a subscription to read the entire list of tags at the first call
   * Update automatically the tags$ variable at every update
   */
  public loadTags(): void {

    // Read all tags
    this.tags$ = this.firestorePvd.readCollection('tag')
      .map(tags => { // tags: Tag[]

        // For each tag
        return tags.map(tag => { // tag: Tag

          // Transform the plain object into a Tag type
          return plainToClass(Tag, tag as Object);

        });

      });
  }

  /**
 * Start a subscription to read the entire list of relations at the first call
 * Update automatically the relations$ variable at every update
 */
  public loadRelations(): void {

    // Read all relations
    this.relations$ = this.firestorePvd.readCollection('relation')
      .map(relations => { // relations: Relation[]

        // For each relation
        return relations.map(relation => { // relation: Relation

          // Transform the plain object into a Relation type
          return plainToClass(Relation, relation as Object);

        });

      });
  }

}
