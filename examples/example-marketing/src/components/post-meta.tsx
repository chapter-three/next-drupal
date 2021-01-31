import { formatDate } from "src/utils/format-date"

export function PostMeta({ post, ...props }) {
  return (
    <div
      display="flex"
      flexDirection="column|row"
      fontFamily="sans"
      color="gray"
      mt="4"
      {...props}
    >
      {post.uid?.field_name ? (
        <span display="inline-block" mr="4">
          Posted by{" "}
          <strong fontWeight="semibold">{post.uid?.field_name}</strong>
        </span>
      ) : null}
      <span mt="2|0"> - {formatDate(post.created)}</span>
    </div>
  )
}
