import { Multicall2 } from "../../typechain/Multicall2"

export function toCallKey(call: Multicall2.CallStruct): string {
  let key = `${call.target}-${call.callData}`
  return key
}

export function parseCallKey(callKey: string):  Multicall2.CallStruct {
  const pcs = callKey.split('-')
  if (![2, 3].includes(pcs.length)) {
    throw new Error(`Invalid call key: ${callKey}`)
  }
  return {
    target: pcs[0],
    callData: pcs[1],
    ...(pcs[2] ? { gasRequired: Number.parseInt(pcs[2]) } : {}),
  }
}

export function callsToCallKeys(calls?: Array< Multicall2.CallStruct | undefined>) {
  return (
    calls
      ?.filter((c): c is  Multicall2.CallStruct => Boolean(c))
      ?.map(toCallKey)
      ?.sort() ?? []
  )
}

export function callKeysToCalls(callKeys: string[]) {
  if (!callKeys?.length) return null
  return callKeys.map((key) => parseCallKey(key))
}
