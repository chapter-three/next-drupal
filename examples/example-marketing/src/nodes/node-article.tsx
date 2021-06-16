import Link from "next/link"
import { Icon } from "reflexjs"
import Image from "next/image"

import { formatDate } from "@utils/format-date"

export function NodeArticle({ node, ...props }) {
  return (
    <article {...props}>
      <div variant="container" py="4">
        <div display="flex" flexDirection="column">
          {node.field_image?.uri && (
            <div rounded="sm" overflow="hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
                width={1200}
                height={600}
                layout="intrinsic"
                objectFit="cover"
              />
            </div>
          )}
          <div
            flex="1"
            boxShadow="none|xl"
            p="0|10"
            pt="4|10"
            mt="0|-20"
            mx="0|10"
            position="relative"
            zIndex="100"
            bg="background"
          >
            <h1 variant="heading.title">{node.title}</h1>
            <div
              display="flex"
              flexDirection="column|row"
              fontFamily="sans"
              color="gray"
              mt="4"
            >
              {node.uid?.field_name ? (
                <span display="inline-block" mr="4">
                  Posted by{" "}
                  <strong fontWeight="semibold">{node.uid?.field_name}</strong>
                </span>
              ) : null}
              <span mt="2|0"> - {formatDate(node.created)}</span>
            </div>
          </div>
        </div>

        <div pt="0|12" maxWidth="700" mx="auto">
          {node.body?.summary ? (
            <p variant="text.lead" mt="4">
              {node.body.summary}
            </p>
          ) : null}

          {node.body?.processed && (
            <div
              dangerouslySetInnerHTML={{ __html: node.body?.processed }}
              sx={{
                p: {
                  variant: "text",
                  fontSize: "xl",
                  my: 8,
                  lineHeight: 8,
                },
              }}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export function NodeArticleTeaser({ node, ...props }) {
  return (
    <article mt="10" {...props}>
      {node.field_image?.uri && (
        <div my="4">
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}`}
            width={800}
            height={450}
            layout="intrinsic"
            objectFit="cover"
          />
        </div>
      )}
      <h2 variant="heading.h3" my="4">
        <Link href={node.path.alias} passHref>
          <a
            color="heading"
            textDecoration="none"
            _hover={{
              color: "primary",
            }}
          >
            {node.title}
          </a>
        </Link>
      </h2>
      <div
        display="flex"
        flexDirection="column|row"
        fontFamily="sans"
        color="gray"
        mt="4"
        fontSize="sm"
      >
        {node.uid?.field_name ? (
          <span display="inline-block" mr="4">
            Posted by{" "}
            <strong fontWeight="semibold">{node.uid?.field_name}</strong>
          </span>
        ) : null}
        <span mt="2|0"> - {formatDate(node.created)}</span>
      </div>
      {node.body?.summary ? (
        <p variant="text.paragraph" mt="4">
          {node.body.summary}
        </p>
      ) : null}
      <Link href={node.path.alias} passHref>
        <a
          display="inline-flex"
          lineHeight="none"
          alignItems="center"
          fontSize="sm"
          color="text"
          textDecoration="none"
          _hover={{
            color: "primary",
          }}
        >
          Read more <Icon name="arrow" size="4" ml="2" />
        </a>
      </Link>
    </article>
  )
}
