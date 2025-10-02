import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';

export const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useNotificationPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Customize how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="grouping">Group Similar Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Combine multiple notifications of the same type
            </p>
          </div>
          <Switch
            id="grouping"
            checked={preferences.enableGrouping}
            onCheckedChange={(checked) => updatePreferences({ enableGrouping: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sounds">Enable Notification Sounds</Label>
            <p className="text-sm text-muted-foreground">
              Play a sound when new notifications arrive
            </p>
          </div>
          <Switch
            id="sounds"
            checked={preferences.enableSounds}
            onCheckedChange={(checked) => updatePreferences({ enableSounds: checked })}
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label>Toast Duration</Label>
            <p className="text-sm text-muted-foreground">
              How long notifications stay visible: {preferences.toastDuration / 1000}s
            </p>
          </div>
          <Slider
            value={[preferences.toastDuration]}
            onValueChange={([value]) => updatePreferences({ toastDuration: value })}
            min={2000}
            max={10000}
            step={1000}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
