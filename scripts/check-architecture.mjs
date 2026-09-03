import { execSync } from "child_process"

console.log("=========================================")
console.log("   DTC ARCHITECTURE VERIFICATION SUITE   ")
console.log("=========================================\n")

try {
  console.log("1. Checking package boundaries...")
  execSync("node scripts/check-package-boundaries.mjs", { stdio: "inherit" })
  console.log("\n2. Checking shared UI consumption matrix...")
  execSync("node scripts/check-shared-ui.mjs", { stdio: "inherit" })
  console.log("\n3. Running architecture checker negative tests...")
  execSync("node -e \"const { createJiti } = require('jiti'); const jiti = createJiti(process.cwd()); jiti('./scripts/tests/architecture-checks.test.ts');\"", { stdio: "inherit" })
  console.log("\n✅ ALL ARCHITECTURAL GATES PASSED.")

} catch (error) {
  console.error("\n🚨 ARCHITECTURAL GATES FAILED.")
  process.exit(1)
}
