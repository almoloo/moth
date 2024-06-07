/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothOptIn
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call OptIn"
  typedClient={typedClient}
  optInTxn={optInTxn}
/>
*/
type MothOptInArgs = Moth['methods']['OptIn(axfer)bool']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
  optInTxn: MothOptInArgs['optInTxn']
}

const MothOptIn = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling OptIn`)
    await props.typedClient.OptIn(
      {
        optInTxn: props.optInTxn,
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

export default MothOptIn