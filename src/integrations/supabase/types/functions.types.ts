export interface DatabaseFunctions {
  block_venues_for_package: {
    Args: {
      package_uuid: string;
    };
    Returns: undefined;
  };
  handle_new_user: {
    Args: Record<string, never>;
    Returns: unknown;
  };
}
