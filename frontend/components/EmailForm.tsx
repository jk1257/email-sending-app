"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import CardWrapper from "./CardWrapper"
import { Textarea } from "./ui/textarea"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters",
  }),
  body: z.string().min(10, {
    message: "Message must be at least 10 characters",
  }),
})

const EmailForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false) // State to track submission status
  const [submissionMessage, setSubmissionMessage] = useState("") // State for submission message

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      body: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      const url = process.env.NEXT_PUBLIC_SEND_EMAIL_URL
      if (!url) {
        throw new Error("API URL is not defined.")
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      console.log(response)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      console.log(result)

      setSubmissionMessage("Email sent successfully!")
      setIsSubmitted(true)

      // reset();

      setTimeout(() => {
        setIsSubmitted(false)
        setSubmissionMessage("")
      }, 4000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmissionMessage("Failed to send email. Try again.")
      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        setSubmissionMessage("")
      }, 4000)
    }
    form.reset()
  }

  return (
    <CardWrapper title={"Send Email"} label={"Fill out the information below"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@gmail.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Hello" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="How are you, John? Let's chat!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {isSubmitted && (
        <div className="mt-4">
          <p className="text-green-600">{submissionMessage}</p>
        </div>
      )}
    </CardWrapper>
  )
}

export default EmailForm
