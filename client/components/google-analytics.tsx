import Script from "next/script";

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-KB8XNXMCKZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KB8XNXMCKZ');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
