import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import emailjs from 'emailjs-com';

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
        Fresh Update! Added Engraving Calculator! Check it out!
        <br />
        Will be adding Weekly Unas as well to Character Sheet and Rest Soon!
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
        <hr className="my-8" />
        <Timeline position="alternate-reverse">
          {[
            'Updated Manage Raids styling to work properly for Active, Inactive and Hover over Raid Chips and Help Text',
            'Added Basic HomePage for Updates and Communication',
            'Todo List is only temporary for fun will probably remove it later or revamp it',
            'Updated Total Gold Row in Gold Calculator to Be Visible Always on the Bottom, made it mobile friendly',
            'Removing Page Refresh when you add something to Todo List',
            'Updated Communication Text to be More User Friendly with a Timeline Instead of a List',
            'Working on Thaemine and Echnida Removal Fix, Most Likely rewriting The Raid Calculator from scratch to be more efficient and easier to maintain',
            'Added a New Row called Additional Gold to Add your own Gold to the Total Gold Calculation based on each Individual Character',
            "Fixed Issue with text cutting into Checkbox's for labels on Smaller Windows",
            'Adding Show Differences Icon on Raids instead of doing mouse hover to be more mobile friendly',
            'Updating Gold Formatting to your currency locale formatting',
            'Lined up Additional Gold with Total Gold for better readability',
            'Updated Raids Data to Include Boss Drops Upto Echnida',
            'Working on fixing totals for double boss rewards stacking on each other in raids Page',
            'Added Trash Can Icon to Clear All Data from Gold Calculator Except Raid Selections',
            'Managing Raids is now 2 columns if you have a smaller screen or width',
            'Added All Honor Shard Rewards Upto Thaemine!',
            "Added a Popup to confirm to clear data so you don't accidently delete it :)",
            'Adding Chaos Stones to Raid Grid',
            'Fixed bug that Additional Gold was Adding Twice to Total Gold',
            'Rewrote Gold Calculator Special Key to Calculate Gold for Each Raid',
            'Fixed Thaemine and Echnida Raid Removal Issues for Gold Calculator!',
            'Adding Destruction Stones to Raid Grid, Boxs and Clears',
            'Adding Contact Me Support for Requests and Bug Reporting!',
            'Fixed Title Tab Issues for Hard Mode for Raids Page',
            'Boss Rewards for Box and Clear are the same so they are not added twice',
            'Fixed Removing Thaemine or Echnida Raids! If You are Having Issues please click Trash Can to Delete Data and Reset!',
            'Added Raid Info for Boss Drops, Chaos Stones, Destruction Stones and tooltips.',
            'Added Daily and Weekly Todo!!!! Chaos Gates, Una Tasks, Guardian Raids and Guild Weeklies! That automatically resets daily and weekly!',
          ]
            .reverse()
            .map((content, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className="p-3 bg-primary-background-color text-primary-text-color">
                    <Typography>{content}</Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </div>
    </main>
  );
}
