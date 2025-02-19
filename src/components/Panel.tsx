"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Panel = () => {
  return (
    <>
      <div className="flex min-h-screen bg-gray-100 ">
        <Card className="w-96 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              This is a simple Next.js 15.1 component using Tailwind CSS and
              ShadCN UI.
            </p>
            <Button className="mt-4 w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Panel;
