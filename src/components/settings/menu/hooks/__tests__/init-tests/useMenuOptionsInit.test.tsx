
import { renderHook } from '@testing-library/react-hooks';
import { useMenuOptionsForm } from '../../useMenuOptionsForm';
import { useMenuFormState } from '../../useMenuFormState';
import { useMenuActions } from '../../useMenuActions';

// Mock the child hooks
jest.mock('../../useMenuFormState', () => ({
  useMenuFormState: jest.fn()
}));

jest.mock('../../useMenuActions', () => ({
  useMenuActions: jest.fn()
}));

describe('Menu Options Initialization Tests', () => {
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
    createOption: jest.fn(),
    updateOption: jest.fn(),
    deleteOption: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMenuFormState as jest.Mock).mockReturnValue(mockMenuFormState);
    (useMenuActions as jest.Mock).mockReturnValue(mockMenuActions);
  });

  it('should initialize with the correct hooks', () => {
    renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    expect(useMenuFormState).toHaveBeenCalledWith(mockInitialOptions);
    expect(useMenuActions).toHaveBeenCalledWith(
      mockInitialOptions,
      mockMenuFormState.setOptions,
      mockCategory,
      mockOnSave,
      mockMenuFormState.resetAddState,
      mockMenuFormState.resetEditState,
      mockMenuFormState.setIsSaving
    );
  });

  it('should return all expected properties and methods', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    // Check if all the expected properties are present
    expect(result.current).toHaveProperty('options');
    expect(result.current).toHaveProperty('isAdding');
    expect(result.current).toHaveProperty('isSaving');
    expect(result.current).toHaveProperty('editingId');
    expect(result.current).toHaveProperty('newOption');
    expect(result.current).toHaveProperty('editedOption');
    expect(result.current).toHaveProperty('processingId');

    // Check if all the expected methods are present
    expect(result.current).toHaveProperty('handleAddOption');
    expect(result.current).toHaveProperty('handleCancelAdd');
    expect(result.current).toHaveProperty('handleNewOptionChange');
    expect(result.current).toHaveProperty('handleSaveNew');
    expect(result.current).toHaveProperty('handleEdit');
    expect(result.current).toHaveProperty('handleCancelEdit');
    expect(result.current).toHaveProperty('handleEditChange');
    expect(result.current).toHaveProperty('handleSaveEdit');
    expect(result.current).toHaveProperty('handleDeleteOption');
  });

  it('should return child hook state and values correctly', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    // Check state values from useMenuFormState
    expect(result.current.options).toEqual(mockInitialOptions);
    expect(result.current.isAdding).toBe(false);
    expect(result.current.editingId).toBeNull();
    
    // Check values from useMenuActions
    expect(result.current.processingId).toBeNull();
  });
});
