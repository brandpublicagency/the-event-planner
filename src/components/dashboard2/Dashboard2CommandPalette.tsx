import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useTaskContext } from "@/contexts/TaskContext";
import {
  CalendarDays,
  ListTodo,
  Users,
  Search,
  FileText,
  Plus,
  Settings,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchEvent {
  event_code: string;
  name: string;
  event_type: string;
  event_date: string | null;
}

interface SearchContact {
  event_code: string;
  primary_name: string | null;
  primary_email: string | null;
  company: string | null;
}

interface Dashboard2CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Dashboard2CommandPalette = ({ open, onOpenChange }: Dashboard2CommandPaletteProps) => {
  const navigate = useNavigate();
  const { tasks } = useTaskContext();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);
  const [events, setEvents] = useState<SearchEvent[]>([]);
  const [contacts, setContacts] = useState<SearchContact[]>([]);
  const [loading, setLoading] = useState(false);

  // Search Supabase for events and contacts
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setEvents([]);
      setContacts([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      const searchTerm = `%${debouncedQuery}%`;

      const [eventsRes, contactsRes] = await Promise.all([
        supabase
          .from("events")
          .select("event_code, name, event_type, event_date")
          .is("deleted_at", null)
          .or(`name.ilike.${searchTerm},event_code.ilike.${searchTerm},event_type.ilike.${searchTerm}`)
          .order("event_date", { ascending: false })
          .limit(6),
        supabase
          .from("events")
          .select("event_code, primary_name, primary_email, company")
          .is("deleted_at", null)
          .or(`primary_name.ilike.${searchTerm},primary_email.ilike.${searchTerm},company.ilike.${searchTerm}`)
          .not("primary_name", "is", null)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      setEvents(eventsRes.data || []);

      // Deduplicate contacts by primary_name
      const seen = new Set<string>();
      const uniqueContacts = (contactsRes.data || []).filter((c) => {
        const key = c.primary_name || c.primary_email || c.event_code;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setContacts(uniqueContacts);
      setLoading(false);
    };

    search();
  }, [debouncedQuery]);

  // Filter tasks client-side
  const filteredTasks = query.length >= 2
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const runCommand = useCallback(
    (command: () => void) => {
      onOpenChange(false);
      setQuery("");
      command();
    },
    [onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search events, tasks, contacts..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Searching..." : "No results found."}
        </CommandEmpty>

        {/* Quick actions — always visible */}
        {query.length < 2 && (
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => navigate("/events/new"))}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/tasks?newTask=true"))}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Task
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/events"))}>
              <CalendarDays className="mr-2 h-4 w-4" />
              View All Events
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/tasks"))}>
              <ListTodo className="mr-2 h-4 w-4" />
              View All Tasks
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/contacts"))}>
              <Users className="mr-2 h-4 w-4" />
              View Contacts
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/documents"))}>
              <FileText className="mr-2 h-4 w-4" />
              View Documents
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </CommandItem>
          </CommandGroup>
        )}

        {/* Events results */}
        {events.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Events">
              {events.map((event) => (
                <CommandItem
                  key={event.event_code}
                  value={`event-${event.event_code}-${event.name}`}
                  onSelect={() => runCommand(() => navigate(`/events/${event.event_code}`))}
                >
                  <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">{event.name || event.event_code}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {event.event_type}
                      {event.event_date && ` · ${event.event_date}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Tasks results */}
        {filteredTasks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Tasks">
              {filteredTasks.map((task) => (
                <CommandItem
                  key={task.id}
                  value={`task-${task.id}-${task.title}`}
                  onSelect={() => runCommand(() => navigate(`/tasks/${task.id}`))}
                >
                  <ListTodo className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">{task.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {task.completed ? "Completed" : task.priority || "Normal"} priority
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Contacts results */}
        {contacts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Contacts">
              {contacts.map((contact) => (
                <CommandItem
                  key={`contact-${contact.event_code}`}
                  value={`contact-${contact.event_code}-${contact.primary_name}`}
                  onSelect={() => runCommand(() => navigate(`/events/${contact.event_code}`))}
                >
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">{contact.primary_name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {[contact.company, contact.primary_email].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default Dashboard2CommandPalette;
