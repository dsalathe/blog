---
id: 19
title: The Great Obsidian Mystery, Tutorial Part 5
description: Create dynamic intelligence networks with Obsidian Bases and solve the case through systematic application. Watch Holmes and Watson construct adaptive databases and uncover the truth about Sir Reginald.
publishedDate: 2025-10-28
image: sherlockPart5Cropped3.PNG
keywords:
  - Obsidian
  - Intelligence Networks
  - Dynamic Databases
  - Bases
  - Case Resolution
  - Sherlock Holmes
previous: 18
next: 20
---

## Tutorial Overview: Intelligence Networks & Case Resolution

Having mastered visual intelligence and professional presentation in Part 4, you are now ready to create dynamic intelligence networks and apply your complete methodology to solve complex cases. This is Part 5 of our comprehensive six-part series.

### Part 5 (This Tutorial) - Intelligence Networks & Case Resolution:

**Chapter IX**: The Intelligence Network - _Creating dynamic databases that adapt to your investigations_

**Chapter X**: The Final Resolution - _Discovering the truth about Sir Reginald through systematic analysis_

---

## Chapter IX: The Intelligence Network

### Why You Need Dynamic Databases

"Watson," Holmes declared, settling into his chair, "we have mastered case management, but true detective work requires a comprehensive intelligence network. Every person, location, and piece of evidence must be catalogued and instantly accessible."

> [!danger] Why Traditional Lists Fail
> "Consider your typical contact list—a static repository that tells you nothing about relationships, involvement in cases, or patterns. Criminal investigation requires dynamic intelligence that adapts to our analytical needs."

> [!info] The Bases Advantage
> "Fortunately, Obsidian's 'bases' system doesn't just store information—it reveals patterns, enables filtering, provides multiple views of the same data, and automatically updates as new information becomes available."

### Setting Up Your Intelligence Infrastructure

> [!question]- How do I create my Bases workspace?
> 1. **Create Bases Folder**: Right-click `4 Arsenal` > New folder > Name it `bases`
> 2. **Access Base Creation**: Look for the bases icon in the left sidebar
> 3. **Create Your First Base**: Click and drag the base creation tool into your bases folder
> 
> ![Base Creation](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084103.png)

### The Personnel Registry

"We'll create a 'People' base—our complete registry of every individual connected to our investigations."

> [!question]- How do I configure my People Base?
> 1. **Name Your Base**: `People`
> 2. **Set Up Filtering**: Click "Filter" and add the condition `where file tags contains People`
> 
> This ensures your base shows only notes tagged with "People", automatically including all your person notes while excluding unrelated content.
> 
> ![People Base Filter](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922163029.png)

"Already you can see the elegance—every person we've documented appears in a clean, organized list. But the true power lies in multiple presentation formats."

### Visual Intelligence Gallery

> [!question]- How do I create a Gallery View?
> 1. **Add New View**: Click the view creation button
> ![Gallery Configuration](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084313.png)
> 
> 2. **Set View Parameters**:
>    - **Name**: Display
>    - **Layout**: Cards
>    - **Image Source**: Use the `image` property from your person notes
> 
> ![Gallery Settings](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084510.png)

> [!success] The Result
> ![Personnel Gallery](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084531.png)
> 
> "Magnificent! A proper intelligence gallery where every person is immediately recognizable and accessible."

### Dynamic Context Intelligence

"Here's where bases truly shine, Watson—imagine if every case file could automatically display only the people relevant to that specific investigation."

> [!question]- How do I create a Dynamic "In File" View?
> 1. **Copy Existing View**: Duplicate your gallery view
> 2. **Rename**: Call it "In File"  
> 3. **Configure Advanced Filter**: Click "Advanced Filter"
> 
> ![Advanced Filter Setup](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084656.png)
> 
> 4. **Enter Filter Logic**: `this.file.hasLink(file)`

"But Holmes," Watson protested, examining the empty view, "it shows nothing!"

"Patience, my dear fellow. Genius reveals itself to those who wait."

> [!question]- How do I test the Dynamic Intelligence?
> 1. **Open Your Client Interview Note**: Navigate to your meeting note
> 2. **Add Base Embed**: Insert this line: `![[People.base#In File]]`
> 3. **Observe the Magic**: The view automatically populates with people mentioned in that document

Watson typed the addition, and suddenly the magic revealed itself.

> [!tip]- Dynamic Updates in Action
> "Now if you remove Watson from the people attribute, it will automatically render a new view:"
> 
> ![Dynamic Base Result](https://raw.githubusercontent.com/dsalathe/obsidian-tutorial/main/obsidian-tutorial/images/Pasted%20image%2020250922084927.png)
> 
> "Now Watson, if you modify the people mentioned in your notes, the base view automatically updates to reflect only the relevant personnel for this particular meeting."

> [!success] What You've Built
> - **Centralized Intelligence**: Every person appears in master registries
> - **Multiple Perspectives**: Same data as lists, galleries, or filtered views
> - **Dynamic Context**: Automatic filtering based on document content
> - **Visual Recognition**: Gallery views for instant identification
> - **Zero Maintenance**: The system updates itself as you work

---

## Chapter X: The Final Resolution

### The Truth About Sir Reginald

"Watson," Holmes announced, "the time has come to apply our systematic intelligence network to uncover the truth about our supposed client."

Holmes accessed their People base, which now displayed all individuals connected to the case with complete context.

"Observe what our intelligence network reveals about Sir Reginald himself..."

Using the gallery view, Watson could immediately see:
- Sir Reginald's photo and documented meetings
- Marcus Blackwood and the startup founders
- Connection patterns revealed through the graph view

### The Visual Intelligence Breakthrough

"Watson, examine the local graph view for Sir Reginald's profile."

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

"Watson, our internal intelligence system now operates with professional precision. We have:

- **Dynamic Databases**: Intelligence networks adapting to our needs
- **Visual Intelligence**: Pattern recognition through systematic analysis  
- **Professional Documentation**: Evidence-quality organization
- **Case Resolution**: Systematic methodology revealing hidden truths"

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

---

*Continue to [Part 6: External Integration & Advanced Systems] to complete your transformation with web research automation and AI-powered analysis.*