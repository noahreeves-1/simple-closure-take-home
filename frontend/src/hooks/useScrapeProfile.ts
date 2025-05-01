import { useMutation } from "@tanstack/react-query";
import { ScrapeData } from "../types";
import { API_CONFIG } from "../constants/config";

// --- API Fetching Function ---
const fetchScrapeData = async (url: string): Promise<ScrapeData> => {
  //* --- Mock data to avoid LinkedIn API ---
  // return {
  //   name: "Reid Hoffman",
  //   photoUrl:
  //     "https://media.licdn.com/dms/image/v2/D5603AQHW7wKzPb3DAg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718216204174?e=1751500800&v=beta&t=oiKZurni_4T3ipC9GBBTLB7EUoYSokL0hxHybHO0hs8",
  //   workExperience: [
  //     {
  //       title: "Co-Founder, Board Chair",
  //       company: "Manas AI · Part-time",
  //       dateRange: "Jan 2025 - Present · 4 mos",
  //       location: "N/A",
  //       description:
  //         "Manas AI leverages proprietary AI, generative computational chemistry, and best in class biology to cut the timeline and costs of traditional therapeutic discovery and transform the treatment of cancer and rare disease.\n" +
  //         "\n" +
  //         "While we're still in the early stages of contemporary AI development, initiatives like Manas AI show how close we already are to advances that can profoundly change the world. Success in our quest will give thousands of oncologists around the world new therapeutics to combat diseases that have shaped human existence since before recorded history, constraining human possibilities and causing immense suffering and loss. The future of medicine has never held more promise.",
  //     },
  //     {
  //       title: "Co-Founder, Board Member",
  //       company: "Inflection AI · Part-time",
  //       dateRange: "Mar 2022 - Present · 3 yrs 2 mos",
  //       location: "Palo Alto, California, United States",
  //       description:
  //         "Inflection AI is a public benefit corporation leveraging our world-class large language model to build the first AI platform focused on the needs of the enterprise. \n" +
  //         "\n" +
  //         "I helped start Inflection AI to further a vision where artificial intelligence empowers individuals and amplifies human capabilities. In March 2024, an expanded team of kind, innovative, and collaborative individuals grew Inflection's scope to focus on building enterprise AI solutions.",
  //     },
  //     {
  //       title: "Partner",
  //       company: "Greylock · Full-time",
  //       dateRange: "Nov 2009 - Present · 15 yrs 6 mos",
  //       location: "Seattle, Washington, United States",
  //       description:
  //         "Greylock partners with entrepreneurs to build market-transforming companies. Notable Greylock portfolio companies include Linkedin, Airbnb, Facebook, Workday, Roblox, Palo Alto Networks, Dropbox, Pure Storage, Instagram and Discord. I represent Greylock on the boards of Aurora, Coda, Entrepreneur First, Tome, and Nauto.\n" +
  //         "\n" +
  //         "My primary focus is world-class entrepreneurs with bold new ideas with the possibility of massive scale. I also focus on companies in domains where my product and entrepreneurial experience applies strongly: consumer internet, enterprise 2.0, mobile, social gaming, online marketplaces, payments, SAAS, and social networks.",
  //     },
  //     {
  //       title: "Chairperson",
  //       company: "Village Global · Part-time",
  //       dateRange: "Aug 2017 - Present · 7 yrs 9 mos",
  //       location: "Seattle, Washington, United States · Hybrid",
  //       description:
  //         "Village Global is a network-native VC firm backed by tech industry luminaries. When you join a Village, seed capital is just the beginning. Village helps you go faster with an incredible founder community, expert advice, and game-changing introductions.\n" +
  //         "\n" +
  //         "As the Chairman of Village since 2017, I have supported the community as we've built a network of experienced founders and advisors who are democratizing access to startup wisdom.",
  //     },
  //     {
  //       title: "Board Member",
  //       company: "Microsoft · Part-time",
  //       dateRange: "Mar 2017 - Present · 8 yrs 2 mos",
  //       location: "Seattle, Washington, United States",
  //       description:
  //         "Microsoft's mission is to empower every person and every organization on the planet to achieve more.\n" +
  //         "\n" +
  //         "I believe in technology's power to empower people and transform industries. Microsoft exemplifies this mission at a global scale. Joining the board allowed me to contribute to a company that is using AI and cloud computing to amplify human potential and enhance productivity and creativity for billions.",
  //     },
  //   ],
  //   education: [
  //     {
  //       degree: "Honorary Doctorate, Human Sciences",
  //       school: "Università degli Studi di Perugia",
  //       dateRange: "May 2024 - May 2024",
  //       description: "N/A",
  //     },
  //     {
  //       degree:
  //         "Honorary Doctor, Faculty of Information Technology and Electrical Engineering",
  //       school: "University of Oulu",
  //       dateRange: "2020 - 2020",
  //       description:
  //         "The University of Oulu is an international science university which creates new knowledge, well-being and innovations for the future through research and education. The University of Oulu, founded in 1958, is one of the biggest and most multidisciplinary universities in Finland.",
  //     },
  //   ],
  // };

  if (!url) {
    throw new Error("URL is required to fetch scrape data.");
  }

  const apiUrl = `${API_CONFIG.BASE_URL}${
    API_CONFIG.ENDPOINTS.SCRAPE
  }?url=${encodeURIComponent(url)}`;

  // console.log("Mutating API via useScrapeProfileMutation:", apiUrl);
  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `HTTP error! status: ${response.status} - ${
        errorData?.error || response.statusText
      }`
    );
  }
  const data: ScrapeData = await response.json();
  // console.log("Data received via useScrapeProfileMutation:", data);
  return data;
};

export const useScrapeProfileMutation = () => {
  return useMutation<ScrapeData, Error, string>({
    mutationFn: fetchScrapeData,
  });
};
