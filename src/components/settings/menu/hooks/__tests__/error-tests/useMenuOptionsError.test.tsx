
import { renderHook, act } from '@testing-library/react-hooks';
import { useMenuOptionsForm } from '../../useMenuOptionsForm';
import { useMenuFormState } from '../../useMenuFormState';
import { useMenuActions } from '../../useMenuActions';
import { toast } from '@/hooks/use-toast';

// Mock the child hooks
jest.mock('../../useMenuFormState', () => ({
  useMenuFormState: jest.fn()
}));

jest.mock('../../useMenuActions', () => ({
  useMenuActions: jest.fn()
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('Menu Options Error Handling Tests', () => {
  const mockInitialOptions = [
    { id: '1', value: 'option1', label: 'Option 1', category: 'test' },
    { id: '2', value: 'option2', label: 'Option 2', category: 'test' },
  ];
  
  const mockCategory = 'test';
  const mockOnSave = jest.fn().mockResolvedValue(true);
  
  // Mock state values and functions
  const mockMenuFormState = {
    options: mockInitialOptions,
    setOptions: jest.fn(),
    isAdding: false,
    setIsAdding: jest.fn(),
    isSaving: false,
    setIsSaving: jest.fn(),
    editingId: null,
    setEditingId: jest.fn(),
    newOption: { value: '', label: '' },
    setNewOption: jest.fn(),
    editedOption: { value: '', label: '' },
    setEditedOption: jest.fn(),
    resetAddState: jest.fn(),
    resetEditState: jest.fn()
  };

  // Mock actions values and functions
  const mockMenuActions = {
    processingId: null,
    validateOption: jest.fn().mockReturnValue(true),
    createOption: jest.fn(),
    updateOption: jest.fn(),
    deleteOption: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMenuFormState as jest.Mock).mockReturnValue(mockMenuFormState);
    (useMenuActions as jest.Mock).mockReturnValue(mockMenuActions);
  });

  it('should handle create option failure', async () => {
    mockMenuActions.createOption.mockRejectedValueOnce(new Error('Create error'));
    mockMenuFormState.newOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(mockMenuFormState.resetAddState).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it('should handle update option failure', async () => {
    mockMenuActions.updateOption.mockRejectedValueOnce(new Error('Update error'));
    mockMenuFormState.editedOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveEdit('1');
    });

    expect(mockMenuActions.updateOption).toHaveBeenCalledWith('1', 'test', 'Test');
    expect(mockMenuFormState.resetEditState).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it('should handle delete option failure', async () => {
    mockMenuActions.deleteOption.mockRejectedValueOnce(new Error('Delete error'));
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleDeleteOption('1');
    });

    expect(mockMenuActions.deleteOption).toHaveBeenCalledWith('1');
    expect(toast.error).toHaveBeenCalled();
  });

  it('should handle successful create option', async () => {
    mockMenuActions.createOption.mockResolvedValueOnce(true);
    mockMenuFormState.newOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(mockMenuFormState.resetAddState).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle successful update option', async () => {
    mockMenuActions.updateOption.mockResolvedValueOnce(true);
    mockMenuFormState.editedOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveEdit('1');
    });

    expect(mockMenuActions.updateOption).toHaveBeenCalledWith('1', 'test', 'Test');
    expect(mockMenuFormState.resetEditState).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  // New tests for validation failures
  it('should handle validation failure when saving new option', async () => {
    mockMenuActions.validateOption.mockReturnValueOnce(false);
    mockMenuFormState.newOption = { value: '', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.validateOption).toHaveBeenCalledWith('', 'Test', true);
    expect(mockMenuActions.createOption).not.toHaveBeenCalled();
  });

  it('should handle validation failure when updating option', async () => {
    mockMenuActions.validateOption.mockReturnValueOnce(false);
    mockMenuFormState.editedOption = { value: '', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveEdit('1');
    });

    expect(mockMenuActions.validateOption).toHaveBeenCalledWith('', 'Test', false, '1');
    expect(mockMenuActions.updateOption).not.toHaveBeenCalled();
  });

  // Network error handling tests
  it('should handle network error during create operation', async () => {
    const networkError = new Error('Network error');
    networkError.name = 'NetworkError';
    mockMenuActions.createOption.mockRejectedValueOnce(networkError);
    mockMenuFormState.newOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(toast.error).toHaveBeenCalledWith('Failed to add option: Network error');
  });

  // Supabase specific error handling
  it('should handle Supabase constraint error during create', async () => {
    const supabaseError = {
      message: 'duplicate key value violates unique constraint',
      code: '23505'
    };
    mockMenuActions.createOption.mockRejectedValueOnce(new Error(supabaseError.message));
    mockMenuFormState.newOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(toast.error).toHaveBeenCalled();
  });

  // Recovery from failure tests
  it('should allow retrying after a failed create operation', async () => {
    // First attempt fails
    mockMenuActions.createOption.mockRejectedValueOnce(new Error('Create error'));
    mockMenuFormState.newOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(mockMenuFormState.resetAddState).not.toHaveBeenCalled();
    
    // Reset mocks for second attempt
    jest.clearAllMocks();
    mockMenuActions.createOption.mockResolvedValueOnce(true);
    
    // Second attempt succeeds
    await act(async () => {
      await result.current.handleSaveNew();
    });
    
    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(mockMenuFormState.resetAddState).toHaveBeenCalled();
  });

  // Test error handling during onSave callback
  it('should handle error in onSave callback after successful API operation', async () => {
    mockMenuActions.createOption.mockResolvedValueOnce(true);
    mockOnSave.mockRejectedValueOnce(new Error('Save callback error'));
    mockMenuFormState.newOption = { value: 'test', label: 'Test' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.createOption).toHaveBeenCalledWith('test', 'Test');
    expect(mockOnSave).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });
});
