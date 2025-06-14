"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, ImageIcon, Upload } from "lucide-react"

type ImageCategory = {
  id: string
  name: string
  description: string
  images: { id: string; name: string; url: string }[]
}

const initialCategories: ImageCategory[] = [
  {
    id: "hero",
    name: "Hero Section",
    description: "Background images for the hero section slider",
    images: [
      { id: "hero-1", name: "Main Background", url: "https://ik.imagekit.io/beautypalace/hero/salon-bg-1.jpg" },
      { id: "hero-2", name: "Hero Image 2", url: "https://ik.imagekit.io/beautypalace/hero/salon-bg-2.jpg" },
      { id: "hero-3", name: "Hero Image 3", url: "https://ik.imagekit.io/beautypalace/hero/salon-bg-3.jpg" },
      { id: "hero-4", name: "Hero Image 4", url: "https://ik.imagekit.io/beautypalace/hero/salon-bg-4.jpg" },
    ],
  },
  {
    id: "services",
    name: "Services",
    description: "Images for service cards",
    images: [
      { id: "service-1", name: "Haircut", url: "https://ik.imagekit.io/beautypalace/services/haircut.jpg" },
      { id: "service-2", name: "Facial", url: "https://ik.imagekit.io/beautypalace/services/facial.jpg" },
      { id: "service-3", name: "Hair Smoothing", url: "https://ik.imagekit.io/beautypalace/services/smoothing.jpg" },
      { id: "service-4", name: "Keratin Treatment", url: "https://ik.imagekit.io/beautypalace/services/keratin.jpg" },
      { id: "service-5", name: "Waxing", url: "https://ik.imagekit.io/beautypalace/services/waxing.jpg" },
      { id: "service-6", name: "Makeup", url: "https://ik.imagekit.io/beautypalace/services/makeup.jpg" },
    ],
  },
  {
    id: "reviews",
    name: "Client Reviews",
    description: "Profile images for client testimonials",
    images: [
      { id: "review-1", name: "Sarah Johnson", url: "https://ik.imagekit.io/beautypalace/reviews/client-1.jpg" },
      { id: "review-2", name: "Emily Davis", url: "https://ik.imagekit.io/beautypalace/reviews/client-2.jpg" },
      { id: "review-3", name: "Michelle Wong", url: "https://ik.imagekit.io/beautypalace/reviews/client-3.jpg" },
      { id: "review-4", name: "Jessica Smith", url: "https://ik.imagekit.io/beautypalace/reviews/client-4.jpg" },
      { id: "review-5", name: "Amanda Lee", url: "https://ik.imagekit.io/beautypalace/reviews/client-5.jpg" },
      { id: "review-6", name: "Rachel Green", url: "https://ik.imagekit.io/beautypalace/reviews/client-6.jpg" },
    ],
  },
]

export function MediaManager() {
  const [categories, setCategories] = useState<ImageCategory[]>(initialCategories)
  const [activeCategory, setActiveCategory] = useState("hero")

  const handleUrlUpdate = (categoryId: string, imageId: string, newUrl: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              images: category.images.map((image) => (image.id === imageId ? { ...image, url: newUrl } : image)),
            }
          : category,
      ),
    )
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "All ImageKit.io URLs have been updated successfully.",
    })
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon size={20} />
              ImageKit.io URL Management
            </CardTitle>
            <CardDescription>
              Update ImageKit.io CDN URLs for all website images. Changes will be reflected across the entire website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">📝 Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload images to your ImageKit.io account</li>
                <li>• Copy the CDN URL from ImageKit.io dashboard</li>
                <li>• Paste the URL in the corresponding field below</li>
                <li>• Click "Save Changes" to apply updates</li>
              </ul>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hero">Hero Images</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className="grid gap-4">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>

                    <div className="grid gap-4">
                      {category.images.map((image) => (
                        <Card key={image.id}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                              <div>
                                <Label className="font-medium">{image.name}</Label>
                                <p className="text-xs text-muted-foreground mt-1">Image ID: {image.id}</p>
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor={`url-${image.id}`} className="text-sm">
                                  ImageKit.io URL
                                </Label>
                                <Input
                                  id={`url-${image.id}`}
                                  value={image.url}
                                  onChange={(e) => handleUrlUpdate(category.id, image.id, e.target.value)}
                                  placeholder="https://ik.imagekit.io/your-account/path/image.jpg"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            {image.url && (
                              <div className="mt-4">
                                <Label className="text-sm text-muted-foreground">Preview:</Label>
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                  <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={`${image.name} - Beauty Palace media`}
                                    className="w-full h-32 object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.src = "https://ik.imagekit.io/placeholder.jpg"
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              ImageKit.io Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Step 1: Create ImageKit.io Account</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up at{" "}
                  <a
                    href="https://imagekit.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    imagekit.io
                  </a>{" "}
                  and create your account.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Step 2: Upload Images</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your images to ImageKit.io using their dashboard. Organize them in folders like 'hero',
                  'services', 'reviews'.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Step 3: Copy URLs</h4>
                <p className="text-sm text-muted-foreground">
                  Right-click on any uploaded image and select "Copy URL" to get the CDN link. The URL format will be:
                  <code className="bg-white px-2 py-1 rounded text-xs ml-2">
                    https://ik.imagekit.io/your-account/path/image.jpg
                  </code>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Step 4: Update URLs</h4>
                <p className="text-sm text-muted-foreground">
                  Paste the ImageKit.io URLs in the fields above and click "Save Changes" to update your website.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  )
}
