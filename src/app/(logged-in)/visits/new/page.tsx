import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createVisit } from '../actions';

export default function NewVisit() {
  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Create New Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createVisit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                required
                placeholder="Enter your visit title ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                required
                placeholder="Write your visits content here ..."
                rows={6}
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Create Visit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
