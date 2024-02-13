import { Observable } from 'rxjs';
import { DynFormContext } from '../forms/dynform-context.model';

export type DynOperation<TContextValue, TContextData, TOperationValue> = (context: DynFormContext<TContextValue, TContextData>) => Observable<TOperationValue>;

export type DynOperable<TContextValue, TContextData, TOperationValue> = {
  [key in keyof TOperationValue]: DynOperation<TContextValue, TContextData, TOperationValue[key] | undefined>
};
