import { of } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';
import { and, not, or } from './boolean.operator';

describe('The boolean operators', () => {
  describe('not', () => {
    it('should return a new DynOperation that return the opposite value', (done) => {
      const operation: DynOperation<unknown, unknown, boolean> = not(() => of(true));
      operation({} as DynContext<unknown, unknown>).subscribe((result: boolean) => {
        expect(result).toBe(false);
        done();
      });
    });

    it('should return a new DynOperation that return the opposite value', (done) => {
      const operation: DynOperation<unknown, unknown, boolean> = not(() => of(false));
      operation({} as DynContext<unknown, unknown>).subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  describe('and', () => {
    it('should return a new DynOperation that return true if all the operations return true', (done) => {
      const operation: DynOperation<unknown, unknown, boolean> = and(
        () => of(true),
        () => of(true),
        () => of(true),
      );
      operation({} as DynContext<unknown, unknown>).subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return a new DynOperation that return false if at least one of the operations return false', (done) => {
      const operation: DynOperation<unknown, unknown, boolean> = and(
        () => of(true),
        () => of(false),
        () => of(true),
      );
      operation({} as DynContext<unknown, unknown>).subscribe((result: boolean) => {
        expect(result).toBe(false);
        done();
      });
    });
  });

  describe('or', () => {
    it('should return a new DynOperation that return true if at least one of the operations return true', (done) => {
      const operation: DynOperation<unknown, unknown, boolean> = or(
        () => of(false),
        () => of(false),
        () => of(true),
      );
      operation({} as DynContext<unknown, unknown>).subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return a new DynOperation that return false if all the operations return false', (done) => {
      const operation: DynOperation<unknown, unknown, boolean> = or(
        () => of(false),
        () => of(false),
        () => of(false),
      );
      operation({} as DynContext<unknown, unknown>).subscribe((result: boolean) => {
        expect(result).toBe(false);
        done();
      });
    });
  });
});
