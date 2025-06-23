
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Settings Panel</CardTitle>
                    <CardDescription>Manage your account and application settings here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Settings options will be available here soon.</p>
                </CardContent>
            </Card>
        </div>
    )
}
