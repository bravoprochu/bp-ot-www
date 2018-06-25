import { Injectable } from '@angular/core';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { IInvoiceLine } from '../../../shared/interfaces/iinvoice-pos';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DialogTakNieComponent } from '../../../shared/dialog-tak-nie/dialog-tak-nie.component';
import { IDialogTakNieInfo } from '../../../shared/interfaces/idialog-tak-nie-info';
import { MatDialog } from '@angular/material';
import { IInvoiceLineGroup } from '../../../shared/interfaces/iinvoice-sell';
import { Subject } from 'rxjs';

@Injectable()
export class InvoiceCommonFunctionsService {

  constructor(
    private cf: CommonFunctionsService,
    private dialogTakNie: MatDialog,
  ) { }


  getIInvoiceLine(vatRate: string) {
    return <IInvoiceLine>{
      invoice_pos_id: 0,
      brutto_value: 0,
      netto_value: 0,
      quantity: 0,
      unit_price: 0,
      vat_rate: vatRate,
      vat_unit_value: 0,
      vat_value: 0,
    }
  }

  getInvoiceLinesCorrections(lines: IInvoiceLineGroup[], linesFA: FormArray){
    linesFA.controls.forEach(lineG=>{
      let corr=lineG.get('corrections');
      let curr= <IInvoiceLine>lineG.get('current').value
      let foundLineGroup=lines.find(f=>f.current.brutto_value==curr.brutto_value && f.current.name==curr.name && f.current.netto_value==curr.netto_value && f.current.vat_rate==curr.vat_rate);
      if(foundLineGroup){
        console.log('found', foundLineGroup);
        corr.setValue(foundLineGroup.corrections, {emitEvent: false});
      }
    })
  }


  lineAdd(invoiceLines: FormArray, fb: FormBuilder) {
    let newLineFg = this.cf.formInvoiceLineGroupGroup(fb);
    newLineFg.get('original').patchValue(this.getIInvoiceLine(null));
    newLineFg.get('corrections').patchValue(this.getIInvoiceLine(null));

    invoiceLines.push(newLineFg);

  }


  lineRemove(idx: number, rForm: FormGroup, invoiceLines: FormArray, isDestroyed$:Subject<boolean>) {
    let d = this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: "Faktury", question: "Czy na pewno usunąć tą pozycję ?" } });
    d.afterClosed()
      .takeUntil(isDestroyed$)
      .subscribe((s: boolean) => {
        if (s === true) {
          invoiceLines.removeAt(idx);
          rForm.markAsDirty();
        }
      })
  }

  

}
