// Mock exam data
const mockExams = [
    {
        id: 1,
        title: "Advanced Mathematics - Final Assessment",
        description: "Comprehensive exam covering calculus, algebra, and advanced mathematical concepts for final evaluation.",
        subject: "Mathematics",
        difficulty: "Hard",
        duration: 120,
        questions: 50,
        participants: 1245,
        date: "Jan 25, 2025",
        status: "Active"
    },
    {
        id: 2,
        title: "Physics Fundamentals Quiz",
        description: "Basic physics concepts including mechanics, thermodynamics, and electromagnetic theory.",
        subject: "Physics",
        difficulty: "Medium",
        duration: 90,
        questions: 35,
        participants: 892,
        date: "Jan 28, 2025",
        status: "Upcoming"
    },
    {
        id: 3,
        title: "Chemistry Lab Practical Test",
        description: "Hands-on chemistry test covering organic, inorganic, and analytical chemistry principles.",
        subject: "Chemistry",
        difficulty: "Medium",
        duration: 75,
        questions: 30,
        participants: 567,
        date: "Jan 22, 2025",
        status: "Model Test"
    },
    {
        id: 4,
        title: "English Literature Analysis",
        description: "In-depth analysis of classical and modern literature pieces with critical thinking questions.",
        subject: "English",
        difficulty: "Easy",
        duration: 60,
        questions: 25,
        participants: 1834,
        date: "Jan 26, 2025",
        status: "Active"
    },
    {
        id: 5,
        title: "Computer Science Programming Challenge",
        description: "Coding challenges and algorithmic problems to test programming skills and logical thinking.",
        subject: "Computer Science",
        difficulty: "Hard",
        duration: 150,
        questions: 40,
        participants: 623,
        date: "Jan 30, 2025",
        status: "Upcoming"
    },
    {
        id: 6,
        title: "Biology Cellular Structure Test",
        description: "Detailed examination of cell biology, molecular biology, and genetic concepts.",
        subject: "Biology",
        difficulty: "Medium",
        duration: 80,
        questions: 45,
        participants: 756,
        date: "Jan 24, 2025",
        status: "Active"
    },
    {
        id: 7,
        title: "History World Wars Assessment",
        description: "Comprehensive test on World War I and II, their causes, effects, and historical significance.",
        subject: "History",
        difficulty: "Easy",
        duration: 70,
        questions: 28,
        participants: 1156,
        date: "Jan 20, 2025",
        status: "Model Test"
    },
    {
        id: 8,
        title: "Economics Market Analysis",
        description: "Advanced economics exam covering market structures, macroeconomics, and financial principles.",
        subject: "Economics",
        difficulty: "Hard",
        duration: 100,
        questions: 38,
        participants: 445,
        date: "Feb 2, 2025",
        status: "Upcoming"
    },
    {
        id: 9,
        title: "Geography Climate Change Study",
        description: "Environmental geography focusing on climate change, natural disasters, and sustainability.",
        subject: "Geography",
        difficulty: "Medium",
        duration: 85,
        questions: 32,
        participants: 689,
        date: "Jan 27, 2025",
        status: "Active"
    },
    {
        id: 10,
        title: "Statistics Data Analysis Challenge",
        description: "Applied statistics exam with real-world data analysis problems and statistical modeling.",
        subject: "Statistics",
        difficulty: "Hard",
        duration: 110,
        questions: 42,
        participants: 334,
        date: "Feb 5, 2025",
        status: "Upcoming"
    },
    {
        id: 11,
        title: "Art History Renaissance Period",
        description: "Study of Renaissance art, famous artists, and their cultural impact on society.",
        subject: "Art History",
        difficulty: "Easy",
        duration: 55,
        questions: 22,
        participants: 523,
        date: "Jan 23, 2025",
        status: "Active"
    },
    {
        id: 12,
        title: "Psychology Behavioral Analysis",
        description: "Comprehensive psychology exam covering behavioral theories, cognitive psychology, and research methods.",
        subject: "Psychology",
        difficulty: "Medium",
        duration: 95,
        questions: 36,
        participants: 812,
        date: "Jan 29, 2025",
        status: "Upcoming"
    }
];

// Global variables
let filteredExams = [...mockExams];
let searchTerm = '';
let filterSubject = 'all';
let filterDifficulty = 'all';
let filterStatus = 'all';

// DOM Elements
const elements = {
    searchInput: null,
    subjectFilter: null,
    difficultyFilter: null,
    statusFilter: null,
    examsGrid: null,
    examCount: null,
    noResults: null,
    activeFilters: null,
    mobileMenuButton: null,
    mobileMenu: null,
    menuIcon: null,
    closeIcon: null
};

// Utility functions
function getDifficultyColor(difficulty) {
    switch (difficulty.toLowerCase()) {
        case 'easy':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'hard':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'standard':
            return 'bg-red-100 text-blue-800 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'upcoming':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'modeltest':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

function createExamCard(exam) {
    const buttonText = exam.status === 'completed' ? 'View Results' : 
                      exam.status === 'upcoming' ? 'Register Now' : 'Start Exam';
    const isDisabled = exam.status === 'completed';
    
    return `
        <div class="card-hover bg-white rounded-lg shadow-md border overflow-hidden" style="border-color: rgba(214, 173, 96, 0.3); background: linear-gradient(135deg, #f4ebd0 0%, #ffffff 100%);">
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold line-clamp-2 flex-1 mr-3 hover:text-opacity-80 transition-colors" style="color: #122620;">${exam.title}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(exam.status)} whitespace-nowrap">
                        ${exam.status}
                    </span>
                </div>
                <p class="text-sm leading-relaxed line-clamp-2 mb-4" style="color: rgba(18, 38, 32, 0.7);">
                    ${exam.description}
                </p>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-clock" style="color: #b68d40;"></i>
                        <span class="text-sm font-medium" style="color: rgba(18, 38, 32, 0.7);">${exam.duration} min</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-book-open" style="color: #b68d40;"></i>
                        <span class="text-sm font-medium" style="color: rgba(18, 38, 32, 0.7);">${exam.questions} questions</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-users" style="color: #b68d40;"></i>
                        <span class="text-sm font-medium" style="color: rgba(18, 38, 32, 0.7);">${exam.participants} took</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-calendar" style="color: #b68d40;"></i>
                        <span class="text-sm font-medium" style="color: rgba(18, 38, 32, 0.7);">${exam.date}</span>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                    <span class="px-2 py-1 text-xs font-medium rounded-full border" style="background-color: rgba(182, 141, 64, 0.1); color: #b68d40; border-color: rgba(182, 141, 64, 0.3);">
                        ${exam.subject}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(exam.difficulty)}">
                        ${exam.difficulty}
                    </span>
                </div>

                <button 
                    class="w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}" 
                    style="background-color: #b68d40; color: white;"
                    ${isDisabled ? 'disabled' : ''}
                >
                    ${buttonText}
                </button>
            </div>
        </div>
    `;
}

function populateSubjectFilter() {
    const subjects = [...new Set(mockExams.map(exam => exam.subject))];
    elements.subjectFilter.innerHTML = '<option value="all">All Subjects</option>';
    subjects.forEach(subject => {
        elements.subjectFilter.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
}

function updateStats() {
    const total = mockExams.length;
    const active = mockExams.filter(exam => exam.status === 'Active').length;
    const upcoming = mockExams.filter(exam => exam.status === 'Upcoming').length;
    const completed = mockExams.filter(exam => exam.status === 'Completed').length;
    
    document.getElementById('total-exams').textContent = total;
    document.getElementById('active-exams').textContent = active;
    document.getElementById('upcoming-exams').textContent = upcoming;
    document.getElementById('completed-exams').textContent = completed;
}

function filterExams() {
    filteredExams = mockExams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSubject = filterSubject === 'all' || exam.subject === filterSubject;
        const matchesDifficulty = filterDifficulty === 'all' || exam.difficulty.toLowerCase() === filterDifficulty;
        const matchesStatus = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus;
        
        return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus;
    });
    
    renderExams();
    updateExamCount();
    updateActiveFilters();
}

function renderExams() {
    if (filteredExams.length === 0) {
        elements.examsGrid.classList.add('hidden');
        elements.noResults.classList.remove('hidden');
        return;
    }
    
    elements.examsGrid.classList.remove('hidden');
    elements.noResults.classList.add('hidden');
    
    elements.examsGrid.innerHTML = filteredExams.map(exam => createExamCard(exam)).join('');
}

function updateExamCount() {
    const count = filteredExams.length;
    elements.examCount.textContent = `${count} exam${count !== 1 ? 's' : ''} found`;
}

function updateActiveFilters() {
    const filters = [];
    
    if (searchTerm) {
        filters.push({ type: 'search', label: `Search: "${searchTerm}"` });
    }
    if (filterSubject !== 'all') {
        filters.push({ type: 'subject', label: `Subject: ${filterSubject}` });
    }
    if (filterDifficulty !== 'all') {
        filters.push({ type: 'difficulty', label: `Difficulty: ${filterDifficulty}` });
    }
    if (filterStatus !== 'all') {
        filters.push({ type: 'status', label: `Status: ${filterStatus}` });
    }
    
    if (filters.length === 0) {
        elements.activeFilters.classList.add('hidden');
        return;
    }
    
    elements.activeFilters.classList.remove('hidden');
    elements.activeFilters.innerHTML = filters.map(filter => 
        `<span class="px-2 py-1 text-xs font-medium rounded-full border" style="background-color: rgba(182, 141, 64, 0.1); color: #b68d40; border-color: rgba(182, 141, 64, 0.3);">
            ${filter.label}
        </span>`
    ).join('');
}

function toggleMobileMenu() {
    const isOpen = elements.mobileMenu.classList.contains('open');
    if (isOpen) {
        elements.mobileMenu.classList.remove('open');
        elements.menuIcon.classList.remove('hidden');
        elements.closeIcon.classList.add('hidden');
    } else {
        elements.mobileMenu.classList.add('open');
        elements.menuIcon.classList.add('hidden');
        elements.closeIcon.classList.remove('hidden');
    }
}

function initializeElements() {
    elements.searchInput = document.getElementById('search-input');
    elements.subjectFilter = document.getElementById('subject-filter');
    elements.difficultyFilter = document.getElementById('difficulty-filter');
    elements.statusFilter = document.getElementById('status-filter');
    elements.examsGrid = document.getElementById('exams-grid');
    elements.examCount = document.getElementById('exam-count');
    elements.noResults = document.getElementById('no-results');
    elements.activeFilters = document.getElementById('active-filters');
    elements.mobileMenuButton = document.getElementById('mobile-menu-button');
    elements.mobileMenu = document.getElementById('mobile-menu');
    elements.menuIcon = document.getElementById('menu-icon');
    elements.closeIcon = document.getElementById('close-icon');
}

function addEventListeners() {
    elements.searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        filterExams();
    });

    elements.subjectFilter.addEventListener('change', (e) => {
        filterSubject = e.target.value;
        filterExams();
    });

    elements.difficultyFilter.addEventListener('change', (e) => {
        filterDifficulty = e.target.value;
        filterExams();
    });

    elements.statusFilter.addEventListener('change', (e) => {
        filterStatus = e.target.value;
        filterExams();
    });

    elements.mobileMenuButton.addEventListener('click', toggleMobileMenu);

    document.addEventListener('click', (e) => {
        if (!elements.mobileMenuButton.contains(e.target) && !elements.mobileMenu.contains(e.target)) {
            if (elements.mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        }
    });

    elements.mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggleMobileMenu();
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    populateSubjectFilter();
    updateStats();
    filterExams();
    addEventListeners();
});
