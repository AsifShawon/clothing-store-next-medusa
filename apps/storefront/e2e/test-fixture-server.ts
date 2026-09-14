import http from "node:http"

const BD_REGION = {
  id: "reg_bd_01",
  name: "Bangladesh",
  currency_code: "bdt",
  countries: [{ id: "c_bd", iso_2: "bd", display_name: "Bangladesh" }],
}

const PRODUCTS = [
  {
    id: "prod_tee_01",
    title: "Signature Heavyweight T-Shirt",
    handle: "heavyweight-t-shirt",
    subtitle: "240 GSM Combed Cotton",
    description: "Modern British smart-casual heavyweight t-shirt crafted with high-density cotton.",
    thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    images: [
      { id: "img_1", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80" },
    ],
    options: [
      {
        id: "opt_size",
        title: "Size",
        product_id: "prod_tee_01",
        values: [
          { id: "val_s", value: "S" },
          { id: "val_m", value: "M" },
          { id: "val_l", value: "L" },
        ],
      },
      {
        id: "opt_color",
        title: "Color",
        product_id: "prod_tee_01",
        values: [
          { id: "val_blk", value: "Black" },
          { id: "val_wht", value: "White" },
        ],
      },
    ],
    variants: [
      {
        id: "var_tee_blk_s",
        title: "S / Black",
        sku: "LB-TEE-BLK-S",
        inventory_quantity: 25,
        manage_inventory: true,
        options: [
          { id: "ov_1", option_id: "opt_size", value: "S" },
          { id: "ov_2", option_id: "opt_color", value: "Black" },
        ],
        calculated_price: {
          id: "p_1",
          calculated_amount: 1250,
          original_amount: 1500,
          currency_code: "bdt",
        },
      },
      {
        id: "var_tee_blk_m",
        title: "M / Black",
        sku: "LB-TEE-BLK-M",
        inventory_quantity: 0,
        manage_inventory: true,
        options: [
          { id: "ov_3", option_id: "opt_size", value: "M" },
          { id: "ov_4", option_id: "opt_color", value: "Black" },
        ],
        calculated_price: {
          id: "p_2",
          calculated_amount: 1250,
          original_amount: 1500,
          currency_code: "bdt",
        },
      },
    ],
    collection: { id: "col_new", title: "New Arrivals", handle: "new-arrivals" },
    categories: [{ id: "cat_men", name: "Men's Clothing", handle: "men" }],
    tags: [{ id: "tag_1", value: "Heavyweight" }, { id: "tag_2", value: "New" }],
  },
]

const CARTS = new Map<string, any>()

let cartSequence = 1

function createEmptyCart(regionId = BD_REGION.id) {
  const id = `cart_test_${cartSequence++}`
  const cart = {
    id,
    region_id: regionId,
    region: BD_REGION,
    currency_code: "bdt",
    items: [],
    subtotal: 0,
    total: 0,
    discount_total: 0,
    shipping_total: 0,
    tax_total: 0,
    shipping_methods: [],
    payment_collection: {
      id: `pay_col_${id}`,
      payment_sessions: [
        {
          id: `ps_manual_${id}`,
          provider_id: "pp_system_default",
          status: "pending",
          amount: 0,
        },
      ],
    },
  }
  CARTS.set(id, cart)
  return cart
}

export function startMedusaTestFixtureServer(port = 9000): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url || "/", `http://localhost:${port}`)
      res.setHeader("Content-Type", "application/json")
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
      res.setHeader("Access-Control-Allow-Headers", "*")

      if (req.method === "OPTIONS") {
        res.writeHead(204)
        res.end()
        return
      }

      let body = ""
      req.on("data", (chunk) => (body += chunk))
      req.on("end", () => {
        const jsonBody = body ? JSON.parse(body) : {}

        // Health check
        if (url.pathname === "/health") {
          res.writeHead(200)
          res.end(JSON.stringify({ status: "ok", fixture: true }))
          return
        }

        // Regions
        if (url.pathname === "/store/regions") {
          res.writeHead(200)
          res.end(JSON.stringify({ regions: [BD_REGION] }))
          return
        }

        // Collections
        if (url.pathname === "/store/collections") {
          res.writeHead(200)
          res.end(JSON.stringify({ collections: [{ id: "col_new", title: "New Arrivals", handle: "new-arrivals" }] }))
          return
        }

        // Categories
        if (url.pathname === "/store/product-categories") {
          res.writeHead(200)
          res.end(JSON.stringify({ product_categories: [{ id: "cat_men", name: "Men's Clothing", handle: "men" }] }))
          return
        }

        // Products list
        if (url.pathname === "/store/products") {
          res.writeHead(200)
          res.end(JSON.stringify({ products: PRODUCTS, count: PRODUCTS.length }))
          return
        }

        // Single product by handle/id
        if (url.pathname.startsWith("/store/products/")) {
          const idOrHandle = url.pathname.replace("/store/products/", "")
          const prod = PRODUCTS.find((p) => p.id === idOrHandle || p.handle === idOrHandle) || PRODUCTS[0]
          res.writeHead(200)
          res.end(JSON.stringify({ product: prod }))
          return
        }

        // Cart creation
        if (url.pathname === "/store/carts" && req.method === "POST") {
          const cart = createEmptyCart(jsonBody.region_id || BD_REGION.id)
          res.writeHead(200)
          res.end(JSON.stringify({ cart }))
          return
        }

        // Cart retrieve / update
        if (url.pathname.startsWith("/store/carts/")) {
          const parts = url.pathname.split("/")
          const cartId = parts[3]
          let cart = CARTS.get(cartId) || createEmptyCart()

          // Add line item
          if (parts[4] === "line-items" && req.method === "POST") {
            const variant = PRODUCTS[0].variants.find((v) => v.id === jsonBody.variant_id) || PRODUCTS[0].variants[0]
            const newItem = {
              id: `item_${Date.now()}`,
              product_id: PRODUCTS[0].id,
              title: PRODUCTS[0].title,
              variant_id: variant.id,
              variant_title: variant.title,
              quantity: jsonBody.quantity || 1,
              unit_price: 1250,
              total: 1250 * (jsonBody.quantity || 1),
              thumbnail: PRODUCTS[0].thumbnail,
            }
            cart.items.push(newItem)
            cart.subtotal = cart.items.reduce((acc: number, it: any) => acc + it.total, 0)
            cart.total = cart.subtotal + cart.shipping_total - cart.discount_total
            res.writeHead(200)
            res.end(JSON.stringify({ cart }))
            return
          }

          // Complete cart / place order
          if (parts[4] === "complete" && req.method === "POST") {
            const order = {
              id: `order_${Date.now()}`,
              display_id: 1001,
              email: cart.email || "customer@example.com",
              total: cart.total || 1310,
              items: cart.items,
              shipping_address: cart.shipping_address,
              status: "pending",
            }
            res.writeHead(200)
            res.end(JSON.stringify({ type: "order", order }))
            return
          }

          // Retrieve cart
          res.writeHead(200)
          res.end(JSON.stringify({ cart }))
          return
        }

        // Fallback
        res.writeHead(404)
        res.end(JSON.stringify({ message: `Not found: ${url.pathname}` }))
      })
    })

    server.listen(port, () => {
      resolve(server)
    })
  })
}

const port = Number(process.env.PORT || 9000)
startMedusaTestFixtureServer(port).then(() => {
  console.log(`[Medusa Test Fixture Server] Listening on http://localhost:${port}`)
})
