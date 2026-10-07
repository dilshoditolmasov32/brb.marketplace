/** FAQPage structured data so search engines can show the questions directly */
export function useFaqStructuredData(
  items: MaybeRefOrGetter<{ question: string; answer: string }[]>,
) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () =>
          JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: toValue(items).map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }),
      },
    ],
  })
}
