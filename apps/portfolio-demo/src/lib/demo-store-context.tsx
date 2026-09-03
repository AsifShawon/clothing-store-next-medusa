"use client"

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import {
  DemoStoreState,
  DemoProduct,
  DemoProductVariant,
  DemoCategory,
  DemoCollection,
  DemoCartItem,
  DemoPromotion,
  DemoOrder,
  DemoOrderStatus,
  DemoPaymentStatus,
  DemoFulfillmentStatus,
  DemoCustomer,
  DemoShippingOption,
  DemoAddress,
  DemoInventoryEvent,
  DemoActivityEvent,
  DemoSettings,
} from "./types"
import { demoStorage } from "./storage-repository"
import { generateId, generateDisplayOrderId } from "./id"
import { createInitialSeedState } from "./seed-catalog"

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info"
}

interface DemoStoreContextType {
  isHydrated: boolean
  state: DemoStoreState
  updateStore: (transaction: (currentState: DemoStoreState) => DemoStoreState) => DemoStoreState
  resetStore: () => void
  exportStore: () => string
  importStore: (json: string) => { success: boolean; error?: string }
  isCartDrawerOpen: boolean
  setIsCartDrawerOpen: (open: boolean) => void
  toasts: ToastMessage[]
  showToast: (title: string, description?: string, type?: "success" | "error" | "info") => void
  removeToast: (id: string) => void
}

const DemoStoreContext = createContext<DemoStoreContextType | undefined>(undefined)

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoStoreState>(createInitialSeedState)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Hydrate on mount from storage repository
  useEffect(() => {
    const initial = demoStorage.initializeState()
    setState(initial)
    setIsHydrated(true)

    const unsubscribe = demoStorage.subscribe((newState) => {
      setState(newState)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const showToast = useCallback((title: string, description?: string, type: "success" | "error" | "info" = "success") => {
    const id = generateId("toast")
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateStore = useCallback((transaction: (currentState: DemoStoreState) => DemoStoreState) => {
    return demoStorage.updateState(transaction)
  }, [])

  const resetStore = useCallback(() => {
    const fresh = demoStorage.resetState()
    showToast("Demo Store Reset", "Restored authentic London Boy seed catalog, orders, and regional settings.", "info")
    return fresh
  }, [showToast])

  const exportStore = useCallback(() => {
    return demoStorage.exportState()
  }, [])

  const importStore = useCallback((json: string) => {
    const res = demoStorage.importState(json)
    if (res.success) {
      showToast("Store Imported", "Successfully loaded custom demo store state.", "success")
    } else {
      showToast("Import Failed", res.error, "error")
    }
    return res
  }, [showToast])

  return (
    <DemoStoreContext.Provider
      value={{
        isHydrated,
        state,
        updateStore,
        resetStore,
        exportStore,
        importStore,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </DemoStoreContext.Provider>
  )
}

/**
 * Root store hook
 */
export function useDemoStore() {
  const context = useContext(DemoStoreContext)
  if (!context) {
    throw new Error("useDemoStore must be used within a DemoStoreProvider")
  }
  return context
}

/**
 * Products catalog hook with optional filtering
 */
export function useDemoProducts(filters?: {
  category?: string
  collection?: string
  search?: string
  status?: "published" | "draft" | "all"
}) {
  const { state } = useDemoStore()

  const filteredProducts = useMemo(() => {
    return state.products.filter((p) => {
      if (filters?.status && filters.status !== "all" && p.status !== filters.status) {
        return false
      }
      if (filters?.category && filters.category !== "all") {
        const match = p.categoryNames.some((c) => c.toLowerCase() === filters.category!.toLowerCase())
        if (!match) return false
      }
      if (filters?.collection && filters.collection !== "all") {
        if (p.collectionHandle !== filters.collection) return false
      }
      if (filters?.search && filters.search.trim()) {
        const q = filters.search.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchDesc = p.description.toLowerCase().includes(q)
        const matchTags = p.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchTitle && !matchDesc && !matchTags) return false
      }
      return true
    })
  }, [state.products, filters?.category, filters?.collection, filters?.search, filters?.status])

  return {
    products: filteredProducts,
    allProducts: state.products,
    categories: state.categories,
    collections: state.collections,
  }
}

/**
 * Single product hook lookup
 */
export function useDemoProduct(handleOrId?: string | null) {
  const { state } = useDemoStore()

  const product = useMemo(() => {
    if (!handleOrId) return state.products[0] || null
    return (
      state.products.find((p) => p.handle === handleOrId || p.id === handleOrId) || null
    )
  }, [state.products, handleOrId])

  return {
    product,
  }
}

/**
 * Cart management hook with automatic quantity merging and bounds checking
 */
export function useDemoCart() {
  const { state, updateStore, setIsCartDrawerOpen, showToast } = useDemoStore()

  const appliedPromo = useMemo(() => {
    if (!state.cart.appliedPromotionCode) return undefined
    return state.promotions.find(
      (p) => p.code.toUpperCase() === state.cart.appliedPromotionCode?.toUpperCase() && p.isActive
    )
  }, [state.cart.appliedPromotionCode, state.promotions])

  const subtotal = useMemo(() => {
    return state.cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  }, [state.cart.items])

  const itemsCount = useMemo(() => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [state.cart.items])

  const discount = useMemo(() => {
    if (!appliedPromo) return 0
    if (appliedPromo.minOrderAmount && subtotal < appliedPromo.minOrderAmount) return 0
    if (appliedPromo.type === "percentage") {
      return (subtotal * appliedPromo.value) / 100
    }
    return Math.min(appliedPromo.value, subtotal)
  }, [appliedPromo, subtotal])

  const total = Math.max(0, subtotal - discount)

  const addItem = useCallback(
    (product: DemoProduct, variant: DemoProductVariant, quantity: number = 1) => {
      updateStore((draft) => {
        const existingIdx = draft.cart.items.findIndex((item) => item.variantId === variant.id)
        const maxStock = variant.manageInventory ? variant.inventoryQuantity : 99

        if (maxStock <= 0) {
          showToast("Out of Stock", `${product.title} (${variant.title}) is currently unavailable.`, "error")
          return draft
        }

        if (existingIdx > -1) {
          // Merge line quantities up to available stock
          const currentQty = draft.cart.items[existingIdx].quantity
          const newQty = Math.min(currentQty + quantity, maxStock)
          draft.cart.items[existingIdx].quantity = newQty
          draft.cart.items[existingIdx].maxInventory = maxStock
        } else {
          const newItem: DemoCartItem = {
            id: generateId("cart_item"),
            productId: product.id,
            productTitle: product.title,
            productHandle: product.handle,
            variantId: variant.id,
            variantTitle: variant.title,
            sku: variant.sku,
            options: variant.options,
            unitPrice: variant.price,
            quantity: Math.min(quantity, maxStock),
            thumbnail: product.thumbnail || product.images[0] || "",
            maxInventory: maxStock,
          }
          draft.cart.items.push(newItem)
        }
        draft.cart.updatedAt = new Date().toISOString()
        return draft
      })

      showToast("Added to bag", `${product.title} (${variant.title})`, "success")
      setIsCartDrawerOpen(true)
    },
    [updateStore, showToast, setIsCartDrawerOpen]
  )

  const updateItemQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      updateStore((draft) => {
        if (quantity <= 0) {
          draft.cart.items = draft.cart.items.filter((i) => i.id !== cartItemId)
        } else {
          draft.cart.items = draft.cart.items.map((item) => {
            if (item.id === cartItemId) {
              const clamped = Math.min(quantity, item.maxInventory || 99)
              return { ...item, quantity: clamped }
            }
            return item
          })
        }
        draft.cart.updatedAt = new Date().toISOString()
        return draft
      })
    },
    [updateStore]
  )

  const removeItem = useCallback(
    (cartItemId: string) => {
      updateStore((draft) => {
        draft.cart.items = draft.cart.items.filter((i) => i.id !== cartItemId)
        draft.cart.updatedAt = new Date().toISOString()
        return draft
      })
      showToast("Removed from bag", undefined, "info")
    },
    [updateStore, showToast]
  )

  const clearCart = useCallback(() => {
    updateStore((draft) => {
      draft.cart.items = []
      draft.cart.appliedPromotionCode = undefined
      draft.cart.updatedAt = new Date().toISOString()
      return draft
    })
  }, [updateStore])

  const applyPromoCode = useCallback(
    (code: string): { success: boolean; message: string } => {
      const trimmed = code.trim().toUpperCase()
      const promo = state.promotions.find((p) => p.code.toUpperCase() === trimmed && p.isActive)

      if (!promo) {
        return { success: false, message: "Invalid or expired promo code" }
      }

      if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
        return {
          success: false,
          message: `Coupon ${promo.code} requires a minimum order of ৳${promo.minOrderAmount}`,
        }
      }

      updateStore((draft) => {
        draft.cart.appliedPromotionCode = promo.code
        draft.cart.updatedAt = new Date().toISOString()
        return draft
      })

      showToast("Coupon Applied", `${promo.code}: ${promo.description}`, "success")
      return { success: true, message: `Promo code ${promo.code} applied successfully!` }
    },
    [state.promotions, subtotal, updateStore, showToast]
  )

  const removePromoCode = useCallback(() => {
    updateStore((draft) => {
      draft.cart.appliedPromotionCode = undefined
      draft.cart.updatedAt = new Date().toISOString()
      return draft
    })
    showToast("Promo code removed", undefined, "info")
  }, [updateStore, showToast])

  return {
    items: state.cart.items,
    appliedPromo,
    subtotal,
    discount,
    total,
    itemsCount,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
  }
}

/**
 * Customer profile hook
 */
export function useDemoCustomer() {
  const { state, updateStore, showToast } = useDemoStore()

  const customer = useMemo(() => {
    return state.customers.find((c) => c.id === state.currentCustomerId) || state.customers[0]
  }, [state.customers, state.currentCustomerId])

  const isLoggedIn = Boolean(state.currentCustomerId && state.currentCustomerId !== "guest")

  const loginAsDemoCustomer = useCallback(() => {
    updateStore((draft) => {
      draft.currentCustomerId = draft.customers[0]?.id || "cust_demo_londonboy"
      return draft
    })
    showToast("Signed In", "Continuing as Demo Customer (Asif Shawon)", "info")
  }, [updateStore, showToast])

  const logoutCustomer = useCallback(() => {
    updateStore((draft) => {
      draft.currentCustomerId = "guest"
      return draft
    })
    showToast("Signed Out", "Switched to Guest Session", "info")
  }, [updateStore, showToast])

  const updateCustomerProfile = useCallback(
    (updates: Partial<DemoCustomer>) => {
      updateStore((draft) => {
        draft.customers = draft.customers.map((c) => {
          if (c.id === draft.currentCustomerId) {
            return { ...c, ...updates }
          }
          return c
        })
        return draft
      })
      showToast("Profile Updated", undefined, "success")
    },
    [updateStore, showToast]
  )

  return {
    customer,
    isLoggedIn,
    loginAsDemoCustomer,
    logoutCustomer,
    updateCustomerProfile,
  }
}

/**
 * Orders management hook
 */
export function useDemoOrders() {
  const { state, updateStore, showToast } = useDemoStore()

  const placeOrder = useCallback(
    (input: {
      customer: { firstName: string; lastName: string; email: string; phone: string }
      shippingAddress: DemoAddress
      shippingOptionId: string
      paymentMethod: "cod" | "test_card" | "mobile_banking"
      paymentDetails?: {
        simulatedMethod: string
        transactionReference?: string
        failureReason?: string
      }
      isGuestOrder?: boolean
      notes?: string
    }): DemoOrder => {
      const shippingOption =
        state.shippingOptions.find((so) => so.id === input.shippingOptionId) || state.shippingOptions[0]

      const items = state.cart.items
      if (items.length === 0) {
        throw new Error("Cannot place order with an empty shopping bag")
      }

      // Check for inventory constraints before proceeding
      for (const item of items) {
        const prod = state.products.find((p) => p.id === item.productId)
        const variant = prod?.variants.find((v) => v.id === item.variantId)
        if (variant && variant.manageInventory && variant.inventoryQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${item.productTitle} (${item.variantTitle}). Available: ${variant.inventoryQuantity}`
          )
        }
      }

      const itemSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      const appliedPromo = state.promotions.find(
        (p) => p.code.toUpperCase() === state.cart.appliedPromotionCode?.toUpperCase() && p.isActive
      )
      let discountTotal = 0
      if (appliedPromo) {
        if (!appliedPromo.minOrderAmount || itemSubtotal >= appliedPromo.minOrderAmount) {
          discountTotal =
            appliedPromo.type === "percentage" ? (itemSubtotal * appliedPromo.value) / 100 : appliedPromo.value
        }
      }
      discountTotal = Math.min(discountTotal, itemSubtotal)
      const shippingTotal = shippingOption.price
      const grandTotal = itemSubtotal - discountTotal + shippingTotal

      const isGuest = input.isGuestOrder ?? (state.currentCustomerId === "guest" || !state.currentCustomerId)
      const customerId = isGuest ? undefined : state.currentCustomerId

      const newOrder: DemoOrder = {
        id: generateId("ord"),
        displayId: generateDisplayOrderId(state.orders.length),
        createdAt: new Date().toISOString(),
        status: "pending",
        paymentStatus:
          input.paymentMethod === "test_card" || input.paymentMethod === "mobile_banking"
            ? "paid"
            : "pending",
        fulfillmentStatus: "not_fulfilled",
        paymentMethod: input.paymentMethod,
        paymentDetails: input.paymentDetails,
        isGuestOrder: isGuest,
        customerId,
        items: items.map((item) => ({
          id: generateId("ord_item"),
          productId: item.productId,
          productTitle: item.productTitle,
          productHandle: item.productHandle,
          variantId: item.variantId,
          variantTitle: item.variantTitle,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          thumbnail: item.thumbnail,
        })),
        customer: {
          id: customerId,
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
          email: input.customer.email,
          phone: input.customer.phone,
        },
        shippingAddress: input.shippingAddress,
        shippingOption,
        itemSubtotal,
        discountTotal,
        shippingTotal,
        total: grandTotal,
        appliedPromotionCode: appliedPromo?.code,
        appliedPromoCode: appliedPromo?.code,
        notes: input.notes,
      }

      const inventoryEventsToAdd: DemoInventoryEvent[] = []

      updateStore((draft) => {
        // Deduct inventory
        draft.products = draft.products.map((prod) => {
          const itemsForProd = newOrder.items.filter((i) => i.productId === prod.id)
          if (itemsForProd.length === 0) return prod

          const updatedVariants = prod.variants.map((variant) => {
            const match = itemsForProd.find((i) => i.variantId === variant.id || i.sku === variant.sku)
            if (match && variant.manageInventory) {
              const prev = variant.inventoryQuantity
              const next = Math.max(0, prev - match.quantity)
              inventoryEventsToAdd.push({
                id: generateId("inv_evt"),
                variantId: variant.id,
                sku: variant.sku,
                change: -match.quantity,
                previousStock: prev,
                newStock: next,
                reason: "order_placement",
                referenceId: newOrder.id,
                timestamp: new Date().toISOString(),
              })
              return { ...variant, inventoryQuantity: next }
            }
            return variant
          })

          return { ...prod, variants: updatedVariants, updatedAt: new Date().toISOString() }
        })

        // Prepend new order & clear cart
        draft.orders = [newOrder, ...draft.orders]
        draft.cart = { items: [], appliedPromotionCode: undefined, updatedAt: new Date().toISOString() }

        // Update active customer statistics
        draft.customers = draft.customers.map((c) => {
          if (c.id === draft.currentCustomerId) {
            return {
              ...c,
              ordersCount: c.ordersCount + 1,
              totalSpent: c.totalSpent + grandTotal,
              defaultAddress: input.shippingAddress,
            }
          }
          return c
        })

        // Append events
        draft.inventoryEvents = [...inventoryEventsToAdd, ...draft.inventoryEvents].slice(0, 50)
        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "order_created" as const,
            description: `Order ${newOrder.displayId} placed for ${input.customer.firstName} ${input.customer.lastName} (৳${grandTotal.toLocaleString("en-BD")}).`,
            timestamp: new Date().toISOString(),
            metadata: { orderId: newOrder.id, total: grandTotal },
          },
          ...draft.activityEvents,
        ].slice(0, 50)

        return draft
      })

      showToast("Order Confirmed!", `Order ${newOrder.displayId} placed successfully.`, "success")
      return newOrder
    },
    [state.shippingOptions, state.cart.items, state.products, state.promotions, state.cart.appliedPromotionCode, state.orders.length, state.currentCustomerId, updateStore, showToast]
  )

  const getOrder = useCallback(
    (idOrDisplayId: string): DemoOrder | null => {
      return (
        state.orders.find((o) => o.id === idOrDisplayId || o.displayId === idOrDisplayId) || null
      )
    },
    [state.orders]
  )

  return {
    orders: state.orders,
    placeOrder,
    getOrder,
  }
}

/**
 * Demo Admin operations hook
 */
export function useDemoAdmin() {
  const { state, updateStore, showToast, resetStore, exportStore, importStore } = useDemoStore()

  const addProduct = useCallback(
    (data: Omit<DemoProduct, "id" | "createdAt" | "updatedAt">): DemoProduct => {
      const id = generateId("prod")
      const now = new Date().toISOString()
      const newProduct: DemoProduct = { ...data, id, createdAt: now, updatedAt: now }

      updateStore((draft) => {
        draft.products = [newProduct, ...draft.products]
        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "product_created" as const,
            description: `Garment "${newProduct.title}" added to catalog.`,
            timestamp: now,
          },
          ...draft.activityEvents,
        ].slice(0, 50)
        return draft
      })

      showToast("Product Added", `${newProduct.title} added to catalog`, "success")
      return newProduct
    },
    [updateStore, showToast]
  )

  const updateProduct = useCallback(
    (id: string, updates: Partial<DemoProduct>) => {
      const now = new Date().toISOString()
      updateStore((draft) => {
        draft.products = draft.products.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p))
        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "product_updated" as const,
            description: `Product ${id} updated.`,
            timestamp: now,
          },
          ...draft.activityEvents,
        ].slice(0, 50)
        return draft
      })
      showToast("Product Updated", undefined, "success")
    },
    [updateStore, showToast]
  )

  const deleteProduct = useCallback(
    (id: string) => {
      const now = new Date().toISOString()
      updateStore((draft) => {
        const found = draft.products.find((p) => p.id === id)
        draft.products = draft.products.filter((p) => p.id !== id)
        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "product_deleted" as const,
            description: `Product "${found?.title || id}" deleted.`,
            timestamp: now,
          },
          ...draft.activityEvents,
        ].slice(0, 50)
        return draft
      })
      showToast("Product Deleted", undefined, "info")
    },
    [updateStore, showToast]
  )

  const archiveProduct = useCallback(
    (id: string) => {
      updateProduct(id, { status: "draft" })
      showToast("Product Archived", "Garment hidden from customer store", "info")
    },
    [updateProduct, showToast]
  )

  const publishProduct = useCallback(
    (id: string) => {
      updateProduct(id, { status: "published" })
      showToast("Product Published", "Garment visible in customer store", "success")
    },
    [updateProduct, showToast]
  )
  const updateOrderStatus = useCallback(
    (
      orderId: string,
      status: DemoOrderStatus,
      paymentStatus?: DemoPaymentStatus,
      fulfillmentStatus?: DemoFulfillmentStatus
    ) => {
      const now = new Date().toISOString()
      updateStore((draft) => {
        draft.orders = draft.orders.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              paymentStatus: paymentStatus || o.paymentStatus,
              fulfillmentStatus: fulfillmentStatus || o.fulfillmentStatus,
            }
          }
          return o
        })
        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "order_status_updated" as const,
            description: `Order ${orderId} updated to ${status}.`,
            timestamp: now,
          },
          ...draft.activityEvents,
        ].slice(0, 50)
        return draft
      })
      showToast("Order Status Updated", `Order marked as ${status}`, "success")
    },
    [updateStore, showToast]
  )

  const togglePromotion = useCallback(
    (promoId: string) => {
      updateStore((draft) => {
        draft.promotions = draft.promotions.map((p) =>
          p.id === promoId ? { ...p, isActive: !p.isActive } : p
        )
        return draft
      })
    },
    [updateStore]
  )

  const addPromotion = useCallback(
    (data: Omit<DemoPromotion, "id">): DemoPromotion => {
      const id = generateId("promo")
      const newPromo: DemoPromotion = { ...data, id }
      updateStore((draft) => {
        draft.promotions = [newPromo, ...draft.promotions]
        return draft
      })
      showToast("Promotion Added", `Coupon ${newPromo.code} created`, "success")
      return newPromo
    },
    [updateStore, showToast]
  )

  const cancelOrder = useCallback(
    (orderId: string, reason = "Canceled in Demo Admin") => {
      const now = new Date().toISOString()
      const invEvents: DemoInventoryEvent[] = []

      updateStore((draft) => {
        const order = draft.orders.find((o) => o.id === orderId)
        if (!order || order.status === "canceled") {
          return draft // Guard against repeated cancellation inventory restoral
        }

        // Restore inventory for each item
        draft.products = draft.products.map((prod) => {
          const itemsInOrder = order.items.filter((i) => i.productId === prod.id)
          if (itemsInOrder.length === 0) return prod

          const updatedVariants = prod.variants.map((v) => {
            const match = itemsInOrder.find((i) => i.variantId === v.id || i.sku === v.sku)
            if (match && v.manageInventory) {
              const prev = v.inventoryQuantity
              const next = prev + match.quantity
              invEvents.push({
                id: generateId("inv_evt"),
                variantId: v.id,
                sku: v.sku,
                change: match.quantity,
                previousStock: prev,
                newStock: next,
                reason: "restock",
                referenceId: order.id,
                timestamp: now,
              })
              return { ...v, inventoryQuantity: next }
            }
            return v
          })

          return { ...prod, variants: updatedVariants, updatedAt: now }
        })

        // Update order status
        draft.orders = draft.orders.map((o) =>
          o.id === orderId ? { ...o, status: "canceled" as DemoOrderStatus, notes: `${o.notes || ""} [Canceled: ${reason}]` } : o
        )

        draft.inventoryEvents = [...invEvents, ...draft.inventoryEvents].slice(0, 50)
        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "order_status_updated" as const,
            description: `Order ${order.displayId} was canceled. Restored ${order.items.reduce((s, i) => s + i.quantity, 0)} units to warehouse stock.`,
            timestamp: now,
            metadata: { orderId: order.id },
          },
          ...draft.activityEvents,
        ].slice(0, 50)

        return draft
      })

      showToast("Order Canceled", "Inventory returned to Dhaka Central Warehouse", "info")
    },
    [updateStore, showToast]
  )

  const refundOrder = useCallback(
    (orderId: string) => {
      const now = new Date().toISOString()
      updateStore((draft) => {
        const order = draft.orders.find((o) => o.id === orderId)
        if (!order) return draft

        draft.orders = draft.orders.map((o) =>
          o.id === orderId ? { ...o, paymentStatus: "refunded" as DemoPaymentStatus } : o
        )

        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "order_status_updated" as const,
            description: `Order ${order.displayId} marked as refunded.`,
            timestamp: now,
            metadata: { orderId: order.id },
          },
          ...draft.activityEvents,
        ].slice(0, 50)

        return draft
      })
      showToast("Payment Refunded", "Simulated refund registered", "info")
    },
    [updateStore, showToast]
  )

  const updateOrderTracking = useCallback(
    (orderId: string, trackingNumber: string, carrier = "Pathao Courier") => {
      const now = new Date().toISOString()
      updateStore((draft) => {
        const order = draft.orders.find((o) => o.id === orderId)
        if (!order) return draft

        draft.orders = draft.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                fulfillmentStatus: "fulfilled" as DemoFulfillmentStatus,
                status: o.status === "pending" ? ("shipped" as DemoOrderStatus) : o.status,
                notes: `${o.notes || ""} [Tracking: ${carrier} ${trackingNumber}]`.trim(),
              }
            : o
        )

        draft.activityEvents = [
          {
            id: generateId("act_evt"),
            type: "order_status_updated" as const,
            description: `Tracking ${carrier} #${trackingNumber} attached to order ${order.displayId}.`,
            timestamp: now,
            metadata: { orderId: order.id, trackingNumber },
          },
          ...draft.activityEvents,
        ].slice(0, 50)

        return draft
      })
      showToast("Tracking Attached", `${carrier} tracking assigned`, "success")
    },
    [updateStore, showToast]
  )

  const updateCustomer = useCallback(
    (customerId: string, updates: Partial<DemoCustomer>) => {
      updateStore((draft) => {
        draft.customers = draft.customers.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
        return draft
      })
      showToast("Customer Updated", undefined, "success")
    },
    [updateStore, showToast]
  )

  const updatePromotion = useCallback(
    (promoId: string, updates: Partial<DemoPromotion>) => {
      updateStore((draft) => {
        draft.promotions = draft.promotions.map((p) => (p.id === promoId ? { ...p, ...updates } : p))
        return draft
      })
      showToast("Promotion Updated", undefined, "success")
    },
    [updateStore, showToast]
  )

  const deletePromotion = useCallback(
    (promoId: string) => {
      updateStore((draft) => {
        draft.promotions = draft.promotions.filter((p) => p.id !== promoId)
        return draft
      })
      showToast("Promotion Deleted", undefined, "info")
    },
    [updateStore, showToast]
  )

  const updateSettings = useCallback(
    (updates: Partial<DemoSettings>) => {
      updateStore((draft) => {
        draft.settings = { ...draft.settings, ...updates }
        return draft
      })
      showToast("Settings Saved", undefined, "success")
    },
    [updateStore, showToast]
  )

  return {
    state,
    addProduct,
    updateProduct,
    deleteProduct,
    archiveProduct,
    publishProduct,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    updateOrderTracking,
    updateCustomer,
    togglePromotion,
    addPromotion,
    updatePromotion,
    deletePromotion,
    updateSettings,
    resetStore,
    exportStore,
    importStore,
  }
}

// Backward compatibility alias hook
export const useDemo = () => {
  const store = useDemoStore()
  const cart = useDemoCart()
  const customer = useDemoCustomer()
  const orders = useDemoOrders()
  const admin = useDemoAdmin()

  return {
    isLoaded: store.isHydrated,
    products: store.state.products,
    categories: store.state.categories,
    collections: store.state.collections,
    cart: {
      items: cart.items,
      appliedPromo: cart.appliedPromo,
      subtotal: cart.subtotal,
      discount: cart.discount,
      total: cart.total,
      itemsCount: cart.itemsCount,
    },
    orders: store.state.orders,
    customers: store.state.customers,
    promotions: store.state.promotions,
    shippingOptions: store.state.shippingOptions,
    activeCustomer: customer.customer,
    addToCart: cart.addItem,
    updateCartQuantity: cart.updateItemQuantity,
    removeFromCart: cart.removeItem,
    clearCart: cart.clearCart,
    applyPromo: cart.applyPromoCode,
    removePromo: cart.removePromoCode,
    createOrder: orders.placeOrder,
    addProduct: admin.addProduct,
    updateProduct: admin.updateProduct,
    deleteProduct: admin.deleteProduct,
    updateOrderStatus: admin.updateOrderStatus,
    addPromotion: admin.addPromotion,
    togglePromotion: admin.togglePromotion,
    updateCustomer: customer.updateCustomerProfile,
    isCartDrawerOpen: store.isCartDrawerOpen,
    setIsCartDrawerOpen: store.setIsCartDrawerOpen,
    resetDemoData: store.resetStore,
    toasts: store.toasts,
    showToast: store.showToast,
    removeToast: store.removeToast,
  }
}
