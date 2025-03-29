
import { renderHook, act } from '@testing-library/react-hooks';
import { useMenuFormState } from '../useMenuFormState';

describe('useMenuFormState', () => {
  const mockInitialOptions = [
    { id: '1', value: 'option1', label: 'Option 1', category: 'test' },
    { id: '2', value: 'option2', label: 'Option 2', category: 'test' },
  ];

  it('should initialize with the provided options', () => {
    const { result } = renderHook(() => 
      useMenuFormState(mockInitialOptions)
    );

    expect(result.current.options).toEqual(mockInitialOptions);
    expect(result.current.isAdding).toBe(false);
    expect(result.current.editingId).toBeNull();
  });

  it('should update options when initialOptions change', () => {
    const { result, rerender } = renderHook(
      (props) => useMenuFormState(props),
      { initialProps: mockInitialOptions }
    );

    const newOptions = [
      ...mockInitialOptions,
      { id: '3', value: 'option3', label: 'Option 3', category: 'test' }
    ];

    rerender(newOptions);

    expect(result.current.options).toEqual(newOptions);
  });

  it('should reset add state correctly', () => {
    const { result } = renderHook(() => 
      useMenuFormState(mockInitialOptions)
    );

    act(() => {
      result.current.setIsAdding(true);
      result.current.setNewOption({ value: 'test', label: 'Test' });
    });

    expect(result.current.isAdding).toBe(true);
    expect(result.current.newOption).toEqual({ value: 'test', label: 'Test' });

    act(() => {
      result.current.resetAddState();
    });

    expect(result.current.isAdding).toBe(false);
    expect(result.current.newOption).toEqual({ value: '', label: '' });
  });

  it('should reset edit state correctly', () => {
    const { result } = renderHook(() => 
      useMenuFormState(mockInitialOptions)
    );

    act(() => {
      result.current.setEditingId('1');
      result.current.setEditedOption({ value: 'edited', label: 'Edited' });
    });

    expect(result.current.editingId).toBe('1');
    expect(result.current.editedOption).toEqual({ value: 'edited', label: 'Edited' });

    act(() => {
      result.current.resetEditState();
    });

    expect(result.current.editingId).toBeNull();
    expect(result.current.editedOption).toEqual({ value: '', label: '' });
  });
});
