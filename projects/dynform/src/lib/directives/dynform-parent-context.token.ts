import { InjectionToken } from '@angular/core';
import { DynContext } from '../models/dyncontext.model';

/**
 * Injection token for the parent context of a dynform.
 */
export const DYNFORM_PARENT_CONTEXT: InjectionToken<DynContext<any, any>> = new InjectionToken<DynContext<any, any>>('DYNFORM_PARENT_CONTEXT');
