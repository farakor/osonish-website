"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";

interface ReviewFormProps {
  orderId: string;
  workerId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  onCancel?: () => void;
}

export function ReviewForm({
  orderId,
  workerId,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Пожалуйста, поставьте оценку");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Не удалось отправить отзыв");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Оценка</Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                interactive
                onRatingChange={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rating} из 5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea
              id="comment"
              placeholder="Расскажите о вашем опыте работы..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Отправка..." : "Отправить отзыв"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
              >
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

