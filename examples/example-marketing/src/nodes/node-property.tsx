import Image from "next/image"
import { Icon } from "reflexjs"

export function NodePropertyGrid({ node }) {
  const thumbnail = node.field_images?.[0].field_media_image
  return (
    <article
      borderWidth="1"
      borderRadius="md"
      overflow="hidden"
      position="relative"
      bg="background"
    >
      {node.field_status ? (
        <p
          position="absolute"
          bg="text"
          color="background"
          px="2"
          py="1"
          zIndex="10"
          top="2"
          right="2"
          borderRadius="md"
          fontSize="sm"
        >
          {node.field_status === "rent" ? "For Rent" : "For Sale"}
        </p>
      ) : null}
      {thumbnail && (
        <div w="full" bg="background">
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${thumbnail.uri.url}`}
            width={360}
            height={240}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      )}
      <div p="6">
        <div
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb="2"
        >
          <p color="gray">{node.field_location.name}</p>
          {node.field_size && (
            <p display="flex" alignItems="center">
              <Icon name="outline" mr="2" /> {node.field_size}
              <span color="gray" ml="1">
                sqft
              </span>
            </p>
          )}
        </div>

        <h4 fontSize="2xl" lineHeight="tight">
          {node.title}
        </h4>
        {node.field_teaser && <p mt="2">{node.field_teaser}</p>}
        <hr />

        <div display="flex" alignItems="center" justifyContent="space-between">
          <div display="flex" alignItems="center">
            {node.field_beds && (
              <p display="flex" alignItems="center">
                <Icon name="bed" mr="2" /> {node.field_beds}
                <span color="gray" ml="1">
                  beds
                </span>
              </p>
            )}

            {node.field_baths && (
              <p display="flex" alignItems="center" ml="4">
                <Icon name="bath" mr="2" /> {node.field_baths}
                <span color="gray" ml="1">
                  baths
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export function NodePropertyList({ node }) {
  const thumbnail = node.field_images?.[0].field_media_image
  return (
    <article
      borderWidth="1"
      borderRadius="md"
      overflow="hidden"
      position="relative"
      bg="background"
    >
      {node.field_status ? (
        <p
          position="absolute"
          bg="text"
          color="background"
          px="2"
          py="1"
          zIndex="10"
          top="2"
          left="2"
          borderRadius="md"
          fontSize="sm"
        >
          {node.field_status === "rent" ? "For Rent" : "For Sale"}
        </p>
      ) : null}
      <div display="grid" col="240px 1fr">
        {thumbnail && (
          <div w="full" bg="background">
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${thumbnail.uri.url}`}
              width={240}
              height={240}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        )}
        <div py="6" px="8">
          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="2"
          >
            <p color="gray">{node.field_location.name}</p>
            {node.field_size && (
              <p display="flex" alignItems="center">
                <Icon name="outline" mr="2" /> {node.field_size}
                <span color="gray" ml="1">
                  sqft
                </span>
              </p>
            )}
          </div>

          <h4 fontSize="2xl" lineHeight="tight">
            {node.title}
          </h4>
          {node.field_teaser && <p mt="2">{node.field_teaser}</p>}
          <hr />

          <div
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div display="flex" alignItems="center">
              {node.field_beds && (
                <p display="flex" alignItems="center">
                  <Icon name="bed" mr="2" /> {node.field_beds}
                  <span color="gray" ml="1">
                    beds
                  </span>
                </p>
              )}

              {node.field_baths && (
                <p display="flex" alignItems="center" ml="4">
                  <Icon name="bath" mr="2" /> {node.field_baths}
                  <span color="gray" ml="1">
                    baths
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
