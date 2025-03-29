
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

describe('Menu Options Validation Tests', () => {
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
    validateOption: jest.fn(),
    createOption: jest.fn().mockResolvedValue(true),
    updateOption: jest.fn().mockResolvedValue(true),
    deleteOption: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMenuFormState as jest.Mock).mockReturnValue(mockMenuFormState);
    (useMenuActions as jest.Mock).mockReturnValue(mockMenuActions);
  });

  it('should not save new option if validation fails', async () => {
    mockMenuActions.validateOption.mockReturnValueOnce(false);
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.validateOption).toHaveBeenCalled();
    expect(mockMenuActions.createOption).not.toHaveBeenCalled();
  });

  it('should save new option if validation passes', async () => {
    mockMenuActions.validateOption.mockReturnValueOnce(true);
    mockMenuFormState.newOption = { value: 'valid-value', label: 'Valid Label' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveNew();
    });

    expect(mockMenuActions.validateOption).toHaveBeenCalled();
    expect(mockMenuActions.createOption).toHaveBeenCalledWith('valid-value', 'Valid Label');
    expect(mockMenuFormState.resetAddState).toHaveBeenCalled();
  });

  it('should not save edit if validation fails', async () => {
    mockMenuActions.validateOption.mockReturnValueOnce(false);
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveEdit('1');
    });

    expect(mockMenuActions.validateOption).toHaveBeenCalled();
    expect(mockMenuActions.updateOption).not.toHaveBeenCalled();
  });

  it('should save edit if validation passes', async () => {
    mockMenuActions.validateOption.mockReturnValueOnce(true);
    mockMenuFormState.editedOption = { value: 'valid-value', label: 'Valid Label' };
    
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleSaveEdit('1');
    });

    expect(mockMenuActions.validateOption).toHaveBeenCalled();
    expect(mockMenuActions.updateOption).toHaveBeenCalledWith('1', 'valid-value', 'Valid Label');
    expect(mockMenuFormState.resetEditState).toHaveBeenCalled();
  });
});
