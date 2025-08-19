import React from 'react';
import { Recommendation } from '../../types';
import { CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  priority?: 'high' | 'medium' | 'low';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, priority = 'medium' }) => {
  const getIcon = () => {
    return recommendation.type === 'action' 
      ? <CheckCircle className="h-5 w-5" />
      : <Lightbulb className="h-5 w-5" />;
  };

  const getCardStyle = () => {
    const baseStyle = "border-l-4 rounded-lg p-4 ";
    
    if (recommendation.type === 'action') {
      switch (priority) {
        case 'high':
          return baseStyle + "bg-green-50 border-l-green-500 border border-green-200";
        case 'medium':
          return baseStyle + "bg-blue-50 border-l-blue-500 border border-blue-200";
        default:
          return baseStyle + "bg-gray-50 border-l-gray-500 border border-gray-200";
      }
    } else {
      return baseStyle + "bg-yellow-50 border-l-yellow-500 border border-yellow-200";
    }
  };

  const getIconColor = () => {
    if (recommendation.type === 'action') {
      switch (priority) {
        case 'high':
          return 'text-green-600';
        case 'medium':
          return 'text-blue-600';
        default:
          return 'text-gray-600';
      }
    }
    return 'text-yellow-600';
  };

  const getTextColor = () => {
    if (recommendation.type === 'action') {
      switch (priority) {
        case 'high':
          return 'text-green-900';
        case 'medium':
          return 'text-blue-900';
        default:
          return 'text-gray-900';
      }
    }
    return 'text-yellow-900';
  };

  const getBodyColor = () => {
    if (recommendation.type === 'action') {
      switch (priority) {
        case 'high':
          return 'text-green-700';
        case 'medium':
          return 'text-blue-700';
        default:
          return 'text-gray-700';
      }
    }
    return 'text-yellow-700';
  };

  return (
    <div className={getCardStyle()}>
      <div className="flex items-start">
        <div className={`${getIconColor()} mr-3 mt-0.5`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-semibold ${getTextColor()}`}>
              {recommendation.title}
            </h3>
            {recommendation.type === 'action' && (
              <ArrowRight className={`h-4 w-4 ${getIconColor()}`} />
            )}
          </div>
          <p className={`text-sm mt-1 ${getBodyColor()}`}>
            {recommendation.body}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              recommendation.type === 'action' 
                ? 'bg-white bg-opacity-60 ' + getTextColor()
                : 'bg-white bg-opacity-60 ' + getTextColor()
            }`}>
              {recommendation.type === 'action' ? 'Handlungsempfehlung' : 'Erkenntniss'}
            </span>
            {priority === 'high' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Hoch
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;