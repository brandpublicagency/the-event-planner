
import { renderHook, act } from '@testing-library/react-hooks';
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

describe('Menu Options CRUD Tests', () => {
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
    createOption: jest.fn().mockResolvedValue(true),
    updateOption: jest.fn().mockResolvedValue(true),
    deleteOption: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMenuFormState as jest.Mock).mockReturnValue(mockMenuFormState);
    (useMenuActions as jest.Mock).mockReturnValue(mockMenuActions);
  });

  it('should handle adding an option', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleAddOption();
    });

    expect(mockMenuFormState.setIsAdding).toHaveBeenCalledWith(true);
    expect(mockMenuFormState.setNewOption).toHaveBeenCalledWith({ value: '', label: '' });
  });

  it('should handle canceling add', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleCancelAdd();
    });

    expect(mockMenuFormState.resetAddState).toHaveBeenCalled();
  });

  it('should handle new option change', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleNewOptionChange('value', 'new-value');
    });

    expect(mockMenuFormState.setNewOption).toHaveBeenCalled();
  });

  it('should handle editing an option', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    const optionToEdit = mockInitialOptions[0];
    
    act(() => {
      result.current.handleEdit(optionToEdit);
    });

    expect(mockMenuFormState.setEditingId).toHaveBeenCalledWith(optionToEdit.id);
    expect(mockMenuFormState.setEditedOption).toHaveBeenCalledWith({
      value: optionToEdit.value,
      label: optionToEdit.label
    });
  });

  it('should handle canceling edit', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleCancelEdit();
    });

    expect(mockMenuFormState.resetEditState).toHaveBeenCalled();
  });

  it('should handle edit change', () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    act(() => {
      result.current.handleEditChange('value', 'updated-value');
    });

    expect(mockMenuFormState.setEditedOption).toHaveBeenCalled();
  });

  it('should handle deleting an option', async () => {
    const { result } = renderHook(() => 
      useMenuOptionsForm(mockInitialOptions, mockCategory, mockOnSave)
    );

    await act(async () => {
      await result.current.handleDeleteOption('1');
    });

    expect(mockMenuActions.deleteOption).toHaveBeenCalledWith('1');
  });
});
