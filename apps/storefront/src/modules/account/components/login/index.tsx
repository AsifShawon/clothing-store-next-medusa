import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-brand-primary mb-2">
        Welcome Back
      </h1>
      <p className="text-center text-xs text-brand-primary/70 mb-8 leading-relaxed">
        Sign in to manage your London Boy orders, addresses, and wardrobe.
      </p>

      {message?.state === "verification_required" && (
        <div
          className="w-full mb-6 text-center text-xs text-brand-primary bg-brand-secondary border border-brand-border p-4"
          data-testid="login-verification-message"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Please verify your email, then sign in.
        </div>
      )}

      <form className="w-full space-y-4" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              data-testid="password-input"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
                className="text-[11px] text-brand-primary/60 hover:text-brand-primary underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />

        <SubmitButton data-testid="sign-in-button" className="w-full mt-4 py-3.5 bg-brand-primary hover:bg-black text-white text-xs font-heading font-semibold uppercase tracking-widest transition-colors shadow-sm">
          Sign In &rarr;
        </SubmitButton>
      </form>

      <span className="text-center text-brand-primary/70 text-xs mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-semibold text-brand-primary underline hover:text-black"
          data-testid="register-button"
        >
          Create an Account
        </button>
      </span>
    </div>
  )
}

export default Login
