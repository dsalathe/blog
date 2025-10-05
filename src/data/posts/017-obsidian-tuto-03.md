---
id: 17
title: The Great Obsidian Mystery, Tutorial Part 3
description: Master automation and daily chronicles. Watch Holmes and Watson advance their detective skills with templates and systematic observation in this comprehensive knowledge management tutorial.
publishedDate: 2025-10-14
image: sherlockPart3.png
audience: "Power Users"
keywords:
  - Obsidian
  - Sherlock Holmes
  - Tutorial
  - Templates
  - Automation
  - Daily Notes
  - Case Management
previous: 16
next: 18
---

> [!note] This tutorial uses Obsidian version v1.9.12

# Automation & Daily Chronicles

Having mastered the fundamentals in Parts 1 and 2, you're now ready for automation techniques that eliminate repetitive work. This is Part 3 of our series:

> [!tip]- Solution Part 2
> You can find [Solution Part 2](https://github.com/dsalathe/obsidian-tutorial/tree/main/obsidian-tutorial/sherlock-solution-part2).

---

## Chapter V: The Art of Automation

### Why Templates Transform Your Workflow

"Watson," Holmes observed, "I notice you creating each contact manually with the same headers repeatedly. Templates capture the structure of our thinking and reproduce it instantly while ensuring consistency across all case files."

> [!info] The Power of Templates
> Traditional note-taking forces you to recreate the same structure repeatedly—wasting time and introducing inconsistencies. Templates eliminate this inefficiency by capturing your best practices and reproducing them instantly. Think of templates as crystallized intelligence: once you determine the optimal structure for a type of document, you never need to recreate it manually again.

> [!question]- How do I install the Templater plugin?
> Obsidian provides a native `Template` plugin, but it's quite limited. You can't run custom JavaScript, and user interaction is restricted—it doesn't support prompting the user for input. Let's use the `Templater` community plugin instead.

> 
> 1. **Access Community Plugins**: Settings gear → Community plugins
> 2. **Enable Community Plugins**: Click "Turn on community plugins" if first time
> 3. **Browse Available Plugins**: Click "Browse"
> 4. **Search and Install**: Find "Templater" by SilentVoid → Install → Enable
> 
> ![Templater Installation](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921173320.png)

> [!question]- How do I set up my template infrastructure?
> 1. **Create Templates Folder**: Right-click `4 Arsenal` → New folder → `templates`
> 2. **Configure Templater**: Settings → Templater → Template folder location → `4 Arsenal/templates`

### The People Template: Automation Excellence

"Now observe, Watson, how we shall create a template that not only generates a properly formatted person note, but intelligently prompts for information and files everything in its correct location."

> [!question]- How do I create the People template?
> 1. **Navigate**: Right-click `4 Arsenal/templates` → New note → Name it `People`
> 2. **Copy the template code** shown in the example below

> [!example]+ Complete People Template Code
> ```markdown
> <%* 
> const personName = await tp.system.prompt("Enter person's name");
> const imageName = await tp.system.prompt("Enter image filename (e.g., watson-profile.png)");
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
> ```

> [!info]+ Understanding Template Logic
> Each element serves a specific purpose, Watson:
> 
> - **`<%* ... %>`**: JavaScript execution blocks that run when the template activates
> - **`tp.system.prompt()`**: Interactive prompts that request user input
> - **`<% ... %>`**: Output blocks that insert generated content
> - **`tp.file.creation_date()`**: Automatically inserts the current date
> - **`await tp.file.rename()`**: Automatically renames the file with the person's name
> - **`await tp.file.move()`**: Automatically files the note in the correct location

> [!question]- How do I configure the template hotkey?
> 1. **Template Hotkeys**: Settings → Templater → Template hotkeys → Add "People.md"
> 2. **Set Shortcut**: Settings → Hotkeys → Search "Templater: Create People" → Assign `Ctrl+Shift+P`
> 
> **Test**: Press `Ctrl+Shift+P` anywhere and watch the automated creation process!

### The Case Template: Complete Investigation Framework

> [!question]- How do I create the Delivery template?
> 1. **New Template**: Create note in `4 Arsenal/templates` named `Delivery`
> 2. **Copy the advanced template code** shown in the example below

> [!example]+ Complete Delivery Template Code
> ```markdown
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
>   - <% deliveryName.replace(/\s+/g, '-') %>
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
> ```

> [!info]+ Advanced Template Features Explained
> - **Dynamic Tags**: `<% deliveryName.replace(/\s+/g, '-') %>` creates a tag based on the case name
> - **Default Values**: The priority prompt forces hardcoded choices ensuring no typos.
> - **Checkbox Lists**: `- [ ]` creates interactive task lists for tracking progress
> - **Table Structure**: Pre-formatted table for suspect information
> - **Auto-Organization**: Creates both folder and file with the same name structure

> [!question]- How do I set up the Delivery template hotkey?
> 1. **Add Template Hotkey**: Settings > Templater > Template hotkeys > Add "Delivery.md"
> 2. **Configure Shortcut**: Settings > Hotkeys > Search "Templater: Create Delivery" > Assign `Ctrl+Shift+D`
> 
> **Test**: Press `Ctrl+Shift+D` and create case: 'Vanishing Venture Capital' with priority 'High'

> [!success]- The Result
> You should have at minimum the following structure now:
> ![First Delivery Result](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart3CreatingDelivery.png)

### Meeting Documentation Template

> [!example]+ Complete Meeting Template Code
> Create `Meeting` in `4 Arsenal/templates` and paste the following:
> ```markdown
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
> ```

> [!info]+ Advanced Template Intelligence
> "Notice, Watson, how this template demonstrates true intelligence—it automatically discovers all existing cases and presents them as options. This is dynamic adaptation, not mere static reproduction."
> 
> - **`app.vault.getMarkdownFiles()`**: Scans all files in the vault
> - **`.filter(path => path.startsWith("1 Delivery"))`**: Finds only delivery files
> - **`tp.system.suggester()`**: Creates a selection menu from available options
> - **Automatic Filing**: Places the meeting in the correct case folder structure

> [!question]- How do I configure and test the Meeting template?
> 1. **Set Hotkey**: `Ctrl+Shift+M` for the Meeting template
> 2. **Create a Meeting**: Press the hotkey and create a "Client Interview" meeting
> 3. **Add Attendees**: Include `[[Reginald Pumpernickel]]` in the attendees list

"Now, Watson, we must document our client properly. Paste the provided image anywhere in any note. Ensure it is called `reginald.png` and remove the link from the note; that should keep the image but remove the internal link. Then use your People template (`Ctrl+Shift+P`) to create Reginald Pumpernickel's profile."

![Reginald Profile](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/reginald.png)

> [!info]+ Organize Your People
> "Finally, ensure proper organization by dragging both Sherlock Holmes and Dr. Watson notes into the `2 Assets/People` folder if they aren't already there. Systematic organization, Watson—it's what separates us from the common constabulary."

> [!success]- The Result
> You should end up with this minimal structure:
> ![First Delivery Result](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart3CreatingReginald.png)

---

## Chapter VI: The Daily Chronicle

### Systematic Observation Records

"Daily notes capture not just events, but our analytical process itself," Holmes declared. "They serve multiple critical functions: pattern recognition, memory reinforcement, connection discovery, and progress tracking."

> [!info] The Power of Daily Chronicles
> Daily notes transform scattered thoughts into systematic intelligence. They serve as your investigative memory, pattern recognition system, and progress tracker. When you review patterns across weeks or months, connections emerge that would otherwise remain hidden in the chaos of daily life.

### Creating Your Daily Template

> [!question]- How do I create my Daily template?
> 1. **Create New Template**: In `4 Arsenal/templates`, create note named `Daily`
> 2. **Enter the template code** shown in the example below

> [!example]+ Daily Template Code
> ````markdown
> ```calendar-nav
> ```
> 
> ## Today's Investigations
> - [ ]
> 
> ## Observations
> - 
> 
> ## Deductions in Progress
> - 
> ````

### Monthly Review Template

 **Create New Template**: In `4 Arsenal/templates`, create note named `Monthly`

> [!example]+ Monthly Template Code
> ````markdown
> ```calendar-nav
> ```
> 
> ```calendar-timeline
> mode: week
> ```
> 
> ## Overall review
> - [ ]
> ````

### Setting Up the Journals Plugin

> [!question]- How do I install and configure the Journals plugin?
> **Install Plugin**:
> 1. **Install Plugin**: Settings → Community plugins → Browse → "Journals" → Install and Enable
> 
> **Create Timeline Folders**:
> 2. Right-click `3 Timeline` → New folder → `Daily`
> 3. Right-click `3 Timeline` → New folder → `Monthly`

> [!question]- How do I configure the Journals plugin settings?
> **Configure Journals Plugin:**
> 
> 1. **Access Settings**: Settings → Journals
> 2. **Create Daily Journal**:
>    - Click "Create new journal" (`+` icon)
>    - Name: `Daily`
>    - Interval: `day`
>    - Template: Select `4 Arsenal/templates/Daily` template
>    - Folder: `3 Timeline/Daily`
>    - Date Format: `YYYY-MM-DD`
> 
> ![Daily Settings](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart3DailySettings.png)
> 
> 3. **Click on `Journals` on left menu again**
> 4. **Create Monthly Journal**:
>    - Name: `Monthly`, Interval: `month`
>    - Template: `4 Arsenal/templates/Monthly`
>    - Folder: `3 Timeline/Monthly`
>    - Date Format: `YYYY-MM`
>
> ![Monthly Settings](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart3MonthlySettings.png)

> [!question]- How do I set up the interface for daily workflow?
> 1. **Open Right Sidebar**: Click `expand` icon top-right:
> ![Expand Button](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart3RightSidebar.png)
> 2. **Access Journals Panel**: Calendar icon in right sidebar (you may drag the expanded right sidebar a bit more to see the icon appearing)
> 3. **Dock at Bottom**: Drag journals panel to bottom
> 
> ![Daily Workflow Setup](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart3DraggingCalendar.png)
> 4. You may collapse the right sidebar again
> 
> **Test**: Click today's date to create your first daily note! Optionally, click on the month displayed on top of the calendar to create a monthly note.

> [!success]- The Result
> ![Creating First Daily](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart3CreatingDaily.png)
---

## Professional Formatting with Callouts

Transform basic observations into professional documentation. In the Daily Note you just created:

> [!warning]- Avoid Amateur Documentation
> **Instead of:**
> ```
> Warning, Sir Pumpernickel looked too much angry
> ```
> 
> **Use Professional Callouts:**
> ```markdown
>  > [!warning] Suspicious Behavior
>  > Client displayed excessive anger during interview—performance suggests deception.
> ```
> ![Professional Callout Example](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart3WarningCallout.png)

> [!tip]- Create Callouts Faster
> Callout syntax are a bit messy. Use `Ctrl+P` and write `cal` and you should be suggested `insert callout`. Press `Enter` to confirm and you can type the callout type right away to adapt it.

> [!info] Essential Callout Types
> ```markdown
>  > [!info] Information
>  > [!warning] Warning  
>  > [!success] Success
>  > [!question] Question
>  > [!quote] Quote
> ```

---

## Chapter VII: The Taxonomy of Investigation

### Understanding Information Architecture with LATCH

"Watson," Holmes observed while examining his case files, "information without organization is merely chaos. Richard Saul Wurman's LATCH principle provides us with five fundamental ways humans organize information: Location, Alphabet, Time, Category, and Hierarchy."

> [!info]- The LATCH Principle
> Every piece of information can be organized in one of five ways:
> - **Location**: Where something happens (crime scenes, witness locations)
> - **Alphabet**: Alphabetical ordering (suspect names, evidence catalog)
> - **Time**: Chronological sequence (investigation timeline, witness statements)
> - **Category**: Grouping by type (evidence types, case classifications)
> - **Hierarchy**: Importance or relationships (case priority, command structure)
>
> Tags excel at Category and Hierarchy organization, while links create Location-based connections between related concepts.

### Hierarchical Tag Systems in Action

"Now observe, Watson, how we shall transform our flat tag system into an intelligent hierarchy that mirrors the structure of our investigations."

> [!question]- How do I access the tag system?
> 1. **Open Right Sidebar**: Click the expand icon in the top-right corner
> 2. **Find Tags Panel**: Look for the tag icon in the right sidebar
> 3. **Explore Current Tags**: You should see existing tags like "Meeting", "People", and "Delivery"
> 
> ![Tag Panel Access](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart3TagPanel.png)

> [!example]+ Creating Tag Hierarchy
> 1. **Click on "Meeting" tag**: This shows all notes with the Meeting tag
> 2. **Open your Client Interview meeting**: Navigate to the meeting note you created earlier
> 3. **Edit the Tag**: In the frontmatter, change:
> 
>    ```yaml
>    tags:
>      - Meeting
>    ```
> 
>    To:
> 
>    ```yaml
>    tags:
>      - Meeting/Client-Interview/Vanishing-Venture-Capital
>    ```
> 4. **Add Contextual Tags**: Within the note content, add relevant tags using the `#` format:
> 
>    ```markdown
>    During the interview, client showed signs of #nervousness and #deception.
>    Key topics discussed: #financial-records #missing-documents #timeline
>    ```

> [!question]- Why This Order For Tag Hierarchies?
> You may ask why we chose `Meeting/Client-Interview/Vanishing-Venture-Capital` and not `Vanishing-Venture-Capital/Meeting/Client-Interview` for example or any other orders. It depends about your hierarchy needs. Do you want to first regroup everything related to the case, then the kind of note and in case of a meeting, the type of meeting? Or do you prefer to regroup all meetings together, then split them by type of meeting and finally by case? That really depends on your brain and your way to think!
>
> However I would argue that we already have the file system splitting by case first, so I find it useful to have my tags having a different representation than my filesystem, allowing me different way to retrieve information given the needs.

> [!success]- Observing Tag Hierarchy Formation
> Return to your Tags panel and witness the transformation:
> 
> ![Tag Hierarchy Formation](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart3TagHierarchy.png)
> 
> Notice how "Vanishing-Venture-Capital" now appears as a parent category with "Meeting" as a subcategory. This creates a logical hierarchy that mirrors your case structure. You may collapse the right sidebar again.

### Tags vs Links: The Strategic Difference

> [!info] When to Use Tags vs Links
> **Tags**: Best for categorization and filtering
> - Use for: status indicators, case types, evidence categories, priority levels
> - Example: `#high-priority`, `#financial-crime`, `#witness-statement`
> 
> **Links**: Best for creating relationships and connections
> - Use for: connecting people, places, cases, and concepts
> - Example: `[[Reginald Pumpernickel]]`, `[[Vanishing Venture Capital]]`, `[[Baker Street]]`

> [!quote] Holmes's Professional Opinion
> "In my experience, Watson, links prove more valuable than tags for investigative work. Links create the web of connections that reveal patterns—they show *relationships* between elements."

> [!warning] Tag Overuse Anti-Pattern
> Avoid the amateur mistake of over-tagging every concept. If you find yourself creating tags like `#person`, `#place`, or `#thing`, you're duplicating the work that links already accomplish more effectively. Reserve tags for genuine categorization needs: priority levels, status indicators, or case types.

---

## Systematic Foundation Complete

> [!success] What You've Accomplished
> - **Template Mastery**: Automated creation with intelligent filing
> - **Daily Chronicles**: Systematic observation through structured reviews
> - **Hierarchical Organization**: Strategic tag systems for categorization
> - **Professional Presentation**: Enhanced formatting with authority
> - **Systematic Integration**: Cohesive investigation system

> [!tip]- Solution Part 3
> You can find [Solution Part 3](https://github.com/dsalathe/obsidian-tutorial/tree/main/obsidian-tutorial/sherlock-solution-part3).

From manual repetition to automated consistency, from scattered observations to systematic chronicles, from flat organization to hierarchical intelligence. You now possess the automation skills that separate the efficient detective from the overwhelmed amateur.

**Next Steps:**
Part 4 focuses on visual intelligence and professional presentation with graph view mastery, while Part 5 creates dynamic intelligence networks that adapt to your investigations.