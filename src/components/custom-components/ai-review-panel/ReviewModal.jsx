import React from 'react';
import ReviewTabs from './ReviewTabs';

export default function ReviewModal({
  activeFile,
  securityReview,
  projectId,
  isSecReviewLoading,
}) {
  return (
    // <div className="flex flex-col w-full ">
    <ReviewTabs
      activeFile={activeFile}
      securityReview={securityReview}
      projectId={projectId}
      isSecReviewLoading={isSecReviewLoading}
    />
    // </div>
  );
}
