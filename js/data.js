/* ===== DevMasterZone – Data Store ===== */
const DMZ = {
  cats: [
    {id:'angular',   name:'Angular',             icon:'fab fa-angular',       color:'#dd0031',count:12},
    {id:'html',      name:'HTML',                 icon:'fab fa-html5',         color:'#e44d26',count:8},
    {id:'css',       name:'CSS',                  icon:'fab fa-css3-alt',      color:'#264de4',count:10},
    {id:'js',        name:'JavaScript',           icon:'fab fa-js-square',     color:'#f7df1e',count:15},
    {id:'ts',        name:'TypeScript',           icon:'fas fa-code',          color:'#3178c6',count:7},
    {id:'react',     name:'React',                icon:'fab fa-react',         color:'#61dafb',count:9},
    {id:'node',      name:'Node.js',              icon:'fab fa-node-js',       color:'#68a063',count:6},
    {id:'projects',  name:'Projects',             icon:'fas fa-layer-group',   color:'#8b5cf6',count:5},
    {id:'interview', name:'Interview Questions',  icon:'fas fa-comments',      color:'#f0a500',count:11},
    {id:'career',    name:'Career Tips',          icon:'fas fa-briefcase',     color:'#10b981',count:8},
  ],
  posts: [
    {id:1,slug:'angular-standalone-components',title:'Angular Standalone Components — Complete Guide 2025',excerpt:'Standalone components remove NgModule. Learn how to use them effectively in production Angular apps with real examples.',cat:'angular',catName:'Angular',icon:'fab fa-angular',author:'DevMasterZone',role:'Angular Expert',date:'Apr 28, 2026',rt:'8 min',views:2340,likes:187,tags:['angular','standalone','typescript'],featured:true,popular:true,
      content:`<p>Angular's standalone components are one of the biggest architectural changes in the framework. Introduced as preview in Angular 14, they fundamentally change how you organize code in Angular apps.</p><h2>What Are Standalone Components?</h2><p>A standalone component manages its own imports directly, without needing to be declared in an NgModule. This reduces boilerplate and makes components more self-contained.</p><pre><code>@Component({
  standalone: true,
  selector: 'app-hello',
  imports: [CommonModule],
  template: '&lt;h1&gt;Hello Standalone!&lt;/h1&gt;'
})
export class HelloComponent {}</code></pre><h2>Benefits</h2><ul><li>Reduced boilerplate — no NgModule needed</li><li>Better tree-shaking and smaller bundle sizes</li><li>Easier lazy loading with loadComponent()</li><li>Simpler testing setup</li></ul><h2>Bootstrapping</h2><p>Angular 17+ uses standalone components as default for new projects:</p><pre><code>bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
});</code></pre><p>This is the recommended approach for all new Angular applications. It leads to cleaner, more maintainable code.</p><h2>Migration</h2><p>Angular provides a schematic to help convert existing NgModule apps:</p><pre><code>ng generate @angular/core:standalone</code></pre><p>This automates most of the migration work for you.</p>`},
    {id:2,slug:'css-grid-mastery',title:'CSS Grid Layout — From Beginner to Pro',excerpt:'Master CSS Grid with visual examples. Build complex layouts with grid-template-areas, auto-fit, minmax and more.',cat:'css',catName:'CSS',icon:'fab fa-css3-alt',author:'DevMasterZone',role:'Frontend Expert',date:'Apr 22, 2026',rt:'12 min',views:3100,likes:264,tags:['css','grid','layout','responsive'],featured:true,popular:true,
      content:`<p>CSS Grid is the most powerful layout system in CSS. It's two-dimensional, handling both rows and columns — unlike Flexbox which is largely one-dimensional.</p><h2>Basic Setup</h2><pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}</code></pre><h2>Template Areas</h2><p>Named areas make complex layouts readable:</p><pre><code>.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}</code></pre><h2>Responsive Without Media Queries</h2><pre><code>.responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}</code></pre>`},
    {id:3,slug:'javascript-closures',title:'JavaScript Closures — Finally Explained Simply',excerpt:'Closures are the most misunderstood concept in JavaScript. Let\'s demystify them once and for all with clear examples.',cat:'js',catName:'JavaScript',icon:'fab fa-js-square',author:'DevMasterZone',role:'JS Expert',date:'Apr 18, 2026',rt:'6 min',views:4200,likes:380,tags:['javascript','closures','functions','scope'],featured:true,popular:true,
      content:`<p>A closure is a function that has access to its outer scope even after that function has returned. This is one of JavaScript's most powerful features.</p><h2>Basic Example</h2><pre><code>function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}
const counter = outer();
counter(); // 1
counter(); // 2</code></pre><p>The inner function "closes over" the count variable — it remembers it even after outer() finishes.</p><h2>Practical Use</h2><pre><code>function makeAdder(x) {
  return (y) => x + y;
}
const add5 = makeAdder(5);
console.log(add5(3)); // 8</code></pre>`},
    {id:4,slug:'react-hooks-guide',title:'React Hooks — useState, useEffect & More',excerpt:'A comprehensive guide to all React hooks with practical examples. Replace class components with cleaner functional code.',cat:'react',catName:'React',icon:'fab fa-react',author:'DevMasterZone',role:'React Developer',date:'Apr 15, 2026',rt:'15 min',views:2980,likes:221,tags:['react','hooks','useState','useEffect'],featured:false,popular:true,
      content:`<p>React Hooks were introduced in 16.8 and transformed how we write React components. They allow you to use state and lifecycle features in function components.</p><h2>useState</h2><pre><code>const [count, setCount] = useState(0);
const increment = () => setCount(prev => prev + 1);</code></pre><h2>useEffect</h2><pre><code>useEffect(() => {
  document.title = 'Count: ' + count;
  return () => { /* cleanup */ };
}, [count]);</code></pre><h2>Custom Hooks</h2><pre><code>function useLocalStorage(key, initial) {
  const [val, setVal] = useState(
    () => JSON.parse(localStorage.getItem(key)) ?? initial
  );
  const set = v => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, set];
}</code></pre>`},
    {id:5,slug:'typescript-generics',title:'TypeScript Generics — Write Reusable Type-Safe Code',excerpt:'Generics let you write flexible, reusable TypeScript code without sacrificing type safety. Master them with this guide.',cat:'ts',catName:'TypeScript',icon:'fas fa-code',author:'DevMasterZone',role:'TypeScript Expert',date:'Apr 10, 2026',rt:'10 min',views:1850,likes:143,tags:['typescript','generics','types'],featured:false,popular:false,
      content:`<p>Generics are TypeScript's most powerful feature. They allow you to write code that works with different types while maintaining full type safety.</p><pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}
const s = identity&lt;string&gt;("hello");
const n = identity&lt;number&gt;(42);</code></pre><h2>Generic Interfaces</h2><pre><code>interface ApiResponse&lt;T&gt; {
  data: T;
  status: number;
  message: string;
}

const res: ApiResponse&lt;User[]&gt; = await fetchUsers();</code></pre>`},
    {id:6,slug:'nodejs-rest-api',title:'Build a REST API with Node.js, Express & MongoDB',excerpt:'Step-by-step tutorial to build a production-ready REST API with authentication, validation, and error handling.',cat:'node',catName:'Node.js',icon:'fab fa-node-js',author:'DevMasterZone',role:'Backend Developer',date:'Apr 5, 2026',rt:'20 min',views:3450,likes:298,tags:['nodejs','express','mongodb','rest'],featured:false,popular:true,
      content:`<p>Building a REST API with Node.js, Express, and MongoDB is one of the most practical skills for modern web development.</p><pre><code>const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});</code></pre><h2>JWT Authentication</h2><pre><code>const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });</code></pre>`},
    {id:7,slug:'html5-semantic-elements',title:'HTML5 Semantic Elements — Write Better Markup',excerpt:'Semantic HTML improves accessibility, SEO, and code readability. Learn all semantic elements with real examples.',cat:'html',catName:'HTML',icon:'fab fa-html5',author:'DevMasterZone',role:'Web Standards',date:'Mar 28, 2026',rt:'7 min',views:1640,likes:112,tags:['html5','semantic','accessibility','seo'],featured:false,popular:false,
      content:`<p>Semantic HTML elements clearly describe their meaning to both browser and developer. Use elements like header, nav, main, article, section, aside, and footer instead of generic divs.</p><pre><code>&lt;article&gt;
  &lt;header&gt;
    &lt;h1&gt;Article Title&lt;/h1&gt;
    &lt;time&gt;2026-04-28&lt;/time&gt;
  &lt;/header&gt;
  &lt;section&gt;Content here...&lt;/section&gt;
  &lt;footer&gt;Author info&lt;/footer&gt;
&lt;/article&gt;</code></pre>`},
    {id:8,slug:'frontend-interview-questions',title:'Top 10 Frontend Interview Questions (2026)',excerpt:'Ace your next frontend interview with answers to the most commonly asked questions on JavaScript, React, and CSS.',cat:'interview',catName:'Interview Questions',icon:'fas fa-comments',author:'DevMasterZone',role:'Career Coach',date:'Mar 20, 2026',rt:'14 min',views:5600,likes:487,tags:['interview','javascript','react','css'],featured:false,popular:true,
      content:`<p>Preparing for a frontend developer interview? Here are the top 10 questions you're most likely to encounter.</p><h2>1. What is the Event Loop?</h2><p>The event loop is JavaScript's mechanism for handling asynchronous operations. Since JS is single-threaded, the event loop allows non-blocking I/O by using a call stack, task queue, and microtask queue.</p><h2>2. Explain Closures</h2><p>A closure is a function that retains access to its outer scope even after the outer function has returned. Used for data privacy, function factories, and memoization.</p><h2>3. Virtual DOM in React</h2><p>React maintains a virtual representation of the DOM in memory. When state changes, React compares the new VDOM with the previous one (diffing) and only updates what changed (reconciliation).</p>`},
    {id:9,slug:'career-tips-developer',title:'10 Career Tips Every Frontend Developer Must Know',excerpt:'From building your portfolio to negotiating salary — practical career advice from experienced developers.',cat:'career',catName:'Career Tips',icon:'fas fa-briefcase',author:'DevMasterZone',role:'Senior Dev',date:'Mar 15, 2026',rt:'9 min',views:2200,likes:189,tags:['career','portfolio','salary'],featured:false,popular:false,
      content:`<p>A career in frontend development offers incredible opportunities. Navigating it requires more than just coding skills.</p><h2>1. Build a Portfolio That Stands Out</h2><p>Include 4-6 high-quality projects showing breadth (different technologies) and depth (well-built features). Host them live, put code on GitHub.</p><h2>2. Contribute to Open Source</h2><p>Even small contributions to popular repositories get noticed. Fix a bug, improve docs, add a test case.</p><h2>3. Learn to Communicate</h2><p>Technical skills alone aren't enough. Developers who can clearly explain their decisions advance much faster.</p>`},
    {id:10,slug:'angular-ecommerce-project',title:'Build a Full E-Commerce App with Angular 17',excerpt:'Complete project tutorial: build a production-ready e-commerce app with Angular, NgRx, and Stripe integration.',cat:'projects',catName:'Projects',icon:'fas fa-layer-group',author:'DevMasterZone',role:'Angular Expert',date:'Mar 8, 2026',rt:'25 min',views:4100,likes:356,tags:['angular','project','ecommerce','ngrx'],featured:false,popular:true,
      content:`<p>In this comprehensive tutorial, we'll build a complete e-commerce app from scratch using Angular 17, NgRx for state management, and Stripe for payments.</p><h2>Project Structure</h2><pre><code>src/app/
  core/          # services, guards, interceptors
  shared/        # reusable components
  features/
    products/    # product listing & detail
    cart/        # shopping cart
    checkout/    # checkout flow
    auth/        # login & register</code></pre>`},
    {id:11,slug:'css-flexbox-guide',title:'CSS Flexbox — A Complete Visual Guide',excerpt:'Master Flexbox with visual diagrams and practical examples. Build navigation bars, card layouts, and more.',cat:'css',catName:'CSS',icon:'fab fa-css3-alt',author:'DevMasterZone',role:'CSS Specialist',date:'Feb 28, 2026',rt:'11 min',views:2890,likes:241,tags:['css','flexbox','layout'],featured:false,popular:false,
      content:`<p>CSS Flexbox is a one-dimensional layout method for arranging items in rows or columns. Items flex to fill additional space or shrink to fit into smaller spaces.</p><pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}</code></pre><h2>Key Properties</h2><ul><li><code>flex-direction</code>: row | column</li><li><code>justify-content</code>: main axis alignment</li><li><code>align-items</code>: cross axis alignment</li><li><code>flex-wrap</code>: allow wrapping</li></ul>`},
    {id:12,slug:'js-async-await',title:'JavaScript Promises & Async/Await — Deep Dive',excerpt:'Understand asynchronous JavaScript with Promises, then() chains, async/await, and proper error handling.',cat:'js',catName:'JavaScript',icon:'fab fa-js-square',author:'DevMasterZone',role:'JS Expert',date:'Feb 20, 2026',rt:'13 min',views:3700,likes:315,tags:['javascript','async','promises','await'],featured:false,popular:true,
      content:`<p>Asynchronous programming is fundamental to modern JavaScript. Promises and async/await provide clean ways to handle async operations.</p><h2>Promises</h2><pre><code>fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));</code></pre><h2>Async/Await</h2><pre><code>async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}</code></pre>`},
  ],
  get(slug){return this.posts.find(p=>p.slug===slug)},
  byId(id){return this.posts.find(p=>p.id===id)},
  featured(){return this.posts.filter(p=>p.featured)},
  popular(n=5){return this.posts.filter(p=>p.popular).slice(0,n)},
  recent(n=5){return this.posts.slice(0,n)},
  byCat(c){return this.posts.filter(p=>p.cat===c)},
  search(q){const s=q.toLowerCase();return this.posts.filter(p=>p.title.toLowerCase().includes(s)||p.excerpt.toLowerCase().includes(s)||p.cat.includes(s)||p.tags.some(t=>t.includes(s)))},
  prevNext(id){const i=this.posts.findIndex(p=>p.id===id);return{prev:i>0?this.posts[i-1]:null,next:i<this.posts.length-1?this.posts[i+1]:null}},
  related(post,n=3){return this.posts.filter(p=>p.id!==post.id&&p.cat===post.cat).slice(0,n)},
  tags(){const t=new Set();this.posts.forEach(p=>p.tags.forEach(x=>t.add(x)));return[...t]},
};
