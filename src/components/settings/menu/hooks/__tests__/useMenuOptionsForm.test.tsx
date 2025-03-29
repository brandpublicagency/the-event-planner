
import { renderHook, act } from '@testing-library/react-hooks';
import { useMenuOptionsForm } from '../useMenuOptionsForm';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
jest.mock('@/hooks/use-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ data: [{ id: 'new-id', type: 'new-type', name: 'New Option', category: 'test' }], error: null }),
      })),
      update: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe('useMenuOptionsForm', () => {
  const mockInitialOptions = [
    { id: '1', value: 'option1', label: 'Option 1', category: 'test' },
    { id: '2', value: 'option2', label: 'Option 2', category: 'test' },
  ];
  
  const mockCategory = 'test';
  const mockOnSave = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the provided options', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    expect(result.current.options).toEqual(mockInitialOptions);
    expect(result.current.isAdding).toBe(false);
    expect(result.current.editingId).toBeNull();
  });

  it('should add new option when handleAddOption is called', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });

    expect(result.current.isAdding).toBe(true);
    expect(result.current.newOption).toEqual({ value: '', label: '' });
  });

  it('should cancel adding when handleCancelAdd is called', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });
    
    expect(result.current.isAdding).toBe(true);
    
    act(() => {
      result.current.handleCancelAdd();
    });
    
    expect(result.current.isAdding).toBe(false);
  });

  it('should update newOption when handleNewOptionChange is called', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });
    
    act(() => {
      result.current.handleNewOptionChange('value', 'new-value');
    });
    
    expect(result.current.newOption.value).toBe('new-value');
    
    act(() => {
      result.current.handleNewOptionChange('label', 'New Label');
    });
    
    expect(result.current.newOption.label).toBe('New Label');
  });

  it('should save new option successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });
    
    act(() => {
      result.current.handleNewOptionChange('value', 'new-type');
      result.current.handleNewOptionChange('label', 'New Option');
    });
    
    act(() => {
      result.current.handleSaveNew();
    });
    
    await waitForNextUpdate();
    
    expect(result.current.isAdding).toBe(false);
    expect(result.current.options.length).toBe(3);
    expect(toast.success).toHaveBeenCalled();
  });

  it('should not save when new option is missing values', async () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });

    act(() => {
      result.current.handleSaveNew();
    });
    
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isAdding).toBe(true);
  });

  it('should not save when new option has duplicate value', async () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });
    
    act(() => {
      result.current.handleNewOptionChange('value', 'option1');  // Existing value
      result.current.handleNewOptionChange('label', 'New Label');
    });
    
    act(() => {
      result.current.handleSaveNew();
    });
    
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isAdding).toBe(true);
  });

  it('should handle edit mode correctly', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEdit(mockInitialOptions[0]);
    });
    
    expect(result.current.editingId).toBe('1');
    expect(result.current.editedOption).toEqual({ 
      value: 'option1', 
      label: 'Option 1' 
    });
  });

  it('should update edited option fields', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEdit(mockInitialOptions[0]);
    });
    
    act(() => {
      result.current.handleEditChange('value', 'updated-value');
    });
    
    expect(result.current.editedOption.value).toBe('updated-value');
    
    act(() => {
      result.current.handleEditChange('label', 'Updated Label');
    });
    
    expect(result.current.editedOption.label).toBe('Updated Label');
  });

  it('should cancel editing mode', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEdit(mockInitialOptions[0]);
    });
    
    expect(result.current.editingId).toBe('1');
    
    act(() => {
      result.current.handleCancelEdit();
    });
    
    expect(result.current.editingId).toBeNull();
  });

  it('should save edited option successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEdit(mockInitialOptions[0]);
    });
    
    act(() => {
      result.current.handleEditChange('value', 'updated-value');
      result.current.handleEditChange('label', 'Updated Label');
    });
    
    act(() => {
      result.current.handleSaveEdit('1');
    });
    
    await waitForNextUpdate();
    
    expect(result.current.editingId).toBeNull();
    expect(result.current.options[0].value).toBe('updated-value');
    expect(result.current.options[0].label).toBe('Updated Label');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should not save when edited option is missing values', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEdit(mockInitialOptions[0]);
    });
    
    act(() => {
      result.current.handleEditChange('value', '');
    });
    
    act(() => {
      result.current.handleSaveEdit('1');
    });
    
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.editingId).toBe('1');
  });

  it('should not save when edited option has duplicate value', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEdit(mockInitialOptions[0]);
    });
    
    act(() => {
      result.current.handleEditChange('value', 'option2');  // Already exists
    });
    
    act(() => {
      result.current.handleSaveEdit('1');
    });
    
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.editingId).toBe('1');
  });

  it('should delete option successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleDeleteOption('1');
    });
    
    await waitForNextUpdate();
    
    expect(result.current.options.length).toBe(1);
    expect(result.current.options[0].id).toBe('2');
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle Supabase errors gracefully', async () => {
    // Mock Supabase to return an error
    jest.spyOn(supabase, 'from').mockImplementationOnce(() => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        }),
      }),
      update: jest.fn(),
      delete: jest.fn(),
      select: jest.fn(),
    }));

    const { result, waitForNextUpdate } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });
    
    act(() => {
      result.current.handleNewOptionChange('value', 'new-type');
      result.current.handleNewOptionChange('label', 'New Option');
    });
    
    act(() => {
      result.current.handleSaveNew();
    });
    
    await waitForNextUpdate();
    
    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isSaving).toBe(false);
  });
});
