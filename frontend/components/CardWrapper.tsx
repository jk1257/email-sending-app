"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface CardWrapperProps {
  label: string
  title: string
  children: React.ReactNode
}

const CardWrapper = ({ label, title, children }: CardWrapperProps) => {
  return (
    <Card className="w-full h-full shadow-md">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm">{label}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

export default CardWrapper
