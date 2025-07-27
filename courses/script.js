// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Global Variables
let isDark = false;
let isScrolled = false;
let mockCourses = [];
let filteredCourses = [];
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

    // Load courses data
    loadCourses();

    // Generate footer particles
    generateFooterParticles();

    // Initialize lazy loading
    initLazyLoading();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize event listeners
    initEventListeners();
}

// Load courses from JSON
async function loadCourses() {
    try {
        const response = await fetch('courses.json');
        mockCourses = await response.json();
        filteredCourses = [...mockCourses];
        
        // Simulate loading delay
        setTimeout(() => {
            renderCourses();
        }, 1000);
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesGrid.innerHTML = '<div class="loading">Error loading courses. Please try again later.</div>';
    }
}

// Initialize Lazy Loading
function initLazyLoading() {
    if (typeof lozad !== 'undefined') {
        observer = lozad('.lozad', {
            loaded: function(el) {
                el.classList.add('loaded');
            }
        });
        observer.observe();
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
    filterCourses();
}

function selectCourseFromPopup(course) {
    selectedCourse = course;
    document.getElementById('courseSelected').textContent = course;
    closePopup('course');
    filterCourses();
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
    filterCourses();
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
    filterCourses();
}

function selectCourse(course) {
    selectedCourse = course;
    document.getElementById('courseSelected').textContent = course;
    closeDropdown('courseDropdown');
    updateSelectedDropdownItem('#courseDropdown', course);
    filterCourses();
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
    filterCourses();
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

// Filter courses function
function filterCourses() {
    let filtered = [...mockCourses];

    // Grade filtering (multi)
    if (!selectedGrades.includes('All Grade/Level')) {
        filtered = filtered.filter(course => {
            if (Array.isArray(course.grade)) {
                return course.grade.some(grade => selectedGrades.includes(grade));
            } else {
                return selectedGrades.includes(course.grade);
            }
        });
    }

    // CourseType filtering (still single-select)
    if (selectedCourse !== 'All Course') {
        filtered = filtered.filter(course => course.courseType === selectedCourse);
    }

    // Subject filtering (multi)
    if (!selectedSubjects.includes('All Subject')) {
        filtered = filtered.filter(course => {
            if (Array.isArray(course.subject)) {
                return course.subject.some(subject => selectedSubjects.includes(subject));
            } else {
                return selectedSubjects.includes(course.subject);
            }
        });
    }

    filteredCourses = filtered;
    renderCourses();
}

// Function to render stars
function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push('<i class="fas fa-star rating-stars"></i>');
    }

    if (hasHalfStar) {
        stars.push('<i class="fas fa-star-half-alt rating-stars"></i>');
    }

    // Add Font Awesome for stars if not already included
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(link);
    }

    return stars.join('');
}

// Function to create course card with lazy loading
function createCourseCard(course) {
    // Handle subject display
    let subjectDisplay = '';
    if (Array.isArray(course.subject)) {
        subjectDisplay = course.subject.join(', ');
    } else {
        subjectDisplay = course.subject;
    }

    // Handle grade display
    let gradeDisplay = '';
    if (Array.isArray(course.grade)) {
        gradeDisplay = course.grade.join(', ');
    } else {
        gradeDisplay = course.grade;
    }

    return `
        <div class="course-card">
            <img 
                class="course-image lozad" 
                data-src="${course.image}" 
                alt="${course.title}"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 200'%3E%3Crect width='1000' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial, sans-serif' font-size='16'%3ELoading...%3C/text%3E%3C/svg%3E"
            />
            <div class="course-content">
                <div class="course-category">${course.category}</div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock meta-icon"></i>
                        <span>${course.duration}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users meta-icon"></i>
                        <span>${course.students} students</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-graduation-cap meta-icon"></i>
                        <span>${gradeDisplay}</span>
                    </div>
                    <div class="meta-item">
                        ${renderStars(course.rating)}
                        <span>${course.rating}</span>
                    </div>
                </div>
                <div class="course-footer">
                    <div class="course-pricing">
                        <span class="course-price">৳${course.price}</span>
                        <span class="course-original-price">৳${course.originalPrice}</span>
                    </div>
                    <button class="enroll-btn" onclick="enrollInCourse(${course.id})">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to render courses
function renderCourses() {
    if (filteredCourses.length === 0) {
        coursesGrid.innerHTML = '<div class="loading">No courses found for the selected filters.</div>';
        return;
    }

    const coursesHTML = filteredCourses.map(course => createCourseCard(course)).join('');
    coursesGrid.innerHTML = coursesHTML;
    
    // Re-initialize lazy loading for new images
    if (observer) {
        observer.observe();
    }
}

// Function to handle course enrollment
function enrollInCourse(courseId) {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
        alert(`Thank you for your interest in ${course.title}! You will be redirected to the enrollment page.`);
    }
}

// Function to handle smooth scrolling
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
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
            smoothScroll(target);
            
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
    // Re-initialize lazy loading observer on resize
    if (observer) {
        observer.observe();
    }
});

// Add entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const entranceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe course cards for animation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            entranceObserver.observe(card);
        });
    }, 1200);
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
window.enrollInCourse = enrollInCourse;
