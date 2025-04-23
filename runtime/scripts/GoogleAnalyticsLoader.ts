/**
 * @implements {GoogleAnalyticsLoader}
 * @memberof module:GoogleAnalytics
 */
class GoogleAnalyticsLoader {
  analyticsId: string;

  constructor({ config }) {
    this.analyticsId = config.GOOGLE_ANALYTICS_4_ID;
  }

  loadScript() {
    if (!this.analyticsId) {
      return;
    }

    global.googleAnalytics = global.googleAnalytics || [];
    // @ts-expect-error We just added googleAnalytics to global, it's there.
    const { googleAnalytics } = global;

    // If the snippet was invoked do nothing.
    if (googleAnalytics.invoked) {
      return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    googleAnalytics.invoked = true;

    googleAnalytics.load = (key, options) => {
      const scriptSrc = document.createElement('script');
      scriptSrc.type = 'text/javascript';
      scriptSrc.async = true;
      scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${key}`;

      const scriptGtag = document.createElement('script');
      scriptGtag.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${key}');
      `;

      // Insert our scripts next to the first script element.
      const first = document.getElementsByTagName('script')[0];
      if (first?.parentNode === null) {
        throw new Error('No script to insert Google analytics script before.');
      }
      first.parentNode.insertBefore(scriptSrc, first);
      first.parentNode.insertBefore(scriptGtag, first);
      googleAnalytics._loadOptions = options;
    };

    // Load GoogleAnalytics with your key.
    googleAnalytics.load(this.analyticsId);
  }
}

export default GoogleAnalyticsLoader;
