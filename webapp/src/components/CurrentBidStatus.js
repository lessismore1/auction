import React from 'react'

import * as addressStateUtils from '../lib/addressStateUtils'
import * as parcelUtils from '../lib/parcelUtils'

export default function CurrentBidStatus({ addressState, parcel }) {
  const isOwner = addressState.address === parcel.address
  const isError = parcel.error
  const hasBid = addressStateUtils.hasBidInParcel(addressState, parcel)
  const hasEnded = parcelUtils.hasEnded(parcel)
  const isTaken = parcelUtils.isTaken(parcel)

  const status = parcelUtils.getBidStatus(parcel, addressState.address)

  const text = []

  if (isError) text.push("We couldn't fetch the parcel, please try again")
  if (isTaken) text.push('The parcel is taken by a road or project')
  if (isOwner) text.push("that's you")
  if (hasBid) {
    text.push(`${hasEnded ? 'you' : "you're"} ${status.toLowerCase()}`)
  }

  return (
    <small className="current-bid-status">
      {text.length > 0 && `(${text.join(', ')})`}
    </small>
  )
}