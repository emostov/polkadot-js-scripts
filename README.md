Install deps:

```
yarn
```

``` Dump logs from starting from a block until failure
NODE_ENV=test yarn start get-blocks-from --block-number 3860498 --rpc-provider ws_url > out.log
```

``` Dump logs from a single block
NODE_ENV=test yarn start get-block --block-number 3942728 --rpc-provider {ws_url} > binance.log
```

``` Load test 
NODE_ENV=test yarn start get-blocks-from-pressure --block-number 3860498 --pressure 5000 > out.log
```