import { site } from "@/config/site"

export function Footer({ ...props }) {
  return (
    <section py={[8, 10, 12]} {...props}>
      <div variant="container">
        <div
          display="flex"
          alignItems="flex-start|center"
          flexDirection="column|row"
          justifyContent="space-between"
          borderTopWidth="1"
          pt="4"
        >
          {site.copyright && (
            <p variant="text.sm" w="full|auto" textAlign="center|left" my="0">
              {site.copyright}
            </p>
          )}
          {site.links?.length && (
            <div
              display="none|grid"
              col={`2|repeat(${site.links.length}, auto)`}
              gap="4|4|8"
              mt="4|4|0"
            >
              {site.links.map((link, index) => (
                <a
                  key={index}
                  variant="text"
                  href={link.url}
                  textAlign="left|center"
                  target={link.external ? "_blank" : "_self"}
                  _hover={{
                    color: "primary",
                  }}
                  rel="noreferrer"
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
