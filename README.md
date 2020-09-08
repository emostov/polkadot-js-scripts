Install deps:

```
yarn
```

``` Dump logs from starting from a block until failure
NODE_ENV=test yarn start get-blocks-from --block-number 3860498 --rpc-provider ws_url > out.log
```

``` Dump logs from a single block
NODE_ENV=test yarn start get-block --block-number 3942728 --rpc-provider {ws_url} > out.log
```

``` Load test with log dump
NODE_ENV=test yarn start get-blocks-from --block-number 1 --connections 100 --rpc-provider ws://127.0.0.1:9944 > test4.log
```