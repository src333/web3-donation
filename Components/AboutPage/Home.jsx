import React from "react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-green-700 text-white text-center py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Mosque</h1>
        <p className="text-lg md:text-xl">
          Serving the community with faith, unity, and purpose.
        </p>

        {/* SVG Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 text-white"
          viewBox="0 0 1160 163"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 
            1216 7.7L1276 13V163H1216C1156 163 1036 163 916 163C796 163 676 163 556 163C436 163 316 163 196 163C76 163 
            -44 163 -104 163H-164V13Z"
          />
        </svg>
      </div>

      {/* Welcome Section */}
      <section className="relative z-10 py-16 px-6 md:px-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">
          A Place for Peace and Worship
        </h2>
        <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto">
          The mosque provides a welcoming environment for prayer, education, and community
          development. It stands as a beacon of faith, unity, and tradition in the heart of the city.
        </p>
        <div className="text-center mt-8">
          <a
            href="/about"
            className="inline-block bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="bg-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-12 text-green-700">
            Our Key Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Daily Prayers",
                desc: "Providing five daily congregational prayers for the community.",
              },
              {
                title: "Islamic Education",
                desc: "Teaching Qur’an and Sunnah for men, women, and children.",
              },
              {
                title: "Community Services",
                desc: "Offering social and recreational support programs.",
              },
              {
                title: "Dawah & Outreach",
                desc: "Promoting harmony through interfaith understanding.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold text-green-700 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embedded Video */}
      <section className="bg-white py-16 px-6 md:px-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Our Future Vision
            </h3>
            <p className="text-gray-700 mb-4">
              With your help, we aim to complete a purpose-built mosque and cultural centre for 3000+ worshippers, offering essential services and space for all.
            </p>
          </div>
          <div className="flex-1">
            <iframe
              className="w-full h-64 md:h-72 rounded-lg shadow-md"
              src="https://www.youtube.com/embed/RrsT1SAjLQI"
              title="Future Mosque Vision"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
