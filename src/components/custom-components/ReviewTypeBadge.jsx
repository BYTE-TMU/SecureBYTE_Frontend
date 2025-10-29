import { Badge } from '@/components/ui/badge';

export function ReviewTypeBadge({ type }) {
  if (!type) {
    return <span className="text-muted-foreground">None</span>;
  }

  const badgeConfig = {
    security: {
      variant: 'default',
      label: 'Security',
    },
    logic: {
      variant: 'secondary',
      label: 'Logic',
    },
    testcases: {
      variant: 'outline',
      label: 'Test Cases',
    },
  };

  const config = badgeConfig[type.toLowerCase()];

  if (!config) {
    return <span className="text-muted-foreground">Unknown</span>;
  }

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
