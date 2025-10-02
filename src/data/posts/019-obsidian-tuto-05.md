---
id: 19
title: The Great Obsidian Mystery, Tutorial Part 5
description: Create dynamic intelligence networks with Obsidian Bases and solve the case through systematic application. Watch Holmes and Watson construct adaptive databases and uncover the truth about Sir Reginald.
publishedDate: 2025-10-28
image: sherlockPart5Cropped3.PNG
audience: "Data-Curious Users"
keywords:
  - Obsidian
  - Sherlock Holmes
  - Tutorial
  - Intelligence Networks
  - Dynamic Databases
  - Bases
  - Case Resolution
previous: 18
next: 20
---

> [!note] This tutorial uses Obsidian version v1.9.12

## Tutorial Overview: Intelligence Networks & Case Resolution

Having mastered visual intelligence and professional presentation in Part 4, you are now ready to create dynamic intelligence networks and apply your complete methodology to solve complex cases. This is Part 5 of our comprehensive six-part series.

### Part 5 (This Tutorial) - Intelligence Networks & Case Resolution:

**Chapter X**: The Intelligence Network - _Creating dynamic databases that adapt to your investigations_

**Chapter XI**: The Final Resolution - _Discovering the truth about Sir Reginald through systematic analysis_

---

## Chapter X: The Intelligence Network

### Why You Need Dynamic Databases

"Watson," Holmes declared, settling into his chair, "we have mastered case management, but true detective work requires a comprehensive intelligence network. Every person, location, and piece of evidence must be catalogued and instantly accessible."

> [!danger] Why Traditional Lists Fail
> "Consider your typical contact list—a static repository that tells you nothing about relationships, involvement in cases, or patterns. Criminal investigation requires dynamic intelligence that adapts to our analytical needs."

> [!info] The Bases Advantage
> "Fortunately, Obsidian's 'bases' system doesn't just store information—it reveals patterns, enables filtering, provides multiple views of the same data, and automatically updates as new information becomes available."

### Setting Up Your Intelligence Infrastructure

> [!question]- How do I create my Bases workspace?
> 1. **Create Bases Folder**: Right-click `4 Arsenal` > New folder > Name it `bases`
> 2. **Create Your First Base**: Right Click on your `bases` folder and select `New base`
> 3. **Name You Base**: `People`
> 
> ![Base Creation](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart5ConfigureBases.png)

### The Personnel Registry

"We'll create a 'People' base—our complete registry of every individual connected to our investigations."

> [!question]- How do I configure my People Base?
> 1. **Set Up Filtering**: Click "Filter"
> 2. **Choose The Scope**: Click on `All views`
> 3. **Configure Filter Logic**: Add the condition `where file tags contains People`
> 
> This ensures your base shows only notes tagged with "People", automatically including all your person notes while excluding unrelated content.
> 
> ![People Base Filter](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922163029.png)

"Already you can see the elegance—every person we've documented appears in a clean, organized list. But the true power lies in multiple presentation formats."

### Visual Intelligence Gallery

> [!question]- How do I create a Gallery View?
> 1. **Open View Settings**: Click the `Table` button top-left
> 2. **Add New View**: Click on `+ Add view`
>
> ![Gallery Configuration](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084313.png)
> 
> 3. **Set View Parameters**:
>    - **Name**: Display
>    - **Layout**: Cards
>    - **Image Property**: Use the `image` property from your person notes
> 
> ![Gallery Settings](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084510.png)

> [!success]- The Result
> ![Personnel Gallery](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart5GalleryView.png)
> 
> "Magnificent! A proper intelligence gallery where every person is immediately recognizable and accessible."

### Dynamic Context Intelligence

"Here's where bases truly shine, Watson—imagine if every case file could automatically display only the people relevant to that specific investigation."

> [!question]- How do I create a Dynamic "In File" View?
> 1. **Copy Existing View**: Duplicate your gallery view: Right-click on the `Display` button top-left, click on the three vertical dots and select `Duplicate view`
>
> ![Duplicating a View](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart5DuplicateView.png)
> 2. **Rename**: Call it "In File"
> 3. **Set Up Filtering**: Click "Filter"
> 4. **Choose The Scope**: Click on `This view`
> 5. **Configure Advanced Filter**: Click "Advanced Filter"
> 
> ![Advanced Filter Setup](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084656.png)
> 
> 6. **Enter Filter Logic**: `this.file.hasLink(file)`

"But Holmes," Watson protested, examining the empty view, "it shows nothing!"

"Patience, my dear fellow. Genius reveals itself to those who wait."

> [!question]- How do I test the Dynamic Intelligence?
> 1. **Open The Client Interview Meeting Note**: Use your favorite navigation system (Graph View, Tags, File System or Quick Switcher)
> 2. **Add Base Embed**: Insert this line: `![[People.base#In File]]`
> 3. **Observe the Magic**: The view automatically populates with people mentioned in that document. Try removing or adding people in the `attendees` property

Watson typed the addition, and suddenly the magic revealed itself.

> [!success]- What You've Built
> 
> ![Dynamic View](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart5DynamicView.png)
> 
> - **Centralized Intelligence**: Every person appears in master registries
> - **Multiple Perspectives**: Same data as lists, galleries, or filtered views
> - **Dynamic Context**: Automatic filtering based on document content
> - **Visual Recognition**: Gallery views for instant identification
> - **Zero Maintenance**: The system updates itself as you work

---

"I can see why you love Obsidian so much, Holmes," Watson remarked, studying the dynamic display. "Showing the people cited in each meeting is brilliant. But I only wish we could reverse the perspective—view which meetings mention a specific person!"

"Of course we can, Watson!" Holmes exclaimed. "The system works bidirectionally. Observe:"

### Reverse Intelligence Tracking

> [!question]- How do I create a Meetings Base with Reverse Links?
> 1. **Create New Base**: Right-click your `bases` folder > `New base` > Name it `Meetings`
> 2. **Configure Properties**: Top right, click `Properties` > Select `type`, `case`, and `attendees` > Drag columns to reorder as needed
> 3. **Set Base Filter**: `Filter` > `All views` > Add condition `where file tags contains Meeting`
> 4. **Create Display View**: 
>    - Add new view named `Mentioned in`
>    - Set `row height` to `Tall` (to accommodate attendees lists)
>    - Include the same properties configured earlier
> 5. **Add Time Formula**:
>    - Click `Properties` > `Add Formula`
>    - Display name: `When`
>    - Formula: `date(date).relative()`
> 6. **Configure Reverse Filter**: 
>    - Click `Filter` > `This view` > `Advanced Filter`
>    - Enter logic: `file.hasLink(this.file)`
>    
>    Notice how `this` refers to the current document—the reverse of our People base logic!
> 
> 7. **Test the System**:
>    - Open Sir Reginald's note
>    - Add a new section: `## Meetings`
>    - Insert: `![[Meetings.base#Mentioned in]]`

"Remarkable!" Watson gasped, watching the view populate automatically.

> [!success]- The Bidirectional Intelligence Result
> ![Meeting Reverse View](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart5MeetingBase.png)
> 
> **What You've Achieved:**
> - **Person → Meetings**: See all meetings mentioning a specific individual
> - **Meeting → People**: See all people mentioned in a specific meeting
> - **Automatic Updates**: Both views refresh as you add links
> - **Temporal Context**: The `When` formula shows relative time ("2 days ago", "last week")
> - **Complete Context**: Each meeting shows type, case, and full attendee list

"Now we have complete bidirectional intelligence, Watson. From any person's profile, we see their meeting history. From any meeting, we see all participants. The network reveals itself from every angle."

---

## Chapter XI: The Final Resolution

### The Truth About Sir Reginald

"Watson," Holmes announced, "the time has come to apply our systematic intelligence network to uncover the truth about our supposed client."

Holmes accessed their People base, which now displayed all individuals connected to the case with complete context.

"Our vault is missing Marcus Blackwood, Reginald's Swiss Banker, responsible of his company's account!"

Copy the image below, paste it in any note temporarily and create a new `People` using the appropriate template:

![Marcus Blackwood](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Blackwood.png)

Then add the following information in Blackwood's note:

```markdown
- Markus is [[Reginald Pumpernickel]]'s personal banker.
- Swiss police noticed abnormal activity on the [[Swiss Account 1234]].
```

Finally, add the following information in Reginald's note:

```markdown
- Mr Pumpernickel claims his [[Swiss Account 1234]] has been emptied illegally.
- The fraud was discovered on [[2025-09-08]].
```

"Observe what our intelligence network reveals about Sir Reginald himself..."

Using the gallery view, Watson could immediately see:
- Sir Reginald's photo and documented meetings
- Marcus Blackwood and the startup founders
- Connection patterns revealed through the graph view

### The Visual Intelligence Breakthrough

"Watson, examine the local graph view for Sir Reginald's profile."

> [!tip]- Play With The Local Graph
> 1. Open Reginald's note
> 2. Open the local graph view on the right sidebar.
> 3. In `filters`, change `depth` to 2 and toggle `Neighbor links`
> 4. Observe the triangle between Reginald, Mr Blackwood and the Swiss account.
>
> ![Solving the case](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/ScreenshotResultPart5SolvingCase.png)

> [!warning]+ The Revealing Connection
> The graph showed something extraordinary: the connection revealed a bank account number that appeared in both Sir Reginald's note properties and Marcus Blackwood's contact information—the same account that allegedly received the 'stolen' investment funds.
> 
> Their systematic daily chronicles revealed the timeline discrepancy:
> - Sir Reginald claimed to discover the fraud on September 8th
> - But their meeting notes showed he knew specific details about the company's operations that weren't publicly available
> - Bank records (captured through their evidence templates) showed money flowing TO Sir Reginald, not from him

### The Deductive Resolution

> [!success] The Simple Truth
> "The beauty of systematic intelligence, Watson, is that it reveals truth automatically. Sir Reginald wasn't the victim—he was the mastermind."

- **The Real Operation**: Sir Reginald used us to create legitimate-looking investigation documents
- **The Purpose**: To provide 'evidence' of his own victimhood for insurance fraud
- **The Method**: Hired us thinking we'd produce a cursory report he could manipulate

"Our comprehensive intelligence network documented everything—including connections he thought we'd never discover and patterns he assumed we'd miss."

### Professional Resolution

> [!quote] Confronting the Real Criminal
> In their next meeting with Sir Reginald, Holmes presented the evidence through their professional presentation system:
> 
> "Sir, our intelligence network has revealed some... interesting connections between yourself and Mr. Blackwood. Perhaps you'd care to explain these financial transactions that predate your supposed investment by six months?"

> [!success] Case Closed
> Sir Reginald's confession came quickly when faced with their systematic documentation. The insurance fraud scheme collapsed under the weight of their organized evidence.

### The Systematic Advantage Demonstrated

"Watson, consider what our systematic approach accomplished:

**Comprehensive Intelligence:**
- Automatic pattern recognition across all documented individuals
- Visual connections that revealed the hidden relationship
- Timeline analysis through daily chronicles exposing discrepancies
- Professional documentation that criminal couldn't refute

**The Network Effect:**
- Every case now benefits from accumulated intelligence
- Every new investigation adds to our knowledge base
- Every observation contributes to pattern recognition"

---

## Preparation for External Integration

"In Part 6, we'll connect our systematic approach with external resources—web research automation, AI-powered analysis, and tools that transform our vault into a comprehensive intelligence-gathering system."

---

## Intelligence Network Mastery Achieved

> [!success] Congratulations, Watson
> "You now possess professional intelligence capabilities:
> 
> - **Template Automation**: Consistent documentation
> - **Dynamic Databases**: Adaptive intelligence networks  
> - **Visual Analysis**: Pattern recognition systems
> - **Professional Presentation**: Legal-standard organization
> - **Case Resolution**: Systematic truth discovery"

"You've transformed from amateur note-taker to professional intelligence analyst. Every future case will leverage this infrastructure, and every investigation will benefit from accumulated intelligence patterns."

"The game is afoot—and you're equipped to play it at the master level."
