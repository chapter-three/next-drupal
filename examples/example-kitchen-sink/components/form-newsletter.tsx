export function FormNewsletter({ ...props }) {
  return (
    <form className="relative">
      <input
        type="email"
        placeholder="Your email address..."
        className="flex w-full pl-8 pr-48 text-sm bg-white border-0 placeholder:text-gray-400 py-7 rounded-3xl"
      />
      <button
        type="submit"
        className="h-[60px] absolute top-2 right-2 px-10 text-sm text-white bg-black rounded-2xl"
      >
        Subscribe
      </button>
    </form>
  )
}
