import type { PostHog } from 'posthog-js';
import { consentKey, eventNames, safeProperties, type AnalyticsProperties } from './analytics-policy';
import { locales, type Locale } from '../i18n/locales';

// Project ingestion token is public, never a personal/API-management credential.
const token = import.meta.env.PUBLIC_POSTHOG_KEY || 'phc_r8W8GxvHDjqQ8iSoQd7MajYos4Ch4FDsnyFvNgYEJeZz';
const host = 'https://eu.i.posthog.com';
let client: PostHog | undefined;
let loading: Promise<void> | undefined;
let lastTool: string | undefined;
let ready = false;
let lastPage = '';

export function analyticsAvailable(): boolean {
  if (typeof window === 'undefined' || import.meta.env.PUBLIC_POSTHOG_ENABLED === 'false') return false;
  return ['doctorconverter.com', 'www.doctorconverter.com'].includes(location.hostname) || import.meta.env.PUBLIC_POSTHOG_LOCAL === 'true';
}

export function analyticsConsent(): 'accepted' | 'rejected' | null {
  try {
    const value = localStorage.getItem(consentKey);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch { return null; }
}

function permitted(): boolean {
  return analyticsAvailable() && analyticsConsent() === 'accepted' && navigator.doNotTrack !== '1'
    && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
}

function pageContext() {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  const url = new URL(canonical || '/', 'https://doctorconverter.com');
  const language = document.documentElement.lang.toLowerCase().split('-')[0];
  const locale: Locale = locales.find((supported) => supported === language) ?? 'en';
  return { $current_url: `https://doctorconverter.com${url.pathname}`, $pathname: url.pathname,
    $host: 'doctorconverter.com', locale,
    environment: location.hostname.endsWith('doctorconverter.com') ? 'production' : 'development' };
}

// SDK enrichment can include query strings/referrers. Replace it with this strict allowlist
// immediately before transport; raw URLs, console messages, inputs and backend IDs never pass.
const sdkFields = new Set(['token', 'distinct_id', '$device_id', '$session_id', '$window_id', '$lib', '$lib_version',
  '$browser', '$browser_version', '$os', '$os_version', '$device_type', '$screen_width', '$screen_height']);

export async function syncAnalytics(): Promise<void> {
  if (!permitted()) {
    ready = false;
    client?.opt_out_capturing();
    return;
  }
  if (ready) return;
  if (loading) return loading;
  loading = (async () => {
    try {
      const { default: posthog } = await import('posthog-js');
      if (!permitted()) return;
      if (!client) {
        client = posthog.init(token, {
          api_host: host, ui_host: 'https://eu.posthog.com',
          autocapture: false, capture_pageview: false, capture_pageleave: false,
          capture_dead_clicks: false, rageclick: false, capture_heatmaps: false,
          capture_exceptions: false, capture_performance: false,
          disable_session_recording: true, disable_surveys: true,
          disable_product_tours: true, disable_conversations: true, disable_external_dependency_loading: true,
          advanced_disable_flags: true, person_profiles: 'never', persistence: 'localStorage',
          save_referrer: false, save_campaign_params: false,
          disable_compression: import.meta.env.PUBLIC_POSTHOG_LOCAL === 'true',
          opt_out_useragent_filter: import.meta.env.PUBLIC_POSTHOG_LOCAL === 'true',
          respect_dnt: true, cross_subdomain_cookie: false,
          before_send: event => {
            if (!event || !permitted() || !eventNames.has(event.event)) return null;
            const source = event.properties ?? {};
            const properties: Record<string, unknown> = { ...safeProperties(source), ...pageContext(), $process_person_profile: false };
            for (const key of sdkFields) if (typeof source[key] === 'string' || typeof source[key] === 'number') properties[key] = source[key];
            return { ...event, properties };
          },
        });
      }
      client?.opt_in_capturing({ captureEventName: false });
      ready = true;
      pageViewed();
      if (lastTool) track('tool_viewed', { tool: lastTool });
    } catch { ready = false; } // Analytics must never block document processing.
    finally { loading = undefined; }
  })();
  return loading;
}

export function setAnalyticsConsent(accepted: boolean): void {
  try { localStorage.setItem(consentKey, accepted ? 'accepted' : 'rejected'); } catch { /* Fail closed. */ }
  if (!accepted) {
    lastPage = '';
    ready = false;
    client?.opt_out_capturing();
  }
  void syncAnalytics();
}

export function track(event: string, properties: AnalyticsProperties = {}): boolean {
  if (typeof window === 'undefined') return false;
  if (event === 'tool_viewed') lastTool = properties.tool;
  if (!ready || !permitted() || !eventNames.has(event)) return false;
  try { return Boolean(client?.capture(event, safeProperties(properties))); } catch { return false; }
}

const outcomes = new Set<string>();
export function trackOutcome(jobId: string, event: string, properties: AnalyticsProperties): void {
  const key = `dc-analytics-outcome:${jobId}:${event}`;
  try { if (outcomes.has(key) || sessionStorage.getItem(key)) return; } catch { /* In-memory deduplication remains. */ }
  if (track(event, properties)) {
    outcomes.add(key);
    try { sessionStorage.setItem(key, '1'); } catch { /* Storage can be unavailable. */ }
  }
}

export function pageViewed(): void {
  const path = pageContext().$pathname;
  if (!ready || lastPage === path) return;
  lastPage = path;
  track('$pageview');
}
