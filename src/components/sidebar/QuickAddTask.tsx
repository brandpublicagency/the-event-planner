interface QuickAddTaskProps {
  isCollapsed: boolean;
  onAddTask: () => void;
}

const QuickAddTask = ({ isCollapsed, onAddTask }: QuickAddTaskProps) => {
  if (isCollapsed) {
    return (
      <div className="p-4">
        <button 
          onClick={onAddTask}
          className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-100"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
      <h3 className="font-medium mb-1">To-do List</h3>
      <p className="text-sm text-gray-500 mb-4">Creating or adding new tasks couldn't be easier</p>
      <button 
        onClick={onAddTask}
        className="w-full bg-[#1A1F2C] text-white rounded-lg py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#2A2F3C]"
      >
        <span className="text-lg">+</span> Add New Task
      </button>
    </div>
  );
};

export default QuickAddTask;