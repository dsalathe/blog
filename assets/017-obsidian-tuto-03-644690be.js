const e=`---
id: 17
title: The Great Obsidian Mystery, Tutorial Part 3
description: Master automation, daily chronicles, and visual connections. Watch Holmes and Watson advance their detective skills with templates, daily notes, and graph view analysis in this comprehensive knowledge management tutorial.
publishedDate: 2025-10-14
image: sherlockPart3.png
keywords:
  - Obsidian
  - Advanced Knowledge Management
  - Templates
  - Automation
  - Graph View
  - Daily Notes
  - Sherlock Holmes
  - Case Management
previous: 16
next: 18
---

## Tutorial Overview: Advanced Methods Revealed

Having mastered the fundamentals in Parts 1 and 2, you are now ready for the advanced techniques that separate amateur note-takers from master knowledge architects. This is Part 3 of our comprehensive five-part series that transforms scattered thinking into systematic excellence:

### Parts 1 & 2 - The Foundation (Completed):
Vault creation, markdown mastery, internal linking, DATA framework organization, and rich metadata management with images.

### Part 3 (This Tutorial) - Advanced Automation & Visualization:

**Chapter V**: The Art of Automation - _Templates that eliminate repetitive work and ensure consistency_

**Chapter VI**: The Daily Chronicle - _Systematic observation through daily notes and periodic reviews_

**Chapter VII**: The Web of Deduction - _Visualizing connections through graph view and advanced filtering_

### Part 4 - Professional Excellence:
Advanced formatting, visual organization, and dynamic intelligence networks that transform your vault into a professional investigation system.

### Part 5 - External Integration:
Web research capture with Obsidian Clipper, AI-powered analysis through Claude Desktop integration, advanced specialized plugins, and the complete transformation into an external intelligence-gathering system.

---

## Chapter V: The Art of Automation

### Templates for the Methodical Mind

"Watson," Holmes began, adjusting his pipe with the calculated precision of a surgeon preparing for his most delicate operation, "I observe you creating each new contact manually, typing the same headers, the same metadata structure, the same formatting elements repeatedly. How... tediously inefficient."

He turned to face his companion with that particular expression Watson had learned to recognize as the prelude to revolutionary insight. "Allow me to demonstrate the superior approach—automation worthy of minds that operate at our elevated level."

**Why Templates Transform Your Workflow:**

"Consider, Watson, the difference between a master craftsman and a mere laborer. The laborer repeats the same motions endlessly, wearing himself down with redundancy. The craftsman creates tools that eliminate repetition, allowing his energy to focus on creativity and analysis rather than mechanical reproduction."

"Templates in Obsidian serve this precise function—they capture the structure of our thinking, the patterns of our documentation, and reproduce them instantly. More importantly, they ensure consistency across all our case files, making systematic analysis possible."

**Installing the Templater Plugin (Step by Step):**

1. **Access Community Plugins**: Click the Settings gear icon (bottom-left), then select "Community plugins" from the left sidebar
2. **Enable Community Plugins**: If this is your first plugin, click "Turn on community plugins"
3. **Browse Available Plugins**: Click "Browse" to open the plugin marketplace
4. **Search for Templater**: Type "Templater" in the search box
5. **Install Templater**: Click on the Templater plugin by SilentVoid, then click "Install"
6. **Enable the Plugin**: After installation, toggle the Templater switch to "On"

![Templater Installation](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921173320.png)

**Creating Your Template Infrastructure:**

"First, Watson, we establish the proper repository for our templates—organization before innovation, as always."

**Step-by-Step Template Setup:**

1. **Create Templates Folder**: Right-click on \`4 Arsenal\` folder, select "New folder", name it \`templates\`
2. **Configure Templater**: Go to Settings > Templater > Template folder location, enter \`4 Arsenal/templates\`

### The People Template: Automation Excellence

"Now observe, Watson, how we shall create a template that not only generates a properly formatted person note, but intelligently prompts for information and files everything in its correct location."

**Create the People Template:**

1. **Navigate to Templates Folder**: Right click on \`4 Arsenal/templates\` and create a new note
2. **Name It**: \`People\` (this will be your template name)

**Copy This Exact Template Code:**

\`\`\`markdown
<%* 
const personName = await tp.system.prompt("Enter person's name");
const imageName = await tp.system.prompt("Enter image filename (e.g., watson.png)");
%>---
tags:
  - People
created: <% tp.file.creation_date("YYYY-MM-DD") %>
image: <% imageName %>
---

---

## <% personName %>

---

![[<% imageName %>]]

---

## Notes

---

<%* 
await tp.file.rename(personName);
await tp.file.move("/2 Assets/People/" + personName);
%>
\`\`\`

**Understanding the Template Logic:**

"Each element serves a specific purpose, Watson:"

- **\`<%* ... %>\`**: JavaScript execution blocks that run when the template activates
- **\`tp.system.prompt()\`**: Interactive prompts that request user input
- **\`<% ... %>\`**: Output blocks that insert generated content
- **\`tp.file.creation_date()\`**: Automatically inserts the current date
- **\`await tp.file.rename()\`**: Automatically renames the file with the person's name
- **\`await tp.file.move()\`**: Automatically files the note in the correct location

**Configure the Template Hotkey:**

1. **Templater Template Hotkeys**: Settings > Templater > Template hotkeys
2. **Add New Hotkey**: Click "Add new hotkey for template"
3. **Select Template**: Choose "People.md" from the dropdown
4. **Set Hotkey**: Go to Settings > Hotkeys, search "Templater: Create People"
5. **Assign Shortcut**: Click the + button and press \`Ctrl+Shift+P\`

![Template Structure](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921180850.png)

"Test it, Watson! Press \`Ctrl+Shift+P\` anywhere in your vault and watch the magic unfold. The template asks for input, fills in the details, and files everything correctly. Efficiency—the hallmark of superior method."

### The Case Begins: Delivery Template

"Now, Watson, for our current case. I require a template that creates a complete case structure automatically—not just a single note, but an entire investigation framework."

**Why Case Templates Matter:**

"Every investigation follows certain predictable patterns, Watson. There are always suspects to identify, evidence to collect, timelines to establish, and motives to determine. Rather than reinventing this structure for each case, we shall encode our investigative methodology directly into the template."

**Create the Delivery Template:**

1. **New Template**: Create a new note in \`4 Arsenal/templates\` named \`Delivery\`
2. **Copy This Advanced Template:**

\`\`\`markdown
<%* 
const deliveryName = await tp.system.prompt("Enter case name");
const priority = await tp.system.suggester(
    ["High", "Medium", "Low"], 
    ["High", "Medium", "Low"],
    false,
    "Select priority"
);
%>---
tags:
  - Delivery
  - <% deliveryName.replace(/\\s+/g, '-') %>
created: <% tp.file.creation_date("YYYY-MM-DD") %>
status: Under Investigation
priority: <% priority %>
case_name: <% deliveryName %>
---

---

# <% deliveryName %>

## Case Summary

Brief description of the <% deliveryName %> investigation.

## Objectives

- [ ] Identify primary suspects
- [ ] Gather physical evidence
- [ ] Establish timeline
- [ ] Determine motive

## Resources

### Personnel Assigned
- [[Sherlock Holmes]]
- [[Dr. John H. Watson]]

### Evidence Collected
- 

### Related Cases
- 

## Investigation Log

### <% tp.date.now("YYYY-MM-DD") %>
- Case opened

## Suspects & Persons of Interest

| Name | Motive | Alibi | Status |
|------|--------|-------|--------|
| | | | |

---

## Next Actions

- [ ] Interview primary witnesses
- [ ] Examine crime scene
- [ ] Research background information

---

<%* 
await tp.file.rename(deliveryName);
await tp.file.move("1 Delivery/" + deliveryName + "/" + deliveryName);
%>
\`\`\`

**Advanced Template Features Explained:**

- **Dynamic Tags**: \`<% deliveryName.replace(/\\s+/g, '-') %>\` creates a tag based on the case name
- **Default Values**: The priority prompt forces hardcoded choices ensuring no typos.
- **Checkbox Lists**: \`- [ ]\` creates interactive task lists for tracking progress
- **Table Structure**: Pre-formatted table for suspect information
- **Auto-Organization**: Creates both folder and file with the same name structure

**Set Up the Hotkey:**

1. **Add Template Hotkey**: Settings > Templater > Template hotkeys > Add "Delivery.md"
2. **Configure Shortcut**: Settings > Hotkeys > Search "Templater: Create Delivery" > Assign \`Ctrl+Shift+D\`

**Test Your Case Template:**

"Test it now, Watson. Press \`Ctrl+Shift+D\` and create our case: 'Vanishing Venture Capital' with priority 'High'. Observe how it creates not just a note, but an entire investigation structure."

### Meeting Documentation: The Consulting Process

"For our client interviews and case meetings, we require systematic documentation that connects seamlessly to our existing case structure."

**Why Meeting Templates Are Critical:**

"Every meeting in an investigation serves multiple purposes, Watson—information gathering, relationship building, timeline establishment, and evidence corroboration. A systematic approach ensures we capture not just what was said, but the context, the implications, and the next steps required."

**Create the Meeting Template:**

\`\`\`markdown
<%*
const projectNames = [... new Set(app.vault.getMarkdownFiles().map(f => f.path).filter(path => path.startsWith("1 Delivery")).map(path => path.split("/")[1]))].filter(name => !name.endsWith(".md"));
const projectName = (await tp.system.suggester((item) => item, projectNames, true, "Select Case"));
const chosenDate = await tp.system.prompt("Meeting date:", tp.date.now("YYYY-MM-DD"));
const meetingType = await tp.system.prompt("Meeting type (e.g., Client Interview, Evidence Review, Team Briefing)");
%>---
case: '[[<% projectName %>]]'
date: '[[<% chosenDate %>]]'
attendees:
  - "[[Sherlock Holmes]]"
  - "[[Dr. John H. Watson]]"
type: <% meetingType %>
tags:
  - Meeting
---
---

## Agenda & Objectives

- 
---
## Key Observations

- 
--- 
## Deductions & Next Steps
- [ ]

<%* 
await tp.file.rename(chosenDate + " " + meetingType);
await tp.file.move("/1 Delivery/" + projectName + "/Meetings/" + chosenDate + " " + meetingType);
%>
\`\`\`

**Advanced Template Intelligence:**

"Notice, Watson, how this template demonstrates true intelligence—it automatically discovers all existing cases and presents them as options. This is dynamic adaptation, not mere static reproduction."

- **\`app.vault.getMarkdownFiles()\`**: Scans all files in the vault
- **\`.filter(path => path.startsWith("1 Delivery"))\`**: Finds only delivery files
- **\`tp.system.suggester()\`**: Creates a selection menu from available options
- **Automatic Filing**: Places the meeting in the correct case folder structure

**Configure and Test:**

1. **Set Hotkey**: \`Ctrl+Shift+M\` for the Meeting template
2. **Create a Meeting**: Press the hotkey and create a "Client Interview" meeting
3. **Add Attendees**: Include \`[[Reginald Pumpernickel]]\` in the attendees list

**Creating Your Client:**

"Now, Watson, we must document our client properly. Use your People template (\`Ctrl+Shift+P\`) to create Reginald Pumpernickel's profile. Use the provided image."

![Reginald Profile](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/reginald.png)

**Organize Your People:**

"Finally, ensure proper organization by dragging both Sherlock Holmes and Dr. Watson notes into the \`2 Assets/People\` folder if they aren't already there. Systematic organization, Watson—it's what separates us from the common constabulary."

---

## Chapter VI: The Daily Chronicle

### Observational Records: The Foundation of Detection

"Watson," Holmes declared, settling into his leather chair with the ceremonial gravity of a high court judge, "even the most extraordinary mind benefits from daily reflection and systematic observation. The greatest detectives in history—myself included—maintain meticulous daily records not from vanity, but from scientific necessity."

He gestured toward his laptop with characteristic authority. "Today we shall establish what I call 'The Daily Chronicle'—a systematic method for capturing observations, tracking investigations, and reflecting upon our deductions in progress."

**Why Daily Notes Transform Your Thinking:**

"Consider the difference, Watson, between a mind that processes information once and discards it, versus a mind that processes, records, reflects, and connects. Daily notes serve multiple critical functions:"

1. **Pattern Recognition**: Trends emerge only when data points are systematically collected
2. **Memory Reinforcement**: Writing crystallizes thought and improves retention
3. **Connection Discovery**: Today's observation often illuminates last week's mystery
4. **Progress Tracking**: Without systematic documentation, progress becomes invisible

### Creating Your Daily Template

"We shall create a template that captures not just events, but our analytical process itself."

**Step-by-Step Daily Template Creation:**

1. **Create New Template**: In \`4 Arsenal/templates\`, create a note named \`Daily\`
2. **Enter This Template Code: (remove all \\\\)**

\`\`\`markdown
\\\`\\\`\\\`calendar-nav
\\\`\\\`\\\`

## Today's Investigations
- [ ]

## Observations
- 

## Deductions in Progress
- 
\`\`\`

**Understanding the Template Elements:**

- **\`calendar-nav\`**: Creates navigation between daily notes (requires plugin)
- **Investigations**: Active tasks and case work for the day
- **Observations**: Raw data, meetings attended, information gathered
- **Deductions**: Analysis, patterns noticed, hypotheses being tested

### Monthly Review Template

"For broader perspective, Watson, we require monthly strategic reviews that synthesize our daily observations into larger patterns."

**Create Monthly Template:**

1. **New Template**: Create \`Monthly\` in your templates folder
2. **Enter This Code: (remove all \\\\)**

\`\`\`markdown
\\\`\\\`\\\`calendar-nav
\\\`\\\`\\\`

\\\`\\\`\\\`calendar-timeline
mode: week
\\\`\\\`\\\`

## Overall review
- [ ]
\`\`\`

**Monthly Template Features:**

- **Calendar Navigation**: Links between monthly reviews
- **Weekly Timeline**: Visual overview of the month's activities
- **Strategic Review**: High-level analysis and planning

### Setting Up the Journals Plugin

"Now, Watson, we must automate the creation and organization of these daily chronicles."

**Install and Configure Journals:**

1. **Install Plugin**: Settings > Community plugins > Browse > Search "Journals" > Install and Enable
2. **Create Timeline Folders**: 
   - Right-click \`3 Timeline\` > New folder > \`Daily\`
   - Right-click \`3 Timeline\` > New folder > \`Monthly\`

**Configure Journals Plugin:**

1. **Access Journals Settings**: Settings > Journals (in the plugin section)
2. **Create Daily Journal**:
   - Click "Create new journal"
   - Name: \`Daily\`
   - Interval: \`day\`
   - Template: Select your \`Daily\` template
   - Folder: \`3 Timeline/Daily\`
   - Date Format: \`YYYY-MM-DD\`

![Journals Configuration](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921202516.png)

3. **Create Monthly Journal**:
   - Click "Create new journal"
   - Name: \`Monthly\`
   - Interval: \`month\`
   - Template: Select your \`Monthly\` template  
   - Folder: \`3 Timeline/Monthly\`
   - Date Format: \`YYYY-MM\`

### Optimizing Your Daily Workflow

**Set Up the Journals Interface:**

1. **Open Right Sidebar**: Click the right sidebar toggle (or use \`Ctrl+Shift+Right Arrow\`)
2. **Access Journals Panel**: Look for the calendar icon in the right sidebar
3. **Dock Journals at Bottom**: Drag the journals panel to the bottom of the right sidebar
4. **Add Graph View**: You can also drag the graph view to the top of the right sidebar for visual reference. More on that in the following chapter.

![Daily Workflow Setup](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922161919.png)

**Using Your Daily System:**

1. **Create Today's Note**: Click today's date in the Journals calendar
2. **Review Yesterday**: Use the calendar navigation to check previous entries
3. **Plan Tomorrow**: Add tasks and objectives for upcoming investigations

"Test it now, Watson. Click today's date and begin documenting your observations. This systematic approach will transform scattered thoughts into organized intelligence."

---

## Chapter VII: The Web of Deduction

### Visualizing Connections: The Mind Made Visible

"Behold, Watson—the web of our investigation made visible!" Holmes gestured dramatically toward his laptop screen, where a chaotic tangle of dots and lines resembled nothing so much as a spider web designed by a madman.

Watson peered at the display with obvious confusion. "Holmes, this resembles your filing system from Chapter I—chaotic and utterly unhelpful."

Holmes raised an eyebrow with characteristic disdain. "Precisely why we shall remedy this immediately. The Graph view in its raw state is like London without street signs—all the connections exist, but navigation becomes impossible."

**Why Graph View Matters:**

"The human brain, Watson, naturally thinks in networks and associations. Traditional filing systems force us to think hierarchically—everything must go in one folder or another. But real knowledge doesn't work that way. A single person might be a suspect in one case, a witness in another, and a client in a third."

"Graph view reveals these multi-dimensional relationships visually. When properly configured, it becomes a thinking aid that shows patterns invisible to linear analysis."

### Configuring Graph View for Intelligence

**Open and Access Graph View:**

1. **Open Graph View**: Click the network/graph icon in the left sidebar, or use \`Ctrl+G\`
2. **Dock Graph View**: Drag it to your right sidebar for permanent visibility

**Initial Cleanup - Excluding Noise:**

"First, Watson, we must eliminate the administrative clutter that obscures meaningful connections."

1. **Access Graph Settings**: Click the settings gear icon in the graph view
2. **Navigate to Files**: Settings > Files and links > Excluded files
3. **Manage Exclusions**: Click "Manage"
4. **Exclude Arsenal**: Add \`4 Arsenal\` to exclude templates, images, and configurations
5. **Rebuild Graph**: Click the red "Rebuild" button to refresh

### Color-Coding for Clarity

"Now, Watson, we shall apply the fundamental principle of visual organization—systematic color coding that instantly communicates meaning."

**Configure Graph Groups:**

1. **Access Graph Groups**: In Graph view settings, find "Groups" section
2. **Create Color Groups**:

   **Group 1 - Delivery (Red):**
   - Name: \`Delivery\`
   - Search Query: \`path: "1 Delivery"\`
   - Color: Red (#FF0000)

   **Group 2 - Assets (Yellow):**
   - Name: \`Assets\` 
   - Search Query: \`path:"2 Assets"\`
   - Color: Yellow (#FFFF00)

   **Group 3 - Timeline (Green):**
   - Name: \`Timeline\`
   - Search Query: \`path:"3 Timeline"\`
   - Color: Green (#00FF00)

![Graph Configuration](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922162125.png)

### Reading the Network

"Now observe, Watson, how clarity emerges from chaos!"

**What the Colors Reveal:**
- **Red Nodes**: Active cases and investigations
- **Yellow Nodes**: People, concepts, and assets
- **Green Nodes**: Timeline entries and meetings
- **Connecting Lines**: Relationships and mentions between notes

"Notice how Mr. Pumpernickel connects to our case, how our meetings link to our investigation, how personnel connect across multiple cases. This is deduction made visible—the pattern of connections that reveals the truth!"

**Interactive Analysis:**

1. **Click Nodes**: Click any node to highlight its direct connections
2. **Drag to Rearrange**: Drag nodes to better visualize clusters
3. **Zoom**: Use mouse wheel to zoom in on specific areas of interest
4. **Filter**: Use the search box to highlight specific tags or terms

"Practice this now, Watson. Click on the Vanishing Venture Capital node and observe how it connects to all relevant personnel, meetings, and evidence. The graph reveals the investigation's scope at a glance."

---

## Preparation for Advanced Excellence

"Watson," Holmes concluded with evident satisfaction, "we have now mastered the fundamental automation and visualization techniques that separate professional knowledge management from amateur note-taking."

**What You've Accomplished:**

- **Template Mastery**: Automated creation of people, cases, and meeting notes with intelligent filing
- **Daily Chronicles**: Systematic observation and reflection through structured daily and monthly reviews
- **Visual Intelligence**: Graph view configuration that reveals patterns and connections across your investigation network

**The Foundation Is Set:**

"These automation and visualization techniques form the bedrock upon which we shall build even more sophisticated systems. Our templates ensure consistency, our daily chronicles capture systematic observation, and our graph view reveals the hidden patterns that solve cases."

**Next Steps:**

"In Part 4, we shall focus on professional presentation and advanced intelligence networks—transforming your systematic foundation into a polished, dynamic system that adapts to your analytical needs and presents findings with the authority they deserve."

"The game, as they say, is afoot—and we are now properly equipped to play it at the highest level."

---

*Continue to [Part 4: Professional Excellence and Intelligence Networks] to master advanced formatting, visual organization, and dynamic databases that complete your transformation into a master detective of knowledge.*`;export{e as default};
