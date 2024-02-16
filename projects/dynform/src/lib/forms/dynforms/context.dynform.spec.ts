import { of } from 'rxjs';
import { DynContext } from '../../models/dyncontext.model';
import { DynOperation } from '../../models/dynoperation.model';
import { ContextDynForm } from './context.dynform';

describe('The Context DynForm', () => {
  let contextDynForm: ContextDynForm<{}, {}>;
  beforeEach(() => contextDynForm = new ContextDynForm<{}, {}>());

  it('should be created', () => expect(contextDynForm).toBeTruthy());

  it('should set the context', (done) => {
    const context: DynContext<{}, {}> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
    contextDynForm.setContext(context);
    contextDynForm.context$.subscribe((c) => {
      expect(c).toBe(context);
      done();
    });
  });

  it('should operate on the context', (done) => {
    const context: DynContext<{}, {}> = jasmine.createSpyObj('DynContext', ['name', 'dynForm', 'parent']);
    contextDynForm.setContext(context);

    const operation: DynOperation<{}, {}, string> = () => of('Benoit');
    contextDynForm['operate'](operation).subscribe((result) => {
      expect(result).toBe('Benoit');
      done();
    });
  });
});
