// ═══════════════════════════════════════════════════════════════
// ROYAL MERCY INSTITUTE — Full-Stack Server
// Level 1: Express REST API with CRUD
// Level 2: JWT Authentication + Authorization
// Level 3: WebSockets (Socket.io) + GraphQL endpoint
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'rmi_jwt_secret_2020_science_tech';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-memory "database" (simulates MongoDB/PostgreSQL) ──────────
let users = [
  {
    id: '1', name: 'Mohau Mokoena', email: 'mohaumokoena@rmi.co.za',
    password: bcrypt.hashSync('admin2020', 10),
    role: 'admin', createdAt: new Date('2020-01-01').toISOString()
  },
  {
    id: '2', name: 'Thabo Learner', email: 'thabo@rmi.co.za',
    password: bcrypt.hashSync('learner123', 10),
    role: 'learner', createdAt: new Date('2023-06-15').toISOString()
  }
];

let courses = [
  // ── Technology & Programming ──────────────────────────────────────────────
  { id: '1',  title: 'Introduction to Python',               category: 'Programming',  level: 'Beginner',     duration: '6 weeks',  instructor: 'Mohau Mokoena', enrolled: 142, description: 'Learn Python from scratch with real SA curriculum alignment.',                    createdAt: new Date().toISOString() },
  { id: '2',  title: 'Web Development Fundamentals',         category: 'Web Dev',      level: 'Beginner',     duration: '8 weeks',  instructor: 'Mohau Mokoena', enrolled: 98,  description: 'HTML, CSS and JavaScript for SA youth.',                                          createdAt: new Date().toISOString() },
  { id: '3',  title: 'Data Science & Analytics',             category: 'Data Science', level: 'Intermediate', duration: '10 weeks', instructor: 'Mohau Mokoena', enrolled: 67,  description: 'Understand data and build insights for community projects.',                      createdAt: new Date().toISOString() },
  { id: '4',  title: 'Mobile App Development',               category: 'Mobile',       level: 'Intermediate', duration: '12 weeks', instructor: 'Mohau Mokoena', enrolled: 55,  description: 'Build Android & iOS apps using Flutter.',                                          createdAt: new Date().toISOString() },
  { id: '5',  title: 'AI & Machine Learning',                category: 'AI/ML',        level: 'Advanced',     duration: '14 weeks', instructor: 'Mohau Mokoena', enrolled: 34,  description: 'Machine learning for African innovation challenges.',                              createdAt: new Date().toISOString() },
  { id: '6',  title: 'Cybersecurity Essentials',             category: 'Security',     level: 'Intermediate', duration: '8 weeks',  instructor: 'Mohau Mokoena', enrolled: 89,  description: 'Protect communities in the digital world.',                                        createdAt: new Date().toISOString() },
  { id: '7',  title: 'Computer Applications Technology (CAT)', category: 'CAT',        level: 'Beginner',     duration: '8 weeks',  instructor: 'Mohau Mokoena', enrolled: 76,  description: 'CAPS CAT: hardware, software, networking and data handling for Gr 10-12.',       createdAt: new Date().toISOString() },
  // ── High School Sciences & STEM ───────────────────────────────────────────
  { id: '8',  title: 'Physical Sciences - Physics',          category: 'Physics',      level: 'Intermediate', duration: '10 weeks', instructor: 'Mohau Mokoena', enrolled: 61,  description: 'CAPS Physics: mechanics, waves, electricity and magnetism for Gr 10-12.',        createdAt: new Date().toISOString() },
  { id: '9',  title: 'Physical Sciences - Chemistry',        category: 'Chemistry',    level: 'Intermediate', duration: '10 weeks', instructor: 'Mohau Mokoena', enrolled: 54,  description: 'CAPS Chemistry: atomic structure, equations, organic chemistry for Gr 10-12.',   createdAt: new Date().toISOString() },
  { id: '10', title: 'Mathematics',                          category: 'Mathematics',  level: 'Beginner',     duration: '12 weeks', instructor: 'Mohau Mokoena', enrolled: 118, description: 'CAPS Maths: algebra, calculus, trigonometry and statistics for Gr 8-12.',        createdAt: new Date().toISOString() },
  { id: '11', title: 'Mathematical Literacy',                category: 'Mathematics',  level: 'Beginner',     duration: '8 weeks',  instructor: 'Mohau Mokoena', enrolled: 93,  description: 'Practical maths for everyday life and careers. Gr 10-12 CAPS aligned.',         createdAt: new Date().toISOString() },
  { id: '12', title: 'Life Sciences',                        category: 'Life Sciences',level: 'Intermediate', duration: '10 weeks', instructor: 'Mohau Mokoena', enrolled: 72,  description: 'CAPS Life Sciences: cells, genetics, evolution, biosphere for Gr 10-12.',        createdAt: new Date().toISOString() },
  { id: '13', title: 'Geography',                            category: 'Geography',    level: 'Beginner',     duration: '8 weeks',  instructor: 'Mohau Mokoena', enrolled: 48,  description: 'CAPS Geography: climate, geomorphology, mapwork and development for Gr 10-12.', createdAt: new Date().toISOString() },
  // ── Primary School ────────────────────────────────────────────────────────
  { id: '14', title: 'Natural Sciences (Gr 4-7)',            category: 'Primary',      level: 'Beginner',     duration: '6 weeks',  instructor: 'Mohau Mokoena', enrolled: 83,  description: 'CAPS Natural Sciences: life, matter, energy, earth for intermediate phase.',    createdAt: new Date().toISOString() },
  { id: '15', title: 'Technology (Gr 4-9)',                  category: 'Primary',      level: 'Beginner',     duration: '6 weeks',  instructor: 'Mohau Mokoena', enrolled: 69,  description: 'CAPS Technology: design, structures, systems for intermediate and senior phase.',createdAt: new Date().toISOString() },
  { id: '16', title: 'Social Sciences (Gr 4-7)',             category: 'Primary',      level: 'Beginner',     duration: '6 weeks',  instructor: 'Mohau Mokoena', enrolled: 57,  description: 'History and Geography for intermediate phase. CAPS aligned.',                   createdAt: new Date().toISOString() },
  // ── Robotics ──────────────────────────────────────────────────────────────
  { id: '17', title: 'Robotics - Primary (Gr 4-7)',          category: 'Robotics',     level: 'Beginner',     duration: '8 weeks',  instructor: 'Mohau Mokoena', enrolled: 44,  description: 'Block coding, computational thinking and robot building for primary learners.',  createdAt: new Date().toISOString() },
  { id: '18', title: 'Robotics - High School (Gr 8-12)',     category: 'Robotics',     level: 'Intermediate', duration: '10 weeks', instructor: 'Mohau Mokoena', enrolled: 38,  description: 'Arduino, sensors, Python robotics and STEM projects for high school learners.',  createdAt: new Date().toISOString() },
  { id: '19', title: 'Robotics - University',                category: 'Robotics',     level: 'Advanced',     duration: '12 weeks', instructor: 'Mohau Mokoena', enrolled: 22,  description: 'ROS, computer vision, autonomous systems for university students.',             createdAt: new Date().toISOString() },
];

let messages = [];
let nextId = { users: 3, courses: 20 };

// ── Middleware: JWT Auth ──────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
}

// ════════════════════════════════════════════════════════════════
// LEVEL 1 — REST API: Auth Routes
// ════════════════════════════════════════════════════════════════

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role = 'learner', phone = '', qualification = '' } = req.body;
    const validRoles = ['learner','tutor','admin'];
    const assignedRole = validRoles.includes(role) ? role : 'learner';
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });
    if (users.find(u => u.email === email))
      return res.status(409).json({ error: 'Email already registered.' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const year = new Date().getFullYear();
    const idNum = String(nextId.users).padStart(4,'0');
    const prefix = assignedRole === 'tutor' ? 'RMI-TUT' : assignedRole === 'admin' ? 'RMI-ADM' : 'RMI-STU';
    const rmiId  = `${prefix}-${year}-${idNum}`;
    const approved = assignedRole === 'learner' || assignedRole === 'admin' ? true : false;
    const user = { id: String(nextId.users++), name, email, password: hashedPassword, role: assignedRole, rmiId, phone: phone||'', qualification: qualification||'', approved, createdAt: new Date().toISOString() };
    users.push(user);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ message: 'Account created successfully!', token, user: { id: user.id, name: user.name, email: user.email, role: user.role, rmiId: user.rmiId, approved: user.approved } });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful!', token, user: { id: user.id, name: user.name, email: user.email, role: user.role, rmiId: user.rmiId, approved: user.approved } });
  } catch {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
});

// ════════════════════════════════════════════════════════════════
// LEVEL 1 — REST API: CRUD — Courses
// ════════════════════════════════════════════════════════════════

// GET /api/courses
app.get('/api/courses', (req, res) => {
  const { category, level, search } = req.query;
  let result = [...courses];
  if (category) result = result.filter(c => c.category.toLowerCase() === category.toLowerCase());
  if (level) result = result.filter(c => c.level.toLowerCase() === level.toLowerCase());
  if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));
  res.json({ count: result.length, courses: result });
});

// GET /api/courses/:id
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });
  res.json(course);
});

// POST /api/courses (admin only)
app.post('/api/courses', authMiddleware, adminOnly, (req, res) => {
  const { title, category, level, duration, description } = req.body;
  if (!title || !category || !level) return res.status(400).json({ error: 'Title, category and level required.' });
  const course = { id: String(nextId.courses++), title, category, level, duration: duration || 'TBD', instructor: req.user.name, enrolled: 0, description: description || '', createdAt: new Date().toISOString() };
  courses.push(course);
  res.status(201).json({ message: 'Course created!', course });
});

// PUT /api/courses/:id (admin only)
app.put('/api/courses/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found.' });
  courses[idx] = { ...courses[idx], ...req.body, id: courses[idx].id };
  res.json({ message: 'Course updated!', course: courses[idx] });
});

// DELETE /api/courses/:id (admin only)
app.delete('/api/courses/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found.' });
  courses.splice(idx, 1);
  res.json({ message: 'Course deleted.' });
});

// ── CRUD: Users (admin) ───────────────────────────────────────
app.get('/api/users', authMiddleware, adminOnly, (req, res) => {
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
});

app.delete('/api/users/:id', authMiddleware, adminOnly, (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });
  users.splice(idx, 1);
  res.json({ message: 'User deleted.' });
});


// ── Payment Recording ──────────────────────────────
let payments = [];

app.post('/api/payments', authMiddleware, (req, res) => {
  const { plan, amount, method, courseIds } = req.body;
  const payment = {
    id: Date.now().toString(),
    userId:  req.user.id,
    rmiId:   users.find(u => u.id === req.user.id)?.rmiId || '',
    plan, amount, method,
    courseIds: courseIds || [],
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  payments.push(payment);
  // Mark user as having active subscription
  const user = users.find(u => u.id === req.user.id);
  if (user) { user.subscription = { plan, amount, activeSince: payment.createdAt }; }
  res.status(201).json({ message: 'Payment recorded.', payment });
});

app.get('/api/payments', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.json(payments.filter(p => p.userId === req.user.id));
  }
  res.json(payments); // Admin sees all
});

// ── Educator approval (admin only) ─────────────────
app.put('/api/users/:id/approve', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  user.approved = true;
  res.json({ message: 'Educator approved.', user: { id: user.id, name: user.name, rmiId: user.rmiId, role: user.role, approved: user.approved } });
});

// ── Stats (updated) ────────────────────────────────

app.get('/api/stats', (req, res) => {
  res.json({
    totalCourses: courses.length,
    totalLearners: users.filter(u => u.role === 'learner').length,
    totalEnrolled: courses.reduce((s, c) => s + c.enrolled, 0),
    categories: [...new Set(courses.map(c => c.category))].length,
    established: 2020,
    mission: 'Empowering disadvantaged communities through STEM education'
  });
});

// ── Level 3: GraphQL-style endpoint ───────────────────────────
app.post('/api/graphql', (req, res) => {
  const { query, variables } = req.body;
  if (query?.includes('courses')) {
    res.json({ data: { courses: courses.map(c => ({ id: c.id, title: c.title, category: c.category, level: c.level, enrolled: c.enrolled })) } });
  } else if (query?.includes('stats')) {
    res.json({ data: { stats: { totalCourses: courses.length, totalLearners: users.length } } });
  } else {
    res.json({ data: null, errors: [{ message: 'Unknown query' }] });
  }
});

// ════════════════════════════════════════════════════════════════
// LEVEL 3 — WebSockets: Real-Time Community Chat
// ════════════════════════════════════════════════════════════════
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ name, room = 'general' }) => {
    socket.join(room);
    socket.data.name = name;
    socket.data.room = room;
    onlineUsers.set(socket.id, { name, room });
    io.to(room).emit('userJoined', { name, count: [...onlineUsers.values()].filter(u => u.room === room).length });
    socket.emit('history', messages.filter(m => m.room === room).slice(-20));
  });

  socket.on('message', ({ text, room = 'general' }) => {
    const msg = { id: Date.now(), name: socket.data.name || 'Anonymous', text, room, time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) };
    messages.push(msg);
    if (messages.length > 200) messages.shift();
    io.to(room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.to(user.room).emit('userLeft', { name: user.name, count: [...onlineUsers.values()].filter(u => u.room === user.room).length });
    }
  });
});

server.listen(PORT, () => console.log(`RMI Server running on http://localhost:${PORT}`));
