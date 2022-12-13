# CF WASM Issues Repro

This repo is a minimal repro of an issue with the Cloudflare Workers WASM runtime.

## Install Dependancies

```yarn```

## Test With Wrangler Dev

```wrangler dev --port=4031```

```
curl --location --request POST 'localhost:4031/' --header 'Authorization: <sdkKey>'
```

<img width="1511" alt="image" src="https://user-images.githubusercontent.com/1219069/207383556-c2e93cd2-3666-47f3-9521-b81d55749f1b.png">

Example of calling our WASM bucketing code within wrangler dev taking ~100ms. We are testing with a larger project config of ~22kb, so potentially loading that larger string into WASM is the source of the slow down.

## Test With Wrangler Local

```wrangler dev --port=4031  --experimental-local```

```
curl --location --request POST 'localhost:4031/' --header 'Authorization: <sdkKey>'
```

<img width="879" alt="image" src="https://user-images.githubusercontent.com/1219069/207386851-4b041bd5-2317-48ef-b402-5b6fa535a7e2.png">

Example of calling our WASM Bucketing code using workerD locally taking ~28ms (on M1 Pro machine). This is also slower then we would expect when comparing against our local bucketing NodeJS SDK running the same WASM bucketing code ~10ms.
