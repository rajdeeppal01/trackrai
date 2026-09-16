import { notFound } from 'next/navigation';
import Link from 'next/link';
import companies from '../../../data/companies.json';
import { Briefcase, Clock, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Next.js static generation
export async function generateStaticParams() {
  // To avoid Next.js trying to fetch data at build time for paths with "-interview-process" suffix,
  // we actually define the static paths including that suffix.
  // Wait, our file structure is just [slug]/page.jsx, so if the URL is `/companies/google-interview-process`,
  // the `slug` param will be "google-interview-process".
  return companies.map((company) => ({
    slug: `${company.slug}-interview-process`,
  }));
}

// Next.js dynamic metadata for SEO
export async function generateMetadata({ params }) {
  // Extract base slug from "google-interview-process" -> "google"
  const { slug } = await params;
  const baseSlug = slug.replace('-interview-process', '');
  const company = companies.find((c) => c.slug === baseSlug);

  if (!company) {
    return { title: 'Company Not Found' };
  }

  return {
    title: `How to Track Your ${company.name} Job Application & Interview Process | TrackrAI`,
    description: `Learn how to ace the ${company.name} interview process. Track your applications, monitor hiring timelines, and organize your job hunt with TrackrAI.`,
    keywords: `${company.name} interview process, ${company.name} job application, track ${company.name} application, ${company.name} hiring timeline`,
  };
}

export default async function CompanySEOPage({ params }) {
  const { slug } = await params;
  const baseSlug = slug.replace('-interview-process', '');
  const company = companies.find((c) => c.slug === baseSlug);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-700 shadow-2xl mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="w-24 h-24 bg-white rounded-2xl p-2 mx-auto flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <img 
              src={company.logoUrl} 
              alt={`${company.name} logo`} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            How to Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{company.name}</span> Job Application
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Applying to {company.name} can be a long, multi-stage process. Don't lose track of recruiter calls, technical screens, and final rounds.
          </p>
          
          <Link 
            href="/signin" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Start Tracking Your Application
          </Link>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-400">
              <Clock className="mr-3" /> The Hiring Timeline
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The {company.name} interview process typically spans several weeks to a few months. From the initial recruiter screen to the online assessment (OA), technical rounds, and the final behavioral loop, staying organized is critical.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Use TrackrAI's Kanban board to visually move your {company.name} application through every stage so you never miss a follow-up email.
            </p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-purple-400">
              <ShieldCheck className="mr-3" /> Stay Prepared
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">Save specific job descriptions before they get taken down.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">Log interview notes and questions immediately after rounds.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">Set automatic reminders to follow up with your {company.name} recruiter.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-10 text-center border border-gray-700">
          <h2 className="text-3xl font-bold mb-4">Ready to land that offer at {company.name}?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of developers using TrackrAI to organize their job search and land roles at top tech companies.
          </p>
          <Link 
            href="/signin" 
            className="inline-block px-8 py-3 font-semibold text-gray-900 bg-white rounded-full hover:bg-gray-200 transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
