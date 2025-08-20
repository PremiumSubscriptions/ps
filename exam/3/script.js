        // Mock exam data with link property for redirection
        const mockExams = [
            {
                id: 1,
                title: "Advanced Mathematics - Final Assessment",
                description: "Comprehensive exam covering calculus, algebra, and advanced mathematical concepts for final evaluation.",
                subject: "Mathematics",
                difficulty: "Hard",
                duration: 5, // 5 minutes for demo
                questions: 15,
                participants: 1245,
                date: "Jan 25, 2025",
                status: "Active",
                questionsFile: "math_questions.json"
            },
            {
                id: 2,
                title: "Physics Fundamentals Quiz",
                description: "Basic physics concepts including mechanics, thermodynamics, and electromagnetic theory.",
                subject: "Physics",
                difficulty: "Medium",
                duration: 3, // 3 minutes for demo
                questions: 15,
                participants: 892,
                date: "Jan 28, 2025",
                status: "Upcoming",
                questionsFile: "physics_questions.json"
            },
            {
                id: 3,
                title: "Chemistry Lab Practical Test",
                description: "Hands-on chemistry test covering organic, inorganic, and analytical chemistry principles.",
                subject: "Chemistry",
                difficulty: "Medium",
                duration: 4, // 4 minutes for demo
                questions: 15,
                participants: 567,
                date: "Jan 22, 2025",
                status: "Model Test",
                questionsFile: "chemistry_questions.json"
            },
            {
                id: 4,
                title: "English Literature Analysis",
                description: "In-depth analysis of classical and modern literature pieces with critical thinking questions.",
                subject: "English",
                difficulty: "Easy",
                duration: 2, // 2 minutes for demo
                questions: 15,
                participants: 1834,
                date: "Jan 26, 2025",
                status: "Active",
                questionsFile: "english_questions.json"
            },
            {
                id: 5,
                title: "Computer Science Programming Challenge",
                description: "Coding challenges and algorithmic problems to test programming skills and logical thinking.",
                subject: "Computer Science",
                difficulty: "Hard",
                duration: 6, // 6 minutes for demo
                questions: 15,
                participants: 623,
                date: "Jan 30, 2025",
                status: "Upcoming",
                questionsFile: "cs_questions.json"
            },
            {
                id: 6,
                title: "Biology Cellular Structure Test",
                description: "Detailed examination of cell biology, molecular biology, and genetic concepts.",
                subject: "Biology",
                difficulty: "Medium",
                duration: 3, // 3 minutes for demo
                questions: 15,
                participants: 756,
                date: "Jan 24, 2025",
                status: "Active",
                questionsFile: "biology_questions.json"
            },
            {
                id: 7,
                title: "History World Wars Assessment",
                description: "Comprehensive test on World War I and II, their causes, effects, and historical significance.",
                subject: "History",
                difficulty: "Easy",
                duration: 4, // 4 minutes for demo
                questions: 15,
                participants: 1156,
                date: "Jan 20, 2025",
                status: "Model Test",
                questionsFile: "history_questions.json"
            },
            {
                id: 8,
                title: "Economics Market Analysis",
                description: "Advanced economics exam covering market structures, macroeconomics, and financial principles.",
                subject: "Economics",
                difficulty: "Hard",
                duration: 5, // 5 minutes for demo
                questions: 15,
                participants: 445,
                date: "Feb 2, 2025",
                status: "Upcoming",
                questionsFile: "economics_questions.json"
            },
            {
                id: 9,
                title: "Geography Climate Change Study",
                description: "Environmental geography focusing on climate change, natural disasters, and sustainability.",
                subject: "Geography",
                difficulty: "Medium",
                duration: 4, // 4 minutes for demo
                questions: 15,
                participants: 689,
                date: "Jan 27, 2025",
                status: "Active",
                questionsFile: "geography_questions.json"
            },
            {
                id: 10,
                title: "Statistics Data Analysis Challenge",
                description: "Applied statistics exam with real-world data analysis problems and statistical modeling.",
                subject: "Statistics",
                difficulty: "Hard",
                duration: 5, // 5 minutes for demo
                questions: 15,
                participants: 334,
                date: "Feb 5, 2025",
                status: "Upcoming",
                questionsFile: "statistics_questions.json"
            },
            {
                id: 11,
                title: "Art History Renaissance Period",
                description: "Study of Renaissance art, famous artists, and their cultural impact on society.",
                subject: "Art History",
                difficulty: "Easy",
                duration: 3, // 3 minutes for demo
                questions: 15,
                participants: 523,
                date: "Jan 23, 2025",
                status: "Active",
                questionsFile: "art_questions.json"
            },
            {
                id: 12,
                title: "Psychology Behavioral Analysis",
                description: "Comprehensive psychology exam covering behavioral theories, cognitive psychology, and research methods.",
                subject: "Psychology",
                difficulty: "Medium",
                duration: 4, // 4 minutes for demo
                questions: 15,
                participants: 812,
                date: "Jan 29, 2025",
                status: "Upcoming",
                questionsFile: "psychology_questions.json"
            }
        ];

        // Global variables - removed subject filter
        let filteredExams = [...mockExams];
        let searchTerm = '';
        let filterDifficulty = 'all';
        let filterStatus = 'all';

        // === EXAM STATE VARIABLES - ADDITION ===
        let currentExam = null;
        let examQuestions = [];
        let currentQuestionIndex = 0;
        let userAnswers = {};
        let examTimer = null;
        let timeRemaining = 0;
        let isExamSubmitted = false;

        // DOM Elements - removed subject filter elements
        const elements = {
            searchInput: null,
            difficultyFilter: null,
            statusFilter: null,
            examsGrid: null,
            examCount: null,
            noResults: null,
            activeFilters: null,
            // === MODAL ELEMENTS - ADDITION ===
            examModal: null,
            examTitle: null,
            timerDisplay: null,
            questionContent: null,
            progressFill: null,
            questionProgress: null,
            answeredCount: null,
            jumpInput: null,
            jumpBtn: null,
            prevBtn: null,
            nextBtn: null,
            submitBtn: null,
            resultsSection: null,
            scoreCircle: null,
            scorePercentage: null,
            scoreSummary: null,
            detailedResults: null,
            retakeBtn: null,
            closeModalBtn: null,
            closeResultsBtn: null
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
                    return 'bg-blue-100 text-blue-800 border-blue-200';
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
                case 'model test':
                    return 'bg-gray-100 text-gray-800 border-gray-200';
                default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
            }
        }

        // === EXAM FUNCTIONS - ADDITION ===
        // Handle exam button click - MODIFIED to add popup functionality
        async function handleExamButtonClick(exam) {
            if (exam.status !== 'Active' && exam.status !== 'Model Test') {
                return; // Do nothing for upcoming exams
            }
            
            try {
                // Start the exam
                await startExam(exam);
            } catch (error) {
                console.error('Error starting exam:', error);
                alert('Error loading exam questions. Please try again.');
            }
        }
        // Start exam function - MODIFIED to fetch questions from external files
        async function startExam(exam) {
            currentExam = exam;
            
            try {
                // Fetch questions from the external JSON file
                const response = await fetch(exam.questionsFile);
                if (!response.ok) {
                    throw new Error(`Failed to fetch questions: ${response.status}`);
                }
                const allQuestions = await response.json();
                examQuestions = allQuestions.slice(0, exam.questions); // Get required number of questions
            } catch (error) {
                console.error('Error loading questions:', error);
                alert('Error loading exam questions. Please try again.');
                return;
            }
            currentQuestionIndex = 0;
            userAnswers = {};
            isExamSubmitted = false;
            timeRemaining = exam.duration * 60; // Convert minutes to seconds
            
            // Show modal
            elements.examModal.style.display = 'flex';
            setTimeout(() => {
                elements.examModal.classList.add('show');
            }, 10);
            
            // Set exam title
            elements.examTitle.textContent = exam.title;
            // Start timer
            startTimer();
            
            // Load first question
            loadQuestion();
            
            // Update jump input max value
            elements.jumpInput.max = examQuestions.length;
            
            // Update progress
            updateProgress();
            
            // Hide results section
            elements.resultsSection.classList.add('hidden');
            document.getElementById('question-content').style.display = 'block';
            document.querySelector('.nav-controls').style.display = 'flex';
        }
        // Timer functions
        function startTimer() {
            elements.timerDisplay.textContent = formatTime(timeRemaining);
            
            examTimer = setInterval(() => {
                timeRemaining--;
                elements.timerDisplay.textContent = formatTime(timeRemaining);
                
                // Change color when time is running out
                if (timeRemaining <= 60) {
                    elements.timerDisplay.style.color = '#ef4444';
                    elements.timerDisplay.classList.add('pulse');
                } else if (timeRemaining <= 300) {
                    elements.timerDisplay.style.color = '#f59e0b';
                }
                
                if (timeRemaining <= 0) {
                    autoSubmitExam();
                }
            }, 1000);
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        function stopTimer() {
            if (examTimer) {
                clearInterval(examTimer);
                examTimer = null;
            }
        }

        // Question loading and display
        function loadQuestion() {
            if (currentQuestionIndex < 0 || currentQuestionIndex >= examQuestions.length) {
                return;
            }
            
            const question = examQuestions[currentQuestionIndex];
            
            let questionHTML = `
                <div class="question-card fade-in-up">
                    <div class="flex items-start gap-4 mb-6">
                        <div class="px-4 py-2 rounded-lg font-bold text-lg text-white" style="background: linear-gradient(135deg, #b68d40 0%, #9a7635 100%);">
                            Q${currentQuestionIndex + 1}
                        </div>
                        <h3 class="text-xl font-bold flex-1" style="color: #122620;">${question.question}</h3>
                    </div>
            `;
            
            // Add image if present
            if (question.image) {
                questionHTML += `
                    <div class="mb-6 text-center">
                        <img src="${question.image}" alt="Question related image" 
                             class="max-w-md mx-auto rounded-lg shadow-md" 
                             onerror="this.style.display='none'">
                    </div>
                `;
            }
            
            // Add options
            questionHTML += '<div class="space-y-3">';
            question.options.forEach((option, index) => {
                const isSelected = userAnswers[question.id] === option;
                questionHTML += `
                    <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${question.id}, '${option.replace(/'/g, "\\'")}')">
                        <input type="radio" name="question-${question.id}" value="${option}" ${isSelected ? 'checked' : ''}>
                        <span class="font-medium">${option}</span>
                    </div>
                `;
            });
            questionHTML += '</div></div>';
            
            elements.questionContent.innerHTML = questionHTML;
            
            // Update navigation buttons
            updateNavigationButtons();
        }

        // Answer selection
        function selectAnswer(questionId, answer) {
            userAnswers[questionId] = answer;
            
            // Update UI
            const optionItems = document.querySelectorAll('.option-item');
            optionItems.forEach(item => {
                item.classList.remove('selected');
                const radio = item.querySelector('input[type="radio"]');
                radio.checked = false;
            });
            
            // Select the clicked option
            event.currentTarget.classList.add('selected');
            const radio = event.currentTarget.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update progress
            updateProgress();
        }

        // Navigation functions
        function previousQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion();
                updateProgress();
            }
        }

        function nextQuestion() {
            if (currentQuestionIndex < examQuestions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
                updateProgress();
            }
        }

        function jumpToQuestion() {
            const questionNumber = parseInt(elements.jumpInput.value);
            if (questionNumber >= 1 && questionNumber <= examQuestions.length) {
                currentQuestionIndex = questionNumber - 1;
                loadQuestion();
                updateProgress();
            } else {
                alert(`Please enter a question number between 1 and ${examQuestions.length}`);
            }
        }

        // Progress tracking
        function updateProgress() {
            const progress = ((currentQuestionIndex + 1) / examQuestions.length) * 100;
            elements.progressFill.style.width = `${progress}%`;
            
            elements.questionProgress.textContent = `Question ${currentQuestionIndex + 1} of ${examQuestions.length}`;
            
            const answeredCount = Object.keys(userAnswers).length;
            elements.answeredCount.textContent = `${answeredCount} answered`;
            
            // Update jump input
            elements.jumpInput.value = currentQuestionIndex + 1;
        }

        function updateNavigationButtons() {
            elements.prevBtn.disabled = currentQuestionIndex === 0;
            elements.nextBtn.disabled = currentQuestionIndex === examQuestions.length - 1;
            
            if (elements.prevBtn.disabled) {
                elements.prevBtn.classList.add('btn-disabled');
            } else {
                elements.prevBtn.classList.remove('btn-disabled');
            }
            
            if (elements.nextBtn.disabled) {
                elements.nextBtn.classList.add('btn-disabled');
            } else {
                elements.nextBtn.classList.remove('btn-disabled');
            }
        }

        // Exam submission
        function submitExam() {
            if (confirm('Are you sure you want to submit the exam? You cannot change your answers after submission.')) {
                stopTimer();
                calculateResults();
                showResults();
            }
        }

        function autoSubmitExam() {
            stopTimer();
            alert('Time is up! The exam will be submitted automatically.');
            calculateResults(true);
            showResults();
        }

        function calculateResults(autoSubmit = false) {
            let correctAnswers = 0;
            const detailedResults = [];
            
            examQuestions.forEach((question, index) => {
                const userAnswer = userAnswers[question.id] || 'Not answered';
                const isCorrect = userAnswer === question.correctAnswer;
                
                if (isCorrect) correctAnswers++;
                
                detailedResults.push({
                    questionNumber: index + 1,
                    question: question.question,
                    userAnswer,
                    correctAnswer: question.correctAnswer,
                    isCorrect,
                    options: question.options
                });
            });
            
            const percentage = Math.round((correctAnswers / examQuestions.length) * 100);
            
            return {
                correctAnswers,
                totalQuestions: examQuestions.length,
                percentage,
                detailedResults,
                autoSubmit
            };
        }

        function showResults() {
            const results = calculateResults();
            isExamSubmitted = true;
            
            // Hide question content and navigation
            document.getElementById('question-content').style.display = 'none';
            document.querySelector('.nav-controls').style.display = 'none';
            
            // Show results section
            elements.resultsSection.classList.remove('hidden');
            
            // Update score circle
            elements.scorePercentage.textContent = `${results.percentage}%`;
            
            // Set score circle class based on percentage
            elements.scoreCircle.className = 'score-circle';
            if (results.percentage >= 80) {
                elements.scoreCircle.classList.add('score-excellent');
            } else if (results.percentage >= 60) {
                elements.scoreCircle.classList.add('score-good');
            } else if (results.percentage >= 40) {
                elements.scoreCircle.classList.add('score-average');
            } else {
                elements.scoreCircle.classList.add('score-poor');
            }
            
            // Update score summary
            const performanceText = results.percentage >= 80 ? 'Excellent' : 
                                results.percentage >= 60 ? 'Good' : 
                                results.percentage >= 40 ? 'Average' : 'Poor';
            
            elements.scoreSummary.textContent = `You scored ${results.correctAnswers} out of ${results.totalQuestions} questions (${performanceText})`;
            
            if (results.autoSubmit) {
                elements.scoreSummary.textContent += ' - Exam was auto-submitted due to time limit';
            }
            
            // Show detailed results
            let detailedHTML = '';
            results.detailedResults.forEach(result => {
                detailedHTML += `
                    <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                        <div class="flex justify-between items-center mb-3">
                            <div class="px-3 py-1 rounded-lg font-bold text-white" style="background: linear-gradient(135deg, #b68d40 0%, #9a7635 100%);">
                                Q${result.questionNumber}
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas ${result.isCorrect ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600'}"></i>
                                <span class="font-semibold ${result.isCorrect ? 'text-green-600' : 'text-red-600'}">
                                    ${result.isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                            </div>
                        </div>
                        <p class="font-semibold mb-3" style="color: #122620;">${result.question}</p>
                        <div class="space-y-2">
                            <div class="answer-box user-answer ${result.userAnswer === 'Not answered' ? 'not-answered' : result.isCorrect ? 'correct' : 'wrong'}">
                                <strong>Your answer:</strong> ${result.userAnswer}
                            </div>
                            ${!result.isCorrect ? `
                                <div class="answer-box correct-answer">
                                    <strong>Correct answer:</strong> ${result.correctAnswer}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            elements.detailedResults.innerHTML = detailedHTML;
        }

        // Modal controls
        function closeModal() {
            stopTimer();
            elements.examModal.classList.remove('show');
            setTimeout(() => {
                elements.examModal.style.display = 'none';
            }, 300);
            
            // Reset exam state
            currentExam = null;
            examQuestions = [];
            currentQuestionIndex = 0;
            userAnswers = {};
            timeRemaining = 0;
            isExamSubmitted = false;
            
            // Reset timer display
            elements.timerDisplay.style.color = 'white';
            elements.timerDisplay.classList.remove('pulse');
        }

        function retakeExam() {
            if (currentExam) {
                startExam(currentExam);
            }
        }

        // MODIFIED createExamCard function to handle upcoming exams properly
        function createExamCard(exam) {
            const buttonText = exam.status === 'Model Test' ? 'Take Model Test' :
                            exam.status === 'Upcoming' ? 'Take Exam' : 'Take Exam';
            
            const buttonClass = exam.status === 'Upcoming' ? 'btn-disabled' : '';
            const buttonStyle = exam.status === 'Upcoming' 
                ? 'background-color: #9ca3af; color: #6b7280; cursor: not-allowed;' 
                : 'background-color: #b68d40; color: white;';

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
                            class="w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg exam-button ${buttonClass}"
                            style="${buttonStyle}"
                            onclick="handleExamButtonClick(${JSON.stringify(exam).replace(/"/g, '&quot;')})"
                            ${exam.status === 'Upcoming' ? 'disabled' : ''}
                        >
                            ${buttonText}
                        </button>
                    </div>
                </div>
            `;
        }

        // Update stats with dynamic total exams calculation
        function updateStats() {
            const total = mockExams.length;  // Dynamic calculation
            const active = mockExams.filter(exam => exam.status === 'Active').length;
            const upcoming = mockExams.filter(exam => exam.status === 'Upcoming').length;
            const modelTest = mockExams.filter(exam => exam.status === 'Model Test').length;

            document.getElementById('total-exams').textContent = total;
            document.getElementById('active-exams').textContent = active;
            document.getElementById('upcoming-exams').textContent = upcoming;
            document.getElementById('model-test-exams').textContent = modelTest;
        }

        // Filter exams - removed subject filtering
        function filterExams() {
            filteredExams = mockExams.filter(exam => {
                const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    exam.subject.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesDifficulty = filterDifficulty === 'all' || exam.difficulty.toLowerCase() === filterDifficulty;
                const matchesStatus = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus;

                return matchesSearch && matchesDifficulty && matchesStatus;
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

        // Update active filters - removed subject filter
        function updateActiveFilters() {
            const filters = [];

            if (searchTerm) {
                filters.push({ type: 'search', label: `Search: "${searchTerm}"` });
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
            const activeFiltersContent = document.getElementById('active-filters-content');
            if (activeFiltersContent) {
                activeFiltersContent.innerHTML = filters.map(filter =>
                    `<span class="px-2 py-1 text-xs font-medium rounded-full border" style="background-color: rgba(182, 141, 64, 0.1); color: #b68d40; border-color: rgba(182, 141, 64, 0.3);">
                        ${filter.label}
                    </span>`
                ).join('');
            }
        }

        // Initialize DOM elements - ENHANCED to include modal elements
        function initializeElements() {
            elements.searchInput = document.getElementById('search-input');
            elements.difficultyFilter = document.getElementById('difficulty-filter');
            elements.statusFilter = document.getElementById('status-filter');
            elements.examsGrid = document.getElementById('exams-grid');
            elements.examCount = document.getElementById('exam-count');
            elements.noResults = document.getElementById('no-results');
            elements.activeFilters = document.getElementById('active-filters');
            
            // === MODAL ELEMENTS - ADDITION ===
            elements.examModal = document.getElementById('exam-modal');
            elements.examTitle = document.getElementById('exam-title');
            elements.timerDisplay = document.getElementById('timer-display');
            elements.questionContent = document.getElementById('question-content');
            elements.progressFill = document.getElementById('progress-fill');
            elements.questionProgress = document.getElementById('question-progress');
            elements.answeredCount = document.getElementById('answered-count');
            elements.jumpInput = document.getElementById('jump-input');
            elements.jumpBtn = document.getElementById('jump-btn');
            elements.prevBtn = document.getElementById('prev-btn');
            elements.nextBtn = document.getElementById('next-btn');
            elements.submitBtn = document.getElementById('submit-btn');
            elements.resultsSection = document.getElementById('results-section');
            elements.scoreCircle = document.getElementById('score-circle');
            elements.scorePercentage = document.getElementById('score-percentage');
            elements.scoreSummary = document.getElementById('score-summary');
            elements.detailedResults = document.getElementById('detailed-results');
            elements.retakeBtn = document.getElementById('retake-btn');
            elements.closeModalBtn = document.getElementById('close-modal-btn');
            elements.closeResultsBtn = document.getElementById('close-results-btn');
        }

        // Add event listeners - ENHANCED to include modal event listeners
        function addEventListeners() {
            // Original filter event listeners
            elements.searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value;
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

            // === MODAL EVENT LISTENERS - ADDITION ===
            elements.jumpBtn.addEventListener('click', jumpToQuestion);
            elements.jumpInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    jumpToQuestion();
                }
            });
            elements.prevBtn.addEventListener('click', previousQuestion);
            elements.nextBtn.addEventListener('click', nextQuestion);
            elements.submitBtn.addEventListener('click', submitExam);
            elements.retakeBtn.addEventListener('click', retakeExam);
            elements.closeModalBtn.addEventListener('click', closeModal);
            elements.closeResultsBtn.addEventListener('click', closeModal);

            // Close modal when clicking outside
            elements.examModal.addEventListener('click', (e) => {
                if (e.target === elements.examModal) {
                    if (confirm('Are you sure you want to close the exam? Your progress will be lost.')) {
                        closeModal();
                    }
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (elements.examModal.classList.contains('show') && !isExamSubmitted) {
                    switch(e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            previousQuestion();
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            nextQuestion();
                            break;
                        case 'Escape':
                            if (confirm('Are you sure you want to close the exam? Your progress will be lost.')) {
                                closeModal();
                            }
                            break;
                    }
                }
            });
        }

        // Initialize the app - UNCHANGED
        document.addEventListener('DOMContentLoaded', () => {
            initializeElements();
            updateStats();  // This will now dynamically calculate total exams
            filterExams();
            addEventListeners();
        });
    </script>
    <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

    const firebaseConfig = {
    apiKey: "AIzaSyB4Dka1pJP24mJg91RCiyUukCQvufofJU8",
    authDomain: "courseaccess-921b8.firebaseapp.com",
    projectId: "courseaccess-921b8",
    storageBucket: "courseaccess-921b8.firebasestorage.app",
    messagingSenderId: "35662960447",
    appId: "1:35662960447:web:02dc2ca06c8c9032c0658a",
    measurementId: "G-SKDTD3FK91"
  };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // 🔒 Check if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // 🚪 Not logged in, redirect to login page with returnTo URL
            const currentUrl = window.location.href;
            const loginUrl = `https://wakilbd.github.io/ps/login?returnTo=${encodeURIComponent(currentUrl)}`;
            console.log("⛔ Not logged in, redirecting to:", loginUrl);
            window.location.href = loginUrl;
        } else {
            console.log("✅ Logged in as:", user.email);
            // You can allow page content to load here
        }
    });
