import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynFormModule } from '../../../dynform/src/public-api';
import { AppComponent, InputComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent, InputComponent],
  imports: [
    CoreModule,
    FormsModule,
    DynFormModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
