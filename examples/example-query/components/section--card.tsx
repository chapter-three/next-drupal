import { SectionCard } from "types"
import { Card } from "./card"

interface SectionCardProps {
  section: SectionCard
}

export function SectionCard({ section }: SectionCardProps) {
  return <Card title={section.heading} media={section.image} />
}
