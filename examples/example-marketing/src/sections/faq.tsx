export default function FAQ({ section, ...props }) {
  return (
    <section py="6|12|20" bg={section.field_background_color} {...props}>
      <div variant="container">
        <div textAlign="center">
          {section.field_heading && (
            <h2 variant="heading.h1">{section.field_heading}</h2>
          )}
          {section.field_text?.processed && (
            <div
              variant="text.lead"
              maxW="680"
              mx="auto"
              mt="2"
              dangerouslySetInnerHTML={{
                __html: section.field_text?.processed,
              }}
            />
          )}
        </div>
        {section.field_items && (
          <div display="grid" mt="20" gap="20" rowGap="10" col="2">
            {section.field_items.map((card) => (
              <div key={card.id}>
                <h4 variant="heading.h4" fontFamily="sans">
                  {card.field_heading}
                </h4>
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
