import {
  DrupalClient,
  // NextDrupal
} from "next-drupal"

const baseUrl: string = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || ""
const clientId = process.env.DRUPAL_CLIENT_ID || ""
const clientSecret = process.env.DRUPAL_CLIENT_SECRET || ""

export const drupal = new DrupalClient(baseUrl, {
  auth: {
    clientId,
    clientSecret,
  },
  debug: true,
})

// TODO: Once you have migrated fully to App Router, switch to the leaner
//  NextDrupal class (which contains none of the Pages Router-specific methods.)
// export const drupal = new NextDrupal(baseUrl, {
//   auth: {
//     clientId,
//     clientSecret,
//   },
//   debug: true,
// })
