import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gqkhnmlytbvklkyktcwt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa2hubWx5dGJ2a2xreWt0Y3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDk1MjYsImV4cCI6MjA0Njc4NTUyNn0.xT3iS1sWyX0pClMadR0CFlyMGlRoiGGAXGu0yuozgZs'
);

const LEROUX_ID = '3e90f521-fc6a-43ca-a23e-83b3d5cb252d';

async function run() {
  // 1. Fix null created_by events
  const { data: nullEvents } = await supabase
    .from('events')
    .select('event_code, activity_log')
    .is('created_by', null);

  console.log(`Found ${nullEvents?.length} events with null created_by`);

  for (const ev of (nullEvents || [])) {
    await supabase.from('events').update({ created_by: LEROUX_ID } as any).eq('event_code', ev.event_code);

    const log = Array.isArray(ev.activity_log) ? ev.activity_log : [];
    const fixed = log.map((entry: any) => ({
      ...entry,
      actor: entry.actor === 'System' ? 'LeRoux' : entry.actor
    }));
    await supabase.from('events').update({ activity_log: fixed } as any).eq('event_code', ev.event_code);
    console.log(`Fixed ${ev.event_code}`);
  }

  // 2. Fix Anasha Boshoff -> Anasha
  const { data: anashaEvents } = await supabase
    .from('events')
    .select('event_code, activity_log')
    .eq('created_by', '7478bf12-a1e6-4890-a797-55316af58988');

  for (const ev of (anashaEvents || [])) {
    const log = Array.isArray(ev.activity_log) ? ev.activity_log : [];
    let changed = false;
    const fixed = log.map((entry: any) => {
      if (entry.actor === 'Anasha Boshoff') { changed = true; return { ...entry, actor: 'Anasha' }; }
      return entry;
    });
    if (changed) {
      await supabase.from('events').update({ activity_log: fixed } as any).eq('event_code', ev.event_code);
      console.log(`Fixed Anasha in ${ev.event_code}`);
    }
  }

  // 3. Fix notifications
  const { data: notifs } = await supabase.from('notifications').select('id, description');
  for (const n of (notifs || [])) {
    let desc = n.description;
    let changed = false;
    if (desc.startsWith('System created')) { desc = desc.replace('System created', 'LeRoux created'); changed = true; }
    if (desc.startsWith('Anasha Boshoff created')) { desc = desc.replace('Anasha Boshoff created', 'Anasha created'); changed = true; }
    if (changed) {
      await supabase.from('notifications').update({ description: desc }).eq('id', n.id);
      console.log(`Fixed notification ${n.id}`);
    }
  }

  console.log('Done!');
}

run();
