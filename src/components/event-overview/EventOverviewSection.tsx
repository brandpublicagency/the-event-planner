import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { RichTextCard } from './RichTextCard';
import { ListCard } from './ListCard';
import { EventOverview, EventOverviewPanel, createDefaultOverview } from '@/types/eventOverview';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

interface EventOverviewSectionProps {
  eventCode: string;
  overview: any;
  onUpdate: (overview: EventOverview) => void;
}

export const EventOverviewSection = ({ eventCode, overview, onUpdate }: EventOverviewSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localOverview, setLocalOverview] = useState<EventOverview>(
    overview || createDefaultOverview()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const { toast } = useToast();

  // Reset local state when overview prop changes
  useEffect(() => {
    if (overview) {
      setLocalOverview(overview);
    }
  }, [overview]);

  const saveOverview = async (overviewData: EventOverview) => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      const { error } = await supabase
        .from('events')
        .update({ overview: overviewData as any })
        .eq('event_code', eventCode);

      if (error) throw error;

      onUpdate(overviewData);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving overview:', error);
      toast({
        title: 'Error saving overview',
        description: 'Please try again',
        variant: 'destructive'
      });
      setSaveStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced autosave
  const debouncedSave = useCallback(
    debounce((overviewData: EventOverview) => {
      saveOverview(overviewData);
    }, 1200),
    [eventCode]
  );

  const handlePanelChange = (panelKey: string, updates: Partial<EventOverviewPanel>) => {
    const updatedOverview = {
      ...localOverview,
      panels: localOverview.panels.map(panel =>
        panel.key === panelKey ? { ...panel, ...updates } : panel
      )
    };
    
    setLocalOverview(updatedOverview);
    
    if (isEditing) {
      debouncedSave(updatedOverview);
    }
  };

  const handleSave = async () => {
    await saveOverview(localOverview);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalOverview(overview || createDefaultOverview());
    setIsEditing(false);
    debouncedSave.cancel();
  };

  // Check if overview has content
  const hasContent = localOverview.panels.some(panel => {
    if (panel.type === 'richtext') {
      return panel.value && panel.value !== '<p></p>' && panel.value.trim().length > 0;
    }
    return panel.items && panel.items.length > 0;
  });

  // Don't render if not visible or no eventCode
  if (!eventCode || localOverview.visible === false) {
    return null;
  }

  const venuePanel = localOverview.panels.find(p => p.key === 'venue_layout');
  const preDrinksPanel = localOverview.panels.find(p => p.key === 'pre_drinks');
  const menuPanel = localOverview.panels.find(p => p.key === 'menu');

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Event Overview</h2>
          {!isEditing && (
            <Edit 
              className="h-4 w-4 text-foreground/70 cursor-pointer hover:text-foreground" 
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="text-xs text-foreground/50">Saving…</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-foreground/70">Saved</span>
          )}
          
          {isEditing && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Venue Layout - Left column, spans 1 row */}
        {venuePanel && (
          <div className="md:row-span-1">
            <RichTextCard
              title={venuePanel.title}
              value={venuePanel.value || ''}
              onChange={(value) => handlePanelChange('venue_layout', { value })}
              isEditing={isEditing}
              imageUrl={venuePanel.imageUrl}
              onImageUrlChange={(imageUrl) => handlePanelChange('venue_layout', { imageUrl })}
            />
          </div>
        )}

        {/* Menu - Right column, spans 2 rows */}
        {menuPanel && (
          <div className="md:row-span-2">
            <RichTextCard
              title={menuPanel.title}
              value={menuPanel.value || ''}
              onChange={(value) => handlePanelChange('menu', { value })}
              isEditing={isEditing}
            />
          </div>
        )}

        {/* Pre-drinks - Left column bottom */}
        {preDrinksPanel && (
          <div className="md:row-span-1">
            <ListCard
              title={preDrinksPanel.title}
              items={preDrinksPanel.items || []}
              onChange={(items) => handlePanelChange('pre_drinks', { items })}
              isEditing={isEditing}
            />
          </div>
        )}
      </div>
    </div>
  );
};
