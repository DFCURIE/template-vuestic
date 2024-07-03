/**
 * Object within the `window.dataLayer`.
 *
 * @see [developers.google.com/tag-manager/devguide](https://developers.google.com/tag-manager/devguide)
 */
interface DataLayerObject extends Record<string, any> {
    event?: string;
}

/** GTM Container ID pattern. */
declare const GTM_ID_PATTERN: RegExp;
/**
 * Assert that the given id is a valid GTM Container ID.
 *
 * Tested against pattern: `/^GTM-[0-9A-Z]+$/`.
 *
 * @param id A GTM Container ID.
 */
declare function assertIsGtmId(id: string): asserts id;

/**
 * Query parameter object that will be send to GTM.
 */
interface GtmQueryParams {
    /**
     * GTM auth environment parameter.
     */
    gtm_auth: string;
    /**
     * GTM preview environment parameter.
     */
    gtm_preview: string;
    /**
     * GTM cookies win environment parameter.
     */
    gtm_cookies_win: string;
}
/**
 * GTM ID Container.
 */
interface GtmIdContainer {
    /**
     * GTM Container ID.
     */
    id: string;
    /**
     * Add url query string when load gtm.js with GTM ID.
     */
    queryParams?: GtmQueryParams;
}

/**
 * Options passed to GTM Support.
 */
interface GtmSupportOptions {
    /**
     * Your GTM single container ID, array of container ids or array of objects.
     *
     * @example
     *     'GTM-xxxxxx'
     *     // or
     *     ['GTM-xxxxxx', 'GTM-yyyyyy']
     *     // or
     *     [{
     *       id: 'GTM-xxxxxx',
     *       queryParams: {
     *         gtm_auth: 'abc123',
     *         gtm_preview: 'env-4',
     *         gtm_cookies_win: 'x'
     *       }
     *     }, {
     *       id: 'GTM-yyyyyy',
     *       queryParams: {
     *         gtm_auth: 'abc234',
     *         gtm_preview: 'env-5',
     *         gtm_cookies_win: 'x'
     *       }
     *     }]
     */
    id: string | string[] | GtmIdContainer[];
    /**
     * Add url query string when load gtm.js with GTM ID.
     */
    queryParams?: GtmQueryParams;
    /**
     * Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible).
     *
     * Defaults to false, so the script is loaded `async` by default.
     *
     * @default false
     */
    defer?: boolean;
    /**
     * Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`.
     *
     * @default false
     */
    compatibility?: boolean;
    /**
     * Will add specified MIME type to script tag.
     */
    scriptType?: string;
    /**
     * Will add `nonce` to the script tag.
     *
     * @see [Using Google Tag Manager with a Content Security Policy](https://developers.google.com/tag-manager/web/csp)
     */
    nonce?: string;
    /**
     * The URL of the script; useful for server-side GTM.
     *
     * @default https://www.googletagmanager.com/gtm.js
     */
    source?: string;
    /**
     * Plugin can be disabled by setting this to `false`.
     *
     * @example enabled: !!GDPR_Cookie
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether or not to display console logs debugs.
     */
    debug?: boolean;
    /**
     * Whether or not to load the GTM Script.
     *
     * Helpful if you are including GTM manually, but need the dataLayer functionality in your components.
     */
    loadScript?: boolean;
    /**
     * The property of Track view event.
     *
     * @example trackViewEventProperty: 'track-view-event-demo'
     *
     * @default content-view
     */
    trackViewEventProperty?: string;
}

/**
 * Object definition for a track event.
 */
interface TrackEventOptions {
    [key: string]: any;
    event?: string;
    category?: any;
    action?: any;
    label?: any;
    value?: any;
    noninteraction?: boolean;
}
/**
 * The GTM Support main class.
 */
declare class GtmSupport {
    /** GTM Container ID. */
    readonly id: string | string[] | GtmIdContainer[];
    /** GTM Support Options. */
    readonly options: Omit<GtmSupportOptions, 'id'>;
    readonly scriptElements: HTMLScriptElement[];
    /**
     * Constructs a new `GtmSupport` instance.
     *
     * @param options Options.
     */
    constructor(options: GtmSupportOptions);
    /**
     * Whether the script is running in a browser or not.
     *
     * You can override this function if you need to.
     *
     * @returns `true` if the script runs in browser context.
     */
    isInBrowserContext: () => boolean;
    /**
     * Check if plugin is enabled.
     *
     * @returns `true` if the plugin is enabled, otherwise `false`.
     */
    enabled(): boolean;
    /**
     * Enable or disable plugin.
     *
     * When enabling with this function, the script will be attached to the `document` if:
     *
     * - the script runs in browser context
     * - the `document` doesn't have the script already attached
     * - the `loadScript` option is set to `true`
     *
     * @param enabled `true` to enable, `false` to disable. Default: `true`.
     * @param source The URL of the script, if it differs from the default. Default: 'https://www.googletagmanager.com/gtm.js'.
     */
    enable(enabled?: boolean, source?: string): void;
    /**
     * Check if plugin is in debug mode.
     *
     * @returns `true` if the plugin is in debug mode, otherwise `false`.
     */
    debugEnabled(): boolean;
    /**
     * Enable or disable debug mode.
     *
     * @param enable `true` to enable, `false` to disable.
     */
    debug(enable: boolean): void;
    /**
     * Returns the `window.dataLayer` array if the script is running in browser context and the plugin is enabled,
     * otherwise `false`.
     *
     * @returns The `window.dataLayer` if script is running in browser context and plugin is enabled, otherwise `false`.
     */
    dataLayer(): DataLayerObject[] | false;
    /**
     * Track a view event with `event: "content-view"`.
     *
     * The event will only be send if the script runs in browser context and the plugin is enabled.
     *
     * If debug mode is enabled, a "Dispatching TrackView" is logged,
     * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
     *
     * @param screenName Name of the screen passed as `"content-view-name"`.
     * @param path Path passed as `"content-name"`.
     * @param additionalEventData Additional data for the event object. `event`, `"content-name"` and `"content-view-name"` will always be overridden.
     */
    trackView(screenName: string, path: string, additionalEventData?: Record<string, any>): void;
    /**
     * Track an event.
     *
     * The event will only be send if the script runs in browser context and the plugin is enabled.
     *
     * If debug mode is enabled, a "Dispatching event" is logged,
     * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
     *
     * @param param0 Object that will be used for configuring the event object passed to GTM.
     * @param param0.event `event`, default to `"interaction"` when pushed to `window.dataLayer`.
     * @param param0.category Optional `category`, passed as `target`.
     * @param param0.action Optional `action`, passed as `action`.
     * @param param0.label Optional `label`, passed as `"target-properties"`.
     * @param param0.value Optional `value`, passed as `value`.
     * @param param0.noninteraction Optional `noninteraction`, passed as `"interaction-type"`.
     */
    trackEvent({ event, category, action, label, value, noninteraction, ...rest }?: TrackEventOptions): void;
    /**
     * Track an event by pushing the custom data directly to the `window.dataLayer`.
     *
     * The event will only be send if the script runs in browser context and the plugin is enabled.
     *
     * If debug mode is enabled, a "Dispatching event" is logged,
     * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
     *
     * @param data Event data object that is pushed to the `window.dataLayer`.
     */
    push(data: DataLayerObject): void;
}

/**
 *  OnReadyOptions.
 */
interface OnReadyOptions {
    /**
     * The GTM id.
     */
    id: string;
    /**
     * The script element.
     */
    script: HTMLScriptElement;
}
/**
 * Options for `loadScript` function.
 */
interface LoadScriptOptions {
    /**
     * Add url query string when load gtm.js with GTM ID.
     */
    queryParams?: GtmQueryParams;
    /**
     * Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible).
     */
    defer: boolean;
    /**
     * Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`.
     */
    compatibility: boolean;
    /**
     * Will add specified MIME type to script tag.
     */
    scriptType?: string;
    /**
     * Will add `nonce` to the script tag.
     *
     * @see [Using Google Tag Manager with a Content Security Policy](https://developers.google.com/tag-manager/web/csp)
     */
    nonce?: string;
    /**
     * Where to append the script element.
     *
     * @default document.body
     */
    parentElement?: HTMLElement;
    /**
     * The URL of the script; useful for server-side GTM.
     *
     * @default https://www.googletagmanager.com/gtm.js
     */
    source?: string;
    /**
     * Will be called when the script is loaded.
     *
     * @param options Object containing container `id` and `script` element.
     */
    onReady?: (options: OnReadyOptions) => void;
}
/**
 * Load GTM script tag.
 *
 * @param id GTM ID.
 * @param config The config object.
 *
 * @returns The script element.
 */
declare function loadScript(id: string, config: LoadScriptOptions): HTMLScriptElement;
/**
 * Check if GTM script is in the document.
 *
 * @param source The URL of the script, if it differs from the default. Default: 'https://www.googletagmanager.com/gtm.js'.
 *
 * @returns `true` if in the `document` is a `script` with `src` containing `'https://www.googletagmanager.com/gtm.js'` (or `source` if specified), otherwise `false`.
 */
declare function hasScript(source?: string): boolean;

declare global {
    interface Window {
        /**
         * `dataLayer` used by GTM.
         *
         * @see [developers.google.com/tag-manager/devguide](https://developers.google.com/tag-manager/devguide)
         */
        dataLayer?: DataLayerObject[];
    }
}

export { DataLayerObject, GTM_ID_PATTERN, GtmIdContainer, GtmQueryParams, GtmSupport, GtmSupportOptions, LoadScriptOptions, OnReadyOptions, TrackEventOptions, assertIsGtmId, hasScript, loadScript };
