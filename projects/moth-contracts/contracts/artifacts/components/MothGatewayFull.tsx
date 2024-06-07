/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothGatewayFull
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call GatewayFull"
  typedClient={typedClient}
  payment={payment}
  toAddress={toAddress}
  amount={amount}
/>
*/
type MothGatewayFullArgs = Moth['methods']['GatewayFull(pay,address,uint64)void']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
  payment: MothGatewayFullArgs['payment']
  toAddress: MothGatewayFullArgs['toAddress']
  amount: MothGatewayFullArgs['amount']
}

const MothGatewayFull = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling GatewayFull`)
    await props.typedClient.GatewayFull(
      {
        payment: props.payment,
        toAddress: props.toAddress,
        amount: props.amount,
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

export default MothGatewayFull