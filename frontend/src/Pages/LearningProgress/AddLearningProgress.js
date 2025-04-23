import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Briefcase, Calendar, AlertCircle } from 'lucide-react';
import SideBar from '../../Components/SideBar/SideBar';
import './LearningProgress.css';

function AddLearningProgress() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skillTitle: '',
    description: '',
    field: '',
    startDate: '',
    endDate: '',
    level: '0',
    postOwnerID: '',
    postOwnerName: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData(prev => ({ ...prev, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.fullname) {
            setFormData(prev => ({ ...prev, postOwnerName: data.fullname }));
          }
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.skillTitle.trim()) {
      newErrors.skillTitle = 'Skill title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.field) {
      newErrors.field = 'Please select a field';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/learningProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Learning Progress added successfully!');
        navigate('/allLearningProgress');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add Learning Progress');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving your progress. Please try again.');
    }
  };

  return (
    <div className="progress-container">
      <SideBar />
      <main>
        <header className="progress-header">
          <h1 className="progress-title">Track Your Learning Journey</h1>
          <p className="progress-subtitle">
            Document your progress and keep track of your learning achievements. Add details about
            what you're learning, set your goals, and monitor your growth.
          </p>
        </header>

        <form className="progress-form" onSubmit={handleSubmit}>
          <div className="progress-form-content">
            <div className="progress-form-group">
              <label className="progress-label">
                <BookOpen />
                Skill Title
              </label>
              <input
                type="text"
                className={`progress-input ${errors.skillTitle ? 'error' : ''}`}
                name="skillTitle"
                value={formData.skillTitle}
                onChange={handleChange}
                placeholder="Enter the skill you're learning"
              />
              {errors.skillTitle && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.skillTitle}
                </div>
              )}
            </div>

            <div className="progress-form-group">
              <label className="progress-label">
                <FileText />
                Description
              </label>
              <textarea
                className={`progress-input progress-textarea ${errors.description ? 'error' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you're learning and your goals"
              />
              {errors.description && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.description}
                </div>
              )}
            </div>

            <div className="progress-form-group">
              <label className="progress-label">
                <Briefcase />
                Field
              </label>
              <select
                className={`progress-input progress-select ${errors.field ? 'error' : ''}`}
                name="field"
                value={formData.field}
                onChange={handleChange}
              >
                <option value="">Select your field</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Programming Language">Programming Language</option>
                <option value="Backend Development">Backend Development</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Quality Assurance">Quality Assurance</option>
              </select>
              {errors.field && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.field}
                </div>
              )}
            </div>

            <div className="progress-form-group">
              <label className="progress-label">
                <Calendar />
                Start Date
              </label>
              <div className="progress-date">
                <input
                  type="date"
                  className={`progress-input ${errors.startDate ? 'error' : ''}`}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              {errors.startDate && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.startDate}
                </div>
              )}
            </div>

            <div className="progress-form-group">
              <label className="progress-label">
                <Calendar />
                End Date
              </label>
              <div className="progress-date">
                <input
                  type="date"
                  className={`progress-input ${errors.endDate ? 'error' : ''}`}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
              {errors.endDate && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.endDate}
                </div>
              )}
            </div>
          </div>

          <div className="progress-form-actions">
            <button 
              type="button" 
              className="progress-btn progress-btn-secondary"
              onClick={() => navigate('/allLearningProgress')}
            >
              Cancel
            </button>
            <button type="submit" className="progress-btn progress-btn-primary">
              Save Progress
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddLearningProgress;