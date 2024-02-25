import { firstValueFrom, of } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';
import { chain, transform } from './transform.operator';

describe('The transform operator', () => {
  it('should transform the value using the map function', async () => {
    const operation: DynOperation<any, any, string> = transform(
      () => of('benoit'),
      (value) => value.toUpperCase()
    );
    const context: DynContext<any, any> = {} as DynContext<any, any>;
    const result = await firstValueFrom(operation(context));
    expect(result).toBe('BENOIT');
  });

  it('should transform the value using the chain function', async () => {
    const operation: DynOperation<any, any, string> = chain(
      () => of('benoit'),
      (value) => () => of(value.toUpperCase())
    );
    const context: DynContext<any, any> = {} as DynContext<any, any>;
    const result = await firstValueFrom(operation(context));
    expect(result).toBe('BENOIT');
  });
});
