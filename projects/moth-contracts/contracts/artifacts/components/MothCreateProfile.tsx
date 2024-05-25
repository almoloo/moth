/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothCreateProfile
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call CreateProfile"
  typedClient={typedClient}
  boxMBRPayment={boxMBRPayment}
  title={title}
  logo={logo}
  description={description}
  url={url}
  loyaltyEnabled={loyaltyEnabled}
  loyaltyPercentage={loyaltyPercentage}
/>
*/
type MothCreateProfileArgs = Moth['methods']['CreateProfile(pay,string,string,string,string,bool,uint64)(string,string,string,string,bool,uint64)']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
  boxMBRPayment: MothCreateProfileArgs['boxMBRPayment']
  title: MothCreateProfileArgs['title']
  logo: MothCreateProfileArgs['logo']
  description: MothCreateProfileArgs['description']
  url: MothCreateProfileArgs['url']
  loyaltyEnabled: MothCreateProfileArgs['loyaltyEnabled']
  loyaltyPercentage: MothCreateProfileArgs['loyaltyPercentage']
}

const MothCreateProfile = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling CreateProfile`)
    await props.typedClient.CreateProfile(
      {
        boxMBRPayment: props.boxMBRPayment,
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

export default MothCreateProfile