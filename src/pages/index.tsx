import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import emailjs from 'emailjs-com';
import ChangeLog from '../app/components/ChangeLog';

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
      setTodos((todos) => [...todos, input]);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form from submitting
      handleAddTodo();
    }
  };

  const handleRemoveTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs.send('service_xg7o1zp', 'template_5solus9', formData, 'etp9mxdwYiseBfjZj')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <main className="main-content bg-primary-background-color text-white min-h-screen">
      <Helmet>
        <title>Lost Mokokos</title>
        <meta name="description" content="Lost Ark Information for all your needs" />
      </Helmet>
      <h1 className="text-4xl text-center mt-4 mb-4 text-[48px]">Lost Mokokos</h1>
      <h2 className="text-primary-text-color text-center text-2xl">
        Added Discord Server for Comments Suggestions
        <br />
        Added Working Engraving Optimizer after many hours
      </h2>
      <div className="m-5 bg-secondary-background-color p-5 rounded-lg">
        <h2 className="text-lg text-primary-text-color">Todo List</h2>
        <form
          className="flex gap-2 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTodo();
          }}
        >
          <input
            type="text"
            className="flex-grow p-2 border rounded bg-primary-background-color text-white"
            placeholder="Add a new task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="bg-primary-background-selection-color text-white px-4 py-2 rounded" type="submit">
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
        <h2 className="text-lg text-primary-text-color mb-4">Contact Me</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-primary-background-color text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-primary-background-color text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 bg-primary-background-color text-white rounded"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-primary-background-selection-color text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      </div>
      <div className="m-5 bg-secondary-background-color p-5 rounded-lg">
        <ChangeLog />
      </div>
    </main>
  );
}
