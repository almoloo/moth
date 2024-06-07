/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothCheckOptedIn
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call CheckOptedIn"
  typedClient={typedClient}
/>
*/
type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
}

const MothCheckOptedIn = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling CheckOptedIn`)
    await props.typedClient.CheckOptedIn(
      {},
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

export default MothCheckOptedIn