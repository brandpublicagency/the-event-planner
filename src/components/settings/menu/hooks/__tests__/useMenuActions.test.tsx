
import { renderHook, act } from '@testing-library/react-hooks';
import { useMenuActions } from '../useMenuActions';
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
        select: jest.fn().mockResolvedValue({ 
          data: [{ id: 'new-id', type: 'new-type', name: 'New Option', category: 'test' }], 
          error: null 
        }),
      })),
      update: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe('useMenuActions', () => {
  const mockOptions = [
    { id: '1', value: 'option1', label: 'Option 1', category: 'test' },
    { id: '2', value: 'option2', label: 'Option 2', category: 'test' },
  ];
  
  const mockSetOptions = jest.fn();
  const mockCategory = 'test';
  const mockOnSave = jest.fn().mockResolvedValue(true);
  const mockResetAddState = jest.fn();
  const mockResetEditState = jest.fn();
  const mockSetIsSaving = jest.fn();

  // Create mock props object
  const mockProps = {
    options: mockOptions,
    setOptions: mockSetOptions,
    category: mockCategory,
    onSave: mockOnSave,
    resetAddState: mockResetAddState,
    resetEditState: mockResetEditState,
    setIsSaving: mockSetIsSaving
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate option correctly', () => {
    const { result } = renderHook(() => useMenuActions(mockProps));

    // Missing values
    expect(result.current.validateOption('', 'label', true)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Both value and label are required');
    
    jest.clearAllMocks();
    expect(result.current.validateOption('value', '', true)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Both value and label are required');
    
    // Duplicate value
    jest.clearAllMocks();
    expect(result.current.validateOption('option1', 'New Option', true)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Option with value "option1" already exists');
    
    // Valid option
    jest.clearAllMocks();
    expect(result.current.validateOption('new-option', 'New Option', true)).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should create option successfully', async () => {
    const { result } = renderHook(() => useMenuActions(mockProps));

    await act(async () => {
      const success = await result.current.createOption('new-type', 'New Option');
      expect(success).toBe(true);
    });

    expect(supabase.from).toHaveBeenCalledWith('menu_options');
    expect(mockSetOptions).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalled();
    expect(mockSetIsSaving).toHaveBeenCalledTimes(2); // Once to set true, once to set false
  });

  it('should update option successfully', async () => {
    const { result } = renderHook(() => useMenuActions(mockProps));

    await act(async () => {
      const success = await result.current.updateOption('1', 'updated-value', 'Updated Label');
      expect(success).toBe(true);
    });

    expect(supabase.from).toHaveBeenCalledWith('menu_options');
    expect(mockSetOptions).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should delete option successfully', async () => {
    const { result } = renderHook(() => useMenuActions(mockProps));

    await act(async () => {
      const success = await result.current.deleteOption('1');
      expect(success).toBe(true);
    });

    expect(supabase.from).toHaveBeenCalledWith('menu_options');
    expect(mockSetOptions).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalled();
  });

  // Test error handling
  it('should handle errors when creating option', async () => {
    // Mock a failure
    jest.spyOn(supabase, 'from').mockImplementationOnce(() => ({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        }),
      }),
      update: jest.fn(),
      delete: jest.fn(),
    } as any));

    const { result } = renderHook(() => useMenuActions(mockProps));

    await act(async () => {
      const success = await result.current.createOption('new-type', 'New Option');
      expect(success).toBe(false);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(mockSetIsSaving).toHaveBeenCalledTimes(2); // Once to set true, once to set false
  });
});
