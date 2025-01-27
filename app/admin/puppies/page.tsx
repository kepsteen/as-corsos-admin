"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Pencil, Trash2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  gender: z.enum(["male", "female"]),
  image: z.instanceof(FileList).refine((files) => files.length > 0, "Image is required."),
  dateAvailable: z.string().min(1, {
    message: "Date available is required.",
  }),
})

// Hardcoded puppy data
const puppies = [
  { id: 1, name: "Max", gender: "male", dateAvailable: "2023-07-15", image: "/placeholder.svg?height=100&width=100" },
  {
    id: 2,
    name: "Luna",
    gender: "female",
    dateAvailable: "2023-07-20",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Charlie",
    gender: "male",
    dateAvailable: "2023-07-25",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function PuppiesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "male",
      dateAvailable: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Here you would typically send the data to your backend
    console.log(values)
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Puppy added",
        description: "The puppy has been successfully added to the database.",
      })
      form.reset()
    }, 2000)
  }


  const handleDelete = (id: number) => {
    // Implement delete functionality
    console.log(`Deleting puppy with id: ${id}`)
    toast({
      title: "Delete Puppy",
      description: `Deleting puppy with id: ${id}`,
    })
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Current Puppies</CardTitle>
          <CardDescription>View and manage existing puppies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="puppies">
              <AccordionTrigger>View All Puppies</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {puppies.map((puppy) => (
                    <div
                      key={puppy.id}
                      className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={puppy.image || "/placeholder.svg"}
                          alt={puppy.name}
                          className="w-48 h-48 object-cover border-2 border-gray-200 rounded-lg"
                        />
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold">{puppy.name}</h3>
                          <p className="text-base text-gray-600">Gender: {puppy.gender}</p>
                          <p className="text-base text-gray-600">Available: {puppy.dateAvailable}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleDelete(puppy.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Puppy</CardTitle>
          <CardDescription>Enter the details of the new puppy.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Buddy" {...field} />
                    </FormControl>
                    <FormDescription>Enter the puppy's name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the puppy's gender.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} />
                    </FormControl>
                    <FormDescription>Upload an image of the puppy.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Available</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>When will the puppy be available for adoption?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Puppy"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

