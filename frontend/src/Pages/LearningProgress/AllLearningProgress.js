import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Edit3, Plus, Trash2, User, BookOpen, List, LineChart } from 'lucide-react';
import SideBar from '../../Components/SideBar/SideBar';
import './LearningProgress.css';

function AllLearningProgress() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const userId = localStorage.getItem('userID');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/learningProgress');
        const data = await response.json();
        setProgressData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching learning progress data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning progress?')) {
      try {
        const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Learning Progress deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        }
      } catch (error) {
        console.error('Error deleting learning progress:', error);
      }
    }
  };

  const toggleFilter = () => {
    if (showMyPosts) {
      setFilteredData(progressData);
    } else {
      const myPosts = progressData.filter((progress) => progress.postOwnerID === userId);
      setFilteredData(myPosts);
    }
    setShowMyPosts(!showMyPosts);
  };

  return (
    <div className="progress-container">
      <SideBar />
      <main>
        <div className="progress-header">
          <div className="progress-header-title">
            <LineChart size={24} />
            <h1>Learning Progress</h1>
          </div>
          <div className="progress-actions">
            <button 
              className="progress-btn progress-btn-primary"
              onClick={() => navigate('/addLearningProgress')}
            >
              <Plus size={18} />
              <span>Create Post</span>
            </button>
            <button 
              className="progress-btn progress-btn-secondary"
              onClick={toggleFilter}
            >
              {showMyPosts ? (
                <>
                  <List size={18} />
                  <span>Show All</span>
                </>
              ) : (
                <>
                  <User size={18} />
                  <span>My Posts</span>
                </>
              )}
            </button>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="progress-empty">
            <div className="progress-empty-icon">
              <LineChart size={32} />
            </div>
            <h3>No Learning Progress Found</h3>
            <p>Start tracking your learning journey by creating a new post.</p>
            <button 
              className="progress-btn progress-btn-primary"
              onClick={() => navigate('/addLearningProgress')}
            >
              <Plus size={18} />
              <span>Create New Post</span>
            </button>
          </div>
        ) : (
          <div className="progress-grid">
            {filteredData.map((progress) => (
              <div key={progress.id} className="progress-card">
                <div className="progress-card-header">
                  <div className="progress-user-info">
                    <div className="progress-avatar">
                      <User size={18} />
                    </div>
                    <div className="progress-user-name">{progress.postOwnerName}</div>
                  </div>
                  {progress.postOwnerID === userId && (
                    <div className="progress-actions-compact">
                      <button 
                        onClick={() => navigate(`/updateLearningProgress/${progress.id}`)}
                        className="progress-btn-update"
                        aria-label="Update progress"
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(progress.id)}
                        className="progress-btn-delete"
                        aria-label="Delete progress"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="progress-card-content">
                  <h2 className="progress-skill-title">
                    {progress.skillTitle}
                    <span className="progress-skill-field">{progress.field}</span>
                  </h2>
                  
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar"
                      style={{ width: `${progress.level}%` }}
                    ></div>
                    <span className="progress-percent">{progress.level}%</span>
                  </div>

                  <div className="progress-description">
                    <h4>Description</h4>
                    <p>{progress.description}</p>
                  </div>

                  <div className="progress-date-range">
                    <Calendar size={14} />
                    <span>{progress.startDate} to {progress.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AllLearningProgress;