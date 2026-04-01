// Docs: https://developers.google.com/safe-browsing/reference/rest/v4/threatMatches/find

/**
 * Test with these:
 * http://malware.testing.google.test/testing/malware/
 * http://phishing.testing.google.test/testing/phishing/
 */

interface IScanUrlResponse {
  matches?: {
    threatType: string;
  }[];
}

export const scanUrl = async (url: string) => {
  const config = useRuntimeConfig();

  const response = await $fetch<IScanUrlResponse>(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${config.GOOGLE_SAFE_BROWSING_API_KEY}`,
    {
      method: HTTP_METHOD.POST,
      headers: { "Content-Type": "application/json" },
      body: {
        client: {
          clientId: "slinky-nuxt-app",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatEntries: [{ url }],
          threatEntryTypes: ["URL"],
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
        },
      },
    },
  );

  if (response.matches?.length) throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: `URL is flagged as ${(response.matches[0]?.threatType ?? "UNSAFE")}.`,
  });

  return;
};