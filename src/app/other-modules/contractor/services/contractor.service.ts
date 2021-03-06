import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataFactoryService } from "app/services/data-factory.service";
import { TokenService } from "app/services/token.service";
import { environment } from "environments/environment";
import { ICompany } from "../interfaces/icompany";

@Injectable()
export class ContractorService extends DataFactoryService {
  constructor(http: HttpClient, tokenService: TokenService) {
    super(environment.apiUrlCompany, http, tokenService);
  }

  getByKey(key: string) {
    return this.http
      .get(environment.apiUrlCompany + "/GetByKey/" + key, {
        headers: this.bearerHeader(),
      })
      .catch(this.errorHandler);
  }

  getTransEuEmployeeList(employeeUrl: string) {
    let reqBody = {
      employeeUrl,
    };

    return this.http.post(
      environment.getTransEuEmployeeList,
      JSON.stringify(reqBody),
      {
        headers: this.bearerHeader(),
      }
    );
  }

  formAddressGroup(form: FormBuilder) {
    return form.group({
      addressId: [0],
      address_type: ["główny"],
      country: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(2),
          Validators.minLength(2),
        ]),
      ],
      postal_code: [null, Validators.required],
      locality: [null, Validators.required],
      street_address: [null],
      street_number: [null, Validators.required],
    });
  }

  formCompanyGroup(fb: FormBuilder) {
    var res = fb.group({
      addressList: fb.array([]),
      bankAccountList: fb.array([]),
      companyId: [null],
      short_name: [null, Validators.required],
      legal_name: "",
      vat_id: [null, Validators.required],
      telephone: [null],
      fax: "",
      email: [null],
      url: "",
      employeeList: fb.array([]),
      trans_id: [null],
    });

    let email = res.get("email");
    let tel = res.get("telephone");

    email.valueChanges.distinctUntilChanged().subscribe((s) => {
      if (s) {
        email.setValidators(Validators.email);
        email.updateValueAndValidity();
      } else {
        email.clearValidators();
        email.updateValueAndValidity();
      }
    });

    return res;
  }

  formCompanyBankAccountGroup(fb: FormBuilder) {
    return fb.group({
      bankAccountId: [0],
      type: [null, Validators.required],
      account_no: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(28),
          Validators.minLength(18),
        ]),
      ],
      swift: [],
    });
  }

  formEmployeeGroup(form: FormBuilder) {
    let res = form.group({
      companyEmployeeId: [0],
      given_name: [null, Validators.required],
      family_name: [null, Validators.required],
      trans_id: [null],
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      telephone: [null],
      is_driver: [false],
    });
    return res;
  }

  patchCompanyData(
    companyData: ICompany,
    rForm: FormGroup,
    fb: FormBuilder,
    emit: boolean = true
  ): void {
    let addressList = <FormArray>rForm.get("addressList");
    let employeeList = <FormArray>rForm.get("employeeList");
    let bankAccountList = <FormArray>rForm.get("bankAccountList");
    addressList.controls = [];
    employeeList.controls = [];
    bankAccountList.controls = [];

    companyData.addressList.forEach((adress) => {
      let address = <FormGroup>this.formAddressGroup(fb);
      address.markAsDirty();
      addressList.push(address);
    });

    companyData.bankAccountList.forEach((acc) => {
      bankAccountList.push(this.formCompanyBankAccountGroup(fb));
    });

    companyData.employeeList.forEach((emp) => {
      employeeList.push(this.formEmployeeGroup(fb));
    });
    rForm.patchValue(companyData, { emitEvent: false });
  }
}
