export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#00AD5F] flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you are looking for does not exist.</p>
        <a href="/" className="text-[#00AD5F] hover:underline">
          Return to Home
        </a>
      </div>
    </div>
  )
}
