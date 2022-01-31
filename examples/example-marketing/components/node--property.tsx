import Image from "next/image"

import { NodeProps } from "components/node"

export function NodeProperty({ node, viewMode, ...props }: NodeProps) {
  if (viewMode === "list") {
    return <NodePropertyList node={node} {...props} />
  }

  return <NodePropertyGrid node={node} {...props} />
}

export function NodePropertyGrid({ node }) {
  const thumbnail = node.field_images?.[0].field_media_image

  return (
    <article
      className="relative overflow-hidden bg-white border rounded-md"
      data-cy="node--property"
    >
      {node.field_status ? (
        <p className="absolute z-10 px-2 py-1 text-sm text-white bg-black rounded-md top-2 right-2">
          {node.field_status === "rent" ? "For Rent" : "For Sale"}
        </p>
      ) : null}
      {thumbnail && (
        <Image
          src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${thumbnail.uri.url}`}
          width={360}
          height={240}
          layout="responsive"
          objectFit="cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500">{node.field_location.name}</p>
          {node.field_size && (
            <p className="flex items-center">
              {node.field_size}
              <span className="ml-1 text-gray-500">sqft</span>
            </p>
          )}
        </div>
        <h4 className="text-lg font-semibold">{node.title}</h4>
        {node.field_teaser && (
          <p className="hidden mt-2 lg:block">{node.field_teaser}</p>
        )}
        <hr className="my-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {node.field_beds && (
              <p className="flex items-center">
                {node.field_beds}
                <span className="ml-1 text-gray-500">beds</span>
              </p>
            )}
            {node.field_baths && (
              <p className="flex items-center ml-4">
                {node.field_baths}
                <span className="ml-1 text-gray-500">baths</span>
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
    <article className="relative overflow-hidden bg-white border rounded-md">
      {node.field_status ? (
        <p className="absolute z-10 px-2 py-1 text-sm text-white bg-black rounded-md top-8 left-8">
          {node.field_status === "rent" ? "For Rent" : "For Sale"}
        </p>
      ) : null}
      <div className="grid items-start grid-cols-3 p-6">
        {thumbnail && (
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${thumbnail.uri.url}`}
            width={310}
            height={310}
            layout="responsive"
            objectFit="cover"
            className="rounded-lg"
          />
        )}
        <div className="col-span-2 px-6">
          <div className="items-center justify-between hidden mb-2 md:flex">
            <p className="text-gray-500">{node.field_location.name}</p>
            {node.field_size && (
              <p className="flex items-center">
                {node.field_size}
                <span className="ml-1 text-gray-500">sqft</span>
              </p>
            )}
          </div>
          <h4 className="text-lg font-semibold">{node.title}</h4>
          {node.field_teaser && (
            <p className="hidden mt-2 md:block">{node.field_teaser}</p>
          )}
          <hr className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {node.field_beds && (
                <p className="flex items-center">
                  {node.field_beds}
                  <span className="ml-1 text-gray-500">beds</span>
                </p>
              )}
              {node.field_baths && (
                <p className="flex items-center ml-4">
                  {node.field_baths}
                  <span className="ml-1 text-gray-500">baths</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
