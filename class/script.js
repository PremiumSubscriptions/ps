// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Global Variables
let isDark = false;
let isScrolled = false;
let mockClasses = [];
let filteredClasses = [];
let selectedGrades = ['All Grade/Level'];
let selectedCourse = 'All Course';
let selectedSubjects = ['All Subject'];
let observer;

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('header');
const coursesGrid = document.getElementById('coursesGrid');

// Initialize App
function initApp() {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }

    // Start typing animation
    startTypingAnimation();

    // Load classes data
    loadClasses();

    // Generate footer particles
    generateFooterParticles();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize event listeners
    initEventListeners();
}

// Typing Animation
function startTypingAnimation() {
    const text = "Welcome to Premium's Class Portal";
    const typingElement = document.getElementById('typingText');
    const cursor = document.getElementById('cursor');
    let index = 0;

    function typeCharacter() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, 100);
        } else {
            // Start cursor blinking after typing is complete
            cursor.style.animation = 'cursorBlink 1s ease-in-out infinite';
        }
    }

    // Start typing after a short delay
    setTimeout(typeCharacter, 500);
}

// Load classes from simplified JSON structure
async function loadClasses() {
    try {
        // Simplified class data structure as requested
        mockClasses = [
            {
                id: 1,
                title: "ACS Physics HSC 27 By Apurbo Mashrur Apar (Cycle-1)",
                subject: "Physics",
                grade: "HSC 27",
                courseType: "ACS",
                link: "https://wakilbd.github.io/ps/class/1",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 2,
                title: "ACS Physics HSC 27 By Apurbo Mashrur Apar (Cycle-2)",
                subject: "Physics",
                grade: "HSC 27",
                courseType: "ACS",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 3,
                title: "RTDS Mathematics HSC 26 Complete Course",
                subject: "Mathematics",
                grade: "HSC 26",
                courseType: "RTDS",
                image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 4,
                title: "Battle of Biology HSC 27 Intensive Course",
                subject: "Biology",
                grade: "HSC 27",
                courseType: "Battle of Biology",
                image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 5,
                title: "CPS Chemistry HSC 26 Advanced Learning",
                subject: "Chemistry",
                grade: "HSC 26",
                courseType: "CPS",
                image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 6,
                title: "Bondi Pathshala ICT HSC 27",
                subject: "ICT",
                grade: "HSC 27",
                courseType: "Bondi Pathshala",
                image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 7,
                title: "Physics Hunters HSC 26 Expert Class",
                subject: "Physics",
                grade: "HSC 26",
                courseType: "Physics Hunters",
                image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 8,
                title: "OpenLearn English Admission 25",
                subject: "English",
                grade: "Admission 25",
                courseType: "OpenLearn",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            },
            {
                id: 9,
                title: "Biology Haters Admission 24 Crash Course",
                subject: "Biology",
                grade: "Admission 24",
                courseType: "Biology Haters",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            }
        ];
        
        filteredClasses = [...mockClasses];
        
        // Simulate loading delay
        setTimeout(() => {
            renderClasses();
        }, 1000);
    } catch (error) {
        console.error('Error loading classes:', error);
        coursesGrid.innerHTML = '<div class="loading">Error loading classes. Please try again later.</div>';
    }
}

// Theme Toggle
function toggleTheme() {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Update mobile menu toggle color
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (isDark) {
        mobileMenuToggle.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
        mobileMenuToggle.classList.remove('hover:bg-gray-100');
    } else {
        mobileMenuToggle.classList.add('hover:bg-gray-100');
        mobileMenuToggle.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-gray-800');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const isOpen = !mobileMenu.classList.contains('hidden');
    
    if (isOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
    } else {
        mobileMenu.classList.remove('hidden');
        mobileMenuToggle.querySelector('i').setAttribute('data-lucide', 'x');
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Header Scroll Effect
function handleScroll() {
    const scrollY = window.scrollY;
    const newIsScrolled = scrollY > 50;
    
    if (newIsScrolled !== isScrolled) {
        isScrolled = newIsScrolled;
        
        if (isScrolled) {
            header.className = `fixed w-full top-0 z-50 transition-all duration-300 ${
                isDark 
                    ? 'bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10'
                    : 'bg-white/95 backdrop-blur-xl border-b border-blue-200/50 shadow-xl'
            }`;
        } else {
            header.className = 'fixed w-full top-0 z-50 transition-all duration-300 bg-transparent';
        }
    }
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Function to toggle dropdown - modified for mobile popup
function toggleDropdown(type) {
    if (isMobile()) {
        const popup = document.getElementById(type + 'Popup');
        popup.classList.add('active');
        updatePopupSelections(type);
    } else {
        const dropdown = document.getElementById(type + 'Dropdown');
        const button = dropdown.previousElementSibling;
        const arrow = button.querySelector('.dropdown-arrow');

        // Close other dropdowns
        const dropdownTypes = ['grade', 'course', 'subject'];
        dropdownTypes.forEach(otherType => {
            if (otherType !== type) {
                const otherDropdown = document.getElementById(otherType + 'Dropdown');
                if (otherDropdown) {
                    const otherButton = otherDropdown.previousElementSibling;
                    const otherArrow = otherButton.querySelector('.dropdown-arrow');
                    otherDropdown.classList.remove('active');
                    otherButton.classList.remove('active');
                    otherArrow.classList.remove('rotated');
                }
            }
        });

        // Toggle current
        dropdown.classList.toggle('active');
        button.classList.toggle('active');
        arrow.classList.toggle('rotated');
    }
}

// Function to close popup
function closePopup(type) {
    const popup = document.getElementById(type + 'Popup');
    popup.classList.remove('active');
}

// Function to update popup selections
function updatePopupSelections(type) {
    const popup = document.getElementById(type + 'Popup');
    const items = popup.querySelectorAll('.popup-item');
    let currentSelections;

    if (type === 'grade') currentSelections = selectedGrades;
    else if (type === 'course') currentSelections = [selectedCourse];
    else if (type === 'subject') currentSelections = selectedSubjects;

    items.forEach(item => {
        item.classList.remove('selected');
        if (currentSelections.includes(item.textContent)) {
            item.classList.add('selected');
        }
    });
}

// Selection functions for mobile popups
function selectGradeFromPopup(grade) {
    if (grade === 'All Grade/Level') {
        selectedGrades = ['All Grade/Level'];
    } else {
        if (selectedGrades.includes('All Grade/Level')) {
            selectedGrades = selectedGrades.filter(g => g !== 'All Grade/Level');
        }
        if (selectedGrades.includes(grade)) {
            selectedGrades = selectedGrades.filter(g => g !== grade);
            if (selectedGrades.length === 0) {
                selectedGrades = ['All Grade/Level'];
            }
        } else {
            selectedGrades.push(grade);
        }
    }
    updateGradeDisplay();
    closePopup('grade');
    filterClasses();
}

function selectCourseFromPopup(course) {
    selectedCourse = course;
    document.getElementById('courseSelected').textContent = course;
    closePopup('course');
    filterClasses();
}

function selectSubjectFromPopup(subject) {
    if (subject === 'All Subject') {
        selectedSubjects = ['All Subject'];
    } else {
        if (selectedSubjects.includes('All Subject')) {
            selectedSubjects = selectedSubjects.filter(s => s !== 'All Subject');
        }
        if (selectedSubjects.includes(subject)) {
            selectedSubjects = selectedSubjects.filter(s => s !== subject);
            if (selectedSubjects.length === 0) {
                selectedSubjects = ['All Subject'];
            }
        } else {
            selectedSubjects.push(subject);
        }
    }
    updateSubjectDisplay();
    closePopup('subject');
    filterClasses();
}

// Desktop selection functions
function selectGrade(grade) {
    if (grade === 'All Grade/Level') {
        selectedGrades = ['All Grade/Level'];
    } else {
        if (selectedGrades.includes('All Grade/Level')) {
            selectedGrades = selectedGrades.filter(g => g !== 'All Grade/Level');
        }
        if (selectedGrades.includes(grade)) {
            selectedGrades = selectedGrades.filter(g => g !== grade);
            if (selectedGrades.length === 0) {
                selectedGrades = ['All Grade/Level'];
            }
        } else {
            selectedGrades.push(grade);
        }
    }
    updateGradeDisplay();
    closeDropdown('gradeDropdown');
    updateSelectedDropdownItems('#gradeDropdown');
    filterClasses();
}

function selectCourse(course) {
    selectedCourse = course;
    document.getElementById('courseSelected').textContent = course;
    closeDropdown('courseDropdown');
    updateSelectedDropdownItem('#courseDropdown', course);
    filterClasses();
}

function selectSubject(subject) {
    if (subject === 'All Subject') {
        selectedSubjects = ['All Subject'];
    } else {
        if (selectedSubjects.includes('All Subject')) {
            selectedSubjects = selectedSubjects.filter(s => s !== 'All Subject');
        }
        if (selectedSubjects.includes(subject)) {
            selectedSubjects = selectedSubjects.filter(s => s !== subject);
            if (selectedSubjects.length === 0) {
                selectedSubjects = ['All Subject'];
            }
        } else {
            selectedSubjects.push(subject);
        }
    }
    updateSubjectDisplay();
    closeDropdown('subjectDropdown');
    updateSelectedDropdownItems('#subjectDropdown');
    filterClasses();
}

// Helper functions to update display
function updateGradeDisplay() {
    const displayText = selectedGrades.includes('All Grade/Level') ? 'All Grade/Level' : selectedGrades.join(', ');
    document.getElementById('gradeSelected').textContent = displayText;
}

function updateSubjectDisplay() {
    const displayText = selectedSubjects.includes('All Subject') ? 'All Subject' : selectedSubjects.join(', ');
    document.getElementById('subjectSelected').textContent = displayText;
}

// Utility functions
function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    dropdown.classList.remove('active');
    const button = dropdown.previousElementSibling;
    button?.classList.remove('active');
    button?.querySelector('.dropdown-arrow')?.classList.remove('rotated');
}

function updateSelectedDropdownItem(selector, value) {
    const items = document.querySelectorAll(`${selector} .dropdown-item`);
    items.forEach(item => {
        item.classList.remove('selected');
        if (item.textContent === value) {
            item.classList.add('selected');
        }
    });
}

function updateSelectedDropdownItems(selector) {
    const items = document.querySelectorAll(`${selector} .dropdown-item`);
    items.forEach(item => {
        item.classList.remove('selected');
        let currentSelections;
        if (selector.includes('grade')) currentSelections = selectedGrades;
        else if (selector.includes('subject')) currentSelections = selectedSubjects;

        if (currentSelections && currentSelections.includes(item.textContent)) {
            item.classList.add('selected');
        }
    });
}

// Filter classes function
function filterClasses() {
    let filtered = [...mockClasses];

    // Grade filtering
    if (!selectedGrades.includes('All Grade/Level')) {
        filtered = filtered.filter(classItem => selectedGrades.includes(classItem.grade));
    }

    // CourseType filtering
    if (selectedCourse !== 'All Course') {
        filtered = filtered.filter(classItem => classItem.courseType === selectedCourse);
    }

    // Subject filtering
    if (!selectedSubjects.includes('All Subject')) {
        filtered = filtered.filter(classItem => selectedSubjects.includes(classItem.subject));
    }

    filteredClasses = filtered;
    renderClasses();
}

// Function to create class card
function createClassCard(classItem) {
    return `
        <div class="course-card">
            <img 
                class="course-image" 
                src="${classItem.image}" 
                alt="${classItem.title}"
                loading="lazy"
            />
            <div class="course-content">
                <div class="course-category">${classItem.subject}</div>
                <h3 class="course-title">${classItem.title}</h3>
                <div class="course-meta">
                    <div class="meta-item">
                        <i class="fas fa-graduation-cap meta-icon"></i>
                        <span>${classItem.grade}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-bookmark meta-icon"></i>
                        <span>${classItem.courseType}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-book meta-icon"></i>
                        <span>${classItem.subject}</span>
                    </div>
                </div>
                <div class="course-footer">
                    <button class="enroll-btn" onclick="enrollInClass(${classItem.id})">
                        Join Class
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to render classes
function renderClasses() {
    if (filteredClasses.length === 0) {
        coursesGrid.innerHTML = '<div class="loading">No classes found for the selected filters.</div>';
        return;
    }

    const classesHTML = filteredClasses.map(classItem => createClassCard(classItem)).join('');
    coursesGrid.innerHTML = classesHTML;
}

// Function to handle class enrollment
function enrollInClass(classId) {
    const classItem = mockClasses.find(c => c.id === classId);
    if (classItem) {
        window.location.href = classItem.link; 
  } else {
    alert("No link provided for this class.");
    }
}

// Generate Footer Particles
function generateFooterParticles() {
    const container = document.getElementById('footerParticles');
    if (!container) return;
    
    const particles = 20;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        const colors = ['bg-purple-400', 'bg-pink-400', 'bg-cyan-400', 'bg-blue-400'];
        
        particle.className = `absolute w-1 h-1 rounded-full animate-float opacity-30 ${colors[i % colors.length]}`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 3 + 4}s`;
        
        container.appendChild(particle);
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe fade-in elements
    document.querySelectorAll('.fade-in-element').forEach(element => {
        scrollObserver.observe(element);
    });
}

// Event Listeners
function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Scroll handling
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    // Button click effects
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Scale animation
            if (!this.id.includes('Toggle')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Auth button actions
    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Login functionality would go here!');
        });
    });

    document.querySelectorAll('button:not(.login-btn):not(#themeToggle):not(#mobileMenuToggle)').forEach(btn => {
        if (btn.textContent.includes('Sign Up')) {
            btn.addEventListener('click', () => {
                alert('Sign Up functionality would go here!');
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenuToggle) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        }
    });

    // Close dropdowns when clicking outside (desktop only)
    document.addEventListener('click', function(e) {
        if (!isMobile()) {
            const dropdowns = document.querySelectorAll('.filter-dropdown');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(e.target)) {
                    const menu = dropdown.querySelector('.dropdown-menu');
                    const button = dropdown.querySelector('.dropdown-button');
                    const arrow = dropdown.querySelector('.dropdown-arrow');
                    if (menu && button && arrow) {
                        menu.classList.remove('active');
                        button.classList.remove('active');
                        arrow.classList.remove('rotated');
                    }
                }
            });
        }
    });

    // Close popups when clicking outside (mobile only)
    document.addEventListener('click', function(e) {
        if (isMobile()) {
            const gradePopup = document.getElementById('gradePopup');
            const coursePopup = document.getElementById('coursePopup');
            const subjectPopup = document.getElementById('subjectPopup');

            if (gradePopup && gradePopup.classList.contains('active') && e.target === gradePopup) {
                closePopup('grade');
            }
            if (coursePopup && coursePopup.classList.contains('active') && e.target === coursePopup) {
                closePopup('course');
            }
            if (subjectPopup && subjectPopup.classList.contains('active') && e.target === subjectPopup) {
                closePopup('subject');
            }
        }
    });

    // Social links in footer
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.querySelector('i').getAttribute('data-lucide');
            alert(`Navigate to ${platform} - Social media integration would go here!`);
        });
    });

    // Footer links
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.trim();
            alert(`Navigate to ${linkText} - Page navigation would go here!`);
        });
    });

    // Contact info interactions
    document.querySelectorAll('.group').forEach(group => {
        const phoneIcon = group.querySelector('[data-lucide="phone"]');
        const mailIcon = group.querySelector('[data-lucide="mail"]');
        const mapIcon = group.querySelector('[data-lucide="map-pin"]');
        
        if (phoneIcon) {
            group.addEventListener('click', () => {
                alert('Phone: +880 1234-567890 - Would open dialer in real app');
            });
            group.style.cursor = 'pointer';
        }
        
        if (mailIcon) {
            group.addEventListener('click', () => {
                alert('Email: info@hsccourses.com - Would open email client in real app');
            });
            group.style.cursor = 'pointer';
        }
        
        if (mapIcon) {
            group.addEventListener('click', () => {
                alert('Location: 123 Education Street, Dhaka, Bangladesh - Would open maps in real app');
            });
            group.style.cursor = 'pointer';
        }
    });

    // Initialize dropdown selections
    setTimeout(() => {
        updateSelectedDropdownItems('#gradeDropdown');
        updateSelectedDropdownItems('#subjectDropdown');
        
        // Initialize course dropdown
        document.querySelectorAll('#courseDropdown .dropdown-item').forEach(item => {
            if (item.textContent === 'All Course') {
                item.classList.add('selected');
            }
        });
    }, 100);
}

// Start the app
document.addEventListener('DOMContentLoaded', initApp);

// Window resize handling
window.addEventListener('resize', function() {
    // Re-render on resize if needed
    if (filteredClasses.length > 0) {
        renderClasses();
    }
});

// Make functions available globally
window.toggleDropdown = toggleDropdown;
window.closePopup = closePopup;
window.selectGrade = selectGrade;
window.selectCourse = selectCourse;
window.selectSubject = selectSubject;
window.selectGradeFromPopup = selectGradeFromPopup;
window.selectCourseFromPopup = selectCourseFromPopup;
window.selectSubjectFromPopup = selectSubjectFromPopup;
window.enrollInClass = enrollInClass;
