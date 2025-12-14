import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ProfilePortfolioProps {
  photos?: string[];
}

export function ProfilePortfolio({ photos }: ProfilePortfolioProps) {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Портфолио</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={photo}
                alt={`Portfolio ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

