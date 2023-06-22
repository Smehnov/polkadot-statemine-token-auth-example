// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { signatureVerify } from '@polkadot/util-crypto';
import jwt from 'jsonwebtoken'

export default function handler(req, res) {

  const {address, signature, expires_at} = req.body
  const message = `token-auth-example ${expires_at}`
  if (expires_at<(new Date()).getTime()){
    res.status(401).json({ error: 'expired' })
  }
  const { isValid } = signatureVerify(message, signature, address);
  console.log(isValid)
  if (!isValid){
    res.status(401).json({ error: 'wrong signature' })
  }
  const token = jwt.sign({address: address}, process.env.SECRET)
  res.status(200).json({ token: token })
}
