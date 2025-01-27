import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Select a section from the sidebar to manage puppies, waitlist, or testimonials.</p>
      </CardContent>
    </Card>
  )
}

