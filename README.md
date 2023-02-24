# cBridge-v2-web

[![Sync cBridge Gateway](https://github.com/celer-network/cBridge-v2-web/actions/workflows/sync_cbridge_gateway.yml/badge.svg)](https://github.com/celer-network/cBridge-v2-web/actions/workflows/sync_cbridge_gateway.yml)
[![Sync Sgn Contracts](https://github.com/celer-network/cBridge-v2-web/actions/workflows/sync_sgn_contracts.yml/badge.svg)](https://github.com/celer-network/cBridge-v2-web/actions/workflows/sync_sgn_contracts.yml)
[![Sync Incentive Events Contracts](https://github.com/celer-network/cBridge-v2-web/actions/workflows/sync_incentive_events_contracts.yml/badge.svg)](https://github.com/celer-network/cBridge-v2-web/actions/workflows/sync_incentive_events_contracts.yml)

## localhost set up

use test env

`cp .env.test .env`

install dependencies

`yarn install`

start the local server, default to localhost:3000

`yarn start`

## Typescript of gRPC-Web

https://github.com/grpc/grpc-web

- genetate Typescript clients and messages.
- Supports both one way and server side streaming gRPC calls.

### Compile gateway protobuf

- On GitHub.com, navigate to the main page of the repository.

- Under your repository name, click **Actions**.

- In the left sidebar, click the **Sync cBridge Gateway** workflow to run.

- Above the list of workflow runs, select **Run workflow**.

- Use the **Branch** dropdown to select the workflow's branch, and type the branch name of `sgn-v2-gateway` in **Sgn Gateway Branch**. Click **Run workflow**.

- Sync your local repository after the workflow finished.

### Compile Contracts

- On GitHub.com, navigate to the main page of the repository.

- Under your repository name, click **Actions**.

- In the left sidebar, click the **Sync Sgn Contracts** workflow to run.

- Above the list of workflow runs, select **Run workflow**.

- Use the **Branch** dropdown to select the workflow's branch, and type the branch name of `sgn-v2-contracts` in **Sgn Contracts Branch**. Click **Run workflow**.

- Sync your local repository after the workflow finished.

![image](https://user-images.githubusercontent.com/6038077/148526470-08fa90ce-2e3c-44e6-b6c7-b849e7eb945b.png)

### <b>rpc calling example</b>

import gateway.pb

`import { WithdrawLiquidityRequest, WithdrawMethodType } from "../../proto/gateway/gateway_pb";`

construct request

```javascript
const req: WithdrawLiquidityRequest = {
  withdraw_req: withdrawReqProto.serializeBinary(),
  sig: bytes,
  estimated_received_amt: total_estimated_received_amt.toString(),
  method_type: WithdrawMethodType.WD_METHOD_TYPE_ALL_IN_ONE,
};
```

```
const client = new WebClient(`${process.env.REACT_APP_GRPC_SERVER_URL}`, null, null)

client.WithdrawLiquidity(req, preFix)
```

## <b>Generate Contract Typescript</b>

1. npm install -g typechain
2. `git clone https://github.com/celer-network/sgn-v2-contracts`, entering the repository root path
3. switch branch to specific feature branch
4. `npx hardhat typechain --show-stack-traces`
5. get contract ts files in sgn-v2-contracts/typechain

## Deploy

env list

| env       | configuration file |
| --------- | ------------------ |
| localhost | `.env`             |
| testnet   | `.env.test`        |
| mainnet   | `.env.mainnet`     |

note during debugging stage , you can change gateway URL in .env manually
`REACT_APP_SERVER_URL=http://192.168.10.219:8081`

netlify

| branch  | access url                         |
| ------- | ---------------------------------- |
| feat/xx | localhost                          |
| develop | https://dev-cbridge-v2.netlify.app |
| prod2   | https://cbridge.celer.network      |

branch commits trigged the ci deploy automatically, the website will be refresh within 1~3 minutes

## Notable issues

1. reset metamask account if localtest restart

once localtest restart, must reset the account before you start new transaction.

https://docs.metamask.io/guide/getting-started.html#basic-considerations

2. how to custom chain on metamask

<img width="250" alt="151642146983_ pic" src="https://user-images.githubusercontent.com/6038077/149471927-d36129d3-a7cb-40e6-8241-0d0e0330bb4f.png">

confirm your chain id is matched with the tcp port

https://github.com/celer-network/sgn-v2/blob/main/test/e2e/manual/docs/fullstack.md#connect-metamask

check your chain PRC URL if your gateway address also changed

## Links

[Frontend Add chain & token specification](https://docs.google.com/document/d/1k2j1c1NYugxjCqnMRLNzwPhIt50MShI63tyCu5FPP80/edit?usp=sharing)

## LogHelper

powerful logger tool for controlling log visibility in different env.

visibility on testnet/prod

Testnet: `console.debug`, `console.log`, `console.info`, `console.warn`, `console.error`.

Prod: `console.log`, `console.warn`, `console.error`.

Note that debug log will be filtered on prod, only important logs or errors can be displayed on prod. <b>Try to use `console.debug` instead of `console.log` as much as possible</b>

## Seo Create

start create

`sh seo_create.sh` or `sh seo_one_create.sh ./set_config/seo_Arbitrum_Polygon/sh`

## Debug Error

```diff
- execution reverted: ERC20: insufficient allowance)
```

Check:

1. Token contract address should be correct.
2. Spender address should be correct.
3. Token allowance should be enough.

```diff
- invalid address or ENS name
```

Check:

1. Contract address should be correct.
2. The address parameters of on-chain transaction should be correct.

```diff
- Metamask error: replacement transaction underpriced
```

Reason:

1. Use the same nonce for different transactions.
2. The account has a pending transaction.
3. Try to send a new transaction with lower gas price to override the pending one.

Solution:

Submit a new transaction with higher nonce number or higher gas price.

```diff
- execution revert error
```

for example, `execution reverted: volume exceeds cap`

Two scenarios:

1. MetaMask - PC Error: Internal JSON-RPC error. The transaction was rejected by Metamask with corresponding error. The transaction will not appear on block-chain.
2. Transaction reverted after the contract execution. Refer error on explorer.

Scenario 1: During Metamask transaction estimation, the error happened with unexpected condition. Double check transaction parameters.

To skip Metamask estimation and submit on-chain transaction, you can set a manul gas limit. Then you can compare the transaction payload with others on explorer.
exmple,

```
bridge.send(
    address,
    selectedToken?.token?.address,
    value,
    BigNumber.from(selectedToChain?.id),
    BigNumber.from(nonce),
    BigNumber.from(res.getMaxSlippage() || 0),
    { gasLimit: 500000 } // set a manul gas limit value
)
```

2. Check contract code to find root cause of on-chain transaction failure/revertion.

```diff
- ERC20: transfer amount exceeds balance
```

The sender doesn't have enough balance to send. Decrease input amount and try again.

<b>Common Error(Celer)</b>

```diff
- execution reverted: Mismatch current signers
```

Submit a transaction with outdated sgn information such as signers, powers and etc. Get the latest information from corresponding APIs and submit again.
