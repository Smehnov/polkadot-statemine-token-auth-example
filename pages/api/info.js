// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


import { ApiPromise, WsProvider } from '@polkadot/api';
const wsProvider = new WsProvider('wss://rpc.polkadot.io');
const api = await ApiPromise.create({ provider: wsProvider });

export default function handler(req, res) {
  res.status(200).json({ rpc: `${process.env.RPC_PROVIDER}`, token: `${process.env.TOKEN_ID}` })
}
