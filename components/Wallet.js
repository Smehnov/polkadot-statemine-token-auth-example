import {web3Accounts, web3Enable, web3FromAddress, web3FromSource} from '@polkadot/extension-dapp';
import {stringToHex} from "@polkadot/util";

import {useEffect, useState} from "react";
import {ApiPromise, WsProvider} from '@polkadot/api';


export default function Wallet({serverInfo, onTokenChange}) {
    const wsProvider = new WsProvider(serverInfo.rpc);

    const [accountsList, setAccountsList] = useState([])
    const [chosenAccount, setChosenAccount] = useState('')
    const [chosenAccountData, setChosenAccountData] = useState({})
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        accountsList.forEach(account => {
            if (account.address == chosenAccount) {
                setChosenAccountData(account)
            }
        })
    }, [accountsList, chosenAccount])

    const getBalance = async (account) => {
        console.log('Getting balance')
        const api = await ApiPromise.create({provider: wsProvider});
        await api.isReady
        console.log(api)
        console.log(account)

        const data = await api.query.assets.account(serverInfo.token, account)
        let balance = 0
        if (data.value.balance) {
            balance = data.value.balance.words[0]
        }
        setBalance(balance)

    }

    const chooseAccount = async (address) => {
        console.log(`choose account ${address}`)
        setChosenAccount(address)
        await getBalance(address)
    }

    const loadAccounts = async () => {
        const allInjected = await web3Enable('token-auth-example');

        const allAccounts = await web3Accounts();
        console.log(allAccounts)
        setAccountsList(allAccounts)
        if (allAccounts.length >= 0) {
            await chooseAccount(allAccounts[0].address)

        }
    }

    const signAuthMessage = async () => {
        const injector = await web3FromSource(chosenAccountData.meta.source);
        const signRaw = injector?.signer?.signRaw;
        let date = new Date();
        date.setDate(date.getDate() + 1);
        const expiresAt = date.getTime()
        if (!!signRaw) {
            // after making sure that signRaw is defined
            // we can use it to sign our message
            const {signature} = await signRaw({
                address: chosenAccount,
                data: stringToHex(`token-auth-example ${expiresAt}`),
                type: 'bytes'
            });
            console.log(signature)
            const rawResponse = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: chosenAccount,
                    expires_at: expiresAt,
                    signature: signature
                })
            });
            const content = await rawResponse.json();
            onTokenChange(content.token)

        }
    }

    useEffect(() => {
        loadAccounts().then(() => {
            console.log('Accounts loaded')

        })
    }, [])
    return <div>
        <div>
            <label htmlFor="accounts" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose
                account</label>
            <select id="accounts"
                    onChange={async (event) => {
                        console.log(event.target.value)
                        await chooseAccount(event.target.value)
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {accountsList.map(account => {
                    return <option key={account.address}
                                   value={account.address}>{account.meta.name} ({account.address})</option>
                })}

            </select>
            Balance: {balance}

        </div>
        <div>
            <button type="button"
                    onClick={async () => {
                        await signAuthMessage()
                    }
                    }
                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900">
                Auth
            </button>

        </div>
    </div>
}