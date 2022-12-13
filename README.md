# CF WASM Issues Repro

This repo is a minimal repro of an issue with the Cloudflare Workers WASM runtime.

## Install Dependancies

```yarn```

## Test With Wrangler Dev

```wrangler dev --port=4031```

```
curl --location --request POST 'localhost:4031/' --header 'Authorization: <sdkKey>'
```

## Test With Wrangler Local

```wrangler dev --port=4031  --experimental-local```

```
curl --location --request POST 'localhost:4031/' --header 'Authorization: <sdkKey>'
```
