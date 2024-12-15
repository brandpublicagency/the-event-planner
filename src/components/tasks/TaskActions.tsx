import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskActionsProps {
  isDeleting: boolean;
  onDelete: () => void;
}

export function TaskActions({ isDeleting, onDelete }: TaskActionsProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 border-border/40 hover:border-destructive/50"
          disabled={isDeleting}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Trash2 className="h-3 w-3 text-muted-foreground transition-colors" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}