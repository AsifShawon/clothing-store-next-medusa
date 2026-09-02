module.exports = {
  darkMode: "class",
  presets: [
    require("@medusajs/ui-preset"),
    require("@dtc/storefront-ui/tailwind.preset"),
  ],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "../../packages/storefront-ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("tailwindcss-radix")()],
}
