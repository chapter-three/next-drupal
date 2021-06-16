export default function ParagraphFAQ({ paragraph, ...props }) {
  return (
    <section py="12|20" bg={paragraph.field_background_color} {...props}>
      <div variant="container">
        <div textAlign="center">
          {paragraph.field_heading && (
            <h2 variant="heading.h1">{paragraph.field_heading}</h2>
          )}
          {paragraph.field_text?.processed && (
            <div
              variant="text.lead"
              maxW="680"
              mx="auto"
              mt="2"
              dangerouslySetInnerHTML={{
                __html: paragraph.field_text?.processed,
              }}
            />
          )}
        </div>
        {paragraph.field_items && (
          <div
            display="grid"
            mt="10|20"
            gap="4|6|20"
            rowGap="4|6|10"
            col="1|1|2"
          >
            {paragraph.field_items.map((card) => (
              <div key={card.id}>
                <h3 variant="heading.h4" fontFamily="sans">
                  {card.field_heading}
                </h3>
                {card.field_text?.processed && (
                  <div
                    variant="text.paragraph"
                    mt="2"
                    dangerouslySetInnerHTML={{
                      __html: card.field_text?.processed,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
