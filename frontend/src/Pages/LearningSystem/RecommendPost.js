import React from 'react';
import SideBar from '../../Components/SideBar/SideBar';
import './LearningSystem.css';
import { ThumbsUp, Edit3, Trash2, Plus, List, User, FileText, BookOpen } from 'lucide-react';

function RecommendPost() {
    // ... keep all your existing state and effect hooks ...

    return (
        <div className="learning-container">
                    <SideBar />
            <main>
                <div className="learning-header">
                    <h1 className="learning-title">Recommended Learning Posts</h1>
                    <div className="learning-actions">
                        <button
                            className="learning-btn learning-btn-primary"
                            onClick={() => (window.location.href = '/learningSystem/addLeariningPost')}
                        >
                            <Plus size={18} />
                            <span>Create Post</span>
                        </button>
                        <button
                            className="learning-btn learning-btn-secondary"
                            onClick={() => {}}
                        >
                            {false ? (
                                <>
                                    <List size={18} />
                                    <span>All Posts</span>
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

                {[]?.length === 0 ? (
                    <div className="learning-empty">
                        <div className="learning-empty-icon">
                            <BookOpen size={28} />
                        </div>
                        <h3>No recommended posts found</h3>
                        <p>We couldn't find posts matching your skills. Try creating one!</p>
                    <button
                            className="learning-btn learning-btn-primary"
                        onClick={() => (window.location.href = '/learningSystem/addLeariningPost')}
                    >
                            <Plus size={18} />
                            <span>Create New Post</span>
                    </button>
                            </div>
                        ) : (
                    <div className="learning-grid">
                        {[].map((post) => (
                            <article key={post.id} className="learning-card">
                                <header className="learning-card-header">
                                    <div className="learning-author">
                                        <div className="learning-avatar">
                                            {post.postOwnerName ? post.postOwnerName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="learning-author-info">
                                            <div className="learning-author-name">{post.postOwnerName}</div>
                                            <time className="learning-time">{post.createdAt}</time>
                                            </div>
                                    </div>
                                    
                                    {post.postOwnerID === '' && (
                                        <div className="learning-card-actions">
                                            <button onClick={() => {}} className="learning-btn-icon">
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => {}} className="learning-btn-icon danger">
                                                <Trash2 size={18} />
                                            </button>
                                    </div>
                                    )}
                                </header>

                                <div className="learning-card-content">
                                    <h2 className="learning-card-title">{post.title}</h2>
                                    <p className="learning-card-description">{post.description}</p>
                                    
                                    {post.tags?.length > 0 && (
                                        <div className="learning-tags">
                                            {post.tags.map((tag, index) => (
                                                <span key={index} className="learning-tag">{tag}</span>
                                        ))}
                                    </div>
                                    )}
                                </div>

                                {post.contentURL && (
                                    <div className="learning-media">
                                            <iframe
                                            src={post.contentURL}
                                                title={post.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                    </div>
                                )}

                                <footer className="learning-card-footer">
                                    <button 
                                        onClick={() => {}}
                                        className={`learning-like-btn ${post.likes?.[''] ? 'liked' : ''}`}
                                    >
                                        <ThumbsUp size={18} />
                                        <span>{Object.values(post.likes || {}).filter(Boolean).length}</span>
                                    </button>
                                </footer>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default RecommendPost;