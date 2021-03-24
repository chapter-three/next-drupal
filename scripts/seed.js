const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const faker = require("faker")
const yaml = require("yaml")

const article = require("./stubs/article.json")

const directory = path.resolve(
  process.cwd(),
  "modules/next/modules/next_default_content/content/node"
)
fs.rmdirSync(directory, { recursive: true })
fs.mkdirSync(directory)

const sites = [
  {
    target_id: "example_blog",
  },
  {
    target_id: "example_marketing",
  },
]

for (let count = 1; count <= process.env.NUM_NODES; count++) {
  const uuid = uuidv4()
  const dest = path.resolve(directory, `${uuid}.yml`)

  // Randomize article.
  article._meta.uuid = uuid
  article.default.title[0].value = faker.lorem.sentence()
  article.default.promote[0].value = faker.random.boolean()
  article.default.field_site = faker.random.arrayElements(
    sites,
    faker.random.number({
      min: 1,
      max: 2,
    })
  )

  const doc = new yaml.Document()
  doc.contents = article
  fs.writeFileSync(dest, doc.toString())
}
