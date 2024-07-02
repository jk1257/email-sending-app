import Link from "next/link"


import { ThemeToggle } from "@/components/theme-toggle"
import { HomeIcon } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-12 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
        {/* <HomeIcon className="h-[1.5rem] w-[1.3rem]" ></HomeIcon> */}
          <span className="inline-block font-bold">Home</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

