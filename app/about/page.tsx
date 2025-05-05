import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Quran.co",
  description:
    "Learn about Quran.co, our mission, and how we use the Cloud Alquran API to provide a free Quran reading experience.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#00AD5F] py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">About Quran.co</h1>
        <p className="mb-4">
          Welcome to Quran.co, a free and non-profit organization dedicated to making the Holy Quran accessible to
          everyone around the world.
        </p>
        <p className="mb-4">
          Our mission is to provide a user-friendly platform for reading, listening to, and studying the Quran, without
          any cost to our users.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>We are a completely free service, with no hidden costs or premium features.</li>
          <li>We do not display any advertisements on our platform.</li>
          <li>We are committed to protecting user privacy and do not collect personal data.</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">Technology</h2>
        <p className="mb-4">
          Quran.co is powered by the Cloud Alquran API, which provides us with accurate and reliable Quranic text,
          translations, and audio recitations. We are grateful for their service, which allows us to offer this valuable
          resource to our users.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Support Us</h2>
        <p className="mb-4">
          As a non-profit organization, we rely on the support of our community. If you find Quran.co helpful, please
          consider sharing it with others or contributing to our project. Your support helps us maintain and improve
          this free service for Muslims worldwide.
        </p>
        <p>
          Thank you for using Quran.co. We hope it brings you closer to the words of Allah and enhances your spiritual
          journey.
        </p>
      </div>
    </div>
  )
}
