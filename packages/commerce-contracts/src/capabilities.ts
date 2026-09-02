export interface StoreCapabilities {
  hasColorSwatches: boolean
  hasInstantSearch: boolean
  hasSizeGuideModal: boolean
  hasDemoAdmin: boolean
  hasDemoReset: boolean
  hasSimulatedPayment: boolean
  hasLiveStripe: boolean
  hasCustomerAddresses: boolean
  hasOrderTracking: boolean
  hasShareButton?: boolean
  hasPromotions?: boolean
}

export const DEFAULT_MEDUSA_CAPABILITIES: StoreCapabilities = {
  hasColorSwatches: false,
  hasInstantSearch: false,
  hasSizeGuideModal: true,
  hasDemoAdmin: false,
  hasDemoReset: false,
  hasSimulatedPayment: false,
  hasLiveStripe: true,
  hasCustomerAddresses: true,
  hasOrderTracking: false,
  hasShareButton: false,
  hasPromotions: true,
}

export const DEFAULT_DEMO_CAPABILITIES: StoreCapabilities = {
  hasColorSwatches: true,
  hasInstantSearch: true,
  hasSizeGuideModal: true,
  hasDemoAdmin: true,
  hasDemoReset: true,
  hasSimulatedPayment: true,
  hasLiveStripe: false,
  hasCustomerAddresses: true,
  hasOrderTracking: true,
  hasShareButton: true,
  hasPromotions: true,
}
