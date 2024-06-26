/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothGetMBR
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call GetMBR"
  typedClient={typedClient}
  title={title}
  logo={logo}
  description={description}
  url={url}
  loyaltyEnabled={loyaltyEnabled}
  loyaltyPercentage={loyaltyPercentage}
/>
*/
type MothGetMBRArgs = Moth['methods']['GetMBR(string,string,string,string,bool,uint64)uint64']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
  title: MothGetMBRArgs['title']
  logo: MothGetMBRArgs['logo']
  description: MothGetMBRArgs['description']
  url: MothGetMBRArgs['url']
  loyaltyEnabled: MothGetMBRArgs['loyaltyEnabled']
  loyaltyPercentage: MothGetMBRArgs['loyaltyPercentage']
}

const MothGetMBR = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling GetMBR`)
    await props.typedClient.GetMBR(
      {
        title: props.title,
        logo: props.logo,
        description: props.description,
        url: props.url,
        loyaltyEnabled: props.loyaltyEnabled,
        loyaltyPercentage: props.loyaltyPercentage,
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

export default MothGetMBR