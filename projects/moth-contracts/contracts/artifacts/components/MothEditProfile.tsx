/* eslint-disable no-console */
import { ReactNode, useState } from 'react'
import { Moth, MothClient } from '../contracts/MothClient'
import { useWallet } from '@txnlab/use-wallet'

/* Example usage
<MothEditProfile
  buttonClass="btn m-2"
  buttonLoadingNode={<span className="loading loading-spinner" />}
  buttonNode="Call EditProfile"
  typedClient={typedClient}
  title={title}
  logo={logo}
  description={description}
  url={url}
  loyaltyEnabled={loyaltyEnabled}
  loyaltyPercentage={loyaltyPercentage}
/>
*/
type MothEditProfileArgs = Moth['methods']['EditProfile(string,string,string,string,bool,uint64)(string,string,string,string,bool,uint64)']['argsObj']

type Props = {
  buttonClass: string
  buttonLoadingNode?: ReactNode
  buttonNode: ReactNode
  typedClient: MothClient
  title: MothEditProfileArgs['title']
  logo: MothEditProfileArgs['logo']
  description: MothEditProfileArgs['description']
  url: MothEditProfileArgs['url']
  loyaltyEnabled: MothEditProfileArgs['loyaltyEnabled']
  loyaltyPercentage: MothEditProfileArgs['loyaltyPercentage']
}

const MothEditProfile = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeAddress, signer } = useWallet()
  const sender = { signer, addr: activeAddress! }

  const callMethod = async () => {
    setLoading(true)
    console.log(`Calling EditProfile`)
    await props.typedClient.EditProfile(
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

export default MothEditProfile