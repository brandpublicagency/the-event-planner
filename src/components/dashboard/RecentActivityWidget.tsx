
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivityList } from "@/components/activity/RecentActivityList";

export function RecentActivityWidget() {
  return (
    <Card className="col-span-full md:col-span-1 h-full">
      <CardHeader className="pb-2">
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <RecentActivityList limit={7} />
      </CardContent>
    </Card>
  );
}
