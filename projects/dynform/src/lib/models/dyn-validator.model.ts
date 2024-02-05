import { DynOperation } from './dyn-operation.model';

export interface DynValidatorError {
  message: string;
}

export type DynValidator<TContextValue, TContextData> = DynOperation<TContextValue, TContextData, DynValidatorError | undefined>
