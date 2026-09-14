const c = require("ansi-colors");

const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
];

function checkEnvVariables() {
  const isBuild = process.argv.some(function (arg) {
    return arg.includes("build");
  });
  const isLintOrTest =
    process.env.SKIP_ENV_CHECK === "true" ||
    process.env.NODE_ENV === "test" ||
    process.argv.some(function (arg) {
      return arg.includes("lint") || arg.includes("type-check");
    });

  if (isLintOrTest) {
    return;
  }

  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key];
  });

  if (missingEnvs.length > 0) {
    if (isBuild) {
      console.warn(
        c.yellow.bold("\n⚠️  Warning: Missing environment variables during build stage:\n")
      );
      missingEnvs.forEach(function (env) {
        console.warn(c.yellow(`  ${c.bold(env.key)} (using build fallback)`));
        process.env[env.key] = "pk_build_stage_placeholder";
      });
      console.warn(
        c.yellow("\nEnsure valid production keys are supplied at deployment runtime.\n")
      );
      return;
    }

    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    );

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`));
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`));
      }
    });

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    );

    process.exit(1);
  }
}

module.exports = checkEnvVariables;
