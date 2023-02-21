/* eslint-disable */

import { Token } from "../proto/chainhop/common_pb";

/** Sorts currency amounts (descending). */
function balanceComparator(a?: number, b?: number) {
  if (a && b) {
    return a > b ? -1 : a === b ? 0 : 1;
  } else if (a && a > 0) {
    return -1;
  } else if (b && b > 0) {
    return 1;
  }
  return 0;
}

type TokenBalances = { [tokenAddress: string]: number | undefined };

/** Sorts tokens by currency amount (descending), then symbol (ascending). */
export function tokenComparator(
  balances: TokenBalances,
  a: Token.AsObject,
  b: Token.AsObject
) {
  // Sorts by balances
  const balanceComparison = balanceComparator(
    balances[a.address],
    balances[b.address]
  );
  if (balanceComparison !== 0) return balanceComparison;

  // Sorts by symbol
  if (a.symbol && b.symbol) {
    return a.symbol.toLowerCase() < b.symbol.toLowerCase() ? -1 : 1;
  }

  return -1;
}
