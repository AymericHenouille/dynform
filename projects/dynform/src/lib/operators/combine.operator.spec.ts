import { of } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';
import { combine } from './combine.operator';

describe('The combine operator', () => {
  it('should combine the operations', (done) => {
    const operation: DynOperation<any, any, string> = combine(
      () => of('benoit'),
      [() => of('bankaert'), () => of('I love you')],
    );
    const context: DynContext<any, any> = {} as DynContext<any, any>;
    const operation$ = operation(context);
    let index: number = 0;
    operation$.subscribe((result) => {
      switch (index++) {
        case 0: expect(result).toBe('benoit'); break;
        case 1: expect(result).toBe('bankaert'); break;
        case 2: expect(result).toBe('I love you'); done(); break;
      }
    });
  });
});
