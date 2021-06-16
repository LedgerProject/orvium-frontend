import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { SeparatorPipe } from './custom-pipes/separator.pipe';
import { ShortenPipe } from './custom-pipes/shorten.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { DepositsListComponent } from './deposits-list/deposits-list.component';
import { EmptyStatePublicationsComponent } from './empty-state-publications/empty-state-publications.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowMoreComponent } from './show-more/show-more.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { GravatarModule } from 'ngx-gravatar';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvitationsListComponent } from './invitations-list/invitations-list.component';
import { MatTableModule } from '@angular/material/table';
import { CopyToClipboardDirective } from './copy-to-clipboard.directive';
import { FileListComponent } from './file-list/file-list.component';
import { OrviumUxLibModule } from '@orvium/ux-components';

@NgModule({
  declarations: [
    // Pipes
    SeparatorPipe,
    ShortenPipe,
    // Components
    DepositsListComponent,
    EmptyStatePublicationsComponent,
    ShowMoreComponent,
    FileuploadComponent,
    InvitationsListComponent,
    CopyToClipboardDirective,
    FileListComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule,
    MatDividerModule,
    GravatarModule,
    NgxSmartModalModule.forChild(),
    FontAwesomeModule,
    OrviumUxLibModule
  ],
  exports: [
    // Pipes
    SeparatorPipe,
    ShortenPipe,
    // Global Components
    DepositsListComponent,
    EmptyStatePublicationsComponent,
    ShowMoreComponent,
    FileuploadComponent,
    InvitationsListComponent,
    CopyToClipboardDirective,
    FileListComponent
  ],
  providers: [
    TitleCasePipe,
    DatePipe,
  ]
})
export class SharedModule {
}
