interface NodeProperty {
  id: string
  title: string
  field_location: {
    name: string
    drupal_internal__tid: string
  }
}

export interface DrupalMetatag {
  tag: string
  attributes: {
    content: string
    name?: string
    rel?: string
  }
}
