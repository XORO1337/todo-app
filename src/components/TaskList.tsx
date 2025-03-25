import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { removeTodo, toggleTodoComplete, updateTodoPriority, setActiveFilter, setActiveTags } from '../store/reducers/todoReducer';
import { Button, Badge, Form, Row, Col, ListGroup, Dropdown } from 'react-bootstrap';

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredTodos, activeFilter, activeTags } = useAppSelector(state => state.todos);
  const allTags = useAppSelector(state => {
    // Get all unique tags from all todos
    const tagSet = new Set<string>();
    state.todos.todos.forEach(todo => {
      todo.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  });

  const handleDelete = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleTodoComplete(id));
  };

  const handlePriorityChange = (id: string, priority: 'High' | 'Medium' | 'Low') => {
    dispatch(updateTodoPriority({ id, priority }));
  };

  const handleFilterChange = (filter: 'all' | 'High' | 'Medium' | 'Low') => {
    dispatch(setActiveFilter(filter));
  };

  const handleTagClick = (tag: string) => {
    // Toggle tag selection
    if (activeTags.includes(tag)) {
      dispatch(setActiveTags(activeTags.filter(t => t !== tag)));
    } else {
      dispatch(setActiveTags([...activeTags, tag]));
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h5>Filter by Priority</h5>
        <div className="d-flex gap-2">
          <Button 
            variant={activeFilter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'High' ? 'danger' : 'outline-danger'}
            onClick={() => handleFilterChange('High')}
          >
            High
          </Button>
          <Button 
            variant={activeFilter === 'Medium' ? 'warning' : 'outline-warning'}
            onClick={() => handleFilterChange('Medium')}
          >
            Medium
          </Button>
          <Button 
            variant={activeFilter === 'Low' ? 'success' : 'outline-success'}
            onClick={() => handleFilterChange('Low')}
          >
            Low
          </Button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="mb-4">
          <h5>Filter by Tags</h5>
          <div className="d-flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge 
                key={tag} 
                bg={activeTags.includes(tag) ? 'primary' : 'secondary'}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {activeTags.length > 0 && (
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => dispatch(setActiveTags([]))}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}

      {filteredTodos.length === 0 ? (
        <div className="text-center p-4 bg-light rounded">
          <p className="mb-0">No tasks found. Add some tasks to get started!</p>
        </div>
      ) : (
        <ListGroup>
          {filteredTodos.map(todo => (
            <ListGroup.Item key={todo.id} className="mb-3 border rounded shadow-sm">
              <Row className="align-items-center">
                <Col xs={12} md={8}>
                  <div className="d-flex align-items-center">
                    <Form.Check 
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      label=""
                      className="me-2"
                    />
                    <span style={{ 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      opacity: todo.completed ? 0.6 : 1
                    }}>
                      {todo.text}
                      {todo.time && (
                        <span className="ms-2 text-muted">
                          <i className="bi bi-clock"></i> {todo.time}
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
                    <Badge bg={getPriorityBadgeVariant(todo.priority)}>
                      {todo.priority}
                    </Badge>
                    
                    {todo.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary">{tag}</Badge>
                    ))}
                    
                    {todo.location && (
                      <Badge bg="info">
                        <i className="bi bi-geo-alt"></i> {todo.location}
                      </Badge>
                    )}
                  </div>
                  
                  {todo.weather && (
                    <div className="mt-2 d-flex align-items-center">
                      <img 
                        src={todo.weather.icon} 
                        alt={todo.weather.description} 
                        style={{ width: '40px', height: '40px' }}
                      />
                      <span className="ms-2">
                        {todo.weather.description}, {todo.weather.temperature}°C
                      </span>
                    </div>
                  )}
                </Col>
                
                <Col xs={12} md={4} className="mt-3 mt-md-0 d-flex justify-content-end">
                  <Dropdown className="me-2">
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      Priority
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item 
                        onClick={() => handlePriorityChange(todo.id, 'High')}
                        active={todo.priority === 'High'}
                      >
                        High
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => handlePriorityChange(todo.id, 'Medium')}
                        active={todo.priority === 'Medium'}
                      >
                        Medium
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => handlePriorityChange(todo.id, 'Low')}
                        active={todo.priority === 'Low'}
                      >
                        Low
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default TaskList;