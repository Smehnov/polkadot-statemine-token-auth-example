## Polkadot Statemine(Assets hub) token auth example
  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Smehnov/polkadot-statemine-token-auth-example&env=RPC_PROVIDER,TOKEN_ID,SECRET)

You can set env variables in .env file

```bash
RPC_PROVIDER="wss://kusama-asset-hub-rpc.polkadot.io"
TOKEN_ID="1441" # TokenId for checking users balance
SECRET="ABCDE" # Secret for making JWT tokens

```


Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
