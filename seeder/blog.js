const { BlogModel } = require('../databaseModels/blog');
const { UserModel } = require('../databaseModels/users');

const techBlogs = [
    {
        authorEmail: 'john@yopmail.com',
        title: 'Getting Started with React 19',
        content: `React 19 introduces improved server components, better hydration, and streamlined hooks patterns. For frontend developers, the biggest win is simpler data fetching inside components and faster page loads.

Start by creating a new app with Create React App or Vite, then explore the new use() hook for reading promises and context. Combine React Router for navigation and Context API for lightweight global state.

Best practices: keep components small, colocate state near usage, and use memoization only when profiling shows a real bottleneck.`,
    },
    {
        authorEmail: 'jane@yopmail.com',
        title: 'Building REST APIs with Node.js and Express',
        content: `Express remains one of the most popular frameworks for building REST APIs in Node.js. A clean API structure separates routes, controllers, validators, and database models.

Use middleware for authentication (JWT), validation (express-validator), and error handling. Always return consistent JSON responses with message and data fields.

Security tips: hash passwords with bcrypt, never expose secrets in code, validate all inputs, and apply role-based access control for admin endpoints.`,
    },
    {
        authorEmail: 'mike@yopmail.com',
        title: 'MongoDB Atlas for Modern Web Applications',
        content: `MongoDB Atlas provides a fully managed cloud database with automatic backups, scaling, and monitoring. It pairs naturally with Node.js through Mongoose ODM.

Design collections with clear schemas, use indexes on frequently queried fields, and prefer embedding for one-to-few relationships. For large datasets, use pagination and projection to limit returned fields.

Connection tip: store your MongoDB URI in environment config and always whitelist your server IP in Atlas Network Access during development.`,
    },
    {
        authorEmail: 'sara@yopmail.com',
        title: 'Understanding JWT Authentication Flow',
        content: `JSON Web Tokens (JWT) enable stateless authentication between frontend and backend. On login, the server validates credentials and returns a signed token. The client stores it and sends it in the Authorization header for protected routes.

A typical payload includes user id and role. Middleware verifies the token on each request before allowing access to protected resources.

Never store sensitive data in JWT payloads. Set token expiry, use HTTPS in production, and clear tokens on logout from the client side.`,
    },
    {
        authorEmail: 'david@yopmail.com',
        title: 'Introduction to TypeScript for JavaScript Developers',
        content: `TypeScript adds static typing on top of JavaScript, helping catch bugs during development rather than in production. It is widely adopted in React, Angular, and Node.js projects.

Start with strict mode disabled, then gradually add types to function parameters, API responses, and component props. Use interfaces for object shapes and union types for values that can be one of several types.

The learning curve pays off in larger codebases where refactoring and team collaboration become significantly easier.`,
    },
    {
        authorEmail: 'john@yopmail.com',
        title: 'CSS Grid vs Flexbox: When to Use Each',
        content: `Flexbox excels at one-dimensional layouts — aligning items in a row or column. CSS Grid handles two-dimensional layouts where you need control over both rows and columns simultaneously.

Use Flexbox for navigation bars, card footers, and vertically centering content. Use Grid for page layouts, dashboards, and complex responsive designs with named areas.

Modern apps often combine both: Grid for the overall page structure and Flexbox inside individual components.`,
    },
    {
        authorEmail: 'jane@yopmail.com',
        title: 'Docker Basics for Full-Stack Developers',
        content: `Docker packages your application and its dependencies into containers that run consistently across machines. For full-stack developers, Docker simplifies sharing development environments and deploying to production.

A typical setup includes a Dockerfile for the Node.js API, docker-compose for running API + MongoDB together, and volume mounts for local development hot reload.

Key commands: docker build, docker run, docker-compose up. Start simple with one service before orchestrating multi-container stacks.`,
    },
    {
        authorEmail: 'mike@yopmail.com',
        title: 'Web Performance Optimization Techniques',
        content: `Fast websites improve user experience and SEO rankings. Core techniques include code splitting, lazy loading images, compressing assets, and caching API responses.

On the frontend, use React.lazy for route-based splitting and avoid unnecessary re-renders with proper state management. On the backend, add database indexes and paginate large list endpoints.

Measure before optimizing — Lighthouse, Web Vitals, and browser DevTools Network tab reveal the real bottlenecks in your application.`,
    },
    {
        authorEmail: 'sara@yopmail.com',
        title: 'Git Workflow for Team Projects',
        content: `A solid Git workflow keeps team development organized. The feature branch workflow is popular: create a branch per feature, commit often with clear messages, open a pull request, get review, then merge to main.

Use meaningful commit messages like "fix: resolve login redirect race condition" following conventional commits. Never commit secrets, node_modules, or environment files.

Resolve merge conflicts early and pull from main frequently to avoid large painful merges at the end of a sprint.`,
    },
    {
        authorEmail: 'david@yopmail.com',
        title: 'The Rise of AI in Software Development',
        content: `Artificial intelligence is transforming how developers write, test, and deploy code. AI assistants help with boilerplate generation, debugging, documentation, and code reviews.

However, AI-generated code still requires human review for security, correctness, and maintainability. Treat AI as a productivity multiplier, not a replacement for understanding fundamentals.

The developers who thrive will combine strong CS fundamentals with effective use of AI tools to ship faster while maintaining code quality.`,
    },
];

async function createBlogs() {
    try {
        let created = 0;

        for (const blog of techBlogs) {
            const existing = await BlogModel.findOne({ title: blog.title });
            if (existing) {
                console.log(`Blog already exists: ${blog.title}`);
                continue;
            }

            const author = await UserModel.findOne({ email: blog.authorEmail });
            if (!author) {
                console.log(`Author not found for blog "${blog.title}": ${blog.authorEmail}`);
                continue;
            }

            await BlogModel.create({
                title: blog.title,
                content: blog.content,
                userId: author._id,
                status: 'active',
            });
            created++;
            console.log(`Blog created: ${blog.title}`);
        }

        console.log(`Blog seeding done. ${created} new blog(s) added.`);
    } catch (err) {
        console.error('Error creating blogs:', err);
        return Promise.reject(err);
    }
}

module.exports = { createBlogs, techBlogs };
