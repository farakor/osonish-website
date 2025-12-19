import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";
import type { Review } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const customerName = review.customerName || "Аноним";
  const nameParts = customerName.split(" ");
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={""} alt={customerName} />
            <AvatarFallback>
              {getInitials(
                nameParts[0] || "А",
                nameParts[1] || ""
              )}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div>
                <p className="font-medium">{customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            {/* Order Title */}
            {review.orderTitle && (
              <p className="text-sm text-muted-foreground mb-2">
                Заказ: {review.orderTitle}
              </p>
            )}

            {/* Comment */}
            {review.comment && (
              <p className="text-sm whitespace-pre-wrap">{review.comment}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

