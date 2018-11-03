import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
import {
  DragDropModule
} from '@angular/cdk/drag-drop';
import {MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter} from '@angular/material/core';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatGridListModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatDatepickerModule,
  MatPaginatorModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatToolbarModule,
  MatSnackBarModule,
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatListModule,
    MatPaginatorModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    
    
  ],
  exports: [
    CommonModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatGridListModule,
    MatMomentDateModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatPaginatorModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
  ],
  declarations: [

  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: "pl-PL"},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class SharedMaterialRestModule { }
