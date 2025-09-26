const e=`---
id: 17
title: The Great Obsidian Mystery, Tutorial Part 3
description: Master automation and daily chronicles. Watch Holmes and Watson advance their detective skills with templates and systematic observation in this comprehensive knowledge management tutorial.
publishedDate: 2025-10-14
image: sherlockPart3.png
keywords:
  - Obsidian
  - Templates
  - Automation
  - Daily Notes
  - Sherlock Holmes
  - Case Management
previous: 16
next: 18
---

## Tutorial Overview: Automation & Daily Chronicles

Having mastered the fundamentals in Parts 1 and 2, you're now ready for automation techniques that eliminate repetitive work. This is Part 3 of our six-part series:

### Parts 1 & 2 - The Foundation (Completed):
Vault creation, markdown mastery, internal linking, DATA framework organization, and rich metadata management.

### Part 3 (This Tutorial) - Automation & Daily Chronicles:

**Chapter V**: The Art of Automation - _Templates that eliminate repetitive work_

**Chapter VI**: The Daily Chronicle - _Systematic observation through daily notes_

### Upcoming Parts:
- **Part 4**: Visual Intelligence & Professional Presentation
- **Part 5**: Intelligence Networks & Dynamic Systems  
- **Part 6**: External Integration & AI-powered Analysis

---

## Chapter V: The Art of Automation

### Why Templates Transform Your Workflow

"Watson," Holmes observed, "I notice you creating each contact manually with the same headers repeatedly. Templates capture the structure of our thinking and reproduce it instantly while ensuring consistency across all case files."

> [!info] The Power of Templates
> Traditional note-taking forces you to recreate the same structure repeatedly—wasting time and introducing inconsistencies. Templates eliminate this inefficiency by capturing your best practices and reproducing them instantly. Think of templates as crystallized intelligence: once you determine the optimal structure for a type of document, you never need to recreate it manually again.

> [!question]- How do I install the Templater plugin?
> 1. **Access Community Plugins**: Settings gear → Community plugins
> 2. **Enable Community Plugins**: Click "Turn on community plugins" if first time
> 3. **Browse Available Plugins**: Click "Browse"
> 4. **Search and Install**: Find "Templater" by SilentVoid → Install → Enable
> 
> ![Templater Installation](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921173320.png)

> [!question]- How do I set up my template infrastructure?
> 1. **Create Templates Folder**: Right-click \`4 Arsenal\` → New folder → \`templates\`
> 2. **Configure Templater**: Settings → Templater → Template folder location → \`4 Arsenal/templates\`

### The People Template: Automation Excellence

"Now observe, Watson, how we shall create a template that not only generates a properly formatted person note, but intelligently prompts for information and files everything in its correct location."

> [!question]- How do I create the People template?
> 1. **Navigate**: Right-click \`4 Arsenal/templates\` → New note → Name it \`People\`
> 2. **Copy the template code** shown in the example below

> [!example]+ Complete People Template Code
> \`\`\`markdown
> <%* 
> const personName = await tp.system.prompt("Enter person's name");
> const imageName = await tp.system.prompt("Enter image filename (e.g., watson.png)");
> %>---
> tags:
>   - People
> created: <% tp.file.creation_date("YYYY-MM-DD") %>
> image: <% imageName %>
> ---
> 
> ---
> 
> ## <% personName %>
> 
> ---
> 
> ![[<% imageName %>]]
> 
> ---
> 
> ## Notes
> 
> ---
> 
> <%* 
> await tp.file.rename(personName);
> await tp.file.move("/2 Assets/People/" + personName);
> %>
> \`\`\`

> [!info]+ Understanding Template Logic
> Each element serves a specific purpose, Watson:
> 
> - **\`<%* ... %>\`**: JavaScript execution blocks that run when the template activates
> - **\`tp.system.prompt()\`**: Interactive prompts that request user input
> - **\`<% ... %>\`**: Output blocks that insert generated content
> - **\`tp.file.creation_date()\`**: Automatically inserts the current date
> - **\`await tp.file.rename()\`**: Automatically renames the file with the person's name
> - **\`await tp.file.move()\`**: Automatically files the note in the correct location

> [!question]- How do I configure the template hotkey?
> 1. **Template Hotkeys**: Settings → Templater → Template hotkeys → Add "People.md"
> 2. **Set Shortcut**: Settings → Hotkeys → Search "Templater: Create People" → Assign \`Ctrl+Shift+P\`
> 
> ![Template Structure](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921180850.png)
> 
> **Test**: Press \`Ctrl+Shift+P\` anywhere and watch the automated creation process!

### The Case Template: Complete Investigation Framework

> [!question]- How do I create the Delivery template?
> 1. **New Template**: Create note in \`4 Arsenal/templates\` named \`Delivery\`
> 2. **Copy the advanced template code** shown in the example below

> [!example]+ Complete Delivery Template Code
> \`\`\`markdown
> <%* 
> const deliveryName = await tp.system.prompt("Enter case name");
> const priority = await tp.system.suggester(
>     ["High", "Medium", "Low"], 
>     ["High", "Medium", "Low"],
>     false,
>     "Select priority"
> );
> %>---
> tags:
>   - Delivery
>   - <% deliveryName.replace(/\\s+/g, '-') %>
> created: <% tp.file.creation_date("YYYY-MM-DD") %>
> status: Under Investigation
> priority: <% priority %>
> case_name: <% deliveryName %>
> ---
> 
> ---
> 
> # <% deliveryName %>
> 
> ## Case Summary
> 
> Brief description of the <% deliveryName %> investigation.
> 
> ## Objectives
> 
> - [ ] Identify primary suspects
> - [ ] Gather physical evidence
> - [ ] Establish timeline
> - [ ] Determine motive
> 
> ## Resources
> 
> ### Personnel Assigned
> - [[Sherlock Holmes]]
> - [[Dr. John H. Watson]]
> 
> ### Evidence Collected
> - 
> 
> ### Related Cases
> - 
> 
> ## Investigation Log
> 
> ### <% tp.date.now("YYYY-MM-DD") %>
> - Case opened
> 
> ## Suspects & Persons of Interest
> 
> | Name | Motive | Alibi | Status |
> |------|--------|-------|--------|
> | | | | |
> 
> ---
> 
> ## Next Actions
> 
> - [ ] Interview primary witnesses
> - [ ] Examine crime scene
> - [ ] Research background information
> 
> ---
> 
> <%* 
> await tp.file.rename(deliveryName);
> await tp.file.move("1 Delivery/" + deliveryName + "/" + deliveryName);
> %>
> \`\`\`

> [!info]+ Advanced Template Features Explained
> - **Dynamic Tags**: \`<% deliveryName.replace(/\\s+/g, '-') %>\` creates a tag based on the case name
> - **Default Values**: The priority prompt forces hardcoded choices ensuring no typos.
> - **Checkbox Lists**: \`- [ ]\` creates interactive task lists for tracking progress
> - **Table Structure**: Pre-formatted table for suspect information
> - **Auto-Organization**: Creates both folder and file with the same name structure

> [!question]- How do I set up the Delivery template hotkey?
> 1. **Add Template Hotkey**: Settings > Templater > Template hotkeys > Add "Delivery.md"
> 2. **Configure Shortcut**: Settings > Hotkeys > Search "Templater: Create Delivery" > Assign \`Ctrl+Shift+D\`
> 
> **Test**: Press \`Ctrl+Shift+D\` and create case: 'Vanishing Venture Capital' with priority 'High'

### Meeting Documentation Template

> [!example]+ Complete Meeting Template Code
> \`\`\`markdown
> <%*
> const projectNames = [... new Set(app.vault.getMarkdownFiles().map(f => f.path).filter(path => path.startsWith("1 Delivery")).map(path => path.split("/")[1]))].filter(name => !name.endsWith(".md"));
> const projectName = (await tp.system.suggester((item) => item, projectNames, true, "Select Case"));
> const chosenDate = await tp.system.prompt("Meeting date:", tp.date.now("YYYY-MM-DD"));
> const meetingType = await tp.system.prompt("Meeting type (e.g., Client Interview, Evidence Review, Team Briefing)");
> %>---
> case: '[[<% projectName %>]]'
> date: '[[<% chosenDate %>]]'
> attendees:
>   - "[[Sherlock Holmes]]"
>   - "[[Dr. John H. Watson]]"
> type: <% meetingType %>
> tags:
>   - Meeting
> ---
> ---
> 
> ## Agenda & Objectives
> 
> - 
> ---
> ## Key Observations
> 
> - 
> --- 
> ## Deductions & Next Steps
> - [ ]
> 
> <%* 
> await tp.file.rename(chosenDate + " " + meetingType);
> await tp.file.move("/1 Delivery/" + projectName + "/Meetings/" + chosenDate + " " + meetingType);
> %>
> \`\`\`

> [!info]+ Advanced Template Intelligence
> "Notice, Watson, how this template demonstrates true intelligence—it automatically discovers all existing cases and presents them as options. This is dynamic adaptation, not mere static reproduction."
> 
> - **\`app.vault.getMarkdownFiles()\`**: Scans all files in the vault
> - **\`.filter(path => path.startsWith("1 Delivery"))\`**: Finds only delivery files
> - **\`tp.system.suggester()\`**: Creates a selection menu from available options
> - **Automatic Filing**: Places the meeting in the correct case folder structure

> [!question]- How do I configure and test the Meeting template?
> 1. **Set Hotkey**: \`Ctrl+Shift+M\` for the Meeting template
> 2. **Create a Meeting**: Press the hotkey and create a "Client Interview" meeting
> 3. **Add Attendees**: Include \`[[Reginald Pumpernickel]]\` in the attendees list

"Now, Watson, we must document our client properly. Use your People template (\`Ctrl+Shift+P\`) to create Reginald Pumpernickel's profile. Use the provided image."

![Reginald Profile](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/reginald.png)

> [!info]+ Organize Your People
> "Finally, ensure proper organization by dragging both Sherlock Holmes and Dr. Watson notes into the \`2 Assets/People\` folder if they aren't already there. Systematic organization, Watson—it's what separates us from the common constabulary."

---

## Chapter VI: The Daily Chronicle

### Systematic Observation Records

"Daily notes capture not just events, but our analytical process itself," Holmes declared. "They serve multiple critical functions: pattern recognition, memory reinforcement, connection discovery, and progress tracking."

> [!info] The Power of Daily Chronicles
> Daily notes transform scattered thoughts into systematic intelligence. They serve as your investigative memory, pattern recognition system, and progress tracker. When you review patterns across weeks or months, connections emerge that would otherwise remain hidden in the chaos of daily life.

### Creating Your Daily Template

> [!question]- How do I create my Daily template?
> 1. **Create New Template**: In \`4 Arsenal/templates\`, create note named \`Daily\`
> 2. **Enter the template code** shown in the example below

> [!example]+ Daily Template Code
> remove all \`\\\`
> \`\`\`markdown
> \\\`\\\`\\\`calendar-nav
> \\\`\\\`\\\`
> 
> ## Today's Investigations
> - [ ]
> 
> ## Observations
> - 
> 
> ## Deductions in Progress
> - 
> \`\`\`

### Monthly Review Template

> [!example]+ Monthly Template Code
> remove all \`\\\`
> \`\`\`markdown
> \\\`\\\`\\\`calendar-nav
> \\\`\\\`\\\`
> 
> \\\`\\\`\\\`calendar-timeline
> mode: week
> \\\`\\\`\\\`
> 
> ## Overall review
> - [ ]
> \`\`\`

### Setting Up the Journals Plugin

> [!question]- How do I install and configure the Journals plugin?
> **Install Plugin**:
> 1. **Install Plugin**: Settings → Community plugins → Browse → "Journals" → Install and Enable
> 
> **Create Timeline Folders**:
> 2. Right-click \`3 Timeline\` → New folder → \`Daily\`
> 3. Right-click \`3 Timeline\` → New folder → \`Monthly\`

> [!question]- How do I configure the Journals plugin settings?
> **Configure Journals Plugin:**
> 
> 1. **Access Settings**: Settings → Journals
> 2. **Create Daily Journal**:
>    - Click "Create new journal"
>    - Name: \`Daily\`
>    - Interval: \`day\`
>    - Template: Select \`Daily\` template
>    - Folder: \`3 Timeline/Daily\`
>    - Date Format: \`YYYY-MM-DD\`
> 
> ![Journals Configuration](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921202516.png)
> 
> 3. **Create Monthly Journal**:
>    - Name: \`Monthly\`, Interval: \`month\`
>    - Template: \`Monthly\`, Folder: \`3 Timeline/Monthly\`
>    - Date Format: \`YYYY-MM\`

> [!question]- How do I set up the interface for daily workflow?
> 1. **Open Right Sidebar**: \`Ctrl+Shift+Right Arrow\`
> 2. **Access Journals Panel**: Calendar icon in right sidebar
> 3. **Dock at Bottom**: Drag journals panel to bottom
> 
> ![Daily Workflow Setup](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922161919.png)
> 
> **Test**: Click today's date to create your first daily note!

---

## Professional Formatting with Callouts

Transform basic observations into professional documentation:

> [!warning] Avoid Amateur Documentation
> **Instead of:**
> \`\`\`
> Warning, Sir Pumpernickel looked too much angry
> \`\`\`
> 
> **Use Professional Callouts:**
> \`\`\`markdown
>  > [!warning] Suspicious Behavior
>  > Client displayed excessive anger during interview—performance suggests deception.
> \`\`\`

![Professional Callout Example](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922162905.png)

> [!info] Essential Callout Types
> \`\`\`markdown
>  > [!info] Information
>  > [!warning] Warning  
>  > [!success] Success
>  > [!question] Question
>  > [!quote] Quote
> \`\`\`

---

## Systematic Foundation Complete

> [!success] What You've Accomplished
> - **Template Mastery**: Automated creation with intelligent filing
> - **Daily Chronicles**: Systematic observation through structured reviews
> - **Professional Presentation**: Enhanced formatting with authority
> - **Systematic Integration**: Cohesive investigation system

From manual repetition to automated consistency, from scattered observations to systematic chronicles, from informal notes to professional documentation. You now possess the automation skills that separate the efficient detective from the overwhelmed amateur.

**Next Steps:**
Part 4 focuses on visual intelligence and professional presentation with graph view mastery, while Part 5 creates dynamic intelligence networks that adapt to your investigations.

---

*Continue to [Part 4: Visual Intelligence & Professional Presentation] to master graph view analysis and visual organization.*`;export{e as default};
