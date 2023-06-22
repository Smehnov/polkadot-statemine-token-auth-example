// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


import {ApiPromise, WsProvider} from '@polkadot/api';

const wsProvider = new WsProvider(process.env.RPC_PROVIDER);
const api = await ApiPromise.create({provider: wsProvider});
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
    console.log(req.headers)
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({result: `not authed`})
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    const address = decoded.address

    await api.isReady

    const data = await api.query.assets.account(process.env.TOKEN_ID, address)
    let balance = 0
    if (data.value.balance) {
        balance = data.value.balance.words[0]
    }
    if(balance>0){
        res.status(200).json({result: `SUPER SECRET DATA :)`})
    }else{
        res.status(200).json({result: `NO TOKENS :(`})
    }



}
