projectnextech.org Rebuild Initial Prompt
---
### Project overview
- I'm rebuilding the website for Project NexTech (projectnextech.org). 
- Project NexTech (PNT) is a student-led 501(c)(3) nonprofit, founded in 2023 in San Diego, that provides free STEM education to underserved communities both in-person and online. Its mission is to inspire and support a global community of students through interactive, accessible STEM education that builds their passion to tackle real-world problems. PNT has grown to serve thousands of students across dozens of countries, powered by student volunteers who run hands-on, project-based programs in Engineering, Programming, Physics/Math, Natural Sciences, and mentoring (robotics, science fair, research). The org partners with groups like the City of San Diego (library programs), local schools, Qualcomm, Google for Nonprofits, and international STEM organizations. It's run by a student Executive Committee (operations, curriculum, outreach, analytics, software) with a Board of Directors and Board of Advisors providing oversight, and it operates mainly through Discord for volunteer coordination, funded by donations, grants, and in-kind support.
- The current projectnextech.org is a React site with five pages (Home, About, Programs, Team, Contribute, Join) hosted on GitHub Pages with a custom domain. It covers the basics — mission, program catalog, team/governance structure, partners, and volunteer/donation entry points — but relies on embedded Google Forms, Sheets, and a Discord widget rather than custom-built tools, and has weak mobile UI/UX. It's a scaled-down version of an originally more ambitious plan, built with limited prior LLM-assisted development capacity.
- The redesign aims to rebuild the site with a cleaner, more polished design and significantly improved mobile experience, closer to an earlier, more ambitious layout concept than the current live site. It will expand functionality beyond the current embeds — including a real program finder, a clearer Volunteers page, a Management page for governance/financial transparency, and a member Dashboard with Google login tied to volunteer records — while keeping the site's information architecture and navigation more intuitive. The project is being pursued primarily as a hands-on exploration of Claude Code, with Daniel and Ishan set to inherit and maintain the site afterward.
- This is a Vite + React project, already scaffolded in this folder, with git initialized and pushed to GitHub at https://github.com/SRCPloetoe/pnt-site. Linter: ESLint (default Vite config). Styling approach: Tailwind CSS.
### Design inspiration
- I want the visual and structural style to draw from these sites, referencing their layout patterns, not exact visuals:
	- https://web.mit.edu/ — The landing page that easily directs people to whichever part of the site they need to go to, the easy-to-read font, the concise navbar and footer, and the cursor state change depending on what it's hovering over.
	- https://usaco.guide/ — The minimalist/straightforward aspect of this site is something I want to continue, along with the organization of the navbar, font choice, and usage of easily comprehensible icons/symbols.
	- https://projectnextech.org/ — This is our current site. The new one should be formatted similarly to this one with a familiar color scheme and layout so that people can easily figure out how to navigate the new one, but some design language (such as the rounded corners everywhere) or clunky elements of it when viewed in mobile mode should be replaced.
- General tone: minimal, confident, technical. Short text blocks, not long paragraphs. Real figure/photos, no stock imagery. Easy-to-comprehend icons.
- I want to have a dark/gray background with off-white/gray text, with two accent colors being PNT orange (#f24c02) and PNT blue (#4083cc). These accent colors should be used tastefully, and can have variants as needed. The main content font should be Inter. 1-2 other fonts can be used sparingly for specific accent locations, but Inter should be the main font. Anywhere that says "Project NexTech", it should be written in Inter font. Other fonts may only be used for other headings or accent text.
- All links, when hovered over, should change the mouse cursor to be a redirect icon. If the link is within the current website (such as maybe just a section or different page), the redirect cursor icon should be PNT orange. If the link is to an external site, the redirect cursor icon should be PNT blue.
- Cards should share design language throughout the whole website even if they are different types of cards.
- Anywhere on the site that shows an email that people can contact us through should be protected from AI scrapers. They should be formatted like "name [at] domain [dot] org" and should not be in a text form that can be selected or scraped by AI scrapers, and should be in an accent color.
### Site structure (information architecture)
- Top nav: (left-aligned) NT logo (home page), About, Impact, Programs, Curriculum, Leadership, Project Groups, Contribute, Volunteer; (right-aligned) Contact, Dashboard, Log In)
- Footer: (left-aligned) Terms, Policies; (center-aligned) "© 2026 Project NexTech, Inc. All rights reserved."; (right-aligned) LinkedIn icon, Instagram icon, YouTube icon, Facebook icon
- News bar: (center-aligned) text field, button with link; (right-aligned) small X button to close the news bar
- Anywhere in this prompt that I mention "article formatting" means this:
	- There is a large left column that houses text, including section headers (left-aligned, typical text colors), body text (left-aligned, typical text colors), embedded quotations or highlight text or statistics (center-aligned within this left column, using accent colors), etc.
	- There is a narrow right column that houses images (with or without captions/headings) (including carousel functionality when specifically noted), or note/footnotes. These should each be formatted to be placed between words in the main composition so it gets placed in the appropriate vertical location of the right column automatically based on where the text is in the main composition. Assume that photos in this narrow right column will be 4:3 (landscape).
	- This two-column format should begin below the main page title and subtitle
	- Anywhere in this prompt that I mention "enhanced article formatting" means that there should also be space for an author list, date, external links, etc. as if it were an actual news/blog article at the top embedded right under the subtitle but above the two-column formatting
	- This should all be able to scale down in mobile, where if the viewport width is too small, it condenses into one column, but the contents of the right column get woven into the left/main column based on the appropriate vertical location / embedded location within the composition
	- Anywhere in this prompt that I mention "article formatting" implies that main text will be in the left column and images/notes will be in the right column, as defined above
- Anywhere that says "Section header" but not within "article formatting" means that the header should be center-aligned in the page
- Any text that is placeholder text should have the word "placeholder" verbatim at some point within each paragraph of it
- Any image placeholder areas should show the filepath that it pulls from so that images can easily be added in one by one for each part of the website
- Page titles and subtitles should be left-aligned by default, unless otherwise specified
### Home
- Hero: A set of taglines that rotate out, including "Free and effective STEM education", "For students, by students", "Teaching students around the world", in that order
- Subtitle: "Student-led nonprofit organization"
- Photo or image carousel: A carousel of 10-15 16:9 (landscape) images sliding horizontally with individual captions, including our programs, volunteer highlights, slides, etc.
- Buttons: "Find a program" (Programs page), "About us" (About page), "Meet the team" (Leadership page), "Volunteer with us" (Volunteer page), "Contribute" (Contribute page), "Host a program" (Contact popup)
- Big Numbers: Below the carousel and buttons, show a few big numbers that automatically count up when the site is loaded, pulling from the Big Numbers constants, including the students taught, countries reached, volunteer hours, and programs run, with the numbers in an accent color and the other words in a normal text color, in small subtle cards
	- These Big Numbers should be loaded from a single file with all constants for the entire website that is referenced by other pages, as well. This file should have all social media links, big numbers, external links, document file paths (within the scope of the website, not a local machine), but not media (no images/videos or captions/headers for images). The content of this constants file that is ready right now is near the end of this prompt.
### About
- Page title: "What is Project NexTech?"
- Subtitle text: "We teach STEM to students and do everything else needed to make that happen through an international student-led nonprofit."
- Begin article formatting:
	- "About us" section
		- Placeholder text for a single paragraph of 4-5 sentences
		- A single carousel of 5 images with their own captions/headings
	- "History" section
		- Placeholder text for 4-6 paragraphs of 3-6 sentences each, with a couple of embedded quotations/highlight text lines in between the paragraphs
		- An image with a caption tied to some point in the first paragraph (depicting the first PNT program ever)
		- An image with a caption for each of the remaining paragraphs (each depicting different parts of PNT history)
	- "Philosophy" section
		- Placeholder text for 2-3 paragraphs of 3-5 sentences each, with a couple of embedded quotations/highlight text lines in between the paragraphs
- End article formatting
- Section header: "Our partners"
	- 12 cards displayed in a grid
		- It should be a 3-column grid when expanded fully on desktop view, and it should be able to shrink down to a single-column grid on mobile.
		- Each of the cards should have:
			- Slot for a square logo image on the left side of the card, with the rest on the right side of the card
			- Organization name (that links to an external site for each partner)
			- Partner type/tier, with these options:
				- Operating Partner (non-bold PNT orange text)
				- Supporting Partner (non-bold PNT blue text)
				- Bronze Sponsor (with bold bronze colored text)
				- Silver Sponsor (with bold silver colored text)
				- Gold Sponsor (with bold gold colored text)
			- Short description of our relationship with them of roughly 50 words
### Impact
- Page title: "See our impact"
- Subtitle text: (placeholder text for now)
- Full-width Google MyMap embed, with the height to be at least tall enough such that the full MyMap embed is a 16:9 (landscape) aspect ratio, but being taller than that being permitted if needed depending on the viewport
	- Note: "full-width" in this case means up to the left and right bounds shared with the navbar and rest of the website; I acknowledge that with wide viewports, there will be some empty space on the leftmost and rightmost parts of the page
- Big number cards, showing all 8 big numbers in their own cards, with the animation to count up to the number when the page is loaded, pulling from the constants file
- Begin article formatting:
	- "Impact on our students" section
		- Placeholder text for 3 paragraphs of 3-6 sentences each, with 2 embedded quotations/highlight text lines in between the paragraphs
		- An image with a caption for each of the first and third paragraphs
	- "Building volunteers and leaders" section
		- Placeholder text for 3 paragraphs of 3-6 sentences each, with 2 embedded quotations/highlight text lines in between the paragraphs
		- A single carousel image each with long captions (30+ words) tied to the first paragraph (these will be photos of and direct quotes from specific volunteers)
	- "Shaping better communities" section
		- Placeholder text for 2 paragraphs of 3-6 sentences each
		- An image with a caption tied to text in the middle of the first paragraph
	- "Quarterly impact reports" section
		- Placeholder text for 2 paragraphs of 3-4 sentences each
		- In place of an image in the right column, a list of all reports, titled like "Fall 2026 Impact Report" that shows an underline when hovered over and links to a PDF that opens in a new tab
### Programs
> Note: This page is different from all the others. Its main goal is to allow parents/students looking to attend a PNT class to see all the classes near them that are upcoming in an effortless way. This page should generally be center-aligned. It should kind of be like the landing page of Google Flights (https://flights.google.com).
> Note: Don't worry about the backend connection to the actual database of programs for now. Just work on the web design aspect of it that can then be connected to an actual database later on. For now, make a dummy database of dummy programs that the website pulls from (in a simple spreadsheet file). Populate the dummy database with programs from Jan 2025 to Dec 2027 at random such that there are around 300 total programs. Programs should be between 1-3 hours (inclusive) (program duration rounded to the nearest 15 minutes). This dummy database should at minimum have these columns for each program: 
> - Date
> - Course (plain text of one of the following: [1.1], [1.2], [1.3], [1.4], [1.5], [2.1], [2.2], [2.3], [2.4], [3.1], [3.2], [3.3], [3.4], [3.5], [4.1], [4.2], [4.3], [4.4], [5.1], [5.2], [5.3], [5.4]) (context: courses have their topic as the first number and specific curriculum as the second. 1 is engineering, 2 is mentoring, 3 is programming, 4 is physics/math, 5 is natural sciences)
> - Minimum grade (inclusive) (an int from 0 to 12 with 0 being Kindergarten) (every instance of a given course should have the same minimum and maximum grade when you populate the dummy database with dummy programs)
> - Maximum grade (inclusive) (an int from 0 to 12 with 0 being Kindergarten) (every instance of a given course should have the same minimum and maximum grade when you populate the dummy database with dummy programs)
> 	- Note: The Curriculum page shows two grade ranges (ideal and OK), but the Programs page only shows one. This is intentional, since the Curriculum page is meant for program hosts so they can decide for themselves which curriculum to run and which grade range to advertise, and the Programs page is meant to be as simple as possible for parents/students signing up for the courses.
> - Session (plain text of one of the following: Day 1, Day 2, Day 3, Day 4, Day 5, Day 6)
> - Start Time (times rounded to the nearest 15 minutes)
> - End Time (times rounded to the nearest 15 minutes)
> - Location (can have some dummy locations for now, but they should be real schools and libraries in the regions listed)
> - Address (should match the actual address of the real school or library from the dummy location)
> 	- Locations and address dummy locations are available in the constants section of this prompt in full. Use those location/address pairs.
> - Region (metropolitan areas, for now only from the list of plaintext: "San Diego (US 1), "Houston (US 10)", "Monterrey (MX 1)", "Dhaka (BD 1)", "Cleveland (US 19)", "Los Angeles (US 6)")
> - Signup Link (dummy links for now)
> - UID (dummy UUID v4 values stored in plaintext)
- The title, input fields, and search button should all sit in a window positioned above an interactive map. The interactive map should be partially obscured with this window sitting on top of it and should not be able to be interacted with by the user until they have clicked the "Search" button. Once they have clicked the "Search" button, the input fields should intelligently move to a corner or side of the screen, and the interactive map should be uncovered showing all of the upcoming programs as plots on the map.
- Title: "Find a program"
- Input fields:
	- Date range:
		- Input method: Date selection field for Start Date and End Date
		- Default behavior: Autofill the date ranges with the current date (inclusive) for the Start Date and the date 30 days from now (inclusive) for the End Date
		- If the date range includes dates in the past, there should be a small warning letting the user know that their date range includes dates in the past
	- Student grade: 
		- Input method: Dropdown of grades K, 1, 2, etc. through 12, with age in years also displayed for each, and an "Any" option at the top, with grades being displayed nicely in the format "2nd grade / 7-8 years old" for each one
		- Default behavior: "Any"
		- Only one grade being able to be selected at a given time
	- Subject:
		- Checkboxes of Any, Engineering, Mentoring, Programming, Physics/Math, Natural Sciences
		- Default behavior: "Any"
		- Any custom amount of subjects should be able to be selected at a given time (checkbox, not radio button). (Subjects should also be able to be unselected. The system should intelligently update to select "Any" when none or all of the other options are selected, and unselect "Any" when one or more of the other options are selected.)
		- Remember that each of those subjects correspond to a subset of the curricula.
	- Region:
		- Dropdown of each of the regions present in the dummy database, plus the "Any" option at the top
		- Default behavior: "Any"
		- Only one region being able to be selected at a given time
- A "Search" button
- After the search button is clicked, the interactive map should be updated with plots on the map for each of the programs in the database that satisfy the input criteria. For each of them, if the user clicks them, a small window should pop up located at the appropriate place in the map with the information about the program from the database except the UID, displayed in an aesthetically pleasing way with icons as appropriate (location, address, date, time range, course, session, grade range, region, signup link).
### Curriculum
- No article formatting on this page.
- There should be a slider at the top with 5 subject options (Engineering, Mentoring, Programming, Physics/Math, Natural Sciences), in that order, with a random one selected by default every time this page is loaded
	- Remember that curricula starting with 1 correspond to Engineering, 2 corresponds to Mentoring, 3 to Programming, 4 to Physics/Math, and 5 to Natural Sciences
- Inside each section:
	- Cards displayed in a grid:
		- It should be a 3-column grid when expanded fully on desktop view, and it should be able to shrink down to a single-column grid on mobile
		- The cards should be the same width as in the Leadership and Project Groups sections, but should be taller.
		- Each of the cards should have:
			- Slot for an image carousel of 5 16:9 (landscape) images (no caption/heading) center-aligned within the card
			- A course title (all of the course titles are pasted below, corresponding to the subjects)
			- A graphical representation of the age range, depicted kind of like a number line going from K to 12 with subtle markings between 5-6 (elementary/middle school transition) and 8-9 (middle/high school transition), with the ideal grade range highlighted in one color (with the points labeled), and the OK grade range highlighted in another color (with the points labeled)
				- It can be assumed that the ideal grade range will always be a subset of the OK grade range
			- A text representation of the age range, like the text "Grades 3-5 ideal, Grades 2-7 OK" with the same color scheme for the ideal and OK ranges as the graphical representation
			- A list of materials required, formatted as tags with small icons, which can be like Screen, Paper, Pens/Pencils, Whiteboard, Computers, Craft Materials, Household Materials, Water, etc.
			- A description area of around 30-50 words to give a detailed description of the course
			- Some tags for entire courses, including "NEW", "MOST POPULAR", and "STUDENT FAVORITE" that can be added to courses that are new, are very frequently run, or get very good feedback from students
			- No "Learn more" or popup mechanism
	- All cards to make:
		- Note: There should be an info icon with one of the accent colors listed at the corner of the card below the carousel. There should be two variants of the info icon. Variant 1 should state that "Each session of this curriculum can be run independently." and Variant 2 should state that "The sessions of this curriculum must be run sequentially." The courses that need the variant 1 info icon are marked with * below and the courses that need the variant 2 info icon are marked with ** below. The icon variants 1 and 2 should be different colors. The asterisks should not be included in the course title text.
		- [1.1] Maker Space Workshops*
		- [1.2] Intro to Engineering*
		- [1.3] Intro to TinkerCAD**
		- [1.4] Intro to Onshape**
		- [1.5] Intro to Electrical Engineering*
		- [2.1] Intro to Basic Robotics*
		- [2.2] Intro to Advanced Robotics**
		- [2.3] Intro to Science Fair**
		- [2.4] Intro to Research**
		- [3.1] Intro to Python**
		- [3.2] Intro to Java**
		- [3.3] Intro to Artificial Intelligence**
		- [3.4] Intro to Front-End Development**
		- [3.5] Intro to Programming with Scratch**
		- [4.1] Intro to Algebra and Geometry*
		- [4.2] Intro to Classical Physics*
		- [4.3] Intro to Electromagnetism*
		- [4.4] Intro to Astronomy*
		- [5.1] Intro to Earth Science*
		- [5.2] Intro to Biology*
		- [5.3] Intro to Chemistry*
		- [5.4] Natural Science Workshops*
### Leadership
- No article formatting on this page.
- Section header: "Executive Committee"
	- 6 cards displayed in a grid:
		- It should be a 3-column grid when expanded fully on desktop view, and it should be able to shrink down to a single-column grid on mobile.
		- Each of the cards should have:
			- Slot for a square portrait image on the left side of the card, with the rest on the right side of the card
			- Full name
			- Role/title
			- "Learn more" text with link
	- When the "Learn more" text is clicked, it should open a popup different for each card
		- The popup window for each card should include a wide left side panel which has a carousel of 4:3 (landscape) images at the top, up to 5 of them, each with a different caption, and then a large scrollable text field below it (filled with placeholder text of 3 paragraphs of 2-4 sentences each), and a narrow right side panel that has space to specify the full name, title, join date of the person, grade of the person, school of the person, region of the person, and LinkedIn profile link (optional) of the person, each with icons as needed and organized aesthetically as appropriate
		- This can all be filled with placeholder info for now
- Section header: "Department Managers"
	- 6 cards displayed in a grid, formatted the same as the "Executive Committee" section with the same cards and popups
- Section header: "Board of Directors"
	- 6 cards displayed in a grid, formatted the same as the "Executive Committee" section with the same cards and popups
- Section header: "Board of Advisors"
	- 1 card formatted the same as the "Executive Committee" section, except without a "Learn more" button and thus no popup
	- 8 half-size cards only having the full name and role (no portrait, no "Learn more")
- Section header, smaller text than the other section headers and using an accent color: "Interested in applying?"
	- Text below: "Become a volunteer, begin contributing, and complete the Leadership Application!"
		- "Become a volunteer" should link to the Volunteer page
		- "Leadership Application" should link to a Google Form, as specified in the Constants
- This will not pull from a database; this will be manually edited when it needs to be changed.
### Project Groups
- No article formatting on this page
- 20 cards displayed in a grid formatted the same as the Leadership page, but:
	- The square portrait image is now a square region image
	- Full name becomes Group name
	- Role/title becomes group code
	- Popup contents change:
		- Full name becomes Group name
		- Title becomes group code (a 4-5 digit alphanumeric code)
		- Join date gets replaced with Group lead name
		- Grade gets replaced with Group members list (each member getting a newline)
		- School gets moved up to be below group code and become School / robotics team number / group type
		- Region stays the same
		- LinkedIn profile link (optional) instead becomes group link (optional)
		- Each again have icons as needed and are organized aesthetically as appropriate
	- This can all be filled with placeholder info for now.
	- Everything else stays the same as the Leadership cards.
- This will not pull from a database; this will be manually edited when it needs to be changed.
- Section header, smaller text than the other section headers and using an accent color: "Start your own group today!"
	- Text below: "Become a volunteer, begin contributing, and complete the Project Group Creation Form!"
		- "Become a volunteer" should link to the Volunteer page
		- "Project Group Creation Form" should link to a Google Form, as specified in the Constants
### Contribute
- Page title: "Help our students further our mission"
- Subtitle text: (placeholder for now)
- Two-column formatting, each column being the same width (able to shrink down to one column in mobile view)
	- Left column: Partner with Project NexTech
		- 5+ bullet points (some using accent colors) to explain the types of partnerships we offer, such as becoming an operating partner (organizations we co-host programs with or work together with), supporting partner (in-kind sponsorship), sponsor (monetary sponsor), or program host (location that hosts our programs)
		- A line saying to email us to discuss more details if interested in partnering
		- Then a line with the email "ec [at] project nextech [dot] org" in the protected format
	- Right column: Donate to Project NexTech
		- 3 bullet points (some using accent colors) to explain why donating is important, what we do with donations, etc. very concisely, and mentioning that they're tax-deductible
		- Donorbox embed, like the one on the current website at https://projectnextech.org/contribute
### Volunteer
- Page title: Become a volunteer
- Subtitle: Join the global community of students who run Project NexTech
- Section header: "Watch the video"
	- A large, centered embed of a 16:9 (landscape) YouTube video of the Volunteer Info Video, the link to which is in the constants near the bottom of the prompt, which should autoplay when this page is loaded
- Section header: "Join our Discord server"
	- A minimalist, centered view with two items displayed in this section
		- On the left: Use the Server ID and JSON API in the constants section at the bottom of this prompt to design an embed that shows information about the Discord server
		- On the right: Show a Discord logo with a mouse cursor on top of it, and link both to https://discord.gg/6yHhgpC, the invite link of the Discord server, with a little bit of text under it that says essentially that we use Discord for our operations and that they can join at "projectnextech.org/discord" or by clicking the image above
- Begin article formatting
	- "Why volunteer" section
		- Placeholder text for 1 paragraph of 3-5 sentences with bullet points, with 1 embedded quotation/highlight text line below the paragraph
		- An image with a caption for this paragraph
	- "Ways to contribute in person" section
		- Placeholder text for 3 paragraphs of 2-3 sentences each, with 2 embedded quotations/highlight text lines between the paragraphs
		- A single carousel image each with short captions (10-20 words) tied to the first paragraph (these will be photos of and descriptions of specific things that volunteers do in person)
	- "Ways to contribute online" section
		- Placeholder text for 4 paragraphs of 2-3 sentences each, with 2 embedded quotations/highlight text lines between the paragraphs
		- A single carousel image each with short captions (10-20 words) tied to the first paragraph (these will be photos of and descriptions of specific things that volunteers do online)
- End article formatting
- Section header: "Slideshow for prospective volunteers"
	- A large, centered embed of a 16:9 (landscape) Google Slides document
	- Use this iframe embed:
```HTML
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTMRe5ohfcSK208TugQNBneEb-0pdRfM-7Z-aY55nKSu9zUDd3wyK40giYneeY5UR0wI4Uh5oulXvMB/pubembed?start=true&loop=true&delayms=3000" frameborder="0" width="1440" height="839" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
```
### Contact
> Note: This is not a full page, but rather a popup that appears on top of whatever the current page is when clicked in the top right corner of the page below the navbar (with a bit of buffer between it and the edge of the screen) (on desktop) or full-width below the navbar (with a bit of buffer between it and the edge of the screen) occupying the top of the screen (on mobile).
- In this popup, show these three email addresses and very briefly explain what each one is for (the email addresses should be colored with accent colors)
	- "info [at] project nextech [dot] org" - general inquiries about our organization
	- "programs [at] project nextech [dot] org" - schedule programs with our organization
	- "ec [at] project nextech [dot] org" - reach the management for official communication
- Below the email information in the popup, show our social media networks with links, but instead of just having the icon with a link like the footer, have both the icon/logo and text of the platform name in a subtle button with an outline that links to the appropriate external site
- Have a dynamic text field at the bottom of the popup that rotates vertically between "Connect with us on LinkedIn" and "Follow us on Instagram" and "Subscribe to our YouTube channel" to "Follow us on Facebook", each with the platform name underlined when hovered over, and each directing the user to the appropriate external link
### Dashboard
> Note: This is a unique page because it will show different information for different users, with the same formatting. In the final form of the website, the user will click the "Log In" button, get directed to Sign in with Google in a new tab, and will return to the website signed in, and then the "Dashboard" button will showcase all of this information based on an actual backend database in a clean visual dashboard. If the user clicks "Dashboard" without being signed in, clicking "Dashboard" will do the same thing as clicking "Log In". For now, because Sign in with Google hasn't been set up yet, simply make the first click of the "Dashboard" button open https://google.com in a new tab, and then the second click open the actual dashboard UI with dummy information.
- Large left panel (data visualization)
	- You have a lot of freedom to create a simple, efficient design to display all of the information in this large left data visualization panel.
	- Volunteer hours
		- By default, all of the following should be shown for all time. However, there should be a Start Date and End Date field where the user can enter a specific start and end date to index. For now, just have this as a working input field, but it doesn't need to change the actual output/data.
		- Total hours (big number)
		- Unverified / approved / denied breakdown
		- Department breakdown: 1 - Curriculum, A - Social Media, B - Business, C - Communications, D - Software, L - Leadership, Other / Miscellaneous
		- Classification breakdown: Teaching Students, Meeting Attendance, Department Task (Curriculum), Department Task (Outreach), General Leadership Task, Other (Approved)
		- Most recent 10 hour requests, each with the fields: Hours (float), Verdict ("Approved", "Unverified", or "Denied"), Department (the same options as the Department breakdown above), Date, Confirmer (plaintext), Link (plaintext), Type (same as Classification breakdown options above), Description, Time (time of logging, not of volunteering, formatted like "10/29/2025 19:09:02"), Email (email address used when logging hours)
	- Badges/milestones
		- You can make some placeholder ones up for now
	- Departments and groups
		- List of departments and groups that the member is a part of, formatted as tags with icons
	- "Get signed hours form" button (doesn't have to do anything for now)
	- Wall of links
		- Includes all of the following, grouped together in a sensible way and not taking up too much of the screen
			- **Main Links**
				1. Project NexTech Constitution — [https://docs.google.com/document/d/1posljuPV7E7J2FoKIQcij3u8srhYzqFB_ICeDiOZeOc](https://docs.google.com/document/d/1posljuPV7E7J2FoKIQcij3u8srhYzqFB_ICeDiOZeOc)
				2. projectnextech.org — [https://projectnextech.org/](https://projectnextech.org/)
				3. What is Project NexTech? — [https://docs.google.com/presentation/d/18T6YPQbsOw8G0PiixNEzHojUWB8P3dUa2w-_2eBqLao/preview?slide=id.g27ef13cd484_1_1](https://docs.google.com/presentation/d/18T6YPQbsOw8G0PiixNEzHojUWB8P3dUa2w-_2eBqLao/preview?slide=id.g27ef13cd484_1_1)
				4. Google Drive — [https://drive.google.com/drive/folders/0AGqn2uvn83zJUk9PVA](https://drive.google.com/drive/folders/0AGqn2uvn83zJUk9PVA)
				5. Google Calendar — [https://calendar.google.com/calendar/embed?src=c_23b9c73e8de272f26064ca35b0bc95d8784b0f4c0d4defa8b35c1ff6aa5ae9d7%40group.calendar.google.com](https://calendar.google.com/calendar/embed?src=c_23b9c73e8de272f26064ca35b0bc95d8784b0f4c0d4defa8b35c1ff6aa5ae9d7%40group.calendar.google.com)
				6. Program Bookings — [https://docs.google.com/spreadsheets/d/1p_Ojxthqf-Vj0SmzJf80Y8qC-L6Kn5Dcsf3zYnNJ-_s/edit?gid=1955344450#gid=1955344450](https://docs.google.com/spreadsheets/d/1p_Ojxthqf-Vj0SmzJf80Y8qC-L6Kn5Dcsf3zYnNJ-_s/edit?gid=1955344450#gid=1955344450)
				7. Signup Sheet (has many other things) — [https://docs.google.com/spreadsheets/d/1p_Ojxthqf-Vj0SmzJf80Y8qC-L6Kn5Dcsf3zYnNJ-_s/edit?gid=983163540#gid=983163540](https://docs.google.com/spreadsheets/d/1p_Ojxthqf-Vj0SmzJf80Y8qC-L6Kn5Dcsf3zYnNJ-_s/edit?gid=983163540#gid=983163540)
				8. Hours Request Form — [https://forms.gle/PneL4s3LXThXmNKt5](https://forms.gle/PneL4s3LXThXmNKt5)
				9. Enrollment Form (2026) — [https://forms.gle/Qe4hNkH8CN6eaew89](https://forms.gle/Qe4hNkH8CN6eaew89)
				10. Registration Form — [https://docs.google.com/document/d/1meRskWvpc-wMwAVi_CfZRpxyldxRjPualNhFVYsZTf4](https://docs.google.com/document/d/1meRskWvpc-wMwAVi_CfZRpxyldxRjPualNhFVYsZTf4)
				11. Post-Event Form — [https://forms.gle/GF1jbatjjcoSBWHn8](https://forms.gle/GF1jbatjjcoSBWHn8)
				12. Reimbursement Request Form — [https://forms.gle/puYRwhwpQbopSZ6E9](https://forms.gle/puYRwhwpQbopSZ6E9)
			- **Additional Links**  
				1. Anonymous Feedback Form — [https://forms.gle/KBJzrhxrG6FNEBtz7](https://forms.gle/KBJzrhxrG6FNEBtz7)  
				2. Temporary Drive Access Form — [https://forms.gle/xo5C7T5qyg5Ls4G86](https://forms.gle/xo5C7T5qyg5Ls4G86)  
				3. Project Group Creation Form — [https://forms.gle/vMXqw5e1zPH7m47b9](https://forms.gle/vMXqw5e1zPH7m47b9)  
				4. Project Group Tracker — [https://docs.google.com/spreadsheets/d/1140t67EhOkUyyc30fa_d6Ke-yQU9NVsTZlleJH4wmbA](https://docs.google.com/spreadsheets/d/1140t67EhOkUyyc30fa_d6Ke-yQU9NVsTZlleJH4wmbA)  
				5. Long-Term Plan — [https://docs.google.com/spreadsheets/d/1LW9pFXcfG8Hn3ynOLsCmPgUx6ongnfX0AFwxk7u6uZQ/edit?gid=1063408154#gid=1063408154](https://docs.google.com/spreadsheets/d/1LW9pFXcfG8Hn3ynOLsCmPgUx6ongnfX0AFwxk7u6uZQ/edit?gid=1063408154#gid=1063408154)  
				6. EC/Manager Meeting Notes — [https://docs.google.com/document/d/1O5JmypcRrpNWom3l99o4bfTekEfkyJ9VSyWKgReSEFs](https://docs.google.com/document/d/1O5JmypcRrpNWom3l99o4bfTekEfkyJ9VSyWKgReSEFs)  
				7. BD Meeting Notes — [https://docs.google.com/document/d/1pplpOTrCn5gszlLMfmhxFSYxdLQa0FA0IpZSG5ITTBI/edit?tab=t.0](https://docs.google.com/document/d/1pplpOTrCn5gszlLMfmhxFSYxdLQa0FA0IpZSG5ITTBI/edit?tab=t.0)  
				8. BA Meeting Notes — [https://docs.google.com/document/d/1pU8jV5eoH0ubx7btUl0JRbY2CsWSAPRNk5Czgma8fIg/edit?tab=t.0#heading=h.zdze73fp6uun](https://docs.google.com/document/d/1pU8jV5eoH0ubx7btUl0JRbY2CsWSAPRNk5Czgma8fIg/edit?tab=t.0#heading=h.zdze73fp6uun)  
				9. Website Team Information — [https://docs.google.com/spreadsheets/d/1SoLfeUgAwgDOGFg4oYC_vHx8lm-_RCQz_wpcS_KKfbc/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1SoLfeUgAwgDOGFg4oYC_vHx8lm-_RCQz_wpcS_KKfbc/edit?gid=0#gid=0)  
				10. Curriculum Audit Log — [https://docs.google.com/spreadsheets/d/1rjH9Cob0Wl83wui3rFLcMlSUImKYA8I1ZInBKfQqsjs](https://docs.google.com/spreadsheets/d/1rjH9Cob0Wl83wui3rFLcMlSUImKYA8I1ZInBKfQqsjs)
			- **Social / Contact**  
				1. Discord — [https://discord.gg/6yHhgpC](https://discord.gg/6yHhgpC)  
				2. LinkedIn — [https://www.linkedin.com/company/project-nextech](https://www.linkedin.com/company/project-nextech)  
				3. Instagram — [https://www.instagram.com/projectnextech/](https://www.instagram.com/projectnextech/)  
				4. YouTube — [https://www.youtube.com/channel/UCaMPwKcJ3ifjqaFoN-cqoTA](https://www.youtube.com/channel/UCaMPwKcJ3ifjqaFoN-cqoTA)  
				5. Facebook — [https://www.facebook.com/profile.php?id=61560717552719](https://www.facebook.com/profile.php?id=61560717552719)  
				6. Email — [info@projectnextech.org](mailto:info@projectnextech.org)
- Narrow right panel (personal profile)
	- At the top, a square image slot for profile photo (matching the Google account profile photo eventually, but for now, just a placeholder image)
	- Just below that, the full name of the user (for now, "Nexus Tech")
	- Just below that, the roles of the user formatted as tags (for now, "Executive Committee member", "Project group lead", "NT member")
	- School name
	- Robotics team number
	- PNT join date
### Log In
> Note: This is not a full page, but rather a link to an external "Sign in with Google" page where the user can sign in to their linked Google account to access their information in the Dashboard.
> Note: When the user is successfully signed in via Google, the navbar should say "Hi, (first name)" instead of "Log In"
- When the user clicks this link, it should take them to an external "Sign in with Google" page. When they sign in there, that should get communicated to this PNT website.
- Once the user is signed in, the "Hi, (first name)" text should not link to anything but can become accent colored when the user hovers over it, but it should not be underlined since that implies linking.
> Note: I have no idea how complicated or simple making this "Sign in with Google" mechanism is, so ask me about it in your 9 questions before getting started with coding. I'm guessing it's really complicated, and requires me to do things beyond the scope of this website itself (such as setting up Google Admin or something in a Google website like that), so just set up the frontend / web design aspects of this and make it so that the text just changes from "Log In" to "Hi, Nexus" (PNT mascot's first name) whenever it's clicked, with the external link simply being https://google.com when clicked the first time, and this behavior being reset when the website is reloaded. Consult and confirm your strategy with me first in those 9 questions before doing any programming for this part.
> Note: Being able to access the Dashboard and the text displayed in the place of "Log In" in the navbar both depend on the same boolean of whether or not the user is logged in. These are shared. For now, have the temporary behavior of these two linked, such that if the user clicks "Log In" once and gets redirected to https://google.com, then they can also just click Dashboard once to access the dummy dashboard instead of also having to click that twice.
### Terms
- Page title: "Terms and conditions"
- Begin enhanced article formatting, except with no right column; only the left column encompassing the full width:
	- 7 different sections with titles (within article formatting) (placeholders that make sense for a terms and conditions page)
	- Each section having 3-4 paragraphs of 3-5 sentences each, with embedded quotations/highlight text lines peppered throughout, filled with placeholder text
	- Fill in placeholder text for everything I didn't specify just now but that is part of "enhanced article formatting", such as the date, authors, etc.
	- A very simple contact section at the bottom directing people to email "info [at] project nextech [dot] org" for inquiries or "ec [at] project nextech [dot] org" for official communication
### Policies
- Page title: "Organization policies"
- Subtitle: "Project NexTech uses a Constitution to keep track of all of its policies"
- The rest of the page should just be a Google Docs window that shows the fully compiled and formatted Google Doc of the Constitution document, the link to which is in the constants file below
### Content/data notes for Claude Code
- Constants for the constants file
	- LinkedIn link: https://www.linkedin.com/company/project-nextech
	- Instagram link: https://www.instagram.com/projectnextech/
	- YouTube link: https://www.youtube.com/@ProjectNexTech
	- Facebook link: https://www.facebook.com/profile.php?id=61560717552719
	- Leadership Application form link (temporary/placeholder): https://forms.gle/KBJzrhxrG6FNEBtz7
	- Project Group Creation Form link: https://forms.gle/vMXqw5e1zPH7m47b9
	- Project NexTech Constitution link: https://docs.google.com/document/d/1posljuPV7E7J2FoKIQcij3u8srhYzqFB_ICeDiOZeOc
	- Volunteer Info Video link (temporary/placeholder): https://www.youtube.com/watch?v=LDU_Txk06tM
	- Big numbers
		- 2650+ students taught
		- 340+ student volunteers
		- 19+ countries reached
		- 7600+ volunteer hours
		- 22 courses made
		- $15.6k+ amount raised
		- 260+ programs run
		- 128+ regions
	- Discord server ID: 750366801430577263
	- Discord server JSON API: https://discord.com/api/guilds/750366801430577263/widget.json
	- Discord server invite link: https://discord.gg/6yHhgpC
	- Location/Address dummy pairs for the Programs page: "College-Rolando Library", "6600 Montezuma Rd, San Diego, CA 92115"; "Francis Parker School", "6501 Linda Vista Rd, San Diego, CA 92111"; "Mission Hills Branch Library", "215 W Washington St, San Diego, CA 92103"; "Rancho Penasquitos Branch Library", "13330 Salmon River Rd, San Diego, CA 92129"; "North Park Branch Library", "3795 31st St, San Diego, CA 92104"; "Rancho Bernardo Branch Library", "17110 Bernardo Center Dr, San Diego, CA 92128"; "Ocean Beach Branch Library", "4801 Santa Monica Ave, San Diego, CA 92107"; "Scripps Miramar Ranch Branch Library", "10301 Scripps Lake Dr, San Diego, CA 92131"; "Point Loma / Hervey Branch Library", "3701 Voltaire St, San Diego, CA 92107"; "Carmel Mountain Ranch Branch Library", "12095 World Trade Dr, San Diego, CA 92128"; "Mira Mesa Branch Library", "8405 New Salem St, San Diego, CA 92126"; "North Clairemont Library", "4616 Clairemont Dr, San Diego, CA 92117"; "Morning Creek Elementary", "10925 Morning Creek Dr S, San Diego, CA 92128"; "San Ysidro Library", "4235 Beyer Blvd, San Diego, CA 92173"; "University Heights Branch Library", "4193 Park Blvd, San Diego, CA 92103"; "Qualcomm Building AY", "10155 Pacific Heights Blvd, San Diego, CA 92121"; "Carmel Valley Library", "3919 Townsgate Dr, San Diego, CA 92130"; "Online", "N/A"; "Pacific Beach/Taylor Library", "4275 Cass St, San Diego, CA 92109"; "Paradise Hills Library", "5922 Rancho Hills Dr, San Diego, CA 92139"; "Canyon View Elementary", "9225 Adolphia St, San Diego, CA 92129"; "San Diego Miramar College", "10440 Black Mountain Rd, San Diego, CA 92126"; "Balboa Library", "4255 Mt. Abernathy Ave, San Diego, CA 92117"; "Cherokee Point Elementary", "3735 38th St, San Diego, CA 92105"; "Otay Mesa-Nestor Library", "3003 Coronado Ave, San Diego, CA 92154"; "Pacific View Leadership Elementary School", "6196 Childs Ave, San Diego, CA 92139"; "Madrasa", "5M83+GH, Bangladesh"; "4S Ranch Branch Library", "10433 Reserve Dr, San Diego, CA 92127"; "Pacific Highlands Ranch Library", "12911 Pacific Pl, San Diego, CA 92130"; "Chula Vista Middle School", "415 5th Ave, Chula Vista, CA 91910"; "Cardiff-by-the-Sea Library", "2081 Newcastle Ave, Cardiff, CA 92007"; "Linda Vista Library", "2160 Ulric St, San Diego, CA 92111"; "Allied Gardens/Benjamin Library", "5188 Zion Ave, San Diego, CA 92120"; "Julia Ideson Library", "500 McKinney St, Houston, TX 77002"; "Heights Neighborhood Library", "1302 Heights Blvd, Houston, TX"; "Alief-Henington Regional Library", "11903 Bellaire Blvd, Houston, TX 77072"; "Alice McKean Young Neighborhood Library", "5107 Griggs Road, Houston, TX 77021"; "Biblioteca Pública Municipal Loma Linda", "Océano Indico 414, Loma Linda, Monterrey, Nuevo León 64210"; "Biblioteca Pública Municipal Miguel de Cervantes Saavedra", "Av. Morones Prieto, Col. Buenos Aires, Monterrey, Nuevo León 64800"; "American School Foundation of Monterrey", "Ave. Ignacio Morones Prieto No. 1500, San Isidro, Monterrey, Nuevo León"; "San Roberto International School", "Real San Agustín No.4, San Pedro Garza Garcia, Nuevo León 66260"; "Cleveland Public Library", "325 Superior Ave E, Cleveland, OH 44114"; "Martin Luther King, Jr. Branch Library", "10601 Euclid Ave, Cleveland, OH 44106"; "Carnegie West Library", "1900 Fulton Rd, Cleveland, OH"; "Public Administration Library", "601 Lakeside Ave E #100, Cleveland, OH"; "Los Angeles Public Library Central", "630 W 5th St, Los Angeles, CA 90071"; "West Los Angeles Regional Branch", "11360 Santa Monica Blvd, Los Angeles, CA 90025"; "West Valley Regional Branch", "19036 Vanowen St, Reseda, CA 91335"; "Los Angeles Elementary School", "1211 S Hobart Blvd, Los Angeles, CA 90006"
- Make sub-folders in a media folder for each of the pages and sections of the pages (such as each section of each article, each team member, each curriculum, etc.) where I can input my images and name them according to a naming convention you create
- I have a favicon for the website; for now, make a dummy favicon.ico file, and I'll replace it with my favicon
### Technical requirements
- Responsive and mobile-friendly (the audience will view on desktop, laptop, tablet, and phone)
- Small-radius rounded corners or sharp corners only, no bubbly corners in the UI
- Text without buttons are fine, just having accent theme-colored text that shows an underline when you hover over it is good in most parts of the website, apart from specific instances where a "button" is needed, like the news bar, home page, etc.
- Make the whole site in dark mode, and then only once the whole site is finished, add a light mode with a toggle switch at the top right in the navbar, and set the website to automatically match the user's system settings for light/dark mode
- Routing: react-router-dom for the pages above
- Add some very simple animations peppered throughout the whole site to make it feel more put-together
- I will eventually do analytics through Cloudflare Web Analytics, but I'm not setting that up yet
- This will be deployed through GitHub Pages through my custom domain
- Add semantic HTML for all parts of the site, but no other extensive accessibility required beyond that
### What I want from this first coding session
1. Ask me at least 9 clarifying questions before starting, rather than guessing, for anything that may be ambiguous or unclear, including both technical and feel/UX aspects
2. Make a full project plan to create this whole website, highlighting both things you will make right now in this session, and things that are outside of the scope of this prompt and will be made later (such as the actual programs database, putting this live on the domain, etc.), and wait for me to read through the whole thing and approve it before continuing
3. Set up the chosen styling approach (Tailwind CSS) and routing (react-router-dom)
4. Build a shared layout for elements that appear in multiple parts of the site: navbar, footer, article format, etc.
5. Scaffold all pages with placeholder content matching the structure above, so I can see the full site shape before filling in all final images and text
6. Bugfix in real time as issues arise