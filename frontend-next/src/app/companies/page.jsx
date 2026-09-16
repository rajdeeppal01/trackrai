import Link from 'next/link';
import companies from '../../data/companies.json';

export const metadata = {
  title: 'Tech Company Interview Processes & Hiring Timelines | TrackrAI',
  description: 'Explore our database of tech companies. Learn about their interview processes, timelines, and how to track your job applications effectively.',
};

export default function CompaniesDirectory() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
            Tech Company Interview Hub
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about tracking your job applications and acing interviews at the world's top tech companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company) => (
            <Link 
              key={company.slug} 
              href={`/companies/${company.slug}-interview-process`}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img 
                      src={company.logoUrl} 
                      alt={`${company.name} logo`} 
                      className="w-full h-full object-contain"
                    />
                </div>
                <div>
                  <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                    {company.name}
                  </h2>
                  <span className="text-sm text-gray-500">{company.industry}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {company.description}
              </p>
              <div className="text-blue-400 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                View Interview Process →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
