import Image from 'next/image'
import {Inter} from 'next/font/google'
import {useEffect, useState} from "react";
import dynamic from 'next/dynamic'

const Wallet = dynamic(() => import('@/components/Wallet'), {
    ssr: false,
})

export default function Home() {
    const [serverInfo, setServerInfo] = useState({})
    const [protectedInfo, setProtectedInfo] = useState('')
    const [token, setToken] = useState('')


    useEffect(() => {
        fetch('/api/info').then(async res => {
            const info = await res.json()
            console.log(info)
            setServerInfo(info)
        })
    }, [])

    const getProtectedInfo = async () => {
        const res = await fetch('/api/protected', {
            headers: {authorization: token},
        })
        const answer = (await res.json())['result']
        console.log(answer)
        setProtectedInfo(answer)

    }

    useEffect(()=>{
        getProtectedInfo()
    }, [token])


    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24`}
        >
            <div>
                <h1>Polkdot auth demo</h1>
                <div>
                    <ul>
                        <li>
                            RPC NODE :{serverInfo.rpc}
                        </li>
                        <li>
                            TOKEN_ID :{serverInfo.token}
                        </li>
                    </ul>
                </div>
                <div>
                    {serverInfo.rpc && <Wallet onTokenChange={(token)=>{setToken(token)}} serverInfo={serverInfo}/>}
                </div>
                <div>
                    <p>protected: {protectedInfo}</p>
                </div>


            </div>
        </main>
    )
}
