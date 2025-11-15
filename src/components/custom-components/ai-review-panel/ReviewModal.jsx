import React from 'react';
import ReviewTabs from './ReviewTabs';

export default function ReviewModal({
  activeFile,
  securityReview,
  projectId,
  isSecReviewLoading,
}) {
  return (
    <ReviewTabs
      activeFile={activeFile}
      securityReview={securityReview}
      projectId={projectId}
      isSecReviewLoading={isSecReviewLoading}
    />
  );
}
