import { Bot, Database, Shield, Zap, Github, Mail, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">About AI ToDoList</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    A smart task management application powered by AI that helps you organize, 
                    prioritize, and complete your tasks more efficiently.
                </p>
            </div>

            {/* What We Do Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        What We Do
                    </CardTitle>
                    <CardDescription>
                        Understanding our mission and how we help you stay organized
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-lg leading-relaxed mb-4">
                        AI ToDoList is more than just a task manager - it's your intelligent productivity companion. 
                        Our AI chatbot understands your goals, helps break down complex projects, and provides 
                        personalized suggestions to keep you on track.
                    </p>
                    
                </CardContent>
            </Card>

            {/* Key Features Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            AI-Powered Chatbot
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Intelligent conversation interface that helps you create, organize, and prioritize tasks 
                            through natural language interaction.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Secure Data Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Your tasks and data are safely stored in a PostgreSQL database with secure authentication 
                            and session management.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Google OAuth Integration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Secure login using Google OAuth2, ensuring your account is protected with industry-standard 
                            authentication.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            Modern Tech Stack
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Built with cutting-edge technologies for a fast, responsive, and reliable user experience.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Technologies Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Technologies Used</CardTitle>
                    <CardDescription>
                        Built with modern, reliable technologies for the best user experience
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Frontend</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">React</Badge>
                                <Badge variant="secondary">TypeScript</Badge>
                                <Badge variant="secondary">Tailwind CSS</Badge>
                                <Badge variant="secondary">Shadcn/ui</Badge>
                                <Badge variant="secondary">Vite</Badge>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Backend</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Node.js</Badge>
                                <Badge variant="secondary">Express.js</Badge>
                                <Badge variant="secondary">PostgreSQL</Badge>
                                <Badge variant="secondary">Passport.js</Badge>
                                <Badge variant="secondary">Google OAuth2</Badge>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Development</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">ESLint</Badge>
                                <Badge variant="secondary">Prettier</Badge>
                                <Badge variant="secondary">Git</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        

            {/* Developer Info Section */}
            <Card>
                <CardHeader>
                    <CardTitle>About the Developer</CardTitle>
                    <CardDescription>
                        This project was created as a portfolio piece to showcase modern web development skills
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                            <p className="text-muted-foreground mb-4">
                                This application demonstrates proficiency in full-stack development, 
                                modern UI/UX design, and secure authentication implementation. 
                                It showcases the ability to build production-ready applications 
                                with clean, maintainable code.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <a 
                                href="https://github.com/kevinhh12/AIToDoList.git" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                <Github className="h-4 w-4" />
                                GitHub
                            </a>
                            <a 
                                href="mailto:hohe4231@gmail.com"
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                Contact
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}