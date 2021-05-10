import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { PaymentTermsService } from './payment-terms.service';

describe('PaymentTermsService', () => {
  let service: PaymentTermsService;
  const STRING_ISO_DATE = '2021-04-16T15:21:40Z';
  const LUXON_DATE = DateTime.fromISO(STRING_ISO_DATE);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDatepickerModule, ReactiveFormsModule, FormsModule],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }],
    });
    service = TestBed.inject(PaymentTermsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('AddDaysToDateISOFormat', () => {
    const DATE_ISO_FORMAT = '2021-04-15T15:30:14Z';
    it('should throw error when day is negative', () => {
      expect(() => service.addDaysToDateISOFormat(-5, DATE_ISO_FORMAT)).toThrow(
        new Error('daysToAdd number should not be negative')
      );
    });

    it('should throw error when date is invalid', () => {
      expect(() =>
        service.addDaysToDateISOFormat(5, '2021-04-16TA5:23:21Z')
      ).toThrow(new Error('current date string is invalid'));
    });

    it('should be next Date after 2021-04-16, so 2021-04-17', () => {
      const RES = service.addDaysToDateISOFormat(1, LUXON_DATE.toISO());
      expect(RES).toEqual(new Date(LUXON_DATE.plus({ days: 1 }).toISO()));
    });
  });

  describe('czySobotaLubNiedziela', () => {
    it('Should be false, 2021-04-15; Czwartek', () => {
      const RES = service.czySobotaLubNiedziela(
        new Date('2021-04-15T15:30:14Z')
      );
      expect(RES).toBeFalse();
    });

    it('Should be true, 2021-04-17; Sobota', () => {
      const RES = service.czySobotaLubNiedziela(
        new Date('2021-04-17T12:51:32Z')
      );
      expect(RES).toBeTrue();
    });
    it('Should be true, 2021-04-18; Niedziela', () => {
      const RES = service.czySobotaLubNiedziela(new Date('2021-04-18'));
      expect(RES).toBeTrue();
    });
  });

  describe('ConvToLuxonDate', () => {
    it('should return LUXON object, date is VALID string format yyyy-MM-dd', () => {
      const YEAR_MONTH_DAY_FORMAT_DATE = '2021-04-16';
      const LUXON = DateTime.fromFormat(
        YEAR_MONTH_DAY_FORMAT_DATE,
        'yyyy-MM-dd'
      );
      expect(service.convToLuxonDate(YEAR_MONTH_DAY_FORMAT_DATE)).toEqual(
        LUXON
      );
    });

    it('should throw error when date is invalid string format', () => {
      expect(() => service.convToLuxonDate('2021-04-AA')).toThrow(
        new Error('Input date is invalid format/object date')
      );
    });

    it('should return LUXON, date is valid ISO format date', () => {
      const RES = service.convToLuxonDate(STRING_ISO_DATE);
      expect(RES).toEqual(LUXON_DATE);
    });
  });

  describe('calcDateDifferenceISOFormat', () => {
    it('Should throw error, input date format is invalid', () => {
      expect(() =>
        service.calcDateDifferenceISOFormat('2015-12-a', '2021-04-16')
      ).toThrowError('Input date is invalid format/object date');
    });
    it('Should be NEGATIVE value if 2nd arg is before first, -5', () => {
      expect(
        service.calcDateDifferenceISOFormat('2015-12-10', '2015-12-05')
      ).toEqual(-5);
    });
    it('Should be 0 if dates are the same', () => {
      expect(
        service.calcDateDifferenceISOFormat('2015-12-10', '2015-12-10')
      ).toEqual(0);
    });
    it('Should be positive value, 2nd arg is next date', () => {
      expect(
        service.calcDateDifferenceISOFormat('2015-12-10', '2015-12-11')
      ).toEqual(1);
    });
  });

  describe('dzienDniForma', () => {
    it('Should be 5 dni', () => {
      expect(service.dzienDniFormat(5)).toEqual('5 dni');
    });
    it('Should be 1 dzien', () => {
      expect(service.dzienDniFormat(1)).toEqual('1 dzień');
    });
  });

  describe('formatDateYearMonthDay', () => {
    it('should return valid format date 2021-04-18', () => {
      const RES = service.formatDateYearMonthDay(
        new Date('2021-04-18T07:22:05Z')
      );
      expect(RES).toEqual('2021-04-18');
    });
  });

  describe('isLuxonDate', () => {
    it('should be false, date is string format', () => {
      const RES = service.isLuxonDate('2012-03-19T07:22:05Z');
      expect(RES).toBeFalse();
    });

    it('should be false, date is Date object', () => {
      const RES = service.isLuxonDate(new Date('2012-03-19T12:12:32Z'));
      expect(RES).toBeFalse();
    });

    it('should be true, date is LUXON date', () => {
      const RES = service.isLuxonDate(LUXON_DATE);
      expect(RES).toBeTrue();
    });
  });
});
