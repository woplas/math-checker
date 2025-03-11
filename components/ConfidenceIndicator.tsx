import React from 'react';

type ConfidenceLevel = 'high' | 'medium' | 'low';

interface ConfidenceIndicatorProps {
  value: number;
  showLabel?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A component that displays the AI confidence level as a visual indicator
 */
export default function ConfidenceIndicator({
  value,
  showLabel = true,
  showValue = false,
  size = 'md',
}: ConfidenceIndicatorProps) {
  // Determine confidence level based on value
  const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
    if (confidence >= 0.95) return 'high';
    if (confidence >= 0.8) return 'medium';
    return 'low';
  };

  const confidenceLevel = getConfidenceLevel(value);
  
  // Get label text based on confidence level
  const getLabelText = (level: ConfidenceLevel): string => {
    switch (level) {
      case 'high':
        return 'High Confidence';
      case 'medium':
        return 'Medium Confidence';
      case 'low':
        return 'Low Confidence';
    }
  };
  
  // Get color classes based on confidence level
  const getColorClasses = (level: ConfidenceLevel): string => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
    }
  };
  
  // Get size classes
  const getSizeClasses = (size: 'sm' | 'md' | 'lg'): string => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1';
    }
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getColorClasses(confidenceLevel)} ${getSizeClasses(size)}`}>
      <span className={`mr-1 h-2 w-2 rounded-full ${
        confidenceLevel === 'high' ? 'bg-green-600' : 
        confidenceLevel === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
      }`}></span>
      {showLabel && getLabelText(confidenceLevel)}
      {showValue && <span className="ml-1 opacity-75">({Math.round(value * 100)}%)</span>}
    </span>
  );
}
