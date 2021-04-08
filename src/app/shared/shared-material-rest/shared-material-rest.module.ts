import { NgModule } from "@angular/core";

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SharedMaterialRestModule {}
