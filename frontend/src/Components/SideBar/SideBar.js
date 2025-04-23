import React from 'react';
import { BookOpen, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import styles from './SideBar.module.css';
import NavBar from '../NavBar/NavBar';

function SideBar() {
    const currentPath = window.location.pathname;

    return (
        <div className={styles.sideBarContainerNav}>
            <div className={styles.sideBarNavbarWrapper}>
                <NavBar />
            </div>
            <div className={styles.sideBarNav}>
                <div className={styles.sideBarNavItems}>
                    <div 
                        className={`${styles.sideBarNavItem} ${currentPath === '/learningSystem/allLearningPost' ? styles.sideBarNavItemActive : ''}`}
                        onClick={() => (window.location.href = '/learningSystem/allLearningPost')}
                    >
                        <BookOpen size={20} className={styles.sideBarNavIcon} />
                        <span>EduStream</span>
                    </div>
                    
                    <div 
                        className={`${styles.sideBarNavItem} ${currentPath === '/allPost' ? styles.sideBarNavItemActive : ''}`}
                        onClick={() => (window.location.href = '/allPost')}
                    >
                        <MessageSquare size={20} className={styles.sideBarNavIcon} />
                        <span>BoostPost</span>
                    </div>
                    
                    <div 
                        className={`${styles.sideBarNavItem} ${currentPath === '/allLearningProgress' ? styles.sideBarNavItemActive : ''}`}
                        onClick={() => (window.location.href = '/allLearningProgress')}
                    >
                        <TrendingUp size={20} className={styles.sideBarNavIcon} />
                        <span>LearnTrack</span>
                    </div>
                    
                    {localStorage.getItem('userType') !== 'googale' && (
                        <div 
                            className={`${styles.sideBarNavItem} ${currentPath === '/learningSystem/recommendPost' ? styles.sideBarNavItemActive : ''}`}
                            onClick={() => (window.location.href = '/learningSystem/recommendPost')}
                        >
                            <Zap size={20} className={styles.sideBarNavIcon} />
                            <span>SkillPulse</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SideBar;   

