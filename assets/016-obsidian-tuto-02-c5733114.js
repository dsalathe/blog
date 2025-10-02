const e=`---
id: 16
title: The Great Obsidian Mystery, Tutorial Part 2
description: Build the perfect knowledge architecture with the DATA framework and master advanced people management. Holmes reveals his systematic approach to organizing genius while beginning the investigation into the Vanishing Venture Capital.
publishedDate: 2025-10-07
image: sherlockPart2.png
audience: "Everyone"
keywords:
  - Obsidian
  - Sherlock Holmes
  - Tutorial
  - Knowledge Management
  - Digital Organization
  - Note-taking
  - DATA Framework
  - Metadata
previous: 15
next: 17
---

> [!note] This tutorial uses Obsidian version v1.9.12

# Structure and Organization of the Vault

## Tutorial Overview: Building the Architecture of Genius
Having established the fundamental principles of networked thinking in Part 1, we now construct the proper framework for organizing knowledge with the precision of a master detective.

### Part 2 (This Tutorial) - The Architecture of Brilliance:

**Chapter III:** The Architecture of Brilliance - _The DATA framework for organizing knowledge_

**Chapter IV:** The Dramatis Personae - _Managing people and assets with metadata_

### Previously Completed (Part 1):
✅ Understanding why Obsidian revolutionizes knowledge management  
✅ Creating your first vault and mastering basic markdown  
✅ The web of knowledge through internal linking and backlinks  

### Coming Next:

**Part 3 - Advanced Investigation:** Templates for consistent documentation, graph visualization, search mastery, and beginning the Case of the Vanishing Venture Capital.

**Part 4 - Master Detective Techniques:** Dynamic databases, AI-powered analysis, web research integration, and the complete transformation into a thinking machine.

---

## Chapter III: The Architecture of Brilliance

### The DATA Framework

_(Building a Logical Folder Structure)_

Holmes stepped to his blackboard with characteristic authority, chalk in hand like a conductor's baton.

"Lesser minds organize randomly, Watson—a folder for 'Stuff,' another for 'Important Things,' perhaps one labeled 'Miscellaneous' that becomes a digital junk drawer. The superior intellect follows what I call the DATA framework."

**Why Structure Matters (Even in a Connected System):**

> [!info]+ Why do we need folders in a connected system?
> You might ask, Watson, why we need folders at all when notes can link freely. The answer lies in the fundamental difference between browsing and searching. When you browse your vault in the file explorer, you need logical groupings. When you search, the connections matter. We need both capabilities.
>
> The DATA framework serves multiple masters: your future self who must quickly locate information, colleagues who might need to navigate your system, and the natural cognitive patterns of organization that even the most brilliant minds require for efficiency.

**The DATA Framework Explained:**

**\`1 Delivery\`** - *Active work and completed projects*
- Why first? Because this is where you spend 80% of your time
- "Delivery" implies outcome-focused thinking
- Can Contains both active investigations and archived cases
- Think: "What am I delivering to the world?"

**\`2 Assets\`** - *The building blocks of knowledge*
- People, concepts, evidence, resources
- These are your reference materials—stable, reusable
- Like a well-organized library within your vault
- Think: "What resources do I draw upon repeatedly?"

**\`3 Timeline\`** - *When chronology matters more than connection*
- Daily notes, meeting records, periodic reviews
- For those moments when "when did this happen?" matters more than "how does this connect?"
- Provides a chronological backbone to complement your web of links
- Think: "What happened when, in sequence?"

**\`4 Arsenal\`** - *Tools, templates, configurations*
- The purely utilitarian elements
- Templates for consistent note-taking
- Images, attachments, configuration files
- Think: "What makes my system function smoothly?"

> [!quote] DATA Framework
> The DATA Framework is my own idea, after testing multiple general-purpose structure. I am more than happy if you want to adopt it as well! I would appreciate a brief mention if you also want to present it.

> [!question]- How do I create the four main DATA folders?
> 1. **Right-click in the file explorer** (left sidebar of Obsidian)
> 2. **Select "New folder"** from the context menu
> 3. **Name it exactly**: \`1 Delivery\` (the number ensures proper ordering regardless of alphabetical sorting)
> 4. **Repeat for**: \`2 Assets\`, \`3 Timeline\`, \`4 Arsenal\`
> 5. **Observe the result**: Your folders now appear in logical order at the top of your file list

![screenshot](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921115228.png)

"This structure," Holmes continued with evident satisfaction, "serves both personal investigation and professional consultation. Though naturally, those of ordinary intellect might require separate vaults to prevent confusion."

**For Complex Cases:** As your vault grows, you may want to add subfolders to organize different types of content within each main category.

> [!info]- Advanced Organization Structure
> "The highest complexity I recommend—and I do not make recommendations lightly—appears thus:"
> 
> \`\`\`markdown
> 📁 Holmes-Vault/
> ├── 📁 1 Delivery/
> │   ├── 📁 Active/
> │   │   └── 📁 Vanishing-Venture-Capital/
> │   │       ├── Vanishing-Venture-Capital.md
> │   │       ├── Evidence-Log.md
> │   │       └── 📁 Meetings/
> │   │           └── 2025-09-21-Client-Interview.md
> │   └── 📁 Archive/
> ├── 📁 2 Assets/
> │   ├── 📁 People/
> │   │   ├── Sherlock-Holmes.md
> │   │   └── Dr-Watson.md
> │   └── 📁 Concepts/
> │       └── Venture-Capital.md
> ├── 📁 3 Timeline/
> │   └── 📁 Daily/
> │       └── 2025-09-22.md
> └── 📁 4 Arsenal/
>     ├── 📁 Templates/
>     └── 📁 Images/
> \`\`\`

> [!question]- How do I create subfolders when needed?
> 1. **Right-click on any main folder** (like \`2 Assets\`)
> 2. **Select "New folder"**
> 3. **Create subfolders**: \`People\`, \`Concepts\` and optionally others if you feel you need it
> 4. **Keep it simple**: No more than 2-3 levels deep, or navigation becomes laborious
> 
> Remember, Watson—this structure grows organically. Start simple, add complexity only when the volume of information demands it. A system that's too complex for your current needs is as useless as no system at all.

---

### Collaboration and Vault Sharing

_(Working Together in Your Detective Agency)_

"Watson," Holmes mused, tapping his pipe thoughtfully, "occasionally even I require collaboration—though I assure you such occasions are rare. Your vault may one day need to be accessible to colleagues, collaborators, or your less brilliant future self working from another device."

**The Collaboration Landscape:**

> [!info]- Understanding Your Options
> There are three primary approaches to vault collaboration, each with distinct advantages:
>
> **1. Git-Based Approach** (For the technically inclined)
> - Free and powerful version control
> - Requires comfort with Git commands or tools like GitHub Desktop
> - Ideal for: Developers, technical teams, those who want complete control
> - Provides full history and conflict resolution
>
> _Careful about the \`.obsidian\` folder. You may be tempted to sync it too, which will automatically set up Obsidian's themes and plugin too. But some plugins create massive amount of data, you may configure your \`.gitignore\` accordingly._
> 
> **2. Obsidian Sync** (The official solution)
> - $4/month per user
> - End-to-end encryption
> - Seamless across devices
> - Ideal for: Simple multi-device access, non-technical users
> - No setup complexity
>
> **3. Third-Party Sync Services**
> - Dropbox, Google Drive, iCloud, Syncthing
> - Use existing subscriptions
> - Variable reliability with Obsidian's file structure
> - Ideal for: Personal multi-device use, budget-conscious individuals
> - May have occasional sync conflicts with rapid editing
> 
> **4. Relay (True multiplayer for Obsidian)**
> - Real-time collaborative editing—see changes as they happen
> - Based on a Conflict-Free Replicated Data Types (CRDTs) algorithm
> - Share specific folders while keeping the rest of your vault private
> - Works online and offline with smooth merging
> - Free tier available, paid plans from $10/month for teams
> - Ideal for: Active collaboration, team projects, selective sharing
> - The modern approach: Google Docs-style collaboration for Obsidian

**A Word of Caution:**

"Remember, Watson—collaboration introduces complexity. Two minds working simultaneously can create conflicts. Git handles this elegantly with merge tools. Obsidian Sync manages it automatically. Third-party services... well, they do their best."

**My Recommendation:**

"For personal use across devices: Obsidian Sync provides the least friction. For team collaboration with technical members: Git offers superior control and transparency. For casual sharing: a read-only shared folder may suffice."

**The Structure Remains Paramount:**

"Regardless of your collaboration method, maintain the DATA framework religiously. A well-organized vault collaborates smoothly; a chaotic one becomes exponentially worse when multiple minds contribute to the disorder."

## Chapter IV: The Dramatis Personae

### Cataloguing the Players

_(Creating Rich, Connected People Notes)_

"Every investigation begins with proper documentation of the principals involved," Holmes declared, settling into his leather chair. "But we shan't create mere dossiers, Watson. We shall build living documents that grow richer with each case, each interaction, each deduction."

**Why People Notes Are Different:**

"Consider the difference, Watson, between a business card filed away and a relationship actively maintained. Traditional contact management stores static information—name, title, phone number. But human relationships are dynamic, contextual, interconnected."

"In our system, each person becomes a hub of knowledge. Every case they're involved in, every insight they provide, every connection they represent—all linked, all searchable, all contributing to a deeper understanding of the human networks that surround our investigations."

### Creating Your First Person Note

We'll start by creating a note for Sherlock Holmes himself, complete with metadata and structured information.

> [!question]- How do I create a person note in the Assets folder?
> 1. **Right Click on the \`2 Assets/People\` folder** in your file explorer
> 2. **Select "New note"**
> 3. **Name it**: \`Sherlock Holmes\` (the filename automatically becomes the note title or vice-versa)

**Understanding Properties (Metadata)**

"Observe this elegant feature, Watson..." Holmes gestured to his screen. "We shall now add structured data to our note using properties—metadata that makes our information searchable and filterable."

> [!question]- How do I add properties to my note?
> 1. **Type \`---\` on the first line** of your new note
> 2. **Watch the properties panel appear** within your note
> ![screenshot](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250921144100.png)
> 3. Select \`tags\` (or create it yourself if it doesn't appear as suggestion) and in the right part write \`People\`
> 4. Click in the middle of your note to remove focus. It should render properly.

**Why Properties Matter:**

"Properties, Watson, are metadata—data about data. They allow us to store structured information that can be searched, filtered, and analyzed. Think of them as the filing system within each note, allowing for both human-readable information and machine-processable data."

"A note without properties is like a criminal without fingerprints—identifiable, but lacking the precise markers that allow for systematic categorization and retrieval."

> [!tip]- Source Mode
> You can click on the three vertical dots top right to enable \`source view\` which shows you how metadata are actually written in your Markdown. This can be very useful when trying to copy or paste markdown documents with properties.

Now let's fill in the complete content for your Sherlock Holmes note with proper metadata, image, and description.

> [!example]+ Complete Sherlock Holmes Note Template
> 1. Toggle \`Source Mode\` and remove all the content we just did.
> 2. Copy this exact format into your Sherlock Holmes note:
> 
> \`\`\`markdown
> ---
> tags:
>   - People
> created: 2025-09-21
> image: https://dsalathe.github.io/blog/Modern-Sherlock.png
> ---
>
> ---
> ![Sherlock](https://dsalathe.github.io/blog/Modern-Sherlock.png)
>
> ---
>
> \`\`\`
> 3. Toggle back the source mode for a nicer rendering.
> The world's only consulting detective. When the police are out of their depth—which is to say, always—they come to me.


**Understanding Each Element:**

- **\`tags:\`** - Categories for this note (we'll explore tagging deeply in Part 3)
- **\`created:\`** - When you first documented this person (useful for chronological reference)
- **\`image:\`** - A visual reference (essential for quick recognition)
- **The horizontal lines** - Separate metadata from content visually
- **The image embed** - \`![Alt text](URL)\` displays the image within the note
- **The description** - Free-form text about this person

You may optionally clean up all initial files such as \`Obsidian\` and \`Welcome\` by right-clicking on the file in your file tree view and select \`Delete\`.

> [!Success]- The Result
> ![First Person Result](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart2CreatingFirstPersonNote.png)

### Advanced Image Management

**The Local Image Advantage:**

"But Holmes," Watson interjected with uncharacteristic boldness, "what if that online image disappears? Surely a local image would be more reliable?"

Holmes raised an eyebrow. "Watson! For once, your paranoia serves a useful purpose. External links can break, servers can fail, and then your carefully crafted notes become studded with broken image icons. Observe the superior method."

Let's create a Dr. Watson note using a local image that we store directly in our vault.

> [!question]- How do I create a note with a local image?
> **Create Dr. Watson's Note:**
> 1. **Right-click on your "Sherlock Holmes" note** in the file explorer
> 2. **Select "Make a copy"**
> 3. **Rename the copy**: \`Dr. John H. Watson\`
> 
> **Add a Local Image:**
> 1. **Copy the image below** (Ctrl+C or right-click → Copy Image)
> 2. **Click in your Watson note** where you want the image
> 3. **Paste the image** (Ctrl+V)
> ![watson](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/watson-profile.png)

Now update the note content to use the local image reference:

> [!example]+ Dr. Watson Note Template
> Toggle on / off \`Source mode\` as we did we Sherlock and replace with the following content for the Watson's note:
> \`\`\`markdown
> ---
> tags:
>   - People
> created: 2025-09-21
> image: watson-profile.png
> ---
> ---
> ![[watson-profile.png]]
> 
> ---
> My steadfast companion and chronicler. Somewhat limited in deductive capacity, but possesses admirable loyalty and a gift for stating the obvious.
>
> \`\`\`

**Organizing Your Images:**

"Now, Watson—and pay attention—we shall organize these images properly." The image you just added is sitting loose in your main vault folder. Let's organize it systematically.

> [!question]- How do I organize my images properly?
> **Step 1: Create the Images Folder**
> 1. **Right-click on \`4 Arsenal\` folder**
> 2. **Select "New folder"**
> 3. **Name it**: \`images\`
> 
> **Step 2: Move the Image**
> 1. **Find \`watson-profile.png\`** in your main vault folder
> 2. **Drag it into** the \`4 Arsenal/images\` folder

"But Holmes! Won't that break all my references?"

Holmes smiled with insufferable smugness. "Check your note, dear fellow."

> [!Success]- The Result
> ![First Person Result](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/refs/heads/main/obsidian-tutorial/images/ScreenshotResultPart2WatsonNote.png)

Finally, let's configure Obsidian to automatically place future images in the correct location:

> [!question]- How do I set up automatic image organization?
> 1. **Click the Settings gear icon** (bottom-left corner of Obsidian)
> 2. **Navigate to**: \`Files and links\` in the left sidebar
> 3. **Find**: "Default location for new attachments"
> 4. **Select**: "In the folder specified below"
> 5. **Enter**: \`4 Arsenal/images\`
> 6. **Test it**: Delete your Watson image and paste it again.


"Now any image you paste will automatically be filed correctly. Organization without effort—though of course, such convenience could never replace genuine intelligence."

"This configuration ensures that all future images, documents, and attachments are automatically placed in your Arsenal folder, keeping your main workspace clean while ensuring everything is systematically organized."

---

## Conclusion: The Architecture Is Complete

"Superb work, Watson," Holmes declared, surveying their newly organized vault with evident satisfaction. "We have now constructed a knowledge management system that would be the envy of Scotland Yard—if they possessed the intelligence to appreciate its elegance."

> [!success]+ What You've Accomplished:
> **1. Structural Mastery**: The DATA framework provides a logical foundation that scales from simple personal use to complex professional investigations.
> 
> **2. Advanced Documentation**: Your people notes contain metadata, images, and structured information that creates rich, searchable profiles.
> 
> **3. Efficient Workflows**: Automatic image organization and consistent folder structures eliminate friction while maintaining organization.
> 
> **4. Connected Foundation**: You now understand how to create systematic connections between all elements of your knowledge base.

**The Path to Mastery:**

"But Holmes," Watson interjected with growing confidence, "surely this is still just the foundation? What of the actual investigation methods—templates, advanced search, the mysterious 'graph view' you mentioned?"

Holmes's eyes gleamed with characteristic superiority. "Precisely! In Part 3, we shall deploy the advanced techniques that separate the brilliant from the merely competent:

- **Template mastery** for consistent, efficient documentation
- **The mystical graph view** that reveals hidden patterns in your knowledge
- **Advanced search and tagging** techniques that would make Scotland Yard weep with envy
- **And finally**—we shall begin our first proper investigation: the Case of the Vanishing Venture Capital"

**Your Assignment Before Part 3:**

> [!todo]- Practice Tasks for Mastery
> 1. **Create 3-5 more people notes** using the metadata structure you've learned
> 2. **Practice the DATA organization** by creating a few notes in each folder
> 3. **Experiment with local images**: add photos to your notes and watch them auto-organize
> 4. **Master the folder structure** by moving notes between folders and observing how organization aids discovery
> 5. **Link extensively**: connect your people notes to concepts, projects, or other relevant information

"Watson, superior organization is not about rigid rules, but about creating a system that amplifies rather than constrains your thinking. The architecture you've built today will serve you whether investigating criminal conspiracies or organizing your weekly meal plans."

"Remember, Watson—the difference between a good detective and a great one lies not in natural ability alone, but in the systematic application of superior methods. You now possess the architectural foundation of genius. In Part 3, we shall add the advanced techniques that will make you truly formidable."

---

**Next in Part 3**: *Advanced Investigation* - Templates for consistency, graph visualization for pattern recognition, search mastery, and the opening moves in the Case of the Vanishing Venture Capital!`;export{e as default};
