import { Link } from 'react-router-dom';
import { Target, Eye, Award, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const getValues = (translations: any) => [
  {
    icon: Target,
    title: translations.excellence,
    description: translations.excellenceDescription
  },
  {
    icon: Users,
    title: translations.clientFocused,
    description: translations.clientFocusedDescription
  },
  {
    icon: Award,
    title: translations.integrity,
    description: translations.integrityDescription
  },
  {
    icon: Eye,
    title: translations.innovationValue,
    description: translations.innovationValueDescription
  }
];

const teamMembers = [
  {
    name: 'Marie Ndong',
    role: 'CEO & Founder',
    image: '/images/immigration/immi1.jpg'
  },
  {
    name: 'Jean-Pierre Mbengue',
    role: 'CTO',
    image: '/images/immigration/immi2.jpg'
  },
  {
    name: 'Aisha Diop',
    role: 'Head of Immigration Services',
    image: '/images/immigration/immi3.jpg'
  },
  {
    name: 'Pierre Akono',
    role: 'Lead Instructor',
    image: '/images/immigration/immi4.jpg'
  }
];

export default function About() {
  const { translations } = useLanguage();
  const values = getValues(translations);
  
  return (
    <div className="min-h-screen">
      <section className="relative bg-[#0A3D91] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{translations.aboutPageTitle}</h1>
            <p className="text-xl md:text-2xl leading-relaxed">
              {translations.aboutPageSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: '#0A3D91' }}>
                {translations.aboutPageWhoWeAre}
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p className="leading-relaxed">
                  {translations.aboutPageWhoWeAreDescription1}
                </p>
                <p className="leading-relaxed">
                  {translations.aboutPageWhoWeAreDescription2}
                </p>
                <p className="leading-relaxed">
                  {translations.aboutPageWhoWeAreDescription3}
                </p>
              </div>
            </div>
            <div>
              <img
                src="/images/About/about1.jpg"
                alt={translations.aboutPageTeamImageAlt || "MANÉ GROUP Team"}
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center" style={{ backgroundColor: '#0A3D91' }}>
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                {translations.aboutPageMission}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {translations.aboutPageMissionDescription}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-lg mb-6 flex items-center justify-center" style={{ backgroundColor: '#D6001C' }}>
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0A3D91' }}>
                {translations.aboutPageVision}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {translations.aboutPageVisionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#0A3D91' }}>
            {translations.aboutPageCoreValues}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#0A3D91' }}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#0A3D91' }}>
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#0A3D91' }}>
            {translations.aboutPageTeam}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#0A3D91' }}>
                    {member.name}
                  </h3>
                  <p className="text-gray-600">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#0A3D91' }}>
            {translations.aboutPageMission}
          </h2>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/About/about2.jpg"
              alt="Our Mission"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0A3D91' }}>
              {translations.aboutPageMission}
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {translations.aboutPageMissionDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0A3D91] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{translations.aboutPageJoinStory}</h2>
          <p className="text-xl mb-8">
            {translations.aboutPageSubtitle}
          </p>
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Our Address</h3>
            <p className="text-lg bg-blue-800/30 rounded-lg py-4 px-6 max-w-2xl mx-auto">Bonas devant Auto Ecole Mane D'Afrik</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-xl"
              style={{ backgroundColor: '#D6001C' }}
            >
              {translations.aboutPageGetStarted}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg rounded-lg font-semibold bg-white hover:bg-gray-100 transition-all duration-300"
              style={{ color: '#0A3D91' }}
            >
              {translations.aboutPageContactUs}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}