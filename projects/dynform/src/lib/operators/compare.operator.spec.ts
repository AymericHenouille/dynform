import { of } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';
import { compare } from './compare.operator';

describe('The compare operator', () => {

  describe('unknown operator', () => {
    it('should throw an error', (done) => {
      const arg1: DynOperation<unknown, unknown, unknown> = () => of(1);
      const arg2: DynOperation<unknown, unknown, unknown> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'unknown' as any, arg2);
      operation({} as DynContext<unknown, unknown>).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Unknown operator: unknown');
          done();
        },
      });
    });
  });

  describe('==', () => {
    it('should return true when the two param are equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('1');
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return true the two param are stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the two param are not equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('1');
      const arg2: DynOperation<unknown, unknown, number> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return false when the two param are not stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('!=', () => {
    it('should return false when the two param are equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('1');
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return false the two param are stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return true when the two param are not equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('1');
      const arg2: DynOperation<unknown, unknown, number> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return true when the two param are not stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });
  });

  describe('===', () => {
    it('should return true the two param are stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '===', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the two param are not stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '===', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return false when the two param are equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('1');
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '===', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('!==', () => {
    it('should return false the two param are stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return true when the two param are not stric equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('value2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return true when the two param are equal', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('1');
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '!==', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });
  });

  describe('<', () => {
    it('should return true when the first param is less than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '<', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param is greater than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(2);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '<', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return false when the first param is equal to the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '<', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('<=', () => {
    it('should return true when the first param is less than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '<=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return true when the first param is equal to the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '<=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param is greater than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(2);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '<=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('>', () => {
    it('should return true when the first param is greater than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(2);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '>', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param is less than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '>', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return false when the first param is equal to the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '>', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('>=', () => {
    it('should return true when the first param is greater than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(2);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '>=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return true when the first param is equal to the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(1);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '>=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param is less than the second', (done) => {
      const arg1: DynOperation<unknown, unknown, number> = () => of(1);
      const arg2: DynOperation<unknown, unknown, number> = () => of(2);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, '>=', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('in', () => {
    it('should return true when the first param is in the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string[]> = () => of(['value', 'value2']);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'in', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param is not in the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string[]> = () => of(['value2', 'value3']);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'in', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('not in', () => {
    it('should return false when the first param is in the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string[]> = () => of(['value', 'value2']);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'not in', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return true when the first param is not in the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string[]> = () => of(['value2', 'value3']);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'not in', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });
  });

  describe('startsWith', () => {
    it('should return true when the first param starts with the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('val');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'startsWith', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param does not start with the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('val2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'startsWith', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('endsWith', () => {
    it('should return true when the first param ends with the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('ue');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'endsWith', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param does not end with the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('ue2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'endsWith', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('includes', () => {
    it('should return true when the first param includes the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('alu');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'includes', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param does not include the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('alu2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'includes', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('match', () => {
    it('should return true when the first param matches the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('val');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param does not match the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('val2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return true when the first param matches the second regex', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, RegExp> = () => of(/val/);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param does not match the second regex', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, RegExp> = () => of(/val2/);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('not match', () => {
    it('should return false when the first param matches the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('val');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'not match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return true when the first param does not match the second', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, string> = () => of('val2');
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'not match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('should return false when the first param matches the second regex', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, RegExp> = () => of(/val/);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'not match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should return true when the first param does not match the second regex', (done) => {
      const arg1: DynOperation<unknown, unknown, string> = () => of('value');
      const arg2: DynOperation<unknown, unknown, RegExp> = () => of(/val2/);
      const operation: DynOperation<unknown, unknown, boolean> = compare(arg1, 'not match', arg2);
      operation({} as DynContext<unknown, unknown>).subscribe((value) => {
        expect(value).toBeTrue();
        done();
      });
    });
  });
});
