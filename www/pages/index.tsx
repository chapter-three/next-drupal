import { site } from "@/config/site"
import { Layout } from "../components/layout"

export default function IndexPage() {
  return <Layout title={site.name}>index</Layout>
}
