/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothGatewaySpendToken
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call GatewaySpendToken"
  typedClient={typedClient}
  payment={payment}
  toAddress={toAddress}
  totalAmount={totalAmount}
  tokenToSpend={tokenToSpend}
/>
*/
type MothGatewaySpendTokenArgs = Moth['methods']['GatewaySpendToken(pay,address,uint64,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
  payment: MothGatewaySpendTokenArgs['payment']
  toAddress: MothGatewaySpendTokenArgs['toAddress']
  totalAmount: MothGatewaySpendTokenArgs['totalAmount']
  tokenToSpend: MothGatewaySpendTokenArgs['tokenToSpend']
}

const MothGatewaySpendToken = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling GatewaySpendToken`)
    await props.typedClient.GatewaySpendToken(
      {
        payment: props.payment,
        toAddress: props.toAddress,
        totalAmount: props.totalAmount,
        tokenToSpend: props.tokenToSpend,
      },
      { sender },
    )
    setLoading(false)
  }

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  )
}

export default MothGatewaySpendToken