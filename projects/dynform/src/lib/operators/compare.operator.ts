import { combineLatest, map } from 'rxjs';
import { DynContext } from '../models/dyncontext.model';
import { DynOperation } from '../models/dynoperation.model';

type LogicalOperator = '==' | '===' | '!=' | '!==' | '<' | '<=' | '>' | '>=';
type ArrayOperator = 'in' | 'not in';
type StringOperator = 'startsWith' | 'endsWith' | 'includes' | 'match' | 'not match';

/**
 * The operator to use for comparison.
 * - `==` - Equal to
 * - `===` - Strict equal to
 * - `!=` - Not equal to
 * - `!==` - Strict not equal to
 * - `<` - Less than
 * - `<=` - Less than or equal to
 * - `>` - Greater than
 * - `>=` - Greater than or equal to
 * - `in` - In array
 * - `not in` - Not in array
 * - `startsWith` - Starts with string
 * - `endsWith` - Ends with string
 * - `includes` - Includes string
 * - `match` - Matches regular expression
 * - `not match` - Does not match regular expression
 */
export type Operator = LogicalOperator | ArrayOperator | StringOperator;

type Arg1Type<TOperator extends Operator> = TOperator extends StringOperator
  ? string
  : any;

type Arg2Type<TOperator extends Operator> = TOperator extends ArrayOperator
  ? any[]
  : TOperator extends StringOperator
    ? TOperator extends 'startsWith' | 'endsWith' | 'includes'
      ? string
      : TOperator extends 'match' | 'not match'
        ? string | RegExp
        : any
    : any;

/**
 * The compare operator compares two values and returns a boolean.
 *
 * @param arg1 The first value to compare.
 * @param operate The operator to use for comparison.
 * @param arg2 The second value to compare.
 * @returns A boolean indicating the result of the comparison.
 */
export function compare<
  TValue,
  TData,
  TOperation extends Operator,
  TArg1 extends Arg1Type<TOperation>,
  TArg2 extends Arg2Type<TOperation>,
>(
  arg1: DynOperation<TValue, TData, TArg1>,
  operate: TOperation,
  arg2: DynOperation<TValue, TData, TArg2>
): DynOperation<TValue, TData, boolean> {
  return (context: DynContext<TValue, TData>) => combineLatest([arg1(context), arg2(context)]).pipe(
    map(([value1, value2]) => {
      switch (operate) {
        case '==': return (value1 as any) == value2;
        case '===': return (value1 as any) === value2;
        case '!=': return (value1 as any) != value2;
        case '!==': return (value1 as any) !== value2;
        case '<': return value1 < value2;
        case '<=': return value1 <= value2;
        case '>': return value1 > value2;
        case '>=': return value1 >= value2;
        case 'in': return (value2 as any[]).includes(value1);
        case 'not in': return !(value2 as any[]).includes(value1);
        case 'startsWith': return (value1 as string).startsWith(value2 as string);
        case 'endsWith': return (value1 as string).endsWith(value2 as string);
        case 'includes': return (value1 as string).includes(value2 as string);
        case 'match': return new RegExp(value2 as string).test(value1 as string);
        case 'not match': return !new RegExp(value2 as string).test(value1 as string);
      }
      throw new Error(`Unknown operator: ${operate}`);
    }),
  );
}
