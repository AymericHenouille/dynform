import { InjectionToken } from '@angular/core';
import { FieldDynForm } from '../forms/dynforms/field.dynform';
import { GroupDynForm } from '../forms/dynforms/group.dynform';
import { DynContext } from '../models/dyncontext.model';

/**
 * Injection token for the context of a dynform.
 */
export const DYNFORM_CONTEXT: InjectionToken<DynContext<any, any>> = new InjectionToken<DynContext<any, any>>('DYNFORM_CONTEXT');

/**
 * Read the name of the context.
 * @param context The context to read the name from.
 * @returns The name of the context.
 */
export function readContextName<TValue, TData>(context: DynContext<TValue, TData>): string | number | Symbol {
  if (context.parent) {
    const { dynForm } = context.parent;
    if (dynForm instanceof GroupDynForm) {
      const name: string | number | Symbol | undefined = dynForm.keys().find((key) => dynForm.get(key) === context.dynForm);
      return name ?? context.name;
    }
  }
  return context.name;
}

export function readContextFormByName<TValue, TData>(context: DynContext<TValue, TData>, name: string | number | Symbol): FieldDynForm<TValue, TData> {
  if (context.parent) {
    const { dynForm } = context.parent;
    if (dynForm instanceof GroupDynForm) {
      return dynForm.get(name as string) as FieldDynForm<TValue, TData>;
    }
  }
  throw new Error(`The context with the name ${name} does not exist.`);
}
