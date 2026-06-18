export function detectMacPlatform(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    const navigatorWithUserAgentData = window.navigator as Navigator & {
        userAgentData?: { platform?: string };
    };

    return navigatorWithUserAgentData.userAgentData
        ? navigatorWithUserAgentData.userAgentData.platform === 'macOS'
        : /Mac/i.test(window.navigator.userAgent);
}
