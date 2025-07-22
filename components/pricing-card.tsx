import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  description?: string;
  features?: string[];
  onAction?: () => void;
  actionLabel?: string;
}

export function PricingCard({
  title,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  description,
  features = [],
  onAction,
  actionLabel = "Select"
}: PricingCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2 min-h-[2.5rem]">{title}</CardTitle>
          {badge && (
            <div className="flex flex-col gap-1">
            <Badge variant={badge === "Best Value" ? "default" : "secondary"}>
              {badge}
            </Badge>
            </div>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">${price}</span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
            )}
          </div>

          {/* Rating */}
          {rating && reviews && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({reviews} reviews)</span>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Action Button */}
          {onAction && (
            <button
              onClick={onAction}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
