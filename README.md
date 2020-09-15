Install deps:

```
yarn
```

``` Dump logs starting from a block until failure
NODE_ENV=test yarn start get-blocks-from --block-number 3860498 --rpc-provider ws_url > out.log
```

``` Dump logs from a single block
NODE_ENV=test yarn start get-block --block-number 3942728 --rpc-provider ws://127.0.0.1:9944


```

``` Dump logs with a load test, starting from a block until failure
NODE_ENV=test yarn start get-blocks-from --block-number 1 --connections 4 --rpc-provider ws://127.0.0.1:9944 > test5.log
```