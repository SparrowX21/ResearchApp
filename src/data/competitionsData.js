/** Curated academic competitions for high school students */
export const competitionsData = [
  // Computer Science
  { id: 1, name: 'USACO', category: 'Computer Science', deadline: 'Dec 15, 2026', location: 'Online', level: 'National', prize: 'Top ranking + college recognition', description: 'USA Computing Olympiad — premier algorithmic programming contest with Bronze through Platinum divisions.', url: 'https://usaco.org' },
  { id: 2, name: 'Google Code Jam', category: 'Computer Science', deadline: 'Apr 1, 2026', location: 'Online', level: 'International', prize: 'Up to $15,000', description: 'Google\'s legendary algorithmic coding competition open to programmers worldwide.', url: 'https://codingcompetitions.withgoogle.com' },
  { id: 3, name: 'Google Solution Challenge', category: 'Computer Science', deadline: 'Mar 31, 2026', location: 'Online', level: 'International', prize: 'Up to $3,000 + mentorship', description: 'Build solutions using Google technologies for UN Sustainable Development Goals.', url: 'https://developers.google.com/community/gdsc-solution-challenge' },
  { id: 4, name: 'Congressional App Challenge', category: 'Computer Science', deadline: 'Nov 1, 2026', location: 'USA', level: 'National', prize: 'Congressional recognition', description: 'Create an app on a topic of your choice and submit to your Congressional district.', url: 'https://www.congressionalappchallenge.us' },
  { id: 5, name: 'MIT Battlecode', category: 'Computer Science', deadline: 'Jan 10, 2026', location: 'Online / Cambridge, MA', level: 'International', prize: 'Prizes + MIT finals', description: 'AI programming competition — code a bot for a real-time strategy game.', url: 'https://battlecode.org' },
  { id: 6, name: 'Codeforces Global Rounds', category: 'Computer Science', deadline: 'Rolling', location: 'Online', level: 'International', prize: 'Rating + prizes', description: 'Competitive programming on the world\'s largest CP platform with rated divisions.', url: 'https://codeforces.com' },
  { id: 7, name: 'PClassic', category: 'Computer Science', deadline: 'Nov 15, 2026', location: 'Philadelphia, PA', level: 'Regional', prize: 'Trophies + prizes', description: 'University of Pennsylvania biannual high school programming contest.', url: 'https://pclassic.org' },
  { id: 8, name: 'Meta Hacker Cup', category: 'Computer Science', deadline: 'Sep 2026', location: 'Online', level: 'International', prize: 'Cash prizes', description: 'Meta\'s annual algorithmic programming contest for students and professionals.', url: 'https://www.facebook.com/codingcompetitions/hacker-cup' },
  { id: 9, name: 'Technovation Girls', category: 'Computer Science', deadline: 'Apr 2026', location: 'Online', level: 'International', prize: 'Scholarships + mentorship', description: 'Team-based app development challenge for girls addressing community problems.', url: 'https://technovation.org' },
  { id: 10, name: 'CyberPatriot', category: 'Computer Science', deadline: 'Oct 2026', location: 'USA', level: 'National', prize: 'Recognition + scholarships', description: 'National Youth Cyber Defense Competition by the Air & Space Forces Association.', url: 'https://www.uscyberpatriot.org' },
  { id: 11, name: 'ACSL', category: 'Computer Science', deadline: 'Dec 2026', location: 'USA', level: 'National', prize: 'Medals + recognition', description: 'American Computer Science League — contests in coding, CS theory, and assembly.', url: 'https://www.acsl.org' },
  { id: 12, name: 'Bebras Challenge', category: 'Computer Science', deadline: 'Nov 2026', location: 'Online', level: 'International', prize: 'Certificates', description: 'International informatics and computational thinking challenge for all ages.', url: 'https://www.bebraschallenge.org' },

  // Science
  { id: 13, name: 'Regeneron ISEF', category: 'Science', deadline: 'Feb 1, 2026', location: 'USA', level: 'International', prize: 'Up to $75,000', description: 'World\'s largest pre-college STEM research competition.', url: 'https://www.societyforscience.org/isef/' },
  { id: 14, name: 'Science Olympiad', category: 'Science', deadline: 'Oct 1, 2026', location: 'Regional → National', level: 'National', prize: 'Medals + scholarships', description: 'Team STEM tournament with 23 events across biology, chemistry, physics, and engineering.', url: 'https://scioly.org' },
  { id: 15, name: 'Regeneron STS', category: 'Science', deadline: 'Nov 15, 2026', location: 'Washington, D.C.', level: 'National', prize: 'Up to $250,000', description: 'Nation\'s most prestigious pre-college science research competition.', url: 'https://www.societyforscience.org/regeneron-sts/' },
  { id: 16, name: 'USABO', category: 'Science', deadline: 'Feb 15, 2026', location: 'Online → National', level: 'National', prize: 'IBO team selection', description: 'USA Biology Olympiad — pathway to International Biology Olympiad.', url: 'https://www.usabo-trc.org' },
  { id: 17, name: 'USNCO', category: 'Science', deadline: 'Mar 1, 2026', location: 'Online → National', level: 'National', prize: 'IChO team selection', description: 'US National Chemistry Olympiad with local, national, and study camp rounds.', url: 'https://www.acs.org/education/olympiad.html' },
  { id: 18, name: 'USAPhO', category: 'Science', deadline: 'Jan 31, 2026', location: 'Online → National', level: 'National', prize: 'IPhO team selection', description: 'USA Physics Olympiad — premier physics competition for US high schoolers.', url: 'https://www.aapt.org/Programs/contests/usapho.cfm' },
  { id: 19, name: 'USA Astronomy Olympiad', category: 'Science', deadline: 'Jan 2026', location: 'Online', level: 'National', prize: 'IOAA team selection', description: 'National astronomy and astrophysics olympiad for high school students.', url: 'https://usaaao.org' },
  { id: 20, name: 'Envirothon', category: 'Science', deadline: 'May 2026', location: 'State → National', level: 'National', prize: 'Scholarships', description: 'Team competition testing knowledge of natural resources and environmental science.', url: 'https://envirothon.org' },
  { id: 21, name: 'Ocean Sciences Bowl', category: 'Science', deadline: 'Feb 2026', location: 'Regional → National', level: 'National', prize: 'Recognition + trips', description: 'Quiz-bowl style competition on ocean sciences hosted by NOAA.', url: 'https://nosb.org' },
  { id: 22, name: 'Brain Bee', category: 'Science', deadline: 'Jan 2026', location: 'Regional → National', level: 'International', prize: 'Recognition + travel', description: 'Neuroscience competition testing knowledge of the brain and nervous system.', url: 'https://thebrainbee.org' },
  { id: 23, name: 'ExploraVision', category: 'Science', deadline: 'Feb 2026', location: 'USA', level: 'National', prize: 'US Savings Bonds', description: 'K-12 science competition encouraging students to envision future technologies.', url: 'https://www.exploravision.org' },

  // Mathematics
  { id: 24, name: 'AMC / AIME / USAMO', category: 'Mathematics', deadline: 'Nov 1, 2026', location: 'Schools nationwide', level: 'National', prize: 'IMO team selection', description: 'AMC 10/12 → AIME → USAMO → IMO pathway — gold standard of math competitions.', url: 'https://www.maa.org/math-competitions' },
  { id: 25, name: 'MATHCOUNTS', category: 'Mathematics', deadline: 'Dec 15, 2026', location: 'Regional → National', level: 'National', prize: 'Scholarships + trophies', description: 'Middle school math competition with sprint, target, team, and countdown rounds.', url: 'https://www.mathcounts.org' },
  { id: 26, name: 'HMMT', category: 'Mathematics', deadline: 'Nov 10, 2026', location: 'Cambridge, MA', level: 'National', prize: 'Prestige + prizes', description: 'Harvard-MIT Mathematics Tournament — among the most prestigious US math contests.', url: 'https://www.hmmt.org' },
  { id: 27, name: 'Mu Alpha Theta', category: 'Mathematics', deadline: 'Rolling', location: 'USA', level: 'National', prize: 'Scholarships', description: 'National math honor society with regional and national competitions.', url: 'https://mualphatheta.org' },
  { id: 28, name: 'Math League', category: 'Mathematics', deadline: 'Rolling', location: 'USA', level: 'National', prize: 'Recognition', description: 'Challenging math contests for grades 4–12 at local through national levels.', url: 'https://mathleague.com' },
  { id: 29, name: 'ARML', category: 'Mathematics', deadline: 'Jun 2026', location: 'Regional sites', level: 'National', prize: 'Team trophies', description: 'American Regions Mathematics League — intensive team-based competition.', url: 'https://www.arml.com' },
  { id: 30, name: 'Purple Comet', category: 'Mathematics', deadline: 'Apr 2026', location: 'Online', level: 'International', prize: 'Certificates', description: 'Free online team mathematics competition for middle and high school students.', url: 'https://purplecomet.org' },

  // Engineering
  { id: 31, name: 'FIRST Robotics (FRC)', category: 'Engineering', deadline: 'Jan 5, 2026', location: 'Regional → Houston', level: 'International', prize: 'Scholarships + Dean\'s List', description: 'Build a 120-lb robot and compete in alliance matches — the Super Bowl of STEM.', url: 'https://www.firstinspires.org/robotics/frc' },
  { id: 32, name: 'VEX Robotics', category: 'Engineering', deadline: 'Rolling', location: 'Regional → Worlds', level: 'International', prize: 'World Championship', description: 'Design, build, and program robots for game-based engineering challenges.', url: 'https://www.vexrobotics.com' },
  { id: 33, name: 'TSA', category: 'Engineering', deadline: 'Oct 15, 2026', location: 'State → National', level: 'National', prize: 'Scholarships', description: 'Technology Student Association events in engineering, technology, and design.', url: 'https://tsaweb.org' },
  { id: 34, name: 'SkillsUSA', category: 'Engineering', deadline: 'State deadlines vary', location: 'State → National', level: 'National', prize: 'Medals + scholarships', description: 'Career and technical education championships in skilled trades and STEM.', url: 'https://www.skillsusa.org' },
  { id: 35, name: 'Solar Car Challenge', category: 'Engineering', deadline: 'Jul 2026', location: 'Texas', level: 'National', prize: 'Recognition', description: 'High school teams design, build, and race solar-powered vehicles.', url: 'https://www.solarcarchallenge.org' },
  { id: 36, name: 'eCYBERMISSION', category: 'Engineering', deadline: 'Mar 2026', location: 'Online', level: 'National', prize: 'Savings bonds', description: 'Army-sponsored STEM competition for grades 6–9 solving community problems.', url: 'https://www.ecybermission.com' },

  // Writing & Humanities
  { id: 37, name: 'Scholastic Art & Writing Awards', category: 'Writing & Humanities', deadline: 'Dec 1, 2026', location: 'USA', level: 'National', prize: 'Gold/Silver Keys', description: 'Longest-running recognition program for creative teens in the US.', url: 'https://www.artandwriting.org' },
  { id: 38, name: 'National History Day', category: 'Writing & Humanities', deadline: 'Mar 1, 2026', location: 'Regional → National', level: 'National', prize: 'Scholarships', description: 'Historical research projects as papers, exhibits, documentaries, or performances.', url: 'https://www.nhd.org' },
  { id: 39, name: 'National Speech & Debate', category: 'Writing & Humanities', deadline: 'Rolling', location: 'Regional → National', level: 'National', prize: 'Scholarships', description: 'Largest US academic competition — policy, LD, public forum, and speech events.', url: 'https://www.speechanddebate.org' },
  { id: 40, name: 'National Spelling Bee', category: 'Writing & Humanities', deadline: 'School level: Jan', location: 'National Harbor, MD', level: 'National', prize: '$50,000', description: 'Scripps National Spelling Bee — iconic vocabulary and spelling championship.', url: 'https://spellingbee.com' },
  { id: 41, name: 'Poetry Out Loud', category: 'Writing & Humanities', deadline: 'State: early 2026', location: 'USA', level: 'National', prize: '$20,000', description: 'National arts education program encouraging poetry memorization and performance.', url: 'https://www.poetryoutloud.org' },
  { id: 42, name: 'Model UN', category: 'Writing & Humanities', deadline: 'Rolling', location: 'Conferences nationwide', level: 'International', prize: 'Delegation awards', description: 'Simulate UN committees — diplomacy, research, and public speaking.', url: 'https://www.un.org/en/mun' },
  { id: 43, name: 'We the People', category: 'Writing & Humanities', deadline: 'State: Jan 2026', location: 'Washington, D.C.', level: 'National', prize: 'Recognition', description: 'Civics competition on the Constitution and Bill of Rights.', url: 'https://www.civiced.org/programs/wtp' },

  // Business & Economics
  { id: 44, name: 'DECA', category: 'Business & Economics', deadline: 'Nov 1, 2026', location: 'Regional → International', level: 'International', prize: 'Scholarships', description: 'Business case competitions in marketing, finance, hospitality, and entrepreneurship.', url: 'https://www.deca.org' },
  { id: 45, name: 'FBLA', category: 'Business & Economics', deadline: 'Dec 1, 2026', location: 'State → National', level: 'National', prize: 'Scholarships', description: 'Future Business Leaders of America — accounting, economics, tech, and leadership.', url: 'https://www.fbla.org' },
  { id: 46, name: 'National Economics Challenge', category: 'Business & Economics', deadline: 'Feb 1, 2026', location: 'Online → NYC', level: 'National', prize: 'Scholarships', description: 'Quiz-bowl economics competition by the Council for Economic Education.', url: 'https://www.councilforeconed.org/national-economics-challenge/' },
  { id: 47, name: 'Diamond Challenge', category: 'Business & Economics', deadline: 'Jan 15, 2026', location: 'Delaware', level: 'International', prize: 'Up to $20,000', description: 'Entrepreneurship competition for business or social venture tracks.', url: 'https://diamondchallenge.org' },
  { id: 48, name: 'Wharton Global High School Investment Competition', category: 'Business & Economics', deadline: 'Dec 2026', location: 'Online', level: 'International', prize: 'Recognition + trip', description: 'Team-based investment strategy competition run by Wharton.', url: 'https://globalyouth.wharton.upenn.edu' },
  { id: 49, name: 'Junior Achievement Company Program', category: 'Business & Economics', deadline: 'Rolling', location: 'USA', level: 'National', prize: 'Recognition', description: 'Student-run companies learning entrepreneurship and business operations.', url: 'https://www.juniorachievement.org' },

  // Arts & Design
  { id: 50, name: 'YoungArts', category: 'Arts & Design', deadline: 'Oct 2026', location: 'USA', level: 'National', prize: 'Up to $10,000', description: 'National competition for excellence in visual, literary, and performing arts.', url: 'https://youngarts.org' },
  { id: 51, name: 'National Portfolio Day', category: 'Arts & Design', deadline: 'Fall tour dates', location: 'Nationwide', level: 'National', prize: 'Portfolio reviews', description: 'Free portfolio reviews with college art program representatives.', url: 'https://nationalportfolioday.org' },
  { id: 52, name: 'Doodle for Google', category: 'Arts & Design', deadline: 'Mar 2026', location: 'USA', level: 'National', prize: 'Scholarship + feature', description: 'Annual art contest with Google homepage feature for the national winner.', url: 'https://doodles.google.com/d4g' },
  { id: 53, name: 'NAfME All-National Honor Ensembles', category: 'Arts & Design', deadline: 'Audition: spring', location: 'National', level: 'National', prize: 'Performance opportunity', description: 'Premier honor ensembles for outstanding high school musicians.', url: 'https://nafme.org' },

  // Social Sciences & Public Policy
  { id: 54, name: 'National Geographic GeoBee', category: 'Social Sciences', deadline: 'School: Dec', location: 'USA', level: 'National', prize: 'Scholarships', description: 'Geography knowledge competition for grades 4–8 (legacy program resources).', url: 'https://www.nationalgeographic.org/education' },
  { id: 55, name: 'International Public Policy Forum', category: 'Social Sciences', deadline: 'Oct 2026', location: 'Online', level: 'International', prize: '$10,000 scholarship', description: 'Debate competition on public policy issues with essay and oral rounds.', url: 'https://www.ippfdebate.com' },
  { id: 56, name: 'World Affairs Challenge', category: 'Social Sciences', deadline: 'Mar 2026', location: 'Colorado → National', level: 'National', prize: 'Recognition', description: 'Global issues problem-solving competition for middle and high school teams.', url: 'https://worldaffairschallenge.org' },
  { id: 57, name: 'Psychology Olympiad (USAPhO-Psych)', category: 'Social Sciences', deadline: 'Apr 2026', location: 'Online', level: 'National', prize: 'Recognition', description: 'Growing psychology knowledge competition for high school students.', url: 'https://www.psychologyolympiad.org' },

  // Medicine & Health
  { id: 58, name: 'HOSA-Future Health Professionals', category: 'Medicine & Health', deadline: 'State: spring', location: 'State → International', level: 'International', prize: 'Medals + scholarships', description: 'Health science competitive events and leadership for future healthcare professionals.', url: 'https://www.hosa.org' },
  { id: 59, name: 'BioGENEius Challenge', category: 'Medicine & Health', deadline: 'Apr 2026', location: 'USA', level: 'International', prize: '$7,500', description: 'Biotechnology research competition for high school students.', url: 'https://biogeneius.org' },
  { id: 60, name: 'American Heart Association CPR Challenge', category: 'Medicine & Health', deadline: 'Rolling', location: 'School-based', level: 'National', prize: 'Certification', description: 'School programs promoting CPR training and cardiac health awareness.', url: 'https://www.heart.org' },
];

export const competitionCategories = [
  'All',
  'Computer Science',
  'Science',
  'Mathematics',
  'Engineering',
  'Writing & Humanities',
  'Business & Economics',
  'Arts & Design',
  'Social Sciences',
  'Medicine & Health',
];

export const competitionLevels = ['All Levels', 'International', 'National', 'Regional'];
