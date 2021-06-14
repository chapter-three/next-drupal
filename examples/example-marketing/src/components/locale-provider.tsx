import * as React from "react"

interface LocaleContextProps {
  paths: {
    locale: string
    path: string
  }[]
  setPaths: React.Dispatch<React.SetStateAction<LocaleContextProps["paths"]>>
}

const LocaleContext = React.createContext<LocaleContextProps>(null)

export function useLocale() {
  return React.useContext(LocaleContext)
}

interface LocaleProviderProps {
  children?: React.ReactNode
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [paths, setPaths] = React.useState<LocaleContextProps["paths"]>(null)

  return (
    <LocaleContext.Provider value={{ paths, setPaths }}>
      {children}
    </LocaleContext.Provider>
  )
}
