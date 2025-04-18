import React from "react";
import InfoCard from "./InfoCard";

export default function About() {
  return (
    <div className="relative bg-opacity-75 ">
      {/* Hero section with wave */}
      <div className="relative bg-green-700 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">About Us</h1>
        <p className="text-lg">Our history, mission, and ongoing journey.</p>

        {/* SVG wave */}
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

      {/* Main content below the wave */}
      <div className="relative z-10 bg-white pt-16 pb-10 px-6 md:px-20 max-w-6xl mx-auto ">
        <InfoCard className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">Background History</h2>
          <p className="text-gray-800 leading-relaxed">
            The London Borough of Tower Hamlets is home to a dense Muslim population, Stepney Green. Before 1980, local Muslims did not have a Masjid where they could come together for daily prayers or to run Islamic activities. Muslim residents would move from neighbour to neighbour’s home to pray in congregation, however as the number of worshippers grew, it soon became clear the need for a Mosque.
            <br /><br />
            In 1985, Stepney Shahjalal Masjid was formed on the grounds of Shandy Park. It was named after Hazrat Shah Jalal Mujarrad al Yemeni (RA) who migrated to Bangladesh from the Middle East to promote Islamic education and Dawah activities within the Sylhet region of Bangladesh. The Mosque is managed by a board of trustees, who are elected every two years by members of the Mosque. The activities and financial matters are regulated by the Charity Commission and Company law in the UK.
          </p>
          <p className="mt-4 font-semibold text-green-700">
            To support the running of the Mosque and its activities, there is an advisory board which comprises of Imams, Islamic scholars and community leaders.
          </p>
        </InfoCard>

        <InfoCard className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">Aims and Objectives of the Mosque</h2>
          <p className="text-gray-800 leading-relaxed space-y-2">
            Provide and facilitate the five daily prayers for the local Muslim residents.
            <br />
            To provide Islamic education regarding the Quran and authentic practices of Prophet Muhammad (s) for men, women and children.
            <br />
            To provide social and recreational services for local Muslim residents.
            <br />
            To increase awareness of Islam amongst non-Muslims and promote community cohesion to establish social harmony.
          </p>
        </InfoCard>

        <InfoCard className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">Timelines of Stepney Shahjalal Mosque</h2>
          <p className="text-gray-800 leading-relaxed space-y-2">
            <b>1980</b> - Tarawih prayer and five daily prayers took place in various residents’ homes.
            <br />
            <b>1981</b> - Stepney Shahjalal Mosque Committee was formed.
            <br />
            <b>1985</b> - Prayer facilities moved into the caretaker hut on the grounds of Shandy Park, accommodating up to 50 worshippers.
            <br />
            <b>1990</b> - Tower Hamlets Council granted permission to install portable cabins for education and worship due to growing needs.
            <br />
            <b>1992</b> - The mosque was registered as a Place of Worship under the Worship & Registration Act 1855.
            <br />
            <b>1999</b> - Registered as a Charity with the Charity Commission and a Company limited by guarantee with Companies House.
            <br />
            <b>2002</b> - With community support, freehold land was purchased from the council for a purpose-built Mosque and Cultural Centre.
            <br />
            <b>2005</b> - Additional buildings allowed for up to 800 worshippers indoors, with 500–700 more still praying outdoors in all weather.
            <br />
            <b>2010</b> - Full planning permission granted to build a new mosque for 3000+ men, women, and children.
          </p>
        </InfoCard>

        <InfoCard className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">Works Done Towards Building This Mosque</h2>
          <p className="text-gray-800 leading-relaxed">
            <b>2013</b> - All essential pre-conditions were approved and pre-commencement work began. Due to the land's archaeological importance, Ministry of Justice permission was needed for foundation work. The project was split into two phases: Phase one (Mosque) and Phase two (Community Centre). A temporary mosque was erected with portable buildings to serve 700–800 worshippers and educational activities for all.
          </p>
        </InfoCard>

        <InfoCard>
          <h2 className="text-2xl font-semibold mb-4 text-green-700 text-center">Progress of Construction Work</h2>
          <p className="text-gray-800 leading-relaxed">
            <b>2014-2016</b> - Old Porta Cabin mosque was demolished. Architects, engineers, fire & safety consultants, archaeologists, and surveyors were hired. MOJ approved foundation design.
            <br />
            <b>2016</b> - Brook William contractor appointed for Phase One to build a masjid for 1500 worshippers. Estimated cost: £3.5 million. Foundation stone laid on 7 November 2016 with community participation.
            <br />
            <b>2017</b> - Final architectural and engineering drawings were completed. Foundation design finalized and archaeological brief concluded.
          </p>
          <p className="mt-4 text-gray-800">
            It was a dream of the Muslim residents of St Dunstan ward and surrounding areas to have a purpose-built Mosque and Community hub since 1985. With all legal and planning approvals secured, the aim was to complete construction within 18 months and remove the temporary portacabins.
          </p>
          <p className="mt-4 text-gray-800">
            <b>Alhamdulillah</b>, underground foundation work is nearly complete. Once finished, the Mosque will serve over 3000 worshippers. Work began with £0.5 million in funds raised by the community, though £3.5 million is needed to complete Phase One.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}