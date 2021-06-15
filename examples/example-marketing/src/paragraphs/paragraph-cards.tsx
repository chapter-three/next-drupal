export default function ParagraphCards({ paragraph, ...props }) {
  return (
    <section py="12|20" bg={paragraph.field_background_color} {...props}>
      <div variant="container">
        <div textAlign="center" maxW="680" mx="auto">
          {paragraph.field_heading && (
            <h2 variant="heading.h1">{paragraph.field_heading}</h2>
          )}
          {paragraph.field_text?.processed && (
            <div
              variant="text.lead"
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
            mt="20"
            gap="4|4|8|20"
            col={`1|${paragraph.field_items.length}`}
          >
            {paragraph.field_items.map((card) => (
              <div key={card.id} textAlign="center">
                <h3 variant="heading.h3">{card.field_heading}</h3>
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
