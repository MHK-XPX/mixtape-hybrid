//NOT USED
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../models/item';
import { ItemBuilder } from '../../providers/providers';
import { SearchResults } from '../../models/searchresults';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  searchResults: SearchResults;

  constructor(public navCtrl: NavController, public navParams: NavParams, private itemBuilder: ItemBuilder) { }

  /**
   * Perform a service for the proper items.
   
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }*/

  getItems(ev){
    let val: string = ev.target.value;

    if(!val || !val.trim() || val.length == 0){
      this.searchResults = null;
    }

    let s: Subscription = this.itemBuilder.searchQuery<SearchResults>("Search", val).subscribe(
      d => this.searchResults = d,
      err => console.log("Cant find results"),
      () => s.unsubscribe()
    );
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

}
