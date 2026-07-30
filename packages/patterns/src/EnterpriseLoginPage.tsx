import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  Button,
  IconButton,
  Input,
  Checkbox,
  ThemeToggle,
  TextLink,
  LumenLogo,
  LmAisymbolIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronLeftIcon,
  GlobeIcon,
  LanguagesIcon,
  FingerprintPatternIcon,
  KeyIcon,
  ScanQrCodeIcon,
  CheckCircleFilledIcon,
  CircleAlertIcon
} from "@lumen/ui";

export interface EnterpriseLoginWorkspace {
  id: string;
  name: string;
  /** Single-character avatar fallback, e.g. "N". */
  initial: string;
}

export type EnterpriseLoginSsoProvider = "microsoft" | "google" | "okta";

export interface EnterpriseLoginCredentialResult {
  success: boolean;
  /** Shown in the inline form error when `success` is false. */
  error?: string;
}

export interface EnterpriseLoginPageProps {
  /** Rendered in the desktop hero panel and the compact mobile/tablet header. Defaults to `LumenLogo`. */
  logo?: ReactNode;
  heroTitle?: string;
  heroDescription?: string;
  /** e.g. `["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"]`. Omit to hide the row. */
  complianceBadges?: string[];
  /** e.g. `"Data residency: EU (Frankfurt) · Tenant lumen-nw-eu-1"`. Omit to hide the row. */
  dataResidencyNote?: string;
  /** Paired with `statusHref` for the hero panel's live-status row. Omit either to hide the row. */
  statusText?: string;
  statusHref?: string;
  /** First name used in "Welcome back, {userName}." */
  userName?: string;
  /** e.g. `"Last signed in 3 days ago · Bengaluru, IN · Chrome on macOS"`. Omit to hide. */
  lastSignIn?: string;
  recentWorkspaces?: EnterpriseLoginWorkspace[];
  ssoProviders?: EnterpriseLoginSsoProvider[];
  region?: string;
  /** Organization the "Signed in" screen hands off to. */
  orgName?: string;
  /** Called on email/password submit. Return `{ success: false, error }` to show the inline error and stay on this screen; anything else advances to MFA. Omitted entirely, the form has nothing to submit to. */
  onSubmitCredentials?: (
    email: string,
    password: string
  ) => Promise<EnterpriseLoginCredentialResult | void> | EnterpriseLoginCredentialResult | void;
  /** Called when the passkey ceremony should start. Return `false` to fall back to the sign-in screen; anything else is treated as success and advances to "Signed in". */
  onStartPasskey?: () => Promise<boolean | void> | boolean | void;
  /** Called once all 6 MFA digits are entered. Return `false` to stay on this screen; anything else advances to "Signed in". */
  onVerifyMfaCode?: (code: string) => Promise<boolean | void> | boolean | void;
  onSsoSignIn?: (provider: EnterpriseLoginSsoProvider) => void;
  /** Called once the internal state machine reaches the "Signed in" screen — whether via passkey or MFA. The natural point for a composing pattern to advance to whatever comes after login. */
  onComplete?: () => void;
  /** Which of the 4 screens to render first. Defaults to `"sign-in"` — an entry point for Storybook/tests to preview the other screens directly, not something a real integration needs to set. */
  initialScreen?: "sign-in" | "passkey" | "mfa" | "done";
}

const ssoProviderLabel: Record<EnterpriseLoginSsoProvider, string> = {
  microsoft: "Microsoft",
  google: "Google",
  okta: "Okta"
};

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || /\d/.test(password)) score++;
  return Math.min(score, 4);
}

const strengthMeta = [
  { label: "Too short", width: "8%", colorVar: "--color-border-strong" },
  { label: "Weak", width: "30%", colorVar: "--color-status-error" },
  { label: "Fair", width: "55%", colorVar: "--color-status-warning" },
  { label: "Strong", width: "78%", colorVar: "--color-forest-400" },
  { label: "Excellent", width: "100%", colorVar: "--color-forest-600" }
];

function detectOrgHint(email: string): string {
  const at = email.indexOf("@");
  if (at < 0 || at === email.length - 1) return "";
  const domain = email.slice(at + 1).toLowerCase();
  if (domain.startsWith("northwind")) {
    return "Northwind Group detected — your organization requires Microsoft SSO. We'll route you there.";
  }
  if (domain.startsWith("acme")) {
    return "Acme Legal detected — SAML sign-in is available for this domain.";
  }
  return `No workspace found for ${domain} yet. You can create one after verifying your email.`;
}

/**
 * Enterprise pattern: multi-step enterprise sign-in flow — SSO/passkey/
 * email+password on a marketing hero split-screen, MFA, and a signed-in
 * confirmation. Distinct from `AuthForm` (a minimal centered card meant to
 * stay minimal — see its own doc comment) rather than an extension of it:
 * this is a different shape (split hero panel, a 4-screen state machine,
 * SSO/passkey/MFA) that would have bloated `AuthForm`'s single-form API,
 * not a variant of the same component. Added at direct user request
 * ("Use the claude_design MCP ... Implement: `Enterprise Login.dc.html`"),
 * which is also this component's authorization to exist as a second,
 * larger auth pattern in this repo, per `AuthForm.mdx`'s own note that an
 * addition here needs to be "generic enough to belong in the design system
 * itself" rather than forked per-product.
 *
 * Source: a Claude Design prototype (`Enterprise Login.dc.html`, project
 * `57d6beaf-33bb-4013-bb17-464a1ab3d649`), not Figma Dev Mode — every
 * `--color-*`/`--text-*`/`--spacing-*` token it referenced already existed
 * in `@lumen/tokens` verified byte-for-byte against this repo's own built
 * `variables.css`. The few gaps (see `packages/tokens/src/semantic/
 * color.json`'s `_authHeroComment`) got new `auth-hero.*` tokens rather
 * than inlined hex, with a WCAG contrast pass applied where the prototype's
 * literal values fell short (`badge-border`, `text-caption`).
 *
 * Deliberately NOT ported from the prototype: its fixed bottom "Prototype
 * states" dock (a Claude Design preview harness for switching device/
 * state/theme, not shippable UI) and its `frameW` device-frame pixel
 * widths — real responsiveness here uses this repo's own `tablet`/
 * `desktop` breakpoints instead. The prototype's brand mark (a plain
 * crimson square + `AiSymbol`) is replaced with the real `LumenLogo`,
 * consistent with its recent rollout across `AppShell`/`SideNav`. All
 * interactive behavior (auth state machine, password strength, org
 * detection, MFA code entry) is ported as real React state; the
 * prototype's own `setTimeout`-simulated network calls are not — this
 * component calls the `onSubmitCredentials`/`onStartPasskey`/
 * `onVerifyMfaCode` props instead and does nothing on its own if they're
 * omitted, the same "call the prop, don't fake a backend" contract
 * `AuthForm.onSubmit` already uses.
 */
export function EnterpriseLoginPage({
  logo,
  heroTitle = "The intelligence layer for the work your enterprise already does.",
  heroDescription = "Contract intelligence, support copilots, and knowledge search — governed, auditable, and running inside your own security perimeter.",
  complianceBadges = ["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"],
  dataResidencyNote,
  statusText,
  statusHref,
  userName = "there",
  lastSignIn,
  recentWorkspaces = [],
  ssoProviders = ["microsoft", "google", "okta"],
  region = "EU (Frankfurt)",
  orgName = "your workspace",
  onSubmitCredentials,
  onStartPasskey,
  onVerifyMfaCode,
  onSsoSignIn,
  onComplete,
  initialScreen = "sign-in"
}: EnterpriseLoginPageProps) {
  const [screen, setScreen] = useState<"sign-in" | "passkey" | "mfa" | "done">(initialScreen);
  // Intentionally depends only on `screen`, not `onComplete` — fires once per transition to "done", not on every render.
  useEffect(() => {
    if (screen === "done") onComplete?.();
  }, [screen]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);

  const strength = getPasswordStrength(password);
  const orgHint = detectOrgHint(email);
  const showOrgHint = email.includes("@") && !email.endsWith("@");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await onSubmitCredentials?.(email, password);
    setLoading(false);
    if (result && result.success === false) {
      setError(result.error ?? "That didn't work. Please try again.");
      return;
    }
    setScreen("mfa");
  }

  async function handleStartPasskey() {
    setScreen("passkey");
    const result = await onStartPasskey?.();
    if (result === false) {
      setScreen("sign-in");
      return;
    }
    setScreen("done");
  }

  async function handleVerifyMfa() {
    setLoading(true);
    const result = await onVerifyMfaCode?.(code.join(""));
    setLoading(false);
    if (result === false) return;
    setScreen("done");
  }

  function handleCodeChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // The 6 code cells render as direct-sibling <input> elements with no
    // wrapper (see InternalInput), so the next cell is a plain DOM walk —
    // avoids needing ref-forwarding support on the public `Input` wrapper,
    // which doesn't have it (see Button.tsx's docblock for the same gap,
    // fixed there because Tooltip positioning needed it; not needed here).
    if (digit && index < code.length - 1) {
      (e.target.nextElementSibling as HTMLInputElement | null)?.focus();
    }
  }

  const brand = logo ?? <LumenLogo className="h-[22px] w-[22px] shrink-0" title="Lumen" />;
  const mfaComplete = code.every((d) => d !== "");

  return (
    <div
      data-theme={theme}
      className="flex min-h-screen flex-col items-center bg-[var(--color-background-subtle)] py-[var(--spacing-24)]"
    >
      <div className="grid w-full max-w-[1512px] grid-cols-1 overflow-hidden rounded-lg bg-[var(--color-background-default)] text-[var(--color-text-body)] shadow-[var(--shadow-elevation-sm),0_24px_64px_rgba(0,0,0,0.10)] desktop:min-h-[860px] desktop:grid-cols-[1.02fr_1fr]">
        <HeroPanel
          brand={brand}
          heroTitle={heroTitle}
          heroDescription={heroDescription}
          complianceBadges={complianceBadges}
          dataResidencyNote={dataResidencyNote}
          statusText={statusText}
          statusHref={statusHref}
        />

        <main className="flex min-w-0 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-[var(--spacing-16)] p-[var(--spacing-24)]">
            <div className="flex items-center gap-[var(--spacing-10)] desktop:hidden">
              {brand}
              <span className="font-brand text-title-md text-[var(--color-text-title)]">Lumen</span>
            </div>
            <div className="ml-auto flex items-center gap-[var(--spacing-8)]">
              <IconButton variant="outline" size="md" aria-label={`Region: ${region}`} icon={<GlobeIcon />} />
              <IconButton variant="outline" size="md" aria-label="Select language" icon={<LanguagesIcon />} />
              <ThemeToggle
                checked={theme === "dark"}
                onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
              />
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center px-[var(--spacing-32)] pb-[var(--spacing-40)]">
            <div className="w-full max-w-[408px]">
              {screen === "sign-in" && (
                <SignInScreen
                  userName={userName}
                  lastSignIn={lastSignIn}
                  recentWorkspaces={recentWorkspaces}
                  ssoProviders={ssoProviders}
                  onSsoSignIn={onSsoSignIn}
                  onStartPasskey={handleStartPasskey}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  remember={remember}
                  setRemember={setRemember}
                  loading={loading}
                  error={error}
                  setError={setError}
                  strength={strength}
                  showOrgHint={showOrgHint}
                  orgHint={orgHint}
                  onSubmit={handleSubmit}
                />
              )}
              {screen === "passkey" && (
                <PasskeyScreen onCancel={() => setScreen("sign-in")} onUseAnotherMethod={() => setScreen("mfa")} />
              )}
              {screen === "mfa" && (
                <MfaScreen
                  code={code}
                  onCodeChange={handleCodeChange}
                  onBack={() => setScreen("sign-in")}
                  onVerify={handleVerifyMfa}
                  loading={loading}
                  mfaComplete={mfaComplete}
                  remember={remember}
                  setRemember={setRemember}
                />
              )}
              {screen === "done" && <DoneScreen orgName={orgName} region={region} />}
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-[var(--spacing-16)] border-t border-[var(--color-border-default)] px-[var(--spacing-32)] py-[var(--spacing-20)]">
            <span className="text-body-xs text-[var(--color-text-secondary)]">
              © {new Date().getFullYear()} Lumen AI, Inc.
            </span>
            <div className="flex gap-[var(--spacing-20)]">
              <TextLink href="#privacy" className="text-body-xs text-[var(--color-text-secondary)]">
                Privacy
              </TextLink>
              <TextLink href="#terms" className="text-body-xs text-[var(--color-text-secondary)]">
                Terms
              </TextLink>
              <TextLink href="#security" className="text-body-xs text-[var(--color-text-secondary)]">
                Security
              </TextLink>
              <TextLink href="#status" className="text-body-xs text-[var(--color-text-secondary)]">
                Status
              </TextLink>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function HeroPanel({
  brand,
  heroTitle,
  heroDescription,
  complianceBadges,
  dataResidencyNote,
  statusText,
  statusHref
}: {
  brand: ReactNode;
  heroTitle: string;
  heroDescription: string;
  complianceBadges: string[];
  dataResidencyNote?: string;
  statusText?: string;
  statusHref?: string;
}) {
  return (
    <aside className="relative hidden min-w-0 flex-col justify-between overflow-hidden bg-[var(--color-primary-900)] p-[var(--spacing-56)] pb-[var(--spacing-40)] text-[var(--color-auth-hero-text-title)] desktop:flex">
      <svg
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
      >
        <defs>
          <radialGradient id="lm-auth-hero-glow" cx="70%" cy="22%" r="60%">
            <stop offset="0%" style={{ stopColor: "var(--color-primary-500)", stopOpacity: 0.55 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-primary-900)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="600" height="900" fill="url(#lm-auth-hero-glow)" />
        <g style={{ stroke: "var(--color-primary-200)", strokeOpacity: 0.3 }} fill="none" strokeWidth={1}>
          <path d="M60 720 L180 640 L300 690 L420 590 L540 640" />
          <path d="M60 560 L180 640 L240 470 L420 590 L520 430" />
          <path d="M240 470 L300 690" />
          <path d="M180 640 L120 830" />
          <path d="M420 590 L470 780" />
          <path d="M240 470 L140 330 L330 250 L520 430" />
          <path d="M330 250 L470 120" />
          <path d="M140 330 L60 560" />
        </g>
        <g style={{ fill: "var(--color-auth-hero-text-title)", fillOpacity: 0.55 }}>
          <circle cx="60" cy="720" r="2.5" />
          <circle cx="180" cy="640" r="3.5" />
          <circle cx="300" cy="690" r="2.5" />
          <circle cx="420" cy="590" r="4" />
          <circle cx="540" cy="640" r="2.5" />
          <circle cx="60" cy="560" r="2" />
          <circle cx="240" cy="470" r="4" />
          <circle cx="520" cy="430" r="2.5" />
          <circle cx="120" cy="830" r="2" />
          <circle cx="470" cy="780" r="2.5" />
          <circle cx="140" cy="330" r="3" />
          <circle cx="330" cy="250" r="3.5" />
          <circle cx="470" cy="120" r="2.5" />
        </g>
        <g style={{ fill: "var(--color-primary-500)", fillOpacity: 0.9 }}>
          <circle cx="240" cy="470" r="6" />
          <circle cx="330" cy="250" r="5" />
        </g>
      </svg>

      <div className="relative flex items-center gap-[var(--spacing-12)]">
        {brand}
        <span className="font-brand text-title-md font-semibold tracking-[-0.01em]">Lumen</span>
        <span className="border-l border-[var(--color-auth-hero-divider)] pl-[var(--spacing-12)] text-label-sm uppercase tracking-[0.08em] text-[var(--color-auth-hero-text-label)]">
          Enterprise
        </span>
      </div>

      <div className="relative flex max-w-[460px] flex-col gap-[var(--spacing-24)]">
        <h2 className="text-display-sm m-0 font-semibold tracking-[-0.02em] text-balance">{heroTitle}</h2>
        <p className="m-0 max-w-[420px] text-body-md text-[var(--color-auth-hero-text-body)] text-balance">
          {heroDescription}
        </p>
        {statusText && (
          <div className="flex items-center gap-[var(--spacing-8)] text-body-sm text-[var(--color-auth-hero-text-body)]">
            <span
              aria-hidden="true"
              className="size-[7px] rounded-full bg-[var(--color-auth-hero-status-dot)]"
            />
            <span>{statusText}</span>
            {statusHref && (
              <>
                <span aria-hidden="true" className="text-[var(--color-auth-hero-divider)]">
                  ·
                </span>
                <TextLink
                  href={statusHref}
                  className="text-[var(--color-auth-hero-text-body)] underline underline-offset-[3px]"
                >
                  {statusHref.replace(/^https?:\/\//, "")}
                </TextLink>
              </>
            )}
          </div>
        )}
      </div>

      <div className="relative flex flex-col gap-[var(--spacing-16)]">
        {complianceBadges.length > 0 && (
          <div className="flex flex-wrap gap-[var(--spacing-8)]">
            {complianceBadges.map((label) => (
              <span
                key={label}
                className="rounded-[var(--radius-pill)] border border-[var(--color-auth-hero-badge-border)] px-[var(--spacing-12)] py-[var(--spacing-5)] text-label-sm uppercase tracking-[0.06em] text-[var(--color-auth-hero-badge-text)]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {dataResidencyNote && (
          <p className="m-0 font-mono text-app-caption text-[var(--color-auth-hero-text-caption)]">
            {dataResidencyNote}
          </p>
        )}
      </div>
    </aside>
  );
}

function RecentWorkspaces({ workspaces }: { workspaces: EnterpriseLoginWorkspace[] }) {
  if (workspaces.length === 0) return null;
  return (
    <div className="flex flex-col gap-[var(--spacing-10)]">
      <span className="text-label-sm uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
        Recent workspaces
      </span>
      <div className="flex flex-wrap gap-[var(--spacing-8)]">
        {workspaces.map((workspace, i) => (
          <button
            key={workspace.id}
            type="button"
            className="inline-flex h-11 items-center gap-[var(--spacing-8)] rounded-[var(--radius-pill)] border py-0 pl-[var(--spacing-8)] pr-[var(--spacing-14)] text-label-lg font-medium transition-colors"
            style={
              i === 0
                ? {
                    borderColor: "var(--color-primary-500)",
                    background: "var(--color-primary-500-a10)",
                    color: "var(--color-text-title)"
                  }
                : { borderColor: "var(--color-border-default)", color: "var(--color-text-body)" }
            }
          >
            <span
              className="flex size-[var(--spacing-28)] items-center justify-center rounded-full text-label-md font-semibold"
              style={
                i === 0
                  ? { background: "var(--color-primary-500)", color: "var(--color-text-inverse)" }
                  : { background: "var(--color-background-subtle)", color: "var(--color-text-body)" }
              }
            >
              {workspace.initial}
            </span>
            {workspace.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SsoProviderButton({
  provider,
  onClick
}: {
  provider: EnterpriseLoginSsoProvider;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11"
      aria-label={`Continue with ${ssoProviderLabel[provider]}`}
      onClick={onClick}
    >
      <span aria-hidden="true">
        {provider === "microsoft" && (
          <svg width="15" height="15" viewBox="0 0 16 16">
            <rect x="0" y="0" width="7" height="7" fill="currentColor" opacity={0.85} />
            <rect x="9" y="0" width="7" height="7" fill="currentColor" opacity={0.55} />
            <rect x="0" y="9" width="7" height="7" fill="currentColor" opacity={0.55} />
            <rect x="9" y="9" width="7" height="7" fill="currentColor" opacity={0.3} />
          </svg>
        )}
        {provider === "google" && (
          <svg width="15" height="15" viewBox="0 0 16.8 16.7999" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="currentColor"
              d="M16.6501 6.72329H8.57749C8.57749 7.56282 8.57749 9.24172 8.57234 10.0812H13.2502C13.0709 10.9208 12.4354 12.0963 11.5374 12.6882C11.5374 12.6882 11.5357 12.6931 11.534 12.6923C10.34 13.4806 8.76447 13.6595 7.59458 13.4244C5.76083 13.0601 4.3096 11.7302 3.72037 10.041C3.7238 10.0385 3.72638 10.0152 3.72896 10.0136C3.36015 8.96583 3.36015 7.56282 3.72896 6.72329H3.7281C4.20326 5.18024 5.69821 3.77242 7.53453 3.38708C9.01148 3.07394 10.678 3.41292 11.9036 4.55972C12.0666 4.40021 14.1593 2.35688 14.3163 2.19065C10.129 -1.60149 3.42447 -0.267524 0.91572 4.62944H0.914862C0.914862 4.62944 0.915726 4.62964 0.910581 4.63888C-0.330501 7.04412 -0.279041 9.87829 0.919155 12.1685C0.915725 12.171 0.913153 12.1726 0.910581 12.1751C1.99642 14.2823 3.97254 15.8984 6.3535 16.5137C8.88283 17.177 12.1017 16.7237 14.258 14.7734L14.2606 14.7759C16.0875 13.1304 17.2247 10.3274 16.6501 6.72329Z"
            />
          </svg>
        )}
        {provider === "okta" && (
          <svg width="15" height="15" viewBox="0 0 12.6 12.6" fill="none">
            <path
              fill="currentColor"
              d="M6.3 0C2.8287 0 0 2.808 0 6.3C0 9.792 2.8089 12.6 6.3 12.6C9.7911 12.6 12.6 9.7911 12.6 6.3C12.6 2.8089 9.7713 0 6.3 0ZM6.3 9.45C4.554 9.45 3.15 8.046 3.15 6.3C3.15 4.554 4.554 3.15 6.3 3.15C8.046 3.15 9.45 4.554 9.45 6.3C9.45 8.046 8.046 9.45 6.3 9.45Z"
            />
          </svg>
        )}
      </span>
      {ssoProviderLabel[provider]}
    </Button>
  );
}

interface SignInScreenProps {
  userName: string;
  lastSignIn?: string;
  recentWorkspaces: EnterpriseLoginWorkspace[];
  ssoProviders: EnterpriseLoginSsoProvider[];
  onSsoSignIn?: (provider: EnterpriseLoginSsoProvider) => void;
  onStartPasskey: () => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  remember: boolean;
  setRemember: (value: boolean) => void;
  loading: boolean;
  error: string;
  setError: (value: string) => void;
  strength: number;
  showOrgHint: boolean;
  orgHint: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function SignInScreen({
  userName,
  lastSignIn,
  recentWorkspaces,
  ssoProviders,
  onSsoSignIn,
  onStartPasskey,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  remember,
  setRemember,
  loading,
  error,
  setError,
  strength,
  showOrgHint,
  orgHint,
  onSubmit
}: SignInScreenProps) {
  const strengthInfo = strengthMeta[strength];
  return (
    <div className="flex flex-col gap-[var(--spacing-32)]">
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <h1 className="m-0 font-editorial text-headline-lg font-semibold text-[var(--color-text-title)]">
          Welcome back, {userName}.
        </h1>
        {lastSignIn && <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">{lastSignIn}</p>}
      </div>

      <RecentWorkspaces workspaces={recentWorkspaces} />

      <div className="flex flex-col gap-[var(--spacing-12)]">
        <Button type="button" className="h-12 w-full" onClick={onStartPasskey}>
          <KeyIcon className="size-[17px]" aria-hidden="true" />
          Continue with passkey
        </Button>
        <p className="m-0 text-center text-body-xs text-[var(--color-text-secondary)]">
          Face ID, Touch ID or security key · fastest and phishing-resistant
        </p>
      </div>

      {ssoProviders.length > 0 && (
        <div className="flex flex-col gap-[var(--spacing-8)]">
          <div className="grid grid-cols-3 gap-[var(--spacing-8)]">
            {ssoProviders.map((provider) => (
              <SsoProviderButton key={provider} provider={provider} onClick={() => onSsoSignIn?.(provider)} />
            ))}
          </div>
          <Button type="button" variant="ghost" size="sm" className="self-center text-[var(--color-text-secondary)]">
            More options — SAML, Azure AD, magic link, QR sign-in
          </Button>
        </div>
      )}

      <div className="flex items-center gap-[var(--spacing-16)]">
        <span className="h-px flex-1 bg-[var(--color-border-default)]" />
        <span className="font-mono text-label-sm uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
          or use email
        </span>
        <span className="h-px flex-1 bg-[var(--color-border-default)]" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-[var(--spacing-20)]">
        <div className="flex flex-col gap-[var(--spacing-8)]">
          <label htmlFor="lm-enterprise-email" className="text-label-lg font-medium text-[var(--color-text-title)]">
            Work email
          </label>
          <Input
            id="lm-enterprise-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="username"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {showOrgHint && orgHint && (
            <span className="flex items-start gap-[var(--spacing-8)] text-body-xs text-[var(--color-text-brand)]">
              <LmAisymbolIcon className="mt-px size-[13px] shrink-0 text-[var(--color-primary-500)]" aria-hidden="true" />
              <span>{orgHint}</span>
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[var(--spacing-8)]">
          <div className="flex items-baseline justify-between gap-[var(--spacing-12)]">
            <label htmlFor="lm-enterprise-password" className="text-label-lg font-medium text-[var(--color-text-title)]">
              Password
            </label>
            <TextLink href="#forgot" className="text-body-xs">
              Forgot password?
            </TextLink>
          </div>
          <div className="relative flex">
            <Input
              id="lm-enterprise-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!error}
              className="h-11 pr-11"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[6px] top-[6px] inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-text-title)]"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-[var(--spacing-10)]">
              <span className="h-1 flex-1 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-background-subtle)]">
                <span
                  className="block h-full rounded-[var(--radius-pill)] transition-[width,background-color]"
                  style={{ width: strengthInfo.width, background: `var(${strengthInfo.colorVar})` }}
                />
              </span>
              <span className="text-label-sm uppercase tracking-[0.04em] text-[var(--color-text-secondary)]">
                {strengthInfo.label}
              </span>
            </div>
          )}
        </div>

        <div className="inline-flex min-h-11 items-center gap-[var(--spacing-10)]">
          <Checkbox
            id="lm-enterprise-remember-signin"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          <label
            htmlFor="lm-enterprise-remember-signin"
            className="cursor-pointer text-body-sm text-[var(--color-text-body)]"
          >
            Remember this device for 30 days
          </label>
        </div>

        {error && (
          <div
            role="alert"
            className="flex gap-[var(--spacing-10)] rounded-[var(--radius-lg)] border border-[var(--color-status-error-border)] bg-[var(--color-status-error-subtle)] p-[var(--spacing-12)] px-[var(--spacing-14)]"
          >
            <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-status-error)]" aria-hidden="true" />
            <span className="text-body-sm text-[var(--color-text-title)]">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="outline"
          disabled={loading}
          className="h-12 w-full border-[1.5px] border-[var(--color-input-primary-border)] text-[var(--color-text-body)] hover:border-[var(--color-input-primary-hover-border)]"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-primary-500)]"
            />
          )}
          {loading ? "Verifying…" : "Continue with email"}
        </Button>
      </form>

      <div className="flex gap-[var(--spacing-12)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] p-[var(--spacing-14)] px-[var(--spacing-16)]">
        <LmAisymbolIcon className="mt-0.5 size-[15px] shrink-0 text-[var(--color-primary-500)]" aria-hidden="true" />
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <span className="text-body-sm font-semibold text-[var(--color-text-title)]">Adaptive authentication</span>
          <span className="text-body-xs text-[var(--color-text-secondary)]">
            This device and network are recognized, so we'll only ask for a second factor if something changes.{" "}
            <TextLink href="#adaptive">How this works</TextLink>
          </span>
        </div>
      </div>

      <p className="m-0 text-center text-body-sm text-[var(--color-text-secondary)]">
        New to Lumen? <TextLink href="#create">Create an account</TextLink> or{" "}
        <TextLink href="#sales">talk to sales</TextLink>
      </p>
    </div>
  );
}

function PasskeyScreen({ onCancel, onUseAnotherMethod }: { onCancel: () => void; onUseAnotherMethod: () => void }) {
  return (
    <div className="flex flex-col items-center gap-[var(--spacing-32)] py-[var(--spacing-24)] text-center">
      <div className="relative flex size-[112px] items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full border border-[var(--color-primary-500)]"
        />
        <span className="flex size-[72px] items-center justify-center rounded-full bg-[var(--color-primary-500-a10)] text-[var(--color-primary-500)]">
          <FingerprintPatternIcon className="size-[30px]" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-10)]">
        <h1 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">Waiting for your passkey</h1>
        <p className="m-0 max-w-[340px] text-body-sm text-[var(--color-text-secondary)]">
          Confirm with Face ID, Touch ID or your security key. Nothing leaves this device — the key never reaches our
          servers.
        </p>
      </div>
      <div className="flex w-full flex-col gap-[var(--spacing-12)]">
        <Button type="button" variant="outline" className="h-11 w-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onUseAnotherMethod}>
          Use a different method
        </Button>
      </div>
    </div>
  );
}

function MfaScreen({
  code,
  onCodeChange,
  onBack,
  onVerify,
  loading,
  mfaComplete,
  remember,
  setRemember
}: {
  code: string[];
  onCodeChange: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onVerify: () => void;
  loading: boolean;
  mfaComplete: boolean;
  remember: boolean;
  setRemember: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-28)]">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start text-[var(--color-text-secondary)]"
        onClick={onBack}
      >
        <ChevronLeftIcon className="size-[15px]" aria-hidden="true" />
        Back
      </Button>
      <div className="flex flex-col gap-[var(--spacing-10)]">
        <h1 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">Verify it's you</h1>
        <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">
          Enter the 6-digit code from Lumen Authenticator, or the SMS we sent to your registered number.
        </p>
      </div>
      <div role="group" aria-label="Verification code" className="grid grid-cols-6 gap-[var(--spacing-8)]">
        {code.map((digit, i) => (
          <Input
            key={i}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            value={digit}
            onChange={(e) => onCodeChange(i, e)}
            className="h-14 p-0 text-center text-headline-sm font-semibold"
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-[var(--spacing-12)] text-body-sm text-[var(--color-text-secondary)]">
        <span>
          Didn't get it? <TextLink href="#resend">Resend code</TextLink>
        </span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] p-[var(--spacing-14)] px-[var(--spacing-16)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-title)]">Other methods</span>
        <div className="flex flex-wrap gap-[var(--spacing-8)]">
          <Button type="button" variant="outline" size="sm">
            Security key
          </Button>
          <Button type="button" variant="outline" size="sm">
            Magic link by email
          </Button>
          <Button type="button" variant="outline" size="sm">
            <ScanQrCodeIcon className="size-[14px]" aria-hidden="true" />
            Scan QR with mobile app
          </Button>
        </div>
      </div>
      <div className="inline-flex min-h-11 items-center gap-[var(--spacing-10)]">
        <Checkbox
          id="lm-enterprise-remember-mfa"
          checked={remember}
          onCheckedChange={(checked) => setRemember(checked === true)}
        />
        <label htmlFor="lm-enterprise-remember-mfa" className="cursor-pointer text-body-sm text-[var(--color-text-body)]">
          Trust this device for 30 days
        </label>
      </div>
      <Button type="button" disabled={!mfaComplete || loading} className="h-12 w-full" onClick={onVerify}>
        {loading && (
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
        )}
        Verify and continue
      </Button>
    </div>
  );
}

function DoneScreen({ orgName, region }: { orgName: string; region: string }) {
  return (
    <div className="flex flex-col items-center gap-[var(--spacing-20)] py-[var(--spacing-40)] text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-[var(--color-primary-500-a10)] text-[var(--color-primary-500)]">
        <CheckCircleFilledIcon className="size-7" aria-hidden="true" />
      </span>
      <h1 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">Signed in</h1>
      <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">
        Taking you to {orgName} · {region}
      </p>
      <span
        aria-hidden="true"
        className="size-[18px] animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-primary-500)]"
      />
    </div>
  );
}
