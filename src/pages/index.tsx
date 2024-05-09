import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (input) {
      setTodos(todos => [...todos, input]);
      setInput('');
    }
  };

  const handleRemoveTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <main className="main-content bg-primary-background-color text-white min-h-screen">
      <h1 className="text-4xl text-center mt-4 mb-4">Lost Mokokos</h1>
      <div className="m-5 bg-secondary-background-color p-5 rounded-lg">
        <h2 className="text-lg text-primary-text-color">Todo List</h2>
        <form className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-grow p-2 border rounded bg-primary-background-color text-white"
            placeholder="Add a new task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button
            className="bg-primary-background-selection-color text-white px-4 py-2 rounded"
            onClick={handleAddTodo}
          >
            Add
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <li key={index} className="flex justify-between items-center">
              {todo}
              <button className="text-red-500" onClick={() => handleRemoveTodo(index)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="m-5 bg-secondary-background-color p-5 rounded-lg">
        <h2 className="text-lg text-primary-text-color mb-4">Updates So Far</h2>
        <p className="text-secondary-text-color">
          - Updated Manage Raids styling to work properly for Active, Inactive and Hover over Raid Chips and Help Text<br />
          - Adding Basic HomePage for Updates and Communication<br />
          - Todo List is only temporary for fun will probably remove it later or revamp it<br />
        </p>
        <h2 className="text-lg text-primary-text-color mt-5">Do not Remove Thaemine or Echnida as Raids otherwise your Raid Calculator will be Incorrect for Kayangel NM and Brelshaza</h2>
      </div>
    </main>
  );
}
