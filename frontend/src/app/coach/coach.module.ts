import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachSquadManagementComponent } from './coach-squad-management/coach-squad-management.component';
import { RouterModule } from '@angular/router';
import { CoachDashbaordComponent } from './coach-dashbaord/coach-dashbaord.component';
import { CoachAcademyDetailsComponent } from './coach-academy-details/coach-academy-details.component';
import { CoachSquadListComponent } from './coach-squad-list/coach-squad-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
// Import the library
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ContactAdminComponent } from './contact-admin/contact-admin.component';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};



@NgModule({
  declarations: [
    CoachSquadManagementComponent,
    CoachDashbaordComponent,
    CoachAcademyDetailsComponent,
    CoachSquadListComponent,
    ContactAdminComponent
  ],
  imports: [
    NgxImageZoomModule,
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    AngularEditorModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class CoachModule { }
