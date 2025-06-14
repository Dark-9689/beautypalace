import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Beauty Palace Admin Access</CardTitle>
          <CardDescription>Use these credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Admin Panel URL</h3>
            <p className="p-2 bg-muted rounded-md">
              <code>/admin/login</code>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Access the admin panel by navigating to <strong>/admin/login</strong> from the main website URL.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Login Credentials</h3>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Username:</p>
                <p className="p-2 bg-muted rounded-md">
                  <code>admin</code>
                </p>
              </div>
              <div>
                <p className="font-medium">Password:</p>
                <p className="p-2 bg-muted rounded-md">
                  <code>beautypalace2023</code>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-1">Important Note</h3>
            <p className="text-sm text-yellow-700">
              For security reasons, please change the default password after your first login. The admin panel gives you
              access to manage services, appointments, reviews, and settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
