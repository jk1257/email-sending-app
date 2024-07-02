/** @format */
"use client"

import { useState } from "react"
import { useWindowWidth } from "@react-hook/window-size"
import { ChevronRight, LayoutDashboard, Mail, ShoppingCart } from "lucide-react"

import { Button } from "./ui/button"
import { Nav } from "./ui/nav"

type Props = {}

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const onlyWidth = useWindowWidth()
  const mobileWidth = onlyWidth < 768

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="relative min-w-[80px] border-r px-3  pb-10 pt-24 ">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Email",
            href: "/email",
            icon: Mail,
            variant: "ghost",
          },
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            variant: "default",
          },
        ]}
      />
    </div>
  )
}
