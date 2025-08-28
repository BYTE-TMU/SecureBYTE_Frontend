import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
export default function LoadingPage() {
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10; // increment step
      setProgressValue(current);
      if (current >= 100) clearInterval(interval);
    }, 100); // every 100ms, 20 steps for 2s
  }, []);
  return (
    <div className="w-full min-h-screen p-20">
      {' '}
      SecureBYTE
      <Progress value={progressValue} />
    </div>
  );
}
