import { useEffect } from "react";

/**
 * Component that mounts analytics conditional to some environment variables
 */
export const GoogleAnalytics = () => {
    useEffect(() => {
        // google analytics setup
        const gaTag = import.meta.env.VITE_GOOGLE_ANALYTICS_TRACKING_ID;
        const isProd = import.meta.env.PROD;
        const hasPreviousScript1 = document.getElementById(
            "google-analytics-script1"
        );
        const hasPreviousScript2 = document.getElementById(
            "google-analytics-script2"
        );

        if (isProd && gaTag && !hasPreviousScript1 && !hasPreviousScript2) {
            // this is the requested tag by GA, I had to transform to work within useEffect
            // <script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GOOGLE_ANALYTICS_TRACKING_ID%"></script>
            const script1 = document.createElement("script");
            script1.id = "google-analytics-script1";
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaTag}`;
            document.querySelector("head").appendChild(script1);

            // this is the requested tag by GA, I had to transform to work within useEffect
            // <script>
            //     window.dataLayer = window.dataLayer || [];
            //     function gtag(){dataLayer.push(arguments);}
            //     gtag('js', new Date());
            //     gtag('config', "%VITE_GOOGLE_ANALYTICS_TRACKING_ID%", { 'anonymize_ip': true });
            // </script>
            const script2 = document.createElement("script");
            script2.id = "google-analytics-script2";
            script2.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${gaTag}, { 'anonymize_ip': true });
            `;
            document.querySelector("head").appendChild(script2);
        }

        // returning a function in useEffect is used for cleanup
        return () => {
            const s1 = document.getElementById("google-analytics-script1");
            if (s1) {
                document.head.removeChild(s1);
            }
            const s2 = document.getElementById("google-analytics-script2");
            if (s2) {
                document.head.removeChild(s2);
            }
        };
    }, []); // empty dependency array makes this run once
};

/**
 * Component that mounts conditionally the matomo analytics tag only in production
 */
export const MatomoAnalytics = () => {
    useEffect(() => {
        const matomoanalytics = import.meta.env.VITE_MATOMO_ANALYTICS_URL;
        const isProd = import.meta.env.PROD;
        const hasMatomoAnalytics = document.getElementById("matomo-analytics");
        if (isProd && matomoanalytics && !hasMatomoAnalytics) {
            const sc = document.createElement("script");
            sc.id = "matomo-analytics";
            sc.innerHTML = `
                var _paq = window._paq = window._paq || [];
                /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                (function() {
                    var u="https://" + ${matomoanalytics} + "/";
                    _paq.push(['setTrackerUrl', u + 'matomo.php']);
                    _paq.push(['setSiteId', '18']);
                    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                    g.async=true;
                    g.src="https://cdn.matomo.cloud/" + ${matomoanalytics} + "/matomo.js";
                    s.parentNode.insertBefore(g,s);
                })();
            `;
            document.head.appendChild(sc);
        }
        // returning a function in useEffect is used for cleanup
        return () => {
            const m1 = document.getElementById("matomo-analytics");
            if (m1) {
                document.head.removeChild(m1);
            }
        };
    }, []); // empty dependency array to only run once
};
