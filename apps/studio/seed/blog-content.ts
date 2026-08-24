/**
 * The ten news articles from petrosol.com.gh/news, transcribed verbatim.
 *
 * COPY IS REPRODUCED AS PUBLISHED. Typos, inconsistent capitalisation and the
 * odd garbled sentence are all present in the source; they are left alone here
 * rather than quietly corrected, so that what lands in Sanity is demonstrably
 * the same text that was on the old site. Fix them in the Studio, deliberately.
 *
 * Six of the ten carry no photograph of their own on the old site — they fall
 * back to a stock forecourt shot (`PETROSOL 2021_38.JPG`). That is preserved
 * here so nothing is invented, which does mean the blog listing shows the same
 * picture six times until real photographs replace them.
 *
 * Dates come from the news index, which shows the year; the article pages
 * themselves print only day and month.
 */

export type ArticleSeed = {
  /** The slug from the old public URL, so existing links keep resolving. */
  slug: string;
  title: string;
  /** ISO date. */
  publishedAt: string;
  categoryId: string;
  excerpt: string;
  /** One entry per paragraph. */
  body: string[];
  image: { url: string; alt: string };
};

/** The stock forecourt photo the old site falls back to. */
const FALLBACK_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/614dc35d29b10802ea248bb6/1633357658931-N61NJQB9LFNBSK57I5D0/PETROSOL+2021_38.JPG";

const FALLBACK_ALT = "A PETROSOL fuel station forecourt";

export const articles: ArticleSeed[] = [
  {
    slug: "petrosol-commended-for-fuel-quality-and-accuracy",
    title: "PETROSOL commended for fuel quality and accuracy",
    publishedAt: "2024-09-04",
    categoryId: "category-recognition",
    excerpt:
      "The Chamber of Petroleum Consumers has commended PETROSOL Platinum Energy for its unwavering commitment to delivering high-quality fuel and accurate quantities to consumers.",
    image: {
      url: "https://images.squarespace-cdn.com/content/v1/614dc35d29b10802ea248bb6/dabe274e-492d-4628-933e-8be4bed8d45d/WhatsApp+Image+2024-09-04+at+14.52.52.jpeg",
      alt: "Mr. Duncan Amoah, COPEC Executive Secretary",
    },
    body: [
      "Accra, Ghana - The Chamber of Petroleum Consumers (COPEC) has commended PETROSOL Platinum Energy for its unwavering commitment to delivering high-quality fuel and accurate quantities to consumers.",
      "In a congratulatory message marking PETROSOL's 10th anniversary, COPEC's Executive Secretary, Mr. Duncan Amoah, hailed the company as a shining example of excellence in the industry.",
      "Mr. Amoah noted that PETROSOL's triple International Organization for Standardization (ISO) certification for quality management, health and safety management, and environmental management systems is a testament to its dedication to meeting international standards.",
      "He also praised the company's reputation for delivering the right quantities of fuel to customers, saying COPEC has never received a customer complaint about PETROSOL's products or services.",
      "PETROSOL's pioneering “Full Quantity Campaign” launched in 2016, which educated consumers on how to ensure they receive the right quantities of fuel at the pump, was also highlighted by Mr. Amoah.",
      "The campaign's success in promoting transparency and accountability in the industry earned it the Marketing Campaign of the Year award at the 2017 Ghana Oil & Gas Awards.",
      "The National Petroleum Authority (NPA) has also recognized PETROSOL's commitment to excellence, with its Chief Executive, Dr. Mustapha Abdul-Hamid, praising the company's leadership and team for upholding high standards of integrity.",
      "With a network of 115 fuel stations nationwide, PETROSOL remains a trusted brand among consumers, known for its high-quality fuels and lubricants, as well as its focus on customer satisfaction.",
    ],
  },
  {
    slug: "petrosol-appoints-former-ceo-of-valco-as-its-board-chairman",
    title: "PETROSOL appoints former CEO of VALCO as its board chairman",
    publishedAt: "2024-05-20",
    categoryId: "category-leadership",
    excerpt:
      "PETROSOL has appointed the former Chief Executive Officer of Volta Aluminium Company Ltd, Daniel Acheampong, as its Board Chairman.",
    image: {
      url: "https://images.squarespace-cdn.com/content/v1/614dc35d29b10802ea248bb6/1d3f45e2-7f8e-4a94-877f-1a8a9187a7b9/Board+director.jpg",
      alt: "Daniel Acheampong, Board Chairman",
    },
    body: [
      "PETROSOL has appointed the former Chief Executive Officer of Volta Aluminium Company Ltd (VALCO) and the second-largest aluminium smelter in Sub-Saharan Africa, Daniel Acheampong, as its Board Chairman.",
      "He formally assumed the chairmanship role on Thursday, May 16, 2024.",
      "Mr. Acheampong, who spent 36 years in VALCO, playing various key roles, rose through the ranks to senior leadership and by dint of hard work, performance, professionalism, ethical conduct, and excellent leadership qualities, was appointed as the CEO of VALCO in January 2014.",
      "He served diligently for almost a decade in this position and retired at the end of July 2023.",
      "Before becoming the CEO, he served as the Deputy CEO in charge of Human Resources and Administration, Public, and Legal Affairs, after having previously served as the Director of Human Resources and Administration of VALCO.",
      "Mr. Acheampong is a Human Resource practitioner by profession and before assuming the role of CEO of VALCO, had had close to thirty (30) years of contemporary experience in the field of Human Resource Management and Strategic Leadership. Thus, on becoming the CEO of VALCO in 2014, he leveraged all his internal and external influences to bring about increased confidence, commitment and goodwill of major stakeholders towards VALCO's operations and in particular, towards the Company's status as the anchor for the implementation of Ghana's Integrated Aluminium industry.",
      "Before joining VALCO in 1987, Mr. Acheampong acquired considerable know-how in Contract and Administrative Law, both at the University and while working for three years as an Administrative and Investigations Officer at the Office of the Ombudsman, now the Commission for Human Rights and Administrative Justice (CHRAJ).",
      "In recognition of Mr. Acheampong's outstanding contribution to VALCO, a new state-of-the-art steam boiler which VALCO commissioned in March 2024, was named after him by the company.",
      "In the Ghanaian business community, Mr Acheampong is highly respected, as he served as the President of the Ghana Employers' Association (GEA) from 2018 to 2024 (6 years), after having previously served as the first vice president.",
      "He also served as the President of the Institute of Human Resource Management Practitioners, Ghana (IHRMP) from 2007-2011 (4 years), having previously served as the Institute's Vice-President.",
      "He is also highly respected by key players in the global aluminium smelter and allied industries.",
      "Mr. Acheampong is a recipient of some high-profile awards and was inducted into the Corporate Ghana Hall of Fame in March 2022. He also received the Ghana Business Leaders Life Time Achievement Award in September 2023.",
      "Mr. Acheampong brings to the PETROSOL Board a wealth of strategic leadership qualities, focused on performance or results, as productivity occupies a pride of place in his heart.",
      "Having successfully served on various boards of some key organizations, he will be bringing those experiences to guide the Board of PETROSOL to ensure the achievement of the company's strategic objectives.",
      "Some of the Boards/Councils/Commissions he served on include Member, Board of Directors of VALCO; Chairman, Council of the Ghana Employers Association; Chairman, Council of the Institute of Human Resource Management Practitioners, Ghana (IHRMP); Member, National Tripartite Committee; and Member/Vice Chairman of the National Labour Commission (NLC), where he served for 12 years as a Commissioner of the NLC.",
      "He is currently serving a second term on the Board of Trustees of the Social Security and National Insurance Trust (SSNIT) as well as on the Boards of some other private firms.",
      "Mr. Acheampong graduated with a First Class Honours Degree in Business Administration from the University of Ghana Business School, (UGBS) in 1984, majoring in Management.",
      "With his wealth of contemporary experience in Strategic Human Resource Management and Leadership, Mr Acheampong holds a global perspective of issues, given his solid professional/executive post-graduate credentials obtained from the Business Schools of the University of Michigan, Harvard University and the Centre for Creative Leadership, all in the United States of America.",
      "With productivity so dear to him, he also had a stint in Productivity studies at the Botswana National Institute of Productivity.",
      "Commenting on his appointment, Mr Acheampong said, “It is a great honour to be appointed to chair the Board of PETROSOL. Having accepted the challenge of serving on the Board, I wish on behalf of the team, to assure the Shareholders and all Stakeholders that we will do whatever it legitimately takes to positively transform the company to take its rightful place on the Ghanaian market and beyond.”",
      "He further stated that, “Continuous improvement in the Corporate World is the name of the game” and that “all hands should be on deck as we move into the Change Management or Transformation mode.”",
      "The former Chief Executive Officer of PETROSOL, Michael Bozumbil, said “We are delighted to have such a distinguished corporate leader to chair the reconstituted Board of PETROSOL, as it oversees the implementation of the company's strategic plan for the next decade. This is because, besides the immeasurable wealth of experience he brings on board, his values perfectly align with PETROSOL's core values of integrity, ethical conduct, professionalism, passion for excellence, empathy, respect for humanity, service quality delivery, and respect for the environment.”",
      "Mr Bozumbil further stated that “I have had the privilege of working under the leadership of Mr Acheampong for over 4 years, serving also as an Executive Committee member of the Ghana Employers Association and can testify to his sterling leadership qualities, his humility, passion for good corporate governance and female leadership development, all of which are attributes dear to PETROSOL too”",
      "PETROSOL Platinum Energy Ltd, formerly PETROSOL Ghana Ltd, is a leading privately-owned Ghanaian Oil Marketing Company, operating a network of over 100 fuel stations across the country and supplying bulk consumers of petroleum products.",
    ],
  },
  {
    slug: "changes-in-petrosol-board-of-directors-1",
    title: "New addition to the PETROSOL board of directors",
    publishedAt: "2024-01-10",
    categoryId: "category-leadership",
    excerpt:
      "Mr. Willam Ntim-Boadu joined the Board of PETROSOL on 1st January 2024, a seasoned energy finance professional with about 14 years' senior leadership experience in the sector.",
    image: { url: FALLBACK_IMAGE, alt: FALLBACK_ALT },
    body: [
      "Mr. Willam Ntim-Boadu joined the Board of PETROSOL Ghana Ltd. on 1st January, 2024. He is a seasoned and well-respected energy finance professional with about 14 years' senior leadership experience in the energy sector.",
      "Mr. Ntim-Boadu is currently the Chief Executive Officer of HFields Limited, an oil services firm and also doubles as an Executive Director of Milton Group, a business information technology solutions firm. He currently serves on the Board of Ebony Oil & Gas Ltd, a bulk oil import, distribution and export company.",
      "At the national level, Mr. Ntim-Boadu, though relatively young, has been called upon to offer his expertise to address major national issues in the energy sector. Between 2016 and 2017, he was part of the team of experts whose work led to the creation of the ESLA Bond programme to address the energy sector financial crisis. Again, between June 2021 and June 2022, he was part of the three-member Interim Management Committee (IMC) appointed by the Government of Ghana and tasked with the responsibility of coming out with the strategic direction of the Tema Oil Refinery (TOR) by identifying a strategic operating partner, conducting a technical evaluation of the processing plant and managing the daily operations of the refinery within that period. This assignment was executed diligently and their report submitted to the government.",
      "Between 2017 and 2020, Mr. Ntim-Boadu doubled as the General Manager of Astra Oil Services Ltd, a bulk oil import, distribution and export company as well as the Commodity Trading & Risk Manager of Zen Petroleum Ltd, an oil marketing company, and played a key role in setting up Astra Oil Services, a sister company of Zen Petroleum, and contributed to the growth of both companies.",
      "Additionally, between 2010 and 2017, Mr. Ntim-Boudu served as the Chief Finance Officer of Sage Petroleum, a bulk oil import, distribution and export company, and played a key role in helping to raise funding for the construction of the Quantum Liquefied Petroleum Gas (LPG) Storage and Loading Infrastructure at Anokyi, near Atuabo, in the Western Region, which has contributed significantly to the financial viability of the company and national LPG supply security. Prior to that, he had served diligently as the Manager-Commerce of the same company and contributed to the company's growth.",
      "Some of the previous roles he played include, Accountant and Oil Trader, Cirrus Oil Services and Associate (Audit), KPMG, a global audit firm.",
      "He is a Chartered Accountant and a Member, Association of Certified Chartered Accountants (ACCA), UK and holds Bachelor of Science (Accounting option) degree from the University of Ghana Business School, Legon as well as a Diploma in French from the Ministry of Education, France.",
      "He has attended several courses in energy finance, oil trading and International Financial Reporting Standards (IFRS), both locally and internationally.",
    ],
  },
  {
    slug: "the-cfo-of-petrosol-ghana-receives-exemplary-leadership-award",
    title: "PETROSOL CFO receives Exemplary Leadership Award",
    publishedAt: "2023-10-18",
    categoryId: "category-awards",
    excerpt:
      "Lawrencia Himans, Chief Finance Officer of PETROSOL Platinum Energy, received the Exemplary Leadership Award at the Women in Mining and Energy Awards.",
    image: {
      url: "https://images.squarespace-cdn.com/content/v1/614dc35d29b10802ea248bb6/1697623766215-5ZYXBB47U4GWJET97VDA/LAWRENCIA+WIMEA.jpg",
      alt: "Lawrencia Himans receiving the Exemplary Leadership Award at WIMEA",
    },
    body: [
      "The Chief Finance Officer of PETROSOL Platinum Energy LTD, Lawrencia Himans, received the prestigious “Exemplary Leadership Award” at the recently held Women in Mining and Energy Awards (WIMEA).",
      "This recognition underscores Lawrencia's long years of senior leadership experience, invaluable contribution to the energy sector and professional standards as a chartered accountant. Driven by a passion for excellence and integrity, Lawrencia Himans is an accomplished chartered accountant with considerable experience in the energy sector. After receiving the award, she expressed her joy at the recognition, dedicating it to all women who work hard to drive growth in their respective organisations. She also dedicated it to all the fraternity of women at PETROSOL and to her core team within the company's Finance and Planning Department. She also expressed appreciation to her colleagues in the senior leadership team for their immense support as well as the directors for providing congenial environment for female staff. She added that “such recognitions go a long way to inspire women to break barriers and build bridges.”",
    ],
  },
  {
    slug: "petrosol-joins-lions-club-international-in-rehabilitation-project-for-adenta-aviation-road-roundabout",
    title:
      "PETROSOL joins Lions Club rehabilitation of Adenta Aviation Road Roundabout",
    publishedAt: "2023-04-29",
    categoryId: "category-csr",
    excerpt:
      "PETROSOL took part in the Lions Club International event commissioning their environment-cause project, rehabilitating the Adenta Aviation Road Roundabout.",
    image: { url: FALLBACK_IMAGE, alt: FALLBACK_ALT },
    body: [
      "PETROSOL, a leading fuel and Energy Company and a sponsor of the lions club international was proud to participate at the just ended lion's club international event in commissioning of their environment-cause project on the 28th of April 2023. This humanitarian organization aims to create positive change in communities around the world, and their latest initiative involved cleaning up and rehabilitating the Adenta Aviation Road Roundabout in Ghana.",
      "The event brought together key figures from the Lions Club International, including Lion Aba Ankrah, project committee chairperson and member of Adenta Mountain View Lions Club, Lion Leroy Ankrah, Zone 1 chairperson, and Lion Jonathan Sam, Zone 6 chairman. Representing PETROSOL was the head of human resource, Mr David Mills, and his team.",
      "In his remarks, Mr. Mills expressed his admiration for the project, stating that “it is a noble initiative that will enhance the planet and support life.” He further noted that PETROSOL is honoured to be a part of this event and is looking forward to building a mutually beneficial relationship with the Lions Club International.",
      "The commissioning of the Adenta Aviation Road Roundabout project is a significant milestone in the ongoing efforts to promote sustainable development in Ghana. It is inspiring to see companies like PETROSOL stepping up to support such initiatives that are geared towards creating a more environmentally friendly and socially responsible future for all.",
      "PETROSOL's involvement in this project is a testament to their commitment to promoting sustainable development and environmental protection. As a leading energy company in Ghana, they recognize the importance of reducing their environmental footprint and promoting sustainable practices in all areas of their business.",
      "In conclusion, the commissioning of the Adenta Aviation Road Roundabout project is a shining example of how organizations can come together to make a positive impact on their communities and the environment. PETROSOL's support for this initiative is a significant contribution to this cause, and we hope to see more organizations following their lead in promoting sustainable development and environmental protection.",
    ],
  },
  {
    slug: "petrosol-donates-ghs30000-to-support-free-surgeries-for-the-under-privileged",
    title:
      "PETROSOL donates GHS 30,000 to support free surgeries for the underprivileged",
    publishedAt: "2023-04-03",
    categoryId: "category-csr",
    excerpt:
      "PETROSOL has donated GHS 30,000 to the GRAFT Foundation, giving a second chance at a normal life to underprivileged people facing permanent disfigurement.",
    image: {
      url: "https://images.squarespace-cdn.com/content/v1/614dc35d29b10802ea248bb6/1680528319609-DGAV3HALNJRE12BHOFCJ/Petrosol+Donates+Ghs30%2C000+To+Support+Free+Surgeries+For+The++Under-Privileged.jpg",
      alt: "Lawrencia Himans, Head of Finance & Planning of PETROSOL, making the presentation to Dr. Brainerd Anani of GRAFT Foundation. Supporting her is Susuana Efua Amissah of PETROSOL (right).",
    },
    body: [
      "PETROSOL Platinum Energy, a leading Oil Marketing Company, has donated an amount of Thirty Thousand Ghana Cedis (GHS 30,000) to the Ghana Reconstruction of Anomaly and Trauma Fund (GRAFT FOUNDATION). This donation is aimed at giving a second chance at a normal life to the underprivileged who are facing permanent disfigurement and have no money to undergo surgery to correct the situation.",
      "PETROSOL Platinum has for about seven years now been financially supporting the GRAFT Foundation to transform many lives mostly in the rural and peri-urban communities through reconstructive surgery.",
      "Making this year's donation to GRAFT Foundation, Lawrencia Himans, the Head of Finance and Planning of PETROSOL, indicated that “notwithstanding the current economic challenge and its adverse impact on the company's operations, PETROSOL is still committed to its partnership” with them.",
      "Receiving the donation, Dr. Brainerd Anani, Chief Executive Officer of the Graft Foundation, “expressed the profound appreciation of the GRAFT Foundation for PETROSOL Ghana's continuous support for this worthy cause.”",
      "He noted the foundation's 10th anniversary milestone and credited PETROSOL's multi-year backing with enabling their progress.",
    ],
  },
  {
    slug: "petrosol-wraps-up-successful-team-bonding-session",
    title: "PETROSOL wraps up successful team bonding session",
    publishedAt: "2023-03-30",
    categoryId: "category-inside-petrosol",
    excerpt:
      "Employees of PETROSOL Head Office completed a team bonding session that brought together individuals from across departments for a day of team building.",
    image: { url: FALLBACK_IMAGE, alt: FALLBACK_ALT },
    body: [
      "The employees of PETROSOL Head Office recently completed a highly successful team bonding session that brought together individuals from across departments for a day of fun and team building activities.",
      "The event, held at the PETROSOL Head Office, featured a range of activities designed to promote teamwork, communication, and collaboration. Participants engaged in everything from trust-building exercises to outdoor games and challenges, working together to solve problems and achieve shared goals.",
      "“The team bonding session was a great opportunity for our employees to come together and build stronger relationships,” said PETROSIL CEO, Mr Michael Bozumbil. “We're always looking for ways to improve communication and collaboration across our organization, and this event was an important step in that direction.”",
      "The team bonding session was organized PETROSOL's HR department, with input from employees across the organization. The day began with an opening ceremony and introduction of facilitators, followed by a series of icebreaker activities and team-building exercises. Participants were divided into teams and challenged to complete a range of physical and mental tasks, with the focus on communication, problem-solving, and trust.",
      "“The team bonding session was an amazing experience,” said Peter Asante, a Sales Manager at PETROSOL “It was great to work with colleagues from other departments and get to know them better. I feel like I've learned a lot about myself and my colleagues through this experience.”",
      "The event ended with a closing ceremony where participants shared their reflections and feedback on the day's activities. Many expressed appreciation for the opportunity to connect with colleagues and build stronger relationships across departments.",
      "“I think the team bonding session was a huge success,” said Janet Ofori, a Marketing Executive at PETROSOL. It was a fun and engaging day that really helped us build stronger bonds as a team. I feel much more connected to my colleagues now, and I'm excited to see what we can achieve together.”",
      "Overall, the team bonding session at the PETROSOL's Head Office was a highly successful event that brought employees together in a fun and engaging way. The event is expected to have lasting positive effects on communication, collaboration, and teamwork across the organization.",
    ],
  },
  {
    slug: "petrosol-celebrates-world-health-and-safety-day-with-a-focus-on-a-safe-and-healthy-environment",
    title: "PETROSOL celebrates World Health and Safety Day",
    publishedAt: "2023-03-29",
    categoryId: "category-inside-petrosol",
    excerpt:
      "PETROSOL marked World Health and Safety Day with a virtual event on the theme “A Safe and Healthy Environment: A Fundamental Principle and Right at Work.”",
    image: { url: FALLBACK_IMAGE, alt: FALLBACK_ALT },
    body: [
      "Introduction: On the 28th of April 2023, PETROSOL, a leading energy company, marked World Health and Safety Day with a virtual event. The program, held at 10 am, cantered on the theme “A Safe and Healthy Environment: A Fundamental Principle and Right at Work.” With a strong commitment to maintaining safety protocols and ensuring a healthy workplace, PETROSOL organized the meeting to raise awareness among employees and promote a culture of safety within the organization.",
      "Promoting Compliance and Safety: The meeting commenced with the Compliance and Safety Manager addressing the entire team, emphasizing the importance of adhering to safety protocols. The manager shared valuable safety tips and highlighted the significance of compliance in maintaining a secure working environment. By ensuring compliance, employees contribute to the overall safety and well-being of themselves and their colleagues.",
      "Keynote Address by Richard Sena Hotor, Esq: The event featured a distinguished guest speaker, Richard Sena Hotor, an experienced Health, Safety, and Environment (HSE) Consultant. In his remarks, Mr. Hotor emphasized that both employers and employees have the right to work in a safe and healthy environment. He stressed the importance of taking responsibility for safeguarding these rights and encouraged everyone to actively contribute to creating a secure work environment. Mr. Hotor's insights provided valuable guidance and reinforced the significance of health and safety in the workplace.",
      "CEO's Commitment to Health and Safety: Present at the meeting was the CEO of PETROSOL, who took the opportunity to share a few remarks. The CEO expressed the company's unwavering commitment to adhering to health and safety protocols. The CEO acknowledged the responsibility of both the organization and its employees in ensuring a safe and healthy workplace. By leading by example and fostering a culture of safety, the CEO reiterated PETROSOL's dedication to providing an environment where employees can thrive without compromising their well-being.",
      "Closing Remarks by the Head of Compliance and Safety: The Head of Compliance and Safety concluded the event with a few remarks. Ensuring compliance with safety protocols is a primary responsibility of the compliance department, and the Head of Compliance and Safety reiterated the department's commitment to upholding these standards. They emphasized that adherence to safety protocols should be a shared responsibility among employers and employees alike, and that continual efforts would be made to provide the necessary resources and training to maintain a safe working environment.",
      "Conclusion: PETROSOL's celebration of World Health and Safety Day exemplifies its dedication to the well-being of its employees. The online event, held on the 28th of April 2023, brought together the entire company to emphasize the importance of a safe and healthy work environment. Through valuable insights from the Compliance and Safety Manager, the inspiring words of guest speaker Richard Sena Hotor, and the unwavering commitment of the CEO and the Head of Compliance and Safety, PETROSOL showcased its commitment to upholding health and safety protocols. By placing a strong emphasis on compliance and shared responsibility, PETROSOL is fostering a culture that prioritizes the well-being of its employees and ensuring a safe working environment for all.",
    ],
  },
  {
    slug: "petrosol-celebrates-international-womens-day",
    title: "PETROSOL celebrates International Women's Day",
    publishedAt: "2023-03-09",
    categoryId: "category-inside-petrosol",
    excerpt:
      "PETROSOL held a Women in Leadership Programme powered by the PETROSOL Women Network to mark International Women's Day, on the theme “embracing equity”.",
    image: { url: FALLBACK_IMAGE, alt: FALLBACK_ALT },
    body: [
      "International women's day (March 8) is a global day celebrating the social, economic, cultural and political achievements of women. The day also marks a call of action for accelerating women's equality.",
      "Despite the progress in recent years, women remain underrepresented in major fields. Which limits their opportunities for leadership and innovation.",
      "As we celebrate women internationally today, we recognize the need to embrace equality in all aspects of life including innovation and technology.",
      "PETROSOL held a Women in Leadership Programme to mark the international Women's day which was powered by the PETROSOL Women Network (PWN) with the theme '' embracing equity'' as part of the activities to celebrate the international Women's day",
      "The event took place at the PETROSOL Head Office on 9th march 2023 at exactly 9am. The event was graced by Dr. Mrs. Stella Agyenim- Boateng an Advisor, Office of the chief executive VRA, Former Deputy chief executive (services), VRA and The Head of Finance & Planning PETROSOL Ghana Ltd.",
      "Speaking at the event, Dr. Mrs Stella Agyenim Boateng shared her experiences over the years in attaining her success today. She encouraged women to have a balance life in everything they do.",
      "Stating emphatically that women can have a smooth running family, a successful career and above all great businesses if they are able to manage and use their time efficiently.",
      "She also encouraged all present to not only be thinkers but actors. She said, '' don't be a thinker, be an actor, thinking without acting is equivalent to not thinking at all''.",
      "She all encouraged women to set their priorities right and also be open minded in every aspect of life. She always stated that women who place value in themselves attract things of value.",
      "She did not only conclude her speech speaking to women but she also encouraged men present to give Women all the support required to enable them achieve their goals in life as we mark an international Women's day.",
      "Head of finance PETROSOL Ghana Ltd, Lawrencia Himans also shared her journey of success to all, and encouraged every women to be valuable in wherever they find themselves. She said, ''make yourself so valuable that your absence will be felt''. She also encouraged women to seek help when needed and should not be afraid to voice out their weaknesses.",
      "The event was finally brought to an end with a closing remark by the CEO. He expressed his excitement of the great presentations made and assured everyone that, the company and all men will ensure that they provide Women with all the support they can to make sure that the gap of inequity and imbalance is bridged. He also stated that everyone deserves equal opportunity and he will ensure that PETROSOL sees to women empowerment.",
    ],
  },
  {
    slug: "petrosol-marks-end-of-year-party",
    title: "PETROSOL marks end of year party",
    publishedAt: "2022-12-31",
    categoryId: "category-inside-petrosol",
    excerpt:
      "An end of year party put together by Mrs Linda Bozumbil and the human resource team, held at the PETROSOL head office.",
    image: { url: FALLBACK_IMAGE, alt: FALLBACK_ALT },
    body: [
      "It was an exciting and memorable nights of experience as the end of year party, which was initially supposed to be the PETROSOL women's connect. It was put together by Mrs Linda Bozumbil and with support of the human resource team ended joyfully at the premises of the PETROSOL head office.",
      "Indeed, it was a blissful night with good music, good food and good activities. Imagine a party graced by the Chief Executive Officer (CEO) himself in his dancing shoes and blessing the night with his gracious steps and not forgetting l how he magnificently danced with his beautiful wife, Mrs Bozumbil to complete the night.",
      "Constantly watching noble personalities display their dancing dexterity graciously was such a delightful sight to behold. Seeing how the Head of marketing took to the dancing floor along Miss Anderson was a sight that could stay in once memory for a long time. The sound of music oozing from the speakers got everyone swaying magically on their feet.",
      "The venue was parked and the activities of the night were also fun and entertaining. Seeing everyone participate in all the activities made the day so enjoyable and interactive. Everyone rocked; yes everyone was amazing. The smiles to good tunes was a memory that can't be erased.",
      "Listening to inspiring talks and opinions from Mrs Bozumbil and other personalities on how a woman should combine career with family was a life changing opportunity that one must commend.",
      "The ceremony finally concluded with a speech by the CEO, Mr Michael Bozumbil. He used the occasion to urge everyone to continue to work hard in promoting the good name of PETROSOL. He also thanked the HR for being the brain of the initiative and encouraged the women to continue to hold family in high esteem. He said “the world starts with a family and ends with a family and therefore families should not be taken for granted''. He further encouraged the men to be “pillars of support to their wives and families as they execute their family duties along with their career”.",
      "“ I will also plead with men to provide our families with the needed support in executing their duties at home as they pursue their career,” he added.",
      "Concluding, he expressed appreciation to everyone for making the ceremony a delightful and educative one.",
      "The magical moments, the exciting experience, the constant inviting tunes and blissful moments finally ended with lots of laughter, interspersed with dancing that one could not help but sing, dance, tap his or her feet or even move any part of the body.",
    ],
  },
];
