# versatus-javascript

### getting started
install dependencies

```npm install```

compile wasm

```javy compile example-contract.js -o index.wasm```

### contract input
```json
{
  "version": 1,
  "accountInfo": {
    "accountAddress": "contract_wallet_id",
    "accountBalance": 65535
  },
  "protocolInput": {
    "version": 1,
    "blockHeight": 31415972,
    "blockTime": 1694152781
  },
  "applicationInput": {
    "contractFn": "splitEvenly",
    "amount": 100,
    "recipients": [
      "wallet_id_1",
      "wallet_id_2",
      "wallet_id_3"
    ]
  }
}

```
