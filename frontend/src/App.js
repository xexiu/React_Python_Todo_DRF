import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import CustomModal from './components/CustomModal';

function App() {
  const [allValues, setAllValues] = useState({
    viewCompleted: false,
    todoList: [],
    modal: false,
    activeItem: {
      title: '',
      description: '',
      completed: false
    }
  });

  async function refreshList() {
    try {
      const resp = await axios.get('/api/todos');
      return setAllValues(prev => {
        return {
          ...prev,
          todoList: resp.data
        };
      });
    } catch (err) {
      return console.log('Fetch data error: ', err);
    }
  }

  useEffect(() => {
    refreshList();
    return () => { }
  }, []);

  function toggle() {
    return setAllValues(prev => {
      return {
        ...prev,
        modal: !allValues.modal
      }
    })
  }

  async function handleSubmit(item) {
    toggle();

    console.log('save', JSON.stringify(item));
    if (item.id) {
      await axios.put(`/api/todos/${item.id}/`, item);
      return await refreshList();
    }
    await axios.post('/api/todos/', item);
    return await refreshList();
  }

  async function handleDelete(item) {
    console.log('delete', JSON.stringify(item));

    await axios.delete(`/api/todos/${item.id}/`);
    return await refreshList();
  }

  function createItem() {
    const item = {
      title: '',
      description: '',
      completed: false
    }

    return setAllValues(prev => {
      return {
        ...prev,
        activeItem: item,
        modal: !allValues.modal
      }
    })
  }

  function editItem(item) {
    return setAllValues(prev => {
      return {
        ...prev,
        allValues: item,
        modal: !allValues.modal
      }
    })
  }

  function displayCompleted(status) {
    return setAllValues(prev => {
      return {
        ...prev,
        viewCompleted: !status
      }
    })
  }

  function renderTabList() {
    return (
      <div className="nav nav-tabs">
        <span className={allValues.viewCompleted ? 'nav-link active' : 'nav-link'} onClick={() => displayCompleted(allValues.viewCompleted)}>
          {allValues.viewCompleted ? 'Completed' : 'Incompleted'}
        </span>
      </div>
    )
  }

  function renderItems() {
    const { viewCompleted, todoList } = allValues;
    const newItems = todoList.filter(item => item.completed === viewCompleted);

    return newItems.map(item => {
      return (
        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
          <span className={`todo-title mr-2 ${viewCompleted ? 'completed-todo' : ''}`} title={item.description}>
            {item.title}
          </span>
          <span>
            <button className="btn btn-secondary mr-2" onClick={() => editItem(item)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(item)}>Delete</button>
          </span>
        </li>
      )
    })
  }

  if (!allValues.todoList.length) {
    return (
      <main className="container">
        <h1>Todo App</h1>
        <div className="row">List is empty!</div>
        <button className="btn btn-primary" onClick={createItem}>
          Add Task
        </button>
        {allValues.modal ? (
          <CustomModal
            activeItem={allValues.activeItem}
            toggle={toggle}
            onSave={handleSubmit}
          />
        ) : null}
      </main>
    )
  }

  return (
    <main className="container">
      <h1>Todo App</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card pb-3">
            <div className="mb-4">
              <button className="btn btn-primary" onClick={createItem}>
                Add Task
              </button>
            </div>
            {renderTabList()}
            <ul className="list-group list-group-flush border-top-0">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
      {allValues.modal ? (
        <CustomModal
          activeItem={allValues.activeItem}
          toggle={toggle}
          onSave={handleSubmit}
        />
      ) : null}
    </main>
  );
}

export default App;
