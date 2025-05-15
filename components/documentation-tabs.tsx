import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Code, Server, TestTube, Upload } from "lucide-react"

export function DocumentationTabs() {
  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="requirements">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Requirements</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">API Specs</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Test Plan</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Deployment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="mt-4">
            <div className="prose max-w-none">
              <h3>Project Requirements</h3>
              <p>The E-Commerce Platform should provide the following core functionality:</p>
              <ul>
                <li>User authentication and account management</li>
                <li>Product catalog with categories and search</li>
                <li>Shopping cart and checkout process</li>
                <li>Order management and history</li>
                <li>Admin dashboard for inventory management</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="mt-4">
            <div className="prose max-w-none">
              <h3>System Architecture</h3>
              <p>The application follows a modern microservices architecture:</p>
              <ul>
                <li>Frontend: Next.js with React Server Components</li>
                <li>API Layer: RESTful endpoints with OpenAPI specification</li>
                <li>Database: PostgreSQL with Prisma ORM</li>
                <li>Authentication: JWT-based auth with refresh tokens</li>
                <li>Deployment: Docker containers on Kubernetes</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-4">
            <div className="prose max-w-none">
              <h3>API Specifications</h3>
              <p>The API follows RESTful principles with the following endpoints:</p>
              <ul>
                <li>
                  <code>/api/auth</code> - Authentication endpoints
                </li>
                <li>
                  <code>/api/products</code> - Product management
                </li>
                <li>
                  <code>/api/orders</code> - Order processing
                </li>
                <li>
                  <code>/api/users</code> - User management
                </li>
                <li>
                  <code>/api/cart</code> - Shopping cart operations
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="test" className="mt-4">
            <div className="prose max-w-none">
              <h3>Test Plan</h3>
              <p>The testing strategy includes:</p>
              <ul>
                <li>Unit tests for all business logic</li>
                <li>Integration tests for API endpoints</li>
                <li>E2E tests for critical user flows</li>
                <li>Performance testing for high-traffic scenarios</li>
                <li>Security testing for authentication and authorization</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="mt-4">
            <div className="prose max-w-none">
              <h3>Deployment Strategy</h3>
              <p>The deployment pipeline includes:</p>
              <ul>
                <li>CI/CD with GitHub Actions</li>
                <li>Containerization with Docker</li>
                <li>Orchestration with Kubernetes</li>
                <li>Infrastructure as Code with Terraform</li>
                <li>Monitoring with Prometheus and Grafana</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
