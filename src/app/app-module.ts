import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Editor } from './components/editor/editor';
import { Search } from './components/search/search';
import { Results } from './components/results/results';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [App, Editor, Search, Results],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
