import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";

import { DataFactoryService } from "./data-factory.service";
import { TokenService } from "./token.service";

describe("DataFactoryService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        DataFactoryService,
        TokenService,
        {
          provide: "url",
          useValue: "",
        },
      ],
    });
  });

  it("should be created", inject(
    [DataFactoryService],
    (service: DataFactoryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
