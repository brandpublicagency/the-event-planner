export interface DatabaseFunctions {
  create_company_and_team: {
    Args: {
      p_company_name: string;
      p_user_id: string;
    };
    Returns: {
      company_id: string;
      team_id: string;
    };
  };
  _ltree_compress: {
    Args: {
      "": unknown
    };
    Returns: unknown;
  };
  _ltree_gist_options: {
    Args: {
      "": unknown
    };
    Returns: undefined;
  };
  generate_unique_event_code: {
    Args: {
      base_code: string;
    };
    Returns: string;
  };
  lca: {
    Args: {
      "": unknown[];
    };
    Returns: unknown;
  };
  lquery_in: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  lquery_out: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  lquery_recv: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  lquery_send: {
    Args: {
      "": unknown;
    };
    Returns: string;
  };
  ltree_compress: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_decompress: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_gist_in: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_gist_options: {
    Args: {
      "": unknown;
    };
    Returns: undefined;
  };
  ltree_gist_out: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_in: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_out: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_recv: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltree_send: {
    Args: {
      "": unknown;
    };
    Returns: string;
  };
  ltree2text: {
    Args: {
      "": unknown;
    };
    Returns: string;
  };
  ltxtq_in: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltxtq_out: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltxtq_recv: {
    Args: {
      "": unknown;
    };
    Returns: unknown;
  };
  ltxtq_send: {
    Args: {
      "": unknown;
    };
    Returns: string;
  };
  nlevel: {
    Args: {
      "": unknown;
    };
    Returns: number;
  };
  text2ltree: {
    Args: {
      "": string;
    };
    Returns: unknown;
  };
}
