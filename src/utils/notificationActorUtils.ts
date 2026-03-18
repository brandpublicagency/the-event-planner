const ACTOR_MAX_LENGTH = 30;
const ACTOR_PATTERN = /^(.+?)\s+(created|updated|cancelled|deleted|marked)/i;

export const extractActorFromDescription = (description: string): string => {
  const match = description.match(ACTOR_PATTERN);
  const rawActor = match ? match[1]?.trim() : null;
  
  if (!rawActor || rawActor.toLowerCase().startsWith('a new') || rawActor.length > ACTOR_MAX_LENGTH) {
    return 'System';
  }
  
  return rawActor;
};
