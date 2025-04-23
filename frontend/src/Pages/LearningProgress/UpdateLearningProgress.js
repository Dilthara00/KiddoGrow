import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, FileText, Briefcase, Calendar, AlertCircle, Loader, ArrowLeft, Save } from 'lucide-react';
import SideBar from '../../Components/SideBar/SideBar';
import './LearningProgress.css';

function UpdateLearningProgress() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchProgress = async () => {
      try {
        const response = await fetch(`http://localhost:8080/learningProgress/${id}`);
        if (!response.ok) {
          throw new Error('Progress not found');
        }
        const data = await response.json();
        setFormData({
          ...data,
          startDate: data.startDate?.split('T')[0],
          endDate: data.endDate?.split('T')[0]
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
        alert('Failed to load progress data');
        navigate('/allLearningProgress');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Learning Progress updated successfully!');
        navigate('/allLearningProgress');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update Learning Progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('An error occurred while updating your progress. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="progress-container">
        <SideBar />
        <main>
          <div className="progress-loading">
            <Loader className="progress-loading-spinner" />
            <p>Loading progress data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <SideBar />
      <main>
        <header className="progress-header">
          <button 
            className="progress-back-btn" 
            onClick={() => navigate('/allLearningProgress')}
          >
            <ArrowLeft size={20} />
            Back to Progress
          </button>
          <h1 className="progress-title">Update Learning Progress</h1>
          <p className="progress-subtitle">
            Update your learning journey details and track how far you've come.
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
              <Save size={20} />
              Update Progress
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default UpdateLearningProgress;