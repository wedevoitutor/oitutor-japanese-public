import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const DEV_TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

let turnstileScriptPromise;

function getTurnstileSiteKey() {
  return import.meta.env.VITE_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? DEV_TURNSTILE_SITE_KEY : '');
}

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

/**
 * Cloudflare Turnstile widget for Supabase Auth CAPTCHA tokens.
 *
 * @param {{ onTokenChange: (token: string) => void }} props
 */
export default function AuthCaptcha({ onTokenChange }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = getTurnstileSiteKey();
  const [errorKey, setErrorKey] = useState(siteKey ? '' : 'auth.captchaMissing');

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      onTokenChange('');
      return undefined;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          size: 'flexible',
          callback: (token) => {
            setErrorKey('');
            onTokenChange(token);
          },
          'expired-callback': () => onTokenChange(''),
          'error-callback': (code) => {
            onTokenChange('');
            setErrorKey(code === '110200' ? 'auth.captchaDomainNotAllowed' : 'auth.captchaUnavailable');
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          onTokenChange('');
          setErrorKey('auth.captchaUnavailable');
        }
      });

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Turnstile can already have discarded a failed widget.
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, onTokenChange]);

  if (!siteKey) {
    return (
      <p className="rounded-xl border border-[#ff6b5f]/25 bg-[#3d1115]/55 px-3 py-2 text-sm text-[#ff9a91]">
        {t(errorKey)}
      </p>
    );
  }

  return (
    <div className="text-left">
      <div className="flex min-h-[74px] max-w-full items-center justify-center overflow-hidden rounded-xl border border-white/14 bg-white/[0.06] px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div ref={containerRef} className="w-full max-w-full" />
      </div>
      {errorKey && (
        <p className="mt-2 text-sm text-[#ff9a91]">{t(errorKey)}</p>
      )}
    </div>
  );
}
