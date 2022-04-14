export function FormNewsletter({ ...props }) {
  return (
    <form className="relative">
      <input
        type="email"
        placeholder="Your email address..."
        className="flex w-full py-4 pl-4 pr-16 text-sm bg-white border-0 md:pl-8 md:pr-48 placeholder:text-gray-400 lg:py-7 rounded-3xl"
      />
      <button
        type="submit"
        className="w-11 h-11 rounded-full md:w-auto md:h-[36px] lg:h-[60px] absolute top-1 right-1 flex justify-center items-center hover:bg-primary md:top-2 md:right-2 md:px-10 text-sm text-white bg-black md:rounded-2xl"
      >
        <span className="hidden md:inline">Subscribe</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="md:hidden"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  )
}
