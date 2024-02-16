import { Observer, of } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';
import { use, useEmpty, useFrom, useIf, useUndefined, useWhen } from './use.operator';

describe('The use operators.', () => {

  describe('use', () => {
    it('should return a new DynOperation with the given value', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = use(value);
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return a new DynOperation with the given values', (done) => {
      const value1: string = 'value1';
      const value2: string = 'value2';
      const operation: DynOperation<unknown, unknown, string> = use(value1, value2);
      let index: number = 0;
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        switch(index++) {
          case 0:
            expect(result).toBe(value1);
            break;
          case 1:
            expect(result).toBe(value2);
            done();
            break;
        }
      });
    });
  });

  describe('useFrom', () => {
    it('should return a new DynOperation with the async given value', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = useFrom(Promise.resolve(value));
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return a new DynOperation with the async given values', (done) => {
      const value1: string = 'value1';
      const value2: string = 'value2';
      const operation: DynOperation<unknown, unknown, string> = useFrom(Promise.resolve(value1), Promise.resolve(value2));
      let index: number = 0;
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        switch(index++) {
          case 0:
            expect(result).toBe(value1);
            break;
          case 1:
            expect(result).toBe(value2);
            done();
            break;
        }
      });
    });
  });

  describe('useUndefined', () => {
    it('should return a new DynOperation that return an undefined value', (done) => {
      const operation: DynOperation<unknown, unknown, undefined> = useUndefined();
      operation({} as DynContext<unknown, unknown>).subscribe((result: undefined) => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });

  describe('useEmpty', () => {
    it('should return a new DynOperation that return an empty observable', () => {
      const operation: DynOperation<unknown, unknown, unknown> = useEmpty();
      const observer: Observer<unknown> = jasmine.createSpyObj('Observer', ['next', 'error', 'complete']);
      operation({} as DynContext<unknown, unknown>).subscribe(observer);
      expect(observer.complete).toHaveBeenCalled();
      expect(observer.next).not.toHaveBeenCalled();
      expect(observer.error).not.toHaveBeenCalled();
    });
  });

  describe('useIf', () => {
    it('should return a new DynOperation with the if operator', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = useIf({
        if: () => of(true),
        then: () => of(value),
      });
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return a new DynOperation with the if operator and the else operator', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = useIf({
        if: () => of(false),
        then: () => of('other'),
        else: () => of(value),
      });
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return a new DynOperation with the if operator and the else operator as empty', () => {
      const operation: DynOperation<unknown, unknown, unknown> = useIf({
        if: () => of(false),
        then: () => of('other'),
      });
      const observer: Observer<unknown> = jasmine.createSpyObj('Observer', ['next', 'error', 'complete']);
      operation({} as DynContext<unknown, unknown>).subscribe(observer);
      expect(observer.complete).toHaveBeenCalled();
      expect(observer.next).not.toHaveBeenCalled();
      expect(observer.error).not.toHaveBeenCalled();
    });
  });

  describe('The useWhen function', () => {
    it('should return a new DynOperation with the when operator if the cases is a string', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = useWhen({
        when: use<unknown, unknown, 'a' | 'b'>('a'),
        cases : {
          a: () => of(value),
          b: () => of('other'),
        },
      });
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return a new DynOperation with the when operator if the cases is a number', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = useWhen({
        when: use<unknown, unknown, 1 | 2>(1),
        cases : {
          1: () => of(value),
          2: () => of('other'),
        },
      });
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return the default case if the when is not in the cases', (done) => {
      const value: string = 'value';
      const operation: DynOperation<unknown, unknown, string> = useWhen({
        when: use<unknown, unknown, string>('c'),
        cases : {
          a: () => of('other'),
          b: () => of('other'),
        },
        defaults: () => of(value),
      });
      operation({} as DynContext<unknown, unknown>).subscribe((result: string) => {
        expect(result).toBe(value);
        done();
      });
    });

    it('should return an empty observable if the when is not in the cases and the default is not provided', () => {
      const operation: DynOperation<unknown, unknown, unknown> = useWhen({
        when: use<unknown, unknown, string>('c'),
        cases : {
          a: () => of('other'),
          b: () => of('other'),
        },
      });
      const observer: Observer<unknown> = jasmine.createSpyObj('Observer', ['next', 'error', 'complete']);
      operation({} as DynContext<unknown, unknown>).subscribe(observer);
      expect(observer.complete).toHaveBeenCalled();
      expect(observer.next).not.toHaveBeenCalled();
      expect(observer.error).not.toHaveBeenCalled();
    });
  });

});
