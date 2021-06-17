export default function IndexPage() {
  return null
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/docs",
    },
  }
}
